## Domain Plan Contribution: ux-design-minion

### Recommendations

#### The Core Question: Type Badge Visual Treatment

The question is how to differentiate four post types (build-log, pattern, tool-report, til) while respecting an aesthetic where color is a "quiet guest," cards/shadows/gradients are prohibited, and `--color-accent` (gold) is rationed to one appearance per screen.

I evaluated five approaches. Here is the analysis and recommendation.

---

**Option A: Text-only labels with uppercase + letter-spacing (RECOMMENDED)**

Each badge is rendered as plain text in `--font-heading` (Source Code Pro) at `--body-font-size-xs`, uppercase, with modest letter-spacing (~0.05em). Color is `--color-text-muted`. All four types look identical in visual weight -- differentiated only by their text content.

```
BUILD LOG
PATTERN
TOOL REPORT
TIL
```

Why this works:
- Source Code Pro uppercase at small size reads as a "system label" -- typographic metadata, not a decorative element. It leverages the existing monospace heading font to signal "this is classification, not content."
- `--color-text-muted` (#6F6A5E light / #C9C3B8 dark) is already verified at 4.89:1 on `--color-background` in light mode. In dark mode, #C9C3B8 on #3A3A33 achieves approximately 5.5:1. Both pass WCAG AA for normal text.
- No new tokens required. Uses existing `--font-heading`, `--body-font-size-xs`, `--color-text-muted`.
- Hyphens in type slugs become spaces in display: `build-log` renders as "BUILD LOG", `tool-report` as "TOOL REPORT".
- The uppercase treatment creates sufficient visual distinction from the title (which is sentence case, `--font-heading`, `--color-heading`, larger size) and description (which is `--font-body`, `--color-text`, regular weight).
- Zero risk of color-coding becoming the primary differentiator, which would fail WCAG 1.4.1 (use of color) and conflict with the "color as quiet guest" principle.

**Accessibility**: The label text itself communicates the type. No reliance on color, shape, or position alone. Screen readers announce the type name directly. Keyboard users and sighted users get the same information channel.

**Why not make the four types visually distinct from each other?** Because the site aesthetic actively resists it. The design principle is that typography creates hierarchy, not color blocks. The type label's job is to answer "what kind of post is this?" -- and the text "BUILD LOG" vs "TIL" already answers that question completely. Adding per-type color differentiation would:
1. Require four new semantic color tokens (or repurposing existing tokens in strained ways)
2. Introduce color-coded meaning that needs a legend or learned association
3. Compete with `--color-heading` and `--color-link`, the only two non-muted colors on the page
4. Violate WCAG 1.4.1 if the color becomes the primary way users distinguish types

---

**Option B: Thin left border accent per type (REJECTED)**

A 2-3px left border on each post entry, color-coded per type. This is common in design systems (Material Design uses it for status indicators).

Why rejected:
- Requires four distinct border colors that all achieve sufficient contrast against `--color-background`. The existing palette has exactly two non-background colors suitable for borders: `--color-border` (#C9C3B8) and `--color-border-subtle` (#EFE9DD). Neither differentiates types.
- Using `--color-heading` (green), `--color-accent` (gold), `--color-link` (sage), and a fourth color creates a four-color coding system that contradicts "color is a quiet guest."
- The gold accent is restricted to "once per screen max." A home page with multiple build-log posts would violate this if gold were assigned to any type.
- Color-coding requires user learning ("what does the green stripe mean?") that text labels do not.
- The site-structure.md explicitly says entries are "separated by breathing room and perhaps the faintest rule line" -- a colored left border is a structural design element, not a faint rule.

**Option C: Differentiated text color per type (REJECTED)**

Each type label uses a different color: heading green for one, muted text for another, link green for a third, accent gold for the fourth.

Why rejected:
- Same palette exhaustion problem as Option B. The token palette has three text-appropriate colors: `--color-heading`, `--color-text-muted`, `--color-link`. A fourth would need to be invented.
- `--color-heading` is "the strongest color on the page" -- using it for a small metadata label elevates that label to the same visual weight as headings, which contradicts the "small, muted, unobtrusive" requirement.
- `--color-accent` (gold) at `--body-font-size-xs` on `--color-background` achieves only ~2.2:1 contrast in light mode -- fails WCAG AA.
- Color-only differentiation fails WCAG 1.4.1.

**Option D: Single-character prefix or symbol (REJECTED)**

Prefix each type with a character: `> Build Log`, `~ Pattern`, `# Tool Report`, `* TIL`.

Why rejected:
- Arbitrary symbol-to-type mapping requires user learning.
- Symbols in Source Code Pro at small size could be mistaken for code syntax or markdown artifacts on a technical blog.
- "No decorative icons" applies conceptually to decorative symbols too.
- The text label alone ("BUILD LOG") is more immediately legible than a symbol that needs decoding.

**Option E: Font-weight or style variation (CONSIDERED, NOT RECOMMENDED)**

Use italic for one type, semibold for another, regular for a third, etc.

Why not recommended:
- Four weight/style variations at `--body-font-size-xs` in Source Code Pro create very subtle distinctions that most users will not notice or learn.
- It introduces a typographic code that needs a legend.
- The cognitive overhead of "italic means pattern, bold means build-log" is higher than just reading the words.
- Text labels with consistent styling (Option A) are simpler and achieve the same goal.

---

#### Post Entry Layout Recommendation

Each post entry in the index should follow this visual hierarchy, top to bottom:

```
BUILD LOG                          <-- type badge: small, muted, uppercase
Building a Design System for EDS   <-- title: heading font, heading color, link
A practitioner's approach to design <-- description: body font, text color
tokens in Edge Delivery Services.
2026-03-12 · aem, eds, performance <-- date + tags: muted, small
```

**Title is the dominant element.** It should be the only element that uses `--color-heading` and `--font-heading` at a heading-appropriate size. The title is also the link to the post (entire title is an `<a>`).

**Type badge sits above the title.** It is subordinate metadata -- you read it to classify, then your eye drops to the title. Placing it above (rather than inline with the date) establishes a reading flow: classify > read title > scan description > note metadata.

**Date and tags share a metadata line below the description.** Both are `--color-text-muted`, `--body-font-size-xs`. Tags are links (`--color-link`) but small and inline, visually quiet. The middot separator between date and tags follows the footer precedent.

**Entry separation uses whitespace + faint rule.** Per site-structure.md: "breathing room and perhaps the faintest rule line (`--color-border-subtle`)." A `1px solid var(--color-border-subtle)` horizontal rule between entries, with generous `margin-block` above and below (~`--section-spacing` or slightly less). The rule is near-invisible -- it is there for rhythm, not for decoration.

#### Typography Mapping

| Element | Font | Size | Weight | Color | Line-height |
|---------|------|------|--------|-------|-------------|
| Type badge | `--font-heading` | `--body-font-size-xs` | 400 | `--color-text-muted` | 1 |
| Title | `--font-heading` | `--heading-font-size-m` (22px mobile / 21px desktop) | 600 | `--color-heading` | `--line-height-heading` (1.25) |
| Description | `--font-body` | `--body-font-size-s` | 400 | `--color-text` | `--line-height-body` (1.7) |
| Date | `--font-body` | `--body-font-size-xs` | 400 | `--color-text-muted` | 1.4 |
| Tags | `--font-body` | `--body-font-size-xs` | 400 | `--color-link` | 1.4 |

Rationale for title at `--heading-font-size-m` (not `--heading-font-size-l` or larger): The page `<h1>` is reserved for the site's implicit heading or a future "Latest Posts" heading. Post titles in the index should be `<h2>` elements, and `--heading-font-size-m` at 22px/21px provides clear hierarchy without overwhelming a dense list. If the page has 10+ entries, larger headings would create excessive vertical bulk.

#### Tags Treatment

Tags should be plain text links, not pills/chips/badges. No background, no border, no border-radius. Just `--color-link` at `--body-font-size-xs` with `text-decoration: none` by default, `text-decoration: underline` on hover. This aligns with the "no rounded containers" rule and keeps tags maximally quiet.

Tags are comma-separated or middot-separated inline text. Each tag links to `/tags/{tag}`. Example: `aem · eds · performance`.

#### Dark Mode

The recommended approach (Option A: text-only uppercase labels) works identically in dark mode because it uses only `--color-text-muted`, which is already defined in both modes:
- Light: #6F6A5E on #F6F4EE = ~4.89:1
- Dark: #C9C3B8 on #3A3A33 = ~5.5:1

No per-type color tokens means no per-type dark mode overrides needed.

#### Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| < 600px | Full-width entries. Type badge, title, description, and metadata stack vertically. Padding: `--content-padding-mobile`. Entry separation: `--section-spacing` margin + optional 1px rule. |
| >= 600px | Same stacked layout. Entries constrained by `--measure` (or close to it). Padding: `--content-padding-tablet`. |
| >= 900px | Same stacked layout at `--measure` width. Padding: `--content-padding-desktop`. No multi-column layout -- the site is single-column by design. |

The post index is NOT a grid of cards. It is a vertical list of text entries. Responsive design is straightforward because the layout does not change structure across breakpoints -- only padding and font sizes adjust (already handled by tokens).

#### Entry Spacing

Between entries, use a combination of margin and a faint rule:

- `margin-block: calc(var(--section-spacing) * 0.75)` between entries (36px) -- slightly less than section spacing to signal "these are items in a list" rather than "these are separate sections."
- `border-bottom: 1px solid var(--color-border-subtle)` on each entry (except the last). The rule sits in the middle of the margin gap, nearly invisible.
- First entry has no top margin; last entry has no bottom border.

Alternative: Use `--section-spacing` (48px) directly for a more generous feel. The exact value should be prototyped -- 36px may feel tight with description text, 48px may feel generous. This is an implementation-time decision.

#### Empty State

If no posts exist yet (early in the site's life), the index should show nothing unusual -- just an empty `<main>` with header and footer framing it. No "No posts yet" message, no call-to-action. This is a single-author blog; the author knows the site is empty. An empty state message would be seen only by the author or by accidental visitors and adds no value.

#### Accessibility

- Each post entry should be an `<article>` element, providing a semantic boundary for assistive technology.
- Post titles are `<h2>` elements (assuming no explicit `<h1>` heading for the index page, or if there is one, titles are `<h2>` under it).
- Type badge is visible text within the `<article>`, announced by screen readers in reading order before the title. No ARIA needed -- it is plain text.
- Date should use `<time datetime="YYYY-MM-DD">` for machine readability.
- Tags should be a set of links, semantically within a container with an appropriate label (e.g., `<div class="post-tags" aria-label="Tags">` or a simple comma-separated link list).
- Focus indicators on title link and tag links: `outline: 2px solid var(--color-heading); outline-offset: 2px` per DDD-002 and DDD-003 precedent.
- Touch targets: title link has generous line-height and full-width clickable area. Tag links at `--body-font-size-xs` (14-15px) are small but spaced with padding or middot separators to avoid accidental activation. Minimum 24px effective touch target per WCAG 2.5.8 (note: 44px minimum is a AAA target; 24px is AA for inline links).

### Proposed Tasks

1. **Write DDD-004-home-post-index.md** following the README format exactly. Include:
   - Context section referencing all governing constraints (site-structure.md, content-model.md, tokens.css, CLAUDE.md aesthetic rules, DDD-001 layout contract)
   - Proposal with ASCII wireframes for mobile and desktop
   - Typography table with exact token mappings for all six elements (type badge, title, description, date, tags, separator rule)
   - Spacing and rhythm section with entry separation values
   - Responsive behavior table
   - Interactions section covering: title link hover/focus, tag link hover/focus, keyboard navigation order, screen reader announcements
   - HTML structure showing the semantic markup (`<article>`, `<h2>`, `<time>`, etc.)
   - CSS approach (layout method, key selectors, scoping)
   - Token usage table (all elements mapped to existing tokens)
   - Open Questions for implementation-time decisions (entry spacing exact value, whether to use `<h1>` for index heading)

2. **Verify contrast values** for all proposed text/background pairings in both light and dark mode before finalizing the DDD. Specifically:
   - `--color-text-muted` on `--color-background` (both modes) -- already verified in DDD-003
   - `--color-heading` on `--color-background` (both modes) -- for title links
   - `--color-link` on `--color-background` (both modes) -- for tag links and title hover
   - Any new pairing introduced by the badge treatment

3. **Determine heading hierarchy** for the home page. Two options:
   - Option A: No `<h1>` on the home page. Post titles are `<h2>`. The site name in the header serves as the implicit page identity. This risks a missing `<h1>` accessibility warning.
   - Option B: A visually hidden `<h1>` ("Latest Posts" or "Mostly Hallucinations") at the top of `<main>`, with post titles as `<h2>`. Provides a proper heading hierarchy. Screen reader users get a clear page heading.
   - Option C: A visible `<h1>` that is part of the page content. This would need design consideration -- it could be typographically quiet (muted, small) to avoid competing with the header logo.
   - Recommendation: Option B (visually hidden `<h1>`) is the safest accessibility choice without design disruption. Flag as an Open Question for reviewer decision.

4. **Define the EDS block structure** for the post index. This will likely be either:
   - Default content rendered from a query/index (EDS has a query index pattern)
   - A custom block (e.g., `post-index`) that fetches and renders posts
   - The DDD should specify the target HTML structure but flag the EDS content source mechanism as an implementation decision

### Risks and Concerns

1. **Type badge may be missed at scanning speed.** A small uppercase muted label above the title could be overlooked when a reader rapidly scans the index. However, this is acceptable: the description provides enough context to understand what the post is about even if the type label is skipped. The type label is supplementary metadata, not primary navigation. If user testing later reveals the badge is insufficient, it can be made slightly more prominent (e.g., `--body-font-size-s` instead of `xs`, or a slightly heavier weight) without changing the fundamental approach.

2. **Entry density vs. breathing room tradeoff.** With 5-10 posts visible, the index needs enough whitespace to feel "light and airy" (per the aesthetic) while not requiring excessive scrolling. The entry spacing (36-48px between entries) and description text (1-2 sentences) will determine this balance. Prototyping with real content is essential -- lorem ipsum will not reveal whether descriptions are consistently 1 line or 2 lines.

3. **Tag proliferation.** If a post has 5+ tags, the metadata line could wrap and create visual noise. The DDD should either cap displayed tags (e.g., show first 3 + "and N more") or accept wrapping. Given the content model shows tags like `aem`, `eds`, `performance` (short words), wrapping is likely rare but should be designed for.

4. **No pagination.** CLAUDE.md says "no pagination until 20+ posts." With 15-20 posts and full descriptions, the page could be very long. This is a deliberate V1 decision (not a design concern), but the entry layout should be designed to be scannable at high volume -- which the proposed stacked layout with clear title hierarchy supports.

5. **Title link interaction area.** If only the title text is clickable, the touch target on mobile may be narrow for short titles. Consider making the entire entry area clickable (common pattern) or ensuring the title `<a>` has sufficient padding. The DDD should specify which approach to use. Recommendation: title text only is the link; full-entry click targets require JavaScript event delegation and create ambiguity with tag links inside the same entry.

6. **EDS content sourcing.** How posts are queried and rendered (EDS query index, static JSON, CMS-authored index page) is an implementation concern that affects the HTML structure. The DDD should define the target DOM structure and flag the data source as an implementation decision for the implementing agent.

### Additional Agents Needed

- **Accessibility minion**: Once the DDD is approved and implementation begins, the accessibility minion should audit the implemented post index for heading hierarchy correctness, screen reader announcement order, keyboard navigation flow, and focus indicator visibility. The design phase (this DDD) establishes the accessible patterns; the accessibility minion verifies they survive implementation.

- **No additional agents needed for the design phase.** The ux-design-minion has sufficient domain knowledge to write this DDD. The planning question is squarely within visual design, token architecture, and accessible pattern selection.
