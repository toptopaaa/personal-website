"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, type PointerEvent } from "react";
import { testimonials } from "@/data/testimonials";
import { cn } from "@/lib/utils";

const SWIPE_THRESHOLD_PX = 40;
const QUOTES_ID = "testimonial-quotes";

export function Testimonials() {
  const [active, setActive] = useState(0);
  const startX = useRef<number | null>(null);
  const total = testimonials.length;

  function step(direction: 1 | -1) {
    setActive((current) => (current + direction + total) % total);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    startX.current = event.clientX;
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (startX.current === null) return;
    const delta = event.clientX - startX.current;
    startX.current = null;
    if (Math.abs(delta) >= SWIPE_THRESHOLD_PX) {
      step(delta < 0 ? 1 : -1);
    }
  }

  function handlePointerCancel() {
    startX.current = null;
  }

  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[600px] px-5 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 id="testimonials-heading" className="text-sm text-muted">
            Kind words
          </h2>
          <div className="flex items-center gap-3">
            <span
              aria-live="polite"
              className="font-mono text-sm text-muted tabular-nums sm:text-xs sm:tracking-[0.08em]"
            >
              {active + 1} / {total}
            </span>
            <button
              type="button"
              aria-label="Previous testimonial"
              aria-controls={QUOTES_ID}
              onClick={() => step(-1)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-line sm:size-10"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              aria-controls={QUOTES_ID}
              onClick={() => step(1)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-line sm:size-10"
            >
              <ChevronRight aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>

        {/* All quotes share one grid cell so the height never shifts. Swipe threshold: 40px. */}
        <div
          id={QUOTES_ID}
          aria-live="polite"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          className="grid touch-pan-y"
        >
          {testimonials.map((item, index) => {
            const isActive = index === active;
            return (
              <figure
                key={index}
                className={cn(
                  "col-start-1 row-start-1 transition-opacity duration-300 ease-out",
                  isActive ? "opacity-100" : "invisible opacity-0",
                )}
              >
                <blockquote className="quote-text">{item.quote}</blockquote>
                <figcaption className="mt-6">
                  <p className="font-semibold">{item.author}</p>
                  <p className="mt-1 text-sm text-muted">{item.role}</p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
