# Archive architecture

## Source boundary

The source document is the public Math4Wisdom document at <https://docs.superhuman.com/d/Math4Wisdom_d0SvdI3KSto/>. Structured text, page hierarchy, tables, rows, links, and MCP-emitted media come only from the official Superhuman Docs MCP endpoint:

`https://docs.superhuman.com/apis/mcp`

Public rendered-page image observations are a separate, read-only browser inventory. External links are recorded but never crawled.

## Canonical layout

```text
archive/
├── snapshots/<timestamp>/
│   ├── manifest.json             # source identity, counts, checksums
│   ├── pages/                    # one JSON result and one Markdown view per page
│   ├── tables/                   # schema, rows.json, and lossless rows.csv
│   ├── raw/                      # original successful MCP responses
│   └── media/                    # MCP-emitted media, content addressed by SHA-256
└── rendered-images/
    └── consolidated-inventory.json
```

Only one structured snapshot is published. A refresh must produce a new validated snapshot, compare it with the current canonical snapshot, and replace the canonical pointer intentionally; timestamped duplicates are not retained in the public tree.

## Content addressing and idempotence

- Snapshot files are listed in `manifest.json` with byte counts and SHA-256 digests.
- MCP-emitted media uses SHA-256 content-addressed paths, so repeated downloads do not create semantic duplicates.
- The rendered inventory groups occurrences by exact source URL and stores `occurrenceCount` plus the pages in which the URL appears.
- `scripts/consolidate-image-inventory.mjs` is deterministic: the same input produces byte-stable JSON ordering and counts.

## What is authoritative

For text, tables, rows, links, and embedded media, the canonical snapshot manifest and its checksums are authoritative. For public rendered-page image coverage, `consolidated-inventory.json` is authoritative. Historical captures that duplicated these materials have been removed from the published tree.
