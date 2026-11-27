# Evidence retained with the archive {#sec:evidence}

The selected structured manifest and rendered-image inventory define different
units of measurement. The manifest counts captured objects and lists files
covered by digests. The rendered inventory counts visual occurrences and
groups them by recorded URL [@snapshot; @images].

| Record | Measurement | Count |
|:--|:--|--:|
| Structured snapshot | Pages | 296 |
| Structured snapshot | Tables | 27 |
| Structured snapshot | Rows | 676 |
| Structured snapshot | Tool calls | 936 |
| Structured snapshot | Files listed in manifest | 1,608 |
| Structured snapshot | Stored MCP media assets | 0 |
| Rendered inventory | Completed public page routes | 296 |
| Rendered inventory | Failed page routes | 0 |
| Rendered inventory | Original image occurrences | 5,622 |
| Rendered inventory | Pruned occurrences | 10 |
| Rendered inventory | Retained occurrences | 5,612 |
| Rendered inventory | Distinct retained image URLs | 5,437 |

: Counts from the published structured manifest and consolidated rendered-image inventory. {#tbl:retained_counts}

Consolidation filters known UI asset URL patterns and measured small images
under the documented rule. An occurrence with unknown intrinsic dimensions
passes the size filter. Grouping by exact URL measures the number of retained
source URLs. It does not establish that the same number of distinct image
payloads exists [@images].
