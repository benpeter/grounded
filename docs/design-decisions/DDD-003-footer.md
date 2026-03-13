# DDD-003: Footer

Status: **Proposal**

## Context

The footer is the page's final element — a legal attribution line that closes every page. It carries zero wayfinding burden. Its only jobs are copyright attribution, a single social link, and two legally required links. Done with restraint, it becomes a quiet period at the end of a sentence.

### Governing constraints

**Site structure (docs/site-structure.md)**

The footer content is exactly:

```
© 2026 Ben Peter · LinkedIn · Legal Notice · Privacy Policy
```

- "Ben Peter" and "LinkedIn" are described as separate text links
- LinkedIn sits next to the author's name as the single social link
- No icons, no bio, no headshot, no "about the author" section
- Legal Notice and Privacy Policy are required under German law (DDG §5, DSGVO)
- Both legal pages are separate pages linked from the footer, not indexed

**Aesthetic rules (CLAUDE.md)**

- `--color-background` (#F6F4EE light) is the dominant visual. The page is warm white paper.
- No cards with shadows, no gradients, no rounded containers.
- Typography creates hierarchy, not color blocks or boxes.
- Borders and rules almost melt into the background.

**DDD-001 layout contract**

DDD-001 establishes the two-tier width model (`--layout-max` / `--measure`) and the padding tokens (`--content-padding-mobile`, `--content-padding-tablet`, `--content-padding-desktop`). This DDD resolves DDD-001 Open Question #1 for the footer: the footer constrains to `--layout-max`, not `--measure`. This keeps the footer's left edge aligned with the header and main content, wrapping all page content in a consistent geometric frame.

**DDD-002 header precedent**

The header uses `background-color: var(--color-background)`, `border-bottom: 1px solid var(--color-border-subtle)`, and the same `--content-padding-*` tokens. The footer mirrors these choices. Together they create symmetric bookends: a faint rule above the content area (header bottom border) and a faint rule below (footer top border), with the warm white page in between.

**Design tokens (styles/tokens.css)**

All tokens referenced in this document exist in `styles/tokens.css`. No new tokens are proposed.

**V1 scope exclusions (CLAUDE.md)**

No newsletter signup, no RSS link, no social icon grid, no secondary navigation, no dark mode toggle.

**Current boilerplate state**

`blocks/footer/footer.js` is the boilerplate default: 20 lines that load a `/footer` fragment, clear the block, and append the fragment's children. The DOM structure this produces is sufficient — no replacement of `decorate()` is needed.

`blocks/footer/footer.css` has two problems to correct:
- Line 2: `background-color: var(--color-background-soft)` — creates a tinted band that contradicts the warm-white aesthetic. Replace with `var(--color-background)` or remove and inherit.
- Line 8: `max-width: 1200px` — hardcoded pixel value. Replace with `var(--layout-max)`.

**Accessibility findings**

Two token-level contrast failures affect the footer but are site-wide issues, not footer-specific. They are documented in Open Questions 2 and 3 and are out of scope for this DDD to resolve. The footer uses `text-decoration: underline` on all links by default to satisfy WCAG 1.4.1 (non-color indicator for link distinguishability) without depending on color contrast alone.

---

## Proposal

### Layout

The footer is a **single line of inline text** within the `--layout-max` container. There is no flexbox layout, no grid, no multi-column arrangement. Standard block layout with `text-align` and a single `<p>` element.

The left edge of the footer content aligns with the header logo and the body text in main content, governed by the same `--content-padding-*` tokens. This alignment is the visual signal that the footer belongs to the same page geometry.

All items — copyright phrase, links, and middot separators — share equal visual weight. No item is subordinated to another. This satisfies the German legal requirement (DDG §5, DSGVO) that legal links be "easily accessible" and not visually hidden or de-emphasized relative to surrounding content.

The top border (`1px solid var(--color-border-subtle)`) is applied to the inner content wrapper, not to the `<footer>` element. This keeps the border aligned with the content column edges rather than running viewport-edge to viewport-edge.

#### Wireframes

**Mobile (< 600px)**

```
+-------------------------------------------------+
| <-- viewport (375px) -------------------------> |
|                                                 |
| <-- 1px --color-border-subtle ------------->    |
|.................................................|
|                                                 |
| <20px>  padding-block-start: --section-spacing  |
|         (48px)                                  |
|                                                 |
|         (c) 2026 Ben Peter . LinkedIn .         |
|         Legal Notice . Privacy Policy           |
|                                                 |
| <20px>  padding-block-end: 24px                 |
|                                                 |
|         --content-padding-mobile (20px)         |
+-------------------------------------------------+
```

At 375px viewport with 20px padding both sides, 335px is available. The full line at `--body-font-size-xs` (15px) is approximately 46–50 characters of Source Sans 3, which wraps to two lines. `text-align: center` and `text-wrap: balance` (progressive enhancement) produce a visually balanced two-line block.

**Desktop (>= 900px)**

```
+----------------------------------------------------------------------+
| <-- viewport (900px+) ---------------------------------------------> |
|                                                                      |
| <-- 1px --color-border-subtle ---------------------------------->    |
|......................................................................|
|                                                                      |
| <32px>  padding-block-start: --section-spacing (48px)     <32px>     |
|                                                                      |
|         (c) 2026 Ben Peter . LinkedIn . Legal Notice . Privacy Policy|
|                                                                      |
| <32px>  padding-block-end: 24px                           <32px>     |
|                                                                      |
|         --content-padding-desktop (32px)                             |
|         max-width: --layout-max (1200px), centered                   |
+----------------------------------------------------------------------+
```

At 900px+ with 32px padding each side, the line fits comfortably on a single row. `text-align: left` matches header and body text alignment.

### Typography

| Element | Font | Size | Color | Weight |
|---------|------|------|-------|--------|
| Copyright text ("© 2026") | `--font-body` (inherited) | `--body-font-size-xs` | `--color-text-muted` (inherited) | 400 (inherited) |
| Author name ("Ben Peter") | `--font-body` (inherited) | `--body-font-size-xs` | `--color-link` | 400 (inherited) |
| Middot separators ("·") | `--font-body` (inherited) | `--body-font-size-xs` | `--color-text-muted` (inherited) | 400 (inherited) |
| Link text ("LinkedIn", "Legal Notice", "Privacy Policy") | `--font-body` (inherited) | `--body-font-size-xs` | `--color-link` | 400 (inherited) |

`--body-font-size-xs` is 15px on mobile and 14px on desktop (per `tokens.css` media query at `width >= 900px`). This is the smallest size in the type scale — appropriate for legal attribution text that should be present without being prominent.

All links use `--color-link` (sage green, #7F9A63 light / #9FB68A dark). Using a different, more muted link treatment in the footer would risk making links unrecognizable on a site with very few interactive elements. The standard `--color-link` is already the understated version — using a different color here adds inconsistency without adding restraint.

"Ben Peter" is a link in the current spec (see Open Question 1 for the alternative). Its color matches the other links.

### Spacing & Rhythm

| Spacing zone | Value | Token / Hardcoded | Rationale |
|---|---|---|---|
| Top border | `1px solid var(--color-border-subtle)` | Token | Mirrors header bottom border. Symmetric bookend. Applied to inner content wrapper, not `<footer>`, so it aligns with the content column. |
| Padding above content | `padding-block-start: var(--section-spacing)` | `--section-spacing` (48px) | Matches section rhythm. Generous separation from the last content section. |
| Padding below content | `padding-block-end: 24px` | Hardcoded 24px | Less below — the page ends here. Asymmetric padding reflects the footer's role as a closer, not a section opening. |
| Inline padding (mobile) | `padding-inline: var(--content-padding-mobile)` | `--content-padding-mobile` (20px) | Same as header and main content. |
| Inline padding (tablet, >= 600px) | `padding-inline: var(--content-padding-tablet)` | `--content-padding-tablet` (24px) | Same as header and main content. |
| Inline padding (desktop, >= 900px) | `padding-inline: var(--content-padding-desktop)` | `--content-padding-desktop` (32px) | Same as header and main content. |

The asymmetric vertical padding (48px above, 24px below) is intentional. The footer opens with the rhythm of the page — 48px is the standard section gap — then closes with a tighter margin. The page doesn't need generous breathing room below its last element.

A non-breaking space (`&nbsp;`) between `©` and `2026` and between `2026` and `Ben` ensures the copyright phrase never wraps mid-unit. On mobile, any wrapping falls at middot boundaries.

### Responsive Behavior

| Breakpoint | `text-align` | Wrapping | Inline padding |
|---|---|---|---|
| < 600px | `center` | Natural text wrap. `text-wrap: balance` (progressive enhancement). | `--content-padding-mobile` (20px) |
| >= 600px | `left` | Single line fits at this width | `--content-padding-tablet` (24px) |
| >= 900px | `left` | Single line, comfortable | `--content-padding-desktop` (32px) |

Center-aligned text on mobile creates visual balance when the line wraps to two rows. Left-aligned text at tablet and desktop matches the header logo and body text — all three left edges belong to the same invisible vertical rail.

No width breakpoint is needed between 600px and 900px other than the padding change. The content is a single line of short text; it does not require structural changes across the range.

### Interactions

| Interaction | Behavior |
|---|---|
| Link default | `color: var(--color-link)`, `text-decoration: underline`. Footer links are always underlined. Unlike the header (where the entire component is one link), the footer contains links inline among non-link text. Underline provides a non-color distinguisher, satisfying WCAG 1.4.1 regardless of color contrast. |
| Link hover | `color: var(--color-link-hover)`, `text-decoration: underline`. Color deepens to `--color-link-hover` (heading green). No decoration change on hover — the underline is always present. |
| Link focus-visible | `outline: 2px solid var(--color-heading); outline-offset: 2px`. Matches DDD-002 header focus ring. `--color-heading` achieves 7.75:1 on `--color-background` (light) and 10.42:1 (dark). |
| Link active | No treatment beyond hover. |
| Keyboard navigation | Tab order follows DOM order: "Ben Peter", "LinkedIn", "Legal Notice", "Privacy Policy" (four tab stops with current spec). Resolving Open Question 1 in favor of simplification reduces this to three tab stops. |
| External link (LinkedIn) | `target="_blank" rel="noopener"` on all LinkedIn URLs. Internal links (`/legal`, `/privacy`) open in the same tab. |
| Screen reader | `<footer>` landmark is announced. Links are read as inline text within the paragraph. Literal middot characters ("·") cause a brief natural pause — no `aria-hidden` or `aria-label` needed for middot separators. |
| `prefers-reduced-motion` | No transitions or animations are proposed. No action required. |

---

## HTML Structure

### Authored `/footer` fragment (CMS-authored `.plain.html`)

Following site-structure.md where "Ben Peter" and "LinkedIn" are both links:

```html
<div>
  <p>
    &copy;&nbsp;2026&nbsp;<a href="https://www.linkedin.com/in/benpeter/">Ben Peter</a> · <a href="https://www.linkedin.com/in/benpeter/" target="_blank" rel="noopener">LinkedIn</a> · <a href="/legal">Legal Notice</a> · <a href="/privacy">Privacy Policy</a>
  </p>
</div>
```

If Open Question 1 is resolved in favor of the simplified single-link version:

```html
<div>
  <p>
    &copy;&nbsp;2026&nbsp;<a href="https://www.linkedin.com/in/benpeter/" target="_blank" rel="noopener" aria-label="Ben Peter on LinkedIn">Ben Peter</a> · <a href="/legal">Legal Notice</a> · <a href="/privacy">Privacy Policy</a>
  </p>
</div>
```

**Critical EDS constraint**: All content must be in a **single `<p>` element** with inline links and text nodes. The `decorateButtons()` function in `aem.js` converts any `<a>` that is the sole child of a `<p>` into a `.button` with pill-shaped styling. Placing inline text alongside the links (copyright text, middot separators) prevents this promotion. Never give each link its own `<p>`.

**Middot character**: Use the literal Unicode middot (·, U+00B7), not a hyphen, asterisk, or pipe. It is a standard inline text separator and requires no `<span>` wrapper or ARIA annotation.

### Final decorated DOM after `decorate()` runs

```html
<footer>
  <div class="footer block" data-block-name="footer" data-block-status="loaded">
    <div>
      <div class="section">
        <div class="default-content-wrapper">
          <p>
            © 2026
            <a href="https://www.linkedin.com/in/benpeter/">Ben Peter</a> ·
            <a href="https://www.linkedin.com/in/benpeter/" target="_blank" rel="noopener">LinkedIn</a> ·
            <a href="/legal">Legal Notice</a> ·
            <a href="/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</footer>
```

The nesting is: `footer > .footer > div > .section > .default-content-wrapper > p`. CSS descendant selectors (`footer .footer p`, `footer .footer a`) reach the content cleanly without requiring changes to the fragment structure or the `decorate()` function.

**`decorate()` function**: The current boilerplate `footer.js` is sufficient. It loads the fragment, clears the block, and appends the fragment's children. No DOM restructuring, no class manipulation, and no additional logic are needed. The JS file does not need to change.

---

## CSS Approach

**Layout method**: No flexbox or grid. A single `<p>` of inline text does not require a multi-axis layout system. Standard block layout with `text-align` and responsive `padding-inline` handles all cases.

**Key selectors:**

1. `footer` — background color. Either `background-color: var(--color-background)` to be explicit, or no rule to inherit from `body`. Being explicit prevents future `body` background changes from silently affecting the footer.
2. `footer .footer > div` — the primary layout container. Receives `max-width: var(--layout-max)`, `margin-inline: auto`, responsive `padding-inline`, `padding-block`, and `border-top: 1px solid var(--color-border-subtle)`. The border on this element, not on `footer`, ensures the rule aligns with the content column.
3. `footer .footer p` — `margin: 0` (remove default paragraph margin), `font-size: var(--body-font-size-xs)`, `color: var(--color-text-muted)`, and responsive `text-align`. Setting `font-size` and `color` here allows the child links to inherit font-size and override only color.
4. `footer .footer a:any-link` — `color: var(--color-link)`, `text-decoration: underline`. `:any-link` matches both visited and unvisited states, preventing the default browser distinction between visited and unvisited links in the footer.
5. `footer .footer a:hover` — `color: var(--color-link-hover)`, `text-decoration: underline`. Explicit `text-decoration: underline` on hover prevents any browser reset that might remove the underline on hover.
6. `footer .footer a:focus-visible` — `outline: 2px solid var(--color-heading)`, `outline-offset: 2px`. `:focus-visible` limits the ring to keyboard navigation, suppressing it for mouse clicks.

**Background**: `var(--color-background)`. The current boilerplate value `var(--color-background-soft)` (#EFE9DD) creates a visible tinted band across the bottom of the page. This contradicts the warm-white aesthetic where `--color-background` is the dominant surface. The footer is not a distinct visual zone — it is the page's final line of text.

**`max-width: 1200px`**: Replace the boilerplate hardcoded value with `var(--layout-max)`. The token is the authority; the hardcoded value is opaque to future token changes.

**`text-wrap: balance`**: Applied to `footer .footer p` as a progressive enhancement. Supported in Chrome 114+, Firefox 121+, Safari 17.5+. In older browsers, the paragraph wraps naturally with no visual regression. The balance hint improves the two-line mobile appearance without being load-bearing.

---

## Token Usage

| Element | Property | Token | Status |
|---|---|---|---|
| Footer background | `background-color` | `--color-background` | Existing |
| Footer text | `color` | `--color-text-muted` | Existing |
| Footer text | `font-family` | `--font-body` (inherited) | Existing |
| Footer text | `font-size` | `--body-font-size-xs` | Existing |
| Footer links default | `color` | `--color-link` | Existing |
| Footer links default | `text-decoration` | `underline` | Hardcoded |
| Footer links hover | `color` | `--color-link-hover` | Existing |
| Footer links hover | `text-decoration` | `underline` | Hardcoded |
| Footer links focus ring | `outline-color` | `--color-heading` | Existing |
| Middot separators | `color` | `--color-text-muted` (inherited) | Existing |
| Top border | `border-color` | `--color-border-subtle` | Existing |
| Content max-width | `max-width` | `--layout-max` | Existing |
| Padding above content | `padding-block-start` | `--section-spacing` | Existing |
| Padding below content | `padding-block-end` | `24px` | Hardcoded |
| Mobile inline padding | `padding-inline` | `--content-padding-mobile` | Existing |
| Tablet inline padding | `padding-inline` | `--content-padding-tablet` | Existing |
| Desktop inline padding | `padding-inline` | `--content-padding-desktop` | Existing |

No new tokens proposed. `padding-block-end: 24px` is hardcoded intentionally — the asymmetric closing margin is a one-off value with no semantic analog in the token scale. It does not warrant a new token.

---

## Open Questions

**1. Should "Ben Peter" be the only link, with "LinkedIn" removed?**

Site-structure.md describes "Ben Peter" and "LinkedIn" as separate text links. This DDD follows that spec. However, having two adjacent links to the same URL is unusual UX.

The UX case for simplification:
- Current spec: `© 2026 Ben Peter · LinkedIn · Legal Notice · Privacy Policy` (Ben Peter and LinkedIn both link to `linkedin.com/in/benpeter`)
- Simplified: `© 2026 Ben Peter · Legal Notice · Privacy Policy` where "Ben Peter" carries `aria-label="Ben Peter on LinkedIn"` and `target="_blank" rel="noopener"`

Arguments for simplification:
- Eliminates a redundant destination (both links go to the same place)
- Reduces cognitive load and tab stops by one
- No about page exists on this site — "Ben Peter" as a link has nowhere better to go than LinkedIn
- Cleaner, shorter line

Arguments for keeping the current spec:
- "LinkedIn" as visible link text explicitly signals the platform — no hover required to discover the destination
- The current spec matches site-structure.md without requiring a spec change
- Instant recognition: "LinkedIn" is understood without reading the `aria-label`
- Pattern is standard for author footers

No change to site-structure.md is proposed here. This question is flagged for human resolution.

**2. `--color-text-muted` contrast fails WCAG AA at `--body-font-size-xs`**

The footer uses `--color-text-muted` (#817B6F on light mode) on `--color-background` (#F6F4EE). Computed contrast: approximately 3.82:1. WCAG 1.4.3 AA requires 4.5:1 for normal text. At `--body-font-size-xs` (14–15px, weight 400), this is normal text, not large text. The failure margin is 0.68 below threshold.

This is a site-wide token-level issue, not a footer-specific one. The comment in `tokens.css` line 22 states "WCAG AA compliant on --color-background" — this comment is incorrect. Options:

- **Accept as a conscious deviation**: Treat muted metadata text as intentionally subordinate, document the known failure. The copyright text is supplementary — it adds no information a user needs for navigation or comprehension.
- **Use `--color-text` instead** (#3A3A33, ~9.15:1): Passes AA, but makes the footer visually equivalent in weight to body text, undermining the intended quiet treatment.
- **Darken `--color-text-muted` in `tokens.css`**: A site-wide token change that would affect all muted text (dates, metadata, tagline). Requires its own design review.

Resolution is out of scope for this DDD.

**3. `--color-link` contrast fails WCAG 1.4.3 AA site-wide**

`--color-link` (#7F9A63 on light mode) on `--color-background` (#F6F4EE): approximately 2.85:1 — fails the 4.5:1 AA threshold. The footer's `text-decoration: underline` mitigates the 1.4.1 distinguishability requirement (links are identifiable by decoration, not color alone), but does not address the 1.4.3 color contrast requirement for the link text itself.

This is a site-wide token-level failure. Resolution requires a change to `--color-link` in `tokens.css`. Out of scope for this DDD.

---

## Decision

- [ ] Approved
- [ ] Approved with changes
- [ ] Rejected

### Reviewer Notes

_Human writes here during review._
