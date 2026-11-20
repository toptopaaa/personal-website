// Icons are neutral Lucide stand-ins, not brand logos. To use official SVG logos,
// place them in /public/tools and extend ToolkitItem with a logo path.
export type ToolIcon =
  | "layout"
  | "pen"
  | "image"
  | "shapes"
  | "brush"
  | "video"
  | "layers"
  | "sparkles";

export type ToolkitItem = {
  name: string;
  icon: ToolIcon;
};

// Adobe, Canva, CorelDRAW, Figma, Ibis Paint X, CapCut, Affinity, and AI tools per the CV and bio.
// TODO: remove Figma and AI-Powered Creative Tools if they are not used. They appear in the bio but not the CV.
export const toolkit = [
  { name: "Canva", icon: "layout" },
  { name: "CorelDRAW", icon: "pen" },
  { name: "Adobe Photoshop", icon: "image" },
  { name: "Figma", icon: "shapes" },
  { name: "Ibis Paint X", icon: "brush" },
  { name: "CapCut", icon: "video" },
  { name: "Affinity", icon: "layers" },
  { name: "AI-Powered Creative Tools", icon: "sparkles" },
] satisfies readonly ToolkitItem[];
