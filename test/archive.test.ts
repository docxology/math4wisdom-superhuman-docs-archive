import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { archive, validateExistingSnapshot } from "../src/archive.js";
import type { McpClient, ToolDefinition } from "../src/mcp.js";
import { resolveToolPlan } from "../src/tools.js";

const tools: ToolDefinition[] = [
  { name: "get_document", description: "Read a document", inputSchema: { type: "object", properties: { docId: {} }, required: ["docId"] }, annotations: { readOnlyHint: true } },
  { name: "list_pages", description: "List pages in a document", inputSchema: { type: "object", properties: { docId: {} }, required: ["docId"] }, annotations: { readOnlyHint: true } },
  { name: "get_page", description: "Read a page", inputSchema: { type: "object", properties: { docId: {}, pageId: {} }, required: ["docId", "pageId"] }, annotations: { readOnlyHint: true } },
  { name: "list_tables", description: "List tables in a document", inputSchema: { type: "object", properties: { docId: {} }, required: ["docId"] }, annotations: { readOnlyHint: true } },
  { name: "get_table", description: "Read a table", inputSchema: { type: "object", properties: { docId: {}, tableId: {} }, required: ["docId", "tableId"] }, annotations: { readOnlyHint: true } },
  { name: "list_rows", description: "List rows in a table", inputSchema: { type: "object", properties: { docId: {}, tableId: {} }, required: ["docId", "tableId"] }, annotations: { readOnlyHint: true } },
];

function fixtureClient(): McpClient {
  return {
    listTools: async () => tools,
    callTool: async (name) => {
      const content = {
        get_document: { title: "Math4Wisdom" },
        list_pages: { pages: [{ pageId: "page-1", title: "Introduction" }] },
        get_page: { markdown: "# Introduction\n\nA formal capture.", blocks: [{ type: "image", url: "https://assets.example.test/diagram.png" }] },
        list_tables: { tables: [{ tableId: "table-1", name: "Terms" }] },
        get_table: { columns: [{ name: "Term" }, { name: "Meaning" }] },
        list_rows: { rows: [{ Term: "FEP", Meaning: "Free energy principle" }] },
      }[name];
      if (!content) throw new Error(`Unexpected tool ${name}`);
      return { structuredContent: content };
    },
    close: async () => undefined,
  };
}

test("creates a validated snapshot from read-only MCP responses", async () => {
  const root = await mkdtemp(join(tmpdir(), "math4wisdom-archive-"));
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    assert.equal(String(input), "https://assets.example.test/diagram.png");
    return new Response(new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), { headers: { "content-type": "image/png" } });
  };
  try {
    const result = await archive({ cwd: root, client: fixtureClient(), now: new Date("2026-07-28T15:20:00.000Z") });
    assert.deepEqual({ pages: result.pages, tables: result.tables, assets: result.assets }, { pages: 1, tables: 1, assets: 1 });
    await validateExistingSnapshot(result.snapshot);
    const manifest = JSON.parse(await readFile(join(result.snapshot, "manifest.json"), "utf8"));
    assert.equal(manifest.counts.rows, 1);
    assert.equal(manifest.inventory.assets[0].mimeType, "image/png");
    assert.match(await readFile(join(result.snapshot, "tables/terms-table-1/rows.csv"), "utf8"), /Free energy principle/);
  } finally {
    globalThis.fetch = originalFetch;
    await rm(root, { recursive: true, force: true });
  }
});

test("rejects ambiguous or write-like MCP tools", () => {
  const ambiguous = tools.map((tool) => ({ ...tool }));
  ambiguous.push({ name: "browse_pages", description: "Browse pages in a document", inputSchema: { type: "object" }, annotations: { readOnlyHint: true } });
  assert.throws(() => resolveToolPlan(ambiguous), /Ambiguous listPages/);

  const mutated = tools.map((tool) => tool.name === "list_rows" ? { ...tool, name: "delete_rows", description: "Delete rows in a table" } : tool);
  assert.throws(() => resolveToolPlan(mutated), /Missing: listRows/);
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
