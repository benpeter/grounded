# Domain Plan Contribution: frontend-minion

## Answers to Planning Questions

### Question 1: Migration Sequence

The safest edit sequence is a four-phase approach within a single commit, executed in strict dependency order. Here is the reasoning and the specific line-level plan.

#### Phase A: Add proposed tokens to `tokens.css`

Add four new tokens to the existing `/* --- Spacing --- */` section in `tokens.css` (after line 67, before the closing `}`):

```css
--layout-max: 1200px;
--content-padding-tablet: 24px;
--space-paragraph: 1em;
--space-element: 1.5em;
```

These are additive. They cannot break anything. They must land first because `styles.css` will reference them in Phase C.

At the same time, fix the existing lint errors in `tokens.css`:
- Lines 78, 81, 85, 100 have `custom-property-empty-line-before` violations (blank lines between custom properties inside the dark mode `:root` block). Remove the blank lines between properties within each logical group while keeping comment-separated group breaks.
- Line 94 uses `(min-width: 900px)` which violates `media-feature-range-notation`. Change to `(width >= 900px)`.

Also update the file header comment per software-docs-minion's recommendation: replace `@import url('tokens.css')` instruction with accurate `<link>` loading description.

#### Phase B: Update `head.html` to load `tokens.css` before `styles.css`

Insert one line before the existing `<link rel="stylesheet" href="/styles/styles.css"/>`:

```html
<link rel="stylesheet" href="/styles/tokens.css"/>
```

This is safe because `tokens.css` only defines `:root` custom properties. No selectors, no rules that could conflict. EDS serves `head.html` contents into the page `<head>`, so this follows the standard pattern.

#### Phase C: Wholesale replace boilerplate `:root` and all `var()` references in `styles.css`

This is the highest-risk change. Here is the exact edit inventory, derived from reading every line of `styles.css`.

**Step 1: Delete the entire boilerplate `:root` block (lines 13-41).** All these variables are now defined in `tokens.css` under project names. The boilerplate `:root` block contains:
- `--background-color`, `--light-color`, `--dark-color`, `--text-color`, `--link-color`, `--link-hover-color` (colors)
- `--body-font-family`, `--heading-font-family` (fonts)
- `--body-font-size-*`, `--heading-font-size-*` (sizes)
- `--nav-height` (spacing)

All of these have equivalents in `tokens.css`. The boilerplate values are overridden by design.

**Step 2: Delete the Roboto `@font-face` fallback blocks (lines 44-54).** These define `roboto-condensed-fallback` and `roboto-fallback`. This project uses Source Sans 3 / Source Code Pro / Source Serif 4. The Roboto font files in `fonts/` are also dead weight (but font file cleanup is out of scope for this task; the `@font-face` rules in `styles.css` must go because they reference the boilerplate font families).

**Step 3: Delete the boilerplate `@media (width >= 900px)` responsive `:root` block (lines 56-71).** These override `--body-font-size-*` and `--heading-font-size-*` at desktop width. The equivalent responsive overrides already exist in `tokens.css` lines 94-107 (with correct project values).

**Step 4: Replace every `var()` reference in the remaining CSS rules.** Here is the complete mapping, line by line:

| Line | Current | Replacement |
|------|---------|-------------|
| 77 | `var(--background-color)` | `var(--color-background)` |
| 78 | `var(--text-color)` | `var(--color-text)` |
| 79 | `var(--body-font-family)` | `var(--font-body)` |
| 80 | `var(--body-font-size-m)` | `var(--body-font-size-m)` -- **unchanged** (same name in both systems) |
| 109 | `var(--heading-font-family)` | `var(--font-heading)` |
| 134 | `var(--body-font-size-s)` | `var(--body-font-size-s)` -- **unchanged** |
| 140 | `var(--light-color)` | `var(--color-background-soft)` |
| 157 | `var(--link-color)` | `var(--color-link)` |
| 165 | `var(--link-hover-color)` | `var(--color-link-hover)` |
| 178 | `var(--body-font-family)` | `var(--font-body)` |
| 184 | `var(--link-color)` | `var(--color-link)` |
| 185 | `var(--background-color)` | `var(--color-background)` |
| 196 | `var(--link-hover-color)` | `var(--color-link-hover)` |
| 203 | `var(--light-color)` | `var(--color-background-soft)` |
| 211 | `var(--text-color)` | `var(--color-text)` |
| 254 | `var(--light-color)` | `var(--color-background-soft)` |

