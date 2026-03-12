# Domain Plan Contribution: ux-design-minion

## Recommendations

### 1. Corrupted Letterform Specification: Letter-by-Letter

The word "Hallucinations" has 14 characters. The corruptions should follow a key principle: **most letters remain perfectly legible, and the corruptions increase in density toward the end of the word**, mimicking how AI image models degrade text--the first few characters are often correct, the later ones drift. This creates a left-to-right gradient from "grounded" to "hallucinated" that reinforces the blog's thesis.

I recommend corrupting 5 of the 14 letters (roughly one-third). The rest remain pristine Source Code Pro. The corruptions are subtle--the word must always remain immediately readable. A reader should be able to read "Hallucinations" without effort, then do a double-take when they notice something is off.

**Corruption Map:**

| Position | Letter | Corruption | Description | Rationale |
|----------|--------|------------|-------------|-----------|
| 1 | H | Clean | Anchor letter. Fully correct. | The "H" anchors the word. Corrupting the first letter undermines readability. Reserve "H" corruption for the favicon/social avatar "MH" treatment. |
| 2 | a | Clean | No modification. | Early letters stay grounded. |
| 3 | l | Clean | No modification. | -- |
| 4 | l | **Corrupted** | The vertical stroke extends ~2px below the baseline, as if the model didn't know where to stop. | First hint of wrongness. A monospaced `l` is the simplest possible glyph--a single vertical stroke--so any deviation is immediately noticeable to a trained eye but unobtrusive to casual reading. |
| 5 | u | Clean | No modification. | Breathing room between corruptions. |
| 6 | c | **Corrupted** | The open counter doesn't fully open--the terminal curls inward ~1.5px more than it should, nearly closing into an `o`. | AI models frequently fail at open counters. The `c` almost becoming an `o` is the quintessential "AI text in images" error. |
| 7 | i | Clean | No modification. | -- |
| 8 | n | **Corrupted** | A vestigial serif appears at the baseline of the right stem--a tiny 1px horizontal foot that does not belong on a sans-serif monospaced face. | Serifs appearing on sans-serif type is a canonical AI hallucination artifact. It reads as "the model saw both serif and sans-serif training data and split the difference." |
| 9 | a | Clean | No modification. | -- |
| 10 | t | **Corrupted** | The crossbar is asymmetric: it extends ~2px further to the right than to the left. The vertical stroke remains centered and correct. | Crossbar errors are common in AI-generated text. The asymmetry is visible but doesn't impede reading. |
| 11 | i | Clean | No modification. | -- |
| 12 | o | Clean | No modification. | The `o` is a closed counter, already "complete." Leaving it clean provides contrast against the corrupted neighbors. |
| 13 | n | **Corrupted** | The arch of the `n` doesn't fully connect to the right stem. There's a ~1px gap between the arch and the vertical stroke at the top-right junction. | This is the strongest corruption, placed late in the word. A broken junction is unmistakable up close but the brain still reads "n" at reading speed. |
| 14 | s | Clean | The final letter lands clean, completing the word. | Ending on a clean letter gives the eye a place to rest and avoids the word feeling "broken." The corruptions are sandwiched between clean anchors. |

**Summary of corruption types used:**
1. Stroke overshoot (l extending below baseline)
2. Counter closure (c nearly becoming o)
3. Phantom serif (n at position 8 gaining a foot)
4. Asymmetric crossbar (t extending unevenly)
5. Broken junction (n at position 13 disconnected arch)

This gives five distinct corruption types, each referencing a different category of AI text-generation artifact. No two adjacent letters are both corrupted (corruptions at positions 4, 6, 8, 10, 13), which prevents the word from looking "damaged" and keeps the effect subliminal.

---

### 2. CSS vs. SVG Implementation: Recommendation is Inline SVG

**The three viable approaches:**

| Approach | Control | Performance | EDS Compatibility | Maintainability |
|----------|---------|-------------|-------------------|-----------------|
| **A. Pure CSS on live text** | Low | Excellent (0KB asset) | Native | Hard to get precise corruption |
| **B. Inline SVG** | Full | Good (~2-4KB gzipped) | Compatible with caveats | Medium (hand-authored paths) |
| **C. Web font with custom glyphs** | Full | Poor (extra font file) | Against conventions | Bad (requires font tooling) |

