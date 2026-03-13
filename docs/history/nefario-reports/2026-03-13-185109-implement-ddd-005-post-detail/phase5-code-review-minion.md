# Code Review: DDD-005 Post Detail

Reviewer: code-review-minion
Date: 2026-03-13

---

## Summary

The implementation is structurally sound and largely faithful to the spec. `post-utils.js` extraction is clean. Security posture is good: no `innerHTML`, slug validation before href construction, all text set via `textContent`. The scoping strategy (`body.post-detail`) is correctly implemented throughout. Three issues require attention before merge.

---

VERDICT: ADVISE

FINDINGS:

- [BLOCK] `scripts/scripts.js`:232-237 -- `post-detail.css` is loaded conditionally in `loadEager` but only after `decorateMain(main)` runs, which calls `decoratePostDetail` and adds the `post-detail` class to `<body>`. That class is then used to gate the CSS load. This ordering is correct — however, `decoratePostDetail` also runs `main.querySelectorAll('pre')` and sets `tabindex` and `role="region"` on ALL `<pre>` elements in `main` at that point. During eager phase, only the first section is in the DOM (the remaining sections are loaded lazily in `loadSections`). Pre elements in body sections 2+ will be processed by `loadSections` → `decorateBlocks`, but `decoratePostDetail` will have already finished. The `tabindex="0"` walk fires once, early, and misses any `<pre>` elements that live in sections that hadn't yet been parsed into the DOM.
  FIX: Move the `querySelectorAll('pre')` walk out of `decoratePostDetail` and into a post-`loadSections` hook, or run it lazily (e.g., a `MutationObserver` scoped to `main`, or simply repeat the walk at the end of `loadLazy`). The simplest fix: in `loadLazy` in `scripts.js`, after `await loadSections(main)`, add:
  ```js
  if (document.body.classList.contains('post-detail')) {
    main.querySelectorAll('pre').forEach((pre) => {
      pre.setAttribute('tabindex', '0');
      pre.setAttribute('role', 'region');
      pre.setAttribute('aria-label', 'Code example');
    });
  }
  ```
  Then remove the `querySelectorAll` loop from `decoratePostDetail`.

- [BLOCK] `blocks/quote/quote.js`:86-96 -- `buildBlockquote` uses `p.textContent = text` to populate each paragraph. This strips any inline markup (bold, italic, code, links) that may exist in the authored cell content. EDS table cells can contain rich inline HTML — an author writing a blockquote with an `<em>` word or an inline `<code>` span will have that formatting silently discarded. The spec does not explicitly require rich inline support, but destroying it without warning is a bug pattern, and the extraction path (`extractParagraphs`) already strips to plain text in the same way.
  FIX: Change the approach to preserve the inner HTML of each paragraph rather than extracting text. In `extractParagraphs`, instead of returning `string[]`, return `Element[]` (the actual child nodes). In `buildBlockquote`, `append` those elements directly (cloned) rather than setting `textContent`. This is the no-`innerHTML` compliant path:
  ```js
  // extractParagraphs: return Element[] instead of string[]
  // buildBlockquote receives Element[]:
  paragraphs.forEach((el) => {
    const p = document.createElement('p');
    p.append(...el.cloneNode(true).childNodes);
    blockquote.append(p);
  });
  ```
  If plain-text-only is an intentional V1 constraint, document it explicitly in the JSDoc and add a TODO for rich inline support.

- [ADVISE] `styles/post-detail.css`:41-55 and 124-132 -- Tag link styles are duplicated. `.post-meta a:any-link` is styled once under the `.post-meta` top-level rule block (lines 41-55) and again under `.default-content-wrapper .post-meta a:any-link` (lines 124-132). The second ruleset is more specific and will always win, making the first redundant. This creates a maintenance hazard — a future edit to one block may miss the other.
  FIX: Remove the duplicate block at lines 41-55 (`body.post-detail .post-meta a:any-link` and its hover/focus-visible rules). The `.default-content-wrapper .post-meta a:any-link` block at lines 124-132 is the correctly scoped version and is sufficient. Move the `focus-visible` rule to that block if it was intentionally there:
  ```css
  body.post-detail .default-content-wrapper .post-meta a:focus-visible {
    outline: 2px solid var(--color-heading);
    outline-offset: 2px;
  }
  ```

