## Domain Plan Contribution: ux-design-minion

### Recommendations

#### 1. Heading Spacing: Revise DDD-001's 2em/0.5em Proposal

The currently implemented values in `styles.css` are `margin-top: 0.8em; margin-bottom: 0.25em` for all headings (h1-h6). DDD-001 proposed `2em above / 0.5em below` but this was never implemented. My recommendation:

**h2: `margin-top: 2em; margin-bottom: 0.5em`** -- Confirmed. 2em above h2 at 18px body = 36px, which creates a clear section break comparable to `--section-spacing` (48px) while being proportional to the text. The 0.5em below (9px) keeps the heading tightly coupled to the content it introduces. This asymmetry is correct -- headings are openers, not dividers.

**h3: `margin-top: 1.5em; margin-bottom: 0.5em`** -- Revised downward from the proposed 2em. h3 is a subsection within an h2 section. Giving it the same top margin as h2 would flatten the hierarchy -- a reader would not feel the difference between a new section (h2) and a new subsection (h3). 1.5em (27px) is perceptibly less than 2em (36px) but still clearly more than paragraph spacing (1em / 20px). The 0.5em below remains the same as h2 -- both heading levels pull toward their content equally.

**h2 immediately followed by h3** (heading-to-heading transition): Collapse the h3 top margin to `0.25em`. When an h2 is immediately followed by h3 with no intervening paragraph, the h3 is a direct subdivision. The reader sees the h2 section title, then immediately the first subsection title. Full 1.5em between them would create a false visual break. Use the adjacent sibling selector: `h2 + h3 { margin-top: 0.25em; }`.

**h1 (post title): `margin-top: 0; margin-bottom: 0`** -- The h1 sits at the top of the article. Its spacing is controlled by the metadata block relationship (see point 9 below), not by generic heading margins. Zero margins on h1 within the post context prevent double-spacing when the post header area has its own spacing logic.

#### 2. Paragraph-to-Code-Block Transitions

Code blocks (`<pre>`) are the second most frequent element in technical articles after paragraphs. The transition must feel natural, not create a "break" in reading flow.

**Above `<pre>`: `margin-top: 1.5em`** (same as `--space-element`). Code blocks are distinct elements -- they need more breathing room than a paragraph-to-paragraph transition (1em) but less than a section break (2em). 1.5em signals "here is a related but visually distinct thing."

**Below `<pre>`: `margin-bottom: 1.5em`**. Symmetric spacing for code blocks. Unlike headings (which are asymmetric because they open sections), code blocks are self-contained artifacts. Asymmetric spacing around code blocks would create a "falling forward" effect that disrupts the reading rhythm when you have paragraph-code-paragraph-code sequences, which are extremely common in technical posts.

**Code block padding**: The current `padding: 16px` is adequate. At 18px body text, 16px internal padding is ~0.89em -- just under 1em -- which feels comfortable without being cavernous. No change needed.

**Heading followed directly by code block** (`h2 + pre`, `h3 + pre`): Keep the heading's 0.5em bottom margin and the code block's 1.5em top margin. Combined, this gives ~2em of space, which is appropriate -- the heading introduces the code, and the extra space prevents the heading from feeling "stuck" to the code block's background surface.

#### 3. Blockquote and Pull-Quote Treatment

These are two distinct elements with different semantic roles and visual treatments.

**Blockquote** (attribution/citation, `<blockquote>`):

