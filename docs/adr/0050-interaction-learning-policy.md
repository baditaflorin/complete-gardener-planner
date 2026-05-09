# 0050 - Interaction Learning Policy

## Status

Accepted

## Context

If a user applies or corrects crop suggestions, similar guesses should improve during the session without feeling mysterious.

## Decision

Remember crop corrections only in local session memory. Surface the effect as "session correction applied" in reasons when it changes ranking. Do not sync or train global models.

## Consequences

- The app feels adaptive without privacy risk.
- Corrections disappear on reload unless later promoted to explicit saved preferences.

## Alternatives Considered

- Persist corrections indefinitely. Deferred to avoid surprising behavior.
