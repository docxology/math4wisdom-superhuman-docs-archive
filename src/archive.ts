import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

import { ARCHIVE_ROOT, DOCUMENT_ID, DOCUMENT_URL, MAX_PAGES, MAX_TOOL_CALLS, SCHEMA_VERSION, SNAPSHOTS_ROOT, STAGING_ROOT } from "./constants.js";
import { entityId, collection, docTarget, nextCursor, resolveToolPlan, toolArguments, unwrapToolResult, type ToolPlan } from "./tools.js";
import { isObject, sha256, slug, stableJson, stringValue } from "./json.js";
import type { McpClient, ToolDefinition } from "./mcp.js";
import { validateSnapshot } from "./validate.js";

export type ArchiveOptions = {
  cwd: string;
  client: McpClient;
  now?: Date;
  dryRun?: boolean;
};

type Page = { id: string; title: string; parentId?: string; response: unknown; raw: Record<string, unknown> };
type Table = { id: string; name: string; response: unknown; raw: Record<string, unknown>; rows: Record<string, unknown>[] };
type Asset = { source: string; path: string; sha256: string; bytes: number; mimeType: string };

class Transcript {
  private calls = 0;
  readonly responses: unknown[] = [];

  constructor(private readonly root: string, private readonly client: McpClient) {}

  async call(label: string, tool: ToolDefinition, args: Record<string, unknown>): Promise<unknown> {
    if (++this.calls > MAX_TOOL_CALLS) throw new Error(`Refusing more than ${MAX_TOOL_CALLS} MCP calls.`);
    const result = await this.client.callTool(tool.name, args);
    const file = `raw/mcp-${String(this.calls).padStart(5, "0")}-${slug(label)}.json`;
    await writeJson(join(this.root, file), { tool: tool.name, arguments: args, result });
    this.responses.push(result);
    return unwrapToolResult(result);
  }
}

function createdAt(now: Date): string {
  return now.toISOString().replace(/[:.]/g, "-").replace(/Z$/, "Z");
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, stableJson(value), "utf8");
}

function firstString(value: Record<string, unknown>, keys: string[], fallback: string): string {
  for (const key of keys) {
    const candidate = stringValue(value[key]);
    if (candidate) return candidate;
  }
  return fallback;
}

function parentId(value: Record<string, unknown>): string | undefined {
  return stringValue(value.parentId) ?? stringValue(value.parent_id) ?? stringValue(value.parentPageId) ?? stringValue(value.parent_page_id);
}

async function paginate(
  transcript: Transcript,
  label: string,
  tool: ToolDefinition,
  target: Record<string, string>,
  preferred: string[],
): Promise<Record<string, unknown>[]> {
  const all: Record<string, unknown>[] = [];
  const cursors = new Set<string>();
  let cursor: string | undefined;
  do {
    const result = await transcript.call(`${label}-${cursor ?? "first"}`, tool, toolArguments(tool, { ...target, cursor }));
    all.push(...collection(result, preferred));
    const next = nextCursor(result);
    if (!next) return all;
    if (cursors.has(next)) throw new Error(`${tool.name} repeated pagination cursor ${next}.`);
    cursors.add(next);
    cursor = next;
  } while (true);
}

function markdown(value: unknown, depth = 0): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map((item) => markdown(item, depth)).filter(Boolean).join("\n\n");
  if (!isObject(value)) return "";

  const direct = ["markdown", "md", "text", "content", "body", "value"]
    .map((key) => value[key])
    .find((candidate) => typeof candidate === "string" && candidate.trim());
  if (typeof direct === "string") return direct.trim();

  const children = ["blocks", "children", "content", "items", "sections"]
    .map((key) => value[key])
    .find((candidate) => Array.isArray(candidate));
  const title = firstString(value, ["title", "name", "heading"], "");
  if (Array.isArray(children)) {
    const headingLevel = Math.min(6, Math.max(1, Number(value.level) || depth + 1));
    return [title ? `${"#".repeat(headingLevel)} ${title}` : "", markdown(children, depth + 1)].filter(Boolean).join("\n\n");
  }
  return `\`\`\`json\n${stableJson(value).trim()}\n\`\`\``;
}

function stringifyCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

