import assert from "node:assert/strict";
import test from "node:test";
import { blockStoragePaths, normalizeBlocks, parseBlocks } from "./lib/projects/model";

const projectId = "123e4567-e89b-12d3-a456-426614174000";
const asset = (path = `${projectId}/image-1.webp`) => ({
  path,
  url: `https://cdn.toptopaaa.com/${path}`,
  width: 1200,
  height: 900,
  alt: "Gambar project",
});

test("rejects images outside the current project's storage folder", () => {
  const parsed = normalizeBlocks([
    { id: "image-1", type: "image", asset: asset("another-project/image-1.webp"), caption: "" },
  ], projectId);
  assert.equal(parsed.ok, false);
});

test("rejects grids with more than four images", () => {
  const parsed = normalizeBlocks([{
    id: "grid-1",
    type: "grid",
    items: Array.from({ length: 5 }, (_, index) => asset(`${projectId}/image-${index}.webp`)),
  }], projectId);
  assert.equal(parsed.ok, false);
});

test("drops empty text blocks before saving", () => {
  const parsed = normalizeBlocks([{ id: "text-1", type: "text", text: "  \n " }], projectId);
  assert.deepEqual(parsed, { ok: true, value: [] });
});

test("rejects duplicate block identifiers", () => {
  const parsed = normalizeBlocks([
    { id: "same", type: "text", text: "First" },
    { id: "same", type: "text", text: "Second" },
  ], projectId);
  assert.equal(parsed.ok, false);
});

test("lenient public parsing skips malformed content without throwing", () => {
  assert.deepEqual(parseBlocks([{ id: "bad", type: "image", asset: { path: "../outside", url: "not-a-url" } }]), []);
});

test("collects image paths from single-image and grid blocks", () => {
  const parsed = normalizeBlocks([
    { id: "image-1", type: "image", asset: asset(), caption: "" },
    { id: "grid-1", type: "grid", items: [asset(`${projectId}/image-2.webp`)] },
  ], projectId);
  assert.equal(parsed.ok, true);
  if (parsed.ok) assert.deepEqual(blockStoragePaths(parsed.value), [
    `${projectId}/image-1.webp`,
    `${projectId}/image-2.webp`,
  ]);
});

