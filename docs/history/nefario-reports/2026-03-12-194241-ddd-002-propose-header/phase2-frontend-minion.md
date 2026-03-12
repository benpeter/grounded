## Domain Plan Contribution: frontend-minion

### Recommendations

#### 1. EDS Fragment Structure: Simplify to brand-only

The current `header.js` maps the first three children of the nav fragment to `nav-brand`, `nav-sections`, and `nav-tools`. It then creates a hamburger, wires up keyboard navigation, toggle state, and `aria-expanded` across all three areas. Nearly all of this (110+ lines of JS, 270+ lines of CSS) is navigation scaffolding that this header does not need.

**Recommendation: Author the nav fragment with a single section containing only the brand content.** The nav document (authored in the CMS or as a static `.plain.html`) should produce:

```html
<div>
  <p><a href="/">Mostly Hallucinations</a></p>
  <p><em>Generated, meet grounded.</em></p>
</div>
```

That is one section. The boilerplate code will assign it `nav-brand`. `nav.children[1]` and `nav.children[2]` will be `undefined`, so the `if (section)` guard on line 130 of the current header.js means no `nav-sections` or `nav-tools` classes are applied — which is correct behavior. However, the hamburger is still unconditionally created and appended (lines 155-161), and `toggleMenu` is still called (line 164), both of which reference `navSections` (which will be `null` from the querySelector on line 140). While the null checks prevent crashes, we still get an empty hamburger button in the DOM and unnecessary event listeners.

**The header.js must be rewritten, not patched.** Attempting to keep the boilerplate header.js and just feed it a single-section fragment will leave dead DOM (the hamburger `<div>`) and dead code paths. A clean rewrite is smaller, faster, and easier to maintain.

#### 2. Semantic HTML Structure

After decoration, the header should produce this DOM:

```html
<header>
  <div class="header block" data-block-name="header" data-block-status="loaded">
    <div class="nav-wrapper">
      <nav id="nav" aria-label="Site">
        <a href="/" class="site-logo" aria-label="Mostly Hallucinations - home">
          <span class="logo-text">
            <span class="logo-word-mostly">Mostly</span>
            <span class="logo-word-hallucinations">Hallucinations</span>
          </span>
          <span class="tagline">Generated, meet grounded.</span>
        </a>
      </nav>
    </div>
  </div>
</header>
```

Key decisions in this structure:

- **`<nav>` is retained** even though there are no nav links. The header IS the site's navigation landmark (it links home). `aria-label="Site"` differentiates it from any future nav landmarks. However, if reviewers prefer, a `<div role="banner">` would also be semantically valid. I recommend `<nav>` for consistency with the EDS boilerplate pattern — other EDS blocks and the `aem.js` loadHeader pipeline expect the header block to behave like a standard block, and keeping `<nav>` avoids surprising future collaborators.

- **The entire logo+tagline is a single `<a>`** linking home. This is one tab stop, one interactive target. The tagline is part of the brand identity, not a separate element to navigate to.

- **`<span>` elements, not headings, for the logo text.** The site name in the header is not a content heading — the page's `<h1>` belongs to the page content, not the site chrome. Using `<span>` avoids polluting the heading hierarchy.

- **Two separate `<span>` elements for "Mostly" and "Hallucinations"** allow independent styling. The corruption effect targets only the second word. This split happens in JS during decoration — the authored content is a single text string "Mostly Hallucinations" so authors never deal with markup complexity.

- **`aria-label` on the link** provides a clean accessible name that reads naturally ("Mostly Hallucinations - home") regardless of how the visual corruption effect renders. Screen readers ignore the nested spans.

#### 3. Corrupted Letterforms: CSS-only with inline SVG fallback option

The corruption effect on "Hallucinations" should convey "AI-generated text that isn't quite right" — letterforms that shift, glitch, or degrade. Here are the feasible approaches ranked by recommendation:

**Recommended: CSS-only with `@font-face` subsetting (primary) + CSS transforms (enhancement)**

The most robust approach layers two CSS-only techniques:

**Layer A: Per-letter CSS transforms via `<span>` wrapping in JS**

During decoration, the JS splits "Hallucinations" into individual `<span class="glyph">` elements and applies CSS custom properties for per-letter corruption parameters:

```javascript
// In header.js decorate()
const word = 'Hallucinations';
const corruptionMap = [
  // [letterIndex, translateY, rotate, opacity, skewX]
  [3, -2, 1.5, 0.85, 0],     // 'l' slightly lifted
  [7, 1, -1, 0.9, 2],        // 'a' slightly dropped and skewed
  [10, -1.5, 0.8, 0.8, -1],  // 'o' shifted and faded
  [13, 0, -2, 0.75, 0],      // 's' rotated and faded
];

const glyphs = [...word].map((char, i) => {
  const span = document.createElement('span');
  span.className = 'glyph';
  span.textContent = char;
  const corruption = corruptionMap.find(([idx]) => idx === i);
  if (corruption) {
    const [, ty, rot, op, sk] = corruption;
    span.style.setProperty('--g-ty', `${ty}px`);
    span.style.setProperty('--g-rot', `${rot}deg`);
    span.style.setProperty('--g-op', op);
    span.style.setProperty('--g-sk', `${sk}deg`);
    span.classList.add('corrupted');
  }
  return span;
});
```

```css
.logo-word-hallucinations .glyph {
  display: inline-block;
  /* GPU-accelerated properties only */
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.logo-word-hallucinations .glyph.corrupted {
  transform:
    translateY(var(--g-ty, 0))
    rotate(var(--g-rot, 0deg))
    skewX(var(--g-sk, 0deg));
  opacity: var(--g-op, 1);
}
```

This approach:
- Uses only GPU-accelerated properties (`transform`, `opacity`) — no layout thrashing
- Controls every parameter via CSS custom properties, themeable in `tokens.css`
- Works in all browsers with no build step
- Total CSS: ~15-20 lines. Total JS: ~25 lines.
- The corruption values are subtle (1-2px shifts, 1-2deg rotations) — they register as "something is off" without being garish.

**Layer B (optional enhancement): `mix-blend-mode` or `filter` for chromatic aberration**

For an additional "digital corruption" feel, a CSS pseudo-element on the corrupted word can produce a subtle chromatic shift:

```css
.logo-word-hallucinations {
  position: relative;
}

.logo-word-hallucinations::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  color: var(--color-accent);
  opacity: 0.08;
  transform: translate(1px, -1px);
  pointer-events: none;
  aria-hidden: true; /* handled via attr, not ARIA — see note below */
}
```

This creates a ghost duplicate offset by 1px in gold, at 8% opacity — barely visible, but it produces the "misregistered print" effect. Performance cost is negligible (one extra paint layer, composited). The `attr(data-text)` for `content` requires the JS to set `data-text="Hallucinations"` on the span during decoration.

**Important note on `aria-hidden`:** CSS `::after` pseudo-elements with `content` are read by screen readers. Since the `aria-label` on the parent `<a>` already provides the accessible name, and the pseudo-element duplicates text, we must ensure the pseudo-element is not announced. The `aria-label` on the link already overrides descendant text content for screen readers, so this is handled. But if the logo were ever extracted outside the link, the duplicate text would be a problem.

**Why NOT inline SVG?**

Inline SVG for the logo text was considered and rejected for this project:

- SVG text does not use CSS `font-family` from the document — fonts must be embedded or linked within the SVG, adding complexity and potentially duplicating font loads.
- SVG text does not respect the document's `font-size` tokens — it uses its own coordinate system, making responsive scaling more complex.
- SVG adds DOM weight and is harder for authors to update (they can not edit SVG text in the CMS).
- The corruption effect we need (subtle glyph displacement) is fully achievable with CSS transforms on `<span>` elements.
- SVG would be appropriate if we needed path-level glyph distortion (warped outlines, melting letterforms). That level of effect exceeds the "quiet guest" aesthetic.

**Why NOT `canvas` or WebGL?**

Far too heavy for a site logo. Inaccessible by default. Fails the 100KB performance budget. Not considered.