function csv(rows: Record<string, unknown>[]): string {
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))].sort();
  const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
  return [headers.map(escape).join(","), ...rows.map((row) => headers.map((header) => escape(stringifyCell(row[header]))).join(","))].join("\n") + "\n";
}

type AssetCandidate = { source?: string; base64?: string; mimeType?: string };

function assetCandidates(value: unknown, candidates: AssetCandidate[] = []): AssetCandidate[] {
  if (typeof value === "string") {
    for (const match of value.matchAll(/!\[[^\]]*\]\((data:[^)]+|https?:\/\/[^)\s]+)\)|<img[^>]+src=["'](data:[^"']+|https?:\/\/[^"'\s]+)["']/gi)) {
      const source = match[1] ?? match[2];
      if (source?.startsWith("data:")) candidates.push({ base64: source });
      else if (source) candidates.push({ source });
    }
    return candidates;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => assetCandidates(item, candidates));
    return candidates;
  }
  if (!isObject(value)) return candidates;
  const kind = [value.type, value.kind, value.mimeType, value.mediaType].filter((item): item is string => typeof item === "string").join(" ").toLowerCase();
  const source = ["imageUrl", "image_url", "thumbnailUrl", "thumbnail_url", "assetUrl", "asset_url", "downloadUrl", "download_url", "src", "url", "uri"]
    .map((key) => stringValue(value[key]))
    .find(Boolean);
  const base64 = stringValue(value.data) ?? stringValue(value.base64);
  const sourceLooksLikeMedia = source ? /\.(apng|avif|gif|jpe?g|png|svg|webp|bmp|tiff?|mp3|mp4|mov|webm|pdf)(?:[?#]|$)/i.test(source) : false;
  if ((/\b(image|media|attachment|file|audio|video)\b/.test(kind) || sourceLooksLikeMedia) && (source || base64)) {
    candidates.push({ source, base64, mimeType: stringValue(value.mimeType) ?? stringValue(value.mediaType) });
  }
  for (const nested of Object.values(value)) assetCandidates(nested, candidates);
  return candidates;
}

function decodeData(value: string): { bytes: Uint8Array; mimeType?: string } | undefined {
  const match = /^data:([^;,]+)?;base64,(.+)$/s.exec(value);
  if (!match) return undefined;
  return { bytes: Buffer.from(match[2], "base64"), mimeType: match[1] };
}

function magicMime(bytes: Uint8Array): string | undefined {
  const ascii = Buffer.from(bytes.subarray(0, 64)).toString("utf8").trimStart().toLowerCase();
  if (bytes.length >= 8 && Buffer.from(bytes.subarray(0, 8)).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "image/png";
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (Buffer.from(bytes.subarray(0, 6)).toString("ascii") === "GIF87a" || Buffer.from(bytes.subarray(0, 6)).toString("ascii") === "GIF89a") return "image/gif";
  if (Buffer.from(bytes.subarray(0, 4)).toString("ascii") === "RIFF" && Buffer.from(bytes.subarray(8, 12)).toString("ascii") === "WEBP") return "image/webp";
  if (ascii.startsWith("<svg") || ascii.startsWith("<?xml") && ascii.includes("<svg")) return "image/svg+xml";
  if (Buffer.from(bytes.subarray(0, 5)).toString("ascii") === "%PDF-") return "application/pdf";
  return undefined;
}

function extensionFor(mimeType: string): string {
  return ({ "image/png": ".png", "image/jpeg": ".jpg", "image/gif": ".gif", "image/webp": ".webp", "image/svg+xml": ".svg", "application/pdf": ".pdf", "audio/mpeg": ".mp3", "video/mp4": ".mp4" } as Record<string, string>)[mimeType] ?? ".bin";
}

async function saveAssets(root: string, responses: unknown[]): Promise<{ assets: Asset[]; replacements: Map<string, string> }> {
  const candidates = responses.flatMap((response) => assetCandidates(response));
  const assets = new Map<string, Asset>();
  const replacements = new Map<string, string>();
  for (const candidate of candidates) {
    let bytes: Uint8Array | undefined;
    let declaredMime = candidate.mimeType;
    if (candidate.base64) {
      const decoded = decodeData(candidate.base64);
      if (decoded) { bytes = decoded.bytes; declaredMime ??= decoded.mimeType; }
      else {
        try { bytes = Buffer.from(candidate.base64, "base64"); } catch { /* handled below */ }
      }
    }
    if (!bytes && candidate.source) {
      const response = await fetch(candidate.source, { redirect: "error" });
      if (!response.ok) throw new Error(`Failed to download MCP-emitted asset (${response.status}).`);
      const length = Number(response.headers.get("content-length") ?? 0);
      if (length > 100 * 1024 * 1024) throw new Error("Refusing an asset larger than 100 MiB.");
      bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.byteLength > 100 * 1024 * 1024) throw new Error("Refusing an asset larger than 100 MiB.");
      declaredMime ??= response.headers.get("content-type")?.split(";", 1)[0];
    }
    if (!bytes || bytes.byteLength === 0) throw new Error("MCP returned an empty media asset.");
    const detected = magicMime(bytes);
    if (declaredMime?.startsWith("image/") && detected && declaredMime !== detected) throw new Error(`Asset MIME mismatch: expected ${declaredMime}, got ${detected}.`);
    const mimeType = detected ?? declaredMime ?? "application/octet-stream";
    const digest = sha256(bytes);
    const archivePath = `assets/${digest}${extensionFor(mimeType)}`;
    if (!assets.has(digest)) {
      await mkdir(join(root, "assets"), { recursive: true });
      await writeFile(join(root, archivePath), bytes, { flag: "wx" });
      assets.set(digest, { source: candidate.source ?? "inline MCP content", path: archivePath, sha256: digest, bytes: bytes.byteLength, mimeType });
    }
    if (candidate.source) replacements.set(candidate.source, archivePath);
  }
  return { assets: [...assets.values()].sort((a, b) => a.path.localeCompare(b.path)), replacements };
}

function localizeMarkdown(value: string, replacements: Map<string, string>): string {
  let localized = value;
  for (const [url, path] of replacements) localized = localized.replaceAll(url, `../${path}`);
  return localized;
}

async function files(root: string, directory = root): Promise<{ path: string; sha256: string; bytes: number }[]> {
  const entries = await (await import("node:fs/promises")).readdir(directory, { withFileTypes: true });
  const results: { path: string; sha256: string; bytes: number }[] = [];
  for (const entry of entries) {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) results.push(...await files(root, full));
    else {
      const bytes = await readFile(full);
      results.push({ path: relative(root, full), sha256: sha256(bytes), bytes: bytes.byteLength });
    }
  }
  return results.sort((a, b) => a.path.localeCompare(b.path));
}

