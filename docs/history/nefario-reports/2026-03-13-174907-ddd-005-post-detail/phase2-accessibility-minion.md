## Domain Plan Contribution: accessibility-minion

### Recommendations

#### 1. Post metadata: use `<header>` within `<article>`, not `<footer>`

DDD-004 correctly uses `<footer>` for index entry metadata because in a list context, the metadata (date, tags) serves as supplementary information about each entry -- it is footer-level content. On the post detail page, the semantics are different. The title, type badge, date, updated date, and tags collectively form the **introductory content** of the article. Per the HTML spec, `<header>` represents introductory content for its nearest ancestor sectioning content.

Recommended structure:

```html
<article>
  <header class="post-header">
    <span class="post-type" aria-hidden="true">Build Log</span>
    <h1>
      <span class="sr-only">Build Log: </span>
      Building a Design System for EDS
    </h1>
    <div class="post-meta">
      <time datetime="2026-03-12">March 12, 2026</time>
      <!-- updated date, when present -->
      <span class="post-updated">
        (Updated <time datetime="2026-03-15">March 15, 2026</time>)
      </span>
      <ul class="post-tags">
        <li><a href="/tags/aem">aem</a></li>
      </ul>
    </div>
  </header>
  <!-- article body content -->
</article>
```

This is the correct semantic inversion from DDD-004: list entry metadata is a footer, full article metadata is a header. Both are valid uses of sectioning element metadata containers per the HTML spec.

#### 2. Pull-quotes: `<figure>` with `<blockquote>` inside

Pull-quotes are **not** traditional blockquotes (which are extended quotations from an external source). A pull-quote is an editorial device that extracts text from the article itself for visual emphasis. The semantically correct markup is:

```html
<figure class="pull-quote">
  <blockquote>
    <p>The practitioner's job is knowing which parts are grounded.</p>
  </blockquote>
</figure>
```

Why `<figure>` and not `<aside>`:
- `<aside>` implies tangential content -- content that could be removed without affecting the main flow. Pull-quotes are restatements of content already in the flow, so they are not tangential.
- `<figure>` is self-contained content that is referenced from the main flow, which correctly describes a pull-quote. It also avoids creating an extra landmark region (every `<aside>` becomes a `complementary` landmark, cluttering screen reader landmark navigation).
- `<blockquote>` inside `<figure>` preserves the quotation semantics.

If attribution is needed (for external quotes, not self-pull-quotes), add `<figcaption>`:

```html
<figure class="pull-quote">
  <blockquote>
    <p>Quote text here.</p>
  </blockquote>
  <figcaption>-- Source Name</figcaption>
</figure>
```

Screen readers will announce this as a figure containing a blockquote, which is appropriate. The `.pull-quote` class provides the styling hook for the accent border and editorial font.

**Important**: Since pull-quotes repeat content already in the article body, they should have `aria-hidden="true"` on the `<figure>` element to avoid screen readers announcing the same content twice. The pull-quote is a purely visual device; the content is already in the article flow.

```html
<figure class="pull-quote" aria-hidden="true">
  <blockquote>
    <p>The practitioner's job is knowing which parts are grounded.</p>
  </blockquote>
</figure>
```

#### 3. Published and updated dates: both as `<time>`, explicit text relationship

Both dates must be `<time>` elements with machine-readable `datetime` attributes. The relationship must be clear from the visible text alone (WCAG 1.3.1 Info and Relationships -- relationships conveyed visually must be programmatically determinable or available in text).

Recommended pattern:

```html
<time datetime="2026-03-12">March 12, 2026</time>
<span class="post-updated">
  (Updated <time datetime="2026-03-15">March 15, 2026</time>)
</span>
```

Screen reader announcement: "March 12, 2026 (Updated March 15, 2026)" -- the word "Updated" makes the relationship unambiguous without relying on visual styling or position alone.

Do NOT use `aria-label` on the `<time>` elements to add context like "Published: March 12, 2026" -- this overrides the visible text and violates WCAG 2.5.3 Label in Name (the accessible name must contain the visible text). The word "Updated" in the visible text is sufficient.

The parenthetical format "(Updated ...)" is preferable to a separate line because it reads as a natural clause in screen reader linear flow and is visually compact.

