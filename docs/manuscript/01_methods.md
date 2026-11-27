# Capture and local verification {#sec:methods}

The writer obtains page and table inventories from the official read-only
connection. It retains source identifiers, page relationships and the original
successful response payloads. Markdown makes the page projection readable.
JSON retains structured rows, while CSV encodes nested cell values as JSON.
The source manifest records the selected tools, inventories and per-file SHA-256
digests [@snapshot; @sha256].

The writer uses a staging directory and validates the completed contents
before publishing a timestamped snapshot. A failed capture is reported and no
new snapshot is finalized. When the structured capture emits media, the file
name is derived from the payload digest so references to the same bytes share
the stored object. The published structured manifest records no stored
MCP-emitted assets. Image appearances observed in rendered public pages are
recorded separately by exact URL, with occurrence counts, page references, alt
text and available dimensions [@images].

The offline tests exercise success through the actual writer and verifier with
a synthetic client and deterministic image bytes. Separate tests check refusal
of ambiguous or write-like catalog choices and detection of altered page bytes
[@fixtures]. These fixtures exercise archive behavior and do not contain the
public document's text or images.