**Recommendation: Approach B -- Inline SVG for "Hallucinations," live text for "Mostly"**

Rationale:

- **"Mostly" stays as live HTML text.** It's Source Code Pro, weight 600, `--color-heading`. No reason to complicate it. It's the grounded half of the logo. Live text means it's selectable, accessible, searchable, and weighs 0 bytes.

- **"Hallucinations" is rendered as an inline SVG.** The corruptions described above require sub-pixel precision: a stroke extending 2px past baseline, a counter curling inward 1.5px, a serif appearing at a specific junction. CSS transforms on live text (skew, translate, clip-path) cannot achieve this level of glyph-internal modification. You'd be fighting the font rendering engine at every step.

- **Why not a custom web font?** Creating a modified Source Code Pro with 5 altered glyphs would require OpenType tooling (fonttools, Glyphs), would add a separate font file to the critical path, and would conflict with the "no external dependencies beyond Google Fonts" rule. The font would also need to carry all 14 characters at the correct monospaced advance width, making it heavier than an SVG.

- **SVG budget:** "Hallucinations" in Source Code Pro at the logo's display size, with 14 glyphs as paths, will be approximately 3-5KB uncompressed, 1.5-2.5KB gzipped. Well within the 100KB page budget. For context, a typical SVG logo is 1-3KB. This is slightly larger because it's a full word, but still trivial.

- **EDS compatibility:** The SVG is inlined directly in the DOM by the header block's `decorate()` function. No external asset request. No build step. The `decorate()` function reads the authored content (which is plain text "Mostly Hallucinations"), keeps "Mostly" as a text node, and replaces "Hallucinations" with the pre-authored SVG string. The SVG lives as a constant in `header.js`.

**Fallback strategy:** The authored content in the CMS is plain text "Mostly Hallucinations." If JavaScript fails to load or the block decoration doesn't run, the user sees the full name in plain text. The SVG is a progressive enhancement. Accessibility is handled by `aria-label` on the containing element and `role="img"` on the SVG with a `<title>` element.

**Why not pure CSS (Approach A)?**

I considered CSS approaches carefully:
- `text-shadow` / `box-shadow` for phantom strokes: too blurry, can't create sharp serif-like details
- `clip-path` on individual `<span>` letters: can subtract from glyphs but can't add strokes
- Pseudo-elements (`::before`/`::after`) positioned over letters: could add phantom serifs or extra strokes, but requires per-letter `<span>` wrapping, pixel-perfect positioning that breaks across font sizes and rendering engines, and produces fragile CSS
- `transform: skew()` / `translate()`: moves whole glyphs, can't modify internal anatomy

A CSS approach could approximate 2-3 of the 5 corruption types (overshoot via transform, phantom serif via pseudo-element) but not the others (counter closure, broken junction). The result would be a compromise that's more fragile and less precise than SVG, for marginal performance gain (~2KB difference).

---

### 3. Responsive Scaling and Mobile Simplification

**Scaling strategy: The SVG scales intrinsically.**

The inline SVG uses a `viewBox` and no fixed `width`/`height` attributes. Its width is controlled by CSS, matching the text size of "Mostly" at each breakpoint. Because the SVG paths are vector, they scale perfectly at any size.

**Breakpoint behavior:**

| Breakpoint | "Mostly" size | "Hallucinations" SVG behavior | Corruption visibility |
|------------|---------------|-------------------------------|----------------------|
| < 600px (mobile) | ~28-32px equivalent | SVG scales to match text height via `height: 1em` relative to parent font-size | All 5 corruptions present but naturally subtle at small size. The 1-2px deviations become sub-pixel, so the corruptions gracefully disappear into anti-aliasing. **No code change needed.** |
| >= 600px (tablet) | ~32-36px equivalent | Same scaling mechanism | Corruptions begin to become perceptible |
| >= 900px (desktop) | ~36-42px equivalent | Same scaling mechanism | Corruptions clearly visible on close inspection |

**Key insight: The corruptions are self-simplifying.**

Because the corruptions are defined as 1-2px deviations at the design size (~42px), they naturally become sub-pixel at smaller sizes and are smoothed away by anti-aliasing. This means **no separate mobile treatment is needed**. The word remains perfectly legible at all sizes because the base letterforms are correct--the corruptions are additive details that gracefully degrade.

