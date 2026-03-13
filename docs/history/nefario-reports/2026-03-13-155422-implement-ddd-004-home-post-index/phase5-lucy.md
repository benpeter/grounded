# Lucy Review: DDD-004 Home Post Index Implementation

## VERDICT: ADVISE

Minor issues found. The implementation is faithful to the design spec and CLAUDE.md conventions. Two items warrant attention before merge; the rest are informational nits.

---

## Requirements Traceability

| Requirement (DDD-004 / site-structure.md) | Plan Element | Status |
|---|---|---|
| Home page IS the post index | Auto-block on `pathname === '/'` in `scripts.js:52` | COVERED |
| Reverse chronological sort | `entries.sort()` by date descending in `post-index.js:191-195` | COVERED |
| Type badge (small, muted, uppercase) | `.post-type` span with `text-transform: uppercase`, `--color-text-muted` | COVERED |
| Title as primary visual element | `<h2>` at `--heading-font-size-m`, `--color-heading`, weight 600 | COVERED |
| Description (1-2 sentences) | `<p class="post-description">` with `--body-font-size-s` | COVERED |
| Date (muted) | `<time>` with `--color-text-muted`, `--body-font-size-xs` | COVERED |
| Tags (small, clickable, visually quiet) | `<ul class="post-tags">` with `<a>` links, `--color-link`, `--body-font-size-xs` | COVERED |
| Entries separated by faint rule line | `.post-entry + .post-entry { border-top: 1px solid var(--color-border-subtle) }` | COVERED |
| No pagination | Not implemented | COVERED (correct exclusion) |
| No cards/shadows/gradients | Not implemented | COVERED (correct exclusion) |
| sr-only `<h1>` for heading hierarchy | `h1.sr-only` with text "Posts" prepended to block | COVERED |
| WCAG focus rings | `:focus-visible` with `2px solid var(--color-heading)`, `outline-offset: 2px` | COVERED |
| `helix-query.yaml` prerequisite | Created with `/blog/**` include, all required columns | COVERED |
| Design tokens only (no hardcoded hex) | All colors, fonts, sizes reference CSS custom properties | COVERED |
| No frameworks | Vanilla JS, vanilla CSS | COVERED |
| CSS scoped to block | All selectors prefixed `.post-index` | COVERED |
| Tag slug validation (security) | `/^[a-z0-9-]+$/` regex filter in `post-index.js:130` | COVERED |
| Path validation (security) | `path.startsWith('/')` check in `post-index.js:68` | COVERED |
| DOM construction via createElement (no innerHTML) | All elements built with `document.createElement()` and `textContent` | COVERED |
| `.sr-only` in `styles.css` (eager) | Defined at `styles/styles.css:213-223` | COVERED |
| Content model docs updated | `docs/content-model.md` now includes Query Index section | COVERED |

No stated requirements are missing from the implementation. No plan elements lack traceability to a requirement.

---

## Findings

### [ADVISE] `styles/styles.css:213` -- `.sr-only` uses `clip-path: inset(50%)` instead of `clip: rect(0, 0, 0, 0)`

The DDD-004 spec (line 428) prescribes `clip: rect(0, 0, 0, 0)` in the `.sr-only` definition. The implementation uses `clip-path: inset(50%)` instead. While `clip-path` is the modern replacement and functionally equivalent, there is a minor discrepancy: `clip` has broader support in older assistive technology / browser combinations. The `clip-path` version is arguably better (no deprecated property), but this is a deviation from the spec's exact definition.

FIX: Intentional improvement over spec -- document the deviation in the DDD-004 reviewer notes, or add both properties (`clip: rect(0, 0, 0, 0); clip-path: inset(50%)`) for maximum compatibility. Low severity either way.

### [ADVISE] `styles/styles.css:84-86` -- global `main > div` margin rule may conflict with post-index section

The global rule `main > div { margin: var(--section-spacing) var(--content-padding-mobile); }` applies horizontal margin to all direct `div` children of `main`. The post-index block lives inside a section wrapper (`main > .section > div`), but the `.section` rules at lines 170-195 override the horizontal spacing correctly. However, `main > div` at line 84 appears to be a legacy EDS boilerplate rule that predates the `.section`-based layout system introduced in DDD-001. It could cause unexpected horizontal margin on auto-blocked sections if EDS decoration order varies.

FIX: Verify this rule doesn't interfere with the post-index section wrapper. If DDD-001's `.section > div` rules fully supersede it, consider removing the `main > div` rule to prevent future confusion. Not blocking because the `.section` selectors have higher specificity.

### [NIT] `post-index.css:88` -- `stylelint-disable-next-line no-descending-specificity` comment

The disable comment is well-documented with a rationale comment on lines 86-87 explaining why the specificity order is intentional (tag links scoped to `.post-tags`, title links scoped to `h2`). This is the correct way to handle the stylelint override. No action needed.

### [NIT] `post-index.js:33` -- `parseDate` treats any positive number as Unix seconds

The condition `!Number.isNaN(num) && num > 0` would also match an ISO date string that happens to parse as a number (e.g., `"2026"` parses to `2026`, treated as Unix timestamp 2026 seconds = Jan 1 1970). In practice, EDS returns either proper Unix timestamps (large numbers like `1741910400`) or full ISO strings, so this edge case is academic. No fix needed.

### [NIT] `helix-query.yaml:4` -- `// tva` code signature

The `tva` signature is present as `# tva` (YAML comment syntax). Correctly placed per user preferences.

---

## CLAUDE.md Compliance

| Directive | Status |
|---|---|
| Design tokens from `tokens.css` only, no hardcoded hex | PASS -- all color/font/size values use CSS custom properties |
| No frameworks (vanilla JS/CSS) | PASS |
| No V1 scope items (RSS, search, comments, newsletter, analytics, dark mode toggle, pagination, related posts, sidebar) | PASS -- none present |
| CSS scoped to block | PASS -- all selectors prefixed `.post-index` |
| Semantic HTML, proper heading hierarchy | PASS -- sr-only `<h1>`, `<h2>` per entry, `<article>`, `<time>`, `<footer>` |
| WCAG 2.2 AA | PASS -- focus rings, `aria-labelledby`, `aria-hidden` on badge, sr-only heading prefix, semantic landmarks |
| `--color-accent` at most once per screen | PASS -- accent not used in post index |
| No cards/shadows/gradients/rounded containers | PASS |
| Typography creates hierarchy | PASS -- size and weight differentiation only |
| PR must include preview links | N/A -- review is pre-PR |
| `.js` extensions in imports | PASS -- `post-index.js` has no imports; `scripts.js` uses `.js` extensions |
| Mobile-first CSS, range notation media queries | PASS -- post-index CSS has no media queries (relies on token-level responsive adjustments in `tokens.css`) |

## AGENTS.md Compliance

| Directive | Status |
|---|---|
| Airbnb ESLint rules | PASS -- `eslint-disable` comments are scoped and justified |
| Block naming convention (`blockname/blockname.js`, `blockname/blockname.css`) | PASS -- `blocks/post-index/post-index.js`, `blocks/post-index/post-index.css` |
| Block exports default `decorate(block)` | PASS -- `post-index.js:163` |
| EDS three-phase loading | PASS -- auto-block injected in eager phase via `buildAutoBlocks()`, block decorated during section loading |
| No modification of `aem.js` | PASS |

## Scope Assessment

No scope creep detected. The implementation delivers exactly what DDD-004 specifies: a post-index block, a `helix-query.yaml` configuration, auto-block injection on `/`, `.sr-only` utility class, and content-model documentation updates. No adjacent features were added.
