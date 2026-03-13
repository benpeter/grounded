# Domain Plan Contribution: frontend-minion

## Recommendations

### Architecture Decision: Custom Block Fetching query-index.json (Option A)

After analyzing all three options against EDS conventions and this project's constraints, **option (a) -- a custom `post-index` block that fetches a query-index.json endpoint and renders entries client-side** -- is the clear recommendation. Here is why each option was evaluated:

**Option (c) rejected: CMS-authored default content.** Authoring each post entry as structured markup in the home page document means every new post requires a manual edit to the home page. This violates the core purpose of an index (automatic aggregation) and creates an unsustainable authoring burden. Additionally, there is no mechanism in default content to semantically represent the type badge, tags-as-links, and date metadata as structured data -- it would be free-form paragraphs that the block JS would need to parse, creating a fragile content contract.

**Option (b) considered but not ideal: auto-block pattern.** Auto-blocking (extending `buildAutoBlocks` in `scripts.js`) is designed for detecting patterns in already-authored content and wrapping them in block structures -- e.g., detecting an h1 + picture and creating a hero block. The home page post index is not "authored content that needs wrapping" -- it is dynamically generated from an external data source. Auto-blocking could trigger the block creation (e.g., detecting that the current page is `/` and injecting a post-index block), but the actual rendering still requires a block with a `decorate()` function that fetches data. This adds indirection without benefit. If auto-blocking is desired for ergonomic reasons (the home page document stays empty or minimal), this is a viable enhancement but not the primary mechanism.

**Option (a) recommended: custom `post-index` block.** This is the EDS-idiomatic pattern for dynamic content listings. The established pattern across EDS sites is:

1. Configure `helix-query.yaml` to expose post metadata (title, description, date, type, tags, path) as a JSON endpoint
2. Create a `post-index` block that fetches `/query-index.json` (or a custom endpoint like `/blog/query-index.json`)
3. The block's `decorate()` function fetches the JSON, filters/sorts entries, and renders semantic HTML
4. The block is either authored into the home page document (a single-row table with block name "post-index") or auto-blocked

The query-index.json approach is how EDS exposes page metadata. The default columns include `path`, `title`, `description`, `image`, `lastModified`. Custom metadata columns (like `type`, `tags`, `date`) are added by including corresponding `<meta>` tags in blog post pages and configuring the index to extract them.

### Data Source: helix-query.yaml Configuration

A `helix-query.yaml` file must be created at the project root to define a blog index that:

- **Includes** only `/blog/**` paths (avoids indexing `/legal`, `/privacy`, `/tags/`)
- **Excludes** drafts (pages with `robots: noindex` or `draft: true` metadata)
- **Exposes columns**: `path`, `title`, `description`, `date`, `type`, `tags`, `lastModified`
- The `date` column maps to a `publication-date` or custom `date` meta tag on blog posts
- The `type` column maps to a `type` meta tag (enum: `build-log`, `pattern`, `tool-report`, `til`)
- The `tags` column maps to `article:tag` meta tags (automatically extracted as arrays)

The JSON endpoint will be available at `/query-index.json` or a custom path defined in the yaml.

### Block Design: `post-index`

The block should be a new `blocks/post-index/` directory with `post-index.js` and `post-index.css`. The key architectural choices:

**Data fetching:** Fetch the query-index JSON in `decorate()`. Use a simple `fetch()` call -- no external dependencies. Handle pagination if the index grows beyond the default limit (EDS indexes return paginated results with `offset`, `limit`, `total`). For V1 with < 20 posts, a single fetch suffices.

**Sorting and filtering:** Sort by `date` descending (reverse chronological). Filter out any entries with `draft: true` if that metadata is exposed. All filtering is client-side since the query-index is a static JSON file.

**Rendering:** Build semantic HTML via DOM APIs (not innerHTML for security/CSP compliance -- the project has a strict CSP with `script-src 'nonce-aem' 'strict-dynamic'`). Each post entry becomes an `<article>` element with:

- Type badge as a `<span>` with a class derived from the type value
- Title as an `<a>` linking to the post path, rendered as `<h2>` or `<h3>` (see Open Question below)
- Description as a `<p>`
- Date as a `<time datetime="...">` with human-readable format
- Tags as a list of `<a>` elements linking to `/tags/{tag}`

