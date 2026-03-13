# DDD-004: Home Page Post Index

Status: **Proposal**

## Context

The home page is the post index. There is no marketing copy, hero section, or other content — the entire page is a reverse-chronological list of posts. Each entry shows five elements: a type badge, a title, a description, a date, and tags. The design challenge is creating a list that is both dense enough to serve as an efficient archive and airy enough to remain readable.

### Governing constraints

**Site structure (docs/site-structure.md)**

The home page specification from `docs/site-structure.md`:

```
URL: /

The home page IS the post index. Latest posts, reverse chronological. Each entry shows:

- Type label (build-log, pattern, tool-report, til) — small, muted, unobtrusive
- Title — primary visual element per entry
- Description — 1-2 sentences, body text weight
- Date — muted
- Tags — small, clickable, visually quiet

Entries separated by breathing room and perhaps the faintest rule line
(--color-border-subtle). Not cards, boxes, or backgrounds.

No pagination until 20+ posts.
```

**Content model (docs/content-model.md)**

Five metadata fields are sourced from post front matter and exposed via `query-index.json`:

| Field | Type | Notes |
|---|---|---|
| `title` | text | Primary heading per entry |
| `description` | text | 1-2 sentence summary, required |
| `date` | date | Determines sort order |
| `type` | enum | One of: `build-log`, `pattern`, `tool-report`, `til` |
| `tags` | list | Lowercase, hyphenated (e.g., `aem`, `claude-code`) |

The four post types and their display labels:

| Slug | Display label (DOM) | CSS-rendered |
|---|---|---|
| `build-log` | Build Log | BUILD LOG |
| `pattern` | Pattern | PATTERN |
| `tool-report` | Tool Report | TOOL REPORT |
| `til` | TIL | TIL |

Tags follow flat namespace convention: lowercase, hyphenated. No title-casing. No categories.

**Aesthetic rules (CLAUDE.md)**

The relevant rules governing this surface:

