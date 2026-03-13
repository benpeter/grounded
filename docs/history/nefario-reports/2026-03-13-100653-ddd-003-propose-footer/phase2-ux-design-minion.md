## Domain Plan Contribution: ux-design-minion

### Recommendations

#### (a) Background treatment: `--color-background`, not `--color-background-soft`

The current footer CSS applies `background-color: var(--color-background-soft)` (#EFE9DD). This creates a tinted band at the bottom of the page -- a visible surface that contradicts the "warm white paper" aesthetic where `--color-background` (#F6F4EE) is the dominant visual. The CLAUDE.md rules are explicit: "No cards with shadows, no gradients, no rounded containers." A tinted footer band is a container -- it visually boxes the footer content.

The header sets the precedent. DDD-002's token usage table specifies `background-color: --color-background` for the header. The header relies on a `1px solid var(--color-border-subtle)` bottom border for structural separation, not a background color change. The footer should mirror this: same warm white background as the rest of the page, with separation achieved by spacing and optionally a border -- never by a surface color change.

**Recommendation:** `background-color: var(--color-background)` (or omit the property entirely, inheriting from `body`).

#### (b) Middot separators: literal characters in markup, CSS-managed spacing

Use literal `·` (U+00B7 MIDDLE DOT) characters in the authored content/markup. Rationale:

1. **Content fidelity.** The footer content is exactly `(c) 2026 Ben Peter . LinkedIn . Legal Notice . Privacy Policy` as specified. The middots are part of the content model, not decoration. If CSS fails to load, the separators should still be visible. Literal characters achieve this; `::before`/`::after` pseudo-elements do not.

2. **Authoring simplicity.** The footer loads from a CMS fragment (`/footer`). Authors type middots directly. No JavaScript decoration needed to inject separators -- the `decorate()` function stays minimal.

3. **Precedent in typographic convention.** Middot-separated footer lines are a well-established web convention. Screen readers handle literal middots correctly (they pause briefly, reading each item distinctly). ARIA `role="separator"` on pseudo-elements would add complexity for no benefit.

**Color:** The middots should use `--color-text-muted` (#817B6F), matching the copyright text color. They are metadata-level punctuation, not body text. The same muted color keeps them quiet.

**Spacing:** Thin spaces around each middot. CSS `word-spacing` is unreliable for this; instead, use padding on the separator characters or -- more simply -- let the literal space characters flanking `·` in the markup provide the gap, with the footer's `font-size` and `letter-spacing` governing visual rhythm. At `--body-font-size-xs` (14-15px) in Source Sans 3, a standard space character on each side of `·` produces approximately 4-5px gaps, which reads well. No custom spacing tokens needed.

If tighter control is desired, wrap each middot in a `<span class="separator" aria-hidden="true">` and apply `margin-inline: 0.4em` via CSS. This gives 5.6-6px at the xs font size -- slightly more generous than naked spaces, and scales proportionally.

**`aria-hidden="true"` on separators:** The middots are visual punctuation. Screen readers should skip them and read the footer as a list of items. Mark the separator spans (or the literal middot characters if wrapped) as `aria-hidden="true"`.

#### (c) Mobile wrap behavior: natural line wrap, centered alignment

At 375px viewport with 20px padding on each side, the available width is 335px. The full line `(c) 2026 Ben Peter . LinkedIn . Legal Notice . Privacy Policy` in Source Sans 3 at 15px (mobile `--body-font-size-xs`) measures approximately 420-450px. It will not fit on a single line.

**Recommendation: Allow natural text wrapping with `text-align: center`.**

Rationale:

- **Stacked/restructured layout is overengineered.** The footer has exactly four semantic items. Forcing a flexbox column layout with explicit break rules adds CSS complexity for a problem that natural text wrap already solves gracefully.

- **Center alignment on mobile.** Left-aligned footer text on mobile feels orphaned -- the short wrapped fragments hug the left edge with vast empty space right. Centered alignment creates visual balance for wrapped footer text. This is a common, well-tested pattern for single-line footers that wrap on small screens.

- **Left-aligned on desktop.** At desktop widths (>= 900px) the content fits on a single line. Left-alignment (matching the header's left-aligned logo and the body text's left edge) is correct. The shift from centered (mobile) to left-aligned (desktop) mirrors what the eye expects: centered short content, left-aligned long content.

- **`text-wrap: balance`** (CSS Text Level 4) can be applied to improve how the browser distributes text across wrapped lines. Instead of filling one line and leaving a short orphan on the second, `text-wrap: balance` distributes words more evenly. Supported in Chrome 114+, Firefox 121+, Safari 17.5+. Gracefully ignored in older browsers. This is a progressive enhancement, not a requirement.

**Breakpoint behavior:**

| Width | Behavior |
|---|---|
| < 600px | `text-align: center`, natural wrap, `text-wrap: balance` |
| >= 600px | `text-align: left`, content fits on one line at 14-15px |

At 600px with 24px padding on each side, available width is 552px. The line measures ~420-450px. Fits comfortably. The transition from centered to left at the 600px breakpoint aligns with DDD-001's tablet breakpoint.

#### (d) Link hover/focus states: match body link behavior exactly

Footer links should use the same `--color-link` / `--color-link-hover` treatment as body links with underline on hover. Rationale:

- **Consistency reduces cognitive load.** The site has very few interactive elements. Footer links, body links, and the home logo are essentially all of them. Using a different hover treatment for footer links creates an inconsistency the user notices subconsciously.

- **"Subtler treatment" is a trap.** Making footer links more subtle risks making them unrecognizable as links. The site already uses `--color-link` (sage green) which is quiet by design. There is no need to make it quieter in the footer -- the link color is already the "understated" version.

- **Underline on hover provides the affordance.** The global `a:hover` rule applies `text-decoration: underline` and `color: var(--color-link-hover)`. Footer links should inherit this behavior. No override needed.

- **Focus-visible ring:** Use `outline: 2px solid var(--color-heading); outline-offset: 2px` matching the header's focus ring precedent from DDD-002. This is `--color-heading` (#3F5232), which achieves 7.75:1 contrast on `--color-background` in light mode. The `--color-accent` (gold) was already rejected in DDD-002 for failing WCAG 2.4.13 minimum 3:1 contrast.

**One refinement:** The copyright text "(c) 2026 Ben Peter" should NOT be a link. Only "LinkedIn", "Legal Notice", and "Privacy Policy" are links. The copyright symbol, year, and author name are static text. This is important for accessibility -- non-interactive text styled as a link is a WCAG failure (1.3.1 Info and Relationships). The site structure doc confirms this: "Ben Peter" and "LinkedIn" are listed as separate items, with "Ben Peter" being text (not a link to anywhere).

Wait -- re-reading the site structure doc: it says `"Ben Peter" and "LinkedIn" are separate text links`. This implies "Ben Peter" IS a link. If so, where does it link? The LinkedIn profile makes sense. The author name linking to LinkedIn (as an alternative anchor) or to the home page would both be reasonable. The DDD should clarify this. For the plan, I will assume the authored content determines link targets and the CSS treats all `<a>` elements in the footer identically.

#### (e) Vertical spacing: top border, mirroring the header's bottom border

**Recommendation: Add `border-top: 1px solid var(--color-border-subtle)` to the footer.**

Rationale:

- **Symmetry with the header.** DDD-002 established `border-bottom: 1px solid var(--color-border-subtle)` on the header -- described as "faintest structural separation." A matching top border on the footer creates bookends: the header and footer are the two structural boundaries of the page, marked by the same near-invisible rule.

- **Section spacing alone is not sufficient.** The `--section-spacing: 48px` governs gaps between `main > .section` elements. The footer lives outside `<main>` -- it is a `<footer>` element. There is no section-spacing relationship between the last main section and the footer. The gap between the last content section and the footer is whatever the browser's default margin-collapsing produces, plus any explicit margin. A border provides a reliable visual anchor regardless of how much content precedes the footer.

- **The border should be on the inner wrapper, not on `<footer>`.** Following the header pattern: `.header .nav-wrapper` has the border, not `header` itself. Similarly, the footer's inner content wrapper should carry the border, so it sits within the `--layout-max` constraint and the padding tokens align the border's start point with body text. If the border were on the `<footer>` element, it would span the full viewport width, breaking the content column alignment.

**Vertical padding:**

| Padding area | Value | Notes |
|---|---|---|
| Above the content (below border) | `var(--section-spacing)` (48px) | Matches section rhythm |
| Below the content (page bottom) | `24px` | Less generous below -- the page ends, no visual continuation needed |

This asymmetric padding is the same pattern as the header: `clamp(16px, 3vw, 24px)` for header breathing room. The footer can use a simpler static value since it does not need fluid scaling -- its single line of small text does not create the same visual mass as the stacked header logo.

Alternatively, symmetric `padding-block: 32px` would be simpler and acceptable. The key constraint is that the footer feels like it has adequate breathing room above (separating it from content) and does not feel wastefully padded below.

---

### Token Usage Table (proposed for DDD-003)

| Element | Property | Token | Status |
|---|---|---|---|
| Footer background | `background-color` | `--color-background` (or inherit) | Existing |
| Footer text | `color` | `--color-text-muted` | Existing |
| Footer text | `font-family` | `--font-body` | Existing (inherited) |
| Footer text | `font-size` | `--body-font-size-xs` | Existing |
| Footer links | `color` | `--color-link` | Existing |
| Footer links hover | `color` | `--color-link-hover` | Existing |
| Footer links focus ring | `outline-color` | `--color-heading` | Existing |
| Separator middots | `color` | `--color-text-muted` (inherited from parent) | Existing |
| Top border | `border-color` | `--color-border-subtle` | Existing |
| Content max-width | `max-width` | `--layout-max` | Existing |
| Mobile padding | `padding-inline` | `--content-padding-mobile` | Existing |
| Tablet padding | `padding-inline` | `--content-padding-tablet` | Existing |
| Desktop padding | `padding-inline` | `--content-padding-desktop` | Existing |

**No new tokens proposed.** All values reference existing tokens from `styles/tokens.css`.

---

### Proposed Tasks

**Task 1: Write DDD-003-footer.md**

- What: Author the complete design decision document following the structure established by DDD-001 and DDD-002 (Context, Proposal, HTML Structure, CSS Approach, Token Usage, Open Questions, Decision).
- Deliverables: `docs/design-decisions/DDD-003-footer.md`
- Dependencies: None (all design inputs established in this plan contribution).
- Key content to include:
  - Background: `--color-background` (not `--color-background-soft`)
  - Typography: `--body-font-size-xs`, `--font-body`, `--color-text-muted` for all non-link text
  - Separators: literal middots in markup, `aria-hidden="true"` if wrapped in spans
  - Mobile: centered text with natural wrap and `text-wrap: balance`, left-aligned at >= 600px
  - Links: standard `--color-link` / `--color-link-hover` with underline on hover
  - Focus: `--color-heading` outline matching header precedent
  - Border: `border-top: 1px solid var(--color-border-subtle)` on inner wrapper
  - Padding: `padding-block: 48px 24px` (or symmetric 32px) with same `--content-padding-*` inline tokens as header/main
  - HTML: semantic `<footer>` with inner wrapper, `<p>` for content line, `<a>` for links, no `<nav>` (footer links are supplementary, not primary navigation)
  - Width: `--layout-max` constraint matching header and main sections (answering DDD-001 Open Question #1 for the footer)

**Task 2: Implement footer CSS**

- What: Replace `blocks/footer/footer.css` with styles matching DDD-003 spec.
- Deliverables: Updated `blocks/footer/footer.css`
- Dependencies: Task 1 (approved DDD-003)

**Task 3: Update footer JS decoration (if needed)**

- What: Evaluate whether `blocks/footer/footer.js` needs changes. The current boilerplate `decorate()` loads the fragment and appends it. If the authored content already contains the correct markup (paragraph with middot-separated links), minimal JS changes may be needed. If separator wrapping or ARIA attributes are needed, add them in `decorate()`.
- Deliverables: Updated `blocks/footer/footer.js` (or confirmation that current code suffices)
- Dependencies: Task 1 (DDD-003 defines the target HTML structure)

**Task 4: Verify accessibility and contrast**

- What: After implementation, verify all footer color pairings meet WCAG 2.2 AA. Specific checks:
  - `--color-text-muted` (#817B6F) on `--color-background` (#F6F4EE): verify >= 4.5:1 for normal text at `--body-font-size-xs`
  - `--color-link` (#7F9A63) on `--color-background` (#F6F4EE): verify >= 4.5:1
  - `--color-heading` (#3F5232) focus ring on `--color-background`: verify >= 3:1 (WCAG 2.4.13)
  - Dark mode equivalents for all above pairings
  - Keyboard navigation: Tab reaches all three links, focus ring visible, Enter activates
- Deliverables: Contrast verification results (pass/fail for each pairing)
- Dependencies: Task 2, Task 3
- Note: This is a design-phase contrast check. Full compliance audit with assistive technology testing should be delegated to accessibility-minion.

---

### Risks and Concerns

1. **"Ben Peter" link target ambiguity.** The site structure doc says "Ben Peter" and "LinkedIn" are "separate text links" but does not specify where "Ben Peter" links. If it links to LinkedIn (same as the LinkedIn link), that is two links to the same destination in the same line -- confusing for screen reader users who Tab through links. If "Ben Peter" is NOT a link, the site structure doc needs correction. The DDD should clarify this. My recommendation: "Ben Peter" is plain text (not a link). Only "LinkedIn", "Legal Notice", and "Privacy Policy" are links.

2. **`--color-text-muted` contrast at xs font size.** The token comment says `--color-text-muted` (#817B6F) is "WCAG AA compliant on `--color-background`." At normal text sizes this is true (contrast ratio is approximately 4.55:1, just above the 4.5:1 threshold). At `--body-font-size-xs` (14px on desktop), the text is small enough that this borderline ratio could feel low-contrast to users with mild visual impairment, even if it technically passes. The implementing agent should verify the exact ratio and consider whether the footer's muted treatment makes this borderline case acceptable or whether `--color-text` (#3A3A33, 9.15:1) would be more responsible. My design recommendation: `--color-text-muted` is appropriate for the footer's understated role, but flag this as a known borderline pairing.

3. **Dark mode border visibility.** `--color-border-subtle` in dark mode is #4A4A42 on `--color-background` #3A3A33. This is a very low contrast pairing by design ("near-invisible"). Verify that the footer top border is perceptible enough in dark mode to serve its structural separation purpose. If it vanishes entirely, consider using `--color-border` (#5F7846 in dark mode) as a fallback, though this may make the border more visible than the header's, breaking symmetry.

4. **CMS fragment content structure.** The `decorate()` function loads content from `/footer`. The authored fragment's HTML structure determines what the JS has to work with. If the fragment delivers the middots and links as a single `<p>` element, the CSS approach is straightforward. If it delivers a list (`<ul>`) or multiple paragraphs, the CSS and JS approaches change. The DDD should specify the expected authored content structure (as DDD-002 did for the `/nav` fragment).

5. **Mobile text-wrap: balance browser support.** `text-wrap: balance` has broad modern browser support but is not universal. The design must look acceptable WITHOUT `text-wrap: balance` (natural greedy wrapping). Test both codepaths visually.

---

### Additional Agents Needed

- **accessibility-minion** should verify the final implementation against WCAG 2.2 AA, particularly: the borderline `--color-text-muted` contrast ratio at xs size, screen reader announcement of the footer content (middot handling, link identification), keyboard navigation order, and dark mode contrast for all pairings. The design-phase contrast check in Task 4 is necessary but not sufficient -- assistive technology testing is required for a complete audit.

No other additional agents are needed. The frontend-minion handles implementation (Tasks 2/3), and the current team composition covers the remaining concerns.
