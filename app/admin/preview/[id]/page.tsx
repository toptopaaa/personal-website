import Link from "next/link";
import { notFound } from "next/navigation";
import { WorkArticle } from "@/components/work/work-article";
import { getOwnerProject } from "@/lib/data/projects";
import { requireOwner } from "@/lib/auth/owner";
import { statusView } from "@/lib/projects/schedule";

type PreviewPageProps = {
  params: Promise<{ id: string }>;
};

// Halaman admin selalu dirender saat diminta. Datanya milik pemilik, jadi tidak boleh
// dibuat atau di-cache saat build. Tanpa baris ini, build bisa gagal jika env backend belum terpasang.
export const dynamic = "force-dynamic";

export default async function PreviewPage({ params }: PreviewPageProps) {
  await requireOwner();
  const { id } = await params;
  const project = await getOwnerProject(id);
  if (!project) notFound();

  const view = statusView(project, new Date());

  return (
    <>
      <div className="sticky top-0 z-10 border-b border-line bg-background/95 px-5 py-3 text-sm backdrop-blur">
        <div className="mx-auto flex w-full max-w-[600px] items-center justify-between gap-3">
          <p className="min-w-0 truncate">
            Pratinjau · {view.label}. Hanya kamu yang bisa melihat ini.
          </p>
          <Link href={`/admin/projects/${id}`} className="shrink-0 underline decoration-1 underline-offset-4">
            Editor
          </Link>
        </div>
      </div>
      <WorkArticle project={project} backHref={`/admin/projects/${id}`} backLabel="← Kembali ke editor" />
    </>
  );
}