**`prefers-reduced-motion` handling:**

```css
@media (prefers-reduced-motion: reduce) {
  .logo-word-hallucinations .glyph.corrupted {
    /* Keep static displacement but remove transitions */
    transition: none;
  }
}
```

The static displacement remains (it is part of the visual identity, not animation). Only transitions/animations are removed.

#### 4. Positioning: `position: relative` everywhere

The boilerplate header uses `position: fixed` on mobile and `position: relative` on desktop (>= 900px). This made sense for a header with navigation that users need persistent access to. This header has no navigation. Fixed positioning would:

- **Steal 80px of vertical reading space on mobile** — on a 667px iPhone SE viewport, that is 12% of the screen permanently consumed by a logo and tagline the user has already seen.
- **Require `body` top padding/margin** to prevent content from hiding behind the fixed header — adding CSS coupling.
- **Produce a visual layer** (z-index stacking, background color enforcement) that conflicts with the "warm white paper" aesthetic where the header melts into the page.

**Recommendation: `position: relative` at all breakpoints.** The header scrolls with the page. It is seen on arrival, then it is gone. This maximizes reading space and reinforces the editorial feel.

The `--nav-height` token (80px) is currently used by `styles.css` to reserve height on `<header>`:

```css
header {
  height: var(--nav-height);
}
```

With `position: relative`, this height reservation becomes the actual content height, not a collision-avoidance spacer. It should remain but could be adjusted to `min-height` for flexibility if the logo and tagline need more than 80px on very narrow screens. The implementation should verify at 320px viewport width that the two-line logo plus tagline fit within 80px with `font-size` at `--heading-font-size-xxl` (48px mobile). They likely will not — see Risk #2 below.

#### 5. Layout Alignment with DDD-001

The header must respect the same `--layout-max` (1200px) and padding system as `main > .section > div`. The current boilerplate header.css already does this approximately:

```css
/* Current boilerplate */
header nav {
  max-width: 1248px;  /* hardcoded, should be calc(var(--layout-max) + 2 * var(--content-padding-desktop)) */
  padding: 0 24px;    /* hardcoded, should use tokens */
}
```

**Recommendation: Apply the DDD-001 token contract to the nav-wrapper.**

```css
header .nav-wrapper {
  max-width: var(--layout-max);
  margin-inline: auto;
  padding-inline: var(--content-padding-mobile);
}

@media (width >= 600px) {
  header .nav-wrapper {
    padding-inline: var(--content-padding-tablet);
  }
}

@media (width >= 900px) {
  header .nav-wrapper {
    padding-inline: var(--content-padding-desktop);
  }
}
```

This mirrors the `main > .section > div` rules from DDD-001 exactly. The header's visual left edge aligns perfectly with the main content's left edge at every breakpoint.

DDD-001's Open Question #1 asked: "Should the header and footer constrain to `--measure` (matching reading content) or `--layout-max` (full layout width)?" For this minimal header, the answer depends on the visual: if the logo is large (`--heading-font-size-xxl`, 48px/42px), it fills a meaningful portion of `--measure` and `--layout-max` produces no visible difference at typical viewport widths. I recommend `--layout-max` as the outer constraint with the logo content left-aligned (not centered) within it. This creates a consistent left edge that the eye can follow from header through content. The `--measure` constraint is for reading text, not brand elements.

---

### Proposed Tasks

#### Task 1: Author the nav fragment content
Create the nav content that the header block will load. Since this project uses da.live as its content source, the fragment must be authored there. For local development, create a static HTML file at `drafts/nav.plain.html` matching the EDS fragment structure:

```html
<div>
  <p><a href="/">Mostly Hallucinations</a></p>
  <p><em>Generated, meet grounded.</em></p>
</div>
```

Pass `--html-folder drafts` to the dev server. The actual CMS nav document should be authored to match.

**Dependency:** None. Can start immediately.

#### Task 2: Rewrite header.js
Replace the boilerplate header.js with a minimal decorator:

