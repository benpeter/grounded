# Task: Author DDD-005-post-detail.md

You are writing the Design Decision Document for the post detail page of the Mostly Hallucinations blog (benpeter.dev). This is the reading experience for individual blog posts at `/blog/{slug}`.

## Output

Write to: `docs/design-decisions/DDD-005-post-detail.md`
Status: **Proposal**
Follow the DDD template exactly as defined in `docs/design-decisions/README.md`.

## Template Sections (all required unless marked optional)

The DDD must include these sections in order: Context, Proposal (Layout, Typography, Spacing & Rhythm, Responsive Behavior, Interactions), HTML Structure, CSS Approach, Token Usage, Open Questions, Decision.

## Context Section

Reference and summarize the governing constraints from:
- CLAUDE.md aesthetic rules (warm white paper, typography-driven hierarchy, gold appears once per screen max, no cards/shadows/gradients)
- docs/site-structure.md Single Post specification
- docs/content-model.md (post types, all metadata fields including `updated`, `series`, `series-part`)
- DDD-001-global-layout.md (two-tier width model, `--measure` reading column, section spacing, code block escape hatch)
- DDD-004-home-post-index.md (precedent for type badge pattern, metadata line, a11y patterns)
- styles/tokens.css (all referenced tokens)
- V1 scope exclusions from CLAUDE.md (no RSS, search, comments, newsletter, analytics, dark mode toggle, pagination, related posts, sidebar)

## Proposal Section

### Layout

