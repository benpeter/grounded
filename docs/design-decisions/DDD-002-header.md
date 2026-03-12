# DDD-002: Header

Status: **Proposal**

## Context

The header is the site's primary brand surface. It appears on every page and carries the blog's identity: the name, the tagline, and the visual concept that gives the site its thesis. Because it is the first thing every visitor sees, every decision here — typography, spacing, corruption treatment — must be right before anything else ships.

### Governing constraints

**Brand identity**

The logo is typographic only — no logomark, no icon. "Mostly" is solid and grounded: clean Source Code Pro, regular weight. "Hallucinations" carries subtly corrupted letterforms — "a stroke that doesn't quite close, a counter that drifts, serifs that appear where they shouldn't on a monospaced face." The corruption evokes the look of AI-generated text in images: plausible at first glance, uncanny on closer inspection. The contrast between the two words IS the concept.

**Aesthetic rules (CLAUDE.md)**

- `--color-heading` (#3F5232) is the strongest color on the page. Everything else recedes.
- `--color-accent` (gold) appears at most once per screen — a focus ring, a pull-quote border. Never as a theme color.
- No cards with shadows, no gradients, no rounded containers, no hero images, no decorative icons.
- Typography creates hierarchy, not color blocks or boxes.

**Site structure (docs/site-structure.md)**

- Header: logo text + tagline. No navigation links, no hamburger menu, no search.
- "Mostly Hallucinations" in Source Code Pro, `--color-heading`.
- "Generated, meet grounded." in lighter weight or `--color-text-muted`.
- The header links home. That is all.

**DDD-001 layout contract**

DDD-001 establishes the two-tier width model (`--layout-max` / `--measure`), the padding tokens (`--content-padding-mobile`, `--content-padding-tablet`, `--content-padding-desktop`), and section spacing (`--section-spacing`). The header uses `--layout-max` as its outer constraint with the same padding tokens, so the logo's left edge aligns with body text in main content. This answers DDD-001 Open Question #1: the header constrains to `--layout-max`, not `--measure`.

**Design tokens (styles/tokens.css)**

All tokens referenced in this document exist in `styles/tokens.css`. No new tokens are proposed.

**Boilerplate state**

The current `blocks/header/header.js` is the AEM boilerplate default: 171 lines of navigation scaffolding (hamburger menu, dropdown toggles, escape-key handlers, `aria-expanded` state management). The current `blocks/header/header.css` implements a grid layout for `hamburger | brand | tools` areas with `position: fixed` on mobile. None of this scaffolding applies to a logo-and-tagline header with zero navigation items. The implementation must replace, not extend, the boilerplate header.

---

## Proposal

### Layout

The header is a **stacked three-line arrangement**, left-aligned to the content column edge:

```
Line 1: "Mostly"                    (small, regular weight -- the qualifier)
Line 2: "Hallucinations"            (large, semibold -- the name)
Line 3: "Generated, meet grounded." (small, italic, muted -- the tagline)
```

Left-aligned, not centered. The left edge of "Mostly" aligns with the left edge of body text in main content, governed by the `--content-padding-*` tokens from DDD-001.

The header scrolls with the page (`position: relative` at all breakpoints). It is NOT fixed or sticky. Rationale: this site has no navigation items needing persistent access. A fixed header would sacrifice 80px (12-15% of a mobile viewport) on a non-interactive element.

#### Wireframes

**Mobile (< 600px)**

```
+-------------------------------------------------+
| <-- viewport -------------------------------->  |
|                                                 |
| <20px>                              <20px>      |
|        Mostly                                   |
|        Hallucinations                           |
|        Generated, meet grounded.                |
|                                                 |
|        --content-padding-mobile (20px)          |
|.................................................|
|        1px --color-border-subtle                |
+-------------------------------------------------+
```

**Desktop (>= 900px)**

```
+----------------------------------------------------------------------+
| <-- viewport (900px+) ---------------------------------------------> |
|                                                                      |
| <32px>                                                    <32px>     |
|        Mostly                                                        |
|        Hallucinations                                                |
|        Generated, meet grounded.                                     |
|                                                                      |
|        --content-padding-desktop (32px)                              |
|        max-width: --layout-max (1200px), centered                    |
|......................................................................|
|        1px --color-border-subtle                                     |
+----------------------------------------------------------------------+
```

### Typography

| Element | Font | Weight | Size Strategy | Color | Line-height |
|---|---|---|---|---|---|
| "Mostly" | `--font-heading` (Source Code Pro) | 400 (regular) | ~55-60% of "Hallucinations" size. Fluid via `clamp()`. | `--color-heading` | `--line-height-heading` (1.25) |
| "Hallucinations" | `--font-heading` (Source Code Pro) | 600 (semibold) | `clamp(28px, 8vw, 42px)`. The 42px max matches the `width >= 900px` override of `--heading-font-size-xxl` (base value 48px, desktop value 42px). At mobile widths, 8vw on a 375px viewport yields ~30px. | `--color-heading` | `--line-height-heading` (1.25) |
| Tagline | `--font-editorial` (Source Serif 4) | 400 italic | `--body-font-size-xs` (15px mobile / 14px desktop) | `--color-text-muted` | 1.4 |

**Rationale for size choices:**

- "Hallucinations" at `clamp(28px, 8vw, 42px)` is the visual anchor. The 42px max matches the desktop `--heading-font-size-xxl`, establishing the logo as equivalent in visual weight to a page's primary heading without competing (since the logo uses `<span>`, not `<h1>`).
- "Mostly" at 55-60% of "Hallucinations" creates a deliberate subordination. "Mostly" is the qualifier; "Hallucinations" is the name. The size difference reinforces this semantic relationship without needing color differentiation.
- The tagline in `--font-editorial` (Source Serif 4, italic) introduces the third typeface at the smallest size on the page. The serif italic signals editorial voice — a human speaking, not a system label. `--body-font-size-xs` keeps it subordinate to both logo words.

### Corrupted Letterforms

This is the most critical design element in the header. The treatment must communicate the site's thesis — the tension between AI-generated plausibility and practitioner groundedness — without impeding readability.

**Governing principle**: "Hallucinations" must be instantly readable. Corruption is a secondary-processing discovery — something the brain registers a beat after reading. If any reader pauses to decode a letter, the design has crossed the line.

**Corruption rules:**

1. **Structural legibility preserved** for every letter. Corruption occurs at the detail level only — never at the structural level.
2. **5 of 14 letters corrupted.** The rest are pristine Source Code Pro glyphs.
3. **No two adjacent letters corrupted.** Clean letters buffer corrupted ones, preventing cumulative visual noise.
4. **Corruption density increases toward end of word** — mimicking the way AI text generation degrades as context drifts. The first third of the word is mostly clean; the last third carries the most corruption.
5. **Corruption types are consistent and systematic** — design intent, not rendering bugs. Each corruption belongs to a defined type with a rationale.
6. **"Mostly" (clean) vs "Hallucinations" (corrupted)** contrast IS the concept. "Mostly" must remain pristine Source Code Pro.

**Corruption map** (ILLUSTRATIVE — specific letter assignments may change during design review):

| Position | Letter | Status | Corruption Type | Description |
|---|---|---|---|---|
| 1 | H | Clean | -- | Anchor letter. First impression is solid. |
| 2 | a | Clean | -- | Early letters stay grounded. |
| 3 | l | Clean | -- | -- |
| 4 | l | **Corrupted** | Stroke overshoot | Vertical stroke extends ~2px below baseline. |
| 5 | u | Clean | -- | Breathing room. |
| 6 | c | **Corrupted** | Counter closure | Open counter curls inward ~1.5px, nearly closing into 'o'. |
| 7 | i | Clean | -- | -- |
| 8 | n | **Corrupted** | Phantom serif | A 1px horizontal serif at baseline of right stem. Does not belong on a monospaced face. |
| 9 | a | Clean | -- | -- |
| 10 | t | **Corrupted** | Asymmetric crossbar | Crossbar extends ~2px further right than left. |
| 11 | i | Clean | -- | -- |
| 12 | o | Clean | -- | -- |
| 13 | n | **Corrupted** | Broken junction | Arch does not connect to right stem — ~1px gap at top-right junction. |
| 14 | s | Clean | -- | Final letter lands clean. Resolution. |

**Testability**: Show the header to someone for one second, then ask them to type the blog name. If they type "Mostly Hallucinations" without hesitation, the corruption level is right. If they pause on any letter, it is too heavy.

### Spacing & Rhythm

| Gap | Value | Notes |
|---|---|---|
| "Mostly" to "Hallucinations" | 0 (natural line stacking) | `--line-height-heading` (1.25) provides the visual gap between lines. No additional margin. |
| "Hallucinations" to tagline | 8px | Enough separation to distinguish tagline from logo text; tight enough to read as a single branded unit. |
| Header top/bottom | Vertical centering within `min-height: var(--nav-height)` | Content centered via flexbox. |
| Header bottom border | `1px solid var(--color-border-subtle)` | Faintest structural separation between header and page content. Near-invisible on `--color-background`. |

### Responsive Behavior

| Breakpoint | Behavior |
|---|---|
| < 600px | Stacked three-line layout. Font sizes at lower `clamp()` range (~28-30px for "Hallucinations"). Corruption effects at sub-pixel scale may naturally disappear — this is acceptable graceful degradation. Padding: `--content-padding-mobile` (20px). |
| >= 600px | Same layout. Sizes grow via `clamp()`. Corruption becomes visible. Padding: `--content-padding-tablet` (24px). |
| >= 900px | Same layout. Sizes at upper `clamp()` range (42px for "Hallucinations"). Corruption clearly visible. Padding: `--content-padding-desktop` (32px). |
| All | `position: relative`. No fixed positioning. No scroll-triggered behavior. |

Note: The stacked three-line layout may exceed the 80px `--nav-height` value, especially on mobile. The header uses `min-height: var(--nav-height)`, not `height`, to accommodate this.

### Interactions

| Interaction | Behavior |
|---|---|
| Home link | The entire logo and tagline are wrapped in a single `<a href="/">`. One tab stop. |
| Hover | No color change. No underline. Cursor: pointer. |
| Focus | Visible focus ring using `--color-accent` or a contrast-safe alternative (see DDD-001 OQ#5 regarding focus ring contrast). |
| Screen reader | `aria-label="Mostly Hallucinations - home"` on the link. Clean accessible name regardless of visual corruption treatment. |
| `prefers-reduced-motion` | If any transitions are applied to corruption effects, they are removed. Static displacement remains — it is a design element, not animation. |

---

## HTML Structure

The semantic HTML the header block produces after decoration:

```html
<header>
  <div class="header block" data-block-name="header" data-block-status="loaded">
    <div class="nav-wrapper">
      <nav id="nav" aria-label="Site">
        <a href="/" class="site-logo" aria-label="Mostly Hallucinations - home">
          <span class="logo-text">
            <span class="logo-word-mostly">Mostly</span>
            <span class="logo-word-hallucinations">
              <!-- Implementation determines inner structure:
                   CSS approach: per-letter <span> elements
                   SVG approach: inline SVG with role="img" aria-hidden="true" -->
              Hallucinations
            </span>
          </span>
          <span class="tagline">Generated, meet grounded.</span>
        </a>
      </nav>
    </div>
  </div>
</header>
```

**Key decisions:**

- **`<nav>` retained** — the header IS the site's navigation landmark (it links home). `aria-label="Site"` identifies it.
- **Single `<a>` wrapping all content.** One tab stop. The entire header is the home link.
- **`<span>` not headings for logo text.** The page `<h1>` belongs to page content, not the site logo. Using headings here would break heading hierarchy on every page.
- **Separate spans for "Mostly" and "Hallucinations"** enable independent styling: different weights, sizes, and the corruption treatment on "Hallucinations" only.
- **`aria-label` provides the accessible name** regardless of whether corruption is implemented via CSS transforms or SVG paths. Screen readers announce "Mostly Hallucinations - home" consistently.

**Authored content (nav fragment):**

The CMS-authored `/nav` fragment provides this source markup:

```html
<div>
  <p><a href="/">Mostly Hallucinations</a></p>
  <p><em>Generated, meet grounded.</em></p>
</div>
```

The `decorate()` function reads this and produces the structure above. If JavaScript fails, the fragment's plain text link remains functional as a fallback.

---

## CSS Approach

### Layout Method

Flexbox, column direction. Three lines of text stacked vertically with no horizontal complexity. Grid would add overhead for a single-axis layout.

### Key Decisions

1. **Width alignment with DDD-001**: `.nav-wrapper` uses `max-width: var(--layout-max)`, `margin-inline: auto`, and the same `--content-padding-*` tokens as `main > .section > div`. This ensures the logo's left edge aligns precisely with body text in main content.

2. **`position: relative` at all breakpoints**: The boilerplate's `position: fixed` on mobile is replaced with `position: relative`. There is nothing in the header that warrants persistent viewport presence.

3. **Boilerplate navigation scaffolding does not apply**: The boilerplate `header.js` (171 lines) implements hamburger menus, dropdown toggles, escape-key handlers, and `aria-expanded` state management. The boilerplate `header.css` implements a three-column grid (`hamburger | brand | tools`) with mobile overlay behavior. None of this applies to a logo-and-tagline header with zero navigation items. The implementation needs a replacement `decorate()` function that reads the nav fragment and produces the HTML Structure defined above.

4. **`min-height` replaces `height`**: `min-height: var(--nav-height)` instead of a fixed height. The stacked three-line layout may exceed 80px, especially on mobile where "Hallucinations" wraps or padding adds up. `min-height` accommodates this without clipping.

5. **Home link styling**: `text-decoration: none`, `color: inherit`. No visual change on hover except `cursor: pointer`. The logo is not a standard text link — it should not behave like one.

6. **Header bottom border**: `1px solid var(--color-border-subtle)`. Structural separation that nearly melts into the background, consistent with the aesthetic rule that borders are barely visible.

### Corruption Effect — Implementation Approaches

**Approach A: CSS-only with per-letter spans** — `decorate()` splits "Hallucinations" into individual `<span>` elements. Corrupted letters receive CSS transforms (`translateY`, `rotate`, `skewX`) to simulate the specified corruptions. Zero additional asset weight, live text for selection and accessibility, straightforward implementation. Limitation: CSS transforms move entire glyphs. "Counter closure" (c becoming more like o) and "broken junction" (gap in n's arch) require modifying glyph anatomy, which transforms cannot do. Only 2-3 of 5 corruption types achievable with full fidelity.

**Approach B: Inline SVG for "Hallucinations"** — "Hallucinations" rendered as an inline SVG with hand-modified glyph outlines extracted from Source Code Pro. Full control over all 5 corruption types at the path level. Estimated 2-4KB. Uses `fill="currentColor"` for automatic dark mode support. `role="img"` and `aria-hidden="true"` on the SVG (accessible name handled by the parent link's `aria-label`). Limitation: requires extracting and editing glyph paths from the font file — higher implementation complexity.

**Recommendation**: Start with CSS-only (Approach A). Prototype and evaluate visually. Escalate to SVG (Approach B) if the achievable corruption types feel insufficient. A hybrid approach is also viable — CSS transforms for overshoot, asymmetry, and phantom serif; SVG only for the two types requiring path modification.

### Font Size Scaling

`clamp()` for fluid scaling of both logo words. "Hallucinations" at `clamp(28px, 8vw, 42px)`. "Mostly" proportionally smaller at approximately 55-60% of that size. No media-query breakpoints needed for font sizing — `clamp()` handles the entire range.

---

## Token Usage

| Element | Property | Token | Status |
|---|---|---|---|
| Header background | `background-color` | `--color-background` | Existing |
| Logo "Mostly" | `font-family` | `--font-heading` | Existing |
| Logo "Mostly" | `color` | `--color-heading` | Existing |
| Logo "Mostly" | `line-height` | `--line-height-heading` | Existing |
| Logo "Hallucinations" | `font-family` | `--font-heading` | Existing |
| Logo "Hallucinations" | `color` | `--color-heading` | Existing |
| Logo "Hallucinations" | `line-height` | `--line-height-heading` | Existing |
| Tagline | `font-family` | `--font-editorial` | Existing |
| Tagline | `color` | `--color-text-muted` | Existing |
| Tagline | `font-size` | `--body-font-size-xs` | Existing |
| Header bottom border | `border-color` | `--color-border-subtle` | Existing |
| Header height | `min-height` | `--nav-height` | Existing |
| Header max-width | `max-width` | `--layout-max` | Existing |
| Mobile padding | `padding-inline` | `--content-padding-mobile` | Existing |
| Tablet padding | `padding-inline` | `--content-padding-tablet` | Existing |
| Desktop padding | `padding-inline` | `--content-padding-desktop` | Existing |
| Focus ring | `outline-color` | `--color-accent` (or contrast-safe alternative) | Existing |

All tokens exist in `styles/tokens.css`. No new tokens proposed.

---

## Open Questions

1. **CSS vs. SVG for corruption effect**: CSS can achieve 2-3 of 5 corruption types with full fidelity (stroke overshoot, asymmetric crossbar, phantom serif as approximation). SVG achieves all 5. The implementation agent should prototype CSS first and escalate to SVG if the rendered result feels insufficient. This is a judgment call requiring visual evaluation.

2. **`--nav-height` adequacy**: The stacked three-line layout — "Mostly" at ~17px, "Hallucinations" at 28-42px, tagline at 14-15px, plus internal spacing and container padding — may exceed 80px at certain viewport widths. `min-height` accommodates this. The implementation agent should verify at 320px, 375px, and 414px viewport widths.

3. **Mobile corruption visibility**: At 28px font size for "Hallucinations", 1-2px corruptions may fall below the sub-pixel threshold. Accept that corruption gracefully degrades to clean text on small screens. The effect is a bonus on desktop, not a requirement on mobile.

4. **Favicon and social avatar**: Brand identity specifies "MH" for small-size applications. This is a separate deliverable — not in scope for header implementation.

---

## Decision

- [ ] Approved
- [ ] Approved with changes
- [ ] Rejected

### Reviewer Notes

_{Human writes here during review}_
