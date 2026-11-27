# Verification limits and reuse {#sec:limits}

A full local snapshot check verifies SHA-256 digests for the files listed in
the manifest, checks page and table identifiers, and confirms that their
required files and page parents exist. The manifest also stores byte counts.
The current verifier does not compare those counts separately or reject
extra unlisted files. These checks establish the tested degree of consistency
with the local manifest. Source
drift, transcription fidelity and completeness beyond the recorded capture
require different evidence.

The report build uses aggregate counts and the identities of two retained
public records. It does not contact the provider or copy page text, page
images, response payloads, or original tables into the paper. The image
inventory is metadata. A complete lossless local PNG projection is outside
the retained archive's coverage. The source document and its embedded
material retain their original attribution and rights.
