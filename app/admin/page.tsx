import Image from "next/image";
import Link from "next/link";
import { createProjectAction, signOutAction } from "@/app/admin/actions";
import { StatusPill } from "@/components/admin/status-pill";
import { getOwnerProjects } from "@/lib/data/projects";
import { requireOwner } from "@/lib/auth/owner";
import { statusView } from "@/lib/projects/schedule";

// Halaman admin selalu dirender saat diminta. Datanya milik pemilik, jadi tidak boleh
// dibuat atau di-cache saat build. Tanpa baris ini, build bisa gagal jika env backend belum terpasang.
export const dynamic = "force-dynamic";

export default async function AdminHome() {
  await requireOwner();
  const projects = await getOwnerProjects();
  const now = new Date();

  return (
    <div className="mx-auto w-full max-w-[600px] px-5 pt-8 pb-16 sm:px-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted">Admin</p>
          <h1 className="name-heading">Karya saya</h1>
        </div>
        <form action={signOutAction}>
          <button type="submit" className="inline-flex min-h-11 items-center px-3 text-sm text-muted hover:text-foreground">
            Keluar
          </button>
        </form>
      </header>

      <form action={createProjectAction} className="mt-8">
        <button
          type="submit"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-85"
        >
          + Project baru
        </button>
      </form>

      <ul role="list" className="mt-8 divide-y divide-line border-y border-line">
        {projects.length === 0 && <li className="py-10 text-center text-muted">Belum ada project.</li>}
        {projects.map((project) => (
          <li key={project.id}>
            <Link href={`/admin/projects/${project.id}`} className="flex items-center gap-4 py-4 transition-colors hover:bg-surface-2">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-line bg-surface-2">
                {project.coverUrl && (
                  <Image src={project.coverUrl} alt="" fill sizes="64px" className="object-cover" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{project.title || "Tanpa judul"}</p>
                <p className="mt-1">
                  <StatusPill view={statusView(project, now)} />
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
