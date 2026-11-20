import type { ReactNode } from "react";

export const inputClass =
  "mt-2 w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-foreground placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none";

export const primaryButtonClass =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-50";

export const outlineButtonClass =
  "inline-flex min-h-12 items-center justify-center rounded-full border border-line px-6 text-sm font-medium transition-colors hover:bg-surface-2 disabled:opacity-50";

export const smallButtonClass =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-line px-4 text-sm font-medium transition-colors hover:bg-surface-2 disabled:opacity-40";

export function FormGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10 space-y-5">
      <h2 className="text-sm text-muted">{title}</h2>
      {children}
    </section>
  );
}

export function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="mt-2 text-sm text-muted">{hint}</p>}
    </div>
  );
}
