import { site, socialLinks } from "@/data/site";

export function ContactCta() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-16 lg:py-24">
      <div className="mx-auto w-full max-w-[600px] px-5 sm:px-6">
        <h2 id="contact-heading" className="contact-heading">
          {site.contactHeading}
        </h2>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={`mailto:${site.email}?subject=Project%20Inquiry`}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-85 sm:w-auto"
          >
            Email me
          </a>
          <a
            href={`https://wa.me/${site.whatsapp}?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20project`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-foreground px-6 text-sm font-medium transition-colors hover:bg-surface-2 sm:w-auto"
          >
            WhatsApp
          </a>
        </div>

        {socialLinks.length > 0 && (
          <ul role="list" className="mt-8 flex flex-wrap items-center text-sm text-muted">
            {socialLinks.map((link, index) => (
              <li key={link.key} className="inline-flex items-center">
                {index > 0 && (
                  <span aria-hidden="true" className="px-2">
                    ·
                  </span>
                )}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-4 transition-colors hover:text-foreground hover:decoration-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
