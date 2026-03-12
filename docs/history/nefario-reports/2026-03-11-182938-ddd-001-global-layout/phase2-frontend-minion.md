# Domain Plan Contribution: frontend-minion

## Recommendations

### (a) Where `--measure` Should Apply: Two-Level Constraint Model

The EDS DOM after `decorateSections()` in `aem.js` produces this structure:

```
<main>
  <div class="section">                    <!-- full-width: backgrounds, rules -->
    <div class="default-content-wrapper">  <!-- constrained: reading content -->
      <h2>...</h2>
      <p>...</p>
    </div>
    <div class="blockname-wrapper">        <!-- constrained OR full: depends on block -->
      <div class="blockname block">...</div>
    </div>
  </div>
</main>
```

The `.section` element is the right place for full-bleed backgrounds (section metadata can add classes like `highlight` or `light` that apply backgrounds). The inner wrapper divs (`.default-content-wrapper`, `*-wrapper`) are where content width should be constrained.

**Recommendation: Apply `--measure` (68ch) to `.default-content-wrapper` inside sections, NOT to the section div itself.**

The current boilerplate targets `main > .section > div` with `max-width: 1200px`. This selector hits all wrapper divs inside a section. The correct approach is:

1. Keep `main > .section > div` as a reasonable outer constraint (but reduce from `1200px` to a layout-max value, see below).
2. Apply `max-width: var(--measure)` specifically to `.default-content-wrapper` for reading content.
3. Let block wrappers decide their own width -- some blocks (like a future post-index or full-width code blocks) may want the wider container.

This gives us two width tiers:
- **Layout max** (`--layout-max: 1200px`): The outer guardrail. No content of any kind exceeds this. Applied to `main > .section > div`.
- **Reading width** (`--measure: 68ch`): The comfortable reading column. Applied to `.default-content-wrapper` within sections.

For this single-column blog with no sidebar, `--measure` will be the dominant visible width. The `--layout-max` only matters as a safety net and for blocks that intentionally span wider (code blocks with horizontal scroll, for instance).

### (b) How `1200px` Boilerplate Max-Width Relates to `--measure`

Do NOT simply replace `max-width: 1200px` with `max-width: var(--measure)` on `main > .section > div`. Here is why:

- `68ch` is approximately 544-612px at body font sizes of 18-20px with Source Sans 3. That is a reading width, not a layout width.
- Blocks (header, footer, post-index) may need more horizontal space than 68ch.
- Full-bleed section backgrounds need the `.section` to be unconstrained while the inner wrappers are constrained.

**Recommended approach:**

```css
/* Outer layout constraint -- the boilerplate guardrail, now tokenized */
main > .section > div {
  max-width: var(--layout-max, 1200px);
  margin: auto;
  padding: 0 var(--content-padding-mobile);
}

/* Reading width for default (prose) content */
main > .section > .default-content-wrapper {
  max-width: var(--measure);
}

@media (min-width: 900px) {
  main > .section > div {
    padding: 0 var(--content-padding-desktop);
  }
}
```

This preserves the boilerplate's safety rail while adding the narrower reading column. Blocks that need wider layout (post-index, header, footer) naturally get `--layout-max` from the wrapper, while prose content gets `--measure`.

**Important: Do NOT set `margin: auto` on `.default-content-wrapper` for centering.** The wrapper already inherits centering from its parent's `margin: auto`. Adding `margin: auto` to `.default-content-wrapper` would center it within the already-centered `1200px` container, which is correct behavior -- but only if we explicitly want the prose column centered within a wider block area. For this single-column blog, this is the right call. But we need to be precise: the `.default-content-wrapper` should NOT have its own `margin: auto` if we want prose to align left within a wider container (e.g., if a block next to it spans wider). Since this is a single-column blog with no such case, centering is fine.

Actually, let me reconsider. Since `--measure` at ~550-612px is significantly narrower than `--layout-max` at 1200px, the prose will float in the center of a wide screen with ~300px of empty space on each side between the prose edge and the layout-max edge. For this warm-white-paper aesthetic, this is desirable -- it mimics book margins. But we should confirm this with the UX strategy contribution.

### (c) Import Order for `tokens.css` into `styles.css`

The `head.html` loads exactly one stylesheet eagerly:

```html
<link rel="stylesheet" href="/styles/styles.css"/>
```

