# AGENTS.md — math4wisdom-superhuman-docs-archive

Guidance for agents working in this repository.

## What this repository is

A fail-closed archiver for the Math4Wisdom community's documents. It walks the corpus over the
Superhuman Docs MCP endpoint, writes an immutable snapshot per run, and keeps an inventory of
what it captured and what it could not. Math4Wisdom's material is individually authored and
often only semi-structured, so the archive treats a document it could not retrieve as a
failure to record rather than something to skip past.

Node 22 or newer. TypeScript, ESM.

## Commands

```bash
npm install
npm run build     # tsc --project tsconfig.json
npm test          # build, then node --test dist/test/*.test.js
npm run validate  # verify an archive against its own format
npm run archive   # write a new snapshot
npm run dry-run   # walk the corpus without writing
npm run discover  # enumerate what the endpoint offers
```

`npm run archive:rendered-images` and `npm run consolidate:images` handle the image side of
the corpus; `IMAGE_COVERAGE.md` records how images are accounted for.

## Layout

| Path | Role |
|---|---|
| `src/` | TypeScript sources, including `cli.js` behind every `npm run` entry |
| `scripts/` | Standalone Node scripts not built by `tsc` |
| `archive/` | Written snapshots |
| `test/` | `node --test` suites |
| `docs/` | Documentation |
| `ARCHIVE_FORMAT.md` | **The specification for a snapshot.** Read it before changing anything that writes |
| `BROWSER_AGENT_HANDOFF.md` | Notes for the browser-assisted path through documents the MCP endpoint cannot reach |
| `IMAGE_COVERAGE.md` | How images are discovered, filtered and counted |

## Working here

- **Snapshots are immutable.** Never edit a written run in `archive/`; a new run adds a new one.
  Correcting history in place destroys the property the archive exists to provide.
- **Fail closed.** A document that cannot be retrieved must appear as a recorded failure, never
  as absent. Do not add a silent skip to make a run finish.
- There is no CI workflow. `npm test` is the only gate, and it runs against `dist/`, so a change
  that does not build is not tested.
- Read `ARCHIVE_FORMAT.md` before touching the writer, the manifest shape or the inventory, and
  keep the document in step with the code.
- Browser-driven retrieval is a fallback with its own handoff notes; keep it separate from the
  MCP path rather than merging the two.