Additionally, update `line-height: 1.6` on `body` (line 80) to `var(--line-height-body)` (which is `1.7` in tokens.css). This is specified by DDD-001's Token Usage table.

**Step 5: Update hardcoded values that should reference tokens.**

| Line | Current | Replacement | Rationale |
|------|---------|-------------|-----------|
| 81 | `line-height: 1.6` | `line-height: var(--line-height-body)` | DDD-001 Token Usage table |
| 88 | `height: var(--nav-height)` | Keep as-is | Same token name, value updated in tokens.css to 80px |
| 111-112 | `line-height: 1.25` | `line-height: var(--line-height-heading)` | DDD-001 Token Usage table |
| 138 | `padding: 16px` | Keep for now | Pre block padding is a typography concern (DDD-005/006) |
| 139 | `border-radius: 8px` | Remove | DDD-001 aesthetic rules: "No rounded containers" |

**Roboto font files in `fonts/`**: The four `fonts/roboto-*.woff2` files are dead weight after removing the `@font-face` declarations, but deleting them is a separate cleanup task. The `.gitignore` and `fonts.css` also reference Roboto fonts. `fonts.css` cleanup is out of scope (it still declares roboto `@font-face` rules for the actual font files). However, since `fonts.css` is loaded lazily via `loadFonts()` in `scripts.js`, and nothing references the `roboto` or `roboto-condensed` font families after our `styles.css` edits, these dead declarations are harmless for now. Flag this as a follow-up cleanup task.

#### Phase D: Implement two-tier width model, responsive padding, and section spacing

Replace the existing section/layout rules in `styles.css` (lines 145-258) with the DDD-001 specified CSS. The specific replacements:

**Replace `main > div` (line 145-147)**:
```css
/* Before EDS decoration: section divs get basic padding */
main > div {
  margin: 40px 16px;
}
```
Keep this rule but update it to use tokens. This rule applies before `decorateSections()` adds the `.section` class. Once decoration runs, `main > .section` rules take over. The pre-decoration fallback prevents a flash of unstyled content. Update to:
```css
main > div {
  margin: var(--section-spacing) var(--content-padding-mobile);
}
```

**Replace section rules (lines 231-258)** with:
```css
/* Section spacing */
main > .section {
  margin-block: var(--section-spacing);
}

main > .section:first-of-type {
  margin-block-start: 0;
}

/* Outer tier: layout max on every section container */
main > .section > div {
  max-width: var(--layout-max);
  margin-inline: auto;
  padding-inline: var(--content-padding-mobile);
}

@media (width >= 600px) {
  main > .section > div {
    padding-inline: var(--content-padding-tablet);
  }
}

@media (width >= 900px) {
  main > .section > div {
    padding-inline: var(--content-padding-desktop);
  }
}

/* Inner tier: reading width on default content */
main > .section > .default-content-wrapper {
  max-width: var(--measure);
  margin-inline: auto;
}

/* Section metadata variants */
main .section.light,
main .section.highlight {
  background-color: var(--color-background-soft);
  margin: 0;
  padding: var(--section-spacing) 0;
}
```

### Question 2: EDS Selector Compatibility

#### 2a: Does EDS decoration always produce a `div` child inside `.section`?

**Yes, confirmed from reading `aem.js` lines 494-529.** The `decorateSections()` function iterates over `main > div` children, creates wrapper `<div>` elements (either `.default-content-wrapper` for inline content or block wrappers for block `<div>` elements), and appends them inside the section. After decoration, every `.section` contains one or more `<div>` children. The selector `main > .section > div` will always match.

However, there is a subtlety: The `div` children are the wrapper divs (`.default-content-wrapper`, `.{blockname}-wrapper`). So `main > .section > div` targets all wrappers uniformly, which is correct for the outer tier width constraint. And `main > .section > .default-content-wrapper` specifically targets reading content wrappers, which is correct for the inner tier constraint.

**Important**: The `main > div` rule (pre-decoration fallback) fires before `decorateSections()` runs. During eager loading, the first section is loaded and displayed. The `main > div` rule provides the initial layout. Once `decorateSections()` adds `.section` class, the `.section`-scoped rules take over. This transition is seamless because `main > .section > div` inherits the same geometry. Keep the `main > div` fallback but align its values with the token-based rules.

#### 2b: Media query syntax -- `(width >= 900px)` vs `(min-width: 900px)`

