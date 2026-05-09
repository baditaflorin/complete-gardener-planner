# Phase 2 Substance Plan

This plan implements the same v1 surface area with a smarter engine underneath. Items are ranked by user impact on the real-data audit fixtures.

| Rank | Catalog item               | Implementation target                                                   | User impact                               |
| ---- | -------------------------- | ----------------------------------------------------------------------- | ----------------------------------------- |
| 1    | 16 Confidence scores       | Confidence model with levels, reasons, and warnings                     | Prevents wrong-confident output           |
| 2    | 6 Auto-detect structure    | Multi-crop inference from photo/text evidence                           | Photo becomes useful before configuration |
| 3    | 8 Useful first guess       | Photo result proposes crop IDs for the bed                              | User corrects instead of configuring      |
| 4    | 13 Recognize common shapes | Distinguish single plant, mixed bed, disease close-up, unsupported file | More domain-aware routing                 |
| 5    | 12 Domain-aware validation | Host/disease compatibility caps impossible guesses                      | Fewer bad disease suggestions             |
| 6    | 32 Actionable errors       | What/why/now-what error taxonomy                                        | Broken inputs recover cleanly             |
| 7    | 2 Encoding/format variants | File type normalization and HEIC/corrupt messages                       | Real phone photos fail clearly            |
| 8    | 4 Partial inputs           | Corrupt/truncated image classification                                  | No crashy dead ends                       |
| 9    | 5 Adversarial input        | Filename/evidence conflict detection                                    | Reduces misleading filenames              |
| 10   | 19 Explain decisions       | Candidate reasons surfaced in UI/tests                                  | User can trust and correct                |
| 11   | 18 Surface anomalies       | Diagnostics for conflicts, unsupported media, stale assumptions         | Silent wrongness drops                    |
| 12   | 22 Stable IDs              | Stable inference IDs and provenance hash                                | Outputs can be referenced                 |
| 13   | 35 Deterministic outputs   | Fixture determinism tests                                               | Reproducible support/debugging            |
| 14   | 38 Output provenance       | Version/schema/source metadata on inference result                      | Results become inspectable                |
| 15   | 24 State taxonomy          | Document and model analysis states                                      | No hidden half-state                      |
| 16   | 25 No stuck states         | State reducer exits for idle/loading/ready/error/cancelled              | Recovery is defined                       |
| 17   | 26 Cancellation            | Abortable photo analysis path                                           | Large inputs can be stopped               |
| 18   | 27 Concurrency safety      | Request IDs ignore stale analysis completions                           | Double-clicks are deterministic           |
| 19   | 28 Profile inputs          | Perf marks and fixture timing report                                    | Honest performance numbers                |
| 20   | 31 Cache expensive things  | ONNX capability cache and deterministic evidence normalization          | Less repeated work                        |
| 21   | 39 Remember corrections    | Session crop-correction memory                                          | Similar guesses improve in-session        |
| 22   | 11 Domain vocabulary       | Gardener-facing labels/errors                                           | Less dev-structure leakage                |

## Pass-Rate Target

Baseline: 2/10 useful, 5/10 visibly mishandled, 3/10 wrong-confident risk.

Target: 8/10 useful, 10/10 deterministic, 0/10 wrong-confident high-confidence failures.
