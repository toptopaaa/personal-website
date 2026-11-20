"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { Project } from "@/lib/projects/model";

type WorkCarouselProps = {
  projects: readonly Project[];
};

export function WorkCarousel({ projects }: WorkCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const trackId = useId();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const syncButtons = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    setCanScrollPrev(track.scrollLeft > 1);
    setCanScrollNext(track.scrollLeft < maxScroll - 1);
  }, []);

  // Passive scroll listener, throttled to one update per animation frame.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const schedule = () => {
      if (frame !== 0) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        syncButtons();
      });
    };

    schedule();
    track.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      track.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [syncButtons, projects.length]);

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;

    const slides = track.querySelectorAll<HTMLElement>("[data-slide]");
    const first = slides[0];
    const second = slides[1];
    if (!first) return;

    // Step = one card width plus the gap, measured from the DOM.
    const step = second
      ? second.getBoundingClientRect().left - first.getBoundingClientRect().left
      : first.getBoundingClientRect().width;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: direction * step, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByCard(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByCard(-1);
    }
  }

  if (projects.length === 0) {
    return (
      <section id="work" aria-labelledby="work-heading" className="py-16 lg:py-24">
        <div className="mx-auto mb-6 w-full max-w-[600px] px-5 sm:px-6">
          <h2 id="work-heading" className="text-sm text-muted">
            Selected work
          </h2>
        </div>
        <p className="mx-auto w-full max-w-[600px] px-5 text-muted sm:px-6">
          Karya akan segera ditampilkan.
        </p>
      </section>
    );
  }

  return (
    <section id="work" aria-labelledby="work-heading" className="py-16 lg:py-24">
      <div className="mx-auto mb-6 flex w-full max-w-[600px] items-center justify-between gap-4 px-5 sm:px-6">
        <h2 id="work-heading" className="text-sm text-muted">
          Selected work
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous project"
            aria-controls={trackId}
            disabled={!canScrollPrev}
            onClick={() => scrollByCard(-1)}
            className="inline-flex size-11 items-center justify-center rounded-full border border-line transition-opacity disabled:cursor-default disabled:opacity-40 sm:size-10"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next project"
            aria-controls={trackId}
            disabled={!canScrollNext}
            onClick={() => scrollByCard(1)}
            className="inline-flex size-11 items-center justify-center rounded-full border border-line transition-opacity disabled:cursor-default disabled:opacity-40 sm:size-10"
          >
            <ChevronRight aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>

      <div
        id={trackId}
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Selected work projects"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="work-track no-scrollbar -mb-8 overflow-x-auto pt-1 pb-8"
      >
        <div className="flex w-max gap-4 lg:gap-5">
          {projects.map((project, index) => (
            <div
              key={project.slug}
              data-slide
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${projects.length}`}
              className="w-[82vw] shrink-0 snap-start sm:w-[60vw] lg:w-[560px]"
            >
              <Link
                href={`/work/${project.slug}`}
                prefetch={false}
                aria-label={`${project.title} ${project.category} · ${project.year}`}
                className="work-card block"
              >
                <div className="work-card-media relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface-2 shadow-[var(--shadow-card)]">
                  {project.coverUrl && (
                    <Image
                      src={project.coverUrl}
                      alt={project.coverAlt}
                      fill
                      sizes="(min-width: 1024px) 560px, (min-width: 640px) 60vw, 82vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <p className="mt-4 text-base font-medium">{project.title}</p>
                <p className="mt-1 text-sm text-muted sm:text-[13px]">
                  {project.category} · {project.year}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