**Use `(width >= 900px)` range syntax exclusively.** This is not a style preference; it is enforced by the linter.

I tested both syntaxes against the project's stylelint configuration (`stylelint-config-standard` v40). The result:
- `(width >= 600px)` -- **passes** lint
- `(min-width: 600px)` -- **fails** lint with error: `Expected "context" media feature range notation (media-feature-range-notation)`

The `stylelint-config-standard` v40 enforces the CSS Media Queries Level 4 range notation. The DDD-001 spec uses `(min-width: ...)` in its CSS snippets, but these must be translated to `(width >= ...)` in the actual implementation to pass `npm run lint`.

**This is an implementation deviation from DDD-001's literal CSS snippets.** Per software-docs-minion's guidance, this should be noted in the commit message but does not require a DDD addendum because the behavior is identical -- only the syntax differs.

The existing boilerplate `styles.css` already uses the correct range syntax at line 56 and 245. The existing `tokens.css` uses `(min-width: 900px)` at line 94, which is one of its current lint errors. Both files will use range syntax after this implementation.

#### 2c: Does any EDS decoration code set `overflow: hidden` on `.default-content-wrapper`?

**No.** I read the entire `aem.js` file (730 lines). The `decorateSections()` function (lines 494-529) creates `.default-content-wrapper` elements but only:
1. Adds the `default-content-wrapper` class
2. Appends child elements into it

It does not set any inline styles on wrapper elements. The only inline style set is `section.style.display = 'none'` (line 510), which is later cleared by `loadSection()` (line 683: `section.style.display = null`).

`scripts.js` does not set any styles on `.default-content-wrapper` either.

The boilerplate `styles.css` does not have `overflow: hidden` on `.default-content-wrapper`. The only `overflow` declarations are:
- `overflow-x: auto` on `pre` (line 141) -- correct, for horizontal scrolling of code blocks
- `overflow: hidden` on `a.button` (line 187) -- scoped to buttons, not wrappers

**Conclusion: The escape hatch requirement is already met.** No code adds `overflow: hidden` to `.default-content-wrapper`. The implementation simply needs to avoid introducing it.

### Question 3: Drafts Test Content

Create a single comprehensive test page at `drafts/layout-test.html`. One page is sufficient because all layout behaviors can be exercised in a single document with multiple sections. Separate pages would add maintenance burden without testing value.

#### EDS-valid markup structure

The `drafts/` folder content must follow EDS markup conventions. When using `--html-folder drafts`, the AEM CLI serves static HTML files. The markup must match what the AEM backend would produce (before EDS decoration), so that `decorateSections()` and `decorateBlocks()` can process it correctly.

The key convention: `main` contains bare `<div>` elements (one per section). Inside each `<div>`, inline content (headings, paragraphs, lists) is placed directly. Block content is a `<div>` with the block class name. EDS decoration then wraps inline content in `.default-content-wrapper` and block content in `.{blockname}-wrapper`.

```html
<body>
  <header></header>
  <main>
    <!-- Section 1: Basic content for reading width verification -->
    <div>
      <h1>Layout Test Page</h1>
      <p>A paragraph of sufficient length to verify reading width constraint.
         This text should wrap within the --measure (68ch) column at desktop
         widths and fill the viewport minus padding at mobile widths. The
         comfortable reading width is approximately 550-612px depending on
         font size.</p>
      <p>Second paragraph to verify --space-paragraph spacing between
         consecutive paragraphs within a section.</p>
    </div>

    <!-- Horizontal rule creates a section break in EDS -->

    <!-- Section 2: Code block escape hatch -->
    <div>
      <h2>Code Block Overflow Test</h2>
      <p>The following code block contains a very long line that should
         scroll horizontally, not be clipped.</p>
      <pre><code>const veryLongVariableName = someFunction(argumentOne, argumentTwo, argumentThree, argumentFour, argumentFive, argumentSix, argumentSeven) // This line is intentionally very long to test horizontal scrolling behavior within the default-content-wrapper</code></pre>
      <p>Text after the code block should return to normal reading width.</p>
    </div>

    <!-- Section 3: Multiple element types for spacing verification -->
    <div>
      <h2>Element Spacing Test</h2>
      <p>Paragraph before a list.</p>
      <ul>
        <li>List item one</li>
        <li>List item two</li>
        <li>List item three</li>
      </ul>
      <p>Paragraph after a list, testing --space-element gap.</p>
      <h3>Subheading Within Section</h3>
      <p>Content under a subheading to verify heading asymmetric spacing
         (more space above than below).</p>
    </div>

    <!-- Section 4: Short content (simulates TIL post) -->
    <div>
      <h2>Short Section</h2>
      <p>A single short paragraph to verify section spacing does not create
         excessive gaps for brief content.</p>
    </div>
  </main>
  <footer></footer>
</body>
```

