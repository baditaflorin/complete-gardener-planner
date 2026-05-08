# 0016 - Local Git Hooks

## Status

Accepted

## Context

The project explicitly avoids GitHub Actions, so local hooks are the quality gate.

## Decision

Use a plain `.githooks/` directory wired with `make install-hooks`. Hooks run:

- `pre-commit`: formatting/lint/typecheck and `gitleaks protect --staged`.
- `commit-msg`: Conventional Commits validation.
- `pre-push`: `make test`, `make build`, and `make smoke`.
- `post-merge` and `post-checkout`: refresh build metadata.

## Consequences

- Contributors can inspect and run the exact shell scripts.
- Missing optional tools fail with clear installation messages.

## Alternatives Considered

- Lefthook. Good option, but plain scripts reduce one more moving part for v1.