This is the critical advantage of SVG over CSS: a CSS `transform: translateY(2px)` on a stroke would remain 2px at all sizes (or require recalculation per breakpoint). An SVG path with a 2px deviation at viewBox scale automatically becomes a 1px deviation at half size, a 0.5px deviation at quarter size, and so on.

**Exception: favicon and social avatar ("MH" mark)**

At 32x32px (favicon) or very small social thumbnails, the full word is illegible regardless of corruptions. The brand identity specifies simplifying to "MH" with the "H" carrying a single hallucinated detail. This is a separate SVG asset, not a responsive variant of the header logo. It ships as `icons/favicon.svg` (or a generated `.ico`/`.png`) and `icons/og-avatar.svg`.

For the "MH" mark, the "H" corruption should be: **the crossbar is at a wrong angle**--rotated approximately 5-7 degrees clockwise from horizontal. This is the single most recognizable "AI got the text wrong" artifact and reads clearly even at 16x16px.

---

### 4. Spatial Arrangement

**Layout: Stacked, left-aligned, with the tagline as a distinct third line.**

```
+--[content-padding]--------------------------------------------+
|                                                                |
|  Mostly                                                        |
|  Hallucinations                                                |
|  Generated, meet grounded.                                     |
|                                                                |
+----------------------------------------------------------------+
```

**Why stacked, not inline:**

- "Mostly Hallucinations" at 14+6 = 20 characters in Source Code Pro at heading sizes won't fit on a single line on mobile (20 monospaced characters at 28px equivalent is ~340px, which leaves <35px for padding on a 375px viewport). Stacking avoids a forced layout shift at a breakpoint.
- Stacking creates a visual rhythm: short line / long line / medium line. This is more visually interesting than a single long line that wraps unpredictably.
- The stacked layout lets "Mostly" and "Hallucinations" have independent visual weight. "Mostly" is smaller and acts as a modifier; "Hallucinations" is larger and is the real name.

**Detailed spatial arrangement:**

| Element | Font | Size (mobile) | Size (desktop >= 900px) | Weight | Color | Line-height |
|---------|------|---------------|-------------------------|--------|-------|-------------|
| "Mostly" | Source Code Pro (live text) | 20px | 18px | 400 (regular) | `--color-heading` | 1.25 |
| "Hallucinations" | Source Code Pro (SVG) | 36px | 32px | 600 (semibold) | `--color-heading` | 1.25 |
| "Generated, meet grounded." | Source Serif 4 | 15px | 14px | 400 (regular italic) | `--color-text-muted` | 1.4 |

**Rationale for size choices:**

- "Mostly" at a smaller size acts as a qualifier--it reads as "mostly [hallucinations]" with emphasis on the noun. Using the same size for both words would make "Mostly" compete with "Hallucinations" for dominance.
- "Hallucinations" uses `--heading-font-size-xl` (36px mobile / 32px desktop) rather than `--heading-font-size-xxl` (48px / 42px). The xxl size is reserved for post h1 elements. The logo should be prominent but not shout. It is the site's identity, not a headline.
- The tagline in Source Serif 4 italic provides the register shift the brand identity describes: "a serif voice that adds weight." Italic further distinguishes it from the logo. The muted color subordinates it.

**Spacing between elements:**

| Gap | Value | Token | Notes |
|-----|-------|-------|-------|
| "Mostly" to "Hallucinations" | 0 (natural line stacking) | -- | The two words flow as a single visual unit. The line-height of "Mostly" (1.25) provides the natural gap. |
| "Hallucinations" to tagline | 8px | -- | Enough separation to distinguish the tagline from the name, but tight enough to read as a single header block. Not a full `--space-paragraph`. |
| Top of header to "Mostly" | Vertical centering within `--nav-height` (80px) | `--nav-height` | The entire logo+tagline block is vertically centered in the header strip. |

**Alignment:**

- Left-aligned, matching the content column's left edge (governed by `--content-padding-*` at each breakpoint).
- The header's inner content aligns with `main > .section > div` content. This is the DDD-001 answer to Open Question #1: the header uses `--layout-max` as its outer constraint, with padding matching the content area, so the logo's left edge aligns with the body text's left edge.

---

### 5. CSS Approach for the DDD

