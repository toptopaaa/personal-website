import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  label: string;
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function Section({ id, label, actions, className, children }: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className={cn("py-16 lg:py-24", className)}>
      <div className="mx-auto w-full max-w-[600px] px-5 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 id={headingId} className="text-sm text-muted">
            {label}
          </h2>
          {actions}
        </div>
        {children}
      </div>
    </section>
  );
}
