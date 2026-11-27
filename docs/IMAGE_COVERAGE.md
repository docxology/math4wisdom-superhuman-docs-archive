# Rendered image coverage

The consolidated public rendered-page inventory is stored at `archive/rendered-images/consolidated-inventory.json`.

- 296/296 page routes were traversed.
- 0 page failures were recorded.
- 5,622 raw rendered image occurrences were recorded.
- 10 Coda logo/UI occurrences were pruned.
- 5,612 retained occurrences were consolidated into 5,437 unique HTTPS image sources.
- `/icons/`, favicon, sprite, and `/packs/` UI paths are excluded; measured images at or below 64 px are also excluded.

The inventory is complete and idempotent: each retained source URL has its occurrence count, page references, alt text, and rendered dimensions. Zero-dimension occurrences are retained because the browser did not expose intrinsic size. Binary PNG materialization is intentionally not represented as complete in this checkout: the full lossless PNG projection exceeded the available local disk budget. The writer in `src/rendered-images.ts` can materialize it into a larger-volume workspace, and refuses to publish a partial manifest.
