# Domain Plan Contribution: frontend-minion

## Recommendations

### 1. EDS DOM Structures for Content Elements

Based on inspecting the live EDS output (`sample-build-log.plain.html`) and the EDS markup reference, here is what EDS delivers for each content element:

**Code blocks** are delivered as `<pre><code>...</code></pre>` — standard HTML. No language classes are added automatically. EDS converts fixed-width font formatting (Courier New in Google Docs/Word) into `<code>` for inline and `<pre><code>` for multiline. This is "default content" (not a block), so it lives inside `.default-content-wrapper` and requires no block JS/CSS — only global styles.

**Inline code** is delivered as `<code>` elements within paragraphs. No special wrapping or classes.

**Blockquotes** — `<blockquote>` is NOT in the EDS allowed element list for default content. EDS does not produce `<blockquote>` from authored content. Quotes require a dedicated "Quote" block (authored as a table in Google Docs). Adobe's block collection provides a reference implementation at `adobe/aem-block-collection/blocks/quote/`. This block creates a `<blockquote>` in its `decorate()` function, with `.quote-quotation` and `.quote-attribution` children.

**Lists** — `<ul>` and `<ol>` with `<li>` children are delivered as standard HTML within `.default-content-wrapper`. No additional wrapping or classes applied.

**Headings** — `<h1>` through `<h6>` with auto-generated `id` attributes (sanitized from text content) for fragment linking.

### 2. Code Block Width Strategy

The `--measure: 68ch` reading width is narrow for code. After analysis, I recommend:

- **Keep code blocks within the 68ch measure** — do NOT break out. Breaking out creates visual disruption in the single-column layout and requires complex CSS that fights the EDS two-tier geometry.
- **Use `overflow-x: auto` on `<pre>`** for horizontal scrolling on long lines. This is already in `styles.css` and matches the boilerplate pattern.
- The existing DDD-001 note explicitly states: "`.default-content-wrapper` must not have `overflow: hidden`. Code blocks inside it may contain wide pre-formatted content that should scroll horizontally rather than be clipped." This is already correctly implemented.
- Add a subtle visual indicator (fade/gradient on the right edge) to signal scrollable content — optional, low priority.

68ch is approximately 40-45 characters in a monospace font at the current `--body-font-size-s` (17px). This is tight but acceptable for a technical blog: most code examples should be kept short by the author. Horizontal scroll handles the exceptions.

### 3. decorateButtons() Impact on Links

The `decorateButtons()` function in `aem.js` (lines 424-456) transforms links in a specific pattern the DDD must account for:

- A link (`<a>`) that is the **sole child** of a `<p>` or `<div>`, **and** whose `href` differs from its `textContent`, gets `class="button"` and its parent gets `class="button-container"`.
- A link wrapped in `<strong>` (sole child of `<p>`) becomes `class="button primary"`.
- A link wrapped in `<em>` (sole child of `<p>`) becomes `class="button secondary"`.
- Links inside images are NOT transformed.

**Implication for the DDD:** Inline links within paragraphs are safe — they are not transformed. But a paragraph containing ONLY a bare link (where href differs from text) will become a button. The DDD should document this behavior so authors know: a standalone link on its own line becomes a CTA button unless the displayed text matches the URL.

### 4. Pull-Quote Strategy

Since `<blockquote>` is not available as default content, pull-quotes need a custom block approach. Two options:

**Option A (Recommended): Single "quote" block with a variant**
- Author a "Quote" block in Google Docs (standard EDS block table)
- Use block variant "Quote (pull-quote)" for the gold-bordered editorial style
- Use plain "Quote" for standard blockquotes
- The `decorate()` function handles both variants, applying different CSS classes

**Option B: Separate "pull-quote" block**
- Dedicated block directory `blocks/pull-quote/`
- More explicit naming, but adds a block when a variant would suffice

I recommend Option A. The quote block from Adobe's block collection is the established pattern. Adding a `pull-quote` variant keeps block count minimal.

CSS for the pull-quote variant:
- `font-family: var(--font-editorial)` (Source Serif 4)
- `border-left: 3px solid var(--color-accent)` (gold)
- No background color, no border-radius
- Consistent with the "gold appears once per screen" rule

### 5. Syntax Highlighting

EDS does NOT provide syntax highlighting. The `<pre><code>` output is plain text with no language annotations.

