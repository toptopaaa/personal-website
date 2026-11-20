import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkArticle } from "@/components/work/work-article";
import { getPublicProjectBySlug, getPublicProjects } from "@/lib/data/projects";

export const revalidate = 60;

type WorkPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) {
    return { title: "Page not found" };
  }

  const cover = project.coverUrl
    ? [{ url: project.coverUrl, width: project.coverWidth, height: project.coverHeight, alt: project.coverAlt }]
    : undefined;

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `/work/${project.slug}`,
      images: cover,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images: project.coverUrl ? [project.coverUrl] : undefined,
    },
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  const all = await getPublicProjects();
  const index = all.findIndex((item) => item.slug === project.slug);
  const next = all.length > 1 ? all[(index + 1) % all.length] ?? null : null;

  return (
    <WorkArticle project={project} backHref="/#work" backLabel="← All work" next={next} />
  );
}
