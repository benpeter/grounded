# Phase 3: Synthesis — DDD-004 Home Post Index

## Delegation Plan

**Team name**: ddd-004-post-index
**Description**: Implement the home page post index block per DDD-004 design decision. Creates helix-query.yaml, the post-index block (CSS + JS), auto-block wiring in scripts.js, the .sr-only utility class, documentation updates, and test content for verification.

---

### Task 1: Create `helix-query.yaml` and add `.sr-only` utility class

- **Agent**: frontend-minion
- **Delegation type**: standard
- **Model**: sonnet
- **Mode**: bypassPermissions
- **Blocked by**: none
- **Approval gate**: no
- **Prompt**: |
    ## Task: Create helix-query.yaml and add .sr-only utility to styles.css

    You are implementing part of DDD-004 (home page post index) for an Edge Delivery Services site. This task creates two foundational files that later tasks depend on.

    ### Part A: helix-query.yaml

    Create `/Users/ben/github/benpeter/mostly-hallucinations/helix-query.yaml` at the project root with the following content. Include a YAML comment block at the top with:
    - One-line purpose statement
    - Reference to `docs/content-model.md`
    - Reference to DDD-004 for design rationale

    Configuration:

    ```yaml
    # EDS content index for blog posts.
    # Content model: docs/content-model.md
    # Design decision: docs/design-decisions/DDD-004-home-post-index.md
    indices:
      posts:
        include:
          - /blog/**
        target: /query-index.json
        properties:
          title:
            select: head > meta[property="og:title"]
            value: attribute(el, "content")
          description:
            select: head > meta[name="description"]
            value: attribute(el, "content")
          date:
            select: head > meta[name="date"]
            value: attribute(el, "content")
          type:
            select: head > meta[name="type"]
            value: attribute(el, "content")
          tags:
            select: head > meta[name="tags"]
            value: attribute(el, "content")
    ```

    Key points:
    - `path` is included automatically by EDS -- do NOT declare it as a property
    - `include: /blog/**` restricts indexing to blog posts only
    - `target: /query-index.json` puts the index at root for clean fetch URLs
    - Properties use `head > meta` selectors because EDS converts document metadata to `<meta>` tags

    ### Part B: .sr-only utility class

    Add the `.sr-only` class to `/Users/ben/github/benpeter/mostly-hallucinations/styles/styles.css` (the eager stylesheet, NOT lazy-styles.css). Add it at the end of the file, before any media queries or section variants if you need to insert it logically.

    The class definition:

    ```css
    /* Visually hidden, accessible to screen readers */
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

    Rationale for styles.css over lazy-styles.css: This is a global utility with near-zero rendering cost. Placing it in the eager stylesheet prevents FOUC if any eager-loaded block later needs it, and avoids a timing dependency.

    ### What NOT to do
    - Do not create the block files (post-index.js, post-index.css) -- that is a separate task
    - Do not modify scripts.js
    - Do not create test content

    ### Deliverables
    1. `/Users/ben/github/benpeter/mostly-hallucinations/helix-query.yaml`
    2. Updated `/Users/ben/github/benpeter/mostly-hallucinations/styles/styles.css` with `.sr-only` class

    Run `npm run lint` after changes and fix any lint issues.

- **Deliverables**: `helix-query.yaml` at project root; updated `styles/styles.css` with `.sr-only` class
- **Success criteria**: `helix-query.yaml` exists with correct structure; `.sr-only` class exists in styles.css; lint passes

---

### Task 2: Create post-index block (CSS + JS)

- **Agent**: frontend-minion
- **Delegation type**: standard
- **Model**: sonnet
- **Mode**: bypassPermissions
- **Blocked by**: Task 1
- **Approval gate**: no
- **Prompt**: |
    ## Task: Create the post-index block (CSS + JS)

    You are implementing the post-index block for an Edge Delivery Services site per DDD-004. The design spec is at `/Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-004-home-post-index.md`. Read it first -- it is comprehensive and contains the exact DOM structure, CSS selectors, and behavior.

    Create two files:
    - `/Users/ben/github/benpeter/mostly-hallucinations/blocks/post-index/post-index.css`
    - `/Users/ben/github/benpeter/mostly-hallucinations/blocks/post-index/post-index.js`

    ### post-index.css

    Implement all 17 CSS selectors from DDD-004's "CSS Approach" section. Key implementation notes:

    1. Block-level: `max-width: var(--measure); margin-inline: auto; padding-inline: 0` -- the wrapper already has padding from `main > .section > div`, so zero out padding on the block itself.
    2. Entry separation: use `.post-index .post-entry + .post-entry` with `border-top: 1px solid var(--color-border-subtle)` and `padding-block-start: var(--section-spacing)`. This avoids border on first entry.
    3. Entry bottom margin: `.post-index .post-entry` gets `margin-block-end: var(--section-spacing)`.
    4. Override global h2 styles: `.post-index h2` must set `font-size: var(--heading-font-size-m)` (overrides global `--heading-font-size-xl`) and `margin-block: 0` (overrides global `margin-top: 0.8em; margin-bottom: 0.25em`).
    5. Override global `p` margins: `.post-index .post-description` should have appropriate spacing.
    6. Type badge: `display: block; font-family: var(--font-heading); font-size: var(--body-font-size-xs); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; line-height: 1`.
    7. Metadata line: `.post-index .post-meta` is inline flow. `.post-tags` is `display: inline; list-style: none; margin: 0; padding: 0`. Tags `li` are `display: inline`.
    8. Middot separators: `.post-tags li + li::before { content: " \B7 "; color: var(--color-text-muted); }` and `.post-meta time + .post-tags::before { content: " \B7 "; color: var(--color-text-muted); }`.
    9. Focus rings: `outline: 2px solid var(--color-heading); outline-offset: 2px` on `:focus-visible` for both title links and tag links.
    10. No responsive media queries needed for layout -- only font sizes change via tokens.css.
    11. Override global `a:any-link` and `a:hover` styles for title links: `.post-index h2 a` should use `color: inherit` (inherits --color-heading) and `.post-index h2 a:hover` should NOT change color, only add underline.

    ### post-index.js

    The `decorate()` function must:

    1. Fetch `/query-index.json`. Handle failure gracefully: if fetch fails or returns non-200, log `console.error('Post index: failed to load query-index.json', error)` and render only the sr-only h1.
    2. Parse response JSON. Extract `.data` array.
    3. Sort by `date` descending. Date handling: EDS may return dates as Unix timestamps (seconds since epoch -- multiply by 1000 for JS Date), Excel serial numbers, or ISO strings. Implement robust parsing:
       ```js
       function parseDate(value) {
         if (!value) return 0;
         const num = Number(value);
         if (!Number.isNaN(num) && num > 0) {
           // Unix timestamp in seconds (EDS convention)
           return num * 1000;
         }
         return new Date(value).getTime() || 0;
       }
       ```
    4. Clear block content (`block.textContent = ''`).
    5. Create sr-only `<h1 class="sr-only">Posts</h1>` and append to block FIRST.
    6. For each entry in the sorted array, build an `<article>` with this exact structure (from DDD-004):

       ```html
       <article class="post-entry" aria-labelledby="post-{n}-title">
         <span class="post-type" aria-hidden="true">{Type Label}</span>
         <h2 id="post-{n}-title">
           <span class="sr-only">{Type Label}: </span>
           <a href="{path}">{title}</a>
         </h2>
         <p class="post-description">{description}</p>
         <footer class="post-meta">
           <time datetime="{YYYY-MM-DD}">{formatted date}</time>
           <ul class="post-tags">
             <li><a href="/tags/{slug}">{slug}</a></li>
           </ul>
         </footer>
       </article>
       ```

    7. Type label mapping (slug to display text):
       ```js
       const TYPE_LABELS = {
         'build-log': 'Build Log',
         pattern: 'Pattern',
         'tool-report': 'Tool Report',
         til: 'TIL',
       };
       ```

    8. Position-based IDs: entry at sorted index 0 gets `post-1-title`, index 1 gets `post-2-title`, etc.

    9. **sr-only span text MUST end with `: ` (colon-space)** -- e.g., `'Build Log: '`. This trailing space ensures screen readers separate the type prefix from the title without relying on whitespace text nodes.

    10. Format dates: `new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date)`. The `datetime` attribute uses ISO format (`YYYY-MM-DD`).

    11. Tag slug validation: validate each tag slug against `/^[a-z0-9-]+$/` before using in `href`. Skip invalid slugs entirely.

    12. Tags come from `query-index.json` as a comma-separated string. Split on `,` and trim each value.

    13. Handle missing fields gracefully:
        - Missing `title`: skip the entire entry
        - Missing `type`: skip the badge and sr-only prefix
        - Missing `description`: skip the `<p>` element
        - Missing `date`: skip the `<time>` element (place entry at end of sort)
        - Missing `tags`: skip the `<ul>` entirely

    14. Build all DOM via `document.createElement()` and `textContent`/`setAttribute()`. NO `innerHTML`. This is required for CSP compliance.

    15. Empty state: if no valid entries, only the sr-only `<h1>` renders.

    ### Existing patterns to follow

    Look at `/Users/ben/github/benpeter/mostly-hallucinations/blocks/header/header.js` for the established DOM construction pattern in this project: createElement, set properties, append children.

    ### What NOT to do
    - Do not modify scripts.js (auto-block wiring is a separate task)
    - Do not create test content
    - Do not add any external dependencies
    - Do not use innerHTML
    - Do not add pagination, filtering, or any V1 exclusions listed in CLAUDE.md

    ### Deliverables
    1. `/Users/ben/github/benpeter/mostly-hallucinations/blocks/post-index/post-index.css`
    2. `/Users/ben/github/benpeter/mostly-hallucinations/blocks/post-index/post-index.js`

    Run `npm run lint` after creating both files and fix any lint issues.

- **Deliverables**: `blocks/post-index/post-index.css` and `blocks/post-index/post-index.js`
- **Success criteria**: Block renders correct DOM structure per DDD-004; CSS matches all 17 selectors; lint passes; no innerHTML usage; robust date parsing; tag slug validation

---

### Task 3: Wire auto-block in scripts.js and create test content

- **Agent**: frontend-minion
- **Delegation type**: standard
- **Model**: sonnet
- **Mode**: bypassPermissions
- **Blocked by**: Task 2
- **Approval gate**: no
- **Prompt**: |
    ## Task: Wire post-index auto-block and create test content

    You are completing the DDD-004 implementation by wiring the post-index block into the home page auto-blocking system and creating test content for verification.

    ### Part A: Auto-block wiring in scripts.js

    Edit `/Users/ben/github/benpeter/mostly-hallucinations/scripts/scripts.js`.

    Add a `buildPostIndexBlock` function before `buildAutoBlocks`:

    ```js
    /**
     * Builds post-index block on the home page and prepends to main.
     * @param {Element} main The container element
     */
    function buildPostIndexBlock(main) {
      if (window.location.pathname === '/') {
        const section = document.createElement('div');
        section.append(buildBlock('post-index', ''));
        main.prepend(section);
      }
    }
    ```

    Then call `buildPostIndexBlock(main)` inside `buildAutoBlocks()`, AFTER the `buildHeroBlock(main)` call:

    ```js
    buildHeroBlock(main);
    buildPostIndexBlock(main);
    ```

    The hero block check is a no-op on the home page (no h1+picture combo), so ordering is not critical. But placing post-index after hero follows the pattern of most-specific-first.

    Key details:
    - `window.location.pathname === '/'` works across localhost, .aem.page, and .aem.live environments
    - The block gets an empty content cell (`''`) because data comes from the fetch
    - `main.prepend(section)` ensures the post-index block is the first section, so the sr-only `<h1>` is first in DOM order
    - The raw `<div>` section will be processed by `decorateSections()` which runs after `buildAutoBlocks()`

    ### Part B: Test content

    Create test HTML files in `/Users/ben/github/benpeter/mostly-hallucinations/drafts/` to verify the block works with the local dev server (`aem up --html-folder drafts`).

    Create these files:

    1. `drafts/index.html` -- minimal home page (just header/footer, the auto-block will inject the post-index)
    2. `drafts/blog/building-eds-design-system.html` -- test blog post with full metadata
    3. `drafts/blog/claude-code-pair-programmer.html` -- second test blog post
    4. `drafts/blog/eds-gotcha-source-maps.html` -- third test post (TIL type, fewer tags)

    Each blog post HTML must include proper `<meta>` tags in `<head>` for:
    - `<meta property="og:title" content="...">`
    - `<meta name="description" content="...">`
    - `<meta name="date" content="2026-03-12">` (use different dates for sort testing)
    - `<meta name="type" content="build-log">` (vary across posts: build-log, tool-report, til)
    - `<meta name="tags" content="aem, eds, performance">` (comma-separated)

    Follow EDS markup structure. Blog posts should have a simple body with at least a heading and a paragraph.

    The home page `drafts/index.html` should be minimal -- just enough for the auto-block to work:
    ```html
    <html>
    <head>
      <meta property="og:title" content="Mostly Hallucinations">
    </head>
    <body>
      <header></header>
      <main>
        <div></div>
      </main>
      <footer></footer>
    </body>
    </html>
    ```

    ### What NOT to do
    - Do not modify the block files (post-index.js, post-index.css)
    - Do not modify styles.css or lazy-styles.css
    - Do not add drafts/ to git tracking (it should be in .gitignore or .hlxignore)

    ### Deliverables
    1. Updated `/Users/ben/github/benpeter/mostly-hallucinations/scripts/scripts.js`
    2. Test HTML files in `drafts/` directory
    3. Verify `drafts/` is excluded from git tracking (check .gitignore/.hlxignore)

    Run `npm run lint` after changes and fix any lint issues.

- **Deliverables**: Updated `scripts/scripts.js` with auto-block; test HTML files in `drafts/`
- **Success criteria**: Auto-block injects post-index on home page (`/`); test content has correct metadata; lint passes

---

### Task 4: Update content model documentation

- **Agent**: software-docs-minion
- **Delegation type**: standard
- **Model**: sonnet
- **Mode**: bypassPermissions
- **Blocked by**: Task 1
- **Approval gate**: no
- **Prompt**: |
    ## Task: Add query index section to content-model.md and update DDD-004 status

    You are updating documentation for the DDD-004 implementation.

    ### Part A: Update content-model.md

    Edit `/Users/ben/github/benpeter/mostly-hallucinations/docs/content-model.md`. Add a new section titled "Query Index" after the "Structured Data" section (at the end of the file). Document:

    ```markdown
    ## Query Index

    Blog post metadata is exposed to the frontend via the EDS content index. The `helix-query.yaml` file at the project root controls indexing.

    **Endpoint:** `/query-index.json`

    **Include path:** `/blog/**` (only blog posts are indexed)

    **Indexed columns:**

    | Column | Source | Notes |
    |---|---|---|
    | `path` | Automatic | Page URL path. Included by EDS automatically. |
    | `title` | `og:title` meta tag | Page title. |
    | `description` | `description` meta tag | 1-2 sentence summary. |
    | `date` | `date` meta tag | Publication date. Used for sort order. |
    | `type` | `type` meta tag | Post type enum. |
    | `tags` | `tags` meta tag | Comma-separated tag slugs. |

    Adding a new metadata field to posts requires a corresponding property entry in `helix-query.yaml` to make it available in the index.

    Changes to `helix-query.yaml` take effect after EDS reindexes content (automatic on next content preview/publish).
    ```

    ### Part B: Update DDD-004 status

    Edit `/Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-004-home-post-index.md`.

    1. Change the status line from `Status: **Proposal**` to `Status: **Implemented**`
    2. Add implementation notes to the "Reviewer Notes" section at the bottom:

    ```markdown
    ### Reviewer Notes

    **Implemented** on 2026-03-13, branch `nefario/ddd-004-home-post-index`.

    **Open Question resolutions:**
    - OQ1 (entry spacing): Using `--section-spacing` (48px) as the initial value. Can be tuned with real content.
    - OQ2 (tag casing): Tags displayed as lowercase slugs, matching the content model canonical form.
    - OQ3 (tag links before DDD-007): Tags rendered as links from day one. 404s are acceptable -- the 404 page has a "Go home" link.
    - OQ4 (helix-query.yaml): Configured with standard EDS property selectors. `path` automatic.
    - OQ5 (.sr-only placement): Defined in `styles/styles.css` (eager) rather than `lazy-styles.css`, per accessibility review.
    - OQ6 (auto-block vs authored): Auto-block via `buildPostIndexBlock()` in `scripts.js`, detecting `pathname === '/'`.
    - OQ7 (description provenance): Uses `description` meta tag as authored by the writer. Not auto-extracted.
    ```

    ### What NOT to do
    - Do not modify any CSS, JS, or YAML files
    - Do not add new documentation files -- only update existing ones
    - Do not change the DDD-004 design spec content (only status and reviewer notes)

    ### Deliverables
    1. Updated `/Users/ben/github/benpeter/mostly-hallucinations/docs/content-model.md`
    2. Updated `/Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-004-home-post-index.md`

- **Deliverables**: Updated `docs/content-model.md` with query index section; updated DDD-004 status
- **Success criteria**: Content model documents the query index pipeline; DDD-004 status is "Implemented" with OQ resolutions

---

### Cross-Cutting Coverage

- **Testing**: Covered by Phase 6 (post-execution test validation). Test content in Task 3 enables manual verification. No dedicated test task needed in the execution plan.
- **Security**: Tag slug validation (`/^[a-z0-9-]+$/`) is built into Task 2's prompt. No auth, no user input, no secrets. CSP compliance ensured by DOM construction pattern (no innerHTML). No dedicated security task needed.
- **Usability -- Strategy**: ux-strategy-minion contributed to planning. Key recommendations (empty state, fetch-failure logging, tag link 404 acceptance) are incorporated into Task 2 and Task 3 prompts.
- **Usability -- Design**: No dedicated UI design task needed -- DDD-004 already provides complete visual specs with exact tokens, spacing, and interaction patterns. The design work is done.
- **Documentation**: Task 4 covers content-model.md update and DDD-004 status. Phase 8 handles any remaining docs.
- **Observability**: No runtime services created. The block is client-side JS with console.error for fetch failures. No metrics/tracing/logging infrastructure needed.

### Architecture Review Agents

- **Mandatory** (5): security-minion, test-minion, ux-strategy-minion, lucy, margo
- **Discretionary picks**:
  - accessibility-minion: Plan produces HTML with ARIA patterns (aria-labelledby, aria-hidden, sr-only) that need correctness verification before implementation. Referenced in Tasks 2.
- **Not selected**: ux-design-minion (DDD-004 provides complete visual spec), observability-minion (no runtime services), user-docs-minion (no user-facing documentation changes beyond content-model.md), sitespeed-minion (block is lightweight text rendering, no assets or complex loading)

### Conflict Resolutions

1. **`.sr-only` placement: styles.css vs. lazy-styles.css**
   - frontend-minion recommended `lazy-styles.css` (post-index loads in lazy phase)
   - accessibility-minion recommended `styles/styles.css` (eager, prevents FOUC, zero-cost utility)
   - **Resolution**: `styles/styles.css` wins. Accessibility-minion's reasoning is stronger: the class is tiny, has no rendering cost, and placing it eagerly prevents a potential FOUC issue if any future eager-loaded block needs it. The timing dependency argument is sound.

2. **No other conflicts.** All four specialists aligned on: auto-block injection pattern, fetch strategy, DOM structure, empty state behavior, tag link 404 acceptance, and robust date parsing.

### Risks and Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| EDS date format variability | Medium | Robust `parseDate()` in Task 2 handles timestamps, serial numbers, and ISO strings |
| Missing post metadata fields | Medium | Graceful degradation per field in Task 2 (skip elements, not entries) |
| Global CSS overrides block styles | Medium | Task 2 includes explicit specificity guidance (`.post-index h2` overrides `h2`) |
| No blog posts exist for testing | Low | Task 3 creates test content in `drafts/` |
| Tag links 404 until DDD-007 | Low | Accepted. 404 page has "Go home" link (verified) |
| `padding-inline` double-application | Low | Task 2 specifies `padding-inline: 0` on block element |

### Execution Order

```
Batch 1 (parallel):
  Task 1: helix-query.yaml + .sr-only utility
  Task 4: Documentation updates (blocked only by Task 1 for content-model.md accuracy,
           but can start DDD-004 status update in parallel)

Batch 2 (sequential after Task 1):
  Task 2: post-index block (CSS + JS)

Batch 3 (sequential after Task 2):
  Task 3: Auto-block wiring + test content

Post-execution:
  Phase 5: Code review (code-review-minion, lucy, margo)
  Phase 6: Test execution (lint verification)
  Phase 8: Documentation review (if checklist items remain)
```

### Verification Steps

After all tasks complete:

1. Run `npm run lint` -- must pass clean
2. Verify file existence: `helix-query.yaml`, `blocks/post-index/post-index.css`, `blocks/post-index/post-index.js`, updated `scripts/scripts.js`, updated `docs/content-model.md`, updated `docs/design-decisions/DDD-004-home-post-index.md`
3. Verify `.sr-only` class exists in `styles/styles.css`
4. Verify `buildPostIndexBlock` function exists in `scripts.js` and is called from `buildAutoBlocks`
5. Verify no `innerHTML` usage in `post-index.js`
6. Verify tag slug validation regex exists in `post-index.js`
7. Start dev server with `npx @adobe/aem-cli up --html-folder drafts --no-open` and check `http://localhost:3000/` renders the post index with test entries
8. Check preview URL after push: `https://nefario-ddd-004-home-post-index--grounded--benpeter.aem.page/`
