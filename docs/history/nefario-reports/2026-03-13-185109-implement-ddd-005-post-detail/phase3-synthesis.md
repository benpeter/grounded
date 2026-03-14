# Phase 3: Synthesis — DDD-005 Post Detail

## Delegation Plan

**Team name**: ddd-005-post-detail
**Description**: Implement the post detail reading experience at `/blog/{slug}` — post header decoration, scoped CSS, Quote block, shared utilities, test content, and documentation updates.

### Conflict Resolutions

1. **`<article>` wrapper vs `role="article"` on `<main>`**: accessibility-minion flagged `role="article"` on `<main>` as a WCAG 1.3.1 violation (destroys the `main` landmark). frontend-minion did not address this directly. **Resolution**: Follow accessibility-minion's simpler alternative — skip the `<article>` wrapper entirely. A single blog post inside `<main>` with an `<h1>` is semantically complete. Do not add `role="article"` to `<main>`. Remove the `aria-labelledby` from `<main>` since it contains a single `<h1>`.

2. **Tag link underlines (WCAG 1.4.1)**: accessibility-minion flagged tag links as relying on color alone. DDD-005 spec deliberately matches DDD-004 precedent (no underline by default). **Resolution**: Add the subtle underline fix recommended by accessibility-minion (`text-decoration: underline; text-decoration-color: var(--color-border)`) to tag links in the post-detail metadata. This is low-impact visually and achieves WCAG 1.4.1 compliance. Do NOT retroactively fix DDD-004 post-index tags in this PR — that's a separate concern.

3. **`<pre>` accessibility attributes**: accessibility-minion recommends `role="region"` and `aria-label="Code example"` alongside `tabindex="0"`. **Resolution**: Include this — it's low-effort and improves screen reader experience. Apply universally (V1 tradeoff per accessibility-minion's note).

4. **CSS loading phase**: frontend-minion recommended eager loading of `post-detail.css` for V1 (simpler, avoids FOUC). **Resolution**: Agree. Single `styles/post-detail.css` loaded conditionally in eager phase via `await loadCSS()` before `document.body.classList.add('appear')`.

5. **`decorateButtons()` handling**: frontend-minion recommended CSS override (Option B) over JS exclusion. **Resolution**: Agree. CSS override is cleaner — no coupling to `decorateMain()` execution order, no risk of breaking aem.js patterns.

6. **Content discipline enforcement**: ux-strategy-minion recommends documentation-only, no programmatic enforcement. **Resolution**: Agree. Single-author blog, editorial discipline is sufficient.

### Risks and Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Metadata not in `<head>` at eager time | High | Implementing agent must verify with `curl localhost:3000/blog/building-eds-design-system` that meta tags exist before writing decoration logic |
| `post-detail.css` eager load adds HTTP request to LCP | Medium | File is ~150 lines / ~3KB. Monitor with PSI. Fall back to inlining critical subset in styles.css if score drops |
| Import path from post-index.js to post-utils.js | Low | Must use `../../scripts/post-utils.js` with `.js` extension. Verify in dev server |
| Quote block class propagation | Medium | frontend-minion and ux-strategy-minion both flagged: verify whether `pull-quote` class lands on block div vs section div with `curl` |
| `body.post-detail` class timing | Medium | Must be added in `buildAutoBlocks()` (synchronous, before `loadSection`) to ensure CSS applies before first paint |

---

