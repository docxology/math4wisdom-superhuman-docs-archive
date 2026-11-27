# Math4Wisdom Superhuman Docs Archive

The repository contains a timestamped structured snapshot of the public
[Math4Wisdom document](https://docs.superhuman.com/d/Math4Wisdom_d0SvdI3KSto/),
a read-only capture tool, a local verifier, and a deduplicated inventory of
rendered images. The snapshot retains original structured responses and exposes
normalized Markdown and lossless table CSV.

Start with the [documentation index](docs/README.md) for the archive format,
verification, image coverage, and refresh workflow. The
[technical manuscript](docs/manuscript/README.md) describes what the retained
records establish and how to build the report offline.

With Node.js 22 or newer, install dependencies and run the offline tests.

```sh
npm ci
npm test
```

To verify every file in a full local snapshot, run `npm run validate` or
`npm run validate -- /absolute/path/to/snapshot`. A full verification needs
all files named in that snapshot's manifest. The [validation guide](docs/VALIDATION.md)
describes the checks and the smaller fixture test.

Collection is a separate workflow. It uses the official MCP endpoint and
requires a read-only token supplied through the process environment. See the
[reproduction guide](docs/REPRODUCING.md) for the collection commands and
[security](docs/SECURITY.md) for the credential boundary.
