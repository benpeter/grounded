# Domain Plan Contribution: accessibility-minion

## Recommendations

### 1. `aria-labelledby` pointing to `<h2>` with mixed content (sr-only span + anchor)

**Verdict: Correct, but with a nuance worth documenting.**

When `aria-labelledby` references an element, the accessible name computation (AccName 1.2) uses the **text content of the referenced element and all its descendants**, recursively. For `<h2 id="post-1-title">`, the computed accessible name will be the concatenation of all descendant text nodes:

```
"Build Log: " + "Building a Design System for EDS"
= "Build Log: Building a Design System for EDS"
```

This is correct. The `<a>` element inside the `<h2>` does not change the text computation -- the algorithm walks through it and collects the text content. The sr-only `<span>` text is included because it is part of the DOM (`.sr-only` only visually hides; it does not remove from the accessibility tree like `aria-hidden` or `display: none` would).

**Screen reader behavior**: When navigating by landmarks, screen readers will announce the `<article>` as "Build Log: Building a Design System for EDS, article". When navigating by headings, screen readers will announce "heading level 2, Build Log: Building a Design System for EDS". Both are the desired behavior.

**One edge case to verify in testing**: Ensure the trailing space in `<span class="sr-only">Build Log: </span>` produces a space between the prefix and the link text. In practice, the whitespace between the closing `</span>` tag and the `<a>` tag, combined with the space after the colon, should produce correct spacing. However, if the DOM is constructed programmatically without whitespace text nodes between elements, screen readers may concatenate without a space. The `textContent` of the sr-only span should end with `: ` (colon-space) to guarantee separation regardless of whitespace normalization.

**Recommendation**: When constructing the DOM in JavaScript, set the sr-only span's `textContent` to `'Build Log: '` (with trailing space) as specified. This is sufficient. Do NOT rely on whitespace text nodes between elements.

### 2. `.sr-only` class definition review

The proposed definition in DDD-004:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

**Verdict: This matches current best practices.** This is the standard sr-only / visually-hidden pattern used by Bootstrap 5, Tailwind, and recommended by WebAIM and the A11Y Project. Specific assessment:

- `position: absolute` -- removes from normal flow without hiding from AT. Correct.
- `width: 1px; height: 1px` -- maintains the element in the accessibility tree (unlike `display: none` or `visibility: hidden`). Correct.
- `margin: -1px` -- prevents the 1px element from causing scrollbar or layout shifts. Correct.
- `overflow: hidden` -- clips any content that exceeds the 1x1 box. Correct.
- `clip: rect(0, 0, 0, 0)` -- legacy clip (deprecated but still supported everywhere). The modern equivalent is `clip-path: inset(50%)`, but `clip: rect(0,0,0,0)` has broader support and is not removed from any browser yet. Acceptable.
- `white-space: nowrap` -- prevents the hidden content from wrapping and potentially affecting layout measurements. Correct.
- `border: 0` -- removes any default borders. Correct.

**One improvement to consider (non-blocking)**: Some implementations also add `clip-path: inset(50%)` as a progressive enhancement alongside the legacy `clip` property. This is optional -- the current definition works in all browsers. Not worth blocking implementation.

**Placement**: DDD-004 recommends placing `.sr-only` in `styles/lazy-styles.css` (Open Question 5). This is acceptable because the post-index block is lazy-loaded. However, `.sr-only` is a utility class likely needed by future blocks and potentially by eager-loaded content. I recommend defining it in `styles/styles.css` instead, as it is a zero-cost addition (no rendering impact, tiny CSS footprint) and avoids a potential FOUC issue if any eager-loaded block later needs `.sr-only`. This is a minor preference, not a blocker.

### 3. Keyboard navigation and tab order

**Verdict: The proposed tab order is correct and follows WCAG 2.4.3 Focus Order (A).**

The tab order per the spec is:
1. Title link (entry 1)
2. Tag link 1 (entry 1)
3. Tag link 2 (entry 1)
4. Tag link N (entry 1)
5. Title link (entry 2)
6. ... and so on

This follows DOM order, which matches the visual reading order (top-to-bottom, left-to-right within the metadata line). No `tabindex` manipulation is needed or desired.

**Considerations:**

- **Tab stop count**: With 10 posts averaging 3 tags each, that is approximately 40 tab stops on the page (plus header/footer links). This is manageable. WCAG does not set a maximum, and the structure is predictable. Users can navigate by headings (10 stops) or landmarks (10 articles) for faster traversal.

