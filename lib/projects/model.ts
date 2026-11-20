// Tipe dan aturan project. Aman dipakai di server maupun browser.

export const PROJECT_STATUSES = ["draft", "scheduled", "published"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const LIMITS = {
  slug: 80,
  title: 120,
  client: 120,
  year: 30,
  category: 80,
  role: 120,
  summary: 1200,
  result: 600,
  coverAlt: 200,
  stepTitle: 120,
  stepBody: 400,
  steps: 3,
  deliverable: 200,
  deliverables: 12,
  blocks: 40,
  gridItems: 4,
  text: 2000,
  caption: 300,
  imageAlt: 200,
  blockId: 64,
  maxDimension: 10000,
} as const;

export type ProcessStep = {
  title: string;
  body: string;
};

// Gambar disimpan di bucket R2. Path dipakai untuk menghapus file.
export type ImageAsset = {
  path: string;
  url: string;
  width: number;
  height: number;
  alt: string;
};

const STORAGE_PATH = /^[0-9a-f-]{36}\/[A-Za-z0-9_-]+\.webp$/i;

// Blok konten seperti Behance: gambar tunggal, grid foto, dan teks.
export type Block =
  | { id: string; type: "image"; asset: ImageAsset; caption: string }
  | { id: string; type: "grid"; items: ImageAsset[] }
  | { id: string; type: "text"; text: string };

export type BlockType = Block["type"];

export type Project = {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  category: string;
  role: string;
  summary: string;
  deliverables: string[];
  process: ProcessStep[];
  result: string;
  blocks: Block[];
  coverUrl: string | null;
  coverPath: string | null;
  coverAlt: string;
  coverWidth: number;
  coverHeight: number;
  status: ProjectStatus;
  publishAt: string | null;
  sortOrder: number;
  updatedAt: string;
};

// Isi form editor. Deliverables berupa teks, satu baris satu item.
export type ProjectFormInput = {
  slug: string;
  title: string;
  client: string;
  year: string;
  category: string;
  role: string;
  summary: string;
  deliverablesText: string;
  steps: ProcessStep[];
  result: string;
  coverAlt: string;
  blocks: Block[];
};

export type ProjectFields = Omit<ProjectFormInput, "deliverablesText" | "steps"> & {
  deliverables: string[];
  process: ProcessStep[];
};

export type ActionResult = { ok: true; message: string } | { ok: false; error: string };

export type Checked<T> = { ok: true; value: T } | { ok: false; error: string };

const ok = <T>(value: T): Checked<T> => ({ ok: true, value });
const fail = (error: string) => ({ ok: false as const, error });

export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, LIMITS.slug)
    .replace(/-+$/g, "");
}

export function parseDeliverables(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^\s*[-*•]\s*/, "").trim())
    .filter((line) => line.length > 0);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function positiveInt(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value > 0 && value <= LIMITS.maxDimension
    ? value
    : null;
}

// Memeriksa satu gambar yang diunggah ke Storage.
function parseAsset(raw: unknown, projectId?: string): Checked<ImageAsset> {
  if (!isRecord(raw)) return fail("Data gambar tidak valid.");
  const path = text(raw.path);
  const url = text(raw.url);
  if (!STORAGE_PATH.test(path) || path.includes("..") || (projectId && !path.startsWith(`${projectId}/`))) {
    return fail("Lokasi file gambar tidak valid.");
  }
  try {
    if (new URL(url).protocol !== "https:") return fail("Alamat gambar harus menggunakan HTTPS.");
  } catch {
    return fail("Alamat gambar tidak valid.");
  }
  const width = positiveInt(raw.width);
  const height = positiveInt(raw.height);
  if (!width || !height) return fail("Ukuran gambar tidak valid.");
  const alt = text(raw.alt).trim();
  if (alt.length > LIMITS.imageAlt) return fail(`Alt text gambar maksimal ${LIMITS.imageAlt} karakter.`);
  return ok({ path, url, width, height, alt });
}

// Mengembalikan null untuk blok teks kosong, supaya blok yang belum diisi tidak ikut tersimpan.
function parseBlock(raw: unknown, projectId?: string): Checked<Block | null> {
  if (!isRecord(raw)) return fail("Blok konten tidak valid.");
  const id = text(raw.id);
  if (!id || id.length > LIMITS.blockId || !/^[A-Za-z0-9-]+$/.test(id)) return fail("ID blok tidak valid.");

  switch (raw.type) {
    case "text": {
      const body = text(raw.text).trim();
      if (body.length > LIMITS.text) return fail(`Teks per blok maksimal ${LIMITS.text} karakter.`);
      return ok(body ? { id, type: "text", text: body } : null);
    }
    case "image": {
      const asset = parseAsset(raw.asset, projectId);
      if (!asset.ok) return fail(asset.error);
      const caption = text(raw.caption).trim();
      if (caption.length > LIMITS.caption) return fail(`Keterangan maksimal ${LIMITS.caption} karakter.`);
      return ok({ id, type: "image", asset: asset.value, caption });
    }
    case "grid": {
      if (!Array.isArray(raw.items)) return fail("Grid foto tidak valid.");
      if (raw.items.length < 1 || raw.items.length > LIMITS.gridItems) {
        return fail(`Grid foto berisi 1 sampai ${LIMITS.gridItems} gambar.`);
      }
      const items: ImageAsset[] = [];
      for (const item of raw.items) {
        const asset = parseAsset(item, projectId);
        if (!asset.ok) return fail(asset.error);
        items.push(asset.value);
      }
      return ok({ id, type: "grid", items });
    }
    default:
      return fail("Jenis blok tidak dikenal.");
  }
}

