import type { StatusView } from "@/lib/projects/schedule";
import { cn } from "@/lib/utils";

export function StatusPill({ view }: { view: StatusView }) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center rounded-full px-3 py-1 text-xs font-medium",
        view.tone === "live" && "bg-foreground text-background",
        view.tone === "scheduled" && "border border-line text-foreground",
        view.tone === "draft" && "border border-line text-muted",
      )}
    >
      <span className="truncate">{view.label}</span>
    </span>
  );
}
