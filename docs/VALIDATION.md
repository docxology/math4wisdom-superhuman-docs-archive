# Validation and evidence

## Required gates

Run these from the repository root:

```sh
git diff --check
npm test
npm run validate
npm run consolidate:images
```

`npm test` builds TypeScript and runs deterministic tests for snapshot creation, read-only tool selection, and checksum tamper detection. `npm run validate` verifies the canonical snapshot structure and every listed file digest. `npm run consolidate:images` verifies that the image inventory generator can be rerun deterministically.

## Review checks

Before publishing a refresh, confirm:

1. the MCP catalog contains no write-like tool selected by the extractor;
2. the snapshot manifest names the intended document and official endpoint;
3. page, table, row, and failed-call counts are reviewed for unexpected drift;
4. `git diff --check`, tests, and snapshot validation pass;
5. no token-like value or `.env` file is staged;
6. only one canonical snapshot and one consolidated rendered-image inventory remain;
7. the remote branch equals the reviewed local commit.

Green tests do not prove that the source document was unchanged; they prove the local artifact is structurally and cryptographically self-consistent. Treat source drift, browser coverage, and binary materialization as separate evidence questions.
