# Frontend Minion — DDD-005 Planning Contribution

## Question 1: Post Header Decoration — scripts.js vs Auto-Block

**Recommendation: Inline in `scripts.js` eager phase, NOT an auto-block.**

Rationale:

1. **The post header is not a block.** In EDS, blocks are reusable content components authored as tables in Google Docs. The post header is metadata decoration of default content (the h1 and surrounding elements already present in the DOM). Auto-blocks (`buildAutoBlocks`) create synthetic block DOM via `buildBlock()` — that pattern is for injecting entirely new block structures (like the post-index on `/`). The post header decoration transforms existing DOM elements, which is fundamentally different.

2. **Timing matters for LCP.** The h1 is almost certainly the LCP element on post detail pages (large text, above the fold). The `body.post-detail` class must be added before the first section loads so that post-scoped CSS applies immediately without FOUC. This means detection must happen in the eager path. The body class addition and `decorateButtons` exclusion are lightweight synchronous operations that belong in `decorateMain()` or `loadEager()`.

3. **The actual metadata decoration (injecting type badge, post-meta paragraph) can happen during eager section loading.** Since `loadSection` processes the first section eagerly, and the post header lives in the first section, we can add a `decoratePostHeader()` call in `buildAutoBlocks()` that runs synchronously on the first `.default-content-wrapper` when we detect a post detail page. This keeps it alongside other auto-decoration logic without creating a full block.

**Proposed code location in `scripts.js`:**

```javascript
// In buildAutoBlocks(), after buildPostIndexBlock():
function buildAutoBlocks(main) {
  try {
    // ... existing fragment and hero logic ...
    buildHeroBlock(main);
    buildPostIndexBlock(main);
    decoratePostDetail(main);  // new
  } catch (error) { ... }
}
```

Where `decoratePostDetail(main)` does:
- Path check: `window.location.pathname.startsWith('/blog/')`
- Add `body.post-detail` class
- Exclude post body from `decorateButtons()` side effects (see Q4)
- Inject type badge `<p>` before h1
- Inject sr-only prefix inside h1
- Build the `.post-meta` paragraph from page metadata (date, updated, tags)

**Risk: Metadata availability.** EDS page metadata is available via `document.head` meta tags at eager time. The `getMetadata()` helper from `aem.js` reads these. We need to verify that `type`, `date`, `updated`, and `tags` metadata are present in the `<head>` — they should be, as EDS maps all sheet metadata to meta tags.

## Question 2: Shared Utilities Extraction Strategy

**Recommendation: Create `scripts/post-utils.js` as a shared module.**

The four utilities (`TYPE_LABELS`, `DATE_FORMATTER`, `parseDate`, `toIsoDate`) are needed by both `post-index.js` (block, lazy-loaded) and the post detail decoration (eager, in `scripts.js`). Here is how to handle this without breaking EDS code-splitting:

**Option A (recommended): `scripts/post-utils.js`**

```
scripts/
  aem.js          # core (never modify)
  scripts.js      # imports from post-utils.js
  post-utils.js   # shared post utilities (NEW)
  delayed.js
```

`scripts.js` does a static `import` of the utilities it needs. Since `scripts.js` is already loaded eagerly via `head.html`, bundling post-utils into the same module graph is fine — the browser fetches `post-utils.js` as a separate HTTP request but it's tiny (~30 lines) and needed immediately for post detail pages.

`post-index.js` also does a static `import` from `../scripts/post-utils.js`. Since blocks are lazy-loaded via dynamic `import()` in `aem.js`, the browser will fetch `post-utils.js` when the post-index block loads. On post detail pages, `post-utils.js` is already cached from the eager load. On the home page (where post-index runs), it's a small additional request.

```javascript
// scripts/post-utils.js
export const TYPE_LABELS = { ... };
export const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', { ... });
export function parseDate(value) { ... }
export function toIsoDate(ms) { ... }
```

```javascript
// blocks/post-index/post-index.js
import { TYPE_LABELS, DATE_FORMATTER, parseDate, toIsoDate } from '../../scripts/post-utils.js';
```

```javascript
// scripts/scripts.js
import { TYPE_LABELS, parseDate, toIsoDate, DATE_FORMATTER } from './post-utils.js';
```

**Why not inline in scripts.js?** That would mean post-index.js imports from scripts.js, creating a circular dependency risk (scripts.js already imports from aem.js which orchestrates block loading). Keeping utilities in a separate leaf module avoids this.

**Why not keep duplicated?** Duplication of `parseDate` is a correctness risk — if the date parsing logic is updated in one place but not the other, the index and detail pages will display different dates for the same post. Single source of truth matters here.

