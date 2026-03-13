ADVISE

---

- [accessibility]: The `aria-label="Tags"` on every post's `<ul>` is repeated identically across all entries, creating "Tags, list, N items" × 20+ announcements in list navigation — functional but verbose without adding disambiguation.
  SCOPE: `<ul class="post-tags" aria-label="Tags">` in `blocks/post-index/post-index.js` (and the HTML Structure spec in DDD-004)
  CHANGE: Omit `aria-label` from the tags `<ul>`. The enclosing `<article aria-labelledby="post-N-title">` landmark already provides post context; when the user tabs into a tag link they are already within a named article region. If a label is retained, make it unique per entry: `aria-label="Tags for Build Log: {title}"` — but this is heavyweight. Simpler to drop it.
  WHY: Repeated identical `aria-label` values across landmark-equivalent elements create navigation noise without adding context. The `<article>` landmark already scopes the tags. WCAG SC 2.4.6 (Headings and Labels) requires labels to be descriptive — a label that is identical across 20 instances provides no disambiguation. This is a usability concern for screen reader users, not a hard violation, but it degrades the experience of the intended audience.
  TASK: Task 1

- [accessibility]: The visually hidden `<h1>` is placed inside the `post-index` block div. EDS wraps blocks in `.blockname-wrapper > .blockname-container > .blockname.block`. If the post-index block is not the first rendered element in `<main>`, the `<h1>` will not be the first heading in the DOM, violating the expectation set by WCAG SC 1.3.2 (Meaningful Sequence) and the heading hierarchy contract.
  SCOPE: HTML Structure section of DDD-004; `decorate()` function in the post-index block (implementation)
  CHANGE: The DDD should explicitly specify that the `<h1 class="sr-only">Posts</h1>` must be the first child of the `<main>` element in DOM order, not the first child of the block div. Document two acceptable approaches: (a) auto-blocking injects the post-index block as the first and only content in `<main>`, OR (b) the `decorate()` function prepends the sr-only `<h1>` to `document.querySelector('main')` rather than to the block element. The current HTML Structure example shows it inside the block div — this is acceptable only if the block is guaranteed first in `<main>`.
  WHY: Screen reader users navigating by heading expect the `<h1>` to appear before any `<h2>`. If EDS injects other elements (e.g., section wrappers) before the block renders, the heading order will be wrong. This is a structural guarantee the DDD should make explicit.
  TASK: Task 1

---

The six specific review questions are answered as follows:

1. ARIA dual-pattern (aria-hidden badge + sr-only h2 prefix): CORRECT. The pattern is architecturally sound. `aria-hidden="true"` on the visible badge suppresses it from the tree; the sr-only prefix inside the `<h2>` delivers "Build Log: [title]" to heading navigation. `<article aria-labelledby>` correctly inherits the full string. No changes needed.

2. Heading hierarchy (sr-only h1, h2 for post titles): SOUND, with the DOM order caveat noted above. No levels are skipped. The sr-only `<h1>` text "Posts" is appropriate — it identifies the page landmark without visual impact.

3. Tag list markup (`<ul aria-label="Tags">` with `<li><a>` children): APPROPRIATE for semantics. The aria-label concern above is advisory, not blocking. CSS-generated middot separators (`:before { content: " · " }`) will not be announced by NVDA/Firefox, which is the correct outcome.

4. `<time datetime>` usage: CORRECT. `datetime="2026-03-12"` is valid ISO 8601. Visible text "March 12, 2026" is the screen reader announcement. No action needed.

5. `--color-text-muted` at 4.89:1: PASSES WCAG 2.2 AA. At 14–15px weight 400, this is normal text requiring 4.5:1; 4.89:1 clears the threshold in both light and dark mode. Dark mode (#C9C3B8 on #3A3A33) is approximately 5.07:1, also passing. No issue.

6. Keyboard navigation and focus management: SOUND. Tab follows DOM order (title link, then tag links per entry). No dynamic focus management is required for a static list. Focus indicator `outline: 2px solid var(--color-heading); outline-offset: 2px` on `:focus-visible` satisfies WCAG 2.2 SC 2.4.13 Focus Appearance — the dark green outline on warm white background is well above the 3:1 adjacent-color contrast threshold.
