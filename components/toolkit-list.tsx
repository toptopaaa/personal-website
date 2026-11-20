import {
  Brush,
  Clapperboard,
  Image as ImageIcon,
  Layers,
  LayoutTemplate,
  PenTool,
  Shapes,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Section } from "@/components/section";
import { toolkit, type ToolIcon } from "@/data/toolkit";

const icons: Record<ToolIcon, LucideIcon> = {
  layout: LayoutTemplate,
  pen: PenTool,
  image: ImageIcon,
  shapes: Shapes,
  brush: Brush,
  video: Clapperboard,
  layers: Layers,
  sparkles: Sparkles,
};

export function ToolkitList() {
  return (
    <Section id="toolkit" label="Design toolkit">
      <ul role="list" className="flex flex-wrap gap-x-5 gap-y-3">
        {toolkit.map((tool) => {
          const Icon = icons[tool.icon];
          return (
            <li key={tool.name} className="inline-flex items-center gap-2 text-sm text-muted sm:text-base">
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              {tool.name}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