### Task 1: Extract shared post utilities
- **Agent**: frontend-minion
- **Delegation type**: standard
- **Model**: sonnet
- **Mode**: bypassPermissions
- **Blocked by**: none
- **Approval gate**: no
- **Prompt**: |
    Extract shared post utilities from `blocks/post-index/post-index.js` into a new `scripts/post-utils.js` module, then update `post-index.js` to import from the new module.

    ## Context

    The post detail page (DDD-005) needs the same utility functions currently defined inline in `blocks/post-index/post-index.js`: `TYPE_LABELS`, `DATE_FORMATTER`, `parseDate()`, and `toIsoDate()`. Rather than duplicate these, extract them to a shared module.

    ## Files to read first

    - `/Users/ben/github/benpeter/mostly-hallucinations/blocks/post-index/post-index.js` — current source of the utilities
    - `/Users/ben/github/benpeter/mostly-hallucinations/AGENTS.md` — EDS code conventions
    - `/Users/ben/github/benpeter/mostly-hallucinations/scripts/scripts.js` — for understanding the module graph

    ## What to do

    1. Create `scripts/post-utils.js` with these named exports:
       - `TYPE_LABELS` (object)
       - `DATE_FORMATTER` (Intl.DateTimeFormat instance)
       - `parseDate(value)` (function)
       - `toIsoDate(ms)` (function)

       Move them verbatim from `post-index.js`. Keep the JSDoc comments. Add `// tva` near the top of the new file.

    2. Update `blocks/post-index/post-index.js`:
       - Replace the inline definitions with: `import { TYPE_LABELS, DATE_FORMATTER, parseDate, toIsoDate } from '../../scripts/post-utils.js';`
       - Remove the four definitions (lines ~10-52 of the current file)
       - Keep the `// tva` comment that's already at the top
       - Everything else stays exactly the same

    3. Run `npm run lint` and fix any issues.

    ## What NOT to do

    - Do not modify `scripts/aem.js` (never modify this file per AGENTS.md)
    - Do not change any logic in `post-index.js` beyond the import refactor
    - Do not add any new utilities — only extract what exists
    - Do not modify `scripts/scripts.js` — that's Task 2's scope

    ## Deliverables

    - `scripts/post-utils.js` (new file)
    - `blocks/post-index/post-index.js` (modified — import from post-utils.js)

    ## Success criteria

    - `npm run lint` passes
    - The import path uses `../../scripts/post-utils.js` (relative, with `.js` extension per ESLint config)
    - All four utilities are exported from `post-utils.js`
    - `post-index.js` no longer defines these utilities inline
- **Deliverables**: `scripts/post-utils.js` (new), `blocks/post-index/post-index.js` (modified)
- **Success criteria**: `npm run lint` passes; post-index.js imports from post-utils.js; utilities are identical to original

---

