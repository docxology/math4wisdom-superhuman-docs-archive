import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

import { DOCUMENT_ID, DOCUMENT_URL, MAX_PAGES, MAX_TOOL_CALLS, SCHEMA_VERSION, SNAPSHOTS_ROOT, STAGING_ROOT } from "./constants.js";
import { absoluteResourceUri, pageIdFromUri, resolveToolPlan, unwrapToolResult, type ToolPlan } from "./tools.js";
import { isObject, sha256, slug, stableJson, stringValue } from "./json.js";
import type { McpClient, ToolDefinition } from "./mcp.js";
import { validateSnapshot } from "./validate.js";

export type ArchiveOptions = {
  cwd: string;
  client: McpClient;
  now?: Date;
  dryRun?: boolean;
};

type Page = {
  id: string;
  title: string;
  parentId?: string;
  outline: Record<string, unknown>;
  metadata: Record<string, unknown>;
  markdown: string;
  contentResponses: unknown[];
};

type Table = {
  id: string;
  name: string;
  uri: string;
  sourcePages: string[];
  descriptor: Record<string, unknown>;
  schema: unknown;
  rows: Record<string, unknown>[];
};

type Asset = { source: string; sources: string[]; path: string; sha256: string; bytes: number; mimeType: string };

const RETRY_ATTEMPTS = 4;

function retryableReadError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /\b(request timed out|timeout|temporar(?:y|ily)|econnreset|eai_again|429|5\d{2})\b/i.test(message);
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

class Transcript {
  private calls = 0;
  readonly responses: unknown[] = [];

  constructor(private readonly root: string, private readonly client: McpClient) {}

