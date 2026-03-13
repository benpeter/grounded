# Phase 3: Synthesis — DDD-005 Post Detail

## Delegation Plan

**Team name**: ddd-005-post-detail
**Description**: Create DDD-005-post-detail.md — the design decision document defining the complete reading experience for individual blog posts.

### Task 1: Author DDD-005-post-detail.md
- **Agent**: ux-design-minion
- **Delegation type**: standard
- **Model**: opus
- **Mode**: default
- **Blocked by**: none
- **Approval gate**: yes
- **Gate reason**: This is the sole deliverable of the plan. It defines the visual contract for the primary content surface of the site — every post page. Downstream implementation (CSS, block JS) depends entirely on the decisions in this document. Hard to reverse once implemented; high blast radius across all post rendering.
- **Prompt**: |

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
    - **h4/h5/h6**: Explicitly prohibited in post content. Document this as a content constraint, not just a styling gap. If an author needs a fourth nesting level, the content should be restructured.
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
    | h1 (post title) above | 0 | — | Top of article, no margin above |
    | h1 (post title) below | 0 | — | Spacing controlled by metadata block |
    | Metadata block above (from h1) | 0.75em | `.post-meta` margin-top | Tight to title — part of same visual unit |
    | Metadata block below (to first body) | 2em | `.post-meta` margin-bottom | "Breath before reading" — largest gap except section spacing |
    | h2 above | 2em | scoped to post context | Major section break |
    | h2 below | 0.5em | scoped to post context | Pulls toward its content |
    | h3 above | 1.5em | scoped to post context | Subsection break (perceptibly less than h2's 2em) |
    | h3 below | 0.5em | scoped to post context | Same pull as h2 |
    | h2 + h3 (adjacent) | 0.25em on h3 | `h2 + h3` selector | Collapses when h3 immediately follows h2 |
    | p above | 1em | `--space-paragraph` | Standard paragraph rhythm |
    | p below | 0 | — | Bottom margin not needed (next element's top handles gap) |
    | pre (code block) above | 1.5em | `--space-element` | Symmetric — distinct element |
    | pre (code block) below | 1.5em | `--space-element` | Symmetric |
    | blockquote above | 1.5em | `--space-element` | Same rhythm as code blocks |
    | blockquote below | 1.5em | `--space-element` | Symmetric |
    | Pull-quote above | 2em | — | Breathing moment — more space than code/blockquote |
    | Pull-quote below | 2em | — | Symmetric breathing |
    | ul/ol above | 1em | `--space-paragraph` | Lists are paragraph-level elements |
    | ul/ol below | 1em | `--space-paragraph` | Lists continue paragraph rhythm |
    | li spacing | 0.35em bottom | — | Tighter than paragraphs but items remain distinct |
    | Nested list | 0.35em top, 0 bottom | — | Same inter-item rhythm |
    | List padding-left | 1.5em | — | Reduced from browser default ~40px |
    | hr | 2em above, 2em below | — | Short centered rule |
    | table above/below | 1.5em | `--space-element` | Same as code blocks |

    **CRITICAL**: The current `styles.css` uses `margin-top: 0.8em; margin-bottom: 0.25em` for ALL headings (h1-h6) and all block elements (p, ol, ul, pre, blockquote). DDD-005 proposes differentiated margins. The CSS Approach section MUST specify that these overrides are scoped to the post detail context (e.g., `.post-detail .default-content-wrapper h2` or equivalent). Global heading margins in `styles.css` must remain unchanged to avoid breaking header, footer, and post index blocks.

    ### Responsive Behavior

    The post detail has NO structural layout changes across breakpoints. Content is always single-column within `--measure`. Only padding and font sizes adjust (via tokens.css breakpoint overrides). Document:

    - Mobile (< 600px): `--content-padding-mobile` (20px), mobile font sizes
    - Tablet (>= 600px): `--content-padding-tablet` (24px)
    - Desktop (>= 900px): `--content-padding-desktop` (32px), desktop font sizes

    Note the mobile line-length concern: at 375px with 20px padding, 335px available. Blockquotes with 1.5em left padding reduce to ~308px (~34 chars). This is below comfortable reading but acceptable since blockquotes are short. Optionally note that reducing blockquote left-padding to 1em on mobile is a mitigation if needed.

    ### Interactions

    - **Focus ring**: `outline: 2px solid var(--color-heading); outline-offset: 2px` on `:focus-visible`. Same pattern as DDD-002/003/004.
    - **Body links**: `text-decoration: underline` default, `text-decoration: underline` + `color: var(--color-link-hover)` on hover. Focus ring as above.
    - **Tag links in metadata**: Same as DDD-004 (no underline default, underline on hover).
    - **Code block keyboard scrolling**: `tabindex="0"` on `<pre>` elements makes code blocks keyboard-scrollable for overflow content. Note tradeoff: adds extra tab stops in code-heavy posts, but without it keyboard users cannot scroll overflowing code (worse failure).
    - **Dark mode**: `prefers-color-scheme: dark` token swaps handle it automatically. Verify code block background contrast (`--color-background-soft` becomes `#3F5232` in dark mode).

    ## HTML Structure

    Define the complete semantic HTML after EDS decoration + JS enhancement:

    ```html
    <article aria-labelledby="post-title">
      <header class="post-header">
        <span class="post-type" aria-hidden="true">Build Log</span>
        <h1 id="post-title">
          <span class="sr-only">Build Log: </span>
          Building a Design System for EDS
        </h1>
        <div class="post-meta">
          <time datetime="2026-03-12">March 12, 2026</time>
          <!-- Only when updated field is present; absent from DOM otherwise -->
          <span class="post-updated">
            (Updated <time datetime="2026-03-15">March 15, 2026</time>)
          </span>
          <ul class="post-tags">
            <li><a href="/tags/aem">aem</a></li>
            <li><a href="/tags/eds">eds</a></li>
          </ul>
        </div>
      </header>
      <!-- article body: .default-content-wrapper sections from EDS -->
    </article>
    ```

    Key semantic decisions to document with rationale:

    1. **`<article>` wrapper**: EDS does not produce `<article>` natively. Must be added via JS decoration (wrap the page content on post detail pages). `aria-labelledby` references the h1 for screen reader landmark navigation.

    2. **`<header>` (not `<footer>`) for metadata**: On a post detail page, title + metadata are introductory content (HTML spec: `<header>` = introductory content for nearest sectioning ancestor). This is the correct semantic inversion from DDD-004 where index entry metadata is a `<footer>`. The `<header>` within `<article>` does NOT create a `banner` landmark (HTML spec limits implicit `banner` to `<header>` as direct child of `<body>`).

    3. **Type badge + sr-only prefix**: Visible badge `aria-hidden="true"`, sr-only prefix inside `<h1>` with text matching DOM text exactly ("Build Log: " not "BUILD LOG: ") per WCAG 2.5.3. Same pattern as DDD-004.

    4. **Published + updated dates**: Both as `<time>` with `datetime` attributes. "Updated" word in visible text makes relationship unambiguous (WCAG 1.3.1). No `aria-label` on `<time>` (would violate WCAG 2.5.3 Label in Name). Updated span completely absent from DOM when no updated date exists.

    5. **Pull-quote markup**:
    ```html
    <figure class="pull-quote" aria-hidden="true">
      <blockquote>
        <p>The practitioner's job is knowing which parts are grounded.</p>
      </blockquote>
    </figure>
    ```
    - `<figure>` (not `<aside>`) because pull-quotes are not tangential content. `<aside>` creates an extra `complementary` landmark cluttering screen reader navigation.
    - `aria-hidden="true"` because pull-quotes repeat content already in the article body. They are a purely visual device.
    - **Content rule**: Pull-quotes MUST only contain text that appears elsewhere in the article body. If the site later needs standalone callout quotes from external sources, those need a different pattern without `aria-hidden`.

    6. **Code blocks**:
    ```html
    <pre tabindex="0"><code>// code here</code></pre>
    ```
    - `tabindex="0"` for keyboard scrollability (WCAG 2.1.1).
    - No ARIA attributes needed — `<pre>` native semantics are well-supported.
    - No `role="code"` (unsupported).
    - No syntax highlighting in V1 (ship plain styled code, add Prism.js in `delayed.js` later).
    - `border-radius: 0` — override the boilerplate's 8px (site prohibits rounded containers).

    7. **Blockquotes**: EDS does NOT produce `<blockquote>` from default content. A "Quote" block (authored as a table in Google Docs) is required. Use the Quote block from Adobe's block collection pattern. Pull-quotes should be a variant: "Quote (pull-quote)". Document this authoring constraint clearly.

    8. **Heading hierarchy**: h1 (post title, exactly one), h2 (major sections), h3 (subsections). h4/h5/h6 explicitly prohibited. No skipped levels (WCAG 1.3.1).

    9. **`decorateButtons()` side effect**: Document that a standalone link as the sole child of a paragraph (where href differs from textContent) becomes a button via `aem.js`. Authors must embed links within sentence text to avoid unexpected button styling.

    ## CSS Approach

    Specify key architectural decisions:

    1. **Scoping strategy**: Post detail overrides (heading margins, body link underlines, code block border-radius) must be scoped to avoid breaking other surfaces. Recommend a `.post-detail` class on the article or page body, with selectors like `.post-detail h2`, `.post-detail h3`, etc. Alternatively, scope via `.default-content-wrapper` within a post-detail page template class.

    2. **Heading margin overrides**: The global `h1-h6 { margin-top: 0.8em; margin-bottom: 0.25em }` in `styles.css` must NOT be changed. Override within the post-detail scope only.

    3. **Code block override**: `border-radius: 0` on `pre` within post context (overriding boilerplate 8px if present).

    4. **Blockquote styling** (via Quote block CSS):
       - Standard: `border-left: 3px solid var(--color-border)`, `padding-left: 1.5em`, `margin-left: 0`
       - Pull-quote variant: `border-left: 3px solid var(--color-accent)`, `font-family: var(--font-editorial)`, `font-size: var(--heading-font-size-m)`, `line-height: 1.5`

    5. **Body links within article**: `text-decoration: underline` by default (not just on hover). This differs from the global link style and DDD-004 title links. Scope to article body content.

    6. **Inline code**: `background: var(--color-background-soft)`, `padding: 0.15em 0.3em`, `border-radius: 2px`, `font-size: 0.9em`.

    7. **Tables**: `border-collapse: collapse`, bottom borders only on `<td>` and `<th>`, header row 2px border, `--body-font-size-s` for data density. Horizontal scroll wrapper on mobile.

    8. **Horizontal rules**: `border: none; border-top: 1px solid var(--color-border-subtle)`, `margin: 2em auto`, `max-width: 30%`.

    9. **Token usage preference**: Use `--space-paragraph` and `--space-element` tokens in CSS rather than hardcoded `em` values. These tokens exist in `tokens.css` and are currently unused — this DDD should establish them as the canonical spacing references for post content.

    ## Token Usage Table

    Map every visual element to its token. No new tokens should be proposed — all values map to existing tokens in `tokens.css`. Note any hardcoded values with rationale (e.g., `0.05em` letter-spacing, `2px` inline code border-radius, `3px` quote border-width).

    ## Open Questions

    Include these:

    1. **DDD-005 vs. DDD-006 scope boundary**: The README surface inventory lists DDD-006 as "Typography & Code" depending on DDD-005. This DDD covers all typography and code styling within the post detail context. Should DDD-006 be dropped, or should it cover typography concerns that span multiple surfaces (e.g., global heading scale, font loading strategy)?

    2. **Mobile blockquote line length**: At 375px viewport, blockquotes with 1.5em left padding yield ~34 chars/line (below 45-char comfortable minimum). Accept the tradeoff (blockquotes are short) or reduce to 1em on mobile?

    3. **Series navigation**: `docs/content-model.md` defines `series` and `series-part` fields. `docs/site-structure.md` mentions "Series navigation (prev/next) when post belongs to a series." Should DDD-005 spec the series nav, or defer to a separate DDD?

    4. **Syntax highlighting language convention**: V1 ships without syntax highlighting. When added later (Prism.js in `delayed.js`), how will authors specify the language? EDS has no fenced code block mechanism. Options: auto-detection, content convention (language name as preceding paragraph), block variant. Document as a future consideration.

    5. **Post-detail page detection**: How does the JS decoration know it's on a post detail page (to add `<article>` wrapper, build post header from metadata)? Options: URL pattern matching (`/blog/*`), page template metadata, section metadata. This is an implementation detail but should be flagged.

    6. **68ch is tight for code**: ~40-45 monospace chars before scroll. Accept and recommend authors keep examples concise? Or allow code blocks to break out to a wider measure?

    ## What NOT to include

    - No implementation code (JS or CSS). This is a design spec, not implementation.
    - No RSS, search, comments, newsletter, analytics, dark mode toggle, pagination, related posts, sidebar (V1 exclusions).
    - No structured data (JSON-LD) — that's a separate implementation concern documented in `content-model.md`.
    - No font loading strategy — that's infrastructure, not design surface.
    - No dark mode token definitions — `tokens.css` handles dark mode via `prefers-color-scheme`.

    ## Reference Files (read these before writing)

    - `docs/design-decisions/README.md` — DDD template format
    - `docs/design-decisions/DDD-001-global-layout.md` — layout contract, width model, section spacing
    - `docs/design-decisions/DDD-004-home-post-index.md` — precedent for type badge, metadata, a11y patterns, entry anatomy
    - `docs/content-model.md` — post types, all metadata fields, taxonomy
    - `docs/site-structure.md` — single post page specification
    - `styles/tokens.css` — all design tokens (light, dark, desktop overrides)
    - `styles/styles.css` — current global styles (check for conflicts, note heading margin values)
    - `CLAUDE.md` — aesthetic rules, V1 scope exclusions, design token source of truth

    ## Quality Checks

    Before finalizing:
    1. Every section from the DDD template (README.md) is present
    2. Every token reference exists in `styles/tokens.css`
    3. ASCII wireframes use only pure ASCII characters (no Unicode box-drawing)
    4. All a11y patterns are consistent with DDD-004
    5. Spacing values form a coherent scale (no arbitrary numbers)
    6. CSS approach specifies scoping strategy to avoid global style conflicts

- **Deliverables**: `docs/design-decisions/DDD-005-post-detail.md`
- **Success criteria**:
    - Follows DDD template exactly (all required sections present)
    - Covers every content element that can appear on a post detail page
    - All token references map to existing values in `styles/tokens.css`
    - Spacing scale is internally consistent and documented in a single table
    - HTML structure includes complete a11y annotations (ARIA, sr-only, semantic elements)
    - Scoping strategy prevents conflicts with existing global styles
    - Pull-quote authoring contract is documented (Quote block variant in EDS)
    - ASCII wireframes are valid (pure ASCII, equal-width lines)

### Cross-Cutting Coverage

- **Testing**: Not applicable. This task produces a design document, not executable code. No tests needed.
- **Security**: Not applicable. No user input handling, authentication, or attack surface in a design document.
- **Usability -- Strategy**: Covered by the ux-design-minion prompt which integrates ux-strategy principles (reading rhythm, cognitive load, typography hierarchy). The post detail page is a single well-understood surface with clear user job-to-be-done (read a technical article). No separate ux-strategy consultation needed.
- **Usability -- Design**: This IS the ux-design task. The entire DDD is a design artifact.
- **Documentation**: The deliverable IS documentation. No separate documentation task needed.
- **Observability**: Not applicable. Design document, no runtime components.

### Architecture Review Agents

- **Mandatory** (5): security-minion, test-minion, ux-strategy-minion, lucy, margo
- **Discretionary picks**:
    - accessibility-minion: Plan includes detailed a11y markup patterns (aria-hidden pull-quotes, sr-only prefixes, tabindex on code blocks, semantic header/article structure). WCAG compliance of these patterns must be verified before the DDD is approved. References tasks: Task 1 HTML Structure section.
- **Not selected**: ux-design-minion (is the executing agent), frontend-minion (no code output), observability-minion (no runtime), sitespeed-minion (no web output), user-docs-minion (DDD is internal, not user-facing)

### Conflict Resolutions

1. **h1 size: xxl vs. xl**. ux-design-minion initially proposed `--heading-font-size-xl` (36px/32px) to avoid wrapping on long titles, then reversed to `--heading-font-size-xxl` (48px/42px) because h1 at xl would be the same size as h2, destroying size hierarchy. **Resolution**: Use `--heading-font-size-xxl`. The wrapping concern is real but the title appears once at the top. The 1.33x ratio between h1 (48px) and h2 (36px) creates clear hierarchy. This aligns with the existing global style in `styles.css` which already maps h1 to `--heading-font-size-xxl`.

2. **Inline code border-radius: 2px vs. 3px**. ux-design-minion proposed 2px, frontend-minion proposed 3px. Both are "functional, not decorative" exceptions to the no-rounded-containers rule. **Resolution**: Use 2px. More conservative, closer to the "no rounded containers" principle. The difference is imperceptible.

3. **List item spacing: 0.35em vs. 0.3em**. ux-design-minion proposed 0.35em, frontend-minion proposed 0.3em. **Resolution**: Use 0.35em. ux-design-minion provided the rationale (at 18px body, 0.35em = ~6px, enough daylight between items). The 0.05em difference is negligible but we follow the design lead.

4. **Pull-quote `aria-hidden`**: accessibility-minion initially suggested it, then confirmed. Both ux-design-minion and accessibility-minion agree pull-quotes are visual-only devices repeating existing body content. **Resolution**: `aria-hidden="true"` on the `<figure>` element. The DDD must clearly document that pull-quotes MUST only contain text that appears elsewhere in the article body.

5. **Quote block approach**: frontend-minion recommended a single "Quote" block with a "pull-quote" variant over a separate "pull-quote" block. ux-design-minion's pull-quote spec is compatible with either approach. **Resolution**: Single Quote block with variant. Keeps block count minimal, follows Adobe's block collection pattern.

### Risks and Mitigations

1. **Global styles.css heading margin conflict** (all specialists). Current CSS: `0.8em/0.25em` for all headings. DDD-005 proposes `2em/0.5em` for h2, `1.5em/0.5em` for h3. **Mitigation**: DDD must specify scoping strategy. Overrides apply only within post detail context. Global margins remain unchanged.

2. **EDS doesn't produce `<article>` wrapper** (accessibility-minion). **Mitigation**: DDD flags this as an implementation requirement — JS must wrap post content in `<article>` on post detail pages. The DDD documents the desired final DOM, not what EDS produces natively.

3. **Blockquote requires Quote block authoring** (frontend-minion). EDS does not produce `<blockquote>` from standard markdown-style content. Authors must use the table-based Quote block format. **Mitigation**: DDD clearly documents this authoring constraint and the authored input format.

4. **`decorateButtons()` transforms standalone links** (frontend-minion). Any link as sole child of a paragraph (where href != textContent) becomes a button. **Mitigation**: DDD documents this as author guidance — place descriptive text links within sentences, not as standalone paragraphs.

5. **Mobile blockquote line length** (ux-design-minion). 1.5em left padding at 375px yields ~34 chars/line. **Mitigation**: Flagged as open question. Blockquotes are typically short; accept the tradeoff or reduce to 1em on mobile.

6. **Adjacent sibling selectors depend on EDS DOM** (ux-design-minion). `h2 + h3` selector assumes no wrapper divs between headings within `.default-content-wrapper`. **Mitigation**: EDS does not insert wrappers between headings in default content. The selector is safe. DDD notes the assumption.

7. **`--space-paragraph` and `--space-element` tokens unused in current CSS** (ux-design-minion). Tokens exist in `tokens.css` but `styles.css` uses hardcoded values. **Mitigation**: DDD recommends using the tokens in post detail CSS. This establishes the precedent without changing global styles.

### Execution Order

```
Batch 1: Task 1 (author DDD-005)
  |
  v
[APPROVAL GATE: DDD-005 review]
```

Single task, single gate. No parallelism needed.

### Verification Steps

After the DDD is written and before presenting to the approval gate:
1. Verify all required DDD template sections are present
2. Verify every token reference (e.g., `--heading-font-size-xxl`) exists in `styles/tokens.css`
3. Verify spacing scale values are internally consistent (no gaps, no contradictions)
4. Verify a11y patterns match DDD-004 precedent (sr-only prefix format, aria-hidden badge, focus ring)
5. Verify ASCII wireframes use only pure ASCII characters
6. Verify the HTML Structure section addresses all elements listed in the Typography table
