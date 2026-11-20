import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="overflow-x-clip focus:outline-none">
        <section className="mx-auto flex min-h-[60dvh] w-full max-w-[600px] flex-col items-start justify-center px-5 py-24 sm:px-6">
          <p className="font-mono text-sm text-muted uppercase sm:text-xs">404</p>
          <h1 className="mt-3 name-heading">Page not found</h1>
          <p className="mt-4 text-muted">The page you are looking for does not exist or has moved.</p>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-11 items-center underline decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
          >
            Back to home
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
