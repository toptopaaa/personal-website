import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { hasOwnerSession } from "@/lib/auth/owner";
import { getCloudflareBindings } from "@/lib/cloudflare/context";

export const dynamic = "force-dynamic";
const MAX_BYTES = 4 * 1024 * 1024;
const PROJECT_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function hasWebpSignature(file: File): Promise<boolean> {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  return bytes.length === 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
}

export async function POST(request: Request) {
  if (!(await hasOwnerSession())) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    const projectId = form.get("projectId");
    const width = Number(form.get("width"));
    const height = Number(form.get("height"));
    if (!(file instanceof File) || file.type !== "image/webp" || file.size < 12 || file.size > MAX_BYTES ||
      !(await hasWebpSignature(file))) {
      return NextResponse.json({ error: "Berkas harus berupa WebP dan ukurannya maksimal 4 MB." }, { status: 400 });
    }
    if (typeof projectId !== "string" || !PROJECT_ID.test(projectId)) {
      return NextResponse.json({ error: "ID project tidak valid." }, { status: 400 });
    }
    if (![width, height].every((value) => Number.isInteger(value) && value > 0 && value <= 2000)) {
      return NextResponse.json({ error: "Ukuran gambar tidak valid." }, { status: 400 });
    }

    const { DB, WORK } = await getCloudflareBindings();
    const project = await DB.prepare("SELECT id FROM projects WHERE id=? LIMIT 1").bind(projectId).first();
    if (!project) return NextResponse.json({ error: "Project tidak ditemukan." }, { status: 404 });

    const path = `${projectId}/${Date.now()}-${randomUUID()}.webp`;
    await WORK.put(path, await file.arrayBuffer(), {
      httpMetadata: { contentType: "image/webp", cacheControl: "public, max-age=31536000, immutable" },
    });
    const publicBase = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "");
    if (!publicBase) throw new Error("R2_PUBLIC_BASE_URL belum dikonfigurasi.");
    return NextResponse.json({ path, url: `${publicBase}/${path}`, width, height, alt: "" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan saat mengunggah gambar.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
