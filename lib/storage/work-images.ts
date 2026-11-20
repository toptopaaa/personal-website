import { resizeToWebp } from "@/lib/images/resize";
import type { ImageAsset } from "@/lib/projects/model";

// Dipakai di browser. Gambar diperkecil dulu, lalu dikirim ke /api/admin/upload.
// Server memeriksa identitas Cloudflare Access dan menyimpan gambar ke R2.
export async function uploadWorkImage(projectId: string, file: File): Promise<ImageAsset> {
  const { blob, width, height } = await resizeToWebp(file);

  const form = new FormData();
  form.append("file", blob, "image.webp");
  form.append("projectId", projectId);
  form.append("width", String(width));
  form.append("height", String(height));

  const response = await fetch("/api/admin/upload", { method: "POST", body: form });
  const body = (await response.json().catch(() => null)) as Partial<ImageAsset> & { error?: string } | null;
  if (!response.ok || !body || typeof body.path !== "string" || typeof body.url !== "string") {
    throw new Error(body?.error ?? "Upload gagal. Coba lagi.");
  }
  return {
    path: body.path,
    url: body.url,
    width: Number(body.width) || width,
    height: Number(body.height) || height,
    alt: "",
  };
}