#### What this test page validates

| Behavior | How to verify |
|----------|---------------|
| Two-tier width: outer `--layout-max` | At 1200px+, section containers cap at 1200px and center |
| Two-tier width: inner `--measure` | `.default-content-wrapper` constrains to ~550-612px within the layout-max container |
| Mobile padding (< 600px) | At 375px viewport, content has 20px side padding |
| Tablet padding (>= 600px) | At 600-899px, content has 24px side padding |
| Desktop padding (>= 900px) | At 900px+, content has 32px side padding |
| Wide desktop (>= 1200px) | Layout max caps, whitespace distributes on both sides |
| Section spacing | 48px gap between sections |
| First section no top margin | Section 1 starts immediately below header |
| Code block escape hatch | Long `<pre>` line scrolls horizontally, not clipped |
| `.default-content-wrapper` no overflow:hidden | Inspect computed styles to confirm |

#### Running the test

```bash
npx @adobe/aem-cli up --html-folder drafts --no-open --forward-browser-logs
```

Then verify at `http://localhost:3000/layout-test` at viewport widths: 375px, 600px, 900px, 1200px, 1440px.

## Recommendations

### 1. Edit order matters -- follow the four-phase sequence

The phases are ordered by dependency. Tokens must exist before `styles.css` references them. `head.html` must load `tokens.css` before `styles.css` takes effect. The boilerplate `:root` must be removed before the new selectors make sense (to avoid duplicate/conflicting variable definitions).

Do NOT attempt to edit `styles.css` incrementally (e.g., "change one variable at a time"). The boilerplate `:root` block and the project tokens define the same semantic concepts under different names. Having both present simultaneously creates confusion and the risk of partial overrides. Remove the boilerplate block entirely, then update all references in one pass.

### 2. Use range syntax for all media queries

All media queries in both `tokens.css` and `styles.css` must use the CSS Media Queries Level 4 range syntax (`width >= 600px`) rather than the traditional `min-width` syntax. This is enforced by stylelint. The DDD-001 spec's CSS snippets use `min-width` but this is a notation difference, not a behavioral one.

### 3. Remove Roboto `@font-face` fallbacks from `styles.css` but defer full font cleanup

The two Roboto fallback `@font-face` declarations in `styles.css` reference font families that are no longer used after the variable replacement. Remove them as part of this task. However, the full font cleanup (removing `fonts/roboto-*.woff2` files and updating `fonts.css` to remove Roboto `@font-face` declarations) should be a separate follow-up task. The `fonts.css` Roboto declarations are harmless because no CSS rule references the `roboto` or `roboto-condensed` font families after our edits.

### 4. Remove `border-radius: 8px` from `pre` blocks

Line 139 of the boilerplate `styles.css` sets `border-radius: 8px` on `pre` elements. DDD-001's aesthetic rules (inherited from CLAUDE.md) state "No rounded containers." Code blocks are containers; the border-radius must go. Replace with `border-radius: 0` or simply remove the property.

### 5. Keep the pre-decoration `main > div` fallback

The `main > div { margin: 40px 16px; }` rule (line 145-147) fires before EDS decoration runs. It prevents layout shift during the decoration phase. Update it to use tokens but keep it in place. Without it, content would briefly render with no margins.

### 6. Fix existing lint errors in `tokens.css` as part of this task

`tokens.css` currently fails `npm run lint:css` with 5 errors (4 `custom-property-empty-line-before` violations and 1 `media-feature-range-notation` violation). Since we are already editing `tokens.css` to add tokens, fix these at the same time. The fix is mechanical:
- Remove blank lines between consecutive custom properties within the same `:root` block (dark mode section)
- Change `(min-width: 900px)` to `(width >= 900px)`

### 7. Do NOT add `overflow: hidden` to `.default-content-wrapper`

This is an explicit non-action confirmed by code review. Neither `aem.js` nor `styles.css` currently sets `overflow: hidden` on `.default-content-wrapper`. The implementation must not introduce it. Code blocks with long lines must scroll horizontally at the `<pre>` element level.

