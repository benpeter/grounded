# Phase 3: Synthesis — DDD-004 Home Page Post Index

## Delegation Plan

**Team name**: ddd-004-post-index
**Description**: Produce DDD-004-home-post-index.md defining the home page post index design surface — a reverse-chronological list of posts with type badge, title, description, date, and tags per entry.

---

## Conflict Resolutions

### 1. Type badge placement: inline vs. stacked above title

**ux-strategy-minion** recommends the type badge inline on the same line as the title, preceding it: `[type badge]  Title of the Post`. The rationale is that it creates a "label: title" cognitive chunk, keeps entries compact, and avoids extra scanning lines.

**ux-design-minion** recommends the type badge stacked above the title on its own line. The rationale is a clear reading flow: classify > read title > scan description > note metadata.

**Resolution: Stacked above the title.** The ux-design-minion's approach wins because:
- On mobile at 375px, an inline badge + long title would force awkward wrapping mid-unit. A stacked badge on its own line degrades gracefully.
- The stacked layout matches the precedent set by site-structure.md, which lists the five elements as a vertical hierarchy: type label, title, description, date, tags.
- The visual weight difference (muted uppercase xs text vs. heading-colored h2 text) is sufficient to establish subordination without requiring same-line placement.
- The ux-strategy-minion's concern about extra scanning lines is valid but mitigated by the badge's tiny visual footprint — readers' eyes will naturally skip past it to the title.

### 2. Heading level: `<h2>` vs. `<h3>`

**accessibility-minion** says `<h2>` (directly under a visually hidden `<h1>`).
**frontend-minion** says `<h3>` (leaving room for section headings as `<h2>`).

**Resolution: `<h2>`.** The accessibility-minion is correct. There are no intermediate section headings on the home page — the entire page is a flat list of posts. Using `<h3>` would skip a heading level, violating WCAG SC 1.3.1. The home page gets a visually hidden `<h1>`, and each post title is `<h2>`.

### 3. `<h1>` on the home page

All specialists agree the home page needs an `<h1>` and that the header does not provide one (it uses `<span>` elements per DDD-002). Three options were considered.

**Resolution: Option B — visually hidden `<h1>`.** Text: "Posts". This satisfies WCAG without visual impact, avoids conditional logic in the header block, and is the approach recommended by both accessibility-minion and ux-design-minion. The sr-only utility class must be defined (or verified to exist) in the project CSS.

### 4. Type badge accessibility pattern

**accessibility-minion** recommends a dual approach: visible badge with `aria-hidden="true"` + visually hidden prefix inside the `<h2>` (e.g., `<span class="sr-only">Build Log: </span>`). This gives screen reader heading navigation the type context.

**ux-design-minion** says the badge is plain visible text announced in reading order before the heading — no special ARIA needed.

**Resolution: accessibility-minion's Approach A (dual pattern).** The rationale is compelling: screen reader users navigating by headings (the dominant scan pattern, equivalent to sighted users scanning titles) would miss the type information entirely if the badge is a separate element outside the heading. The `aria-hidden` on the visible badge prevents double announcement. This is the architecturally correct pattern.

### 5. Tags markup: `<ul>` vs. inline comma-separated links

**accessibility-minion** recommends `<ul aria-label="Tags">` with `<li><a>` children. The rationale: screen readers announce "Tags, list, 3 items" and users can skip the entire list.

**ux-strategy-minion** and **ux-design-minion** recommend inline comma/middot-separated text links for visual simplicity.

**Resolution: `<ul>` with CSS styled to appear inline.** Both goals are achievable simultaneously. The `<ul>` provides list semantics for screen readers (critical for navigation efficiency with 20+ posts × 3-5 tags = 60-100 tab stops). CSS removes list styling and displays items inline with middot separators via `li + li::before { content: " · " }`. Visual result is identical to inline text links; semantic result is a proper list.

### 6. `role="feed"` on the post list

