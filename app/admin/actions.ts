"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth/owner";
import { getOwnerProject } from "@/lib/data/projects";
import { formatJakarta, jakartaInputToIso } from "@/lib/projects/schedule";
import {
  blockStoragePaths,
  normalizeProjectInput,
  publishBlockers,
  type ActionResult,
  type ProjectFormInput,
} from "@/lib/projects/model";
import { getCloudflareBindings } from "@/lib/cloudflare/context";

const MIN_SCHEDULE_LEAD_MS = 60_000;

function revalidateSite(...slugs: Array<string | undefined>) {
  revalidatePath("/");
  revalidatePath("/sitemap.xml");
  for (const slug of slugs) {
    if (slug) revalidatePath(`/work/${slug}`);
  }
}

async function run(task: () => Promise<ActionResult>): Promise<ActionResult> {
  try {
    return await task();
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui." };
  }
}

async function removeStoragePaths(paths: string[]) {
  const unique = [...new Set(paths)];
  if (unique.length === 0) return;
  const { WORK } = await getCloudflareBindings();
  await Promise.all(unique.map((path) => WORK.delete(path)));
}

export async function sendLoginLinkAction(): Promise<ActionResult> {
  return { ok: true, message: "Masuk dikelola oleh Cloudflare Access melalui email One-Time PIN." };
}

export async function signOutAction() {
  await requireOwner();
  const teamDomain = process.env.CF_ACCESS_TEAM_DOMAIN;
  redirect(teamDomain ? `${teamDomain.replace(/\/$/, "")}/cdn-cgi/access/logout` : "/admin/login");
}

export async function createProjectAction() {
  await requireOwner();
  const { DB } = await getCloudflareBindings();
  const id = randomUUID();
  const now = new Date().toISOString();
  await DB.prepare(
    `INSERT INTO projects (id, slug, title, status, created_at, updated_at)
     VALUES (?, ?, '', 'draft', ?, ?)`,
  ).bind(id, `proyek-${id.slice(0, 8)}`, now, now).run();
  redirect(`/admin/projects/${id}`);
}

export async function saveProjectAction(id: string, input: ProjectFormInput): Promise<ActionResult> {
  await requireOwner();
  const parsed = normalizeProjectInput(input, id);
  if (!parsed.ok) return { ok: false, error: parsed.error };

  return run(async () => {
    const old = await getOwnerProject(id);
    if (!old) return { ok: false, error: "Project tidak ditemukan." };
    const { DB } = await getCloudflareBindings();
    const { coverAlt, ...fields } = parsed.value;
    await DB.prepare(
      `UPDATE projects SET slug=?, title=?, client=?, year=?, category=?, role=?, summary=?,
       deliverables=?, process=?, result=?, blocks=?, cover_alt=?, updated_at=? WHERE id=?`,
    ).bind(
      fields.slug, fields.title, fields.client, fields.year, fields.category, fields.role, fields.summary,
      JSON.stringify(fields.deliverables), JSON.stringify(fields.process), fields.result,
      JSON.stringify(fields.blocks), coverAlt, new Date().toISOString(), id,
    ).run();

    const kept = new Set(blockStoragePaths(parsed.value.blocks));
    const removed = blockStoragePaths(old.blocks).filter((path) => !kept.has(path));
    await removeStoragePaths(removed);
    revalidateSite(old.slug, parsed.value.slug);
    return { ok: true, message: "Perubahan tersimpan." };
  });
}

export async function setProjectStatusAction(
  id: string,
  mode: "draft" | "publish" | "schedule",
  scheduledLocal?: string,
): Promise<ActionResult> {
  await requireOwner();
  return run(async () => {
    const project = await getOwnerProject(id);
    if (!project) return { ok: false, error: "Project tidak ditemukan." };

    let status: "draft" | "published" | "scheduled" = "draft";
    let publishAt: string | null = null;
    if (mode !== "draft") {
      const blockers = publishBlockers(project);
      if (blockers.length > 0) return { ok: false, error: blockers.join(" ") };
      if (mode === "publish") status = "published";
      else {
        publishAt = scheduledLocal ? jakartaInputToIso(scheduledLocal) : null;
        if (!publishAt) return { ok: false, error: "Pilih tanggal dan jam jadwal terbit." };
        if (new Date(publishAt).getTime() < Date.now() + MIN_SCHEDULE_LEAD_MS) {
          return { ok: false, error: "Waktu jadwal harus minimal satu menit dari sekarang." };
        }
        status = "scheduled";
      }
    }

    const { DB } = await getCloudflareBindings();
    await DB.prepare(
      "UPDATE projects SET status=?, publish_at=?, updated_at=? WHERE id=?",
    ).bind(status, publishAt, new Date().toISOString(), id).run();
    revalidateSite(project.slug);
    return {
      ok: true,
      message: mode === "draft"
        ? "Dikembalikan menjadi draf. Tidak terlihat publik."
        : mode === "publish"
          ? "Project sudah terbit."
          : `Akan terbit otomatis pada ${formatJakarta(publishAt!)}.`,
    };
  });
}

export async function setCoverAction(
  id: string,
  cover: { path: string; url: string; width: number; height: number },
): Promise<ActionResult> {
  await requireOwner();
  if (!new RegExp(`^${id}/[A-Za-z0-9_-]+\\.webp$`).test(cover.path) || cover.path.includes("..")) {
    return { ok: false, error: "Lokasi file cover tidak valid." };
  }
  try {
    if (new URL(cover.url).protocol !== "https:") return { ok: false, error: "Alamat cover harus menggunakan HTTPS." };
  } catch {
    return { ok: false, error: "Alamat cover tidak valid." };
  }
  if (![cover.width, cover.height].every((value) => Number.isInteger(value) && value > 0 && value <= 10000)) {
    return { ok: false, error: "Ukuran gambar tidak valid." };
  }
  return run(async () => {
    const project = await getOwnerProject(id);
    if (!project) return { ok: false, error: "Project tidak ditemukan." };
    const { DB } = await getCloudflareBindings();
    await DB.prepare(
      `UPDATE projects SET cover_path=?, cover_url=?, cover_width=?, cover_height=?, updated_at=? WHERE id=?`,
    ).bind(cover.path, cover.url, cover.width, cover.height, new Date().toISOString(), id).run();
    if (project.coverPath && project.coverPath !== cover.path) await removeStoragePaths([project.coverPath]);
    revalidateSite(project.slug);
    return { ok: true, message: "Cover diperbarui." };
  });
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  await requireOwner();
  const result = await run(async () => {
    const project = await getOwnerProject(id);
    if (!project) return { ok: false, error: "Project tidak ditemukan." };
    const paths = [...blockStoragePaths(project.blocks), ...(project.coverPath ? [project.coverPath] : [])];
    const { DB } = await getCloudflareBindings();
    await DB.prepare("DELETE FROM projects WHERE id=?").bind(id).run();
    await removeStoragePaths(paths);
    revalidateSite(project.slug);
    return { ok: true, message: "Project dihapus." };
  });
  if (!result.ok) return result;
  redirect("/admin");
}
