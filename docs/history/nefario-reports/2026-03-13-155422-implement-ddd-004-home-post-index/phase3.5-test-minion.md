---
verdict: ADVISE
reviewer: test-minion
---

## Verdict: ADVISE

The plan is well-specified. Two test coverage gaps should be addressed before or during execution.

### Gap 1: No edge-case draft post

Task 3 creates three fully-populated draft posts. Task 2 specifies graceful degradation for every missing field (no title, no type, no description, no date, no tags, mixed invalid/valid tags), but no test content exercises these paths. The guard code will be written but never executed locally.

**Recommendation**: Add a fourth draft post with intentionally sparse metadata — missing description, missing type, at least one invalid tag slug mixed with valid ones, and a missing date. This confirms the per-field degradation logic actually runs and that invalid slugs are filtered without breaking adjacent valid tags.

### Gap 2: Verification step 7 cannot produce the expected result

Verification step 7 says: "Start dev server with `--html-folder drafts` and check `http://localhost:3000/` renders the post index with test entries."

This will not work. The local EDS dev server serves draft HTML files but does not auto-generate `/query-index.json` from them. That file is produced by EDS content indexing from the live CMS. The block will fetch `/query-index.json`, receive a 404 (or the production index with no posts), and render only the sr-only h1. The step will silently "pass" at the fetch-failure level without actually verifying the happy path.

**Recommendation (preferred)**: Add a `drafts/query-index.json` mock fixture in the correct EDS query-index response format. The dev server will serve it as a static file, and the block will render real entries. This makes the implementation self-testable without a push cycle. The fixture should include entries covering: all four post types, at least one entry per missing-field scenario, a mix of date formats (Unix timestamp and ISO string) to exercise `parseDate()`, and at least one entry with mixed valid/invalid tags.

**Recommendation (fallback)**: If a mock fixture is not added, explicitly update verification step 7 to state that happy-path rendering is only verifiable on the branch preview URL after push (`https://nefario-ddd-004-home-post-index--grounded--benpeter.aem.page/`), and remove the localhost rendering expectation to avoid false confidence.

### No blockers

The architecture, implementation spec, and degradation requirements are correct. These are coverage gaps, not design flaws.
