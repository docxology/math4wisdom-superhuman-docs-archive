# Archive and verification manuscript

The numbered Markdown files are the canonical technical report. The report
uses the [structured snapshot manifest](../../archive/snapshots/2026-07-28T19-26-53-926Z/manifest.json)
and [rendered-image inventory](../../archive/rendered-images/consolidated-inventory.json),
with [the deterministic test suite](../../test/archive.test.ts) as evidence of
the local writer and verifier's behavior. The table contains aggregate counts.
Source prose and images remain in their original archive records.

Use Node.js 22 or later and a clean [Template checkout at
`87704feae0a4490ef7dad9c931d268e8c30273c2`](https://github.com/docxology/template/tree/87704feae0a4490ef7dad9c931d268e8c30273c2)
with its locked environment, Pandoc, pandoc-crossref and XeLaTeX. From this
repository root, set `TEMPLATE_ROOT` to that checkout's absolute path.

```sh
project="$TEMPLATE_ROOT/projects/working/math4wisdom-superhuman-docs-archive"
git worktree add --detach "$project" HEAD
node "$project/scripts/stage-manuscript-evidence.mjs"
cd "$TEMPLATE_ROOT"
uv run --no-sync python scripts/pipeline/stage_03_render.py \
  --project working/math4wisdom-superhuman-docs-archive
uv run --no-sync python scripts/pipeline/stage_04_validate.py \
  --project working/math4wisdom-superhuman-docs-archive
```

For a sparse worktree, retain `docs/manuscript/`, `scripts/stage-manuscript-evidence.mjs`
and the two evidence JSON files above. Staging checks the public record digests
and aggregate consistency before creating a CSV for Template validation. The
reader files are under `output/pdf/` and `output/web/`, with checks in
`output/reports/` inside the worktree. The [validation guide](../VALIDATION.md)
covers native fixture checks and full local snapshot verification.
