# Deploy Guide

The project deploys only to GitHub Pages.

Live site:

https://baditaflorin.github.io/complete-gardener-planner/

Repository:

https://github.com/baditaflorin/complete-gardener-planner

## Publish

```bash
make build
git add .
git commit -m "ops: publish pages build"
git push
```

GitHub Pages is configured from `main` branch `/docs`.

## Preview Locally

```bash
make pages-preview
```

Open:

http://127.0.0.1:4173/complete-gardener-planner/

## Rollback

Revert the publishing commit and push:

```bash
git revert <commit>
git push
```

## Custom Domain

No custom domain is configured in v1. To add one, create `docs/CNAME`, configure DNS with the domain registrar, and update ADR 0010.

## Pages Gotchas

- Vite `base` must remain `/complete-gardener-planner/`.
- `docs/404.html` is copied from `docs/index.html` for SPA fallback.
- GitHub Pages does not support `_headers` or `_redirects`.
- The service worker scope is `/complete-gardener-planner/`.
