# 0001 - Deployment Mode

## Status

Accepted

## Context

The v1 product should help gardeners and urban farmers identify likely plants and diseases from photos, plan crop rotation, estimate sunlight, generate watering schedules, inspect static soil/weather/frost datasets, and project harvests. The public surface should default to GitHub Pages unless runtime secrets, authenticated writes, real-time collaboration, or server-only computation are required.

## Decision

Use Mode B: GitHub Pages plus pre-built data.

The runtime app is a static React/Vite site served from GitHub Pages. Data generation runs offline through local scripts and writes versioned artifacts into `docs/data/v1/`. The browser fetches those artifacts, persists user plans in IndexedDB/localStorage, and lazy-loads heavier browser libraries only behind user action.

## Consequences

- No runtime server, server database, auth, nginx, Docker image, or public API is needed in v1.
- Secrets stay out of the frontend. Any future authenticated data ingestion must happen in offline generators.
- Static artifacts need schemas, metadata, deterministic ordering, and clear freshness messaging.
- Browser compute must remain bounded so the first load stays fast.

## Alternatives Considered

- Mode A: pure browser-only data. Rejected because plant, frost, companion, and soil/weather reference data benefits from normalized pre-built artifacts.
- Mode C: GitHub Pages plus Docker backend. Rejected because v1 has no cross-device sync, private writes, runtime secrets, or server-only processing requirement.