**Performance impact:** `post-utils.js` is ~1KB uncompressed. On post detail pages, it loads in parallel with `scripts.js` (static import). On the home page, it loads when `post-index.js` is dynamically imported. Cache-friendly: same URL, same module, same HTTP cache entry. Net impact: one additional tiny HTTP request on first page load, cached thereafter.

## Question 3: Post-Detail Scoped CSS Location

**Recommendation: New file `styles/post-detail.css`, loaded in lazy phase.**

Analysis of options:

| Option | Pros | Cons |
|---|---|---|
| **`lazy-styles.css`** | No new file, loads in existing lazy phase | Grows a single file with page-type-specific rules; violates separation of concerns; loads on ALL pages including home |
| **`styles/post-detail.css` (new, lazy-loaded)** | Clean separation; only loaded on post detail pages; follows EDS patterns for conditional CSS | One additional HTTP request on post pages |
| **Block CSS (e.g., `blocks/post-detail/post-detail.css`)** | EDS auto-loads block CSS when block is used | Post detail is NOT a block — shoehorning page-level styles into block CSS creates a false abstraction |

**Implementation:**

In `scripts.js`, conditionally load the CSS during the lazy phase:

```javascript
async function loadLazy(doc) {
  // ... existing header/section loading ...

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);

  // Load post-detail styles only on blog pages
  if (document.body.classList.contains('post-detail')) {
    loadCSS(`${window.hlx.codeBasePath}/styles/post-detail.css`);
  }

  loadFonts();
}
```

**Wait — FOUC concern.** If the `body.post-detail` class is added in eager phase but `post-detail.css` loads in lazy phase, the first section renders with global styles before post-detail overrides arrive. The first section IS the post header with the h1.

**Revised recommendation:** Split into two files:

1. **Critical post-detail CSS in `styles/styles.css`** — Only the rules needed for the first section (post header: h1 margin reset, type badge, post-meta). These are scoped behind `body.post-detail` so they have zero cost on non-post pages. Adding ~20 lines to styles.css is acceptable for LCP correctness.

2. **`styles/post-detail.css` loaded in lazy phase** — Body content typography overrides (h2/h3 spacing, blockquote/pull-quote styles, body link underlines, code block refinements, list spacing, hr spacing, table styling). These are all below the fold and load before the user scrolls to them.

This two-file split aligns with EDS three-phase loading: eager CSS for LCP, lazy CSS for below-fold.

**Alternative (simpler, recommended for V1):** Put ALL post-detail CSS in `styles/post-detail.css` and load it in eager phase for post pages only. The file is small (~150 lines), and conditional eager loading avoids the FOUC issue entirely:

```javascript
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    // Load post-detail CSS before first section renders
    if (document.body.classList.contains('post-detail')) {
      await loadCSS(`${window.hlx.codeBasePath}/styles/post-detail.css`);
    }
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }
  // ... fonts ...
}
```

**Final recommendation for V1: Single `styles/post-detail.css` loaded conditionally in eager phase.** It is small, avoids FOUC, and keeps all post-detail styles in one discoverable file. If Lighthouse shows the additional request hurts LCP on post pages, inline the critical subset into `styles.css` later.

## Question 4: `decorateButtons()` Side Effect Handling

**Recommendation: CSS override within post context (Option B from DDD-005), not exclusion.**

Analysis of both approaches:

### Option A: Exclude post body from `decorateButtons()`

```javascript
function decorateMain(main) {
  if (isPostDetail()) {
    // Only decorate buttons in the first section (post header)
    const firstSection = main.querySelector('.section');
    decorateButtons(firstSection || main);
  } else {
    decorateButtons(main);
  }
  // ...
}
```

**Problems:**
- `decorateButtons()` runs on `main` before sections exist (sections are created by `decorateSections()` which runs later in `decorateMain()`). At the time `decorateButtons` runs, there are no `.section` divs yet — just raw `<div>` children of `<main>`.
- Even scoping to the first div is fragile: you're coupling to the order of operations inside `decorateMain()`, which calls `decorateButtons` first, then `buildAutoBlocks`, then `decorateSections`.

### Option B: CSS override (recommended)

Let `decorateButtons()` run normally on all content. Then override the visual effect in `post-detail.css`:

