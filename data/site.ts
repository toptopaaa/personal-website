// Personal details and bio copy. Values come from the owner's CV unless marked TODO.
// Edit this file to change contact details or copy. Components never hardcode them.

export type SocialKey = "instagram" | "behance" | "dribbble" | "pinterest";

export type SocialLink = {
  key: SocialKey;
  label: string;
  url: string;
};

const socialUrls = {
  // TODO: add the Instagram URL. Leave it empty to hide Instagram everywhere, including the Latest posts section.
  instagram: "",
  behance: "https://www.behance.net/toptopaaa",
  dribbble: "https://dribbble.com/toptopaaa",
  pinterest: "https://id.pinterest.com/toptopaaaid/",
} satisfies Record<SocialKey, string>;

const socialLabels = {
  instagram: "Instagram",
  behance: "Behance",
  dribbble: "Dribbble",
  pinterest: "Pinterest",
} satisfies Record<SocialKey, string>;

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export const site = {
  name: "Moh. Nurul Mustofa",
  initials: "MNM",
  roleLine: "Graphic Designer & Visual Content Creator",
  // TODO: the CV does not list a city. Replace [CITY] with the owner's city.
  location: "[CITY]",
  url: siteUrl,
  email: "toptopaaa.id@gmail.com",
  // International format, without the + sign.
  whatsapp: "6285704794786",
  latestPostsUrl: socialUrls.instagram,
  seo: {
    title: "Moh. Nurul Mustofa — Graphic Designer & Visual Content Creator",
    description:
      "Graphic Designer and Visual Content Creator specializing in brand identity, logo design, social media design, and digital visual communication for growing brands.",
  },
  hero: [
    "I'm a Graphic Designer and Visual Content Creator specializing in brand identity, logo design, social media design, and digital visual communication.",
    "I help startups, entrepreneurs, small businesses, and growing brands transform their ideas into distinctive visual experiences that communicate value, establish credibility, and create lasting brand recognition.",
  ],
  approach: [
    "My approach combines creative thinking, strategic visual communication, and practical design execution. I believe effective design goes beyond aesthetics — it should serve a purpose, connect with the right audience, and support business objectives.",
    "I'm passionate about collaborating with businesses, creative agencies, entrepreneurs, and international clients to develop thoughtful visual solutions that make brands more recognizable and communication more effective.",
  ],
  contactHeading: "Let's connect and create meaningful visual experiences.",
} as const;

// Only socials with a URL are rendered. Order here is the order on the page.
export const socialLinks: SocialLink[] = (Object.keys(socialUrls) as SocialKey[])
  .filter((key) => socialUrls[key] !== "")
  .map((key) => ({ key, label: socialLabels[key], url: socialUrls[key] }));
