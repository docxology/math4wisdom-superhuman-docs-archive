import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { archive, validateExistingSnapshot } from "../src/archive.js";
import type { McpClient, ToolDefinition } from "../src/mcp.js";
import { resolveToolPlan } from "../src/tools.js";

const tools: ToolDefinition[] = [
  { name: "url_convert", description: "Convert a document URL to a resource URI", inputSchema: { type: "object", properties: { action: {}, url: {}, scope: {} }, required: ["action"] }, annotations: { readOnlyHint: true } },
  { name: "document_outline", description: "Read a document page outline", inputSchema: { type: "object", properties: { uri: {}, pageLimit: {}, pageOffset: {} }, required: ["uri"] }, annotations: { readOnlyHint: true } },
  { name: "page_describe", description: "Read page metadata", inputSchema: { type: "object", properties: { uri: {} }, required: ["uri"] }, annotations: { readOnlyHint: true } },
  { name: "content_read", description: "Read markdown and table references from a page", inputSchema: { type: "object", properties: { uri: {}, contentTypesToInclude: {}, markdownBlockOffset: {}, markdownBlockLimit: {} }, required: ["uri", "contentTypesToInclude"] }, annotations: { readOnlyHint: true } },
  { name: "table_columns_read", description: "Read a table schema", inputSchema: { type: "object", properties: { uri: {}, include: {} }, required: ["uri"] }, annotations: { readOnlyHint: true } },
  { name: "table_rows_read", description: "Read table rows", inputSchema: { type: "object", properties: { uri: {}, rowLimit: {}, rowOffset: {} }, required: ["uri"] }, annotations: { readOnlyHint: true } },
];

function fixtureClient(): McpClient {
  return {
    listTools: async () => tools,
    callTool: async (name, args) => {
      if (name === "url_convert") return { structuredContent: { uri: "superhuman://docs/test-doc" } };
      if (name === "document_outline") {
        return {
          structuredContent: {
            pages: [{ pageId: "page-1", title: "Introduction", pageUri: "pages/page-1", parentPageUri: null }],
            pagination: { hasMore: false, totalPages: 1 },
          },
        };
      }
      if (name === "page_describe") return { structuredContent: { coverPhoto: "https://assets.example.test/cover.png" } };
      if (name === "content_read") {
        const offset = args.markdownBlockOffset;
        return {
          structuredContent: offset === 0
            ? {
                content: "# Introduction\n\nA formal capture.\n\n![diagram](https://assets.example.test/diagram.png)",
                tables: [{ name: "Terms", tableUri: "tables/table-1", sourceTableUri: "tables/table-1" }],
              }
            : { content: "", tables: [] },
        };
      }
      if (name === "table_columns_read") return { structuredContent: { columns: [{ columnId: "c-term", name: "Term" }, { columnId: "c-meaning", name: "Meaning" }] } };
      if (name === "table_rows_read") {
        return {
          structuredContent: {
            rows: [{ rowId: "row-1", values: { "c-term": { value: "FEP" }, "c-meaning": { value: "Free energy principle" } } }],
            hasMore: false,
            totalRows: 1,
          },
        };
      }
      throw new Error(`Unexpected tool ${name}`);
    },
    close: async () => undefined,
  };
}

test("creates a validated snapshot from read-only MCP responses", async () => {
  const root = await mkdtemp(join(tmpdir(), "math4wisdom-archive-"));
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = String(input);
    assert.ok(["https://assets.example.test/diagram.png", "https://assets.example.test/cover.png"].includes(url));
    const suffix = url.endsWith("cover.png") ? 1 : 2;
    return new Response(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, suffix]), { headers: { "content-type": "image/png" } });
  };
  try {
    const result = await archive({ cwd: root, client: fixtureClient(), now: new Date("2026-07-28T15:20:00.000Z") });
    assert.deepEqual({ pages: result.pages, tables: result.tables, assets: result.assets }, { pages: 1, tables: 1, assets: 2 });
    await validateExistingSnapshot(result.snapshot);
    const manifest = JSON.parse(await readFile(join(result.snapshot, "manifest.json"), "utf8"));
    assert.equal(manifest.counts.rows, 1);
    assert.equal(manifest.inventory.assets.length, 2);
    assert.ok(manifest.inventory.assets.every((asset: { mimeType: string }) => asset.mimeType === "image/png"));
    assert.match(await readFile(join(result.snapshot, "tables/terms-table-1/rows.csv"), "utf8"), /Free energy principle/);
  } finally {
    globalThis.fetch = originalFetch;
    await rm(root, { recursive: true, force: true });
  }
});

test("rejects ambiguous or write-like MCP tools", () => {
  const ambiguous = tools.map((tool) => ({ ...tool }));
  ambiguous.push({ ...tools.find((tool) => tool.name === "content_read")! });
  assert.throws(() => resolveToolPlan(ambiguous), /Expected exactly one read-only contentRead/);

  const mutated = tools.map((tool) => tool.name === "table_rows_read"
    ? { ...tool, name: "table_rows_manage", description: "Manage rows in a table", annotations: { readOnlyHint: false } }
    : tool);
  assert.throws(() => resolveToolPlan(mutated), /Expected exactly one read-only tableRowsRead/);
});

test("detects post-capture checksum changes", async () => {
  const root = await mkdtemp(join(tmpdir(), "math4wisdom-archive-"));
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), { headers: { "content-type": "image/png" } });
  try {
    const result = await archive({ cwd: root, client: fixtureClient(), now: new Date("2026-07-28T15:21:00.000Z") });
    await writeFile(join(result.snapshot, "pages/introduction-page-1.md"), "tampered\n");
    await assert.rejects(() => validateExistingSnapshot(result.snapshot), /Checksum mismatch/);
  } finally {
    globalThis.fetch = originalFetch;
    await rm(root, { recursive: true, force: true });
  }
});