**Width constraint:** The post index should constrain to `--measure` (68ch), not `--layout-max`. The post index is a reading-oriented list, not a grid or card layout. This matches the site's single-column, typography-driven aesthetic. The block wrapper gets the outer tier treatment (from DDD-001's `main > .section > div` rule), and the block content itself should be constrained to `--measure` and centered, matching `.default-content-wrapper` behavior.

**No pagination for V1:** CLAUDE.md explicitly states "No pagination until 20+ posts." The block should be designed to support pagination later (the fetch function should accept offset/limit parameters) but not render pagination controls in V1.

### Loading Phase

The post-index block should load in the **lazy phase**, not eager. The home page likely has minimal above-the-fold content (just the header), so the first section containing the post index will be loaded during `loadSections(main)` in `loadLazy()`. This is fine -- the block's data fetch will begin when the section loads. If the post index IS the first section and needs to be LCP, the loading phase must be reconsidered, but given the site's minimal header design, the first post entry should render fast enough even in the lazy phase.

However, there is a nuance: `loadSection(main.querySelector('.section'), waitForFirstImage)` in `loadEager` loads the first section eagerly. If the post-index block is in the first section, it will be eagerly loaded. The block should handle this gracefully -- the fetch should not block LCP. Consider rendering a skeleton/placeholder synchronously and populating with data asynchronously.

### Semantic HTML Structure

The proposed decorated DOM structure:

```html
<div class="post-index-wrapper">
  <div class="post-index block" data-block-name="post-index" data-block-status="loaded">
    <article class="post-entry">
      <span class="post-type post-type-build-log">Build Log</span>
      <h3><a href="/blog/my-post-slug">Post Title Here</a></h3>
      <p class="post-description">One to two sentence description of the post.</p>
      <footer class="post-meta">
        <time datetime="2026-03-10">March 10, 2026</time>
        <ul class="post-tags" aria-label="Tags">
          <li><a href="/tags/aem">aem</a></li>
          <li><a href="/tags/eds">eds</a></li>
        </ul>
      </footer>
    </article>
    <!-- more articles... -->
  </div>
</div>
```

Key HTML decisions:

- `<article>` for each entry -- semantically correct for a syndication-style listing
- `<h3>` for titles (assuming `<h1>` is reserved for the site name/page title per heading hierarchy) -- see Open Question
- `<footer>` within `<article>` for metadata (date + tags) -- semantically appropriate per HTML spec
- `<time>` with machine-readable `datetime` attribute for dates
- `<ul>` for tags with `aria-label` for screen reader context
- Type badge as a `<span>` with modifier class for styling, not a link (type is metadata, not a navigable taxonomy in V1)

### Visual Design Principles (for DDD document)

Following the site's aesthetic rules:

- **No cards, no shadows, no borders around entries.** Entries are separated by breathing room and optionally a faint `--color-border-subtle` rule line (per `docs/site-structure.md`)
- **Typography creates hierarchy.** Title is the strongest element (largest, `--color-heading`). Description is body text. Date and tags are muted. Type badge is small, muted, unobtrusive.
- **Type badge:** Use `--font-heading` (Source Code Pro) at a small size, `--color-text-muted`, uppercase or small-caps. This gives it a "label" feel without adding color or visual weight. Each type maps to a display label: `build-log` -> "Build Log", `pattern` -> "Pattern", `tool-report` -> "Tool Report", `til` -> "TIL".
- **Tags:** Small, `--color-link` for clickable appearance, inline comma-separated or dot-separated. No pill shapes, no backgrounds, no borders around individual tags. Tags are text links, not badges.
- **Entry separator:** Either generous `margin-bottom` (using `--section-spacing` or a fraction of it) or a 1px `--color-border-subtle` rule between entries. The rule should be optional and evaluated visually -- breathing room alone may be sufficient.
- **Date format:** "March 10, 2026" -- spelled out month, no leading zeros. Use `Intl.DateTimeFormat` for locale-aware formatting.

### Proposed New Tokens

