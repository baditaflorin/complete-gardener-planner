# 0043 - Domain Vocabulary and UI Language Conventions

## Status

Accepted

## Context

Users understand crops, hosts, mildew, blight, soil, frost, and watering. They do not benefit from selector, schema, or canvas language.

## Decision

Use gardener-facing terms in errors and inference explanations. Candidate reasons should say "filename mentioned basil" or "white leaf patches match mildew pressure," not "token hit" or "brightness feature."

## Consequences

- Error strings are auditable.
- UI explanations become useful correction surfaces.

## Alternatives Considered

- Keep developer strings. Rejected as a major "feels stupid" cause.
