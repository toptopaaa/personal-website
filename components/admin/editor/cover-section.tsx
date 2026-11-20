"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";
import { setCoverAction } from "@/app/admin/actions";
import { Field, inputClass, outlineButtonClass } from "@/components/admin/editor/form-fields";
import { LIMITS } from "@/lib/projects/model";
import { uploadWorkImage } from "@/lib/storage/work-images";

type CoverSectionProps = {
  projectId: string;
  coverUrl: string | null;
  coverAlt: string;
  onCoverAltChange: (value: string) => void;
};

export function CoverSection({ projectId, coverUrl, coverAlt, onCoverAltChange }: CoverSectionProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setBusy(true);
    setMessage("Memproses dan mengunggah…");
    try {
      const asset = await uploadWorkImage(projectId, file);
      const result = await setCoverAction(projectId, {
        path: asset.path,
        url: asset.url,
        width: asset.width,
        height: asset.height,
      });
      if (!result.ok) throw new Error(result.error);
      setMessage("Cover diperbarui.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal mengunggah gambar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface-2">
        {coverUrl ? (
          <Image src={coverUrl} alt={coverAlt || "Preview cover"} fill sizes="(min-width: 640px) 600px, 100vw" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted">
            Belum ada cover. Pilih foto dari galeri HP atau komputer.
          </div>
        )}
      </div>

      <label className={`${outlineButtonClass} w-full cursor-pointer focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-accent ${busy ? "pointer-events-none opacity-50" : ""}`}>
        {coverUrl ? "Ganti cover" : "Unggah cover"}
        <input type="file" accept="image/*" onChange={handleFile} disabled={busy} className="sr-only" />
      </label>
      <p role="status" className="min-h-5 text-sm text-muted">
        {message ?? "Foto otomatis diperkecil sebelum diunggah."}
      </p>

      <Field id="cover-alt" label="Deskripsi gambar (alt text)" hint="Dibaca oleh pembaca layar. Wajib diisi sebelum terbit.">
        <input
          id="cover-alt"
          className={inputClass}
          value={coverAlt}
          maxLength={LIMITS.coverAlt}
          onChange={(event) => onCoverAltChange(event.target.value)}
        />
      </Field>
    </div>
  );
}