function serializablePlan(plan: ToolPlan): Record<string, string | undefined> {
  return Object.fromEntries(Object.entries(plan).map(([role, tool]) => [role, tool?.name]));
}

export async function archive(options: ArchiveOptions): Promise<{ snapshot: string; pages: number; tables: number; assets: number }> {
  const now = options.now ?? new Date();
  const snapshotName = createdAt(now);
  const stage = join(options.cwd, STAGING_ROOT, `${snapshotName}-${process.pid}`);
  const destination = join(options.cwd, SNAPSHOTS_ROOT, snapshotName);
  await mkdir(stage, { recursive: true });

  try {
    const tools = await options.client.listTools();
    if (tools.length === 0) throw new Error("The Superhuman Docs MCP returned no tools.");
    await writeJson(join(stage, "raw/tool-catalog.json"), tools);
    const plan = resolveToolPlan(tools);
    if (options.dryRun) {
      await writeJson(join(stage, "dry-run.json"), { endpoint: "Superhuman Docs MCP", documentUrl: DOCUMENT_URL, toolPlan: serializablePlan(plan), tools });
      await rm(stage, { recursive: true, force: true });
      return { snapshot: "(dry run: no snapshot written)", pages: 0, tables: 0, assets: 0 };
    }

    const transcript = new Transcript(stage, options.client);
    if (plan.document) await transcript.call("document", plan.document, toolArguments(plan.document, docTarget()));
    const listedPages = await paginate(transcript, "pages", plan.listPages!, docTarget(), ["pages", "items", "results"]);
    if (listedPages.length === 0) throw new Error("The document contains no readable pages; archive aborted.");
    if (listedPages.length > MAX_PAGES) throw new Error(`Refusing more than ${MAX_PAGES} pages.`);

    const pageIds = new Set<string>();
    const pages: Page[] = [];
    for (const item of listedPages) {
      const id = entityId(item, "page");
      if (pageIds.has(id)) throw new Error(`Duplicate page ID ${id}.`);
      pageIds.add(id);
      const response = await transcript.call(`page-${id}`, plan.getPage!, toolArguments(plan.getPage!, { ...docTarget(), pageId: id }));
      pages.push({ id, title: firstString(item, ["title", "name"], id), parentId: parentId(item), raw: item, response });
    }
    for (const page of pages) if (page.parentId && !pageIds.has(page.parentId)) throw new Error(`Page ${page.id} refers to missing parent ${page.parentId}.`);

    const listedTables = await paginate(transcript, "tables", plan.listTables!, docTarget(), ["tables", "items", "results"]);
    const tableIds = new Set<string>();
    const tables: Table[] = [];
    for (const item of listedTables) {
      const id = entityId(item, "table");
      if (tableIds.has(id)) throw new Error(`Duplicate table ID ${id}.`);
      tableIds.add(id);
      const response = await transcript.call(`table-${id}`, plan.getTable!, toolArguments(plan.getTable!, { ...docTarget(), tableId: id }));
      const rows = await paginate(transcript, `rows-${id}`, plan.listRows!, { ...docTarget(), tableId: id }, ["rows", "items", "results"]);
      tables.push({ id, name: firstString(item, ["name", "title"], id), raw: item, response, rows });
    }

    const { assets, replacements } = await saveAssets(stage, transcript.responses);
    for (const page of pages) {
      const path = `pages/${slug(page.title, page.id)}-${slug(page.id)}.md`;
      const content = localizeMarkdown(markdown(page.response) || `# ${page.title}\n\nNo textual representation was returned; see raw MCP response.`, replacements);
      await mkdir(join(stage, dirname(path)), { recursive: true });
      await writeFile(join(stage, path), `# ${page.title}\n\n${content.replace(/^# .+\n+/, "")}`.trimEnd() + "\n", "utf8");
      await writeJson(join(stage, `pages/${slug(page.title, page.id)}-${slug(page.id)}.json`), page.response);
    }
    for (const table of tables) {
      const dir = `tables/${slug(table.name, table.id)}-${slug(table.id)}`;
      await writeJson(join(stage, `${dir}/schema.json`), table.response);
      await writeJson(join(stage, `${dir}/rows.json`), table.rows);
      await writeFile(join(stage, `${dir}/rows.csv`), csv(table.rows), "utf8");
    }

    const fileIndex = await files(stage);
    const manifest = {
      schemaVersion: SCHEMA_VERSION,
      capturedAt: now.toISOString(),
      source: { documentUrl: DOCUMENT_URL, documentId: DOCUMENT_ID, endpoint: "https://docs.superhuman.com/apis/mcp" },
      toolPlan: serializablePlan(plan),
      inventory: {
        pages: pages.map((page) => ({ id: page.id, title: page.title, parentId: page.parentId, markdown: `pages/${slug(page.title, page.id)}-${slug(page.id)}.md`, raw: `pages/${slug(page.title, page.id)}-${slug(page.id)}.json` })),
        tables: tables.map((table) => ({ id: table.id, name: table.name, rows: table.rows.length, directory: `tables/${slug(table.name, table.id)}-${slug(table.id)}` })),
        assets,
      },
      counts: { pages: pages.length, tables: tables.length, rows: tables.reduce((sum, table) => sum + table.rows.length, 0), assets: assets.length, toolCalls: transcript.responses.length },
      files: fileIndex,
    };
    await writeJson(join(stage, "manifest.json"), manifest);
    await validateSnapshot(stage);
    await mkdir(dirname(destination), { recursive: true });
    await rename(stage, destination);
    return { snapshot: destination, pages: pages.length, tables: tables.length, assets: assets.length };
  } catch (error) {
    await rm(stage, { recursive: true, force: true });
    throw error;
  }
}

export async function loadLatestSnapshot(cwd: string): Promise<string> {
  const snapshots = join(cwd, SNAPSHOTS_ROOT);
  const entries = await (await import("node:fs/promises")).readdir(snapshots, { withFileTypes: true });
  const latest = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort().at(-1);
  if (!latest) throw new Error("No completed archive snapshots exist.");
  return join(snapshots, latest);
}

export async function validateExistingSnapshot(path: string): Promise<void> {
  await validateSnapshot(path);
}
