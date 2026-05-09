# 0046 - Performance Budgets and Measurement Plan

## Status

Accepted

## Context

Users bring phone photos and expect quick feedback.

## Decision

Set budgets: metadata validation under 20ms, fixture inference median under 20ms, browser photo preview under 1s for files under 5MB, progress shown after 300ms, cancellable path for longer work.

## Consequences

- Tests record fixture timing.
- UI exposes progress/cancel states.

## Alternatives Considered

- Optimize only if users complain. Rejected because hidden stalls feel broken.
