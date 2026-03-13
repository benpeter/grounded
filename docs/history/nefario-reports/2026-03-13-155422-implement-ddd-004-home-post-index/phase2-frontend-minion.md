# Domain Plan Contribution: frontend-minion

## Recommendations

### 1. Home page detection in `buildAutoBlocks()`

Use `window.location.pathname === '/'` for the auto-block check. This is the correct approach for several reasons:

- The site structure doc defines exactly one home page at `/`. There is no localized variant (`/en/`, `/de/`) or alternative path.
- This matches the pattern already established by `buildHeroBlock()` which does content-based detection. The post-index block is page-role-based, so path detection is the right primitive.
- EDS preview URLs (`https://<branch>--grounded--benpeter.aem.page/`) preserve the pathname `/`, so this works in all environments (localhost, preview, live).
- Do NOT use metadata-based detection (e.g., `getMetadata('template') === 'home'`) -- it adds an authoring dependency for something that is structurally fixed.

**Implementation detail**: The auto-block must inject a new section `<div>` containing the post-index block as the first child of `<main>`. This guarantees the sr-only `<h1>Posts</h1>` (rendered inside the block) is the first heading in DOM order. Looking at the existing `buildHeroBlock()` pattern, it does exactly this with `main.prepend(section)`. The post-index block should follow the same pattern:

```js
function buildPostIndexBlock(main) {
  if (window.location.pathname === '/') {
    const section = document.createElement('div');
    section.append(buildBlock('post-index', ''));
    main.prepend(section);
  }
}
```

Call `buildPostIndexBlock(main)` from `buildAutoBlocks()` after the hero block call (or instead of it -- the home page has no hero). The block gets an empty content cell because all data comes from the fetch.

### 2. Fetch strategy for `/query-index.json`

Fetch inline within `decorate()`, not via a shared utility. Rationale:

- No other block in the current codebase needs the query index. A utility would be premature abstraction.
- The fetch is straightforward: `fetch('/query-index.json')` returns the full index. EDS query index responses are small (even 100 posts produce < 50KB JSON).
- Use `window.location.origin` relative fetch (just `/query-index.json`) -- this works correctly across localhost, `.aem.page`, and `.aem.live` environments.
- Handle fetch failure gracefully: if the fetch fails or returns non-200, render only the sr-only `<h1>` and no entries. No error message in the DOM (the author knows the site is empty; an error banner adds no value to end users).
- Sort client-side by `date` descending after parsing. EDS query index does not guarantee sort order.

**Date handling**: EDS stores dates differently depending on the content source. With da.live (document-based authoring), dates in metadata may come through as Unix timestamps (seconds since epoch) or as Excel serial date numbers, not ISO strings. The `decorate()` function must handle both formats. Check the raw value -- if it's a number > 10000, treat it as a Unix timestamp in seconds (multiply by 1000 for JS Date). If it looks like `YYYY-MM-DD`, parse directly.

### 3. Layout: `--measure` inside `--layout-max` container

The two-tier width model works without conflict. Here is the exact CSS cascade:

```
main > .section > div          --> max-width: var(--layout-max) [1200px]
                                   margin-inline: auto
                                   padding-inline: responsive

main > .section > .post-index-wrapper  --> inherits the 1200px constraint
  > .post-index                        --> max-width: var(--measure) [68ch]
                                          margin-inline: auto
```

The `decorateBlock()` function in `aem.js` wraps the block element in a `<div class="post-index-wrapper">`. This wrapper div is matched by `main > .section > div` in `styles.css`, receiving the `--layout-max` constraint. The inner `.post-index` block element then applies `max-width: var(--measure)` and `margin-inline: auto` to center the reading column within the outer container.

