# Test Strategy: DDD-005 Post Detail

## Summary

This is a vanilla JS + CSS EDS project with no test runner in `package.json` — only ESLint and Stylelint. The quality gates for DDD-005 are: static analysis (existing), a draft page for visual/local verification, and a PSI score check before PR merge (required by AGENTS.md). The recommendation below fits the actual toolchain without adding dependencies.

---

## What Can Be Tested and How

### 1. Static Analysis — No Changes Needed

`npm run lint` covers JS and CSS already. The implementing agent must run this before committing. The lint step will catch:

- Selector scoping violations (unscoped `.post-type`, `.post-meta`, etc.)
- Range notation violations in media queries (`min-width` will fail stylelint-config-standard v40)
- ESLint airbnb-base violations in decoration logic

No additions needed here.

### 2. DOM Decoration — Verifiable in the Draft Page

There is no unit test framework in this project and adding one (Vitest, Jest) solely for DDD-005 is not justified. The decoration logic in `scripts.js` is thin: path detection, class addition on `<body>`, badge injection, `<time>` element construction, and suppression of `decorateButtons()`. These are all observable by loading the draft page in a browser or via `curl localhost:3000/blog/building-eds-design-system`.

**Verification checklist** (manual, against the draft page with dev server running):

- `document.body.classList.contains('post-detail')` is true on `/blog/*` paths and false on `/` and other paths
- `<p class="post-type" aria-hidden="true">` exists before `<h1>` with correct title-case text ("Build Log", not "build-log")
- `<h1>` contains a `<span class="sr-only">Build Log: </span>` prefix
- `<time>` elements have ISO 8601 `datetime` attribute (`2026-03-12`)
- `.post-updated` is absent from the DOM when `updated` metadata is not set (not just hidden — not present)
- `<pre>` elements have `tabindex="0"`
- Standalone links in post body are NOT converted to `.button` elements

These checks can be run by the implementing agent via `curl` and browser devtools, not a test suite.

### 3. CSS Spacing — Visual Verification Only

CSS spacing rules (h2 2em top margin, adjacent h2+h3 collapse, pull-quote 2em symmetric spacing, list item 0.35em gap) cannot be meaningfully unit tested. They require visual inspection. The draft page is the right artifact.

**What the draft page must contain to exercise all spacing rules** (see Draft Page Requirements below).

### 4. Lighthouse CI — Use PSI, Not a New CI Job

AGENTS.md already requires a PageSpeed Insights check against the feature preview URL before PR merge. This is the performance gate. Do not add a separate Lighthouse CI step — that doubles the process without adding signal. The PSI check against `https://{branch}--grounded--benpeter.aem.page/blog/building-eds-design-system` is the existing required gate.

Target: score of 100. The post detail page must not regress on: LCP (no hero images, no render-blocking resources), CLS (no late-injected elements that shift layout), TBT (decoration JS runs in eager phase, minimal work).

**No Lighthouse CI job recommended for this PR.**

### 5. Quote Block — Verifiable via Draft Page

The Quote block (`blocks/quote/quote.js` + `blocks/quote/quote.css`) renders via EDS decoration. Standard blockquote and pull-quote variant must both appear in the draft page. CSS border colors (`.quote` uses `--color-border`, `.quote.pull-quote` uses `--color-accent`) are visual-only. The structural DOM output (`.quote.block > blockquote`, `.quote.pull-quote.block > figure[aria-hidden="true"] > blockquote`) is verifiable by `curl` or devtools inspection.

---

## Draft Page Requirements

The existing draft at `drafts/blog/building-eds-design-system.html` is too sparse — it lacks the content structures that exercise the spacing and typography rules. The implementing agent must expand it (or create a dedicated test draft) to include all of the following:

### Required content structures

1. **Post header section** — type badge (`build-log`), h1, metadata paragraph with `<time>`, tag links, and an `updated` date to verify the `.post-updated` element renders
2. **h2 + paragraph + pre** — exercises h2 spacing (2em top) and code block spacing (1.5em symmetric)
3. **h2 immediately followed by h3 + paragraph** — exercises adjacent heading collapse (h2+h3 margin-top: 0.25em)
4. **Paragraph + standard blockquote (Quote block)** — exercises `.quote` left border with `--color-border`
5. **Paragraph + pull-quote (Quote block with pull-quote class) + paragraph** — exercises `.quote.pull-quote` gold border and 2em symmetric spacing
6. **Paragraph + ul (list) + paragraph** — exercises list item 0.35em gap
7. **Paragraph with inline code** — exercises 0.9em sizing and `--color-background-soft` background
8. **Paragraph with a body link** — exercises underline-by-default override
9. **`<hr>` between sections** — exercises 2em symmetric spacing
10. **A long code block (> 68ch)** — exercises horizontal scroll without affecting page layout (CLS test)

### Draft file structure

The draft must use EDS markup conventions so the dev server's decoration pipeline runs against it. The file at `drafts/blog/building-eds-design-system.html` should follow the `.plain.html` structure with `<main>` sections matching the HTML structure documented in DDD-005. The metadata must be in `<meta>` tags in `<head>` so the decoration JS can read them.

A minimal second draft, `drafts/blog/til-test.html`, should also exist with a TIL-type post (100-200 words, no h2/h3, no code blocks) to verify the layout degrades gracefully at minimum content length. This post should NOT have an `updated` field so the absence behavior is verified.

---

## Accessibility Verification

These checks are required for WCAG 2.2 AA compliance (CLAUDE.md) and cannot be automated without adding axe-core or similar. Verify manually in browser devtools:

- `body.post-detail` pages: only one `<h1>` exists
- `.post-type` has `aria-hidden="true"`
- `<h1>` contains the sr-only span matching the badge text, satisfying WCAG 2.5.3 (Label in Name)
- Pull-quote `<figure>` has `aria-hidden="true"` — screen reader must not announce it
- `<pre tabindex="0">` is reachable via keyboard Tab key
- Focus ring visible on tag links, body links, and code blocks at `:focus-visible`
- Color contrast: `--color-text-muted` (#6F6A5E) on `--color-background` (#F6F4EE) — this pair is borderline and must be verified with a contrast checker before merge (target 4.5:1 for normal text at 14px)

---

## What NOT to Add

- A Vitest or Jest setup for DOM decoration — the logic is thin, the draft page verifies the same things faster, and adding a test framework creates a maintenance obligation without proportional confidence gain.
- Playwright E2E tests — appropriate once there are 3-5 critical user journeys; a single post detail page is not yet a journey worth automating end-to-end.
- Lighthouse CI — already covered by the required PSI check in the PR process.
- Snapshot tests of DOM output — snapshots of decoration logic change frequently during development and add friction without adding confidence.

---

## Summary: Verification Gate per Phase

| Phase | Gate | Tool | Required |
|---|---|---|---|
| Pre-commit | Lint passes | `npm run lint` | Yes |
| Local dev | Draft page renders correctly | Dev server + browser devtools | Yes |
| Local dev | DOM decoration checklist passes | `curl` + browser console | Yes |
| Pre-PR | PSI score 100 on feature preview | PageSpeed Insights | Yes (AGENTS.md) |
| Pre-PR | Accessibility manual checks pass | Browser devtools | Yes |
| PR | `gh pr checks` pass (code sync, lint, PSI) | GitHub CI | Yes |