1. Load the nav fragment (keep the `getMetadata('nav')` pattern).
2. Extract the brand text and tagline from the fragment's first section.
3. Build the semantic DOM structure: `<nav>` > `<a>` > logo spans + tagline span.
4. Split "Hallucinations" into per-letter `<span>` elements and apply corruption CSS custom properties.
5. Set `data-text` attribute for the chromatic aberration pseudo-element.
6. Wrap in `.nav-wrapper` and append to block.

Remove: hamburger, toggleMenu, toggleAllNavSections, closeOnEscape, closeOnFocusLost, openOnKeydown, focusNavSection, aria-expanded state management, nav-sections/nav-tools logic.

Estimated JS: ~50 lines (down from 171).

**Dependency:** Task 1 (need the fragment structure defined to know what to extract).

#### Task 3: Rewrite header.css
Replace the boilerplate header.css with minimal styling:

1. `.nav-wrapper`: `position: relative`, DDD-001 token-based max-width and padding, `background-color: var(--color-background)`.
2. `nav`: flex layout (logo and tagline stacked vertically), height governed by `--nav-height` or `min-height`.
3. `.site-logo` link: reset link styles, `text-decoration: none`, `color: inherit`.
4. `.logo-word-mostly`: `font-family: var(--font-heading)`, `color: var(--color-heading)`, `font-weight: 600`.
5. `.logo-word-hallucinations`: same base styles, plus corruption glyph rules.
6. `.tagline`: `font-family: var(--font-editorial)` (Source Serif 4 — italic tagline in the editorial font), `color: var(--color-text-muted)`, `font-size: var(--body-font-size-s)`.
7. Responsive font sizing for the logo text (see Risk #2).
8. `prefers-reduced-motion` media query.
9. `prefers-color-scheme: dark` — corruption effect may need opacity/color adjustments for dark mode.

Estimated CSS: ~60-80 lines (down from 273).

**Dependency:** Task 2 (CSS selectors must match the JS-produced DOM).

#### Task 4: Add header-specific tokens to tokens.css
If any new tokens are needed (corruption parameters, logo font size), add them to `tokens.css`. Candidates:

- `--logo-font-size`: if the logo size differs from `--heading-font-size-xxl` at any breakpoint.
- `--corruption-intensity`: a multiplier (0 to 1) controlling the overall strength of glyph displacement, enabling easy tuning.

These should be minimal — avoid over-tokenizing. The corruption values themselves are implementation details of header.css, not global design tokens.

**Dependency:** None.

#### Task 5: Create a header test page
Create `drafts/header-test.html` with a realistic page structure (header + main content + footer placeholder) to verify:
- Logo text renders correctly at all breakpoints.
- Corruption effect is visible but subtle.
- Header left edge aligns with main content left edge.
- `--nav-height` properly sizes the header.
- Dark mode renders correctly.
- Reduced motion preference is respected.

**Dependency:** Tasks 2, 3.

#### Task 6: Lint and performance verification
Run `npm run lint` to verify the new JS and CSS pass Airbnb ESLint and Stylelint configs. Measure the new header.css + header.js size against the boilerplate originals to confirm the size reduction.

**Dependency:** Tasks 2, 3.

---

### Risks and Concerns

**Risk 1: Logo text wrapping at narrow viewports**

"Mostly Hallucinations" at `--heading-font-size-xxl` (48px) in Source Code Pro (monospace — wider than proportional fonts) will not fit on a single line at 320px viewport width. At 48px in a monospace font, each character is approximately 28-30px wide. "Mostly Hallucinations" is 22 characters (including space), requiring approximately 616-660px. Even at 375px with 20px padding on each side (335px content width), it will not fit on one line.

**Mitigation options (ranked):**
1. **Allow natural two-line wrapping:** "Mostly" on line 1, "Hallucinations" on line 2. This naturally creates the visual split and may actually look better — the two words already need separate styling. Adjust `--nav-height` to `min-height` to accommodate.
2. **Reduce mobile logo font size:** Use a smaller token (e.g., `--heading-font-size-xl` at 36px) on mobile. At 36px monospace, "Hallucinations" alone is ~420px, still over 335px. Even at `--heading-font-size-l` (28px), "Hallucinations" is ~14 chars * ~17px = ~238px — this fits, but 28px may feel too small for the primary brand element.
3. **Use `font-size: clamp()`:** e.g., `font-size: clamp(28px, 8vw, 48px)` to scale fluidly. This avoids breakpoint jumps and is the most flexible approach.

**Recommendation: Option 3 (clamp) as the sizing strategy, with option 1 (natural wrapping) as the expected layout at narrow widths.** The two-line wrap at narrow viewports is actually desirable — it mirrors the natural reading of the name.

**Risk 2: `--nav-height: 80px` is insufficient**

With the logo at 48px (line-height ~1.25 = 60px) plus the tagline at `--body-font-size-s` (17px, line-height ~1.7 = 29px), the total content height is approximately 89px before any padding. On mobile with two-line wrapping, the logo alone could be 120px tall.

**Mitigation:** Change the `header` CSS from `height: var(--nav-height)` to `min-height: var(--nav-height)`. The `--nav-height` token then sets a minimum rather than a fixed constraint. The CLS (Cumulative Layout Shift) risk from removing the fixed height is low because the header is lazy-loaded — by the time it paints, the main content section is already laid out and visible.

Actually, a more nuanced point: `styles.css` sets `header { height: var(--nav-height) }` as a height reservation to prevent CLS when the header block loads lazily. If we change this to `min-height`, the header may start at 80px and then shift to 120px when the block loads, causing CLS. The better approach: set `--nav-height` to a value that accommodates the worst-case header height, or accept a slightly taller fixed reservation. This needs visual testing.

**Risk 3: Font loading and corruption effect timing**

Source Code Pro is loaded via Google Fonts. The corruption effect (per-letter `<span>` positioning) is calculated based on character widths. If the font has not loaded when the header decorates (FOUT — Flash of Unstyled Text), the glyph positions will be calculated against a fallback font with different character widths. When Source Code Pro loads, the text reflows but the `<span>` elements keep their corruption transforms, potentially looking wrong.

**Mitigation:** The corruption parameters (translateY, rotate, skewX, opacity) are not dependent on character width — they are per-glyph offsets applied as transforms after the browser has laid out the text. The transforms are relative, not absolute pixel positions. As long as we do not set explicit `width` on glyph spans, the text reflows naturally when the font loads and the transforms adjust correctly. This is safe.

**Risk 4: `content: attr(data-text)` and screen reader double-announcement**

The chromatic aberration pseudo-element uses `content: attr(data-text)`, which screen readers will announce. Since the parent `<a>` has `aria-label`, the link's accessible name is already overridden and descendant text (including pseudo-element content) is not announced for the link. However, if `aria-label` is removed or the structure changes, this becomes a double-announcement bug.

**Mitigation:** Document this coupling in a code comment. Alternatively, use `aria-hidden="true"` on the `.logo-word-hallucinations` span and rely entirely on the link's `aria-label`. This is more robust but means screen readers get "Mostly Hallucinations - home" from the label rather than reading the individual text nodes.

**Risk 5: Linting — Stylelint may flag `@media (prefers-reduced-motion)`**

The project's Stylelint config is `stylelint-config-standard`. This config may flag range-notation media queries for `prefers-reduced-motion` since it is a boolean feature query, not a range. Verify that `@media (prefers-reduced-motion: reduce)` passes lint.

**Mitigation:** This is standard syntax and should pass. If not, the lint config may need a rule override.

**Risk 6: CMS authoring fragility**

The header.js will parse the nav fragment expecting a specific structure (first `<p>` contains the site name link, second `<p>` contains the tagline). If an author edits the nav document and adds or reorders content, the header breaks silently.

**Mitigation:** Add defensive checks in header.js — if the expected structure is not found, fall back to rendering the fragment content as-is without corruption effects. Log a warning to console. Document the expected nav structure in a code comment at the top of header.js.

---

### Additional Agents Needed
None — the current team is sufficient.
