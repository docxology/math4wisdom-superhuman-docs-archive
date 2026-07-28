import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

import { MCP_ENDPOINT } from "./constants.js";
import { isObject } from "./json.js";

export type ToolDefinition = {
  name: string;
  description?: string;
  inputSchema: {
    type: "object";
    properties?: Record<string, object>;
    required?: string[];
    [key: string]: unknown;
  };
  annotations?: { readOnlyHint?: boolean; destructiveHint?: boolean };
  [key: string]: unknown;
};

export interface McpClient {
  listTools(): Promise<ToolDefinition[]>;
  callTool(name: string, args: Record<string, unknown>): Promise<unknown>;
  close(): Promise<void>;
}

export async function connectSuperhumanDocs(token: string): Promise<McpClient> {
  if (!token.trim()) throw new Error("An MCP token is required.");

  const transport = new StreamableHTTPClientTransport(new URL(MCP_ENDPOINT), {
    requestInit: { headers: { Authorization: `Bearer ${token}` } },
  });
  const client = new Client(
    { name: "math4wisdom-superhuman-docs-archive", version: "0.1.0" },
    { capabilities: {} },
  );
  await client.connect(transport);

  return {
    async listTools(): Promise<ToolDefinition[]> {
      const all: ToolDefinition[] = [];
      const seen = new Set<string>();
      let cursor: string | undefined;
      do {
        const response = await client.listTools(cursor ? { cursor } : undefined);
        all.push(...(response.tools as ToolDefinition[]));
        const next = isObject(response) && typeof response.nextCursor === "string" ? response.nextCursor : undefined;
        if (!next || seen.has(next)) return all;
        seen.add(next);
        cursor = next;
      } while (true);
    },
    async callTool(name, args): Promise<unknown> {
      return client.callTool({ name, arguments: args });
    },
    async close(): Promise<void> {
      await transport.close();
    },
  };
}
