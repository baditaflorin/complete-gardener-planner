# 0042 - Inference Engine

## Status

Accepted

## Context

V1 scoring overweights filename and basic color. The engine needs domain vocabulary, host compatibility, confidence, and multi-crop suggestions.

## Decision

Introduce a deterministic evidence-based inference engine. It combines normalized tokens, plant aliases, visual signals, disease vocabulary, host/disease compatibility, anomaly diagnostics, and correction memory.

## Consequences

- Photo analysis can propose selected crop IDs.
- Disease candidates are capped when incompatible with likely host plants.
- Every candidate includes reasons and warnings.

## Alternatives Considered

- Wait for real ONNX models. Rejected because Phase 2 must improve current behavior before model assets exist.