EDS does not use `@import` in production CSS -- the AEM CDN serves files individually, and `@import` would create a render-blocking chain (browser must fetch `styles.css`, parse it, discover the `@import`, then fetch `tokens.css` before any styles apply). This is a known anti-pattern for Core Web Vitals.

**Three options, ranked by preference:**

**Option 1 (Recommended): Inline tokens at the top of `styles.css`**

Move the content of `tokens.css` directly into the top of `styles.css`, replacing the boilerplate's `:root` block. Keep `tokens.css` as the canonical source-of-truth file in the repo, but copy its contents into `styles.css` as the actual build artifact. Since EDS has no build step, this means `tokens.css` is a documentation/reference file and `styles.css` contains the actual token declarations.

Rationale: Zero additional network requests. Zero import chains. The tokens are available for the eager LCP render. This is the EDS-idiomatic approach -- `styles.css` is supposed to contain everything needed for LCP.

**Option 2: Add `tokens.css` as a second `<link>` in `head.html`**

```html
<link rel="stylesheet" href="/styles/tokens.css"/>
<link rel="stylesheet" href="/styles/styles.css"/>
```

This adds one extra render-blocking request but keeps the files separate. The browser can discover both links in the same parse pass (no chain), so the performance cost is one extra HTTP round-trip -- minimal on HTTP/2 where requests multiplex. This preserves `tokens.css` as a standalone editable file.

Rationale: Clean separation. Two parallel requests on HTTP/2. Slightly worse than Option 1 for cold loads but probably immeasurable in practice. The EDS CDN (Fastly/Cloudflare) handles this well.

**Option 3: Use `@import` at the top of `styles.css`**

```css
@import url('tokens.css');
```

This is what `tokens.css` itself suggests in its header comment. But it creates a request chain: browser fetches `styles.css`, parses, discovers `@import`, fetches `tokens.css`. Two sequential requests instead of parallel. This will hurt FCP on slow connections and Lighthouse will flag it.

**My recommendation is Option 2.** It keeps the files editable independently (important since `tokens.css` is referenced as the "single source of truth" throughout the project docs), avoids the request chain of `@import`, and has negligible performance cost on HTTP/2. Option 1 is technically fastest but creates a maintenance burden of keeping two copies in sync (or requires a build step, which EDS avoids).

### (d) Reconciling Boilerplate `:root` Variables with `tokens.css`

The boilerplate defines these `:root` variables that conflict with `tokens.css`:

| Boilerplate Variable | Token Equivalent | Action |
|---|---|---|
| `--background-color: white` | `--color-background: #F6F4EE` | Replace |
| `--light-color: #f8f8f8` | `--color-background-soft: #EFE9DD` | Replace |
| `--dark-color: #505050` | No direct equivalent | Remove (unused outside boilerplate) |
| `--text-color: #131313` | `--color-text: #3A3A33` | Replace |
| `--link-color: #3b63fb` | `--color-link: #7F9A63` | Replace |
| `--link-hover-color: #1d3ecf` | `--color-link-hover: #3F5232` | Replace |
| `--body-font-family: roboto...` | `--font-body: 'Source Sans 3'...` | Replace |
| `--heading-font-family: roboto-condensed...` | `--font-heading: 'Source Code Pro'...` | Replace |
| `--body-font-size-*` | Same names, different values | Use token values |
| `--heading-font-size-*` | Same names, different values | Use token values |
| `--nav-height: 64px` | `--nav-height: 80px` | Use token value |

**Recommended approach: Full replacement, no mapping layer.**

1. Remove the entire boilerplate `:root` block from `styles.css`.
2. Place token declarations (from `tokens.css`) at the top of `styles.css` (or load via `head.html` per option c above).
3. Update all `var()` references in `styles.css` to use the new token names.

Specifically, the references that need updating in `styles.css`:

- `var(--background-color)` -> `var(--color-background)` (lines 76, 185)
- `var(--text-color)` -> `var(--color-text)` (line 78, 211)
- `var(--link-color)` -> `var(--color-link)` (line 19 area, 184)
- `var(--link-hover-color)` -> `var(--color-link-hover)` (line 196 area)
- `var(--body-font-family)` -> `var(--font-body)` (lines 78, 178)
- `var(--heading-font-family)` -> `var(--font-heading)` (line 109)
- `var(--light-color)` -> `var(--color-background-soft)` (lines 141, 254)

