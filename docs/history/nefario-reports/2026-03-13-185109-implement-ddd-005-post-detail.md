---
task: "Implement DDD-005: Post Detail page reading experience"
date: 2026-03-13
source-issue: 26
slug: implement-ddd-005-post-detail
mode: execution
task-count: 5
gate-count: 0
compaction-events: 0
---

# Nefario Report: Implement DDD-005 Post Detail

## Summary

Implemented the post detail reading experience at `/blog/{slug}` per the DDD-005 design contract. Created path-based page detection in `scripts.js`, post header decoration (type badge, sr-only prefix, metadata line with dates and tags), scoped CSS for all typography and spacing overrides, a Quote block with standard and pull-quote variants, shared post utilities module, comprehensive test content, and documentation updates.

## Original Prompt

Implement DDD-005 Post Detail page reading experience (#26). Path-based detection, post header decoration, scoped CSS, Quote block, pre tabindex, test content, and documentation updates per the design contract in docs/design-decisions/DDD-005-post-detail.md.

## Key Design Decisions

### No article wrapper on main

accessibility-minion flagged that adding `role="article"` to `<main>` would destroy the main landmark (WCAG 1.3.1). Resolution: skip the `<article>` wrapper entirely. A single blog post inside `<main>` with an `<h1>` is semantically complete.

### Tag links get subtle underlines (WCAG 1.4.1)

The DDD-005 spec originally matched DDD-004 precedent (no underline on tag links). accessibility-minion flagged this as a WCAG 1.4.1 violation — links rely on color alone to be distinguishable. Resolution: add `text-decoration: underline; text-decoration-color: var(--color-border)` to tag links, which nearly melts into the background while meeting accessibility requirements. DDD-004 post-index tags are a separate concern.

### CSS override for decorateButtons()

frontend-minion recommended CSS override over JS exclusion for the `decorateButtons()` side effect. At the time `decorateButtons()` runs in `decorateMain()`, sections do not yet exist. A CSS reset of `.button` styles scoped behind `body.post-detail .default-content-wrapper` is declarative and avoids coupling to execution order.

### Pre tabindex in loadLazy, not eager

Code review caught that `querySelectorAll('pre')` in `decoratePostDetail()` runs during the eager phase when only the first section is loaded. Code blocks in body sections (sections 2+) are loaded lazily. Resolution: moved the tabindex decoration to `loadLazy` after `loadSections(main)` completes, ensuring all `<pre>` elements receive `tabindex="0"`.

### Quote block preserves inline markup

Code review caught that the original quote block implementation stripped all inline markup (bold, italic, code, links) by using `textContent`. Resolution: refactored `extractParagraphs` to move child nodes rather than extract text, preserving authored inline markup.

### Eager CSS loading for post-detail.css

frontend-minion recommended eager loading (~150 lines, ~3KB) to avoid FOUC. The post header with h1 is likely the LCP element, so post-scoped CSS must be available before first paint.

### Content discipline as convention only

ux-strategy-minion recommended against programmatic enforcement of the pull-quote content discipline (pull-quote text must appear verbatim elsewhere in the post body). Single-author blog; editorial discipline is sufficient. Documented in content-model.md.

## Phases

| Phase | Outcome |
|---|---|
| 1. Meta-plan | 5 specialists identified (frontend-minion, accessibility-minion, ux-strategy-minion, test-minion, software-docs-minion) |
| 2. Specialist planning | All aligned. Key contributions: file organization strategy, WCAG compliance review, authoring model validation, test content structure, documentation scope. |
| 3. Synthesis | 5 tasks, 0 gates. Batch execution: Tasks 1+3 parallel, Task 2 sequential, Task 4 sequential, Task 5 sequential. |
| 3.5. Architecture review | 6 reviewers: 5 APPROVE (security, test, ux-strategy, margo, accessibility), 1 ADVISE (lucy: CSS comment syntax). 0 BLOCK. |
| 4. Execution | 5 tasks in 4 batches. All lint clean. |
| 5. Code review | 3 reviewers: 2 BLOCK findings auto-fixed (pre tabindex timing, quote markup preservation), 1 ADVISE (duplicate CSS removed). |
| 6. Tests | Lint passes (ESLint + Stylelint). No unit test framework. Test content in drafts/ for manual verification. |

## Execution

### Task 1: Extract shared post utilities
- **Agent**: frontend-minion
- **Files**: `scripts/post-utils.js` (new, +49), `blocks/post-index/post-index.js` (modified, -43)
- **Outcome**: TYPE_LABELS, DATE_FORMATTER, parseDate, toIsoDate extracted for reuse

### Task 2: Post detail decoration and CSS
- **Agent**: frontend-minion
- **Files**: `scripts/scripts.js` (modified, +119), `styles/post-detail.css` (new, +214)
- **Outcome**: Path detection, body class, header decoration, scoped CSS for all typography/spacing/links/tables/buttons

### Task 3: Quote block
- **Agent**: frontend-minion
- **Files**: `blocks/quote/quote.js` (new, +84), `blocks/quote/quote.css` (new, +55)
- **Outcome**: Standard and pull-quote variants with semantic blockquote markup

### Task 4: Test content and documentation
- **Agent**: frontend-minion
- **Files**: `AGENTS.md` (modified, +17), `docs/content-model.md` (modified, +10), drafts (gitignored)
- **Outcome**: Comprehensive draft page with 11 content structures, Page-Type Detection docs, blockquote authoring notes

### Task 5: Integration verification
- **Agent**: frontend-minion
- **Outcome**: Lint passes, dev server renders drafts correctly

## Verification

Verification: 2 code review findings auto-fixed (pre tabindex timing, quote markup preservation), lint passes. (Tests: not applicable — no test framework.)

## Agent Contributions

### Planning agents (Phase 2)

| Agent | Key contribution |
|---|---|
| frontend-minion | File organization strategy: post-utils.js extraction, post-detail.css eager loading, CSS override for decorateButtons() |
| accessibility-minion | WCAG review: no role="article" on main, tag link underlines, pre tabindex-only (no role="region") |
| ux-strategy-minion | Authoring model validation: Quote block pattern clear, content discipline as convention only |
| test-minion | Test strategy: comprehensive draft page, no Lighthouse CI needed, existing PSI gate sufficient |
| software-docs-minion | Documentation scope: AGENTS.md page-type detection, content-model.md blockquote notes |

### Review agents (Phase 3.5)

| Agent | Verdict |
|---|---|
| security-minion | APPROVE |
| test-minion | APPROVE |
| ux-strategy-minion | APPROVE |
| lucy | ADVISE (CSS comment syntax) |
| margo | APPROVE |
| accessibility-minion | APPROVE |

## Session Resources

<details>
<summary>Skills Invoked</summary>

- `/nefario` — orchestration

</details>

<details>
<summary>Working Files</summary>

Companion directory: `docs/history/nefario-reports/2026-03-13-185109-implement-ddd-005-post-detail/`

</details>

## Test Plan

- [ ] `npm run lint` passes
- [ ] Dev server with `--html-folder drafts`: `/blog/building-eds-design-system` renders type badge, h1 with sr-only prefix, metadata line with date + updated + tags
- [ ] `/blog/eds-gotcha-source-maps` renders as TIL without updated element
- [ ] Home page `/` continues to render post-index without post-detail body class
- [ ] Quote block: standard renders with subtle border, pull-quote renders with gold accent and editorial font
- [ ] Body links underlined by default, remove on hover
- [ ] Tag links have subtle underline (WCAG 1.4.1)
- [ ] `<pre>` elements have `tabindex="0"` and are keyboard-scrollable
- [ ] Code blocks have `border-radius: 0`
- [ ] Standalone links in post body do NOT render as buttons
- [ ] Adjacent h2+h3 shows collapsed spacing (0.25em)
- [ ] Wide code block scrolls horizontally

Test URLs:
- Before: https://main--grounded--benpeter.aem.live/
- After: https://nefario-implement-ddd-005-post-detail--grounded--benpeter.aem.live/blog/building-eds-design-system
