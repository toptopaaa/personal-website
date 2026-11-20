import Image from "next/image";
import { Fragment } from "react";
import { site, socialLinks } from "@/data/site";
import { listSeparator } from "@/lib/format";

export function Hero() {
  return (
    <section
      id="top"
      className="mx-auto w-full max-w-[600px] px-5 pt-[72px] sm:px-6 lg:pt-[120px]"
    >
      <div className="flex items-center gap-4">
        <Image
          src="/images/avatar.webp"
          alt={`${site.name} portrait`}
          width={56}
          height={56}
          priority
          sizes="56px"
          className="size-12 shrink-0 rounded-[14px] object-cover sm:size-14"
        />
        <div>
          <h1 className="text-base font-semibold tracking-[-0.01em] sm:name-heading">
            {site.name}
          </h1>
          <p className="mt-0.5 text-sm text-muted">
            {site.roleLine} · {site.location}, Indonesia
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {site.hero.map((paragraph) => (
          <p key={paragraph} className="hero-lead">
            {paragraph}
          </p>
        ))}
      </div>

      <p className="mt-6">
        {socialLinks.length > 0 ? (
          <>
            You can find me on{" "}
            {socialLinks.map((link, index) => (
              <Fragment key={link.key}>
                {listSeparator(index, socialLinks.length)}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  {link.label}
                </a>
              </Fragment>
            ))}
            , or reach me by{" "}
            <a
              href={`mailto:${site.email}`}
              className="underline decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
            >
              email
            </a>
            .
          </>
        ) : (
          <>
            You can reach me by{" "}
            <a
              href={`mailto:${site.email}`}
              className="underline decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
            >
              email
            </a>
            .
          </>
        )}
      </p>
    </section>
  );
}
