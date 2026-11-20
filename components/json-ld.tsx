import { expertise } from "@/data/expertise";
import { site, socialLinks } from "@/data/site";

// Rendered server-side. Escapes "<" so the JSON can never close the script tag early.
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: "Graphic Designer",
    description: site.seo.description,
    url: site.url,
    image: `${site.url}/images/avatar.webp`,
    sameAs: socialLinks.map((link) => link.url),
    knowsAbout: expertise.map((item) => item.title),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