When no updated date exists, the `<span class="post-updated">` element should not be rendered at all (not hidden, not empty -- absent from the DOM).

#### 4. Code blocks: no ARIA attributes needed, language label is a best practice

`<pre><code>` blocks do not need ARIA attributes. The `<pre>` element's native semantics (preformatted text) are well-supported by all screen readers. Adding `role="code"` is unnecessary and unsupported.

For syntax-highlighted code, a visible language label is a best practice for sighted users and should be accessible:

```html
<div class="code-block">
  <div class="code-label" aria-hidden="true">JavaScript</div>
  <pre><code class="language-javascript" tabindex="0">
    // code here
  </code></pre>
</div>
```

Key points:
- `tabindex="0"` on `<pre>` or `<code>` makes long code blocks keyboard-scrollable (WCAG 2.1.1 Keyboard). Without this, keyboard users cannot scroll horizontally overflowing code. This is a common oversight.
- The visible language label with `aria-hidden="true"` avoids announcing "JavaScript" as a disembodied text node before every code block. Screen reader users already know they are in a code block from the `<pre>` semantics.
- `class="language-javascript"` follows the established convention (Prism, highlight.js) and is available for any future syntax highlighting integration.
- Do NOT use `aria-label="JavaScript code example"` on the `<pre>` -- this overrides the content announcement and screen readers would read the label instead of the code.

#### 5. Heading hierarchy: h1 = post title, h2/h3 in body, explicitly prohibit h4+

The DDD should explicitly state:

- **h1**: Post title (exactly one per page)
- **h2**: Major sections within the article body
- **h3**: Subsections within h2 sections
- **h4/h5/h6**: Prohibited in V1 content

The prohibition on h4+ is not just a recommendation -- it is a content constraint that enforces the site's typographic hierarchy. The token system defines heading sizes down to `--heading-font-size-xs` (16px), but h4 at `--heading-font-size-m` (22px/21px) is the same size as DDD-004's post titles. Using h4+ creates visual ambiguity and semantic depth that a technical blog does not need.

If an author truly needs a fourth nesting level, the content should be restructured. Document this as a content guideline, not just a CSS concern.

The heading hierarchy must not skip levels (WCAG 1.3.1). The DDD should explicitly state: every h3 must be preceded by an h2 (not necessarily immediately, but within the same section).

#### 6. Type badge on the post detail page

On the post detail page, the h1 IS the post title -- there is no link wrapping it (unlike DDD-004 where h2 contains an anchor). The same pattern should apply: visible badge is `aria-hidden="true"`, sr-only prefix goes inside the `<h1>`.

```html
<span class="post-type" aria-hidden="true">Build Log</span>
<h1>
  <span class="sr-only">Build Log: </span>
  Building a Design System for EDS
</h1>
```

This maintains consistency with DDD-004's pattern. Screen readers navigating by headings hear "heading level 1, Build Log: Building a Design System for EDS" -- providing type context without requiring visual inspection.

The sr-only text must match the badge DOM text exactly (title-case "Build Log", not CSS-uppercased "BUILD LOG") per WCAG 2.5.3 Label in Name -- same rationale as DDD-004.

#### 7. Article landmarks and ARIA

The `<article>` element does not need additional ARIA attributes on the post detail page:

- `<article>` implicitly has `role="article"`. Do not add `role="article"` explicitly (redundant).
- `aria-labelledby` referencing the h1 is **recommended** -- it gives the article landmark an accessible name, which helps screen reader users navigating by landmarks. Without it, the landmark announces as "article" with no name. With it: "article, Build Log: Building a Design System for EDS".

```html
<article aria-labelledby="post-title">
  <header class="post-header">
    <h1 id="post-title">
      <span class="sr-only">Build Log: </span>
      Building a Design System for EDS
    </h1>
    ...
  </header>
  ...
</article>
```

- No `aria-label` needed (the `aria-labelledby` covers it).
- No `role="main"` -- the `<main>` element wrapping the article handles that landmark.
- The `<header>` within `<article>` does NOT create a `banner` landmark (the HTML spec limits implicit `banner` to `<header>` that is a direct child of `<body>` or has no sectioning ancestor). This is correct behavior -- we do not want the post metadata header to appear as a page-level banner.

