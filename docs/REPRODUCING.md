# Reproducing the archive

## Prerequisites

- Node.js 22 or newer.
- npm dependencies installed with `npm ci`.
- A fresh personal access token restricted to Superhuman Docs MCP and read-only access.
- Access to the public Math4Wisdom document.

## Token-safe setup

Never put the token in a command argument, shell history, repository file, log, issue, or chat message. Supply it only to the current process:

```sh
npm ci
read -rs SUPERHUMAN_DOCS_MCP_TOKEN
export SUPERHUMAN_DOCS_MCP_TOKEN
npm run discover
```

The extractor accepts only `SUPERHUMAN_DOCS_MCP_TOKEN` and must be configured against the official MCP endpoint. Do not inspect browser cookies, passwords, local storage, profiles, or session data.

## Safe extraction sequence

```sh
npm run discover
npm run dry-run
npm run archive
npm run validate
npm test
```

`discover` prints the MCP catalog and selected read-only plan. `dry-run` verifies tool mapping without writing a snapshot. `archive` stages all output and publishes it only after tool-call, media, derived-file, and checksum checks succeed. `validate` verifies the newest completed snapshot. Tests run without a network or token.

## Rendered image inventory

The browser capture is an input inventory, not a fallback document API. Once a capture JSON has been produced, consolidate it with:

```sh
npm run consolidate:images -- capture.json archive/rendered-images/consolidated-inventory.json
```

The command is safe to rerun. It removes known UI/icon patterns and measured images at or below 64 px, then groups the remaining occurrences by exact source URL.