## Proposed Tasks

### Task 1: Add proposed tokens to `tokens.css` and fix lint errors (Phase A)

**File**: `styles/tokens.css`

Edits:
1. Update file header comment: replace `@import url('tokens.css')` line with `Loaded via <link> in head.html before styles.css.`
2. Add four tokens to `/* --- Spacing --- */` section, before the closing `}` of the light-mode `:root`:
   - `--layout-max: 1200px;`
   - `--content-padding-tablet: 24px;`
   - `--space-paragraph: 1em;`
   - `--space-element: 1.5em;`
3. Fix dark mode `:root` block: remove blank lines between custom properties within each group (lines 74-89 area)
4. Fix desktop media query: change `@media (min-width: 900px)` to `@media (width >= 900px)` (line 94)

**Verification**: `npx stylelint styles/tokens.css` passes with zero errors.

### Task 2: Update `head.html` to load `tokens.css` (Phase B)

**File**: `head.html`

Insert before the existing `styles.css` link:
```html
<link rel="stylesheet" href="/styles/tokens.css"/>
```

Final `head.html` order:
1. CSP meta tag
2. Viewport meta tag
3. aem.js script
4. scripts.js script
5. tokens.css link (NEW)
6. styles.css link

### Task 3: Replace boilerplate `:root` and remap all `var()` references in `styles.css` (Phase C)

**File**: `styles/styles.css`

This is the largest and riskiest task. Edits:

1. **Delete** the boilerplate `:root` block (lines 13-41 -- from `--background-color: white` through closing `}`)
2. **Delete** both Roboto `@font-face` fallback blocks (lines 44-54)
3. **Delete** the boilerplate `@media (width >= 900px) { :root { ... } }` responsive block (lines 56-71)
4. **Replace** all 16 `var()` references per the mapping table in Question 1 answer
5. **Update** `body` line-height from `1.6` to `var(--line-height-body)`
6. **Update** heading `line-height` from `1.25` to `var(--line-height-heading)`
7. **Remove** `border-radius: 8px` from `pre` rule

**Verification**: `npx stylelint styles/styles.css` passes with zero errors. All `var()` references resolve to tokens defined in `tokens.css`.

### Task 4: Implement two-tier width model, responsive padding, and section spacing (Phase D)

**File**: `styles/styles.css`

Replace the existing section layout rules (lines 145-147 and 231-258) with DDD-001 specified CSS:

1. **Update** `main > div` pre-decoration fallback to use tokens
2. **Replace** `main > .section` margin rule with `margin-block: var(--section-spacing)`
3. **Keep** `main > .section:first-of-type` with `margin-block-start: 0`
4. **Replace** `main > .section > div` with token-based outer tier (max-width, margin-inline, padding-inline)
5. **Add** `@media (width >= 600px)` breakpoint for tablet padding
6. **Add** `@media (width >= 900px)` breakpoint for desktop padding (replacing the existing one)
7. **Add** `main > .section > .default-content-wrapper` inner tier rule (max-width, margin-inline)
8. **Update** section metadata variants to use project tokens

**Verification**: Dev server renders correctly at all four breakpoints.

### Task 5: Create test content in `drafts/`

**File**: `drafts/layout-test.html`

Create a single test page with four sections exercising:
- Reading width constraint (long paragraphs)
- Code block horizontal scroll (long `<pre>` line)
- Multiple element types (headings, paragraphs, lists)
- Short content section (TIL simulation)

Must follow EDS markup conventions (bare `<div>` sections inside `<main>`, no wrapper classes -- decoration adds those).

**Verification**: `npx @adobe/aem-cli up --html-folder drafts --no-open` serves the page at `http://localhost:3000/layout-test`. Inspect at 375px, 600px, 900px, 1200px, 1440px viewports.

### Task 6: Update AGENTS.md Project Structure tree

**File**: `AGENTS.md`