  async call(label: string, tool: ToolDefinition, args: Record<string, unknown>): Promise<unknown> {
    let result: unknown;
    let failure: unknown;
    for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt += 1) {
      if (++this.calls > MAX_TOOL_CALLS) throw new Error(`Refusing more than ${MAX_TOOL_CALLS} MCP calls.`);
      try {
        result = await this.client.callTool(tool.name, args);
        failure = undefined;
        break;
      } catch (error) {
        failure = error;
        if (!retryableReadError(error) || attempt === RETRY_ATTEMPTS) throw error;
        await delay(250 * 2 ** (attempt - 1));
      }
    }
    if (failure !== undefined) throw failure;
    const file = `raw/mcp-${String(this.calls).padStart(5, "0")}-${slug(label)}.json`;
    await writeJson(join(this.root, file), { tool: tool.name, arguments: args, result });
    this.responses.push(result);
    return unwrapToolResult(result);
  }

  get count(): number {
    return this.calls;
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

function records(value: unknown, label: string): Record<string, unknown>[] {
  if (!Array.isArray(value) || !value.every(isObject)) throw new Error(`${label} did not return an object collection.`);
  return value;
}

function tableIdFromUri(uri: string): string | undefined {
  const match = /(?:^|\/)tables\/([^/?#]+)/.exec(uri);
  return match?.[1];
}

function contentText(value: Record<string, unknown>): string {
  const content = value.content ?? value.markdown;
  if (content === undefined || content === null) return "";
  if (typeof content !== "string") throw new Error("content_read returned non-text page content.");
  return content;
}

async function readDocumentOutline(transcript: Transcript, plan: ToolPlan, documentUri: string): Promise<Record<string, unknown>[]> {
  const all: Record<string, unknown>[] = [];
  const seenOffsets = new Set<number>();
  let offset = 0;
  do {
    if (seenOffsets.has(offset)) throw new Error(`document_outline repeated page offset ${offset}.`);
    seenOffsets.add(offset);
    const value = await transcript.call(`document-outline-${offset}`, plan.documentOutline, { uri: documentUri, pageLimit: 50, pageOffset: offset });
    if (!isObject(value)) throw new Error("document_outline returned a non-object result.");
    const batch = records(value.pages, "document_outline pages");
    all.push(...batch);
    if (all.length > MAX_PAGES) throw new Error(`Refusing more than ${MAX_PAGES} pages.`);
    const pagination = isObject(value.pagination) ? value.pagination : {};
    const hasMore = pagination.hasMore === true;
    if (!hasMore) {
      const total = typeof pagination.totalPages === "number" ? pagination.totalPages : undefined;
      if (total !== undefined && total !== all.length) throw new Error(`document_outline reported ${total} pages but returned ${all.length}.`);
      return all;
    }
    if (batch.length === 0) throw new Error("document_outline reported more pages but returned an empty page batch.");
    offset += batch.length;
  } while (true);
}

async function readPageContent(
  transcript: Transcript,
  plan: ToolPlan,
  pageUri: string,
): Promise<{ markdown: string; responses: unknown[]; tables: Record<string, unknown>[] }> {
  const chunks: string[] = [];
  const responses: unknown[] = [];
  const tables: Record<string, unknown>[] = [];
  const seenChunks = new Set<string>();
  const blockLimit = 100;
  for (let offset = 0; offset <= MAX_TOOL_CALLS * blockLimit; offset += blockLimit) {
    const value = await transcript.call(`content-${slug(pageUri)}-${offset}`, plan.contentRead, {
      uri: pageUri,
      contentTypesToInclude: ["markdown", "tables", "formulas", "controls", "comments"],
      markdownBlockOffset: offset,
      markdownBlockLimit: blockLimit,
    });
    if (!isObject(value)) throw new Error(`content_read returned a non-object result for ${pageUri}.`);
    responses.push(value);
    if (Array.isArray(value.tables)) {
      if (!value.tables.every(isObject)) throw new Error(`content_read returned a malformed table inventory for ${pageUri}.`);
      tables.push(...value.tables);
    }
    const chunk = contentText(value);
    if (!chunk.trim()) return { markdown: chunks.join("\n\n").trim(), responses, tables };
    if (seenChunks.has(chunk)) throw new Error(`content_read did not advance markdown pagination for ${pageUri}.`);
    seenChunks.add(chunk);
    chunks.push(chunk);
  }
  throw new Error(`content_read exceeded the page-content pagination limit for ${pageUri}.`);
}

async function readTableRows(transcript: Transcript, plan: ToolPlan, tableUri: string): Promise<Record<string, unknown>[]> {
  const all: Record<string, unknown>[] = [];
  const seenOffsets = new Set<number>();
  let offset = 0;
  do {
    if (seenOffsets.has(offset)) throw new Error(`table_rows_read repeated row offset ${offset} for ${tableUri}.`);
    seenOffsets.add(offset);
    const value = await transcript.call(`rows-${slug(tableUri)}-${offset}`, plan.tableRowsRead, { uri: tableUri, rowLimit: 100, rowOffset: offset });
    if (!isObject(value)) throw new Error(`table_rows_read returned a non-object result for ${tableUri}.`);
    const batch = records(value.rows, "table_rows_read rows");
    all.push(...batch);
    if (value.hasMore !== true) {
      const total = typeof value.totalRows === "number" ? value.totalRows : undefined;
      if (total !== undefined && total !== all.length) throw new Error(`table_rows_read reported ${total} rows but returned ${all.length} for ${tableUri}.`);
      return all;
    }
    if (batch.length === 0) throw new Error(`table_rows_read reported more rows but returned an empty batch for ${tableUri}.`);
    offset += batch.length;
  } while (true);
}

function stringifyCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

function csvRows(schema: unknown, rows: Record<string, unknown>[]): Record<string, unknown>[] {
  const columns = isObject(schema) && Array.isArray(schema.columns) && schema.columns.every(isObject) ? schema.columns : [];
  const labels = new Map<string, string>();
  const used = new Set<string>(["rowId"]);
  for (const column of columns) {
    const id = stringValue(column.columnId) ?? stringValue(column.id);
    if (!id) continue;
    const base = firstString(column, ["name"], id);
    let label = base;
    if (used.has(label)) label = `${base} (${id})`;
    used.add(label);
    labels.set(id, label);
  }
  return rows.map((row) => {
    const normalized: Record<string, unknown> = {};
    if (row.rowId !== undefined) normalized.rowId = row.rowId;
    const values = isObject(row.values) ? row.values : undefined;
    if (!values) return { ...normalized, ...row };
    for (const [columnId, value] of Object.entries(values)) normalized[labels.get(columnId) ?? columnId] = value;
    return normalized;
  });
}

function csv(rows: Record<string, unknown>[]): string {
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))].sort();
  const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
  return [headers.map(escape).join(","), ...rows.map((row) => headers.map((header) => escape(stringifyCell(row[header]))).join(","))].join("\n") + "\n";
}

