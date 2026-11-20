import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects/model";
import { WorkBlocks } from "@/components/work/work-blocks";

type WorkArticleProps = {
  project: Project;
  backHref: string;
  backLabel: string;
  next?: Project | null;
};

// Isi halaman case study. Dipakai di halaman publik dan pratinjau admin.
export function WorkArticle({ project, backHref, backLabel, next }: WorkArticleProps) {
  const showNext = next && next.slug !== project.slug;

  return (
    <article className="mx-auto w-full max-w-[600px] px-5 pt-[72px] pb-16 sm:px-6 lg:pt-[120px] lg:pb-24">
      <Link
        href={backHref}
        className="inline-flex min-h-11 items-center text-sm text-muted transition-colors hover:text-foreground"
      >
        {backLabel}
      </Link>

      <h1 className="mt-4 name-heading">{project.title}</h1>

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-line py-6 text-sm">
        <div>
          <dt className="text-muted">Client</dt>
          <dd className="mt-1">{project.client || "—"}</dd>
        </div>
        <div>
          <dt className="text-muted">Year</dt>
          <dd className="mt-1">{project.year || "—"}</dd>
        </div>
        <div>
          <dt className="text-muted">Category</dt>
          <dd className="mt-1">{project.category || "—"}</dd>
        </div>
        <div>
          <dt className="text-muted">My role</dt>
          <dd className="mt-1">{project.role || "—"}</dd>
        </div>
      </dl>

      {project.coverUrl && (
        <figure className="case-cover mt-10">
          <Image
            src={project.coverUrl}
            alt={project.coverAlt}
            width={project.coverWidth}
            height={project.coverHeight}
            sizes="(min-width: 1200px) 1200px, 100vw"
            className="h-auto w-full rounded-2xl border border-line"
          />
        </figure>
      )}

      {project.summary && (
        <section aria-labelledby="overview-heading" className="mt-12">
          <h2 id="overview-heading" className="text-sm text-muted">
            Overview
          </h2>
          <p className="mt-3">{project.summary}</p>
        </section>
      )}

      {project.deliverables.length > 0 && (
        <section aria-labelledby="deliverables-heading" className="mt-10">
          <h2 id="deliverables-heading" className="text-sm text-muted">
            Deliverables
          </h2>
          <ul role="list" className="mt-3 border-t border-line">
            {project.deliverables.map((item) => (
              <li key={item} className="border-b border-line py-3">
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      <WorkBlocks blocks={project.blocks} projectTitle={project.title} />

      {project.process.length > 0 && (
        <section aria-labelledby="process-heading" className="mt-10">
          <h2 id="process-heading" className="text-sm text-muted">
            Process
          </h2>
          <ol role="list" className="mt-4 space-y-6">
            {project.process.slice(0, 3).map((step, index) => (
              <li key={`${index}-${step.title}`} className="flex gap-4">
                <span className="w-6 shrink-0 pt-1 font-mono text-sm text-muted uppercase sm:text-xs">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-medium">{step.title}</h3>
                  <p className="mt-1 text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {project.result && (
        <section aria-labelledby="result-heading" className="mt-10">
          <h2 id="result-heading" className="text-sm text-muted">
            Result
          </h2>
          <p className="mt-3">{project.result}</p>
        </section>
      )}

      {showNext && next && (
        <section aria-labelledby="next-heading" className="mt-16">
          <h2 id="next-heading" className="text-sm text-muted">
            Next project
          </h2>
          <Link
            href={`/work/${next.slug}`}
            className="mt-4 block rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] transition-colors hover:bg-surface-2"
          >
            <p className="text-base font-medium">{next.title}</p>
            <p className="mt-1 text-sm text-muted">
              {next.category} · {next.year}
            </p>
          </Link>
        </section>
      )}
    </article>
  );
}
