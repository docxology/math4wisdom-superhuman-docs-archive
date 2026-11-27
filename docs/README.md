# Archive documentation

This directory documents the public, read-only Math4Wisdom archive and the workflows used to reproduce and maintain it.

## Start here

- [Archive format](ARCHIVE_FORMAT.md) — file layout and per-snapshot manifest.
- [Architecture](ARCHITECTURE.md) — canonical snapshot, rendered-image inventory, and ownership of each artifact.
- [Reproducing the archive](REPRODUCING.md) — safe MCP setup and a complete extraction run.
- [Image inventory](IMAGE_INVENTORY.md) — rendering coverage, pruning rules, deduplication, and binary-image limitations.
- [Validation](VALIDATION.md) — authoritative checks and what each check proves.
- [Security and privacy](SECURITY.md) — token handling, read-only scope, and prohibited access.
- [Rendered coverage receipt](IMAGE_COVERAGE.md) — retained page/occurrence counts.
- [Connection handoff](BROWSER_AGENT_HANDOFF.md) — provisioning the official read-only MCP connection.
- [Technical manuscript](manuscript/README.md) — capture method, verification evidence, and offline reader build.
- [Review backlog](TODO.md) — recorded review scope.
- [Maintenance](MAINTENANCE.md) — idempotent refreshes, review criteria, and publication procedure.

## Current published state

The public repository contains one canonical structured MCP snapshot:

`archive/snapshots/2026-07-28T19-26-53-926Z/`

It contains 296 pages, 27 tables, 676 rows, normalized Markdown, raw MCP responses, and checksums. Rendered public-page assets are represented by the single deduplicated inventory at `archive/rendered-images/consolidated-inventory.json`.

The archive is intentionally metadata-first for rendered images. It records source URLs, occurrence counts, page references, alt text, and dimensions; it does not claim a complete local PNG projection.