Add `tokens.css` to the `styles/` listing with load-order annotation (per software-docs-minion's recommendation):

```
├── styles/          # Global styles and CSS
    ├── tokens.css          # Design tokens (loaded first -- must precede styles.css in head.html)
    ├── styles.css          # Minimal global styling and layout for your website required for LCP
    ├── lazy-styles.css     # Additional global styling and layout for below the fold/post LCP content
    └── fonts.css           # Font definitions
```

### Task 7: Final verification

Run in sequence:
1. `npm run lint` -- must pass with zero errors
2. Start dev server with `--html-folder drafts`
3. Verify layout at all breakpoints
4. Run Lighthouse on `http://localhost:3000/layout-test` -- target score 100
5. Grep entire project for orphaned boilerplate variable references: `--background-color`, `--light-color`, `--dark-color`, `--text-color`, `--link-color`, `--link-hover-color`, `--body-font-family`, `--heading-font-family`

## Risks and Concerns

### Risk 1: Incomplete `var()` reference replacement (HIGH)

If any `var(--background-color)` or similar boilerplate reference survives in `styles.css` or any block CSS file, it resolves to the CSS initial value (e.g., `transparent` for background-color, `black` for color). This creates visually broken pages with no console error.

**Mitigation**: After Phase C, run a project-wide grep for all eight boilerplate variable names. Any match outside of `fonts.css` (which is out of scope) is a bug.

### Risk 2: `fonts.css` still loads Roboto `@font-face` declarations (LOW)

`fonts.css` declares `@font-face` rules for `roboto`, `roboto-condensed` with actual woff2 font files. After our edits, no CSS rule references these font families, so the declarations are dead weight. However, `loadFonts()` in `scripts.js` still loads `fonts.css`, which triggers HTTP requests for font files that are never used.

**Mitigation**: This is a follow-up task. The font file requests are wasted bytes but do not break layout or cause visual issues. They will affect Lighthouse performance score only if the font files are large enough to impact load time.

**Recommendation**: Flag a follow-up issue to replace `fonts.css` content with project fonts (Source Sans 3, Source Code Pro, Source Serif 4). These are loaded from Google Fonts per CLAUDE.md, but `fonts.css` should declare their fallback `@font-face` rules (with `size-adjust`) as the boilerplate does for Roboto. This is a separate task.

### Risk 3: Media query syntax deviation from DDD-001 spec (LOW)

DDD-001's CSS snippets use `(min-width: 600px)` syntax. The implementation will use `(width >= 600px)` to pass stylelint. This is a notation difference with identical browser behavior. CSS Media Queries Level 4 range syntax is supported in all modern browsers (Chrome 104+, Firefox 63+, Safari 16.4+).

**Mitigation**: Note in commit message. No DDD addendum needed.

### Risk 4: `ch` unit renders differently with missing font (MEDIUM)

`--measure: 68ch` is relative to the `0` character width of the active font. If Source Sans 3 has not loaded yet (it is loaded lazily via `fonts.css` in the `loadLazy` phase), the `ch` unit is calculated against the fallback `sans-serif` font. This could cause a brief layout shift when the font loads -- the content column width changes slightly.

**Mitigation**: This is inherent to the `ch` unit approach and is acknowledged in DDD-001 Open Question #2. The shift is small (few pixels) and only occurs once per page load. The `font-display: swap` pattern used by EDS minimizes the impact. No action needed for this task; DDD-005/006 should validate the actual rendered widths.

### Risk 5: `drafts/` markup does not match AEM backend output (MEDIUM)

If the test HTML does not precisely follow EDS markup conventions, the decoration pipeline may not produce the expected DOM structure, and the CSS selectors will not match. For example, if the test HTML already includes `.section` classes or wrapper divs, `decorateSections()` will double-wrap the content.

**Mitigation**: The test HTML must contain only raw `<div>` sections inside `<main>` with no EDS-specific classes. The decoration pipeline adds `.section`, `.default-content-wrapper`, etc. Verify with browser DevTools that the decorated DOM matches the DDD-001 HTML structure diagram.

### Risk 6: Block CSS files may reference boilerplate variables (LOW)

The `blocks/` directory may contain CSS files that reference boilerplate variable names like `--background-color`. If these blocks are rendered, the references will resolve to initial values.

**Mitigation**: This project appears to be early-stage with minimal block CSS. The project-wide grep in Task 7 will catch any such references. If found, update them in the same commit.

## Additional Agents Needed

None. This is a frontend CSS implementation task that falls entirely within the frontend-minion's domain. The software-docs-minion has already provided documentation guidance (AGENTS.md update, tokens.css comment update, commit message recommendations). No other specialists are needed for planning or execution.

One coordination note: if test-minion or ux-strategy-minion have provided input on the mobile line-length question (DDD-001 Open Question #3) or the breakpoint padding "jump" concern, their recommendations should be reviewed before execution. However, DDD-001 explicitly defers the mobile line-length question to DDD-005/006, so it should not block this implementation.