// Memeriksa seluruh konten project sebelum disimpan.
export function normalizeBlocks(raw: unknown, projectId?: string): Checked<Block[]> {
  if (!Array.isArray(raw)) return fail("Konten project tidak valid.");
  if (raw.length > LIMITS.blocks) return fail(`Konten maksimal ${LIMITS.blocks} blok.`);

  const seen = new Set<string>();
  const blocks: Block[] = [];
  for (const item of raw) {
    const parsed = parseBlock(item, projectId);
    if (!parsed.ok) return fail(parsed.error);
    if (parsed.value === null) continue;
    if (seen.has(parsed.value.id)) return fail("Ada dua blok dengan ID yang sama.");
    seen.add(parsed.value.id);
    blocks.push(parsed.value);
  }
  return ok(blocks);
}

// Dipakai saat menampilkan data dari database. Data yang rusak dilewati, bukan membuat halaman error.
export function parseBlocks(raw: unknown): Block[] {
  const checked = normalizeBlocks(raw);
  return checked.ok ? checked.value : [];
}

export function blockStoragePaths(blocks: Block[]): string[] {
  return blocks.flatMap((block) => {
    if (block.type === "image") return [block.asset.path];
    if (block.type === "grid") return block.items.map((item) => item.path);
    return [];
  });
}

// Memeriksa isian dasar form, lalu memberi slug cadangan jika kosong.
export function normalizeProjectInput(input: ProjectFormInput, fallbackId: string): Checked<ProjectFields> {
  const title = input.title.trim();
  const slug = slugify(input.slug.trim() || title) || `proyek-${fallbackId.slice(0, 8)}`;

  const limits: Array<readonly [string, number]> = [
    [input.title, LIMITS.title],
    [input.client, LIMITS.client],
    [input.year, LIMITS.year],
    [input.category, LIMITS.category],
    [input.role, LIMITS.role],
    [input.summary, LIMITS.summary],
    [input.result, LIMITS.result],
    [input.coverAlt, LIMITS.coverAlt],
  ];
  for (const [value, max] of limits) {
    if (value.trim().length > max) return fail(`Ada isian yang terlalu panjang (maksimal ${max} karakter).`);
  }

  const deliverables = parseDeliverables(input.deliverablesText);
  if (deliverables.length > LIMITS.deliverables) return fail(`Deliverables maksimal ${LIMITS.deliverables} baris.`);
  if (deliverables.some((item) => item.length > LIMITS.deliverable)) {
    return fail(`Setiap baris deliverables maksimal ${LIMITS.deliverable} karakter.`);
  }

  const steps = input.steps
    .map((step) => ({ title: step.title.trim(), body: step.body.trim() }))
    .filter((step) => step.title.length > 0 || step.body.length > 0);
  if (steps.length > LIMITS.steps) return fail(`Process maksimal ${LIMITS.steps} langkah.`);
  if (steps.some((step) => step.title.length > LIMITS.stepTitle || step.body.length > LIMITS.stepBody)) {
    return fail("Judul atau isi langkah process terlalu panjang.");
  }
  if (steps.some((step) => !step.title || !step.body)) {
    return fail("Setiap langkah process harus punya judul dan isi.");
  }

  const blocks = normalizeBlocks(input.blocks, fallbackId);
  if (!blocks.ok) return fail(blocks.error);

  return ok({
    slug,
    title,
    client: input.client.trim(),
    year: input.year.trim(),
    category: input.category.trim(),
    role: input.role.trim(),
    summary: input.summary.trim(),
    deliverables,
    process: steps,
    result: input.result.trim(),
    coverAlt: input.coverAlt.trim(),
    blocks: blocks.value,
  });
}

// Syarat minimal sebelum project boleh diterbitkan atau dijadwalkan.
export function publishBlockers(project: {
  title: string;
  summary: string;
  coverUrl: string | null;
  coverAlt: string;
  deliverables: string[];
}): string[] {
  const blockers: string[] = [];
  if (!project.title.trim()) blockers.push("Judul wajib diisi.");
  if (!project.coverUrl) blockers.push("Cover wajib diunggah.");
  if (!project.coverAlt.trim()) blockers.push("Deskripsi gambar (alt text) cover wajib diisi.");
  if (!project.summary.trim()) blockers.push("Overview wajib diisi.");
  if (project.deliverables.length === 0) blockers.push("Isi minimal satu baris deliverables.");
  return blockers;
}
