import Link from "next/link";
import { site } from "@/data/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-auto w-full max-w-[600px] px-5 pt-16 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6">
      <div className="flex items-center justify-between gap-4 border-t border-line pt-6 text-sm text-muted">
        <p>
          © {year} {site.name}
        </p>
        <Link
          href="/#top"
          className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-4 transition-colors hover:text-foreground hover:decoration-accent"
        >
          Back to top ↑
        </Link>
      </div>
    </footer>
  );
}
