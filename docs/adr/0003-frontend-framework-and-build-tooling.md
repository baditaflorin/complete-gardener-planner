# 0003 - Frontend Framework and Build Tooling

## Status

Accepted

## Context

The planner needs a rich but lightweight UI, strict typing, PWA support, local data fetching, and a static build that can publish to GitHub Pages.

## Decision

Use React, TypeScript strict mode, Vite, Tailwind CSS, TanStack Query, Zod, Lucide React, Vitest, and Playwright.

## Consequences

- Vite provides fast builds and stable static asset hashing.
- React state and feature slices keep the app approachable for contributors.
- TanStack Query handles static artifact fetching and cache states.
- Tailwind keeps styling local without inventing a design system.

## Alternatives Considered

- SvelteKit static output. Good fit, but React has broader contributor familiarity.
- Plain TypeScript with Web Components. Lower dependency count, but slower to implement accessible workflows.