- `--color-background` (#F6F4EE light) is the dominant visual. The page is warm white paper.
- `--color-heading` (#3F5232 light) is the strongest color on the page. Everything else recedes.
- Borders and rules use `--color-border-subtle`. They almost melt into the background.
- No cards with shadows, no gradients, no rounded containers, no hero images, no decorative icons.
- Typography creates hierarchy, not color blocks or boxes.
- `--color-accent` (gold) appears at most once per screen. Never as a theme color.
- Green and gold are NOT co-equal theme colors. This is a warm-white site where color is a quiet guest.

**DDD-001 layout contract**

DDD-001 establishes the two-tier width model: `--layout-max` (1200px) as the outer guardrail and `--measure` (68ch) as the comfortable reading column. The post index constrains to `--measure`, not `--layout-max`. This is a deliberate choice: entries are reading content, not navigation chrome. Constraining to `--measure` keeps the list in the same visual column as post body text (DDD-005), establishing spatial continuity between the index and the posts it links to.

The padding tokens (`--content-padding-mobile`, `--content-padding-tablet`, `--content-padding-desktop`) and section spacing (`--section-spacing: 48px`) apply unchanged from DDD-001.

**DDD-002 / DDD-003 precedent**

- **Focus ring pattern**: `outline: 2px solid var(--color-heading); outline-offset: 2px` on `:focus-visible`. Used in both the header and footer. The post index uses the same pattern for title links and tag links.
- **Link styling conventions**: `--color-link` for interactive text links. `text-decoration: none` as default; `text-decoration: underline` on hover.
- **Border-subtle usage**: `1px solid var(--color-border-subtle)` as an entry separator, matching the structural role of the footer's top border and the header's bottom border — a near-invisible rule that signals structure without imposing weight.

**Design tokens (styles/tokens.css)**

All tokens referenced in this document exist in `styles/tokens.css`. No new tokens are proposed. Every visual element in the post index maps to an existing CSS custom property.

**V1 scope exclusions (CLAUDE.md)**

Do not build these as part of the post index:

- No pagination (build when 20+ posts exist)
- No featured post or hero entry
- No card shadows, rounded containers, or background fills per entry
- No sidebar or secondary navigation
- No reading time estimates
- No "related posts" section
- No dark mode toggle (OS is the toggle via `prefers-color-scheme`)

**EDS data source (PREREQUISITE — blocks implementation)**

The post index block differs fundamentally from the header and footer blocks. Instead of loading a CMS-authored content fragment, it fetches `query-index.json` — the EDS content index generated from blog post metadata.

This requires a `helix-query.yaml` file at the project root that configures:
- **Include path**: `/blog/**` (all blog posts)
- **Required columns**: `path`, `title`, `description`, `date`, `type`, `tags`

Without `helix-query.yaml`, the query index will not expose post metadata, and the block will have nothing to render. This file must be created and merged to `main` before the `post-index` block can be implemented or tested.

The query index is automatically available at `/query-index.json` once `helix-query.yaml` is configured. The block fetches it client-side, sorts by `date` descending, and renders the entry list. See Open Question 4 for exact column naming and Open Question 6 for the auto-block vs. authored block decision.

---

## Proposal

### Layout

The post index is a vertical stack of `<article>` entries. Each entry has five stacked elements. No flexbox grid is needed for the entry stack — standard block flow handles the vertical arrangement. The metadata line (date + tags) uses inline flow with CSS-generated middot separators.

The width constraint is `max-width: var(--measure); margin-inline: auto` on the block element. This keeps entries in the reading column.

#### Entry anatomy

```
+---------------------------------------------+
| <-- max-width: --measure (68ch) ----------> |
|                                             |
|  BUILD LOG                                  |
|  --font-heading, --body-font-size-xs,       |
|  --color-text-muted, uppercase via CSS      |
|                                             |
|  Building a Design System for EDS          |
|  --font-heading, --heading-font-size-m,     |
|  --color-heading, weight 600, link          |
|                                             |
|  A practitioner's approach to design        |
|  tokens in Edge Delivery Services.          |
|  --font-body, --body-font-size-s,           |
|  --color-text, --line-height-body (1.7)     |
|                                             |
|  March 12, 2026 . aem . eds . performance  |
|  --font-body, --body-font-size-xs,          |
|  date: --color-text-muted                  |
|  tags: --color-link                         |
|                                             |
|.............................................|
|  1px --color-border-subtle (between entries)|
+---------------------------------------------+
```

#### List rhythm (two entries)

```
+---------------------------------------------+
| <-- max-width: --measure (68ch) ----------> |
|                                             |
|  [sr-only h1: "Posts"]                      |
|                                             |
|  BUILD LOG                                  |
|  Building a Design System for EDS          |
|  A practitioner's approach to design        |
|  tokens in Edge Delivery Services.          |
|  March 12, 2026 . aem . eds . performance  |
|                                             |
|  <-- margin-block-end: --section-spacing -> |
|.............................................|
|  <-- 1px --color-border-subtle ----------> |
|                                             |
|  TOOL REPORT                                |
|  Claude Code as a Pair Programmer           |
|  Six weeks of daily use: what it           |
|  gets right and where it still slips.       |
|  February 28, 2026 . claude-code . ai-workflow|
|                                             |
+---------------------------------------------+
```

#### Mobile wireframe (< 600px)

```
+-------------------------------------------------+
| <-- viewport (375px) -----------------------> |
|                                                 |
| <20px>                              <20px>      |
|        BUILD LOG                                |
|        Building a Design System                 |
|        for EDS                                  |
|        A practitioner's approach to             |
|        design tokens in Edge Delivery           |
|        Services.                                |
|        March 12, 2026 . aem . eds              |
|        . performance                            |
|                                                 |
|        --content-padding-mobile (20px)          |
|        --section-spacing below entry (48px)     |
|.................................................|
|        1px --color-border-subtle                |
+-------------------------------------------------+
```

At 375px viewport with 20px padding each side, 335px is available. Title at `--heading-font-size-m` (22px) wraps after approximately 18-20 characters. The metadata line wraps after the date on very narrow viewports — this is acceptable since `text-align: left` keeps the wrap point predictable.

#### Desktop wireframe (>= 900px)

```
+----------------------------------------------------------------------+
| <-- viewport (900px+) ---------------------------------------------> |
|                                                                      |
| <32px>                                                    <32px>     |
|        +--------------------------------------------+               |
|        | max-width: --measure (68ch ~ 550-600px)    |               |
|        |                                            |               |
|        | BUILD LOG                                  |               |
|        | Building a Design System for EDS           |               |
|        | A practitioner's approach to design tokens |               |
|        | in Edge Delivery Services.                 |               |
|        | March 12, 2026 . aem . eds . performance   |               |
|        |                                            |               |
|        | --content-padding-desktop (32px)           |               |
|        +--------------------------------------------+               |
|......................................................................|
|        1px --color-border-subtle (between entries)                   |
+----------------------------------------------------------------------+
```

At 900px+ the `--measure` constraint is reached. The entry column is centered within `--layout-max`. Whitespace flanks the reading column on wide viewports, consistent with DDD-001's two-tier width model.

### Typography

| Element | Font | Size | Weight | Color | Line-height |
|---|---|---|---|---|---|
| Type badge | `--font-heading` | `--body-font-size-xs` (15px / 14px) | 400 | `--color-text-muted` | 1 |
| Title (`<h2>`) | `--font-heading` | `--heading-font-size-m` (22px / 21px) | 600 | `--color-heading` | `--line-height-heading` (1.25) |
| Description (`<p>`) | `--font-body` | `--body-font-size-s` (17px / 16px) | 400 | `--color-text` | `--line-height-body` (1.7) |
| Date (`<time>`) | `--font-body` | `--body-font-size-xs` (15px / 14px) | 400 | `--color-text-muted` | 1.4 |
| Tags (`<a>`) | `--font-body` | `--body-font-size-xs` (15px / 14px) | 400 | `--color-link` | 1.4 |

Font sizes shown as mobile / desktop (>= 900px). Desktop adjustments are defined in `tokens.css` via `@media (width >= 900px)`.

**Type badge rendering**

The badge DOM text is title-case ("Build Log", "Pattern", "Tool Report", "TIL"). CSS applies `text-transform: uppercase; letter-spacing: 0.05em` to render visually as "BUILD LOG", "PATTERN", "TOOL REPORT", "TIL". Screen readers read the DOM text — the CSS transformation is invisible to assistive technology. This satisfies both the visual design goal (small uppercase system labels) and the accessibility requirement (WCAG 2.5.3 Label in Name: the sr-only prefix inside `<h2>` uses "Build Log: " to match the DOM text of the badge, not the CSS-transformed rendering).

**All four types use identical visual treatment.** There are no per-type colors, borders, or icons. The site's aesthetic rules prohibit decorative differentiation — color blocks and decorative elements are explicitly excluded. The type label text itself ("Build Log", "Pattern", "Tool Report", "TIL") provides sufficient differentiation. Readers who need to filter by type can use tag links; visual decoration per type would add noise without adding navigation value.

**Title at `--heading-font-size-m`**: The page has a visually hidden `<h1>` that sits at the top of the heading hierarchy. Post titles are `<h2>` elements. `--heading-font-size-m` (22px / 21px) provides clear visual hierarchy within a dense list without competing with the site identity in the header. Larger sizes (`--heading-font-size-l` or above) would create an overwrought index that reads as a series of shouting headings rather than a navigable list.

### Spacing & Rhythm

| Spacing zone | Value | Token | Rationale |
|---|---|---|---|
| Entry separation: border | `1px solid var(--color-border-subtle)` | `--color-border-subtle` | Near-invisible separator — signals boundary without imposing visual weight. Not on last entry. |
| Entry separation: margin | `margin-block-end: var(--section-spacing)` | `--section-spacing` (48px) | Entries are semantically distinct items. 48px is the standard section gap. Exact value is an Open Question (see OQ 1). |
| Badge to title | `margin-block-start: 0` on `<h2>` | — | Badge and title read as a unit. Tight stack, no gap between them. |
| Title to description | Default paragraph flow | `--space-paragraph` | Natural paragraph rhythm. |
| Description to metadata | Default paragraph flow | `--space-paragraph` | Natural flow; the `<footer>` inherits the paragraph bottom margin. |
| Block max-width | `max-width: var(--measure)` | `--measure` | Reading column constraint per DDD-001. |
| Block centering | `margin-inline: auto` | — | Centers within `--layout-max`. |
| Mobile inline padding | `padding-inline: var(--content-padding-mobile)` | `--content-padding-mobile` (20px) | Left edge aligns with header and body text. |
| Tablet inline padding | `padding-inline: var(--content-padding-tablet)` | `--content-padding-tablet` (24px) | — |
| Desktop inline padding | `padding-inline: var(--content-padding-desktop)` | `--content-padding-desktop` (32px) | — |

### Responsive Behavior

The post index has no structural layout changes across breakpoints. All elements stack vertically at every viewport width. Only padding and font sizes adjust.

| Breakpoint | Layout | Inline padding | Font adjustment |
|---|---|---|---|
| < 600px | Full-width entries, all elements stack vertically, title wraps at narrow widths | `--content-padding-mobile` (20px) | Mobile token values (see Typography table) |
| >= 600px | Same stacked layout | `--content-padding-tablet` (24px) | Same as mobile |
| >= 900px | Same stacked layout, now constrained to `--measure` (68ch) centered within the viewport | `--content-padding-desktop` (32px) | Desktop token values (smaller, tighter scale) |

No layout restructuring across breakpoints — no horizontal arrangements, no multi-column, no side-by-side metadata. The reading column is always vertical.

### Interactions

| Interaction | Behavior |
|---|---|
| Title link default | `color: var(--color-heading)`, `text-decoration: none`. Title reads as a heading, not a blue link. The link affordance is discovered via cursor change and hover behavior. |
| Title link hover | `text-decoration: underline`. Color unchanged (`--color-heading`). Underline appears on hover to confirm the link affordance. |
| Title link focus (`:focus-visible`) | `outline: 2px solid var(--color-heading); outline-offset: 2px`. Matches DDD-002/DDD-003 focus ring. `--color-heading` achieves 7.75:1 on `--color-background` (light) and 10.42:1 (dark). |
| Tag link default | `color: var(--color-link)`, `text-decoration: none`. Tags are visually quiet. |
| Tag link hover | `text-decoration: underline`. Color unchanged. |
| Tag link focus (`:focus-visible`) | `outline: 2px solid var(--color-heading); outline-offset: 2px`. Same focus ring as title. |
| Keyboard navigation | Tab follows DOM order: title link first, then each tag link, then the next entry's title link. One entry = 1 + N tab stops (1 title + N tags). |
| Screen reader — article nav | `<article>` elements are landmark regions. Screen reader users can navigate by landmark or by heading. |
| Screen reader — heading nav | Navigating by headings reads: `"Build Log: Building a Design System for EDS"` (h2) — the sr-only prefix provides type context. The visible badge has `aria-hidden="true"` to prevent double announcement. |
| Screen reader — tag list | `<ul>` announces as a list. With no `aria-label`, the post's `<article>` landmark provides context. The list is the only list within each article so the landmark context is unambiguous. |
| `prefers-reduced-motion` | No transitions proposed. No action required. |
| Dark mode | `prefers-color-scheme: dark` token overrides in `tokens.css` handle the switch automatically. `--color-text-muted` (#C9C3B8) on `--color-background` (#3A3A33) achieves ~5.07:1, passing WCAG AA (4.5:1). |

---

## HTML Structure

### Data source (EDS query index)

The post index block fetches `/query-index.json` client-side. This is fundamentally different from the header and footer blocks, which load CMS content fragments. The query index is a JSON file generated by EDS from post metadata according to `helix-query.yaml`.

Example `query-index.json` response:

```json
{
  "total": 2,
  "offset": 0,
  "limit": 256,
  "data": [
    {
      "path": "/blog/building-eds-design-system",
      "title": "Building a Design System for EDS",
      "description": "A practitioner's approach to design tokens in Edge Delivery Services.",
      "date": "2026-03-12",
      "type": "build-log",
      "tags": "aem, eds, performance"
    },
    {
      "path": "/blog/claude-code-pair-programmer",
      "title": "Claude Code as a Pair Programmer",
      "description": "Six weeks of daily use: what it gets right and where it still slips.",
      "date": "2026-02-28",
      "type": "tool-report",
      "tags": "claude-code, ai-workflow"
    }
  ]
}
```

The block fetches this JSON, sorts entries by `date` descending (client-side), and renders one `<article>` per entry. The exact field names (`path`, `title`, `description`, `date`, `type`, `tags`) depend on `helix-query.yaml` configuration — see Open Question 4.

### Final decorated DOM after `decorate()` runs

The `decorate()` function builds the DOM via `document.createElement()` and `textContent`/`setAttribute` assignments. `innerHTML` is not used. This is required for CSP compliance and is the EDS convention for block DOM construction.

```html
<div class="post-index-wrapper">
  <div class="post-index block" data-block-name="post-index" data-block-status="loaded">

    <!-- sr-only h1 must appear FIRST within main DOM order.
         The implementation must guarantee this, either by having
         buildAutoBlocks() inject the post-index block as the first
         child of <main>, or by having decorate() prepend to <main>
         rather than append to the block element.
         See Open Question 6. -->
    <h1 class="sr-only">Posts</h1>

    <!-- Entry 1 -->
    <article class="post-entry" aria-labelledby="post-1-title">

      <!-- Visible badge: aria-hidden prevents double announcement.
           Screen reader heading nav gets type context from the sr-only
           prefix inside <h2>, not from this element. -->
      <span class="post-type" aria-hidden="true">Build Log</span>

      <!-- id="post-1-title" is position-based (post-1, post-2, ...).
           IDs are derived from the sorted array index (1-based).
           This contract is testable: entry at index 0 gets id="post-1-title",
           entry at index 1 gets id="post-2-title", and so on. -->
      <h2 id="post-1-title">
        <!-- sr-only prefix gives heading nav the type context.
             Text matches the visible badge DOM text exactly (WCAG 2.5.3). -->
        <span class="sr-only">Build Log: </span>
        <a href="/blog/building-eds-design-system">Building a Design System for EDS</a>
      </h2>

      <p class="post-description">A practitioner's approach to design tokens in Edge Delivery Services.</p>

      <!-- <footer> within <article> is semantically correct per HTML spec
           for entry-level metadata. -->
      <footer class="post-meta">

        <!-- datetime attribute uses ISO 8601 date-only format: YYYY-MM-DD.
             This is the normative format. Example: datetime="2026-03-12".
             Never use datetime="March 12, 2026" or other human-readable forms. -->
        <time datetime="2026-03-12">March 12, 2026</time>

        <!-- No aria-label on the <ul>. The enclosing <article> landmark
             provides post context. This <ul> is the only list within the
             article, so "list, 3 items" is unambiguous without a label.
             Avoids 20+ identical aria-label="Tags" announcements per page. -->
        <ul class="post-tags">
          <!-- Tag slugs from query-index.json must be validated against
               the pattern /^[a-z0-9-]+$/ before use in href attributes.
               This prevents path traversal or protocol injection via
               malicious metadata values. -->
          <li><a href="/tags/aem">aem</a></li>
          <li><a href="/tags/eds">eds</a></li>
          <li><a href="/tags/performance">performance</a></li>
        </ul>

      </footer>
    </article>

    <!-- Border + margin-block-end between entries, not on last entry.
         Applied via CSS: .post-entry + .post-entry has border-top,
         or .post-entry:not(:last-child) has border-bottom. -->

    <!-- Entry 2 -->
    <article class="post-entry" aria-labelledby="post-2-title">
      <span class="post-type" aria-hidden="true">Tool Report</span>
      <h2 id="post-2-title">
        <span class="sr-only">Tool Report: </span>
        <a href="/blog/claude-code-pair-programmer">Claude Code as a Pair Programmer</a>
      </h2>
      <p class="post-description">Six weeks of daily use: what it gets right and where it still slips.</p>
      <footer class="post-meta">
        <time datetime="2026-02-28">February 28, 2026</time>
        <ul class="post-tags">
          <li><a href="/tags/claude-code">claude-code</a></li>
          <li><a href="/tags/ai-workflow">ai-workflow</a></li>
        </ul>
      </footer>
    </article>

  </div>
</div>
```

**Key decisions:**

- `<article>` per entry with `aria-labelledby` pointing to its `<h2>`. Screen reader landmark navigation announces the entry's accessible name.
- Visible type badge has `aria-hidden="true"`. The `<h2>` sr-only prefix carries the type information for heading navigation. Without `aria-hidden` on the badge, screen readers announce type twice: once from the badge, once from the heading prefix.
- The sr-only prefix inside `<h2>` uses title-case text matching the visible badge DOM text exactly ("Build Log: ", "Tool Report: "), satisfying WCAG 2.5.3 Label in Name. It does not use the CSS-transformed uppercase form.
- `<footer class="post-meta">` within `<article>` is semantically correct. Per the HTML spec, `<footer>` represents information about its nearest ancestor sectioning content or sectioning root — here, the `<article>` entry.
- `<time datetime="YYYY-MM-DD">` uses ISO 8601 date-only format in the `datetime` attribute. The human-readable text content uses full month name format ("March 12, 2026") via JavaScript's `Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' })`.
- Tag slugs are validated against `/^[a-z0-9-]+$/` before interpolation into `href="/tags/{slug}"` attributes. This prevents path traversal (e.g., `../admin`) or protocol injection (e.g., `javascript:`) via malicious `tags` values in `query-index.json`.
- `aria-labelledby` IDs use position-based naming: `post-1-title`, `post-2-title`, etc. The ID is derived from the entry's 1-based position in the date-sorted array. This contract is deterministic and testable.
- No `role="feed"`. That role implies infinite scroll, which this site does not use. `<main>` and `<article>` landmarks provide sufficient navigation structure.
- The sr-only `<h1>` with text "Posts" must appear first within `<main>` DOM order, before any `<article>` elements. Implementation must guarantee this regardless of block injection method (see Open Question 6).
- The `.sr-only` utility class must be defined in the project CSS (see Open Question 5). Standard definition:

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

**Empty state**: When `query-index.json` returns zero results, the block renders only the sr-only `<h1>` and no `<article>` elements. No "coming soon" message. The author knows the site is empty; an empty-state message adds no value.

---

## CSS Approach

**Layout method**: Standard block flow for the entry list. No flexbox or grid needed for the vertical stack of `<article>` elements — each article is a block-level element that stacks naturally. The metadata line (`<footer class="post-meta">`) uses inline flow: `<time>` followed by the inline-displayed `<ul>` with CSS-generated middot separators.

**Width constraint**: `max-width: var(--measure); margin-inline: auto` on the `.post-index` block element. This confines the list to the reading column, consistent with DDD-001's `--measure` tier.

**Key selectors** (scoped to `.post-index` per EDS convention):

1. `.post-index` — `max-width: var(--measure); margin-inline: auto`
2. `.post-index .post-entry` — `margin-block-end: var(--section-spacing)` (see OQ 1 on exact value)
3. `.post-index .post-entry:not(:last-child)` — `border-bottom: 1px solid var(--color-border-subtle)` (or `.post-entry + .post-entry { border-top: ... }` — either approach is equivalent; choose the one that avoids a bottom border on the last entry)
4. `.post-index .post-type` — `font-family: var(--font-heading); font-size: var(--body-font-size-xs); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; line-height: 1; display: block`
5. `.post-index h2` — `font-size: var(--heading-font-size-m); font-weight: 600; color: var(--color-heading); line-height: var(--line-height-heading); margin-block: 0`
6. `.post-index h2 a` — `color: inherit; text-decoration: none`
7. `.post-index h2 a:hover` — `text-decoration: underline`
8. `.post-index h2 a:focus-visible` — `outline: 2px solid var(--color-heading); outline-offset: 2px`
9. `.post-index .post-description` — `font-size: var(--body-font-size-s); color: var(--color-text); line-height: var(--line-height-body)`
10. `.post-index .post-meta` — inline flow container; `font-size: var(--body-font-size-xs); color: var(--color-text-muted)`
11. `.post-index .post-tags` — `list-style: none; display: inline; margin: 0; padding: 0`
12. `.post-index .post-tags li` — `display: inline`
13. `.post-index .post-tags li + li::before` — `content: " \B7 "` (middot separator between tags); `color: var(--color-text-muted)`
14. `.post-index .post-meta time + .post-tags::before` — `content: " \B7 "` (middot separator between date and tags); `color: var(--color-text-muted)`
15. `.post-index .post-tags a` — `color: var(--color-link); text-decoration: none`
16. `.post-index .post-tags a:hover` — `text-decoration: underline`
17. `.post-index .post-tags a:focus-visible` — `outline: 2px solid var(--color-heading); outline-offset: 2px`

**DOM construction**: The `decorate()` function builds all elements via `document.createElement()`, assigning text via `textContent` and attributes via `setAttribute()`. `innerHTML` assignment is not used anywhere in the block. This satisfies CSP requirements and is the established EDS block convention.

---

## Token Usage

| Element | Property | Token | Status |
|---|---|---|---|
| Page background | `background-color` | `--color-background` | Existing |
| Type badge | `font-family` | `--font-heading` | Existing |
| Type badge | `font-size` | `--body-font-size-xs` | Existing |
| Type badge | `color` | `--color-text-muted` | Existing |
| Title (`<h2>`) | `font-family` | `--font-heading` | Existing |
| Title (`<h2>`) | `font-size` | `--heading-font-size-m` | Existing |
| Title (`<h2>`) | `color` | `--color-heading` | Existing |
| Title (`<h2>`) | `line-height` | `--line-height-heading` | Existing |
| Title link default | `color` | `--color-heading` (via inherit) | Existing |
| Title link focus ring | `outline-color` | `--color-heading` | Existing |
| Description (`<p>`) | `font-family` | `--font-body` | Existing |
| Description (`<p>`) | `font-size` | `--body-font-size-s` | Existing |
| Description (`<p>`) | `color` | `--color-text` | Existing |
| Description (`<p>`) | `line-height` | `--line-height-body` | Existing |
| Date (`<time>`) | `font-family` | `--font-body` | Existing |
| Date (`<time>`) | `font-size` | `--body-font-size-xs` | Existing |
| Date (`<time>`) | `color` | `--color-text-muted` | Existing |
| Middot separators | `color` | `--color-text-muted` | Existing |
| Tag links default | `font-family` | `--font-body` | Existing |
| Tag links default | `font-size` | `--body-font-size-xs` | Existing |
| Tag links default | `color` | `--color-link` | Existing |
| Tag links focus ring | `outline-color` | `--color-heading` | Existing |
| Entry separator border | `border-color` | `--color-border-subtle` | Existing |
| Entry separator border | `border-width` | `1px` | Hardcoded |
| Entry margin | `margin-block-end` | `--section-spacing` | Existing |
| Block max-width | `max-width` | `--measure` | Existing |
| Mobile inline padding | `padding-inline` | `--content-padding-mobile` | Existing |
| Tablet inline padding | `padding-inline` | `--content-padding-tablet` | Existing |
| Desktop inline padding | `padding-inline` | `--content-padding-desktop` | Existing |
| Type badge letter-spacing | `letter-spacing` | `0.05em` | Hardcoded |

No new tokens proposed. `1px` border width and `0.05em` letter-spacing are hardcoded intentionally — these are universal implementation values with no semantic analog in the token scale.

---

## Open Questions

1. **Entry spacing: `--section-spacing` (48px) or reduced value (~36px)?**
The resolved spec uses `--section-spacing` (48px) as the starting value. This is the standard section gap from DDD-001. However, entries are list items within a single page section, not independent page sections. 48px may create excessive visual separation when viewing 10+ entries. Recommendation: prototype with 5+ real entries at 48px and compare to `calc(var(--section-spacing) * 0.75)` (36px). The token remains `--section-spacing`; the CSS may use `calc()` if the reduced value is adopted.

2. **Tag display casing: lowercase slugs as-is, or title-case with mapping?**
Tags from `query-index.json` are lowercase hyphenated slugs: `aem`, `eds`, `claude-code`. The current spec displays them as-is. Alternative: a mapping table (e.g., `aem` -> "AEM", `claude-code` -> "Claude Code") for cleaner display text. Rejected for V1 because: (a) the content model defines lowercase as the canonical form; (b) the display text also serves as the URL path `/tags/aem`, so matching text and URL is clearer; (c) a mapping table requires maintenance as new tags are added. Flag for reconsideration if the raw slugs read awkwardly in the rendered index.

3. **Tag link behavior before DDD-007 ships**
Tags render as `<a href="/tags/{slug}">` from day one. Until DDD-007 (Tag Index page) is implemented, these links will return 404. This is an acceptable incremental delivery tradeoff — it avoids re-implementing tag rendering twice. Alternative: render tags as plain text initially, convert to links when DDD-007 ships. Recommendation: render as links from day one.

4. **`helix-query.yaml` column configuration (implementation prerequisite)**
The exact field names, include/exclude paths, and sort configuration for `helix-query.yaml` are not yet defined. This file must exist and be merged to `main` before the `post-index` block can be developed or tested. Required columns: `path`, `title`, `description`, `date`, `type`, `tags`. Include path: `/blog/**`. Confirming exact YAML syntax against the EDS documentation is a prerequisite step for the implementing agent.

5. **`.sr-only` utility class: existing or new?**
The `decorate()` function needs a `.sr-only` class for the visually hidden `<h1>` and the sr-only prefix inside `<h2>`. Check whether `.sr-only` is already defined in `styles/styles.css` or `styles/lazy-styles.css`. If it exists, use it. If not, define it in `styles/lazy-styles.css` (the post index is lazy-loaded, so the sr-only class can be in the lazy stylesheet without LCP impact).

6. **Auto-block injection vs. authored block**
Should the `post-index` block be injected automatically by `buildAutoBlocks()` in `scripts.js` on the home page (`/`), or should it be explicitly authored into the home page CMS document as a block? Two approaches:
   - **Auto-block** (recommended): `buildAutoBlocks()` detects `window.location.pathname === '/'` and injects a `post-index` block. This requires testing both the injection path in `scripts.js` and the `decorate()` function in `post-index.js`.
   - **Authored block**: The home page document contains a `post-index` block authored in the CMS. Tests only `decorate()`. Requires the author to add the block manually.
   The answer affects test scope: auto-block injection requires testing the `buildAutoBlocks()` path; an authored block tests only `decorate()`.

7. **Description field provenance**
The `description` field shown in each index entry can come from two sources: (a) explicit CMS metadata authored by the writer for each post, or (b) EDS auto-extraction from the first paragraph of page content. If auto-extracted, the author has no direct control over what appears in the index. A post whose first paragraph is a code block or a callout would produce a poor description. This is a prerequisite question for content authoring workflow — the answer must be confirmed alongside `helix-query.yaml` configuration. If descriptions are auto-extracted, document the fallback behavior and communicate the constraint to the author.

---

## Decision

- [ ] Approved
- [ ] Approved with changes
- [ ] Rejected

### Reviewer Notes

_Human writes here during review._
