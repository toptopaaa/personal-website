import { getCloudflareContext } from "@opennextjs/cloudflare";

export type CloudflareBindings = {
  DB: D1DatabaseBinding;
  WORK: R2BucketBinding;
};

type D1PreparedStatement = {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T = Record<string, unknown>>(): Promise<{ results?: T[] }>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<unknown>;
};

export type D1DatabaseBinding = {
  prepare(query: string): D1PreparedStatement;
};

export type R2BucketBinding = {
  put(key: string, value: ArrayBuffer, options?: { httpMetadata?: { contentType?: string; cacheControl?: string } }): Promise<unknown>;
  delete(keys: string | string[]): Promise<unknown>;
};

export async function getCloudflareBindings(): Promise<CloudflareBindings> {
  const context = await getCloudflareContext({ async: true });
  const env = context.env as CloudflareBindings;
  if (!env.DB || !env.WORK) throw new Error("Cloudflare D1 dan R2 belum dikonfigurasi.");
  return env;
}
