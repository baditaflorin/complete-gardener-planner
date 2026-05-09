# 0041 - Input Robustness and Normalization Policy

## Status

Accepted

## Context

Real users upload HEIC files, corrupted JPEGs, huge phone photos, and filenames with Unicode punctuation or misleading names.

## Decision

Normalize all textual evidence with Unicode NFKC, lowercase, punctuation folding, whitespace collapse, and alias lookup. Validate file type and size before image decoding. Treat unsupported and corrupted images as recoverable domain errors.

## Consequences

- Broken inputs do not crash analysis.
- Filename evidence is only one signal and can be contradicted.
- Huge input budgets are explicit.

## Alternatives Considered

- Let browser decode errors surface directly. Rejected because they are not gardener-actionable.
