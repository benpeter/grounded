# DDD-001: Global Layout

Status: **Approved**

## Context

Global layout is the foundational layout contract for the Mostly Hallucinations blog. Every subsequent surface — header, footer, post index, post detail, typography — inherits the geometry established here.

### Governing constraints

**Aesthetic rules (CLAUDE.md)**

- `--color-background` (#F6F4EE) is the dominant visual. The page is warm white paper.
- Green (`--color-heading`) and gold (`--color-accent`) are quiet guests, not theme colors.
- No cards with shadows, no gradients, no rounded containers, no hero images, no decorative icons.
- Typography creates hierarchy, not color blocks or boxes.

**Design tokens (styles/tokens.css)**

`styles/tokens.css` is the single source of truth for all visual values. No hardcoded hex values or pixel values outside of token definitions.

**Site structure (docs/site-structure.md)**

- Single-column layout, no sidebar.
- Header: logo + tagline only, no navigation links.
- Footer: copyright line with three links.
- Home page is the post index.

**EDS markup (AGENTS.md)**

AEM Edge Delivery Services decoration produces this section anatomy:

```
main > .section > .default-content-wrapper   (default content)
main > .section > .{blockname}-wrapper       (decorated blocks)
```

CSS selectors must target this structure. All block selectors are scoped to the block.

**Breakpoints (AGENTS.md)**

Mobile-first. `min-width` media queries at `600px`, `900px`, `1200px`.

**Performance (CLAUDE.md)**

- Target less than 100KB per text post, sub-second loads, Lighthouse 100.
- No external dependencies beyond Google Fonts (Source Sans 3, Source Code Pro, Source Serif 4).
- Follow EDS three-phase loading: eager → lazy → delayed.

---

## Proposal

### Layout

The layout uses a **two-tier width model**:

1. **Layout max** (`--layout-max: 1200px`) — the outer guardrail applied to `main > .section > div`. No content exceeds this width.
2. **Reading width** (`--measure: 68ch`) — the comfortable reading column applied to `.default-content-wrapper`. At `--body-font-size-m` (18–20px for Source Sans 3), 68ch renders approximately 550–612px.

The two tiers nest: `.default-content-wrapper` is centered within the `--layout-max` container. Block wrappers (`.{blockname}-wrapper`) may also adopt `--measure` or `--layout-max` depending on their surface DDD.

#### Wireframes

**Mobile (< 600px)**

```
+-----------------------------------------+
| <-- viewport width -------------------> |
|                                         |
| <20px> +---------------------+ <20px>   |
|        | content fills       |          |
|        | remaining width     |          |
|        |                     |          |
|        | (no --measure       |          |
|        |  constraint)        |          |
|        +---------------------+          |
|                                         |
| --content-padding-mobile (20px)         |
|   is the entire margin                  |
+-----------------------------------------+
```

**Tablet (≥ 600px)**

```
+-------------------------------------------------------+
| <-- viewport (600px+) ------------------------------> |
|                                                       |
| <24px> +---------------------------------+ <24px>     |
|        | .default-content-wrapper        |            |
|        | begins to be constrained        |            |
|        | by --measure (68ch)             |            |
|        | as viewport widens              |            |
|        +---------------------------------+            |
|                                                       |
| --content-padding-tablet (24px) (proposed)            |
+-------------------------------------------------------+
```

**Desktop (≥ 900px)**

```
+----------------------------------------------------------------------+
| <-- viewport (900px+) ---------------------------------------------> |
|                                                                      |
| <32px> +------------------------------------------------+ <32px>     |
|        | main > .section > div                          |            |
|        | max-width: --layout-max (1200px)               |            |
|        | +-----------------------------+                |            |
|        | | .default-content-wrapper    |                |            |
|        | | max-width: --measure        |                |            |
|        | | (68ch ~ 550-612px)          |                |            |
|        | | centered within layout      |                |            |
|        | +-----------------------------+                |            |
|        +------------------------------------------------+            |
|                                                                      |
| --content-padding-desktop (32px)                                     |
+----------------------------------------------------------------------+
```

**Wide desktop (≥ 1200px)**

```
+------------------------------------------------------------------------------+
| <-- viewport (1200px+) ----------------------------------------------------> |
|                                                                              |
|         +------------------------------------------------+                   |
|         | main > .section > div                          |                   |
|         | capped at --layout-max (1200px)                |                   |
|         | centered with auto margins                     |                   |
|         | +-----------------------------+                |                   |
|         | | .default-content-wrapper    |                |                   |
|         | | max-width: --measure        |                |                   |
|         | | (68ch ~ 550-612px)          |                |                   |
|         | +-----------------------------+                |                   |
|         +------------------------------------------------+                   |
|                                                                              |
| Whitespace distributes on both sides of --layout-max                         |
+------------------------------------------------------------------------------+
```

### Typography

Typography is governed in detail by DDD-006. The layout-relevant facts are:

- Body text: `--font-body` ('Source Sans 3'), `--body-font-size-m` (20px mobile / 18px desktop at ≥ 900px).
- Headings: `--font-heading` ('Source Code Pro').
- The `ch` unit in `--measure: 68ch` is relative to the `0` character width of `--font-body` at the current `--body-font-size-m`. This means `--measure` resolves to approximately 550px at 18px and 612px at 20px. See Open Question #2.

Full typography decisions — heading hierarchy, line heights, element-level sizes — are deferred to DDD-005 and DDD-006.

### Spacing & Rhythm

A three-tier spacing scale governs vertical rhythm across the page.

| Token | Value | Use |
|---|---|---|
| `--space-paragraph` (proposed) | 1em (~18–20px) | Between paragraphs within a section |
| `--space-element` (proposed) | 1.5em (~27–30px) | Between distinct elements (image + caption, list + following paragraph) |
| `--section-spacing` | 48px | Between major page sections (`main > .section`) |

**Heading spacing (asymmetric)**

Headings breathe more above than below, reinforcing their role as section openers rather than closers:

- Margin above h2/h3: `2em`
- Margin below h2/h3: `0.5em`

This asymmetry pulls headings toward their following content and away from the preceding block, making hierarchy legible without rules or color.

Specific per-element spacing values for all other element pairs (paragraph → list, code block → paragraph, etc.) will be defined in DDD-005/006 using this scale.

### Responsive Behavior

Three-tier padding progression follows mobile-first order:

| Breakpoint | Padding | Content constraint | Mental model |
|---|---|---|---|
| Base (< 600px) | `--content-padding-mobile` (20px) | Viewport width minus padding | Padding IS the margin |
| ≥ 600px | `--content-padding-tablet` (24px) (proposed) | `--measure` starts to constrain as viewport widens | Transition zone |
| ≥ 900px | `--content-padding-desktop` (32px) | `--measure` always constrains reading content | Centering IS the margin |
| ≥ 1200px | `--content-padding-desktop` (32px, unchanged) | `--layout-max` caps outer container; `--measure` in ample whitespace | Whitespace distributes naturally |

The padding tokens apply to the `main > .section > div` container. At 900px+ the page never feels tight: `--content-padding-desktop` provides the minimum gutter while `--measure` provides the reading constraint.

---

## HTML Structure

The semantic page skeleton after EDS decoration. Comments show which width constraint applies at each level.

```html
<body>
  <!-- Header: lazy-loaded block, height reserved by --nav-height -->
  <header>
    <div class="header block" data-block-name="header" data-block-status="loaded">
      <!-- DDD-002 governs header internals -->
    </div>
  </header>

  <!-- Main: all page content lives here -->
  <main>
    <!-- Each authored section becomes .section after EDS decoration -->
    <!-- Constraint: none directly on .section — spacing only -->
    <div class="section">

      <!-- Default content wrapper: constrained to --measure for reading -->
      <!-- Produced by EDS for paragraphs, headings, lists outside blocks -->
      <div class="default-content-wrapper">
        <!-- reading width: max-width --measure (68ch), centered -->
        <h1>Post Title</h1>
        <p>Body content...</p>
      </div>

      <!-- Block wrapper: width governed by the block's own DDD -->
      <!-- Produced by EDS for each authored block -->
      <div class="post-meta-wrapper">
        <!-- DDD-005 governs post meta internals -->
        <div class="post-meta block">...</div>
      </div>

    </div>
    <!-- Each .section > div constrained to --layout-max (1200px) -->
    <!-- with padding: --content-padding-* at each breakpoint -->

    <div class="section">
      <div class="default-content-wrapper">
        <!-- Additional content sections follow same pattern -->
      </div>
    </div>
  </main>

  <!-- Footer: lazy-loaded block -->
  <footer>
    <div class="footer block" data-block-name="footer" data-block-status="loaded">
      <!-- DDD-003 governs footer internals -->
    </div>
  </footer>
</body>
```

---

## CSS Approach

### 1. Token loading

`tokens.css` loads as a separate `<link>` in `head.html` before `styles.css`. This ensures design tokens resolve before any layout rules run and allows an agent to update tokens without touching styles.

```html
<link rel="stylesheet" href="/styles/tokens.css" />
<link rel="stylesheet" href="/styles/styles.css" />
```

### 2. Boilerplate variable replacement

`styles.css` ships with boilerplate CSS custom properties that conflict with this project's token names. These are replaced wholesale — no mapping layer. The token in `tokens.css` is the authority; the boilerplate variable is removed.

| Boilerplate variable | Replacement token | Notes |
|---|---|---|
| `--background-color` | `--color-background` | Warm white #F6F4EE |
| `--light-color` | `--color-background-soft` | Code block surface |
| `--dark-color` | _(removed)_ | Not used |
| `--text-color` | `--color-text` | Body text #3A3A33 |
| `--link-color` | `--color-link` | Sage green |
| `--link-hover-color` | `--color-link-hover` | Deep heading green |
| `--body-font-family` | `--font-body` | Source Sans 3 |
| `--heading-font-family` | `--font-heading` | Source Code Pro |
| `--nav-height` | `--nav-height` | Same name, value updated to 80px |

All `var(--background-color)`, `var(--light-color)`, etc. references in `styles.css` are updated to reference the project tokens at the same time the boilerplate `:root` block is removed.

### 3. Two-tier width model

The outer tier caps all content within 1200px. The inner tier constrains reading content to a comfortable line length.

> **Implementation prerequisite:** The proposed tokens `--layout-max` and `--content-padding-tablet` must be added to `tokens.css` before these rules take effect. Without them, custom properties resolve to `initial` and constraints silently disappear.

```css
/* Outer tier: layout max on every section container */
main > .section > div {
  max-width: var(--layout-max);
  margin-inline: auto;
  padding-inline: var(--content-padding-mobile);
}

@media (min-width: 600px) {
  main > .section > div {
    padding-inline: var(--content-padding-tablet);
  }
}

@media (min-width: 900px) {
  main > .section > div {
    padding-inline: var(--content-padding-desktop);
  }
}

/* Inner tier: reading width on default content */
main > .section > .default-content-wrapper {
  max-width: var(--measure);
  margin-inline: auto;
}
```

### 4. Section spacing

Vertical rhythm between sections uses `--section-spacing`. The first section has no top margin (it follows directly from the header).

```css
main > .section {
  margin-block: var(--section-spacing);
}

main > .section:first-of-type {
  margin-block-start: 0;
}
```

### 5. Code block escape hatch

`.default-content-wrapper` must not have `overflow: hidden`. Code blocks inside it may contain wide pre-formatted content that should scroll horizontally rather than be clipped. The overflow behavior is managed at the `pre` element level, not the wrapper.

---

## Token Usage

| Element | Property | Token | Status |
|---|---|---|---|
| Page background | `background-color` | `--color-background` | Existing |
| Body text | `color` | `--color-text` | Existing |
| Body font family | `font-family` | `--font-body` | Existing |
| Body font size | `font-size` | `--body-font-size-m` | Existing |
| Body line height | `line-height` | `--line-height-body` | Existing |
| Heading font family | `font-family` | `--font-heading` | Existing |
| Outer section container | `max-width` | `--layout-max` | Proposed |
| Reading column | `max-width` | `--measure` | Existing |
| Mobile padding | `padding-inline` | `--content-padding-mobile` | Existing |
| Tablet padding | `padding-inline` | `--content-padding-tablet` | Proposed |
| Desktop padding | `padding-inline` | `--content-padding-desktop` | Existing |
| Section vertical gap | `margin-block` | `--section-spacing` | Existing |
| Paragraph spacing | `margin-bottom` | `--space-paragraph` | Proposed |
| Element spacing | `margin-bottom` | `--space-element` | Proposed |
| Header height reservation | `height` | `--nav-height` | Existing |

---

## Open Questions

1. **Header/footer alignment**: Should the header and footer constrain to `--measure` (matching reading content) or `--layout-max` (full layout width)? The current assumption is `--layout-max` — a wide, grounded baseline beneath a narrow reading column. DDD-002 and DDD-003 should confirm this.

2. **ch unit font dependency**: `--measure: 68ch` is relative to the `0` character width of Source Sans 3 at the active `--body-font-size-m`. At 18px this renders approximately 550px; at 20px approximately 612px. This range should be validated in-browser against the loaded font before DDD-005/006 defines responsive typography rules that depend on line length.

3. **Mobile line length**: At `--content-padding-mobile` of 20px on a 375px viewport, the content column is 335px. At 20px body font size this yields approximately 37–40 characters per line, below the 45-character minimum recommended for comfortable reading. If DDD-005/006 resolves this by adjusting mobile font size or by updating `--measure` for mobile, DDD-001's wireframes and responsive behavior table must be updated to reflect the new geometry.

4. **Section spacing for short-form content**: `--section-spacing: 48px` between sections works for long-form build logs but may create excessive visual gap on short TIL posts (100–500 words, often a single section). DDD-005 should evaluate whether TIL posts warrant a smaller section spacing or a tighter content presentation.

5. **Focus ring contrast**: `--color-accent` (#D9B84A) used as a focus ring color achieves approximately 2.7:1 contrast against `--color-background` (#F6F4EE), below the WCAG 2.4.13 minimum of 3:1 for focus indicators. The implementing agent must verify focus indicator contrast before shipping and must use an alternative token or value if the threshold is not met.

---

## Decision

- [x] Approved
- [ ] Approved with changes
- [ ] Rejected

### Reviewer Notes

Approved 2026-03-12. Proceed to implementation.
