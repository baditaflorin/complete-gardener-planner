# Contributing

Thanks for helping improve Complete Gardener Planner.

## Local Setup

```bash
npm install
make install-hooks
make data
make build
make test
```

## Workflow

- Use Conventional Commits, for example `feat: add soil import adapter`.
- Run `make lint`, `make test`, and `make smoke` before pushing.
- Keep secrets out of git. Use `.env` locally and add placeholders to `.env.example`.
- Write an ADR in `docs/adr/` before significant architecture changes.
- Keep Mode B static-first unless a future ADR proves a runtime backend is necessary.

Live site: https://baditaflorin.github.io/complete-gardener-planner/

Repository: https://github.com/baditaflorin/complete-gardener-planner
