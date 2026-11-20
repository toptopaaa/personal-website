import { notFound } from "next/navigation";
import { ProjectEditor } from "@/components/admin/editor/project-editor";
import { getOwnerProject } from "@/lib/data/projects";
import { requireOwner } from "@/lib/auth/owner";

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
};

// Halaman admin selalu dirender saat diminta. Datanya milik pemilik, jadi tidak boleh
// dibuat atau di-cache saat build. Tanpa baris ini, build bisa gagal jika env backend belum terpasang.
export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  await requireOwner();
  const { id } = await params;
  const project = await getOwnerProject(id);
  if (!project) notFound();

  return <ProjectEditor project={project} />;
}