The DDD should consider whether new tokens are needed:

- `--space-index-entry`: Vertical gap between post entries. Could be `--section-spacing` (48px) or a new value like 32px if 48px feels too generous for a list. Alternatively, use `--space-element` (1.5em) if entries should feel like elements within a section rather than sections themselves.
- No new color tokens needed -- existing `--color-text-muted`, `--color-heading`, `--color-link`, `--color-border-subtle` cover all elements.

### Accessibility Requirements

- Each `<article>` entry is a landmark -- screen readers can navigate between articles
- Tag list uses `<ul>` with `aria-label="Tags"` so screen readers announce the list purpose
- Type badge uses `aria-label` on the span if the display text differs from the semantic meaning (e.g., if we use abbreviations)
- Focus management: all interactive elements (title link, tag links) must have visible focus rings (`outline: 2px solid var(--color-heading); outline-offset: 2px`, matching DDD-002/003 precedent)
- The post list should be wrapped in a `<section>` or given `role="feed"` with `aria-label="Recent posts"` for screen reader navigation context
- Entries must be keyboard-navigable via Tab (links) and optionally via arrow keys if `role="feed"` is used

## Proposed Tasks

### Prerequisites (before DDD-004 implementation)

1. **Create `helix-query.yaml`** at project root to configure the blog post index. Define the index with `include: /blog/**`, columns for `path`, `title`, `description`, `date`, `type`, `tags`. This is a prerequisite because the block needs a data source.

2. **Verify metadata output** -- blog post pages must include the correct `<meta>` tags for `type`, `date`, and `article:tag` (tags). This requires at least one sample blog post in the CMS or as a static HTML draft to test against.

3. **Create a draft blog post** (`drafts/blog/sample-post.html`) with proper metadata tags so the query index can be tested locally with `aem up --print-index`.

### DDD-004 Document Tasks

4. **Write DDD-004-home-post-index.md** following the format in `docs/design-decisions/README.md`. Include:
   - Context section referencing content-model.md, site-structure.md, tokens.css, CLAUDE.md aesthetic rules
   - Layout wireframes showing a vertical list of post entries at mobile and desktop
   - Typography table mapping each text element to its token
   - Spacing table defining entry gaps, internal spacing within an entry
   - Responsive behavior (mobile stacking vs desktop layout)
   - HTML structure showing the target decorated DOM
   - CSS approach (layout method, key selectors)
   - Token usage table
   - Open questions (heading level, entry separator style, auto-block vs authored block)

### Implementation Tasks (post-approval)

5. **Create `blocks/post-index/post-index.js`** -- the block decoration logic: fetch query-index.json, sort by date descending, filter drafts, render semantic HTML with DOM APIs.

6. **Create `blocks/post-index/post-index.css`** -- styling scoped to `.post-index`, using design tokens, mobile-first responsive rules.

7. **Create home page content** -- either a CMS-authored home page with a "post-index" block table, or extend `buildAutoBlocks()` to inject the block on the home page automatically.

8. **Create test draft** (`drafts/index.html` or `drafts/home.html`) -- a static HTML file that includes the post-index block markup so the dev server can render it for testing.

9. **Lint and validate** -- `npm run lint`, verify WCAG compliance, test with keyboard navigation.

## Risks and Concerns

### 1. Query Index Configuration is a Hard Prerequisite

The `helix-query.yaml` file and proper metadata on blog post pages must exist before the post-index block can be developed and tested. Without this, the block has no data source. This is not a frontend-only concern -- it requires content model alignment.

**Mitigation:** Create a mock JSON file (`drafts/query-index-mock.json`) for development. The block can fetch from a configurable URL, defaulting to `/query-index.json` in production but overridable for testing.

### 2. No Blog Posts Exist Yet

There are no blog posts in the CMS or as static drafts under `/blog/`. The query index will return empty data. The post-index block must handle the empty state gracefully.

**Mitigation:** Design the empty state explicitly in the DDD. Options: show nothing (the page is just header + footer with no content between), or show a brief message. Given the site's minimal aesthetic, showing nothing is appropriate -- the block simply renders no `<article>` elements.

### 3. Heading Level Hierarchy