Provide ASCII wireframes (pure ASCII characters only: `+`, `-`, `|`, `/`, `\`, `<`, `>`, `^`, `v` -- never Unicode box-drawing) for:

1. **Post header (h1 + metadata) + opening paragraph** at mobile (< 600px) and desktop (>= 900px)
2. **h2 + paragraph + code block + paragraph** sequence
3. **h2 immediately followed by h3 + paragraph** (heading-to-heading transition)
4. **Paragraph + pull-quote + paragraph** sequence
5. **Paragraph + list + paragraph** sequence

Annotate wireframes with token names. Verify all lines are equal character width per CLAUDE.md ASCII diagram rules.

### Typography

Create a typography table covering every text element that can appear on a post detail page:

| Element | Font | Size token | Weight | Color token | Line-height |
|---------|------|-----------|--------|-------------|-------------|

Elements to cover:
- **h1 (post title)**: `--font-heading`, `--heading-font-size-xxl` (48px/42px), weight 600, `--color-heading`, `--line-height-heading` (1.25)
- **h2**: `--font-heading`, `--heading-font-size-xl` (36px/32px), weight 600, `--color-heading`
- **h3**: `--font-heading`, `--heading-font-size-l` (28px/26px), weight 600, `--color-heading`
- **h4/h5/h6**: Explicitly prohibited in post content. Document this as a content constraint, not just a styling gap.
- **Body paragraphs**: `--font-body`, `--body-font-size-m` (20px/18px), 400, `--color-text`, `--line-height-body` (1.7)
- **Type badge**: `--font-heading`, `--body-font-size-xs` (15px/14px), 400, `--color-text-muted`, uppercase via CSS (`text-transform: uppercase; letter-spacing: 0.05em`). DOM text is title-case ("Build Log"). Identical treatment to DDD-004.
- **Date/updated date**: `--font-body`, `--body-font-size-xs`, 400, `--color-text-muted`
- **Tags**: `--font-body`, `--body-font-size-xs`, 400, `--color-link`
- **Inline code**: `--font-code`, `0.9em` relative to parent, `--color-text`, background `--color-background-soft`, padding `0.15em 0.3em`, border-radius `2px`
- **Code blocks (`<pre>`)**: `--font-code`, `--body-font-size-s` (17px/16px), `--color-text`, background `--color-background-soft`
- **Blockquote text**: `--font-body`, `--body-font-size-m`, 400, `--color-text` (same as body -- blockquotes are cited content)
- **Pull-quote text**: `--font-editorial` (Source Serif 4), `--heading-font-size-m` (22px/21px), 400, `--color-text`, line-height 1.5
- **List items**: inherit body typography
- **Body links**: `--color-link`, `text-decoration: underline` by default (not just on hover -- WCAG 1.4.1 requires links distinguishable by more than color alone). Hover: `--color-link-hover`, underline persists.
- **Table header**: `--font-body`, `--body-font-size-s`, weight 600, `--color-text`
- **Table data**: `--font-body`, `--body-font-size-s`, 400, `--color-text`

### Spacing & Rhythm

Document every element-to-element transition. Use this exact table:

| Transition | Value | Token/Selector | Notes |
|------------|-------|---------------|-------|
| h1 above | 0 | — | Top of article |
| h1 below | 0 | — | Spacing controlled by metadata block |
| Metadata above (from h1) | 0.75em | `.post-meta` margin-top | Tight to title |
| Metadata below (to first body) | 2em | `.post-meta` margin-bottom | Breath before reading |
| h2 above | 2em | scoped to post context | Major section break |
| h2 below | 0.5em | scoped to post context | Pulls toward its content |
| h3 above | 1.5em | scoped to post context | Subsection break |
| h3 below | 0.5em | scoped to post context | Same pull as h2 |
| h2 + h3 (adjacent) | 0.25em on h3 | `h2 + h3` selector | Collapses when adjacent |
| p above | 1em | `--space-paragraph` | Standard rhythm |
| p below | 0 | — | Next element's top handles gap |
| pre above | 1.5em | `--space-element` | Symmetric |
| pre below | 1.5em | `--space-element` | Symmetric |
| blockquote above/below | 1.5em | `--space-element` | Same as code blocks |
| Pull-quote above/below | 2em | — | Breathing moment |
| ul/ol above/below | 1em | `--space-paragraph` | Paragraph-level |
| li spacing | 0.35em bottom | — | Items remain distinct |
| hr | 2em above/below | — | Short centered rule |
| table above/below | 1.5em | `--space-element` | Same as code blocks |

**CRITICAL**: Current `styles.css` uses `margin-top: 0.8em; margin-bottom: 0.25em` for ALL headings. DDD-005 overrides must be scoped to post detail context. Global heading margins in `styles.css` must remain unchanged.

### Responsive Behavior

No structural layout changes. Content is always single-column within `--measure`. Only padding and font sizes adjust via tokens.css breakpoint overrides. Document mobile/tablet/desktop padding values.

Note the mobile line-length concern: at 375px with 20px padding, blockquotes with 1.5em left padding reduce to ~34 chars. Acceptable for short blockquotes.

### Interactions

- Focus ring: `outline: 2px solid var(--color-heading); outline-offset: 2px` on `:focus-visible`
- Body links: underline default, color change on hover
- Tag links in metadata: Same as DDD-004 (no underline default, underline on hover). NOTE: Document that --color-link (#5A7543) against --color-text-muted (#6F6A5E) meets 3:1 contrast ratio requirement for non-underlined links per WCAG 1.4.1, or note if verification is needed.
- Code block keyboard scrolling: `tabindex="0"` on `<pre>` elements
- Dark mode: `prefers-color-scheme: dark` token swaps handle automatically

## HTML Structure

Define complete semantic HTML after EDS decoration + JS enhancement. Include:

1. `<article aria-labelledby="post-title">` wrapper (must be added via JS — EDS doesn't produce natively)
2. `<header class="post-header">` for metadata (not `<footer>` — introductory content per HTML spec)
3. Type badge: visible badge `aria-hidden="true"`, sr-only prefix in `<h1>` matching DOM text exactly
4. Published + updated dates: both as `<time>` with `datetime`. Updated span absent from DOM when no updated date.
5. Pull-quote: `<figure class="pull-quote" aria-hidden="true"><blockquote>` — visual-only device, content MUST exist elsewhere in body
6. Code blocks: `<pre tabindex="0"><code>` — no syntax highlighting V1, border-radius: 0
7. Blockquotes: require Quote block (authored as table in Google Docs), not default content
8. Heading hierarchy: h1 (one), h2, h3 only. h4+ explicitly prohibited.
9. `decorateButtons()` side effect: document that standalone links as sole child of paragraph become buttons

## CSS Approach

Focus on design intent and key architectural decisions. Avoid over-specifying exact selectors — let the implementing agent choose:

1. Scoping strategy: post detail overrides must not break other surfaces (header, footer, index)
2. Heading margin overrides: global `h1-h6` margins in `styles.css` must NOT change
3. Code block: border-radius: 0 (override boilerplate 8px)
4. Blockquote styling (via Quote block CSS): standard vs pull-quote variant
5. Body links within article: underline by default (differs from global link style)
6. Inline code: background, padding, border-radius
7. Use `--space-paragraph` and `--space-element` tokens rather than hardcoded em values

## Token Usage Table

Map every visual element to its token. No new tokens — all values map to existing tokens in `tokens.css`. Note hardcoded values with rationale.

## Open Questions

Include these:
1. DDD-005 vs DDD-006 scope boundary
2. Mobile blockquote line length (34 chars at 375px)
3. Series navigation: clarify that series/series-part metadata is parsed but not rendered in V1 (pending dedicated series navigation DDD)
4. Syntax highlighting language convention for future Prism.js addition
5. Post-detail page detection mechanism (URL pattern vs metadata vs template)
6. 68ch measure is ~40-45 monospace chars for code

## What NOT to include

- No implementation code (JS or CSS)
- No RSS, search, comments, newsletter, analytics, dark mode toggle, pagination, related posts, sidebar
- No structured data (JSON-LD)
- No font loading strategy
- No dark mode token definitions

## Reference Files (read these before writing)

- `docs/design-decisions/README.md` — DDD template format
- `docs/design-decisions/DDD-001-global-layout.md` — layout contract
- `docs/design-decisions/DDD-004-home-post-index.md` — precedent for a11y patterns
- `docs/content-model.md` — post types, metadata fields
- `docs/site-structure.md` — single post spec
- `styles/tokens.css` — all design tokens
- `styles/styles.css` — current global styles (check heading margin values)
- `CLAUDE.md` — aesthetic rules, V1 scope exclusions

## Quality Checks

Before finalizing:
1. Every section from the DDD template (README.md) is present
2. Every token reference exists in `styles/tokens.css`
3. ASCII wireframes use only pure ASCII characters (no Unicode box-drawing)
4. All a11y patterns are consistent with DDD-004
5. Spacing values form a coherent scale
6. CSS approach specifies scoping strategy

When you finish, report:
- File path with change scope and line count
- 1-2 sentence summary of what was produced