- Left border: `3px solid var(--color-border)` -- not `--color-border-subtle` (too invisible) and not `--color-accent` (reserved for pull-quotes). The `--color-border` (#C9C3B8) is visible but quiet.
- Left padding: `1.5em` (indentation from the border to the text).
- Left margin: `0`. The border itself sits at the left edge of the reading column. No additional indentation -- the content is already constrained to `--measure` (68ch), and further indentation on mobile would push text uncomfortably narrow.
- Right margin/padding: `0`. Blockquotes do not indent from the right.
- Font: `--font-body` at `--body-font-size-m` (same as body text). Blockquotes are not editorial -- they are cited content and should read at the same pace as the surrounding text.
- Color: `--color-text` (same as body). No dimming.
- Vertical spacing: `1.5em` above and below (same as code blocks -- distinct element rhythm).

**Pull-quote** (editorial emphasis, a block/class variant):

- Left border: `3px solid var(--color-accent)` (#D9B84A gold). This is the one sanctioned use of gold per screen. The border thickness matches blockquote for consistency, but the color is the differentiator.
- Left padding: `1.5em`.
- Left margin: `0`.
- Font: `--font-editorial` (Source Serif 4) at `--heading-font-size-m` (22px mobile / 21px desktop). This is 1.1x body text -- noticeable but not headline-scale. Source Serif 4 at this size creates the "pause and consider" effect appropriate for a pull-quote without screaming.
- Color: `--color-text`. Not `--color-heading` -- pull-quotes are editorial voice, not structural headings.
- Line-height: `1.5` (between heading 1.25 and body 1.7). The larger font needs less line-height than body text to feel balanced.
- Vertical spacing: `2em` above and below. Pull-quotes are meant to create a visual breathing moment. They need more space than code blocks or blockquotes to achieve the "pause" effect.

**Why `--heading-font-size-m` and not larger for pull-quotes**: At 68ch measure, a pull-quote at `--heading-font-size-l` (28px/26px) would only fit ~30 characters per line, causing excessive wrapping for anything beyond a short phrase. `--heading-font-size-m` (22px/21px) fits ~40-45 characters, allowing a full sentence without awkward breaks.

#### 4. List Item Spacing

Lists in technical articles are high-density information -- tighter spacing than paragraphs is correct.

**Within lists (`<li>` to `<li>`)**: `margin-bottom: 0.35em`. This is tighter than paragraph spacing (1em) but not zero -- items remain distinct without the list feeling sparse. At 18px body, 0.35em = ~6px, which provides just enough daylight between items.

**Nested lists**: `margin-top: 0.35em; margin-bottom: 0` on the nested `<ul>`/`<ol>`. The nested list starts immediately after its parent item with the same inter-item rhythm.

**List-to-surrounding-content**: `margin-top: 1em; margin-bottom: 1em` (same as `--space-paragraph`). Lists are paragraph-level elements -- they sit in the same rhythm as paragraphs. Using `--space-element` (1.5em) would over-separate lists from their introducing text, especially in the common pattern:

> The configuration requires three settings:
> - Setting A
> - Setting B
> - Setting C

Here the list is a continuation of the paragraph thought. 1em keeps that connection.

**Ordered vs. unordered**: Same spacing for both. The numbering/bullet difference is sufficient visual differentiation.

**List padding-left**: `1.5em`. Default browser padding-left for lists (~40px) is excessive at a 68ch measure. 1.5em (27px) provides enough indentation for bullets/numbers to be clearly indented without wasting horizontal space. On mobile (335px available width), 40px left padding eats 12% of the line -- 27px is 8%, more reasonable.

#### 5. Additional Element Spacing: Inline Code

Inline `<code>` needs visual differentiation from surrounding text without disrupting line rhythm.

- Background: `var(--color-background-soft)` (#EFE9DD).
- Padding: `0.15em 0.3em` -- just enough to give the background a shape without affecting line-height.
- Border-radius: `2px` -- minimal rounding. The site avoids rounded containers, but a 2px radius on inline code prevents the sharp corners from looking harsh at small sizes. This is functional, not decorative.
- Font-size: `0.9em` relative to parent. Code fonts (Source Code Pro) tend to appear larger than proportional fonts at the same pixel size. 0.9em brings the x-height into visual alignment with the surrounding Source Sans 3 body text.
- No border. The background color shift is sufficient.

#### 6. Horizontal Rules / Section Breaks

If the content model uses `<hr>` for thematic breaks within articles:

- `border: none; border-top: 1px solid var(--color-border-subtle)`.
- `margin: 2em auto`.
- `max-width: 30%` of the reading column -- a short centered rule rather than full-width. This follows the "borders melt into the background" aesthetic.

#### 7. Links Within Body Text

Body text links differ from the index title links (which suppress underline by default).

- Default: `color: var(--color-link); text-decoration: underline`. In body text, links must be discoverable without hover. The underline is the primary affordance. This differs from the index (where titles are the obvious interactive element) because body text links are embedded in prose.
- Hover: `color: var(--color-link-hover)`. Underline persists.
- Focus: `outline: 2px solid var(--color-heading); outline-offset: 2px`. Same focus ring as everywhere else.
- Visited: no change. The site's muted palette means a visited color would be either too subtle to perceive or too different to fit.

**Accessibility note**: Body text links must be distinguishable from surrounding text by more than color alone (WCAG 1.4.1). The underline satisfies this. If the DDD removes underlines for any body link, an alternative non-color indicator (bold, icon, border-bottom) must replace it.

#### 8. Tables (if applicable in technical posts)

Technical articles sometimes include comparison tables. Define a minimal treatment:

- No outer border. `border-collapse: collapse`.
- Row borders: `1px solid var(--color-border)` on `<td>` and `<th>` bottom edges only.
- Header row (`<th>`): `font-weight: 600; text-align: left; padding: 0.5em 1em; border-bottom: 2px solid var(--color-border)`.
- Data cells (`<td>`): `padding: 0.5em 1em`.
- Font: `--font-body` at `--body-font-size-s` (slightly smaller than body). Dense data reads better slightly smaller.
- Responsive: On mobile, tables scroll horizontally within a wrapper. The table itself does not reflow.

#### 9. Post Title (h1) and Metadata Block

**Post title size: `--heading-font-size-xl` (36px mobile / 32px desktop), not `--heading-font-size-xxl`.**

Rationale: `--heading-font-size-xxl` (48px/42px) is appropriate for a marketing hero or a standalone splash page. For a technical blog post that the reader will spend 5-15 minutes with, the title should be authoritative but not dominating. At 68ch measure (roughly 550-612px), a 48px Source Code Pro heading fits only ~13 characters per line before wrapping. Most technical post titles are 40-70 characters:

- "Building a Design System for Edge Delivery Services" (52 chars) wraps to 4 lines at 48px
- Same title at 36px: wraps to 2-3 lines -- much more readable
- At 32px (desktop): even better, fits 2 lines comfortably

`--heading-font-size-xl` (36px/32px) gives the title clear primacy over h2 (`--heading-font-size-xl` vs `--heading-font-size-l` -- wait, let me reconsider the h2 size).

**Reconsideration of in-article h2 size**: The current `styles.css` maps h2 to `--heading-font-size-xl` (36px/32px). If the post title (h1) also uses `--heading-font-size-xl`, there is no size distinction between h1 and h2. Two options:

- **Option A (recommended)**: h1 at `--heading-font-size-xxl` (48px/42px), h2 stays at `--heading-font-size-xl` (36px/32px). Accept the wrapping tradeoff. The title only appears once, at the very top, where wrapping is less disruptive.
- **Option B**: h1 at `--heading-font-size-xl` (36px/32px), h2 drops to `--heading-font-size-l` (28px/26px). Preserves size hierarchy but makes h2 noticeably smaller.

**My revised recommendation: Option A -- h1 stays at `--heading-font-size-xxl` (48px/42px).** The wrapping concern is real but manageable: the title appears once, at the top, before the reader enters the body flow. It is the most important text on the page. The size gap between h1 (48px) and h2 (36px) is 1.33x -- a clear, perceptible hierarchy. Between h2 (36px) and h3 (28px) is 1.29x -- also clear. The scale works.

**Metadata line spatial relationship:**

- Between h1 and metadata: `margin-top: 0.75em` on the metadata block. This is tighter than a paragraph gap (1em) because the metadata is part of the title unit -- it describes the post, not the body. But it is not zero -- there needs to be enough space for the reader's eye to distinguish the title from the metadata.
- Between metadata and first body paragraph: `margin-bottom: 2em` on the metadata block. This is the largest gap on the page besides section spacing. It creates the "breath before reading" -- the reader absorbs the title and metadata, then enters the body. This gap signals the transition from "what this is" to "what it says."

**Metadata line typography** (following DDD-004 precedent):

- Type badge: `--font-heading`, `--body-font-size-xs`, `--color-text-muted`, `text-transform: uppercase`, `letter-spacing: 0.05em`. Identical to index treatment.
- Date and updated: `--font-body`, `--body-font-size-xs`, `--color-text-muted`. Format: "March 12, 2026" (with optional "Updated March 13, 2026" when `updated` field is present).
- Tags: `--font-body`, `--body-font-size-xs`, `--color-link`. Same middot separator pattern as index.
- Layout: Single line (wrapping allowed). Type badge, then date, then optional updated, then tags, all separated by middots. Same inline flow as DDD-004.

#### Complete Spacing Scale Summary

| Transition | Margin Above | Margin Below | Notes |
|---|---|---|---|
| h1 (post title) | 0 | 0 | Spacing controlled by metadata block |
| Metadata block | 0.75em | 2em | Tight to title, breathes before body |
| h2 | 2em | 0.5em | Major section break |
| h3 | 1.5em | 0.5em | Subsection break |
| h2 + h3 (adjacent) | -- | 0.25em on h3 | Collapses via adjacent sibling |
| p | 1em | 0 | Standard paragraph rhythm |
| pre (code block) | 1.5em | 1.5em | Symmetric, distinct element |
| blockquote | 1.5em | 1.5em | Same as code blocks |
| Pull-quote | 2em | 2em | Breathing moment |
| ul, ol | 1em | 1em | Paragraph-level |
| li | 0 | 0.35em | Tight within list |
| hr | 2em | 2em | Centered short rule |

### Proposed Tasks

**Task 1: Define the complete spacing specification table**
- What: Document every element-to-element transition with exact CSS values, expressed in existing tokens where possible. The table above is the starting point. Verify against the implemented `styles.css` values and note where changes are needed.
- Deliverables: A "Spacing & Rhythm" section in DDD-005 with the full transition table plus CSS selectors.
- Dependencies: None. Uses existing tokens.

**Task 2: Define the post header block (h1 + metadata)**
- What: Specify the HTML structure for the post title and metadata line, including type badge, date, optional updated date, and tags. Define the spatial relationship between h1, metadata, and first body paragraph. Specify responsive behavior.
- Deliverables: HTML structure, wireframes (mobile + desktop), typography table, spacing values.
- Dependencies: DDD-004 metadata line precedent (for consistent type badge and tag treatment).

**Task 3: Define all body content elements**
- What: Specify typography and spacing for every element that can appear in article body: h2, h3, p, pre, code (inline), blockquote, pull-quote, ul, ol, li, a (body links), table, hr, img (informational images with captions). Include font, size, weight, color, line-height, margins, padding, background where applicable.
- Deliverables: Typography table per element, CSS approach section with key selectors.
- Dependencies: Task 1 (spacing scale).

**Task 4: Create ASCII wireframes for key content sequences**
- What: Show the post detail page at mobile and desktop breakpoints. Include at least these content sequences: (a) title + metadata + intro paragraph, (b) h2 + paragraph + code block + paragraph, (c) h2 + h3 + paragraph, (d) paragraph + pull-quote + paragraph, (e) paragraph + list + paragraph.
- Deliverables: At least 5 wireframes covering the critical reading patterns.
- Dependencies: Tasks 1-3.

**Task 5: Define pull-quote implementation approach**
- What: Decide how pull-quotes are authored and rendered in EDS. Options: (a) a `pull-quote` block (authored as a table in the CMS, decorated by JS), (b) a CSS class on `<blockquote>` (e.g., `.pull-quote` added via section metadata or a wrapper convention), (c) a specific Markdown pattern. This is an EDS content modeling question as much as a design question.
- Deliverables: Authoring contract (how the writer creates a pull-quote), HTML structure after decoration, CSS selectors.
- Dependencies: Understanding of EDS block authoring conventions (AGENTS.md).

**Task 6: Define code block treatment in detail**
- What: Code blocks in technical articles need attention beyond basic `<pre>` styling. Define: syntax highlighting strategy (if any for V1), line number display (probably not V1), horizontal scroll behavior, code block within a list item, code block caption/filename display.
- Deliverables: Code block specification section in DDD-005.
- Dependencies: V1 scope constraints (CLAUDE.md -- keep it minimal).

### Risks and Concerns

**Risk 1: Current `styles.css` heading margins conflict with DDD-005 values.** The currently shipped CSS uses `margin-top: 0.8em; margin-bottom: 0.25em` for ALL headings (h1-h6). DDD-005 proposes differentiated margins per heading level (h2: 2em/0.5em, h3: 1.5em/0.5em). The implementing agent must override these globals selectively for the post detail context, likely scoped to `.default-content-wrapper` within the article page. Global heading margins should remain as they are to avoid breaking the header, footer, and post index blocks that depend on them.

**Risk 2: Pull-quote as a block requires EDS content authoring workflow.** Unlike all other body elements (which are standard Markdown/HTML), a pull-quote block requires the author to create a specific table structure in the CMS. If the authoring experience is awkward, pull-quotes will not be used. Consider whether a simpler approach (a CSS-styled `<blockquote>` with a class trigger) is sufficient for V1.

**Risk 3: Mobile line length with indented elements.** At 375px viewport with 20px padding, the available width is 335px. A blockquote with 1.5em left padding (~27px) reduces available text width to ~308px, yielding ~34 characters per line at 18px Source Sans 3. This is below the 45-character minimum for comfortable reading. Mitigation: reduce blockquote left padding to `1em` on mobile via media query, or accept the tradeoff since blockquotes are typically short.

**Risk 4: The `--space-paragraph` and `--space-element` tokens exist in `tokens.css` but are not used anywhere in `styles.css`.** The current CSS uses hardcoded `0.8em` / `0.25em` values. DDD-005 should decide whether to: (a) update the token values to match the proposed spacing scale and use them in CSS, or (b) continue with `em`-based values directly in CSS and remove the unused tokens. Recommendation: use the tokens. They exist for exactly this purpose.

**Risk 5: Adjacent sibling selectors for heading-to-heading transitions.** The `h2 + h3 { margin-top: 0.25em }` rule depends on h2 and h3 being direct siblings in the DOM. In EDS, each content section wraps children in `.default-content-wrapper`. If EDS inserts wrapper divs between headings (which it does not, based on the documented markup structure), this selector would break. Verify by inspecting actual EDS-rendered markup for a page with h2 immediately followed by h3.

**Risk 6: Code font x-height mismatch.** Source Code Pro (the heading and code font) has a larger x-height than Source Sans 3 (the body font). When inline `<code>` appears in body text, the code text appears visually larger even at the same pixel size. The proposed `font-size: 0.9em` for inline code compensates, but this should be verified in-browser with actual mixed content (e.g., "Set the `--measure` token to `68ch`").

### Additional Agents Needed

**accessibility-minion**: Should review the final DDD-005 for WCAG compliance of the proposed spacing, contrast of all new color pairings (especially pull-quote gold border against both light and dark backgrounds), and verify that the heading hierarchy within a post (h1 > h2 > h3, no skipped levels) is documented as a hard requirement. The inline code background color (`--color-background-soft` on `--color-background`) also needs contrast verification -- it is intentionally subtle but must remain perceptible.

No other additional agents needed. The frontend-minion handles implementation. The ux-strategy-minion is not needed -- this is a well-defined layout problem, not a user journey question.
