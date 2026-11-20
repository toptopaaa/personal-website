"use client";

import { useState, type ChangeEvent } from "react";
import { BlockCard } from "@/components/admin/editor/block-card";
import { FormGroup, smallButtonClass } from "@/components/admin/editor/form-fields";
import { LIMITS, type Block, type ImageAsset } from "@/lib/projects/model";
import { uploadWorkImage } from "@/lib/storage/work-images";

type BlocksSectionProps = {
  projectId: string;
  blocks: Block[];
  onBlocksChange: (update: (current: Block[]) => Block[]) => void;
};

export function BlocksSection({ projectId, blocks, onBlocksChange }: BlocksSectionProps) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const isFull = blocks.length >= LIMITS.blocks;

  // Unggah berurutan supaya HP tidak kehabisan memori saat banyak foto dipilih sekaligus.
  async function uploadMany(files: File[]): Promise<ImageAsset[]> {
    const assets: ImageAsset[] = [];
    for (const [index, file] of files.entries()) {
      setMessage(`Mengunggah ${index + 1} dari ${files.length}…`);
      assets.push(await uploadWorkImage(projectId, file));
    }
    return assets;
  }

  async function run(task: () => Promise<string>) {
    setBusy(true);
    try {
      setMessage(await task());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal mengunggah gambar.");
    } finally {
      setBusy(false);
    }
  }

  function pickFiles(event: ChangeEvent<HTMLInputElement>, limit: number): File[] {
    const files = Array.from(event.target.files ?? []).slice(0, limit);
    event.target.value = "";
    return files;
  }

  function handleImages(event: ChangeEvent<HTMLInputElement>) {
    const files = pickFiles(event, LIMITS.blocks - blocks.length);
    if (files.length === 0) return;
    void run(async () => {
      const assets = await uploadMany(files);
      onBlocksChange((current) => [
        ...current,
        ...assets.map((asset) => ({ id: crypto.randomUUID(), type: "image" as const, asset, caption: "" })),
      ]);
      return `${assets.length} gambar ditambahkan.`;
    });
  }

  function handleGrid(event: ChangeEvent<HTMLInputElement>) {
    const files = pickFiles(event, LIMITS.gridItems);
    if (files.length === 0) return;
    void run(async () => {
      const assets = await uploadMany(files);
      onBlocksChange((current) => [...current, { id: crypto.randomUUID(), type: "grid", items: assets }]);
      return `Grid dengan ${assets.length} foto ditambahkan.`;
    });
  }

  function addText() {
    onBlocksChange((current) => [...current, { id: crypto.randomUUID(), type: "text", text: "" }]);
    setMessage("Blok teks ditambahkan. Blok kosong tidak ikut tersimpan.");
  }

  function moveBlock(index: number, direction: -1 | 1) {
    onBlocksChange((current) => {
      const target = index + direction;
      const from = current[index];
      const to = current[target];
      if (!from || !to) return current;
      const next = [...current];
      next[index] = to;
      next[target] = from;
      return next;
    });
  }

  function removeBlock(id: string) {
    if (!window.confirm("Hapus blok ini? Gambarnya juga dihapus setelah kamu menyimpan.")) return;
    onBlocksChange((current) => current.filter((block) => block.id !== id));
  }

  function updateBlock(next: Block) {
    onBlocksChange((current) => current.map((block) => (block.id === next.id ? next : block)));
  }

  const addDisabled = busy || isFull;

  return (
    <FormGroup title="Konten project (seperti Behance)">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className={`${smallButtonClass} w-full cursor-pointer ${addDisabled ? "pointer-events-none opacity-40" : ""}`}>
          + Gambar
          <input type="file" accept="image/*" multiple onChange={handleImages} disabled={addDisabled} className="sr-only" />
        </label>
        <label className={`${smallButtonClass} w-full cursor-pointer ${addDisabled ? "pointer-events-none opacity-40" : ""}`}>
          + Grid foto (maks. 4)
          <input type="file" accept="image/*" multiple onChange={handleGrid} disabled={addDisabled} className="sr-only" />
        </label>
        <button type="button" onClick={addText} disabled={addDisabled} className={`${smallButtonClass} w-full`}>
          + Teks
        </button>
      </div>

      <p role="status" className="min-h-5 text-sm text-muted">
        {message ?? "Tambahkan gambar atau teks. Atur urutannya dengan tombol Naik dan Turun."}
      </p>

      {blocks.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">
          Belum ada konten. Foto yang diunggah akan tampil di halaman project sesuai urutan di sini.
        </p>
      )}

      <ol className="space-y-4">
        {blocks.map((block, index) => (
          <li key={block.id}>
            <BlockCard
              block={block}
              index={index}
              count={blocks.length}
              onMove={(direction) => moveBlock(index, direction)}
              onRemove={() => removeBlock(block.id)}
              onChange={updateBlock}
            />
          </li>
        ))}
      </ol>
    </FormGroup>
  );
}