**Layout method: Flexbox, column direction.**

The header block contains a single flex container in column direction. No grid needed--this is three lines of text with no horizontal complexity.

**Key selectors and their roles:**

```
header .header               -- outer block container (EDS-generated)
  .nav-wrapper               -- removed (current boilerplate creates this; new header doesn't need it)
  nav#nav                    -- removed (no navigation; replaced by simpler structure)
  .header-brand              -- the logo+tagline flex container
    .header-brand-name       -- contains "Mostly" text + "Hallucinations" SVG
      span.header-mostly     -- "Mostly" live text
      svg.header-hallucinations  -- "Hallucinations" inline SVG
    .header-brand-tagline    -- "Generated, meet grounded." text
```

**Non-obvious styling decisions:**

1. **The SVG must be `display: block` and sized by `width`, not `height`.** Because Source Code Pro is monospaced, the SVG's width is deterministic (14 characters x advance width). Setting `width: 14ch` (relative to the parent's font-size with `font-family: var(--font-heading)`) would be ideal, but since the SVG is not text, it won't inherit `ch` units naturally. Instead, size the SVG container to match by setting its width to a calc or explicit value at each breakpoint, or use `height: 1em` relative to the "Hallucinations" target font-size and let the SVG's aspect ratio determine the width.

2. **`fill: currentColor` on the SVG paths.** This ensures the SVG respects `--color-heading` in light mode and the overridden value in dark mode without any SVG-specific color logic. The SVG inherits color from its parent element's CSS `color` property.

3. **The `position: fixed` behavior of the current header must be removed.** The current `header .nav-wrapper` is `position: fixed` on mobile, which is a navigation-oriented pattern (keeps hamburger menu accessible during scroll). A logo-only header with no interactive elements should be `position: static` (or `relative`). Fixed positioning would waste 80px of precious mobile viewport on content that serves no interactive purpose after initial reading. This is a breaking change from the current CSS.

4. **No hamburger menu, no nav-sections, no nav-tools.** The entire navigation apparatus in the current `header.js` (hamburger toggle, dropdown sections, escape-to-close, focusout handlers) is removed. The new `decorate()` function is dramatically simpler: read fragment, extract brand text, inject SVG, done.

5. **The header links home.** The entire `.header-brand` is wrapped in an `<a href="/">` element. On hover, no color change (the logo stays `--color-heading`). The link affordance comes from cursor change only. No underline. The hover state is intentionally invisible because the header-as-home-link is a universal convention that doesn't need visual reinforcement.

6. **Vertical centering within `--nav-height`.** The `.header-brand` container uses `display: flex; flex-direction: column; justify-content: center; height: var(--nav-height)`. This vertically centers the stacked logo+tagline regardless of the content's actual height.

7. **Header bottom border.** A `1px solid var(--color-border-subtle)` bottom border on the header provides the faintest structural separation from the content below, consistent with the "borders that almost melt into the background" philosophy.

8. **The header occupies full `--layout-max` width** with the same horizontal padding as the main content area (`--content-padding-mobile` / `--content-padding-tablet` / `--content-padding-desktop`). This ensures the logo's left edge aligns precisely with the body text's left edge at all breakpoints.

---

## Proposed Tasks

### Task 1: Author the "Hallucinations" SVG
Create the inline SVG string containing all 14 glyphs of "Hallucinations" in Source Code Pro Semibold (600 weight), with the 5 specified corruptions. The SVG should:
- Use a `viewBox` with no fixed dimensions
- Use `fill="currentColor"` on all paths
- Include a `<title>Hallucinations</title>` element for accessibility
- Have `role="img"` and `aria-hidden="true"` (the parent link carries the accessible name)
- Be optimized (SVGO or manual cleanup) to minimize path data
- Target: under 4KB uncompressed

**Dependency:** Requires extracting Source Code Pro Semibold glyph outlines. This can be done from the Google Fonts WOFF2 file using fonttools/pyftsubset to get the outlines, then manually modifying the 5 corrupted glyphs.

### Task 2: Author the "MH" favicon/avatar SVG
Create the simplified "MH" mark with the single "H" corruption (rotated crossbar). Two variants:
- Favicon SVG (simple, works at 16x16 and 32x32)
- OG/social avatar version (square, with appropriate padding)

