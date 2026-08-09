import { isObject } from "./json.js";
import type { ToolDefinition } from "./mcp.js";

export type ToolRole = "urlConvert" | "documentOutline" | "pageDescribe" | "contentRead" | "tableColumnsRead" | "tableRowsRead";

export type ToolPlan = Record<ToolRole, ToolDefinition>;

const expectedTools: Record<ToolRole, { name: string; required: string[] }> = {
  urlConvert: { name: "url_convert", required: ["action"] },
  documentOutline: { name: "document_outline", required: ["uri"] },
  pageDescribe: { name: "page_describe", required: ["uri"] },
  contentRead: { name: "content_read", required: ["uri", "contentTypesToInclude"] },
  tableColumnsRead: { name: "table_columns_read", required: ["uri"] },
  tableRowsRead: { name: "table_rows_read", required: ["uri"] },
};

const mutating = /\b(create|update|delete|remove|write|modify|edit|insert|archive|manage)\b/i;

function isReadOnly(tool: ToolDefinition): boolean {
  return tool.annotations?.readOnlyHint === true
    && !tool.annotations?.destructiveHint
    // Tool descriptions are instructional prose and may refer to a separate
    // write workflow. The exact resource-reader name and vendor annotation are
    // the stable authority for this strictly allowlisted archive path.
    && !mutating.test(tool.name);
}

function supports(tool: ToolDefinition, required: string[]): boolean {
  const properties = tool.inputSchema.properties ?? {};
  return required.every((name) => name in properties);
}

/**
 * Select the vendor's documented resource-URI read path exactly.  The archive
 * deliberately does not guess between similarly worded read-only tools such
 * as formula evaluation or name matching.
 */
export function resolveToolPlan(tools: ToolDefinition[]): ToolPlan {
  const selected = {} as Partial<ToolPlan>;
  for (const [role, expected] of Object.entries(expectedTools) as [ToolRole, { name: string; required: string[] }][]) {
    const candidates = tools.filter((tool) => tool.name === expected.name && isReadOnly(tool) && supports(tool, expected.required));
    if (candidates.length !== 1) {
      const names = candidates.map((tool) => tool.name).join(", ") || "none";
      throw new Error(`Expected exactly one read-only ${role} MCP tool (${expected.name}); found ${names}.`);
    }
    selected[role] = candidates[0];
  }
  return selected as ToolPlan;
}

/**
 * Superhuman currently wraps many structured results in a JSON text block of
 * the form `{ toolName, result }`; retain the unwrapped result for projections
 * while the raw wrapper remains in the transcript.
 */
export function unwrapToolResult(result: unknown): unknown {
  let value = result;
  if (isObject(value) && value.structuredContent !== undefined) value = value.structuredContent;
  else if (isObject(value) && value.toolResult !== undefined) value = value.toolResult;
  else if (isObject(value) && Array.isArray(value.content) && value.content.length === 1 && isObject(value.content[0]) && typeof value.content[0].text === "string") {
    const text = value.content[0].text;
    try { value = JSON.parse(text); } catch { value = text; }
  }
  if (isObject(value) && isObject(value.result) && typeof value.toolName === "string") return value.result;
  return value;
}

export function pageIdFromUri(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const match = /(?:^|\/)pages\/([^/?#]+)/.exec(value);
  return match?.[1];
}

export function absoluteResourceUri(documentUri: string, resourceUri: string): string {
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(resourceUri)) return resourceUri;
  const base = documentUri.replace(/#.*$/, "").replace(/\/+$/, "");
  return `${base}/${resourceUri.replace(/^\/+/, "")}`;
}