The site-structure.md says the home page IS the post index. If the page has an `<h1>` (e.g., "Mostly Hallucinations" or "Recent Posts"), then post titles should be `<h3>` (to leave room for potential section headings as `<h2>`). If the page has NO authored `<h1>` and the header logo serves as the page identifier, the block could use `<h2>` for titles. This must be decided in the DDD.

**Recommendation:** The home page should NOT have an `<h1>` in the authored content -- the header already contains the site name. Post titles should be `<h2>` elements. This gives the best accessibility hierarchy: `<h1>` is implicit in the site name, `<h2>` per post title, `<h3>` available for subheadings within post content on detail pages.

However, this conflicts with HTML best practice that every page should have exactly one `<h1>`. The DDD should address this explicitly.

### 4. CSP Constraints

The project uses a strict Content Security Policy (`script-src 'nonce-aem' 'strict-dynamic'`). The block must build DOM using `document.createElement()` and `.textContent` rather than `innerHTML` or template strings injected as HTML. This is standard EDS practice but worth noting as a constraint.

### 5. Performance: Client-Side Fetch Adds a Network Round-Trip

The post listing requires a fetch to `/query-index.json` before rendering, which adds latency after the initial page load. For a blog with < 20 posts, the JSON payload is tiny (< 5KB) and the fetch is to the same origin (fast). But this means the post list renders after a flash of empty content.

**Mitigation options:**
- Render a lightweight skeleton/placeholder synchronously in `decorate()`, then populate with data
- The EDS CDN serves query-index.json with aggressive caching, so repeat visits are instant
- For V1 with few posts, this is not a meaningful concern

### 6. Tag Page Dependencies

Post tags link to `/tags/{tag}`, which is DDD-007 (Tag Index). Those pages don't exist yet. The post-index block will render links to nonexistent pages.

**Mitigation:** Links can be rendered now and will 404 until DDD-007 is implemented. This is acceptable for incremental delivery. Alternatively, tags could be rendered as plain text (not links) in V1 and upgraded to links when tag pages ship. The DDD should specify which approach.

### 7. Date Parsing from query-index.json

The EDS query-index stores dates as Unix timestamps (seconds since epoch) in the `lastModified` field. The custom `date` metadata field (publication date) may be stored differently depending on how it's authored in the CMS. The `parseTimestamp` and `dateValue` extraction functions in `helix-query.yaml` can normalize this, but the format must be verified.

**Mitigation:** Test with `aem up --print-index` once a sample post with `date` metadata exists. The block should handle both ISO 8601 strings and Unix timestamps.

### 8. `--measure` Width for the Post Index

The recommendation to constrain the post index to `--measure` (68ch, ~550-612px) matches the reading column but may feel narrow for entries that include title + description + metadata. At 550px, long titles will wrap aggressively. This is a visual judgment call that should be evaluated in-browser during implementation.

**Alternative:** Use `--layout-max` and let entries breathe wider. But this contradicts the site's single-column, reading-focused aesthetic.

## Additional Agents Needed

### None beyond what's already planned

The DDD is a design document, not implementation. The existing agent lineup should be sufficient:

- **ux-design-minion** should validate the visual hierarchy decisions (type badge treatment, entry separator style, spacing proportions) to ensure they match the brand identity's "typography creates hierarchy" principle. If a ux-design-minion is already part of this planning round, no additional agent is needed.
- The `helix-query.yaml` configuration is a developer task that falls within frontend/EDS expertise -- no separate backend agent is needed since EDS indexing is declarative configuration, not server-side code.

Sources:
- [EDS Indexing Documentation](https://www.aem.live/developer/indexing)
- [EDS Indexing Reference](https://www.aem.live/docs/indexing-reference)
- [EDS Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)
- [EDS Block Collection](https://www.aem.live/developer/block-collection)
- [EDS Lists Block](https://www.aem.live/developer/block-collection/lists)
- [EDS JSON2HTML](https://www.aem.live/developer/json2html)
- [EDS Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
- [Adobe EDS Full Guide (allabout.network)](https://allabout.network/blogs/ddt/adobe-edge-delivery-services-full-guide-for-devs-architects-and-ai)