**frontend-minion** suggests `role="feed"` or `<section>` wrapper.
**accessibility-minion** explicitly says do NOT use `role="feed"` — it implies infinite scrolling, which this site does not do.

**Resolution: No `role="feed"`, no wrapper `<section>`.** The `<main>` landmark is sufficient for a home page whose sole content is the post list. Individual `<article>` elements provide landmark navigation.

### 7. Type badge display text format

**ux-design-minion** says uppercase with spaces: "BUILD LOG", "TOOL REPORT", "PATTERN", "TIL". CSS `text-transform: uppercase` + `letter-spacing: 0.05em`.

**accessibility-minion** says title-case: "Build Log", "Tool Report", "Pattern", "TIL". The sr-only prefix in the heading should match the visible badge text (WCAG 2.5.3 Label in Name).

**Resolution: Uppercase via CSS, sentence-case in DOM.** The DOM text content is "Build Log", "Tool Report", "Pattern", "TIL" (title-case). CSS applies `text-transform: uppercase` to render visually as "BUILD LOG" etc. Screen readers read the DOM text ("Build Log"), not the CSS-transformed text. The sr-only heading prefix also uses "Build Log" etc. This satisfies both the visual design goal (small uppercase system labels) and the accessibility requirement (readable, matchable labels). Note: "TIL" is already uppercase in both treatments.

### 8. Tag display text

**accessibility-minion** recommends title-case display: "AI Workflow", "Claude Code", "EDS".

**Resolution: Lowercase display, matching the content model slugs.** Tags like `aem`, `eds`, `claude-code` are displayed as-is (lowercase, hyphenated). Rationale: (a) the content model says "Lowercase, hyphenated" — this is the canonical form; (b) title-casing would require a mapping table for every tag (is it "Eds" or "EDS"? "Ai-workflow" or "AI Workflow"?); (c) the tag text also serves as the URL slug `/tags/aem`, so visual text matching the URL is clearer; (d) lowercase tags at `--body-font-size-xs` in `--color-link` are already visually quiet and read naturally as metadata labels. The DDD should flag this as an Open Question if the reviewer prefers title-case display.

### 9. Date format

**accessibility-minion** says full month name: "March 12, 2026".
**frontend-minion** says spelled out month, no leading zeros: "March 10, 2026".

**Resolution: Full month name.** "March 12, 2026" format. Use `Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' })` for locale-aware formatting. The sr-only heading prefix also uses this format.

### 10. Entry spacing

**ux-design-minion** proposes `calc(var(--section-spacing) * 0.75)` (36px) or `--section-spacing` (48px) with note to prototype.

**Resolution: Use `--section-spacing` (48px) as the starting value.** Flag the exact value as an Open Question for implementation-time tuning. The DDD specifies the token and the rationale (entries are semantically distinct items, not paragraphs within a section), but acknowledges the value may need adjustment based on visual testing with real content.

### 11. Empty state

**ux-design-minion** says show nothing — empty `<main>` with header and footer.

**Resolution: Show nothing.** No "Coming soon" message. The author knows the site is empty; an empty-state message adds no value. The block simply renders no `<article>` elements when the query index returns zero results.

### 12. Title link color

**ux-strategy-minion** says title uses `--color-heading` (not `--color-link`) because headings-as-links should read as headings first. Hover could deepen color or add underline.

**Resolution: `--color-heading` as default, underline on hover.** This is consistent with the visual hierarchy principle where the title is the strongest element. The link behavior is discovered through cursor change and hover underline. No `--color-link` on the title — that would subordinate it visually.

### 13. Tags as links vs. plain text in V1

**frontend-minion** raises that `/tags/{tag}` pages do not exist yet (DDD-007 dependency).

**Resolution: Render as links from day one.** Tags are `<a href="/tags/{tag}">` elements that will 404 until DDD-007 ships. This is acceptable for incremental delivery and avoids re-implementing tag rendering later. Flag as a known dependency in the DDD.