### Proposed Tasks

**Task 1: Define semantic HTML structure for post detail page**
- What: Document the complete HTML structure including `<article>`, `<header>` for metadata, h1 with sr-only type prefix, published/updated dates, tags, and body content containers
- Deliverables: HTML structure specification in DDD-005 with annotated accessibility rationale for each element choice
- Dependencies: DDD-004 (for pattern consistency), content-model.md (for metadata fields)

**Task 2: Define pull-quote markup pattern**
- What: Specify `<figure class="pull-quote" aria-hidden="true"><blockquote>` as the pull-quote pattern, with rationale for `aria-hidden` (duplicate content)
- Deliverables: Pull-quote HTML pattern in DDD-005, note distinguishing pull-quotes from standard blockquotes
- Dependencies: None

**Task 3: Define code block accessibility pattern**
- What: Specify `tabindex="0"` on `<pre>` for keyboard scrollability, visible language label pattern, no ARIA role overrides
- Deliverables: Code block HTML pattern in DDD-005
- Dependencies: None

**Task 4: Define heading hierarchy rules**
- What: Document h1/h2/h3 usage, explicit h4+ prohibition, no-skip-levels rule
- Deliverables: Heading hierarchy section in DDD-005 with content authoring guidance
- Dependencies: None

**Task 5: Specify focus management and keyboard navigation**
- What: Document tab order through the post page (header links, article body links, code blocks with tabindex, tag links, footer links). Confirm focus ring pattern matches DDD-002/003/004 (`outline: 2px solid var(--color-heading); outline-offset: 2px` on `:focus-visible`).
- Deliverables: Keyboard navigation section in DDD-005
- Dependencies: DDD-002, DDD-003

**Task 6: Verify all new color pairings for contrast compliance**
- What: Confirm that any new color pairings introduced in DDD-005 (e.g., pull-quote accent border, code block language label, updated date text) meet WCAG AA contrast ratios. Existing pairings from tokens.css are already verified, but any new combinations must be checked.
- Deliverables: Contrast verification table in DDD-005
- Dependencies: tokens.css (no new tokens expected, but usage combinations must be verified)

### Risks and Concerns

1. **Pull-quote `aria-hidden` must be enforced in the EDS block implementation.** If a pull-quote contains the only instance of important information (i.e., content NOT duplicated elsewhere in the article body), hiding it from screen readers causes an accessibility failure. The DDD must clearly define pull-quotes as visual repetitions of existing body content only. If the site later introduces standalone callout quotes (from external sources), those need a different pattern without `aria-hidden`.

2. **`tabindex="0"` on code blocks creates an extra tab stop.** For posts with many code blocks (common in build-log type), this increases keyboard navigation effort. This is an acceptable tradeoff because without it, keyboard users cannot scroll overflowing code at all (which is a worse failure). The DDD should note this tradeoff explicitly.

3. **Updated date rendering logic.** The updated date span must be completely absent from the DOM when no updated date exists -- not rendered as an empty element, not hidden with CSS or `aria-hidden`. An empty or hidden element could still be announced by some screen readers or cause layout artifacts.

4. **EDS default content wrapper constraints.** On the post detail page, EDS wraps default content (paragraphs, headings, lists) in `.default-content-wrapper` elements. The `<article>` element and `<header>` are not part of EDS's default markup. The implementation will need to either: (a) wrap the page content in an `<article>` via JavaScript in `decorate()` or `loadPage()`, or (b) accept that the `<article>` landmark is not present. Option (a) is strongly recommended -- the `<article>` landmark is important for screen reader navigation on a blog post page. This is an implementation detail that the DDD should flag as a requirement.

5. **Heading hierarchy enforcement is a content discipline issue, not a code issue.** The DDD can specify h4+ prohibition, but EDS renders whatever headings the author creates in the CMS. Consider whether the block/page decoration should log a console warning when h4+ headings are detected, as a development-time guardrail.

### Additional Agents Needed

None. The current team (ux-design-minion for visual decisions, frontend-minion for implementation, accessibility-minion for this contribution) is sufficient for DDD-005. The structured data (JSON-LD TechArticle) is out of scope per the content model doc, and SEO concerns are not part of the DDD's accessibility surface.
