# 0008 - Go Backend Project Layout

## Status

Accepted

## Context

Mode B has no runtime backend, but the offline data generator is a Go command and should follow predictable project boundaries.

## Decision

Use a slim `golang-standards/project-layout` inspired structure:

- `cmd/build-data/` for the generator binary.
- `internal/utils/` for shared utility code, including `HandleErrorOrLogWithMessages`.
- `configs/`, `pkg/`, `api/`, and `test/` may be added when real generator complexity warrants them.

## Consequences

- The project can add more data commands without changing deployment mode.
- No `cmd/server/`, Dockerfile, compose file, or nginx config exists in v1.

## Alternatives Considered

- No Go code. Rejected because the bootstrap requirements explicitly describe a Mode B data-generation backend.