### Task 3: Write DDD-002-header.md
Synthesize the above specifications into the DDD format with all required sections: Context, Layout (ASCII wireframe), Typography, Spacing & Rhythm, Responsive Behavior, Interactions, HTML Structure, CSS Approach, Token Usage table, Open Questions.

### Task 4: Rewrite header block
Replace the current navigation-oriented `header.js` and `header.css` with the simplified logo+tagline implementation per the approved DDD. This involves:
- New `header.js`: drastically simplified `decorate()` function
- New `header.css`: removing all navigation CSS, implementing the flex column layout
- Updating or replacing the CMS nav fragment content

### Task 5: Test responsive behavior
Verify the header renders correctly at all breakpoints (320px, 375px, 414px, 600px, 768px, 900px, 1024px, 1200px, 1440px). Verify the SVG corruption details gracefully degrade at small sizes. Verify dark mode inversion via `fill: currentColor`.

---

## Risks and Concerns

### Risk 1: SVG glyph extraction fidelity
Extracting Source Code Pro glyph outlines from the font file and converting to SVG paths is a precise operation. If the outlines don't match the browser-rendered font at the same size, the "Mostly" (live text) and "Hallucinations" (SVG) will look subtly different--defeating the entire concept. **Mitigation:** Extract outlines at the exact weight (600/Semibold), test side-by-side at multiple sizes in multiple browsers (Chrome, Safari, Firefox), and adjust SVG paths until baseline alignment and stroke weight match the rendered text.

### Risk 2: Cross-browser SVG rendering differences
SVG anti-aliasing and sub-pixel rendering varies across browsers and operating systems. The subtle corruptions (1-2px deviations) may look different on macOS (sub-pixel AA) vs. Windows (ClearType/grayscale AA) vs. Linux. **Mitigation:** Test on at least Chrome/macOS, Chrome/Windows, and Safari/macOS. Accept that the corruptions will look slightly different across platforms--this is actually thematically appropriate (the hallucinations are unstable).

### Risk 3: Source Code Pro weight mismatch between "Mostly" and SVG
"Mostly" is live text at weight 400 (regular), while "Hallucinations" SVG uses weight 600 (semibold). If the Google Fonts CDN delivers a slightly different weight variant than the one used to extract SVG outlines, the visual weight may not match. **Mitigation:** Use the exact same font file for outline extraction as is loaded by the page. If self-hosting, this is straightforward. If using Google Fonts, download the exact file served by the CDN.

### Risk 4: Accessibility of SVG text
Screen readers need to announce "Mostly Hallucinations" as the site title, not "Mostly" followed by silence (if the SVG is hidden) or "Mostly image" (if the SVG is announced as an image). **Mitigation:** The wrapping `<a>` element carries `aria-label="Mostly Hallucinations - home"`. The SVG has `aria-hidden="true"`. The visible "Mostly" text plus the SVG's visual rendering serve sighted users; the `aria-label` serves screen reader users. The tagline is a separate element and is announced naturally.

### Risk 5: Content Security Policy
The current `head.html` has `style-src 'self'` in the CSP. Inline SVG with `style` attributes would be blocked. **Mitigation:** Use `fill`, `stroke`, `transform` as SVG presentation attributes, not `style` attributes. `fill="currentColor"` is a presentation attribute, not a style, and is unaffected by CSP.

### Risk 6: EDS nav fragment dependency
The current header block loads content from a `/nav` fragment. The redesigned header is much simpler but still needs authored content (at minimum, the site name and tagline text). The `decorate()` function needs to handle the case where the fragment content structure changes or where a content author modifies the nav document. **Mitigation:** The `decorate()` function should extract text content from the fragment (not depend on specific markup), then inject its own structure. Any text starting with "Mostly" triggers the SVG injection; all other content is treated as the tagline.

### Risk 7: Removing fixed header on mobile is a layout shift
The current header is `position: fixed` on mobile, and the `<header>` element has `height: var(--nav-height)` to reserve space. Changing to `position: static` / `relative` will require verifying that the space reservation still works correctly and that there's no layout shift. **Mitigation:** Keep `height: var(--nav-height)` on the `<header>` element. Make the inner wrapper `position: relative` at all breakpoints.

---

## Additional Agents Needed

None -- the current team is sufficient.