**Recommendation:** Load a lightweight syntax highlighting library in `delayed.js` (phase 3 of EDS loading). Options:

- **Prism.js** — lightweight (~2KB core), extensible, widely used. Load only needed language grammars.
- **Highlight.js** — auto-detects language, ~45KB for common languages. Heavier but zero-config.
- **Shiki** — uses TextMate grammars (VS Code quality), but requires WASM loading. Too heavy for this use case.

**Recommended approach:**
1. Ship without syntax highlighting initially (plain styled `<pre><code>`). The `--color-background-soft` background and `--font-code` already make code blocks visually distinct.
2. Add Prism.js in `delayed.js` as a fast follow. Author specifies language via a convention (e.g., the first line of a code block contains `language: javascript` which gets stripped, or a block variant).
3. Since EDS does not add language classes, the highlighting library would need either auto-detection or a content convention.

**Language annotation convention for EDS:** Since there are no fenced code blocks with language hints, the DDD should specify a convention. The simplest: authors put the language name on a line immediately before the code block (e.g., a paragraph saying "javascript" in a specific format). Alternatively, auto-detection works for most common languages but is less reliable.

**V1 recommendation: Ship without syntax highlighting.** The blog's aesthetic is minimal — monochrome code on a warm background is consistent with the brand. Syntax highlighting can be added later without changing authored content, since it's purely a presentation concern applied in `delayed.js`.

### 6. Content Element Styling Specifications

The DDD should specify styles for each element. Based on the existing tokens and design language:

**Headings (h2, h3):**
- `color: var(--color-heading)` — already set globally
- `font-family: var(--font-heading)` (Source Code Pro) — already set
- Asymmetric spacing: more space above than below (already `margin-top: 0.8em; margin-bottom: 0.25em`)
- `scroll-margin: 40px` for fragment links — already set

**Paragraphs:**
- `font-family: var(--font-body)` (Source Sans 3) — already set
- `line-height: var(--line-height-body)` (1.7) — already set
- Standard margin spacing — already set

**Code blocks (`<pre>`):**
- `background-color: var(--color-background-soft)` — already set
- `font-family: var(--font-code)` — needs to be explicitly set on `code` elements
- `font-size: var(--body-font-size-s)` — already set
- `overflow-x: auto` — already set
- `border-radius: 0` — override boilerplate's `8px` (the design has "no rounded containers")
- No border (the background separation is sufficient)
- `padding: 16px` — already set, adequate

**Inline code (`<code>`):**
- `font-family: var(--font-code)`
- `font-size: 0.9em` (slightly smaller than surrounding text)
- `background-color: var(--color-background-soft)` — subtle highlight
- `padding: 0.15em 0.3em` — small inline padding
- `border-radius: 3px` — exception to the "no rounded containers" rule; this is standard inline code treatment, not a container

**Lists (`<ul>`, `<ol>`):**
- Standard list styling with adequate left padding
- `line-height: var(--line-height-body)` — inherit from body
- `margin-bottom` on `<li>` for spacing between items (suggest `0.3em`)
- Nested lists should have reduced spacing

**Links:**
- Already styled: `color: var(--color-link)`, underline on hover
- Within article body, consider adding `text-decoration: underline` by default (not just on hover) for accessibility — links should be distinguishable by more than color alone (WCAG 1.4.1)

### 7. Post Metadata Line

The metadata line (type badge, date, updated date, tags) should be styled as part of the post header, not as a block. This content comes from page metadata (`<meta>` tags), not from the document body.

The DDD should specify:
- How metadata is extracted (via `getMetadata()` from `aem.js`)
- Where it is injected into the DOM (likely via `buildAutoBlocks()` or a dedicated post-header auto-block)
- The visual treatment: muted text, small size, type badge as a label

### 8. Dark Mode Considerations

All content element styles must work in both light and dark mode. The token system already swaps values via `prefers-color-scheme: dark`. Key items to verify:
- Code block background contrast in dark mode (`--color-background-soft` becomes `#3F5232`)
- Inline code background visibility in dark mode
- Link color contrast in dark mode (already verified: `--color-link` becomes `#9FB68A` at 5.3:1)

## Proposed Tasks

