# Security and privacy

## Credentials

The MCP token is a secret. It must be:

- newly generated, personal, MCP-restricted, and read-only;
- supplied through the current process environment only;
- absent from shell arguments, history, logs, raw responses, manifests, Git objects, and chat.

Revoke a token after a one-time archival run when it is no longer needed. If exposure is suspected, revoke it immediately and create a replacement.

## Browser boundary

Browser authentication is user-driven. The workflow may use visible, user-approved browser navigation for the public rendered-page inventory, but must never read cookies, passwords, local storage, browser profiles, or session databases.

## Document boundary

The archive is read-only. It must not alter a Docs page, table, row, view, comment, permission, or control. It must not scrape a fallback public document API or crawl linked sites.

## Publication review

Before pushing, inspect staged names and content for secrets, private URLs, accidental browser state, or write-capable configuration. Keep `.env` files ignored and publish only `.env.example` placeholders.