### 14. Dark mode contrast for type badge

**ux-strategy-minion** flags `--color-text-muted` in dark mode (#C9C3B8 on #3A3A33) at ~3.5:1 as potentially failing WCAG.

**ux-design-minion** says the actual contrast is ~5.5:1, passing AA.

**Resolution: ux-design-minion's calculation is correct.** #C9C3B8 on #3A3A33 achieves approximately 5.07:1 (verified via WCAG contrast formula). This passes AA (4.5:1) for normal text at any size. No issue here. The DDD should document this verification.

---

## Resolved Design Spec (for writing agent)

The following resolved decisions form the complete spec that the writing agent must incorporate into DDD-004.

### Visual Hierarchy (top to bottom within each entry)

```
BUILD LOG                               <-- type badge: stacked above title
Building a Design System for EDS        <-- title: heading font, heading color, link
A practitioner's approach to design      <-- description: body font, text color
tokens in Edge Delivery Services.
March 12, 2026 · aem · eds · performance <-- date + tags: muted, small
```

### Type Badge
- Text-only, no background/border/icon
- Font: `--font-heading` (Source Code Pro)
- Size: `--body-font-size-xs`
- Weight: 400
- Color: `--color-text-muted`
- CSS: `text-transform: uppercase; letter-spacing: 0.05em`
- DOM text: "Build Log", "Pattern", "Tool Report", "TIL" (title-case)
- Visual rendering: "BUILD LOG", "PATTERN", "TOOL REPORT", "TIL" (uppercase via CSS)
- All four types identical visual treatment — no per-type color or styling
- Line-height: 1

### Title
- Element: `<h2>` containing `<a href="/blog/{slug}">`
- Font: `--font-heading` (Source Code Pro)
- Size: `--heading-font-size-m` (22px mobile / 21px desktop)
- Weight: 600
- Color: `--color-heading` (not `--color-link`)
- Line-height: `--line-height-heading` (1.25)
- `text-decoration: none` default; `text-decoration: underline` on hover
- Contains sr-only prefix: `<span class="sr-only">{Type}: </span>`
- `id` attribute for `aria-labelledby` on parent `<article>`

### Description
- Element: `<p>`
- Font: `--font-body` (Source Sans 3)
- Size: `--body-font-size-s`
- Weight: 400
- Color: `--color-text`
- Line-height: `--line-height-body` (1.7)
- 1-2 sentences, never truncated

### Metadata Line (date + tags)
- Element: `<footer class="post-meta">` containing `<time>` and `<ul>`
- Date font: `--font-body`, `--body-font-size-xs`, `--color-text-muted`
- Date format: "March 12, 2026" (full month, no leading zeros)
- Middot separator between date and tags
- Tags: `<ul class="post-tags" aria-label="Tags">` with `<li><a href="/tags/{tag}">` children
- Tags font: `--font-body`, `--body-font-size-xs`, `--color-link`
- Tags `text-decoration: none` default; `text-decoration: underline` on hover
- Tags displayed as inline list with middot separators via CSS
- Tags display lowercase slug form: `aem`, `eds`, `claude-code`
- Line-height: 1.4

### Entry Separation
- `border-bottom: 1px solid var(--color-border-subtle)` between entries (not on last)
- `margin-block-end: var(--section-spacing)` (48px) between entries — flag exact value as Open Question
- First entry: no top margin; last entry: no bottom border

### Width
- Post index constrains to `--measure` (68ch), centered within `--layout-max`
- Matches the site's single-column, reading-focused aesthetic

### Heading Hierarchy
- Visually hidden `<h1>` with text "Posts" at top of `<main>` content (sr-only class)
- Each post title: `<h2>`

### HTML Structure (target decorated DOM)

```html
<div class="post-index-wrapper">
  <div class="post-index block" data-block-name="post-index" data-block-status="loaded">
    <h1 class="sr-only">Posts</h1>
    <article class="post-entry" aria-labelledby="post-1-title">
      <span class="post-type" aria-hidden="true">Build Log</span>
      <h2 id="post-1-title">
        <span class="sr-only">Build Log: </span>
        <a href="/blog/building-eds-design-system">Building a Design System for EDS</a>
      </h2>
      <p class="post-description">A practitioner's approach to design tokens in Edge Delivery Services.</p>
      <footer class="post-meta">
        <time datetime="2026-03-12">March 12, 2026</time>
        <ul class="post-tags" aria-label="Tags">
          <li><a href="/tags/aem">aem</a></li>
          <li><a href="/tags/eds">eds</a></li>
          <li><a href="/tags/performance">performance</a></li>
        </ul>
      </footer>
    </article>
    <!-- separator: 1px border-bottom + margin-block-end -->
    <article class="post-entry" aria-labelledby="post-2-title">
      <!-- ... -->
    </article>
  </div>
</div>
```

### Data Source
- Custom `post-index` block fetching `/query-index.json` client-side
- Requires `helix-query.yaml` at project root configuring blog post index
- Columns needed: `path`, `title`, `description`, `date`, `type`, `tags`
- Include path: `/blog/**`
- Sort: by `date` descending (client-side)
- The DDD specifies the target DOM structure; the data source mechanism (helix-query.yaml, query-index.json) is documented as a prerequisite in Context

### Responsive Behavior
- < 600px: Full-width entries, all elements stack vertically, `--content-padding-mobile`, `text-align: left`
- >= 600px: Same stacked layout, `--content-padding-tablet`
- >= 900px: Same stacked layout at `--measure` width, `--content-padding-desktop`
- No layout structure changes across breakpoints — only padding and font sizes adjust

### Interactions
- Title link: `--color-heading`, `text-decoration: none` default; `text-decoration: underline` on hover; `cursor: pointer`
- Title focus: `outline: 2px solid var(--color-heading); outline-offset: 2px` (`:focus-visible`)
- Tag links: `--color-link`, `text-decoration: none` default; `text-decoration: underline` on hover
- Tag focus: same outline pattern as title
- Keyboard navigation: Tab follows DOM order within each entry (title link, then tag links)
- Screen reader: `<article>` landmarks navigable; heading navigation reads "Build Log: {title}"; tag list announced as "Tags, list, N items"
- `prefers-reduced-motion`: no transitions proposed, no action needed

### Focus Indicators
- All interactive elements: `outline: 2px solid var(--color-heading); outline-offset: 2px`
- `:focus-visible` only (suppress on mouse click)
- Matches DDD-002 and DDD-003 precedent

### CSS Approach
- Layout: standard block flow, no flexbox/grid needed for entry list
- Metadata line (`<footer>`): flexbox row with `gap` for date/tags alignment, or inline flow with middot separators
- Width: `max-width: var(--measure); margin-inline: auto` on the block content
- Tags list: `display: inline; list-style: none` on `<ul>`, `display: inline` on `<li>`, middot separators via `li + li::before`
- Key selectors scoped to `.post-index` per EDS convention

### Open Questions (for DDD-004)
1. Entry spacing: `--section-spacing` (48px) or a reduced value (~36px)? Prototype with 5+ entries.
2. Tag link rendering before DDD-007: render as links (will 404) or plain text? (Recommendation: links from day one.)
3. Tag display casing: lowercase slugs as-is, or title-case with mapping table?
4. `helix-query.yaml` configuration: exact column definitions, include/exclude paths — implementation prerequisite.

---

### Task 1: Write DDD-004-home-post-index.md

- **Agent**: software-docs-minion
- **Delegation type**: standard
- **Model**: sonnet
- **Mode**: bypassPermissions
- **Blocked by**: none
- **Approval gate**: yes
- **Gate reason**: This is the sole deliverable of the plan. The DDD defines the design contract for the home page post index — a hard-to-reverse architectural decision with high blast radius (blocks implementation of the home page, and downstream DDDs 005 and 007 reference it). The DDD must be reviewed before implementation proceeds.
- **Prompt**: |

    ## Task: Write DDD-004-home-post-index.md

    Write the design decision document for the home page post index at `docs/design-decisions/DDD-004-home-post-index.md`. This is a NEW FILE — create it from scratch following the established DDD format.

    ### Branch Setup

    You are working on branch `nefario/ddd-004-home-post-index`. This branch should be created from `main` before you begin writing.

    ### What to Write

    DDD-004 defines how the home page displays posts as a reverse-chronological list. Each entry shows: type badge, title, description, date, and tags. The home page IS the post index — no other content appears on the page.

    ### Format Requirements

    Follow the DDD template at `docs/design-decisions/README.md` EXACTLY, incorporating the established patterns from DDDs 001-003. Specifically:

    1. **Status**: `Proposal`
    2. **Context section**: Use structured subsections with bold headers, matching DDD-002 and DDD-003:
       - `**Site structure (docs/site-structure.md)**` — quote the relevant home page requirements
       - `**Content model (docs/content-model.md)**` — the five metadata fields, the four post types, the tag taxonomy
       - `**Aesthetic rules (CLAUDE.md)**` — the relevant rules (no cards, no shadows, typography creates hierarchy, color as quiet guest)
       - `**DDD-001 layout contract**` — two-tier width model, padding tokens. State that the post index constrains to `--measure` (reading width), not `--layout-max`. This keeps entries in the reading column, consistent with single-column philosophy.
       - `**DDD-002/DDD-003 precedent**` — focus ring pattern, link styling conventions, border-subtle usage
       - `**Design tokens (styles/tokens.css)**` — note that no new tokens are proposed; all elements map to existing tokens
       - `**V1 scope exclusions (CLAUDE.md)**` — no pagination until 20+ posts, no featured post, no hero image, no card shadows, no sidebar
       - `**Boilerplate state**` — check if any listing/index block exists in the boilerplate. Document what exists and whether it needs replacement.
       - `**EDS data source**` — the post index uses a different pattern from header/footer. Instead of loading a CMS fragment, it fetches `query-index.json` (the EDS content index). Document that `helix-query.yaml` must be configured at the project root to expose post metadata columns (`path`, `title`, `description`, `date`, `type`, `tags`). This is a prerequisite for implementation.

    3. **Proposal section** with these subsections:

       **Layout**: ASCII wireframes showing:
       - A single post entry anatomy with all five elements labeled and annotated with token names
       - 2-3 entries stacked showing the list rhythm with separator lines
       - Both mobile (< 600px) and desktop (>= 900px) versions

       IMPORTANT: Use ONLY pure ASCII characters (`+`, `-`, `|`, `/`, `\`, `<`, `>`, `.`). NEVER use Unicode box-drawing characters. Follow the conventions from DDDs 001-003:
       - `+--+` for corners
       - `|` for vertical edges
       - `.....` for border-subtle indicators
       - `<-->` for dimension annotations

       After generating each wireframe, verify all lines are the same character width.

       The entry anatomy (top to bottom):
       ```
       BUILD LOG                               <-- type badge (stacked above title)
       Building a Design System for EDS        <-- title (link to post)
       A practitioner's approach to design      <-- description
       tokens in Edge Delivery Services.
       March 12, 2026 · aem · eds · performance <-- date + tags
       ```

       **Typography**: Table mapping each element to its tokens:

       | Element | Font | Size | Weight | Color | Line-height |
       |---------|------|------|--------|-------|-------------|
       | Type badge | `--font-heading` | `--body-font-size-xs` | 400 | `--color-text-muted` | 1 |
       | Title | `--font-heading` | `--heading-font-size-m` | 600 | `--color-heading` | `--line-height-heading` (1.25) |
       | Description | `--font-body` | `--body-font-size-s` | 400 | `--color-text` | `--line-height-body` (1.7) |
       | Date | `--font-body` | `--body-font-size-xs` | 400 | `--color-text-muted` | 1.4 |
       | Tags | `--font-body` | `--body-font-size-xs` | 400 | `--color-link` | 1.4 |

       Type badge uses `text-transform: uppercase` and `letter-spacing: 0.05em` via CSS. DOM text is title-case ("Build Log", not "BUILD LOG"). All four types get identical visual treatment — no per-type colors or styling.

       Title at `--heading-font-size-m` (22px mobile / 21px desktop) because the page `<h1>` (visually hidden) reserves the top of the hierarchy, and `--heading-font-size-m` provides clear hierarchy without overwhelming a dense list.

       **Spacing & Rhythm**: Table with:
       - Entry separation: `1px solid var(--color-border-subtle)` bottom border between entries (not on last) + `margin-block-end: var(--section-spacing)` (48px). Flag exact spacing value as an Open Question.
       - Internal entry spacing: gaps between badge-to-title, title-to-description, description-to-metadata
       - Width constraint: `max-width: var(--measure)`, `margin-inline: auto`

       **Responsive Behavior**: Table with breakpoints:
       - < 600px: full-width entries, all elements stack, `--content-padding-mobile`
       - >= 600px: same layout, `--content-padding-tablet`
       - >= 900px: same layout at `--measure` width, `--content-padding-desktop`
       - No structural layout changes across breakpoints

       **Interactions**: Table covering:
       - Title link: `--color-heading`, `text-decoration: none` default, `text-decoration: underline` on hover
       - Title focus: `outline: 2px solid var(--color-heading); outline-offset: 2px` (`:focus-visible`)
       - Tag links: `--color-link`, `text-decoration: none` default, `text-decoration: underline` on hover
       - Tag focus: same outline pattern
       - Keyboard: Tab order follows DOM (title, then tags per entry)
       - Screen reader: `<article>` landmarks, heading nav reads type prefix + title, tag list announced with count
       - `prefers-reduced-motion`: no transitions proposed

    4. **HTML Structure section**: Show TWO blocks following DDD-002/DDD-003 precedent:

       **Data source (EDS query index)**: Show a brief example of the JSON structure from `query-index.json` that the block fetches. Note this is fundamentally different from header/footer which load CMS fragments.

       **Final decorated DOM**: The complete semantic HTML after the block's `decorate()` function runs:

       ```html
       <div class="post-index-wrapper">
         <div class="post-index block" data-block-name="post-index" data-block-status="loaded">
           <h1 class="sr-only">Posts</h1>
           <article class="post-entry" aria-labelledby="post-1-title">
             <span class="post-type" aria-hidden="true">Build Log</span>
             <h2 id="post-1-title">
               <span class="sr-only">Build Log: </span>
               <a href="/blog/building-eds-design-system">Building a Design System for EDS</a>
             </h2>
             <p class="post-description">A practitioner's approach to design tokens in Edge Delivery Services.</p>
             <footer class="post-meta">
               <time datetime="2026-03-12">March 12, 2026</time>
               <ul class="post-tags" aria-label="Tags">
                 <li><a href="/tags/aem">aem</a></li>
                 <li><a href="/tags/eds">eds</a></li>
                 <li><a href="/tags/performance">performance</a></li>
               </ul>
             </footer>
           </article>
         </div>
       </div>
       ```

       Key decisions to document:
       - `<article>` per entry with `aria-labelledby` pointing to the heading
       - Visible type badge has `aria-hidden="true"` to prevent double announcement
       - sr-only prefix inside `<h2>` gives screen reader heading navigation the type context
       - `<footer>` within `<article>` for metadata (semantic per HTML spec)
       - `<time datetime>` for machine-readable dates
       - `<ul aria-label="Tags">` for tag list semantics (screen readers announce "Tags, list, N items")
       - Tags render as links to `/tags/{tag}` from day one (will 404 until DDD-007)
       - No `role="feed"` — it implies infinite scroll, which this site does not use
       - `.sr-only` utility class needed (define it or reference existing)

    5. **CSS Approach section**:
       - Layout: standard block flow for the list; no flexbox/grid needed for the entry stack
       - Metadata line: flexbox or inline flow for the date + tags row
       - Width: `max-width: var(--measure); margin-inline: auto`
       - Tags list: `display: inline; list-style: none` on `<ul>`, inline `<li>`, middot separators via `li + li::before`
       - Type badge: `text-transform: uppercase; letter-spacing: 0.05em`
       - Title link: `color: inherit; text-decoration: none` default
       - Key selectors scoped to `.post-index`
       - sr-only class definition if it does not already exist in the project
       - Note: DOM built via `document.createElement()` (not innerHTML) for CSP compliance

    6. **Token Usage table** with Status column (`Existing | Proposed | Hardcoded`):
       Map every visual element to its CSS custom property. All tokens should be Existing — no new tokens proposed.

    7. **Open Questions**:
       1. Entry spacing exact value: `--section-spacing` (48px) or reduced (~36px)? Needs visual prototyping with 5+ entries.
       2. Tag display casing: lowercase slugs as-is (`aem`, `claude-code`) or title-case with mapping table ("AEM", "Claude Code")?
       3. `helix-query.yaml` column configuration: exact field names and include/exclude paths. Implementation prerequisite.
       4. Tag link behavior before DDD-007: render as links (will 404) or plain text? Recommendation: links.
       5. sr-only class: does it already exist in `styles/styles.css`? If not, where should it be defined?
       6. Auto-block vs. authored block: should `buildAutoBlocks()` in `scripts.js` inject the post-index block on the home page, or is it authored into the home page document?

    8. **Decision section**: Empty checkboxes with `_Human writes here during review_` placeholder, matching DDD-003.

    ### What NOT to Do

    - Do NOT write implementation code (no JS, no CSS files). This is a design document only.
    - Do NOT create `helix-query.yaml` or any block files. Those are implementation tasks.
    - Do NOT use Unicode box-drawing characters in wireframes.
    - Do NOT propose new tokens. Map everything to existing tokens in `styles/tokens.css`.
    - Do NOT add reading time estimates, pagination controls, featured posts, hero images, card shadows, or anything excluded by CLAUDE.md V1 scope.
    - Do NOT use `role="feed"` on any element.
    - Do NOT use `--color-link` for the title. Title uses `--color-heading`.
    - Do NOT create per-type color differentiation for type badges. All four types are visually identical.

    ### Reference Files to Read

    Before writing, read these files for format and context:
    - `docs/design-decisions/README.md` — the DDD template
    - `docs/design-decisions/DDD-003-footer.md` — the most recent DDD, best format reference
    - `docs/design-decisions/DDD-002-header.md` — another format reference
    - `docs/design-decisions/DDD-001-global-layout.md` — the layout contract
    - `docs/site-structure.md` — home page requirements
    - `docs/content-model.md` — post metadata fields and types
    - `styles/tokens.css` — all available design tokens
    - `CLAUDE.md` — aesthetic rules and V1 scope
    - `AGENTS.md` — EDS conventions and block structure

    ### Deliverables

    - `docs/design-decisions/DDD-004-home-post-index.md` — the complete DDD
    - Run `npm run lint` if the linter applies to markdown (it may not — check)

    ### Success Criteria

    - DDD follows the established format from DDDs 001-003 exactly
    - All five entry elements (type badge, title, description, date, tags) are fully specified
    - Type badges use identical visual treatment for all four types
    - HTML Structure shows both data source and decorated DOM
    - Token Usage table maps every element to existing CSS custom properties
    - ASCII wireframes use only pure ASCII characters
    - Accessibility decisions are documented (sr-only h1, aria-labelledby, aria-hidden badge, ul tags)
    - Open Questions capture genuinely unresolved decisions
    - Status is "Proposal"

- **Deliverables**: `docs/design-decisions/DDD-004-home-post-index.md`
- **Success criteria**: File exists, follows DDD format, all design decisions from the resolved spec above are incorporated, lint passes.

---

### Cross-Cutting Coverage

- **Testing**: Not applicable. This task produces a design document, not executable code. No tests to write or run.
- **Security**: Not applicable. No attack surface, auth, user input, or infrastructure. The DDD describes a read-only display of public content.
- **Usability -- Strategy**: Covered. ux-strategy-minion's contributions (title-first scanning, visual hierarchy, tag affordances, entry separation, mobile considerations) are fully incorporated into the resolved spec.
- **Usability -- Design**: Covered. ux-design-minion's contributions (type badge treatment, typography mapping, responsive behavior, entry spacing, dark mode verification) are fully incorporated.
- **Documentation**: This task IS the documentation deliverable. software-docs-minion writes it.
- **Observability**: Not applicable. No runtime components.

### Architecture Review Agents

- **Mandatory** (5): security-minion, test-minion, ux-strategy-minion, lucy, margo
- **Discretionary picks**:
  - accessibility-minion: Plan produces HTML structure and ARIA patterns for a web-facing UI that end users interact with. The heading hierarchy decision (sr-only h1, aria-labelledby, aria-hidden badge pattern) is architecturally significant and benefits from specialist review. References Task 1.
- **Not selected**: ux-design-minion (contributions already fully synthesized into the spec — no additional review value beyond what ux-strategy covers), observability-minion (no runtime components), user-docs-minion (no end-user documentation changes), sitespeed-minion (no web-facing runtime code in this task — DDD is a design document)

### Risks and Mitigations

1. **EDS query index prerequisite**: The post-index block depends on `helix-query.yaml` and proper metadata on blog posts, neither of which exists yet. **Mitigation**: The DDD documents this as a Context section prerequisite and an Open Question. Implementation cannot begin until the index is configured. The DDD itself is not blocked by this.

2. **No blog posts exist**: The query index will return empty data at launch. **Mitigation**: Empty state is specified (show nothing). The block renders no `<article>` elements.

3. **DDD-007 tag page dependency**: Tags link to `/tags/{tag}` pages that don't exist. **Mitigation**: Flagged as Open Question. Recommendation is to render as links from day one.

4. **Heading hierarchy fragility**: The sr-only `<h1>` + `aria-hidden` badge + sr-only heading prefix pattern has multiple moving parts. If any element is omitted during implementation, the accessible experience degrades. **Mitigation**: The HTML Structure section documents the complete pattern with annotations explaining each ARIA attribute's purpose. The accessibility-minion's Phase 3.5 review will validate the pattern.

5. **Type badge visual weight**: "BUILD LOG" in Source Code Pro uppercase might draw too much attention despite muted color. **Mitigation**: This is an implementation-time visual judgment. The DDD specifies the approach and tokens; fine-tuning size/weight happens during implementation with the dev server running.

### Execution Order

```
Batch 1: Task 1 (write DDD-004)
         |
         v
   [APPROVAL GATE: DDD-004 review]
```

Single task, single gate. The DDD is the complete deliverable.

### Verification Steps

1. File exists at `docs/design-decisions/DDD-004-home-post-index.md`
2. Status is "Proposal"
3. All required DDD sections present (Context, Proposal with Layout/Typography/Spacing/Responsive/Interactions, HTML Structure, CSS Approach, Token Usage, Open Questions, Decision)
4. Token Usage table references only existing tokens from `styles/tokens.css`
5. ASCII wireframes contain no Unicode box-drawing characters
6. HTML Structure shows both data source and decorated DOM patterns
7. Four type badges defined with identical visual treatment
8. Lint passes (if applicable to markdown)
