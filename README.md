# Math4Wisdom Superhuman Docs Archive

This is a local-only, Git-tracked archive of the Math4Wisdom document at <https://docs.superhuman.com/d/Math4Wisdom_d0SvdI3KSto/>. It deliberately uses the official Superhuman Docs MCP endpoint and fails closed: it does not scrape the public document endpoint or attempt to work around missing access.

## First use

1. In Superhuman Docs, create a personal access token restricted to MCP and **read-only** access. Configure it in Codex as described in the [official setup guide](https://help.superhuman.com/hc/en-us/articles/46210076980365-Connect-to-the-Superhuman-Docs-MCP).
2. In a fresh shell, install dependencies and provide the same token only for the current process:

   ```sh
   npm ci
   read -rs SUPERHUMAN_DOCS_MCP_TOKEN
   export SUPERHUMAN_DOCS_MCP_TOKEN
   npm run discover
   ```

   Do not paste the token into a tracked file, terminal command, issue, or chat.
3. Confirm the catalog is read-only and contains unambiguous page, table, and row tools, then run:

   ```sh
   npm run dry-run
   npm run archive
   npm run validate
   ```

`archive` writes a new immutable timestamped snapshot only after all tool calls, media downloads, derived files, and checksum validation have succeeded. A failed run removes its staging directory and leaves prior snapshots untouched.

## What is captured

- The complete page inventory and each page's original MCP result, plus a normalized Markdown view.
- Each table's original MCP result, rows in JSON, and a lossless CSV representation where nested values are JSON-encoded in cells.
- MCP-emitted embedded image/media data and URLs, stored locally by SHA-256 content hash.
- A per-snapshot `manifest.json` with source identity, tool plan, inventories, counts, file digests, and media metadata.

The archive boundary is the document and its embedded tables/media. Linked external websites are recorded as links but are never crawled.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run discover` | Print live MCP tool definitions and the selected read-only tool plan. |
| `npm run dry-run` | Verify the MCP catalog can be mapped safely; writes no snapshot. |
| `npm run archive` | Capture a new validated snapshot. |
| `npm run validate [-- path]` | Verify the latest (or named) snapshot's structure and checksums. |
| `npm test` | Run deterministic unit tests without a network or token. |

## Security and scope

Only `SUPERHUMAN_DOCS_MCP_TOKEN` is accepted, from the current process environment. It is never written to raw responses, manifests, logs, or Git. The extractor rejects write-like tools, ambiguous tool matches, missing required object IDs, cyclic pagination, missing page parents, failed media downloads, MIME inconsistencies, and checksum failures.

The official MCP endpoint is `https://docs.superhuman.com/apis/mcp`. Superhuman recommends OAuth where available and least-privilege access; Codex's documented integration uses a personal access token. See their [connection guide](https://help.superhuman.com/hc/en-us/articles/46210076980365-Connect-to-the-Superhuman-Docs-MCP) and [security guidance](https://help.coda.io/hc/en-us/articles/44722769665549-Security-recommendations-for-the-Coda-MCP).
