# Archive format

Each directory below `archive/snapshots/` is an immutable UTC capture. `archive/.staging/` is transient and ignored by Git.

```text
snapshot/
  manifest.json
  raw/
    tool-catalog.json
    mcp-00001-*.json
  pages/
    <title>-<page-id>.json
    <title>-<page-id>.md
  tables/
    <name>-<table-id>/
      schema.json
      rows.json
      rows.csv
  assets/
    <sha256>.<extension>
```

`raw/` is the source of truth: it holds the complete tool catalog and every MCP request/response boundary, excluding credentials. Page Markdown, table CSV, the inventory, and the asset index are projections generated from these responses.

`manifest.json` has schema version `1` and contains:

- source URL, internal document ID, capture timestamp, and official MCP endpoint;
- the discovered tool names used for the capture;
- page hierarchy, table inventories, media records, and aggregate counts;
- a SHA-256 digest and byte size for every archive file written before the manifest.

Media file names are SHA-256 hashes. Multiple document references to identical bytes use one file and retain their source URLs in the raw MCP transcript. Image magic bytes are checked when the content type makes a conflicting claim.

`npm run validate` verifies paths, IDs, parent references, media digests, and all manifest file digests. It intentionally treats an incomplete or malformed snapshot as invalid rather than repairing it.
