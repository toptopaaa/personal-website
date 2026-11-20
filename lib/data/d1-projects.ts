import { getCloudflareBindings } from "@/lib/cloudflare/context";
import { parseBlocks, type ProcessStep, type Project, type ProjectStatus } from "@/lib/projects/model";

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  client: string;
  year: string;
  category: string;
  role: string;
  summary: string;
  deliverables: string;
  process: string;
  result: string;
  blocks: string;
  cover_url: string | null;
  cover_path: string | null;
  cover_alt: string;
  cover_width: number | null;
  cover_height: number | null;
  status: ProjectStatus;
  publish_at: string | null;
  sort_order: number;
  updated_at: string;
};

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function toProject(row: ProjectRow): Project {
  const deliverables = parseJson<unknown>(row.deliverables, []);
  const process = parseJson<unknown>(row.process, []);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title ?? "",
    client: row.client ?? "",
    year: row.year ?? "",
    category: row.category ?? "",
    role: row.role ?? "",
    summary: row.summary ?? "",
    deliverables: Array.isArray(deliverables) ? deliverables.filter((item): item is string => typeof item === "string") : [],
    process: Array.isArray(process)
      ? process.filter((item): item is ProcessStep =>
          typeof item === "object" && item !== null &&
          typeof (item as Record<string, unknown>).title === "string" &&
          typeof (item as Record<string, unknown>).body === "string")
      : [],
    result: row.result ?? "",
    blocks: parseBlocks(parseJson(row.blocks, [])),
    coverUrl: row.cover_url,
    coverPath: row.cover_path,
    coverAlt: row.cover_alt ?? "",
    coverWidth: row.cover_width ?? 1600,
    coverHeight: row.cover_height ?? 1200,
    status: row.status,
    publishAt: row.publish_at,
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
  };
}

export async function getPublicProjects(): Promise<Project[]> {
  const { DB } = await getCloudflareBindings();
  const now = new Date().toISOString();
  const result = await DB.prepare(
    `SELECT * FROM projects
     WHERE status = 'published' OR (status = 'scheduled' AND publish_at <= ?)
     ORDER BY sort_order ASC, updated_at DESC`,
  ).bind(now).all<ProjectRow>();
  return (result.results ?? []).map(toProject);
}

export async function getPublicProjectBySlug(slug: string): Promise<Project | null> {
  const { DB } = await getCloudflareBindings();
  const now = new Date().toISOString();
  const row = await DB.prepare(
    `SELECT * FROM projects
     WHERE slug = ? AND (status = 'published' OR (status = 'scheduled' AND publish_at <= ?))
     LIMIT 1`,
  ).bind(slug, now).first<ProjectRow>();
  return row ? toProject(row) : null;
}

export async function getOwnerProjects(): Promise<Project[]> {
  const { DB } = await getCloudflareBindings();
  const result = await DB.prepare("SELECT * FROM projects ORDER BY updated_at DESC").all<ProjectRow>();
  return (result.results ?? []).map(toProject);
}

export async function getOwnerProject(id: string): Promise<Project | null> {
  const { DB } = await getCloudflareBindings();
  const row = await DB.prepare("SELECT * FROM projects WHERE id = ? LIMIT 1").bind(id).first<ProjectRow>();
  return row ? toProject(row) : null;
}