type AssetCandidate = { source?: string; base64?: string; mimeType?: string };

const mediaField = /(?:image|media|attachment|file|cover|thumbnail|photo|asset|icon)/i;

function assetCandidates(value: unknown, candidates: AssetCandidate[] = [], mediaContext = false): AssetCandidate[] {
  if (typeof value === "string") {
    for (const match of value.matchAll(/!\[[^\]]*\]\((data:[^)]+|https?:\/\/[^)\s]+)\)|<img[^>]+src=["'](data:[^"']+|https?:\/\/[^"'\s]+)["']/gi)) {
      const source = match[1] ?? match[2];
      if (source?.startsWith("data:")) candidates.push({ base64: source });
      else if (source) candidates.push({ source });
    }
    if (mediaContext) {
      if (value.startsWith("data:")) candidates.push({ base64: value });
      else if (/^https?:\/\//i.test(value)) candidates.push({ source: value });
    }
    return candidates;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => assetCandidates(item, candidates, mediaContext));
    return candidates;
  }
  if (!isObject(value)) return candidates;
  const kind = [value.type, value.kind, value.mimeType, value.mediaType].filter((item): item is string => typeof item === "string").join(" ").toLowerCase();
  const source = ["imageUrl", "image_url", "thumbnailUrl", "thumbnail_url", "assetUrl", "asset_url", "downloadUrl", "download_url", "src", "url", "uri"]
    .map((key) => stringValue(value[key]))
    .find(Boolean);
  const base64 = stringValue(value.data) ?? stringValue(value.base64);
  const sourceLooksLikeMedia = source ? /\.(apng|avif|gif|jpe?g|png|svg|webp|bmp|tiff?|mp3|mp4|mov|webm|pdf)(?:[?#]|$)/i.test(source) : false;
  if ((/\b(image|media|attachment|file|audio|video)\b/.test(kind) || sourceLooksLikeMedia || mediaContext) && (source || base64)) {
    candidates.push({ source, base64, mimeType: stringValue(value.mimeType) ?? stringValue(value.mediaType) });
  }
  for (const [key, nested] of Object.entries(value)) assetCandidates(nested, candidates, mediaContext || mediaField.test(key));
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
    const source = candidate.source ?? "inline MCP content";
    const existing = assets.get(digest);
    if (!existing) {
      await mkdir(join(root, "assets"), { recursive: true });
      await writeFile(join(root, archivePath), bytes, { flag: "wx" });
      assets.set(digest, { source, sources: [source], path: archivePath, sha256: digest, bytes: bytes.byteLength, mimeType });
    } else if (!existing.sources.includes(source)) {
      existing.sources.push(source);
      existing.sources.sort();
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

function serializablePlan(plan: ToolPlan): Record<string, string> {
  return Object.fromEntries(Object.entries(plan).map(([role, tool]) => [role, tool.name]));
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
    const decoded = await transcript.call("document-uri", plan.urlConvert, { action: "decode", url: DOCUMENT_URL, scope: "document" });
    if (!isObject(decoded) || !stringValue(decoded.uri)) throw new Error("url_convert did not return a stable document URI.");
    const documentUri = decoded.uri as string;
    const outlinePages = await readDocumentOutline(transcript, plan, documentUri);
    if (outlinePages.length === 0) throw new Error("The document contains no readable pages; archive aborted.");

    const pageIds = new Set<string>();
    const tablesByUri = new Map<string, { descriptor: Record<string, unknown>; sourcePages: Set<string> }>();
    const pages: Page[] = [];
    for (const outline of outlinePages) {
      const id = firstString(outline, ["pageId", "id"], "");
      if (!id) throw new Error("document_outline returned a page without a stable pageId.");
      if (pageIds.has(id)) throw new Error(`Duplicate page ID ${id}.`);
      pageIds.add(id);
      const relativePageUri = firstString(outline, ["pageUri"], `pages/${id}`);
      const pageUri = absoluteResourceUri(documentUri, relativePageUri);
      const metadata = await transcript.call(`page-describe-${id}`, plan.pageDescribe, { uri: pageUri });
      if (!isObject(metadata)) throw new Error(`page_describe returned a non-object result for ${pageUri}.`);
      const captured = await readPageContent(transcript, plan, pageUri);
      for (const descriptor of captured.tables) {
        const relativeTableUri = stringValue(descriptor.sourceTableUri) ?? stringValue(descriptor.tableUri);
        if (!relativeTableUri) throw new Error(`content_read returned a table without a URI on page ${id}.`);
        const tableUri = absoluteResourceUri(documentUri, relativeTableUri);
        const entry = tablesByUri.get(tableUri) ?? { descriptor, sourcePages: new Set<string>() };
        entry.sourcePages.add(id);
        tablesByUri.set(tableUri, entry);
      }
      const parentId = pageIdFromUri(outline.parentPageUri);
      pages.push({
        id,
        title: firstString(outline, ["title", "name"], id),
        parentId,
        outline,
        metadata,
        markdown: captured.markdown,
        contentResponses: captured.responses,
      });
    }
    for (const page of pages) if (page.parentId && !pageIds.has(page.parentId)) throw new Error(`Page ${page.id} refers to missing parent ${page.parentId}.`);

    const tableIds = new Set<string>();
    const tables: Table[] = [];
    for (const [uri, entry] of [...tablesByUri.entries()].sort(([left], [right]) => left.localeCompare(right))) {
      const id = tableIdFromUri(uri);
      if (!id) throw new Error(`Unable to derive a stable table ID from ${uri}.`);
      if (tableIds.has(id)) throw new Error(`Duplicate table ID ${id}.`);
      tableIds.add(id);
      const schema = await transcript.call(`table-${id}`, plan.tableColumnsRead, { uri, include: ["formats", "views"] });
      const rows = await readTableRows(transcript, plan, uri);
      tables.push({
        id,
        name: firstString(entry.descriptor, ["name", "title"], id),
        uri,
        sourcePages: [...entry.sourcePages].sort(),
        descriptor: entry.descriptor,
        schema,
        rows,
      });
    }

    const { assets, replacements } = await saveAssets(stage, transcript.responses);
    for (const page of pages) {
      const path = `pages/${slug(page.title, page.id)}-${slug(page.id)}.md`;
      const content = localizeMarkdown(page.markdown, replacements);
      const body = content || "No textual representation was returned; see raw MCP responses.";
      await mkdir(join(stage, dirname(path)), { recursive: true });
      await writeFile(join(stage, path), `# ${page.title}\n\n${body.replace(/^# .+\n+/, "")}`.trimEnd() + "\n", "utf8");
      await writeJson(join(stage, `pages/${slug(page.title, page.id)}-${slug(page.id)}.json`), {
        outline: page.outline,
        metadata: page.metadata,
        content: page.contentResponses,
      });
    }
    for (const table of tables) {
      const dir = `tables/${slug(table.name, table.id)}-${slug(table.id)}`;
      await writeJson(join(stage, `${dir}/schema.json`), { descriptor: table.descriptor, schema: table.schema, uri: table.uri, sourcePages: table.sourcePages });
      await writeJson(join(stage, `${dir}/rows.json`), table.rows);
      await writeFile(join(stage, `${dir}/rows.csv`), csv(csvRows(table.schema, table.rows)), "utf8");
    }

    const fileIndex = await files(stage);
    const manifest = {
      schemaVersion: SCHEMA_VERSION,
      capturedAt: now.toISOString(),
      source: { documentUrl: DOCUMENT_URL, documentId: DOCUMENT_ID, resourceUri: documentUri, endpoint: "https://docs.superhuman.com/apis/mcp" },
      toolPlan: serializablePlan(plan),
      inventory: {
        pages: pages.map((page) => ({ id: page.id, title: page.title, parentId: page.parentId, markdown: `pages/${slug(page.title, page.id)}-${slug(page.id)}.md`, raw: `pages/${slug(page.title, page.id)}-${slug(page.id)}.json` })),
        tables: tables.map((table) => ({ id: table.id, name: table.name, rows: table.rows.length, directory: `tables/${slug(table.name, table.id)}-${slug(table.id)}`, uri: table.uri, sourcePages: table.sourcePages })),
        assets,
      },
      counts: { pages: pages.length, tables: tables.length, rows: tables.reduce((sum, table) => sum + table.rows.length, 0), assets: assets.length, toolCalls: transcript.count },
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
