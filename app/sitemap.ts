import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getPublicProjects } from "@/lib/data/projects";

// Dibuat saat diminta, supaya project yang baru terbit langsung masuk sitemap.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  let projects: Awaited<ReturnType<typeof getPublicProjects>> = [];
  try {
    projects = await getPublicProjects();
  } catch (error) {
    console.error(error);
  }

  return [
    { url: `${site.url}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: `${site.url}/work/${project.slug}`,
      lastModified: new Date(project.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
