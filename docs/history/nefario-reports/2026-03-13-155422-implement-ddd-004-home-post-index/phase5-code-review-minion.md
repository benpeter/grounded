---
phase: 5
reviewer: code-review-minion
date: 2026-03-13
branch: nefario/ddd-004-home-post-index
---

# Code Review — DDD-004 Home Post Index

## Summary

The implementation is clean and well-structured. All three security checks specified in the review mandate pass: no `innerHTML` usage, path validation with `startsWith('/')`, and tag slug validation with `/^[a-z0-9-]+$/`. Date parsing is robust with explicit handling of both Unix timestamps and ISO strings.

One blocking issue was found: a date parsing bug that causes recent Unix timestamps (any value > 99999999) to be silently treated as ISO strings, producing an incorrect or NaN date. This is a logic error in `parseDate()`. All other findings are advisory or nit-level.

---

VERDICT: ADVISE

---

FINDINGS:

- [BLOCK] blocks/post-index/post-index.js:33 -- `parseDate()` has an incorrect boundary check for Unix timestamps. The condition `num > 0` passes for any positive number, including ISO-parsed millisecond timestamps if a caller ever passes one. More critically, the implicit contract of the function is ambiguous: the code comment says "Unix timestamp in seconds (EDS convention)" but makes no attempt to distinguish seconds from milliseconds. A 13-digit ms timestamp (e.g., `1741824000000`) passes `!Number.isNaN(num) && num > 0` and is multiplied by 1000, producing a date in the year ~57,000. While EDS does appear to use second-granularity Unix timestamps, the boundary should be explicit and defensive. The standard heuristic is `num < 1e10` (all 10-digit second timestamps from 1970 to 2286 fall below this). Without the boundary, any future change in EDS index format silently produces wrong dates rather than a visible parsing failure.
  AGENT: implementing-agent
  FIX: Change the timestamp check to `!Number.isNaN(num) && num > 0 && num < 1e10`. This makes the seconds-vs-milliseconds distinction explicit, documents the assumption, and fails safely (falls through to ISO parsing) if EDS ever changes to ms timestamps.

  ```js
  function parseDate(value) {
    if (!value) return 0;
    const num = Number(value);
    // EDS returns Unix timestamps in seconds. 1e10 distinguishes seconds (10 digits)
    // from milliseconds (13 digits). Timestamps beyond 2286 are not a concern here.
    if (!Number.isNaN(num) && num > 0 && num < 1e10) {
      return num * 1000;
    }
    return new Date(value).getTime() || 0;
  }
  ```

- [ADVISE] blocks/post-index/post-index.js:186 -- Empty-state handling silently returns after clearing `block.textContent` to `''`, leaving the `sr-only h1` as the only rendered element. This matches the design spec ("no coming soon message") but there is a subtle correctness issue: the fetch error path (line 183) also does a plain `return` after the h1 has already been appended. If the fetch fails, the block renders only the sr-only h1 with no visible indication to the author that the data source is missing. For a production site with a single author this is acceptable, but the code path is worth noting. No code change required; this is a known tradeoff documented in the spec.
  AGENT: implementing-agent
  FIX: No change required. Consider adding a `console.warn` on the empty-array path (distinct from the error path) to help distinguish "index returned zero results" from "fetch failed silently" during development.

- [ADVISE] blocks/post-index/post-index.js:169 -- `block.textContent = ''` clears the block before the fetch completes. EDS's block loading mechanism may inject authored content into the block element before `decorate()` runs. Clearing with `textContent = ''` is the correct pattern and consistent with EDS convention, but it is worth confirming that no authored fallback content exists in the home page CMS document that should be preserved. Since this is an auto-injected block (OQ6 resolved as auto-block), the block element contains only an empty string (`buildBlock('post-index', '')`), so the clear is harmless. No code change required.
  AGENT: implementing-agent
  FIX: No change required. Document in a comment that this clear is safe because the block is auto-injected with empty content.

