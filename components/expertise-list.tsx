import { Section } from "@/components/section";
import { expertise } from "@/data/expertise";

export function ExpertiseList() {
  return (
    <Section id="services" label="Core expertise">
      <ol className="grid border-t border-line sm:grid-cols-2 sm:gap-x-10">
        {expertise.map((item, index) => (
          <li
            key={item.title}
            className="flex items-baseline gap-4 border-b border-line py-4 sm:py-5"
          >
            <span className="w-6 shrink-0 font-mono text-sm tracking-[0.08em] text-muted uppercase sm:text-xs">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-base sm:text-lg">{item.title}</span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
