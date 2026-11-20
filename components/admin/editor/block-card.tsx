import Image from "next/image";
import { inputClass, smallButtonClass } from "@/components/admin/editor/form-fields";
import { LIMITS, type Block, type ImageAsset } from "@/lib/projects/model";

const TYPE_LABEL: Record<Block["type"], string> = {
  image: "Gambar",
  grid: "Grid foto",
  text: "Teks",
};

type BlockCardProps = {
  block: Block;
  index: number;
  count: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  onChange: (block: Block) => void;
};

export function BlockCard({ block, index, count, onMove, onRemove, onChange }: BlockCardProps) {
  return (
    <article className="rounded-2xl border border-line p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-xs text-muted uppercase tracking-[0.08em]">
          {index + 1}. {TYPE_LABEL[block.type]}
        </p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onMove(-1)} disabled={index === 0} className={smallButtonClass} aria-label={`Naikkan blok ${index + 1}`}>
            Naik
          </button>
          <button type="button" onClick={() => onMove(1)} disabled={index === count - 1} className={smallButtonClass} aria-label={`Turunkan blok ${index + 1}`}>
            Turun
          </button>
          <button type="button" onClick={onRemove} className={`${smallButtonClass} text-red-600`} aria-label={`Hapus blok ${index + 1}`}>
            Hapus
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {block.type === "text" && (
          <div>
            <label htmlFor={`text-${block.id}`} className="sr-only">
              Isi teks
            </label>
            <textarea
              id={`text-${block.id}`}
              rows={4}
              maxLength={LIMITS.text}
              value={block.text}
              placeholder="Tulis paragraf. Pisahkan paragraf dengan baris kosong."
              onChange={(event) => onChange({ ...block, text: event.target.value })}
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-foreground placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none"
            />
          </div>
        )}

        {block.type === "image" && (
          <>
            <Preview asset={block.asset} />
            <AltField
              id={`alt-${block.id}`}
              value={block.asset.alt}
              onChange={(value) => onChange({ ...block, asset: { ...block.asset, alt: value } })}
            />
            <div>
              <label htmlFor={`caption-${block.id}`} className="block text-sm font-medium">
                Keterangan (opsional)
              </label>
              <textarea
                id={`caption-${block.id}`}
                rows={2}
                maxLength={LIMITS.caption}
                value={block.caption}
                onChange={(event) => onChange({ ...block, caption: event.target.value })}
                className={inputClass}
              />
            </div>
          </>
        )}

        {block.type === "grid" && (
          <div className="grid grid-cols-2 gap-3">
            {block.items.map((item, itemIndex) => (
              <div key={item.path} className="space-y-2">
                <Preview asset={item} />
                <AltField
                  id={`alt-${block.id}-${itemIndex}`}
                  value={item.alt}
                  onChange={(value) =>
                    onChange({
                      ...block,
                      items: block.items.map((other, otherIndex) =>
                        otherIndex === itemIndex ? { ...other, alt: value } : other,
                      ),
                    })
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function Preview({ asset }: { asset: ImageAsset }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-surface-2">
      <Image src={asset.url} alt={asset.alt || "Preview gambar"} fill sizes="(min-width: 640px) 280px, 45vw" className="object-cover" />
    </div>
  );
}

function AltField({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        Deskripsi gambar (alt text)
      </label>
      <input id={id} value={value} maxLength={LIMITS.imageAlt} onChange={(event) => onChange(event.target.value)} className={inputClass} />
    </div>
  );
}
