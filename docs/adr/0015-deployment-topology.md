# 0015 - Deployment Topology

## Status

Accepted

## Context

Mode B uses GitHub Pages only. The bootstrap template includes Docker/nginx requirements for Mode C, but those are intentionally absent here.

## Decision

Deploy only by committing built `docs/` output to `main` and letting GitHub Pages serve it. Static data ships in `docs/data/v1/`. No `deploy/` directory is required for v1.

## Consequences

- Operations are simple: push, wait for Pages, verify URL.
- Rollback is a git revert.
- There is no Docker image, GHCR publish, server port, nginx config, or Prometheus endpoint.

## Alternatives Considered

- Docker backend behind nginx. Rejected by ADR 0001.
