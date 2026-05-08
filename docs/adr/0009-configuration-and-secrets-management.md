# 0009 - Configuration and Secrets Management

## Status

Accepted

## Context

The app is static and must not include secrets. Generators may eventually use authenticated APIs, but v1 data is local and public.

## Decision

Use `.env.example` for documented placeholders. `.env*` files are gitignored except `.env.example`. Frontend runtime configuration is limited to public URLs and build metadata. Local hooks run `gitleaks protect --staged`.

## Consequences

- No secret should appear in source or built Pages output.
- Future data ingestion secrets remain local to generator runs.
- BYO-key browser flows must clearly label that keys remain in the user browser.

## Alternatives Considered

- Encrypted frontend secrets. Rejected because obfuscated client secrets are still exposed.
