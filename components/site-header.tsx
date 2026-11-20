import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

// Items marked essential stay visible below 640px. The rest appear from 640px up.
const navItems = [
  { href: "/#work", label: "Work", essential: true },
  { href: "/#services", label: "Services", essential: false },
  { href: "/#toolkit", label: "Toolkit", essential: false },
  { href: "/#contact", label: "Contact", essential: true },
] as const;

export function SiteHeader() {
  return (
    <header className="pt-[max(1.25rem,env(safe-area-inset-top))]">
      <div className="mx-auto flex w-full max-w-[600px] items-center justify-between px-5 sm:px-6">
        <Link
          href="/"
          aria-label={`${site.initials}, ${site.name} home`}
          className="-ml-1.5 inline-flex size-11 items-center justify-center"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-[11px] font-semibold text-background">
            {site.initials}
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <nav aria-label="Primary">
            <ul className="flex items-center">
              {navItems.map((item) => (
                <li key={item.href} className={cn(!item.essential && "hidden sm:block")}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center px-2.5 text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