Do NOT add a mapping layer like `--background-color: var(--color-background)`. This creates indirection that makes debugging harder, doubles the number of custom properties in DevTools, and serves no purpose since we control the entire codebase. A clean break is better.

The font-size variables (`--body-font-size-m`, `--heading-font-size-xxl`, etc.) use the SAME names in both files but different values. Since `tokens.css` is the authority, its values win. The boilerplate's font-size values are Roboto-tuned and will be wrong for Source Sans 3 / Source Code Pro.

The boilerplate `@font-face` fallback declarations for `roboto-fallback` and `roboto-condensed-fallback` should be replaced with fallback faces for the actual fonts (Source Sans 3, Source Code Pro, Source Serif 4). The `fonts.css` file also needs updating -- it currently loads Roboto woff2 files.

### Additional CSS Architecture Recommendations

**Remove the `main > div` rule.** The boilerplate has `main > div { margin: 40px 16px; }` (line 145-147). After `decorateSections()` runs, `main > div` matches `.section` elements. But the boilerplate also has `main > .section { margin: 40px 0; }` (line 231-233). The `main > div` rule is a pre-decoration fallback that the boilerplate keeps for the brief moment before JS runs. In EDS, `body { display: none }` until `body.appear` is added, so this pre-decoration state is invisible. The `main > div` rule can be removed to avoid confusion, but if kept, it should use `--section-spacing` instead of `40px`.

**Section spacing.** Replace the hardcoded `margin: 40px 0` on `.section` with `margin: var(--section-spacing) 0`. The token defines `--section-spacing: 48px`.

**No `border-radius: 8px` on `<pre>`.** The boilerplate sets `border-radius: 8px` on code blocks (line 139). Per the design rules: "No cards with shadows, no gradients, no rounded containers." This should be removed or reduced to `0` or a very subtle `2px` if any.

**Line height.** The boilerplate uses `line-height: 1.6` on body. The tokens define `--line-height-body: 1.7`. Use the token value.

## Proposed Tasks

### Task 1: Create `tokens.css` link in `head.html`

**What:** Add `<link rel="stylesheet" href="/styles/tokens.css"/>` before the existing `styles.css` link in `head.html`.

**Deliverables:** Updated `head.html` with two stylesheet links.

**Dependencies:** None. This is the foundation for everything else.

### Task 2: Rewrite `styles.css` to use token system

**What:** Remove the boilerplate `:root` block from `styles.css`. Update all `var()` references to use the token names from `tokens.css`. Remove boilerplate font-face fallbacks for Roboto. Add fallback font-faces for Source Sans 3, Source Code Pro, and Source Serif 4 (with appropriate `size-adjust`). Update `line-height` to use `--line-height-body`. Remove `border-radius: 8px` from `pre`. Update section/margin values to use spacing tokens.

**Deliverables:** Updated `styles.css` with zero boilerplate variable names remaining. All values sourced from tokens.

**Dependencies:** Task 1 (tokens must be loaded first).

### Task 3: Implement two-tier width constraint

**What:** Update `styles.css` section rules:
- `main > .section > div` keeps `max-width: var(--layout-max, 1200px)` with `margin: auto` and responsive padding.
- Add `main > .section > .default-content-wrapper { max-width: var(--measure); }` for prose content centering.
- Add `--layout-max: 1200px` to `tokens.css`.
- Verify that `.default-content-wrapper` centers correctly within the layout-max container.

**Deliverables:** Updated `styles.css` and `tokens.css`. Prose content constrained to 68ch reading width, blocks can use up to 1200px.

**Dependencies:** Task 2 (styles must use token system).

### Task 4: Update `fonts.css` for project fonts

**What:** Replace Roboto font-face declarations with Source Sans 3, Source Code Pro, and Source Serif 4. Add size-adjusted fallback font-faces. Ensure `font-display: swap` is used.

**Deliverables:** Updated `fonts.css` with correct font files and fallbacks. (Font files themselves need to be placed in `/fonts/` -- this may require downloading from Google Fonts.)

**Dependencies:** Task 2 (styles must reference new font families).

### Task 5: Create test content for visual verification

**What:** Create a `drafts/index.html` (or `drafts/test-layout.html`) with representative content: headings, prose paragraphs, a code block, a list, and a simulated post entry. This provides a visual test surface for the layout work.