```css
/* Reset button styling on standalone links in post body content.
   decorateButtons() adds .button class to lone links in <p> elements.
   In post content, these should remain plain links. */
body.post-detail .default-content-wrapper a.button:any-link {
  display: inline;
  margin: 0;
  border: none;
  border-radius: 0;
  padding: 0;
  font-weight: inherit;
  line-height: inherit;
  text-align: inherit;
  text-decoration: underline;
  background-color: transparent;
  color: var(--color-link);
  cursor: pointer;
  overflow: visible;
  text-overflow: unset;
  white-space: normal;
}

body.post-detail .default-content-wrapper a.button:hover {
  background-color: transparent;
  color: var(--color-link-hover);
  text-decoration: none;
}

body.post-detail .default-content-wrapper .button-container {
  /* Remove the button-container margin/padding if any */
  margin: 0;
}
```

**Why this is better:**
- No coupling to `decorateMain()` execution order
- No modification of `aem.js` behavior (AGENTS.md says never modify aem.js)
- Declarative: the override is visible in CSS, easy to understand and remove
- If a future post genuinely needs a CTA button, an author can use a Button block instead of a standalone link, sidestepping the override
- The `.post-meta a` links (tags) are inside `.default-content-wrapper` but have specific `.post-meta` selectors that already control their styling

**Risk:** The `a.button` selector in styles.css has relatively high specificity (`a.button:any-link`). The override needs `body.post-detail .default-content-wrapper a.button:any-link` which has higher specificity. This works cleanly.

## Quote Block Implementation

The DDD-005 spec references a Quote block (`blocks/quote/`) that does not yet exist. This needs to be created as part of this implementation:

**Files needed:**
- `blocks/quote/quote.js` — Block decoration logic
- `blocks/quote/quote.css` — Block styles (both standard and pull-quote variants)

**Block behavior:**
- Standard quote: Wraps content in `<blockquote>`, applies left border with `--color-border`
- Pull-quote variant (class `pull-quote` via section metadata or block variant): Wraps in `<figure aria-hidden="true"><blockquote>`, applies `--color-accent` left border, editorial font

**CSS scoping note:** Quote block styles live in `blocks/quote/quote.css` (standard EDS pattern). Post-detail-specific spacing overrides for quotes (the 2em pull-quote margins) go in `styles/post-detail.css` scoped behind `body.post-detail`.

## Summary: File Organization

```
scripts/
  post-utils.js          # NEW — shared TYPE_LABELS, DATE_FORMATTER, parseDate, toIsoDate
  scripts.js             # MODIFIED — add decoratePostDetail(), conditional CSS loading
styles/
  post-detail.css        # NEW — all post-detail scoped CSS (~150 lines)
blocks/
  quote/
    quote.js             # NEW — Quote block decoration
    quote.css            # NEW — Quote block styles (standard + pull-quote)
  post-index/
    post-index.js        # MODIFIED — import utilities from post-utils.js instead of defining locally
```

## Dependencies and Risks

| Risk | Severity | Mitigation |
|---|---|---|
| **Metadata not in `<head>` at eager time** | High | Verify with `curl localhost:3000/blog/test-post` that meta tags for type, date, tags exist. If not, decoration must defer to lazy phase. |
| **`post-detail.css` eager load adds to LCP** | Medium | File is ~150 lines / ~3KB. One additional HTTP request. Monitor with Lighthouse. Fall back to inlining critical subset in styles.css if needed. |
| **`decorateButtons` CSS override is verbose** | Low | Could use `all: unset` on `a.button` but that nukes inherited styles too aggressively. Explicit property reset is safer and more maintainable. |
| **Import path from post-index.js to post-utils.js** | Low | Must use `../../scripts/post-utils.js` relative path with `.js` extension per ESLint config. Verify the path resolves in EDS dev server. |
| **Quote block does not exist yet** | High | Must be created as part of this implementation. It's a standard EDS block, so the pattern is well-established. |
| **`body.post-detail` class timing** | Medium | Must be added in `decorateMain()` (synchronous, before `loadSection`) to ensure CSS applies before first paint. Verified: `decorateMain` runs before `document.body.classList.add('appear')` in `loadEager()`. |

## Implementation Order

1. **`scripts/post-utils.js`** — Extract shared utilities. Zero risk, pure refactor.
2. **Update `blocks/post-index/post-index.js`** — Import from post-utils.js. Verify index still works.
3. **`styles/post-detail.css`** — All post-detail scoped CSS including button override.
4. **`scripts/scripts.js` modifications** — Path detection, body class, `decoratePostDetail()`, conditional CSS loading.
5. **`blocks/quote/quote.js` + `quote.css`** — Quote block with standard and pull-quote variants.
6. **Test content** — Static HTML in `drafts/` for dev server testing.
