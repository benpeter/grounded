---
task: "Implement DDD-004: Build post-index block for the home page"
date: 2026-03-13
source-issue: 20
slug: implement-ddd-004-home-post-index
mode: execution
task-count: 4
gate-count: 0
compaction-events: 2
---

# Nefario Report: Implement DDD-004 Home Post Index

## Summary

Built the `post-index` EDS block that fetches `/query-index.json` and renders a reverse-chronological post list on the home page. Created `helix-query.yaml` for content indexing, `blocks/post-index/post-index.css` and `post-index.js` for the block, auto-block wiring in `scripts.js`, `.sr-only` utility class in `styles.css`, and documentation updates to `content-model.md` and DDD-004 status.

## Original Prompt

Implement DDD-004: Build post-index block for the home page (#20). Create helix-query.yaml, post-index block (CSS + JS), auto-block wiring in scripts.js, .sr-only utility, and documentation updates per the design contract in docs/design-decisions/DDD-004-home-post-index.md.

## Key Design Decisions

### parseDate boundary guard (num < 1e10)

The original implementation used `num > 0` to detect Unix timestamps, which would incorrectly double-multiply millisecond timestamps (producing dates in year ~57,000). Code review caught this — added `num < 1e10` to distinguish 10-digit second timestamps from 13-digit millisecond timestamps. Excel serial number handling was intentionally omitted (indistinguishable from Unix timestamps per margo ADVISE).

### .sr-only in styles.css (eager) not lazy-styles.css

Frontend-minion recommended lazy-styles.css. Accessibility-minion recommended styles.css. Resolution: styles.css wins — zero rendering cost, prevents FOUC if any future eager-loaded block needs it, eliminates timing dependency. Implementation uses modern `clip-path: inset(50%)` instead of deprecated `clip: rect(0,0,0,0)` per stylelint.

### Path validation for open redirect prevention

Security advisory: `entry.path.startsWith('/')` guard added to prevent open redirect if query-index.json is poisoned with external URLs. Low-probability risk for a static site, but zero-cost defensive measure.

### Tag links render as 404s until DDD-007

Tags are rendered as links (`/tags/{slug}`) from day one even though tag pages don't exist yet. Accepted trade-off: the 404 page has a "Go home" link, and retroactively adding links after DDD-007 would require a code change.

## Phases

| Phase | Outcome |
|---|---|
| 1. Meta-plan | 5 specialists identified (frontend-minion, ux-strategy-minion, ux-design-minion, accessibility-minion, software-docs-minion) |
| 2. Specialist planning | All aligned; 1 conflict (.sr-only placement). Comprehensive DOM structure, CSS selectors, and edge cases documented. |
| 3. Synthesis | 4 tasks, 0 gates. Tasks 1+2+4 parallelizable per margo ADVISE. |
| 3.5. Architecture review | 6 reviewers: 2 APPROVE (ux-strategy, accessibility), 4 ADVISE (security, test, margo, lucy), 0 BLOCK |
| 4. Execution | 4 tasks in 2 batches. All lint clean. |
| 5. Code review | 3 reviewers: 1 APPROVE (margo), 2 ADVISE (code-review-minion, lucy). 1 BLOCK finding auto-fixed (parseDate boundary). |
| 6. Tests | Lint passes (ESLint + Stylelint). No unit test framework. Test content in drafts/ for manual verification. |
| 8. Documentation | Skipped — all docs handled in Task 4 (content-model.md + DDD-004 status). |

## Agent Contributions

### Planning (Phase 2)

| Agent | Contribution |
|---|---|
| frontend-minion | Complete DOM structure, CSS selectors, auto-block pattern, date parsing, tag handling |
| ux-strategy-minion | Validated scan-friendly layout, progressive disclosure, empty state handling |
| ux-design-minion | Verified DDD-004 visual spec completeness, token usage, spacing rationale |
| accessibility-minion | ARIA patterns (aria-labelledby, aria-hidden, sr-only), .sr-only placement, AccName 1.2 compliance |
| software-docs-minion | Content-model.md structure, DDD-004 status update format, OQ resolution documentation |

### Review (Phase 3.5)

| Agent | Verdict | Key Finding |
|---|---|---|
| security-minion | ADVISE | Path validation guard for open redirect prevention |
| test-minion | ADVISE | Mock query-index.json needed for local testing; edge-case test post |
| margo | ADVISE | Tasks 1+2 can parallelize; drop Excel serial number claim |
| lucy | ADVISE | Add drafts/ to .gitignore; CSS padding comment; DDD-004 status note |
| ux-strategy-minion | APPROVE | Journey coherence validated |
| accessibility-minion | APPROVE | ARIA patterns correct |

### Code Review (Phase 5)

| Agent | Verdict | Key Finding |
|---|---|---|
| code-review-minion | ADVISE | parseDate boundary guard (BLOCK → auto-fixed); pathname comment; empty-array console.warn |
| lucy | ADVISE | clip-path vs clip deviation noted (improvement over spec); boilerplate margin cleanup opportunity |
| margo | APPROVE | No over-engineering; proportional complexity |

## Execution

### Task 1: Create helix-query.yaml + .sr-only utility class
- **Agent**: frontend-minion (sonnet)
- **Files**: `helix-query.yaml` (new, +25 lines), `styles/styles.css` (modified, +13 lines)
- **Note**: .sr-only uses `clip-path: inset(50%)` (modern) instead of `clip: rect(0,0,0,0)` (deprecated) per stylelint

### Task 2: Create post-index block (CSS + JS)
- **Agent**: frontend-minion (sonnet)
- **Files**: `blocks/post-index/post-index.css` (new, +101 lines), `blocks/post-index/post-index.js` (new, +206 lines)
- **Note**: All 17 DDD-004 CSS selectors implemented; no innerHTML; path validation; tag slug validation

### Task 3: Wire auto-block in scripts.js + test content
- **Agent**: frontend-minion (sonnet)
- **Files**: `scripts/scripts.js` (modified, +14 lines), `drafts/` (4 HTML files + query-index.json mock)
- **Note**: `drafts/` added to .gitignore; mock includes edge-case entry with missing fields

### Task 4: Update content model docs + DDD-004 status
- **Agent**: software-docs-minion (sonnet)
- **Files**: `docs/content-model.md` (modified, +23 lines), `docs/design-decisions/DDD-004-home-post-index.md` (modified)
- **Note**: All 7 open questions resolved in DDD-004 reviewer notes

## Verification

Code review passed (1 BLOCK finding auto-fixed: parseDate boundary guard). Lint passes clean (ESLint + Stylelint). No unit test infrastructure. Documentation handled in execution.

## Test Plan

- [ ] Start dev server: `npx -y @adobe/aem-cli up --no-open --forward-browser-logs --html-folder drafts`
- [ ] Verify `http://localhost:3000/` renders post-index block with 3 test entries in reverse-chronological order
- [ ] Verify edge-case entry (missing fields) degrades gracefully
- [ ] Verify type badges display correctly (Build Log, Tool Report, TIL)
- [ ] Verify tag links point to `/tags/{slug}`
- [ ] Verify focus rings on title and tag links (keyboard navigation)
- [ ] Verify screen reader announces type prefix via sr-only span
- [ ] Check preview URL after push: `https://nefario-ddd-004-home-post-index--grounded--benpeter.aem.page/`

## Session Resources

<details>
<summary>Skills Invoked</summary>

- `/nefario` — orchestration

</details>

<details>
<summary>Compaction</summary>

2 compaction events (Phase 3 and Phase 3.5 checkpoints).

</details>

## Working Files

Companion directory: `docs/history/nefario-reports/2026-03-13-155422-implement-ddd-004-home-post-index/`
