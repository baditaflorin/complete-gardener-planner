# Phase 3 Stranger Test

## Method

Fallback method from ADR 0071: private-browser style cold run using Playwright against the Pages build, with no stored IndexedDB state and a non-demo garden note:

> Tomato and basil bed with white powder on cucumber leaves.

Flow tested:

1. Load the app from the static Pages build.
2. Change crop selection.
3. Paste a real garden note and analyze it.
4. Apply inferred crop guesses.
5. Export harvest CSV.
6. Export garden state JSON.
7. Create a share link.
8. Check that the footer exposes repository, support, version, and commit.

## Confusion / Dead-End Notes

| Observation                                                            | Severity | Response                                                |
| ---------------------------------------------------------------------- | -------- | ------------------------------------------------------- |
| The text input originally had no persistent example once typing began. | medium   | Added visible field help below the text area.           |
| URL input could look like it promised universal scraping.              | high     | Added CORS-aware status guidance and README limitation. |
| The page had no obvious way to take work out.                          | high     | Added the save/share/export action panel.               |
| Starting over required knowing browser storage details.                | medium   | Added Start fresh control wired to IndexedDB clear.     |
| Debug provenance was inspectable but not portable.                     | low      | Added Copy analysis JSON.                               |

## Top 3 Issues Fixed Before Release

1. Added the save/share/export action panel.
2. Added text/paste/drop/multi-file/sample input paths.
3. Added field help and URL fallback language so users know what to do when CORS blocks a page.

## Result

The tested user story now completes without developer help: a stranger can enter their own garden note, get a useful analysis, apply crop guesses, export state/CSV, and share or print the plan. Remaining gaps are documented in the Phase 3 postmortem.
