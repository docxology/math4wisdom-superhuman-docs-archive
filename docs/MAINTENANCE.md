# Maintenance and publication

## Refresh policy

Treat the current snapshot as immutable. A refresh is a new staging run, followed by validation and a deliberate comparison against the canonical snapshot. Do not append a second copy of the same full document to `archive/`.

## Consolidation policy

Keep exactly one structured snapshot and one rendered-image inventory. If a refresh supersedes an older snapshot, remove the older tree in the same reviewed commit. Keep provenance in the surviving manifest and in `docs/`, not as duplicate payloads.

## Pull/push checklist

```sh
git status --short --branch
git diff --check
npm test
npm run validate
git add README.md IMAGE_COVERAGE.md docs archive scripts package.json
git diff --cached --check
git commit -m "Describe the archive maintenance change"
git push origin HEAD:main
git ls-remote origin refs/heads/main
```

The commit hash returned by `git ls-remote` must equal the reviewed local `HEAD`. Verify the public repository path and visibility separately; a pushed branch is not evidence that the working tree is clean.

## Change discipline

Generated artifacts must be changed through their writer or consolidation script. Do not hand-edit a manifest to make a partial capture appear complete. Record any coverage limitation explicitly and preserve unrelated working-tree changes.
