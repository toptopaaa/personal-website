import { ContactCta } from "@/components/contact-cta";
import { ExpertiseList } from "@/components/expertise-list";
import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { LatestPosts } from "@/components/latest-posts";
import { Section } from "@/components/section";
import { Testimonials } from "@/components/testimonials";
import { ToolkitList } from "@/components/toolkit-list";
import { WorkCarousel } from "@/components/work-carousel";
import { site } from "@/data/site";
import { getPublicProjects } from "@/lib/data/projects";
import type { Project } from "@/lib/projects/model";

// Halaman publik dibuat ulang paling lambat 60 detik sekali.
export const revalidate = 60;

export default async function HomePage() {
  let projects: Project[] = [];
  try {
    projects = await getPublicProjects();
  } catch (error) {
    // Jika database tidak bisa dihubungi, bagian karya ditampilkan kosong, bukan halaman error.
    console.error(error);
  }

  return (
    <>
      <JsonLd />
      <Hero />
      <WorkCarousel projects={projects} />
      <ExpertiseList />
      <Section id="approach" label="How I work">
        <p className="hero-lead">{site.approach[0]}</p>
        <p className="mt-5">{site.approach[1]}</p>
      </Section>
      <Testimonials />
      <LatestPosts />
      <ToolkitList />
      <ContactCta />
    </>
  );
}
