export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

// TODO: all four entries are placeholders. Replace them with real, approved client quotes.
// Do not write realistic-sounding quotes. Keep the TODO text until real ones exist.
export const testimonials = [
  { quote: "[TODO: client quote]", author: "[TODO: client name]", role: "[TODO: role, company]" },
  { quote: "[TODO: client quote]", author: "[TODO: client name]", role: "[TODO: role, company]" },
  { quote: "[TODO: client quote]", author: "[TODO: client name]", role: "[TODO: role, company]" },
  { quote: "[TODO: client quote]", author: "[TODO: client name]", role: "[TODO: role, company]" },
] satisfies readonly Testimonial[];