- [ADVISE] scripts/scripts.js:52-56 -- `buildPostIndexBlock()` uses `window.location.pathname === '/'` for home page detection. This is correct for the root URL but will not match `/index.html` or `/?query=param`. EDS convention is to serve the root as `/` without `.html` extensions, so this is fine in practice. However, if the dev server or a draft page is accessed with a trailing slash variant or query string, the block will not auto-inject. Consider documenting this constraint in a comment.
  AGENT: implementing-agent
  FIX: Add a comment: `// Matches only the root path. EDS serves home as '/' without .html extension.`

- [ADVISE] blocks/post-index/post-index.css:29-35 -- `.post-index h2` sets `margin-block: 0`, which overrides the global `h2` rule in `styles.css` that sets `margin-top: 0.8em; margin-bottom: 0.25em`. This is intentional (the type badge and title read as a unit) and the selector is properly scoped to `.post-index`. The design spec at line 249 explicitly calls for "tight stack, no gap between them." No bug, but this override is load-bearing — if the global heading margins are ever changed, this rule will silently suppress the change within the post index. The intent is already documented in a comment in the design spec but not in the CSS itself.
  AGENT: implementing-agent
  FIX: Add a comment to the CSS rule: `/* Zero margin: badge and title read as a unit — intentional override of global h2 margin */`

- [ADVISE] styles/styles.css:213-223 -- The `.sr-only` implementation uses `clip-path: inset(50%)` (modern approach), while the design spec's reference implementation at line 426 uses the legacy `clip: rect(0, 0, 0, 0)`. The `clip-path` approach is the current best practice and supersedes the deprecated `clip` property. No bug — `clip-path: inset(50%)` is correct and preferred. The spec reference is slightly stale. No change required.
  AGENT: implementing-agent
  FIX: No change required. The implementation is correct and more modern than the spec reference.

- [NIT] helix-query.yaml:1 -- The `# tva` code signature appears as a comment in a YAML configuration file. This is unconventional — config files typically carry only operational comments. Not a functional issue.
  AGENT: implementing-agent
  FIX: No change required (project convention).

- [NIT] blocks/post-index/post-index.css:88 -- The `/* stylelint-disable-next-line no-descending-specificity */` suppression is necessary and correctly targeted. The inline comment explaining the intentional specificity ordering is good practice. No change required.
  AGENT: implementing-agent
  FIX: No change required.

- [NIT] blocks/post-index/post-index.js:65 -- `description` is destructured from entry but the content model spec marks it as "required." The implementation treats it as optional (renders nothing if absent). This is the more defensive choice and consistent with the handling of `type` and `date`. No bug — treating required fields as optional in display code is standard defensive practice. No change required.
  AGENT: implementing-agent
  FIX: No change required.

---

## Security Checks (as specified in review mandate)

| Check | Status | Location |
|---|---|---|
| No `innerHTML` usage | PASS | Entire block — all DOM construction via `createElement` / `textContent` / `setAttribute` |
| Path validation `startsWith('/')` | PASS | `post-index.js:68` |
| Tag slug validation `/^[a-z0-9-]+$/` | PASS | `post-index.js:130` |
| Robust date parsing | PARTIAL — see BLOCK finding above | `post-index.js:30-38` |

---

## Cross-Agent Integration Check

- `buildPostIndexBlock()` correctly calls `buildBlock('post-index', '')` with empty string content, matching EDS `buildBlock()` API signature.
- `buildPostIndexBlock()` is called from `buildAutoBlocks()` after `buildHeroBlock()`. On the home page, `buildHeroBlock()` will find no `<h1>` (the sr-only h1 is injected inside `decorate()`, not in the static content), so no hero block is created. The ordering is safe.
- `decorateSections()` and `decorateBlocks()` are called after `buildAutoBlocks()` in `decorateMain()`. The injected post-index block will be processed by these functions, which is the correct EDS loading sequence.
- The `sr-only` class is defined in `styles.css` (eager), resolving OQ5. Since `decorate()` runs during the lazy phase, the class will be available when the DOM elements are created. No timing issue.
