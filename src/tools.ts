import { DOCUMENT_ID, DOCUMENT_URL } from "./constants.js";
import { isObject } from "./json.js";
import type { ToolDefinition } from "./mcp.js";

export type ToolRole = "document" | "listPages" | "getPage" | "listTables" | "getTable" | "listRows";

export type ToolPlan = Record<ToolRole, ToolDefinition | undefined>;

const roles: Record<ToolRole, RegExp[]> = {
  document: [/\b(get|read|fetch|retrieve)\b.*\b(doc|document)\b/i, /\b(doc|document)\b.*\b(get|read|fetch|retrieve)\b/i],
  listPages: [/\b(list|search|browse|enumerate)\b.*\bpages?\b/i, /\bpages?\b.*\b(list|search|browse|enumerate)\b/i],
  getPage: [/\b(get|read|fetch|retrieve)\b.*\bpages?\b/i, /\bpages?\b.*\b(get|read|fetch|retrieve)\b/i],
  listTables: [/\b(list|search|browse|enumerate)\b.*\btables?\b/i, /\btables?\b.*\b(list|search|browse|enumerate)\b/i],
  getTable: [/\b(get|read|fetch|retrieve)\b.*\btables?\b/i, /\btables?\b.*\b(get|read|fetch|retrieve)\b/i],
  listRows: [/\b(list|search|browse|enumerate|read)\b.*\brows?\b/i, /\brows?\b.*\b(list|search|browse|enumerate|read)\b/i],
};

const mutating = /\b(create|update|delete|remove|write|modify|edit|insert|archive)\b/i;

function score(role: ToolRole, tool: ToolDefinition): number {
  if (tool.annotations?.readOnlyHint === false || tool.annotations?.destructiveHint || mutating.test(`${tool.name} ${tool.description ?? ""}`)) return -1;
  const text = `${tool.name.replaceAll(/[_-]/g, " ")} ${tool.description ?? ""}`;
  const subject = role === "document" ? /\b(doc|document)\b/i : role.includes("Page") ? /\bpages?\b/i : role.includes("Table") ? /\btables?\b/i : /\brows?\b/i;
  if (!subject.test(text)) return -1;
  let value = 0;
  for (const pattern of roles[role]) if (pattern.test(text)) value += 10;
  if (role === "document" && /\b(doc|document)\b/i.test(text)) value += 2;
  if (role.includes("Page") && /\bpage\b/i.test(text)) value += 2;
  if (role.includes("Table") && /\btable\b/i.test(text)) value += 2;
  if (role === "listRows" && /\brow\b/i.test(text)) value += 2;
  if (/\b(list|search|browse|enumerate)\b/i.test(text) && role.startsWith("list")) value += 3;
  if (/\b(get|read|fetch|retrieve)\b/i.test(text) && role.startsWith("get")) value += 3;
  return value;
}

export function resolveToolPlan(tools: ToolDefinition[]): ToolPlan {
  const plan: ToolPlan = {
    document: undefined,
    listPages: undefined,
    getPage: undefined,
    listTables: undefined,
    getTable: undefined,
    listRows: undefined,
  };
  for (const role of Object.keys(roles) as ToolRole[]) {
    const ranked = tools
      .map((tool) => ({ tool, score: score(role, tool) }))
      .filter((candidate) => candidate.score > 0)
      .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name));
    if (ranked.length === 0) continue;
    if (ranked.length > 1 && ranked[0].score === ranked[1].score) {
      throw new Error(`Ambiguous ${role} MCP tools: ${ranked.filter((item) => item.score === ranked[0].score).map((item) => item.tool.name).join(", ")}.`);
    }
    plan[role] = ranked[0].tool;
  }
  if (!plan.listPages || !plan.getPage || !plan.listTables || !plan.getTable || !plan.listRows) {
    const missing = (Object.entries(plan) as [ToolRole, ToolDefinition | undefined][]).filter(([, tool]) => !tool).map(([role]) => role);
    throw new Error(`The MCP tool catalog does not expose an unambiguous, read-only archive path. Missing: ${missing.join(", ")}.`);
  }
  return plan;
}

type Target = { documentId?: string; documentUrl?: string; pageId?: string; tableId?: string; cursor?: string };

export function toolArguments(tool: ToolDefinition, target: Target): Record<string, unknown> {
  const required = new Set(tool.inputSchema.required ?? []);
  const properties = tool.inputSchema.properties ?? {};
  const args: Record<string, unknown> = {};
  for (const name of Object.keys(properties)) {
    const lower = name.toLowerCase();
    if (/cursor|page.?token|next.?token/.test(lower) && target.cursor) args[name] = target.cursor;
    else if (/limit|page.?size|max.?results/.test(lower)) args[name] = 100;
    else if (/doc.*url|document.*url|^url$/.test(lower) && target.documentUrl) args[name] = target.documentUrl;
    else if (/(doc|document).*(id|ref|identifier)|^(doc|document)$/.test(lower) && target.documentId) args[name] = target.documentId;
    else if (/page.*(id|ref|identifier)|^page$/.test(lower) && target.pageId) args[name] = target.pageId;
    else if (/table.*(id|ref|identifier)|^table$/.test(lower) && target.tableId) args[name] = target.tableId;
    else if (/^id$/.test(lower)) {
      args[name] = target.pageId ?? target.tableId ?? target.documentId ?? DOCUMENT_ID;
    }
  }
  const missing = [...required].filter((name) => args[name] === undefined);
  if (missing.length > 0) {
    throw new Error(`Cannot safely supply required MCP arguments for ${tool.name}: ${missing.join(", ")}. Tool schema is preserved in the discovery output for review.`);
  }
  return args;
}

export function docTarget(): Required<Pick<Target, "documentId" | "documentUrl">> {
  return { documentId: DOCUMENT_ID, documentUrl: DOCUMENT_URL };
}

export function unwrapToolResult(result: unknown): unknown {
  if (!isObject(result)) return result;
  if (result.structuredContent !== undefined) return result.structuredContent;
  if (result.toolResult !== undefined) return result.toolResult;
  if (Array.isArray(result.content)) {
    const content = result.content;
    if (content.length === 1 && isObject(content[0]) && typeof content[0].text === "string") {
      try { return JSON.parse(content[0].text); } catch { return content[0].text; }
    }
  }
  return result;
}

export function collection(value: unknown, preferred: string[]): Record<string, unknown>[] {
  if (Array.isArray(value) && value.every(isObject)) return value;
  if (isObject(value)) {
    for (const key of preferred) if (Array.isArray(value[key]) && value[key].every(isObject)) return value[key] as Record<string, unknown>[];
    for (const nested of Object.values(value)) {
      if (Array.isArray(nested) && nested.every(isObject)) return nested;
    }
  }
  throw new Error(`Expected a collection (${preferred.join(", ")}) in MCP response.`);
}

export function nextCursor(value: unknown): string | undefined {
  if (!isObject(value)) return undefined;
  for (const key of ["nextCursor", "next_cursor", "cursor", "nextPageToken", "next_page_token"]) {
    if (typeof value[key] === "string" && value[key]) return value[key] as string;
  }
  return undefined;
}

export function entityId(value: Record<string, unknown>, kind: "page" | "table"): string {
  for (const key of [`${kind}Id`, `${kind}_id`, "id"]) if (typeof value[key] === "string" && value[key]) return value[key] as string;
  throw new Error(`A ${kind} response is missing a stable ID.`);
}
