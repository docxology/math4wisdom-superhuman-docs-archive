# Rendered image coverage

The complete public rendered-page inventory is stored at `archive/rendered-images/2026-08-09-content-inventory/inventory.json`.

- 296/296 page routes were traversed.
- 0 page failures were recorded.
- 5,622 rendered image occurrences were recorded.
- 5,439 unique HTTPS image sources were recorded.
- Coda's `/icons/` UI library was excluded; non-icon CDN assets and Wikimedia assets remain included.

The inventory is complete and idempotent: each occurrence carries its page ID, page title, source URL, alt text, and rendered dimensions. Binary PNG materialization is intentionally not represented as complete in this checkout: the full lossless PNG projection exceeded the available local disk budget. The writer in `src/rendered-images.ts` can materialize it into a larger-volume workspace, and refuses to publish a partial manifest.
