# 0012 - Metrics and Observability

## Status

Accepted

## Context

Static GitHub Pages hosting provides no server-side metrics. Privacy matters because garden photos and location hints can be sensitive.

## Decision

Do not add analytics in v1. Surface app health through visible data freshness, version, commit, and clear error states.

## Consequences

- No PII or behavioral analytics are collected.
- Product usage insight will rely on GitHub stars/issues and direct feedback.

## Alternatives Considered

- Plausible analytics. Deferred until there is a concrete question worth measuring and a privacy notice update.
