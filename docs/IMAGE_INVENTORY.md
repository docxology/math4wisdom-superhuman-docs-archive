# Image inventory

## Published coverage

The current inventory traversed 296/296 public page routes with zero page failures. It records 5,622 raw occurrences. Ten Coda logo/UI occurrences are pruned, leaving 5,612 occurrences grouped into 5,437 unique source URLs.

Each retained asset records:

- exact `sourceUrl`;
- total `occurrenceCount`;
- page IDs and page titles;
- observed dimensions;
- non-empty alt text values.

## Pruning rules

The consolidation script removes an occurrence when its source URL matches `/icons/`, `favicon`, `sprite`, or `/packs/`, or when both intrinsic dimensions are known and either dimension is 64 pixels or smaller. Zero-dimension observations are retained because the browser did not expose intrinsic size; dropping them would be an unsupported content claim.

The rules are explicit in the inventory's `pruning` object and implemented in `scripts/consolidate-image-inventory.mjs`. Do not hand-edit the generated inventory; change the generator and regenerate it.

## Deduplication model

The same URL can occur on many pages. The inventory stores it once and records all page references, so repeated occurrences do not duplicate a source record. This is independent of binary downloads: the repository currently publishes a complete URL/metadata inventory, not a complete local PNG corpus.

## Binary-image boundary

The full lossless PNG projection was not materialized because it exceeded the available local disk budget. The repository therefore does not claim that every inventory URL has a corresponding local PNG. A future binary materialization must run in a larger-volume workspace, verify content types and checksums, and publish only a complete manifest.
