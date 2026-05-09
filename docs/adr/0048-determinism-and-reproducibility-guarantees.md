# 0048 - Determinism and Reproducibility Guarantees

## Status

Accepted

## Context

Fixture outputs and user-visible recommendations must be reproducible.

## Decision

Inference output excludes timestamps, sorts candidates deterministically, and includes provenance with schema version, app version, source identifier, and stable evidence hash.

## Consequences

- Same input gives byte-identical normalized output.
- Support can ask users for provenance details.

## Alternatives Considered

- Include generation timestamps in every inference. Rejected for deterministic tests.