**Deliverables:** Static HTML file following EDS markup conventions that can be served via `aem up --html-folder drafts`.

**Dependencies:** None. Can be done in parallel with Tasks 1-2.

### Task 6: Write DDD-001-global-layout.md

**What:** Author the Design Decision Document incorporating all the above decisions. Include ASCII wireframes showing the two-tier width model, token usage table, responsive behavior at all four breakpoints, and the HTML structure after EDS decoration.

**Deliverables:** `docs/design-decisions/DDD-001-global-layout.md` with status "Proposal".

**Dependencies:** Recommendations from this plan and the UX strategy contribution must be synthesized first.

### Task 7: Lint and validate

**What:** Run `npm run lint` to verify all CSS changes pass Stylelint. Test the dev server with `aem up` to verify no visual regressions.

**Deliverables:** Clean lint output. Visual confirmation at localhost:3000.

**Dependencies:** Tasks 1-4 complete.

## Risks and Concerns

### Risk 1: `68ch` Width Varies by Font

`68ch` is defined as 68 times the width of the `0` character in the element's font. Source Sans 3 (body font) and Source Code Pro (heading font) have different `0` widths. The `--measure` constraint will produce different pixel widths depending on which font is active on the element. For `.default-content-wrapper`, the body font applies, so ~550-612px is expected. But if a heading inside the wrapper is in Source Code Pro (monospace), its characters are wider, and 68ch in that context would be wider. This is fine because `max-width` constrains the container, not individual elements. But it is worth noting that `--measure` at 68ch is calibrated for Source Sans 3 body text. Verify the actual rendered width once fonts are loaded.

### Risk 2: Boilerplate Updates May Conflict

The project is based on `adobe/aem-boilerplate`. If the boilerplate updates `styles.css` or `aem.js` upstream, our changes to `styles.css` will diverge. This is expected and acceptable -- the boilerplate is a starting point, not a living dependency. But it means future boilerplate cherry-picks will require manual conflict resolution on `styles.css`. Document this in the DDD.

### Risk 3: Font Loading and CLS

The boilerplate loads fonts conditionally in `loadEager` (only on desktop or if cached). With three font families (Source Sans 3, Source Code Pro, Source Serif 4) instead of two (Roboto, Roboto Condensed), font loading is heavier. If fallback fonts have significantly different metrics, there will be Cumulative Layout Shift when web fonts load. The `size-adjust` values on fallback font-faces must be carefully calibrated. This is a Task 4 concern but affects global layout stability.

### Risk 4: `@import` Comment in `tokens.css`

The header comment in `tokens.css` says "Import this at the top of styles.css: `@import url('tokens.css');`". If a future agent follows this instruction literally, it will create a render-blocking chain. The comment should be updated to reflect the actual integration approach (separate `<link>` in `head.html`). Include this update in Task 1.

### Risk 5: Dark Mode and Section Backgrounds

The `tokens.css` dark mode media query redefines color tokens. Sections with explicit background classes (`.section.light`, `.section.highlight`) currently use `var(--light-color)` which maps to the soft background. In dark mode, `--color-background-soft` becomes `#3F5232` (dark green). This needs visual verification -- a "light" section in dark mode should still feel like a subtle contrast, not a jarring green block. This is out of scope for DDD-001 (it is DDD-008's territory) but the global layout must not make dark mode harder by baking in light-mode assumptions.

### Risk 6: The `main > div` Pre-Decoration Selector

The boilerplate rule `main > div { margin: 40px 16px; }` targets sections before `decorateSections()` adds the `.section` class. Since `body { display: none }` until JS runs and `decorateMain()` completes, this rule technically never renders visibly. However, removing it changes the flash-of-unstyled-content fallback if JS fails entirely. In an EDS context, if JS fails, the page stays `display: none` anyway (the `body.appear` pattern), so this rule is truly dead code. Safe to remove, but worth noting.

## Additional Agents Needed

None. The current team (frontend-minion + ux-strategy-minion) is sufficient for a DDD at this level. The layout decisions are primarily CSS architecture (frontend) and spatial design (UX strategy). No API, infrastructure, security, or performance measurement expertise is needed at the planning stage.

One note: when the DDD moves to implementation, the **sitespeed-minion** should verify that the font loading strategy and CSS loading approach do not regress Lighthouse scores. But that is an implementation-phase concern, not a planning-phase one.