- **Focus indicators**: The spec uses `outline: 2px solid var(--color-heading); outline-offset: 2px` on both title links and tag links, matching the header and footer patterns. This satisfies WCAG 2.4.13 Focus Appearance (AA) requirements:
  - The focus indicator is at least 2px thick (meets minimum area requirement).
  - `--color-heading` (#3F5232) on `--color-background` (#F6F4EE) achieves 7.75:1 contrast in light mode -- well above the 3:1 minimum for focus indicators.
  - In dark mode, `--color-heading` (#F6F4EE) on `--color-background` (#3A3A33) achieves 10.42:1. Passes.

- **WCAG 2.4.11 Focus Not Obscured (A)**: Not a concern here -- the page has no sticky overlays, popups, or fixed-position elements that could obscure focused items. The header has `position: relative` (not sticky/fixed), so it will not cover focused elements.

- **Tag links before DDD-007**: Tags link to `/tags/{slug}` which will 404 until DDD-007 ships. When a keyboard user tabs to a tag link and activates it, they get a 404 page. This is not an accessibility violation (the link is functional and navigable), but it is a usability issue. Ensure the 404 page (`404.html`) is accessible and provides a way back. This is already in the project structure.

### 4. Empty state accessibility

**Verdict: The empty state (sr-only h1 only) does not create accessibility issues, but there is one consideration.**

When the query index returns zero results, the block renders:

```html
<h1 class="sr-only">Posts</h1>
```

This is a valid, minimal page. The heading hierarchy is correct (h1 exists). Screen readers will announce the heading when navigating by headings, which is correct behavior.

**Consideration**: The `<main>` element will contain only a visually hidden h1 with no visible content. Sighted users see an empty page with header and footer -- this is intentional per the spec ("No 'coming soon' message"). For screen reader users, `<main>` will announce as the main landmark with a single heading "Posts" and nothing else. This accurately represents the page state.

**No additional ARIA or messaging is needed.** An `aria-live` region announcing "no posts" would be unnecessary -- this is a static page state, not a dynamic update. The absence of content is self-evident.

**One edge case**: If the fetch fails (network error, malformed JSON), the block should still render the sr-only h1. The user should not encounter an error-less blank main landmark. The implementation should handle fetch failures gracefully -- render the h1 regardless of fetch outcome.

## Proposed Tasks

### Task 1: Define `.sr-only` utility class

**What**: Add the `.sr-only` CSS class definition to `styles/styles.css` (not `lazy-styles.css`).

**Deliverables**: Updated `styles/styles.css` with the `.sr-only` class as specified in DDD-004.

**Dependencies**: None. Can be done first or in parallel with block implementation.

**Rationale for styles.css over lazy-styles.css**: The class is a global utility with near-zero rendering cost. Placing it in the eager stylesheet prevents FOUC if future eager-loaded blocks need it, and avoids a timing dependency where the sr-only content briefly flashes before lazy CSS loads.

### Task 2: Verify accessible name computation in implementation

**What**: After the block is built, verify with browser DevTools (Chrome Accessibility tab or Firefox Accessibility Inspector) that:
- Each `<article>` element's computed accessible name matches `"{Type}: {Title}"` (e.g., "Build Log: Building a Design System for EDS").
- Each `<h2>` element's computed accessible name matches the same pattern.
- The visible `.post-type` badge (with `aria-hidden="true"`) does NOT appear in the accessibility tree.

**Deliverables**: Verification notes or screenshot confirming accessible names are computed correctly.

**Dependencies**: Block implementation must be complete. Requires a running dev server with test content.

### Task 3: Keyboard navigation testing

**What**: After block implementation, test keyboard tab order through the full page (header -> post entries -> footer). Verify:
- Tab order follows: title link -> tag links (per entry) -> next entry's title link.
- Focus indicators are visible on all interactive elements.
- No keyboard traps exist.
- Focus indicators meet WCAG 2.4.13 contrast requirements (verify with DevTools contrast picker).

**Deliverables**: Pass/fail verification notes.

**Dependencies**: Block implementation complete, dev server running with test content.

### Task 4: Screen reader spot-check

**What**: After block implementation, test with at least one screen reader (VoiceOver + Safari on macOS is available in this environment). Verify:
- Heading navigation reads: "heading level 2, Build Log: Building a Design System for EDS" (not double-announcing the type).
- Landmark navigation reads: "Build Log: Building a Design System for EDS, article".
- The tag list announces correctly: "list, N items" with each tag link readable.
- The `<time>` element reads the human-formatted date, not the ISO datetime attribute.

**Deliverables**: Pass/fail verification notes.

**Dependencies**: Block implementation complete, dev server running with test content. Requires macOS with VoiceOver available.

### Task 5: Validate tag slug sanitization

**What**: Verify the implementation validates tag slugs against `/^[a-z0-9-]+$/` before inserting them into `href` attributes. Test with edge cases:
- Valid: `aem`, `claude-code`, `ai-workflow`
- Invalid (should be skipped or sanitized): `../admin`, `javascript:alert(1)`, `<script>`, empty string, strings with spaces

**Deliverables**: Verification that invalid tag slugs do not produce dangerous `href` values.

**Dependencies**: Block implementation complete.

## Risks and Concerns

### Risk 1: sr-only text concatenation without whitespace

**Severity**: Medium. **Likelihood**: Low.

If the DOM is constructed programmatically and the sr-only span's `textContent` does not end with a space character, screen readers may announce "Build Log:Building a Design System for EDS" (no space after colon). The spec correctly includes the trailing space in `"Build Log: "`, but the implementing developer must preserve this exactly. A missing space is a subtle bug that only manifests in assistive technology.

**Mitigation**: The implementing agent should use string constants like `'Build Log: '` with explicit trailing space, or use a template that appends `: ` to the type display name.

### Risk 2: Global `h1` / `h2` styles in styles.css overriding block intent

**Severity**: Medium. **Likelihood**: High.

The global `styles.css` defines `h1 { font-size: var(--heading-font-size-xxl); }` and heading margins (`margin-top: 0.8em; margin-bottom: 0.25em`). The sr-only `<h1>` does not need font-size overrides (it is visually hidden), but the `.sr-only` class must fully override the margin/size so the hidden h1 does not create invisible space. The `position: absolute` in `.sr-only` removes it from flow, so the margins should not affect layout. However, verify this in practice.

For the `<h2>` elements, the global style sets `font-size: var(--heading-font-size-xl)` (36px), but the block needs `--heading-font-size-m` (22px). The block CSS selector `.post-index h2` must have sufficient specificity to override the global `h2` rule. Given that `.post-index h2` (class + element) has higher specificity than `h2` (element only), this should work. Verify.

**Mitigation**: Ensure block-scoped selectors override globals. The global `margin-top: 0.8em` on h2 also needs to be overridden to `margin-block: 0` as the spec requires tight badge-to-title spacing.

### Risk 3: `<article>` elements as landmarks may create noise

**Severity**: Low. **Likelihood**: Low.

Per the HTML spec, `<article>` elements are exposed as landmark regions in the accessibility tree when they have an accessible name (provided here via `aria-labelledby`). With 10+ articles, the landmarks list becomes long. This is still correct and useful behavior -- screen reader users navigating by landmarks can jump directly to a specific post. However, some screen reader users may find a long landmarks list overwhelming.

**Mitigation**: This is the correct semantic pattern. No change needed. The alternative (removing `aria-labelledby` or using `<div>` instead of `<article>`) would reduce accessibility. Screen reader users who prefer heading navigation can use that instead.

### Risk 4: CSS middot pseudo-elements may be announced by some screen readers

**Severity**: Low. **Likelihood**: Medium.

The CSS `content: " \B7 "` (middot) pseudo-elements between tags and between date and tags may be announced by some screen readers as "middle dot" or similar. This is a known inconsistency across screen readers -- some ignore CSS-generated content, others announce it.

**Mitigation**: Test with VoiceOver and document the behavior. If the middot is announced, it is not harmful (just slightly verbose). The alternative -- using `aria-hidden` spans with literal middot characters -- is more complex and not clearly better. The CSS approach is the pragmatic choice for V1.

### Risk 5: `<time>` element date formatting

**Severity**: Low. **Likelihood**: Low.

The spec uses `Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' })` for the visible date text. This is correct and screen-reader friendly. Screen readers will read "March 12, 2026" from the text content, not the `datetime` attribute. The `datetime` attribute provides machine-readable semantics for structured data and search engines.

**Mitigation**: None needed. Just verify `Intl.DateTimeFormat` output matches expectations on the target platform.

## Additional Agents Needed

None. The current team is sufficient. The accessibility review is complete at the planning level; post-implementation verification (Tasks 2-5) can be performed by the accessibility-minion after the frontend-minion builds the block.
