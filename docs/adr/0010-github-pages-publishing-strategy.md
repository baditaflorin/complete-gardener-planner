# 0010 - GitHub Pages Publishing Strategy

## Status

Accepted

## Context

The live GitHub Pages URL is a first-class deliverable from the first commit. The app uses Vite and needs hashed assets, a repository base path, and an SPA fallback. GitHub Pages cannot use Netlify-style `_headers` or `_redirects`.

## Decision

Publish from the `main` branch `/docs` folder at:

`https://baditaflorin.github.io/complete-gardener-planner/`

Vite builds with `base: "/complete-gardener-planner/"` and `outDir: "docs"`. The build step copies `docs/index.html` to `docs/404.html` for client-side route fallback. The `.gitignore` ignores `dist/` and `dist-data/` but intentionally does not ignore `docs/`.

## Consequences

- Built assets are committed so Pages can serve them without GitHub Actions.
- Each deploy is a normal git commit and can be rolled back by reverting the publishing commit.
- Static data under `docs/data/v1/` is versioned and served from the same origin as the app.
- Service worker scope must stay under `/complete-gardener-planner/`.

## Alternatives Considered

- `gh-pages` branch. Rejected to keep local hooks, source, and built output visible on `main`.
- Publishing from repository root. Rejected because source files would be publicly browsable as the site root and routing would be noisier.