### Task 2: Post detail decoration and CSS
- **Agent**: frontend-minion
- **Delegation type**: standard
- **Model**: sonnet
- **Mode**: bypassPermissions
- **Blocked by**: Task 1
- **Approval gate**: no
- **Prompt**: |
    Implement the post detail page decoration in `scripts/scripts.js` and create `styles/post-detail.css` for all post-detail scoped styles.

    ## Context

    This implements the core of DDD-005: path-based post detail detection, body class, post header decoration (type badge, sr-only prefix, metadata line), conditional CSS loading, and all post-detail typography/spacing overrides.

    ## Files to read first

    - `/Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-005-post-detail.md` — the full implementation contract. Read this entire file.
    - `/Users/ben/github/benpeter/mostly-hallucinations/scripts/scripts.js` — current state, you will modify this
    - `/Users/ben/github/benpeter/mostly-hallucinations/scripts/post-utils.js` — shared utilities (created by Task 1), import from here
    - `/Users/ben/github/benpeter/mostly-hallucinations/blocks/post-index/post-index.js` — reference implementation for type badge and metadata patterns
    - `/Users/ben/github/benpeter/mostly-hallucinations/styles/styles.css` — global styles you must NOT modify
    - `/Users/ben/github/benpeter/mostly-hallucinations/styles/tokens.css` — design tokens (read, don't modify)
    - `/Users/ben/github/benpeter/mostly-hallucinations/AGENTS.md` — EDS conventions
    - `/Users/ben/github/benpeter/mostly-hallucinations/CLAUDE.md` — project rules

    ## What to do in scripts/scripts.js

    1. Add import at the top:
       ```javascript
       import { TYPE_LABELS, DATE_FORMATTER, parseDate, toIsoDate } from './post-utils.js';
       ```

    2. Add a helper function `isPostDetail()`:
       ```javascript
       function isPostDetail() {
         return window.location.pathname.startsWith('/blog/');
       }
       ```

    3. Add `decoratePostDetail(main)` function. This runs in `buildAutoBlocks()` after `buildPostIndexBlock()`. It must:

       a. Check `isPostDetail()` — return early if false
       b. Add `document.body.classList.add('post-detail')`
       c. Find the first `.default-content-wrapper` in main (the post header section)
       d. Find the `<h1>` inside it
       e. Read metadata using `getMetadata()` from aem.js (already imported):
          - `type` — post type slug
          - `date` — publication date
          - `updated` — updated date (may be empty)
          - `tags` — comma-separated tag slugs
       f. Create and inject type badge `<p class="post-type" aria-hidden="true">` with title-case text from TYPE_LABELS, BEFORE the h1
       g. Create and inject sr-only span inside h1 (prepend): `<span class="sr-only">{TypeLabel}: </span>`
       h. Add `id="post-title"` to the h1
       i. Build the `.post-meta` paragraph and insert it AFTER the h1:
          - `<time datetime="{iso}">` for published date (always present)
          - `<span class="post-updated"> · Updated <time datetime="{iso}">{formatted}</time></span>` — only if `updated` metadata has a value. If no updated date, do NOT create this element at all.
          - `<span class="post-tags-inline">` with ` · <a href="/tags/{slug}">{slug}</a>` for each tag. Validate tag slugs with `/^[a-z0-9-]+$/` before using in href (same pattern as post-index.js).
       j. Find all `<pre>` elements in main and add `tabindex="0"`, `role="region"`, and `aria-label="Code example"` to each.

       Use `document.createElement()` and `.textContent` for all DOM construction — no innerHTML. Follow the pattern in `post-index.js` `buildEntry()`.

    4. In `buildAutoBlocks()`, add `decoratePostDetail(main)` after `buildPostIndexBlock(main)`.

    5. In `loadEager()`, add conditional CSS loading. After `decorateMain(main)` and BEFORE `document.body.classList.add('appear')`:
       ```javascript
       if (document.body.classList.contains('post-detail')) {
         await loadCSS(`${window.hlx.codeBasePath}/styles/post-detail.css`);
       }
       ```

    6. Also add `getMetadata` to the import from `./aem.js` if it's not already there. Check first — it may need to be added to the import statement.

    ## What to do in styles/post-detail.css (new file)

    Create this file with ALL post-detail scoped CSS. Every selector must be prefixed with `body.post-detail`. Include `// tva` as a comment near the top.

    The complete CSS rules (derive exact values from DDD-005 spec):

    **Post header:**
    - `.post-type`: `--font-heading`, `--body-font-size-xs`, `--color-text-muted`, `text-transform: uppercase`, `letter-spacing: 0.05em`, `line-height: 1`, `margin: 0 0 0.25em`
    - `h1`: `margin: 0`, `font-weight: 600` (inherits font-family/size/color from global h1)
    - `.post-meta`: `--body-font-size-xs`, `--color-text-muted`, `line-height: 1.4`, `margin-top: 0.75em`, `margin-bottom: 2em`
    - `.post-meta time`, `.post-updated`: inherit color from .post-meta
    - `.post-meta a` (tag links): `--color-link`, `text-decoration: underline`, `text-decoration-color: var(--color-border)`, `text-underline-offset: 0.15em`
    - `.post-meta a:hover`: `text-decoration: underline`, `text-decoration-color: var(--color-link-hover)` or just regular underline color

    **Body typography spacing (scoped to body.post-detail .default-content-wrapper):**
    - `h2`: `margin-top: 2em; margin-bottom: 0.5em`
    - `h3`: `margin-top: 1.5em; margin-bottom: 0.5em`
    - `h2 + h3`: `margin-top: 0.25em` (adjacent heading collapse)
    - `p`: `margin-top: var(--space-paragraph, 1em); margin-bottom: 0`
    - `pre`: `margin-block: var(--space-element, 1.5em); border-radius: 0`
    - `blockquote`: `margin-block: var(--space-element, 1.5em)` (this covers blockquotes in default content, not in Quote block)
    - `ul, ol`: `margin-block: var(--space-paragraph, 1em)`
    - `li`: `margin-bottom: 0.35em` and last-child `margin-bottom: 0`
    - `hr`: `margin-block: 2em; border: none; border-top: 1px solid var(--color-border-subtle)`
    - `table`: `margin-block: var(--space-element, 1.5em)`

    **Body links (scoped to body.post-detail .default-content-wrapper, excluding .post-meta):**
    - `a:any-link` (not in .post-meta): `text-decoration: underline; color: var(--color-link)`
    - `a:hover` (not in .post-meta): `text-decoration: none; color: var(--color-link-hover)`
    - Use selector `body.post-detail .default-content-wrapper :not(.post-meta) > a:any-link` or a more specific approach. The key constraint: body links get underlines, but tag links in `.post-meta` should NOT get the default body link underline (they have their own subtle underline style).

    **Inline code:**
    - `code:not(pre code)`: `font-family: var(--font-code); font-size: 0.9em; background-color: var(--color-background-soft); padding-inline: 2px; border-radius: 0`

    **decorateButtons() CSS override (scoped to body.post-detail .default-content-wrapper):**
    - `a.button:any-link`: Reset all button styles back to inline link appearance. Set: `display: inline; margin: 0; border: none; border-radius: 0; padding: 0; font-weight: inherit; line-height: inherit; text-align: inherit; text-decoration: underline; background-color: transparent; color: var(--color-link); cursor: pointer; overflow: visible; text-overflow: unset; white-space: normal`
    - `a.button:hover`: `background-color: transparent; color: var(--color-link-hover); text-decoration: none`
    - `.button-container`: `margin: 0; padding: 0; text-align: inherit`

    **Table styling:**
    - `table`: `width: 100%; border-collapse: collapse`
    - `th`: `--body-font-size-s`, `font-weight: 600`, `--color-heading`, `text-align: left`, `padding: 8px 12px`, `border-bottom: 2px solid var(--color-border)`
    - `td`: `--body-font-size-s`, `--color-text`, `padding: 8px 12px`, `border-bottom: 1px solid var(--color-border-subtle)`
    - `--line-height-heading` on th, `--line-height-body` on td

    **Pre focus ring:**
    - `pre:focus-visible`: `outline: 2px solid var(--color-heading); outline-offset: 2px`

    **Focus ring on tag links:**
    - `.post-meta a:focus-visible`: `outline: 2px solid var(--color-heading); outline-offset: 2px`

    ## What NOT to do

    - Do not modify `styles/styles.css` — global styles stay unchanged
    - Do not modify `styles/tokens.css` — no new tokens
    - Do not modify `scripts/aem.js` — never modify this file
    - Do not add `role="article"` to `<main>` — this destroys the main landmark (WCAG 1.3.1 violation). Skip the `<article>` wrapper entirely.
    - Do not create the Quote block — that's Task 3
    - Do not create draft test content — that's Task 4
    - Do not modify `blocks/post-index/post-index.js` — that was Task 1

    ## Deliverables

    - `scripts/scripts.js` (modified)
    - `styles/post-detail.css` (new)

    ## Success criteria

    - `npm run lint` passes (run `npm run lint:fix` if needed, then verify)
    - `body.post-detail` class is added on `/blog/*` paths
    - `body.post-detail` class is NOT added on `/` or other paths
    - Post header elements (badge, sr-only span, metadata) are created via createElement/textContent
    - All CSS selectors are scoped with `body.post-detail`
    - No global styles are modified
- **Deliverables**: `scripts/scripts.js` (modified), `styles/post-detail.css` (new)
- **Success criteria**: Lint passes; body class detection works; post header decoration creates correct DOM; all CSS scoped behind `body.post-detail`

---

### Task 3: Quote block
- **Agent**: frontend-minion
- **Delegation type**: standard
- **Model**: sonnet
- **Mode**: bypassPermissions
- **Blocked by**: none (parallel with Task 1 and 2, but should be verified together)
- **Approval gate**: no
- **Prompt**: |
    Create the Quote block (`blocks/quote/`) with standard and pull-quote variants.

    ## Context

    DDD-005 specifies a Quote block for blockquotes in blog posts. EDS blockquotes are authored as tables ("Quote" block) in Google Docs, not as Markdown `> text`. The block has two variants: standard (subtle left border) and pull-quote (gold accent, editorial font, `aria-hidden`).

    ## Files to read first

    - `/Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-005-post-detail.md` — full spec, especially the "CSS Approach" section (item 4) and the HTML structure section showing Quote block markup
    - `/Users/ben/github/benpeter/mostly-hallucinations/AGENTS.md` — EDS block conventions
    - `/Users/ben/github/benpeter/mostly-hallucinations/styles/tokens.css` — design tokens
    - `/Users/ben/github/benpeter/mostly-hallucinations/blocks/post-index/post-index.js` — reference for EDS block pattern (decorate function signature, DOM manipulation style)

    ## What to do

    ### blocks/quote/quote.js

    Create the block decoration function. Add `// tva` near the top.

    ```javascript
    export default async function decorate(block) { ... }
    ```

    The `block` element received by decorate is the `.quote.block` div. EDS has already parsed the table into child divs. The block content is the quote text in nested divs.

    **Standard quote behavior:**
    1. Extract text content from the block's children (the table cells become nested divs)
    2. Clear the block content
    3. Create a `<blockquote>` element
    4. For each row of content, create a `<p>` inside the blockquote with the text
    5. Append the blockquote to the block

    **Pull-quote behavior** (when `block.classList.contains('pull-quote')`):
    1. Same text extraction
    2. Create a `<figure>` with `aria-hidden="true"`
    3. Create a `<blockquote>` inside the figure
    4. Add the `<p>` elements inside the blockquote
    5. Append the figure to the block

    Use `document.createElement()` and `.textContent` — no innerHTML.

    Important: Inspect what EDS actually delivers as block content. The table-to-block conversion creates nested `<div>` elements. A single-cell Quote table becomes roughly:
    ```
    <div class="quote block">
      <div>          <!-- row -->
        <div>        <!-- cell -->
          text content here
        </div>
      </div>
    </div>
    ```

    The decoration should handle multi-paragraph quotes (multiple rows or multiple paragraphs within a cell). Extract text from all children recursively and create appropriate `<p>` elements.

    ### blocks/quote/quote.css

    Create the block styles. Add `/* tva */` as a comment near the top.

    **Standard quote (`.quote`):**
    - `blockquote`: `border-left: 3px solid var(--color-border); padding-left: 1.5em; margin: 0`
    - `blockquote p`: `margin-top: var(--space-paragraph, 1em); margin-bottom: 0`
    - `blockquote p:first-child`: `margin-top: 0`

    **Pull-quote (`.quote.pull-quote`):**
    - `figure`: `margin: 0`
    - `blockquote`: `border-left: 3px solid var(--color-accent); padding-left: 1.5em; margin: 0`
    - `blockquote p`: `font-family: var(--font-editorial); font-size: var(--heading-font-size-m); line-height: 1.5; color: var(--color-text); margin-top: var(--space-paragraph, 1em); margin-bottom: 0`
    - `blockquote p:first-child`: `margin-top: 0`

    **Post-detail specific spacing** goes in `styles/post-detail.css` (Task 2), not here. The Quote block CSS should be generic (usable on any page). The spacing overrides for post context (2em pull-quote margins, 1.5em standard quote margins) are scoped via `body.post-detail` in post-detail.css.

    However, add these post-detail spacing rules here since Task 2 may not know the exact selectors:

    Actually, NO — keep this block CSS generic. Task 2's `post-detail.css` already handles the spacing for all elements including `.quote-wrapper`. The block CSS handles only the internal appearance of the quote.

    ## What NOT to do

    - Do not add post-detail scoped spacing (that's in `styles/post-detail.css`)
    - Do not add syntax for Markdown-style blockquotes — EDS uses table-based blocks
    - Do not modify any files outside `blocks/quote/`

    ## Deliverables

    - `blocks/quote/quote.js` (new)
    - `blocks/quote/quote.css` (new)

    ## Success criteria

    - `npm run lint` passes
    - Standard quote renders as `blockquote > p` with subtle left border
    - Pull-quote renders as `figure[aria-hidden="true"] > blockquote > p` with gold accent border and editorial font
    - Block is self-contained — no imports from outside `blocks/quote/` except standard globals
- **Deliverables**: `blocks/quote/quote.js` (new), `blocks/quote/quote.css` (new)
- **Success criteria**: Lint passes; standard and pull-quote variants render correct DOM; styles use design tokens

---

### Task 4: Test content and documentation
- **Agent**: frontend-minion
- **Delegation type**: standard
- **Model**: sonnet
- **Mode**: bypassPermissions
- **Blocked by**: Task 1, Task 2, Task 3
- **Approval gate**: no
- **Prompt**: |
    Create comprehensive draft test pages and update documentation for DDD-005.

    ## Context

    DDD-005 needs draft HTML files to test all content structures in the dev server, plus documentation updates to AGENTS.md and content-model.md to capture new patterns.

    ## Files to read first

    - `/Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-005-post-detail.md` — the spec, especially HTML Structure section
    - `/Users/ben/github/benpeter/mostly-hallucinations/drafts/blog/building-eds-design-system.html` — existing draft, needs expansion
    - `/Users/ben/github/benpeter/mostly-hallucinations/AGENTS.md` — you'll add a section here
    - `/Users/ben/github/benpeter/mostly-hallucinations/docs/content-model.md` — you'll add blockquote authoring notes here
    - `/Users/ben/github/benpeter/mostly-hallucinations/drafts/index.html` — reference for draft page structure
    - `/Users/ben/github/benpeter/mostly-hallucinations/drafts/blog/claude-code-pair-programmer.html` — reference for blog draft structure

    ## Part 1: Expand the main draft page

    Update `drafts/blog/building-eds-design-system.html` to be a comprehensive test page that exercises ALL post-detail content structures. The page must have:

    **Required `<head>` metadata** (meta tags that the decoration JS reads via `getMetadata()`):
    - `<meta name="type" content="build-log">`
    - `<meta name="date" content="2026-03-12">` (or a Unix timestamp — check what the existing drafts use)
    - `<meta name="updated" content="2026-03-15">`
    - `<meta name="tags" content="aem, eds, performance">`
    - Standard `<title>` and `og:title`

    **Required content structures** (all in the `<main>`, using EDS section/wrapper markup):

    1. **Post header section** — just an `<h1>` with the title. The decoration JS will inject the type badge and metadata. DO NOT include the badge or metadata in the HTML — those are generated by JavaScript.

    2. **h2 + paragraph + pre** — exercises h2 spacing (2em top) and code block with enough content to demonstrate `tabindex="0"` scrolling. Include a code block wider than 68ch to test horizontal scroll.

    3. **h2 immediately followed by h3 + paragraph** — exercises adjacent heading collapse (h2+h3 margin-top: 0.25em).

    4. **Standard blockquote (Quote block)** — use EDS block markup:
       ```html
       <div class="quote-wrapper">
         <div class="quote block" data-block-name="quote" data-block-status="loading">
           <div><div>Quote text here.</div></div>
         </div>
       </div>
       ```

    5. **Pull-quote (Quote block with pull-quote variant)** — The pull-quote text MUST appear verbatim elsewhere in the post body (content discipline for `aria-hidden`):
       ```html
       <div class="quote-wrapper">
         <div class="quote pull-quote block" data-block-name="quote" data-block-status="loading">
           <div><div>Pull quote text that appears elsewhere in the body.</div></div>
         </div>
       </div>
       ```

    6. **ul list + ol list** — exercises list item 0.35em gap.

    7. **Paragraph with inline code** — exercises `code:not(pre code)` styling.

    8. **Paragraph with a standalone link** (sole content of a `<p>`) — tests `decorateButtons()` CSS override.

    9. **Paragraph with an inline body link** — tests underline-by-default override.

    10. **`<hr>` between sections** — exercises 2em symmetric spacing.

    11. **A simple table** — exercises table styling.

    Each content structure should be in its own `<div class="section"><div class="default-content-wrapper">...</div></div>` where appropriate, following EDS section structure. However, NOT every element needs its own section — group related content naturally. The Quote blocks need their own sections because they use `.quote-wrapper` instead of `.default-content-wrapper`.

    Make the content realistic and related to the post title ("Building a Design System for Edge Delivery Services"). The body text should be plausible technical prose, not lorem ipsum.

    ## Part 2: Create minimal TIL draft

    Create `drafts/blog/eds-gotcha-source-maps.html` — a TIL-type post. Check if this file already exists and update it if so, or check its current state.

    Requirements:
    - `<meta name="type" content="til">`
    - `<meta name="date" content="2026-03-10">`
    - NO `updated` metadata (tests absence behavior — the `.post-updated` element should not appear)
    - `<meta name="tags" content="eds, debugging">`
    - Short content: 100-200 words, just an h1 + 2-3 paragraphs. No h2/h3, no code blocks.
    - Tests that the layout degrades gracefully at minimum content length

    ## Part 3: Documentation updates

    ### AGENTS.md — Add Page-Type Detection section

    Add a new subsection under `## Key Concepts`, after the existing `### Auto-Blocking` section. Add:

    ```markdown
    ### Page-Type Detection

    Pages requiring surface-specific behavior use a body class added during eager decoration in `scripts.js`. Detection is path-based.

    Current page types:

    | Body class | Detection condition | Surface |
    |---|---|---|
    | `post-detail` | `window.location.pathname.startsWith('/blog/')` | Individual post pages |

    **How to add a new page type**:
    1. Add a condition in `buildAutoBlocks()` in `scripts.js`
    2. Add the body class: `document.body.classList.add('your-page-type')`
    3. Scope all page-type-specific CSS selectors with `body.your-page-type`
    4. Create a `styles/your-page-type.css` loaded conditionally in the eager phase
    5. Document the new type in this table
    ```

    ### docs/content-model.md — Add blockquote authoring notes

    Add a section after "Taxonomy" (or wherever it fits best) about blockquotes:

    ```markdown
    ## Authoring Notes

    ### Blockquotes

    Blockquotes are authored as the **Quote block** (a table in Google Docs with a single cell containing the quote text). Standard Markdown `> text` syntax is not natively supported in EDS authoring.

    Two variants:
    - **Standard blockquote**: Quote block without additional classes. Renders with a subtle left border.
    - **Pull-quote**: Quote block with section metadata class `pull-quote`. Renders with gold accent border, editorial font, larger text. Pull-quote content must appear verbatim elsewhere in the post body — it is `aria-hidden` and screen readers skip it entirely. If the content is unique, use a standard blockquote instead.

    For static HTML test files, use the EDS block markup:
    ```html
    <div class="quote-wrapper">
      <div class="quote block" data-block-name="quote" data-block-status="loading">
        <div><div>Quote text here.</div></div>
      </div>
    </div>
    ```
    ```

    ## What NOT to do

    - Do not modify `scripts/scripts.js` or any JS/CSS files — those are covered by other tasks
    - Do not mark DDD-005 as "Implemented" — that happens after the PR merges
    - Do not add test frameworks or CI jobs
    - Do not create draft content for pages outside `/blog/`

    ## Deliverables

    - `drafts/blog/building-eds-design-system.html` (expanded)
    - `drafts/blog/eds-gotcha-source-maps.html` (updated or confirmed adequate)
    - `AGENTS.md` (modified — new Page-Type Detection section)
    - `docs/content-model.md` (modified — new Authoring Notes section)

    ## Success criteria

    - Draft pages follow EDS markup conventions (sections, wrappers, block structure)
    - Main draft exercises all 11 content structures listed above
    - TIL draft has no `updated` metadata
    - AGENTS.md page-type detection section is clear and follows the existing doc style
    - content-model.md blockquote section documents both variants
- **Deliverables**: Draft test pages (2), AGENTS.md (modified), docs/content-model.md (modified)
- **Success criteria**: Drafts exercise all content structures; docs capture new patterns; no test framework added

---

### Task 5: Integration verification
- **Agent**: frontend-minion
- **Delegation type**: standard
- **Model**: sonnet
- **Mode**: bypassPermissions
- **Blocked by**: Task 2, Task 3, Task 4
- **Approval gate**: no
- **Prompt**: |
    Verify the integrated DDD-005 implementation by running the dev server and checking all decoration and styling.

    ## Context

    Tasks 1-4 have implemented the post detail page: shared utilities, post header decoration, post-detail CSS, Quote block, and test content. This task verifies everything works together.

    ## What to do

    1. Run `npm run lint` — must pass with zero errors.

    2. Start the dev server: `npx -y @adobe/aem-cli up --no-open --forward-browser-logs --html-folder drafts`
       Wait for it to be ready, then:

    3. Verify the main draft page: `curl -s http://localhost:3000/blog/building-eds-design-system`
       Check the HTML output for:
       - `<body>` element should have class `post-detail` (note: this is added by JS so curl won't show it — use the .plain.html endpoint instead to check raw content, and verify JS additions separately)

    4. Verify with `curl -s http://localhost:3000/blog/building-eds-design-system.plain.html` to see the raw EDS content structure.

    5. Check the home page is NOT affected: `curl -s http://localhost:3000/` — should NOT have `post-detail` body class behavior.

    6. Verify TIL draft: `curl -s http://localhost:3000/blog/eds-gotcha-source-maps.plain.html`

    7. Verify metadata availability: Check that the draft pages include `<meta>` tags for type, date, tags in the `<head>`.

    8. Run the linter one final time: `npm run lint`

    9. If any issues are found, fix them. Common issues:
       - Import paths with missing `.js` extension
       - CSS selectors not scoped with `body.post-detail`
       - Lint errors from stylelint range notation (use `width >= 600px` not `min-width: 600px`)
       - Missing `data-block-name` or `data-block-status` attributes on Quote blocks in drafts

    ## What NOT to do

    - Do not add test frameworks
    - Do not modify the implementation approach — only fix bugs found during verification
    - Do not open a PR — that's a separate step

    ## Deliverables

    - All files passing lint
    - Verification that draft pages render without JS errors
    - Any bug fixes applied to the implementation files

    ## Success criteria

    - `npm run lint` passes
    - Dev server starts without errors
    - Draft blog pages are accessible at `/blog/*` paths
    - Home page at `/` continues to work (post-index block loads)
    - No console errors related to post-detail decoration
- **Deliverables**: Verified, lint-clean implementation
- **Success criteria**: All lint passes; dev server renders drafts; no console errors; home page unaffected

---

### Cross-Cutting Coverage

- **Testing**: Covered by Task 5 (integration verification) and Phase 6 (post-execution test). No test framework to add — project uses lint + manual verification via draft pages + PSI checks per AGENTS.md.
- **Security**: No new attack surface. Tag slugs are validated with regex before use in href (same pattern as post-index). No user input handling, no API calls, no auth. No security-minion task needed.
- **Usability — Strategy**: Covered in Phase 2 planning (ux-strategy-minion contribution). Quote authoring model confirmed clear. Pull-quote content discipline documented as convention.
- **Usability — Design**: Not applicable — no new UI components beyond what's specified in the approved DDD-005 design. Visual implementation follows the spec.
- **Documentation**: Covered by Task 4 (AGENTS.md page-type detection pattern, content-model.md blockquote authoring). Phase 8 post-execution docs will handle any remaining gaps.
- **Observability**: Not applicable — client-side CSS/JS decoration with no runtime services, APIs, or background processes.

### Architecture Review Agents

- **Mandatory** (5): security-minion, test-minion, ux-strategy-minion, lucy, margo
- **Discretionary picks**:
  - accessibility-minion: Plan includes tasks producing web-facing HTML/UI (post header, Quote block) that end users interact with. Accessibility-minion's Phase 2 findings (tag underlines, pre labels, article wrapper) are incorporated into task prompts, but review of the final plan ensures nothing was lost in synthesis.
- **Not selected**: ux-design-minion (no new visual design decisions — all design is specified in the approved DDD), sitespeed-minion (no new runtime services; PSI check is part of the existing PR process), observability-minion (client-side only, no coordinated services), user-docs-minion (no end-user documentation needed — this is a code implementation of an approved design)

### Execution Order

```
Batch 1 (parallel):
  Task 1: Extract shared post utilities
  Task 3: Quote block

Batch 2 (sequential after Task 1):
  Task 2: Post detail decoration and CSS

Batch 3 (sequential after Task 2, Task 3):
  Task 4: Test content and documentation

Batch 4 (sequential after Task 4):
  Task 5: Integration verification
```

### Verification Steps

After all tasks complete:
1. `npm run lint` passes (zero errors)
2. Dev server starts with `--html-folder drafts` flag
3. `/blog/building-eds-design-system` renders with: type badge, h1 with sr-only prefix, metadata line with date + updated + tags, body content with correct spacing
4. `/blog/eds-gotcha-source-maps` renders as minimal TIL without `updated` element
5. `/` (home page) continues to render post-index without `post-detail` body class
6. Quote block renders both standard and pull-quote variants
7. `decorateButtons()` CSS override prevents button styling on body links
8. All tag links have subtle underlines (WCAG 1.4.1)
9. `<pre>` elements have `tabindex="0"`, `role="region"`, `aria-label="Code example"`