- [ADVISE] `blocks/quote/quote.js` (no `role` on standard blockquote) -- The spec HTML structure shows `.quote.block > blockquote` for standard quotes, which is correct semantic HTML. However, the `<blockquote>` has no `cite` attribute and no accessible label. This is fine per spec, but worth noting: if the same block is ever used outside a post-detail context (e.g., a landing page), the absence of the `body.post-detail` scoping for spacing means the `quote-wrapper` margin-block won't apply and it will fall back to global `margin-top: 0.8em; margin-bottom: 0.25em` on the wrapper's parent — which may be visually acceptable but is worth a smoke test.
  FIX: No immediate code change required. Document in `quote.css` that margin-block is intentionally delegated to the consuming page's stylesheet (currently `post-detail.css`).

- [NIT] `scripts/scripts.js`:169-173 -- All code blocks receive `aria-label="Code example"` as a generic string. When there are multiple code blocks on a page this means every code block landmark is announced identically ("Code example, region"). Screen reader users navigating by landmark cannot distinguish between them.
  FIX: Consider omitting the `aria-label` entirely and relying on the surrounding heading context for disambiguation, or derive a label from the preceding heading:
  ```js
  const heading = pre.closest('.default-content-wrapper')
    ?.querySelector('h2, h3:last-of-type');
  const label = heading ? `Code example: ${heading.textContent.trim()}` : 'Code example';
  pre.setAttribute('aria-label', label);
  ```
  A simpler alternative: omit `role="region"` when there is no meaningful label. `tabindex="0"` alone is sufficient for keyboard scrollability; the `region` role is only needed when landmark navigation is a benefit.

- [NIT] `scripts/post-utils.js`:30 -- The `1e10` boundary comment explains the seconds vs. milliseconds distinction but the value itself (`num < 1e10`) will stop working as a Unix-seconds gate after 2286-11-20 (when Unix time in seconds exceeds 1e10). This is a non-issue for this site's operational life, but the comment is worth updating to clarify the assumption:
  FIX: Update comment to: `// Unix seconds are ~10 digits through year 2286; 1e10 distinguishes seconds from ms (13 digits).`

- [NIT] `blocks/quote/quote.css`:17 -- `.quote blockquote` selector is not scoped to the block. Per AGENTS.md: "Ensure all selectors are scoped to the block." The selector should be `.quote .quote blockquote` or more precisely structured to avoid any ambient `blockquote` in a `.quote`-classed ancestor outside this block context. In practice the EDS block wrapper provides sufficient scoping since `.quote` is the block class, but the linter may flag unscoped selectors depending on config.
  FIX: The current selectors (`.quote blockquote`, `.quote.pull-quote blockquote`) are acceptable because `.quote` IS the block class and EDS block CSS is scoped to that class by convention. No change required unless linting flags it — in that case, verify `.quote` is always the outermost scope.

---

## Files Reviewed

- `scripts/post-utils.js` -- clean, correct, well-documented
- `scripts/scripts.js` -- correct ordering, good guard logic; pre tabindex walk timing issue (BLOCK above)
- `styles/post-detail.css` -- well-scoped, spec-faithful; duplicate tag link rules (ADVISE above)
- `blocks/quote/quote.js` -- good structure; inline markup loss is a correctness concern (BLOCK above)
- `blocks/quote/quote.css` -- correct, appropriately minimal
- `blocks/post-index/post-index.js` -- import refactoring is clean, no regressions observed
- `AGENTS.md` -- addition is accurate and useful
- `docs/content-model.md` -- blockquote authoring notes are clear and correct
