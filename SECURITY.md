# Security Policy

## Supported Versions

Only the latest `main` branch and the latest semver tag are supported for security fixes during v0.x.

## Reporting

Please report security issues through GitHub private vulnerability reporting when available:

https://github.com/baditaflorin/complete-gardener-planner/security

Fallback contact:

baditaflorin@users.noreply.github.com

## Baseline

- No secrets belong in the frontend.
- `.env*` files are ignored except `.env.example`.
- `gitleaks` runs in the local pre-commit hook.
- `npm audit --audit-level=high` and `govulncheck` are available through `make security`.
