# Margo — Complexity Review: DDD-005 Post Detail

VERDICT: ADVISE

## Summary

Clean implementation. The extraction of shared utilities into `post-utils.js` is justified (second consumer exists). CSS is well-scoped. No frameworks, no dependencies, no unnecessary abstractions. Two items worth watching.

## Findings

- [ADVISE] `blocks/quote/quote.js`:25-38 -- `collectTextSegments` recursive tree walker is more machinery than the current use case needs. It walks arbitrary depth to collect text, but `extractParagraphs` already handles `<p>` and `<div>` children. The recursive walker only fires for the fallback "plain text cell" path (line 70-72), where `cellDiv.textContent.trim()` would produce identical results for any realistic EDS markup.
  FIX: Replace the `collectTextSegments` call on line 72 with `cellDiv.textContent.trim()`. Remove `collectTextSegments` entirely. If a future EDS markup structure actually needs recursive text extraction, add it then.

- [ADVISE] `scripts/scripts.js`:143-163 -- Tag parsing and rendering logic (split, trim, validate, build links) is duplicated between `decoratePostDetail` (lines 143-163) and `blocks/post-index/post-index.js` (lines 87-109). The shared `post-utils.js` was created specifically to deduplicate post-index and post-detail utilities, but tag rendering was not extracted. Same slug validation regex, same `/tags/${slug}` href pattern, same middot/list rendering (with minor structural differences -- spans vs ul).
  FIX: Not blocking because the two renderings differ structurally (inline spans with middots vs. `<ul>` with `<li>` elements). If a third consumer appears or the validation/href pattern changes, extract a shared `buildTagLinks()` utility. For now, monitor.

- [NIT] `styles/post-detail.css`:124-131 -- The `.post-meta a` link style override within `.default-content-wrapper` (lines 124-131) re-declares the same values already set on lines 41-49 (the non-wrapper-scoped `.post-meta a` rules). The more specific selector on line 124 exists to counteract the body link underline rule on line 115, but the duplication means any change to tag link styling must be made in two places.
  FIX: Consider ordering the selectors so that `.post-meta a` styles come after the body link defaults, relying on specificity rather than re-declaration. Low priority.

- [NIT] `scripts/scripts.js`:233-234 -- `post-detail.css` is loaded eagerly (in `loadEager`) and blocks LCP. The CSS is ~226 lines. For a text-heavy blog where most pages are post detail pages, this is likely fine. But if the site grows non-post pages, this eager load on every `/blog/` path adds latency to first paint for content that could load lazily.
  FIX: No action needed for V1 (sub-100KB budget, post pages are the primary surface). Revisit if page types diversify.