### Task 1: Define Content Element DOM Specifications
**What:** Document the exact HTML structures EDS delivers for each content element (headings, paragraphs, code blocks, inline code, lists, links) and the decoration functions that modify them.
**Deliverable:** Section in DDD-005 with DOM structure tables.
**Dependencies:** None (analysis already complete in this contribution).

### Task 2: Define Code Block Styling
**What:** Specify CSS for `<pre><code>` elements: background, font, padding, overflow behavior, border-radius override. Include dark mode.
**Deliverable:** CSS specification in DDD-005 with token references.
**Dependencies:** Task 1.

### Task 3: Define Inline Code Styling
**What:** Specify CSS for `<code>` elements within prose: background, padding, font-size.
**Deliverable:** CSS specification in DDD-005.
**Dependencies:** Task 1.

### Task 4: Define Quote Block Architecture
**What:** Specify the quote block approach (adapted from Adobe's block collection) with pull-quote variant. Document authoring convention, `decorate()` function behavior, and CSS for both variants.
**Deliverable:** Block specification in DDD-005, including authored input format and decorated output DOM.
**Dependencies:** Task 1.

### Task 5: Define Link Styling for Article Context
**What:** Specify link treatment within article body (always underlined for accessibility), noting the `decorateButtons()` side effect on standalone links.
**Deliverable:** CSS specification and author guidance in DDD-005.
**Dependencies:** Task 1.

### Task 6: Define Post Metadata Display
**What:** Specify how post metadata (type badge, date, updated date, tags) is extracted from `<meta>` tags and rendered. Define the auto-block or decoration function approach.
**Deliverable:** Metadata rendering specification in DDD-005.
**Dependencies:** Content model (docs/content-model.md).

### Task 7: Syntax Highlighting Decision
**What:** Document the V1 decision (no syntax highlighting) and the future path (Prism.js in delayed.js). Specify the language annotation convention for authored content.
**Deliverable:** Decision record in DDD-005 with rationale.
**Dependencies:** None.

### Task 8: Dark Mode Verification for Article Elements
**What:** Verify all article content element styles against dark mode token values. Check contrast ratios for code backgrounds, inline code, and muted text.
**Deliverable:** Verification notes in DDD-005.
**Dependencies:** Tasks 2, 3, 4.

## Risks and Concerns

1. **68ch is tight for code** — At the code font size (`--body-font-size-s: 17px` in Source Code Pro), 68ch yields roughly 40-45 visible monospace characters before scroll. This is narrower than most developers expect. The DDD should acknowledge this constraint and recommend that authors keep code examples concise. Consider whether a wider code-specific measure (e.g., `80ch` or `var(--layout-max)` breakout) is worth the layout complexity.

2. **No native blockquote support in EDS** — The lack of `<blockquote>` in default content means standard markdown blockquotes (`>`) authored in Google Docs will not produce blockquotes. Authors MUST use the Quote block (table format). This is a significant authoring UX concern — it is unintuitive and the DDD must document it clearly.

3. **decorateButtons() link transformation** — Any standalone link in a paragraph (where `href !== textContent`) becomes a button. This could unexpectedly style reference links or call-to-action links within article content. The DDD should document the pattern and recommend that authors place descriptive text links within sentences, not as standalone paragraphs.

4. **Syntax highlighting language detection** — Without fenced code blocks, there is no standard mechanism for authors to specify code language. Auto-detection is unreliable for short snippets. If syntax highlighting is added later, a convention must be established that does not disrupt existing authored content.

5. **Mobile code readability** — On a 375px viewport with 20px padding, the code block content area is approximately 335px. Horizontal scrolling is functional but not great UX. The DDD should consider whether code blocks should have reduced padding on mobile or whether touch-swipe affordances are needed.

6. **Pre inside default-content-wrapper** — The existing `max-width: var(--measure)` on `.default-content-wrapper` constrains `<pre>` elements. The `overflow-x: auto` on `<pre>` handles this correctly, but the DDD should explicitly state that `.default-content-wrapper` must NOT have `overflow: hidden` (reaffirming the DDD-001 note).

## Additional Agents Needed

None. The current team is sufficient for this DDD. The frontend implementation concerns (DOM structures, CSS specifications, block architecture) are well within scope. The UX design minion should weigh in on the visual treatment of metadata badges and pull-quotes, but that is likely already part of the planning process.