**One subtlety**: The `styles.css` rule `main > .section > div` applies `padding-inline` to the wrapper. The block CSS should NOT duplicate padding-inline. The wrapper already handles side padding. The block only needs `max-width` and `margin-inline: auto`. This matches the pattern used by `.default-content-wrapper` which sets `max-width: var(--measure); margin-inline: auto; padding-inline: 0` -- the post-index block should follow this same approach (explicitly zero out padding-inline on the block element so it inherits the wrapper's padding context cleanly).

### 4. `helix-query.yaml` syntax

Based on the EDS indexing reference documentation, the correct syntax for this project:

```yaml
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

**Key decisions in this config**:

- `include: /blog/**` restricts indexing to blog posts only. The home page, legal, and privacy pages are excluded.
- `target: /query-index.json` puts the index at the root for clean fetch URLs.
- Properties use `head > meta` selectors because EDS converts document metadata to `<meta>` tags in the rendered HTML. The `og:title` selector is the standard EDS pattern for the page title. The `name="description"`, `name="date"`, `name="type"`, and `name="tags"` selectors extract custom metadata fields.
- `path` is included automatically by EDS -- it does not need to be declared as a property.

**Important prerequisite**: This file must be committed and the index must be built before the block can be tested. After committing `helix-query.yaml`, the index needs to be triggered. On localhost with `aem up`, the index is built automatically. On preview/live, it builds on next content preview/publish. If no blog posts exist yet, the index will return `{ "total": 0, "data": [] }` and the block renders empty (which is the correct behavior).

**Validation step**: After creating `helix-query.yaml`, run `aem up --print-index` and navigate to a blog post to verify the properties are extracted correctly. If no blog posts exist, create a test HTML file in `drafts/` with the expected metadata structure.

## Proposed Tasks

### Task 1: Create `helix-query.yaml`

**What**: Create `/helix-query.yaml` at the project root with the index configuration shown above.

**Deliverables**: `helix-query.yaml` file committed to the branch.

**Dependencies**: None. This is the first task and a prerequisite for all others.

**Validation**: Run `aem up --print-index`, create a test blog page in `drafts/` if needed, verify property extraction.

### Task 2: Add `.sr-only` utility class to `styles/lazy-styles.css`

**What**: Add the standard `.sr-only` class definition to `styles/lazy-styles.css`. This class does not currently exist anywhere in the project CSS.

**Deliverables**: Updated `styles/lazy-styles.css` with:

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

**Dependencies**: None. Can run in parallel with Task 1.

**Rationale**: `lazy-styles.css` is correct because the post-index block loads in the lazy phase (it is not part of the first section / LCP). The sr-only class is needed by the block's `decorate()` function, which runs after lazy-styles are loaded.

### Task 3: Create `blocks/post-index/post-index.css`

**What**: Create the block CSS file with all selectors specified in DDD-004's CSS Approach section.

**Deliverables**: `blocks/post-index/post-index.css`

**Dependencies**: Task 2 (`.sr-only` class must exist). Design tokens already exist in `tokens.css`.

**Key implementation notes**:
- Block-level: `max-width: var(--measure); margin-inline: auto; padding-inline: 0`
- Entry separation via `.post-entry + .post-entry` with `border-top` and `padding-block-start` (avoids border on first entry, avoids margin on last entry)
- No responsive media queries needed for layout changes -- only font size changes come from token overrides in `tokens.css`
- Reset default margins on `h2`, `p` within the block to control spacing precisely
- The `.post-meta` footer uses inline flow -- `time` and `.post-tags` are inline elements with CSS `::before` pseudo-element middot separators

### Task 4: Create `blocks/post-index/post-index.js`

**What**: Create the block JavaScript implementing the `decorate()` function.

**Deliverables**: `blocks/post-index/post-index.js`

**Dependencies**: Task 1 (`helix-query.yaml` must exist for testing). Task 3 (CSS must exist for visual verification).

**Implementation outline**:

1. Fetch `/query-index.json`
2. Parse response, extract `.data` array
3. Sort by `date` descending (handle both timestamp and ISO date formats)
4. Create sr-only `<h1>Posts</h1>` and prepend to block
5. For each entry, build `<article>` with the DOM structure specified in DDD-004
6. Validate tag slugs against `/^[a-z0-9-]+$/` before using in `href`
7. Format dates using `Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' })`
8. Generate position-based IDs: `post-1-title`, `post-2-title`, etc.
9. Clear block content, append all built elements
10. Handle empty state: only sr-only `<h1>`, no articles

**Type label mapping** (slug to DOM text):
```js
const TYPE_LABELS = {
  'build-log': 'Build Log',
  'pattern': 'Pattern',
  'tool-report': 'Tool Report',
  'til': 'TIL',
};
```

### Task 5: Wire auto-block injection in `scripts/scripts.js`

**What**: Add `buildPostIndexBlock(main)` function and call it from `buildAutoBlocks()`.

**Deliverables**: Updated `scripts/scripts.js` with the home page auto-block injection.

**Dependencies**: Tasks 3 and 4 (block files must exist).

**Implementation**: Add the `buildPostIndexBlock` function before `buildAutoBlocks`, call it inside the try block after `buildHeroBlock(main)`. The hero block check will be a no-op on the home page (no h1+picture combo), so ordering is not critical.

### Task 6: Create test content for verification

**What**: Create `drafts/index.html` (or verify that the home page CMS content works) to test the auto-block on the home page. Also create 2-3 test blog post HTML files in `drafts/blog/` with proper metadata to populate the query index.

**Deliverables**: Test HTML files in `drafts/` directory.

**Dependencies**: All previous tasks.

**Validation**: Start `aem up --html-folder drafts`, navigate to `http://localhost:3000/`, verify:
- Post-index block renders with test entries
- Entries are sorted by date descending
- Accessibility: Tab navigation works through title links and tag links
- Accessibility: Screen reader heading navigation reads type prefix + title
- Responsive: Check at 375px, 600px, 900px, 1200px
- Dark mode: Check with `prefers-color-scheme: dark`

### Task 7: Lint and commit

**What**: Run `npm run lint` (both ESLint and Stylelint), fix any issues, commit.

**Deliverables**: Clean lint pass, committed code.

**Dependencies**: All previous tasks.

## Risks and Concerns

### Risk 1: EDS date format in query-index.json

EDS does not guarantee ISO date strings in the query index. Depending on the content source (Google Docs, SharePoint, da.live), dates may appear as:
- Unix timestamps (seconds since epoch)
- Excel serial date numbers
- ISO date strings (`YYYY-MM-DD`)
- Locale-formatted strings

**Mitigation**: The `decorate()` function must include robust date parsing that handles multiple formats. Test with `aem up --print-index` to verify the actual format before hardcoding assumptions.

### Risk 2: `helix-query.yaml` property extraction depends on metadata authoring

The selectors `head > meta[name="type"]` and `head > meta[name="tags"]` only work if authors consistently add `type` and `tags` metadata to every blog post. Missing metadata = missing data in the index = broken/incomplete entries.

**Mitigation**: The block should handle missing fields gracefully:
- Missing `type`: skip the badge element entirely
- Missing `tags`: skip the tag list entirely
- Missing `description`: skip the description paragraph
- Missing `date`: skip the time element (or place entry at the end of the sort)
- Missing `title`: skip the entire entry (a post without a title is not renderable)

### Risk 3: No blog posts exist yet

If `query-index.json` returns zero results (no blog content published), the home page will show only the header and footer with an empty main content area. This is the designed empty state (DDD-004 explicitly states no "coming soon" message), but it may look broken to a reviewer.

**Mitigation**: Create test content in `drafts/` (Task 6) for local development. For PR review, note the empty state behavior in the PR description and provide a preview URL with test content if possible.

### Risk 4: Auto-block timing with `decorateSections`

The `buildAutoBlocks()` function runs before `decorateSections()` in the `decorateMain()` flow. The injected section `<div>` needs to be a raw `<div>` (not yet decorated) so that `decorateSections()` processes it correctly -- adding the `.section` class, wrapping children in block wrappers, etc. This is the same pattern used by `buildHeroBlock()` so it should work, but verify that the post-index block wrapper gets the correct classes.

### Risk 5: Content Security Policy

The `head.html` includes a strict CSP: `style-src 'self'`. The block CSS loads from the same origin via the EDS block loader, so this is fine. The block JS uses `document.createElement()` and `textContent` (no `innerHTML`), which is CSP-compliant. The `fetch()` to `/query-index.json` is same-origin. No CSP issues expected, but verify during testing.

### Risk 6: `padding-inline` double-application

If the block CSS applies its own `padding-inline` on top of the wrapper's `padding-inline` (from `main > .section > div`), content will be indented more than intended. The block must explicitly set `padding-inline: 0` on the `.post-index` element, similar to how `.default-content-wrapper` handles this in `styles.css`.

## Additional Agents Needed

None. The current team (frontend, accessibility, UX strategy, software docs) covers all aspects of this task. The accessibility minion should review the final DOM structure for ARIA correctness, but the DDD-004 spec already provides a thorough accessibility contract.
