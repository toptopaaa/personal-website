import Image from "next/image";
import type { Block, ImageAsset } from "@/lib/projects/model";

type WorkBlocksProps = {
  blocks: Block[];
  projectTitle: string;
};

// Menampilkan blok konten project secara berurutan, seperti yang diatur di editor.
export function WorkBlocks({ blocks, projectTitle }: WorkBlocksProps) {
  if (blocks.length === 0) return null;

  return (
    <div className="mt-12 space-y-10">
      {blocks.map((block) => {
        if (block.type === "text") {
          return (
            <p key={block.id} className="whitespace-pre-line">
              {block.text}
            </p>
          );
        }

        if (block.type === "image") {
          return (
            <Figure
              key={block.id}
              asset={block.asset}
              projectTitle={projectTitle}
              caption={block.caption}
              sizes="(min-width: 640px) 600px, 100vw"
            />
          );
        }

        return (
          <div key={block.id} className={`grid gap-3 ${block.items.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
            {block.items.map((item) => (
              <Figure key={item.path} asset={item} projectTitle={projectTitle} sizes="(min-width: 640px) 300px, 50vw" />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function Figure({
  asset,
  projectTitle,
  caption,
  sizes,
}: {
  asset: ImageAsset;
  projectTitle: string;
  caption?: string;
  sizes: string;
}) {
  return (
    <figure>
      <Image
        src={asset.url}
        alt={asset.alt || projectTitle}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        className="h-auto w-full rounded-2xl border border-line"
      />
      {caption && <figcaption className="mt-2 text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}
