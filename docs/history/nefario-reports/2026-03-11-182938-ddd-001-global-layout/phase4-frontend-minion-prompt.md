## Task: Write DDD-001-global-layout.md

Create the Design Decision Document for global page layout at
`/Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-001-global-layout.md`.

This DDD defines the page chrome for the Mostly Hallucinations blog — a
single-column, mobile-first AEM Edge Delivery Services site with a warm-white
paper aesthetic. It is the foundational layout contract. Every subsequent DDD
(header, footer, post detail, typography) depends on the decisions made here.

### DDD Format

Follow the DDD template EXACTLY as defined in
`/Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/README.md`.
All sections are required unless marked optional. Set Status to **Proposal**.

The required sections are: Context, Proposal (with Layout, Typography, Spacing
& Rhythm, Responsive Behavior subsections), HTML Structure, CSS Approach,
Token Usage, Open Questions (optional), Decision.

### What to Include

#### Context

Reference the governing constraints:
- CLAUDE.md design token rules (warm white dominates, green/gold are quiet guests, no cards/shadows/gradients/rounded containers)
- tokens.css as single source of truth for all visual values
- AGENTS.md mobile-first breakpoints at 600px/900px/1200px (using min-width media queries)
- Single-column layout, no sidebar (CLAUDE.md)
- AEM Edge Delivery Services markup conventions (decorateSections produces .section > .default-content-wrapper / .blockname-wrapper)
- Performance: <100KB per text post, sub-second loads, Lighthouse 100

#### Proposal — Layout

Define a **two-tier width model**:

1. **Layout max** (`--layout-max: 1200px`): The outer guardrail applied to
   `main > .section > div`. No content exceeds this. This is the safety net
   for blocks that need more horizontal space (future post-index, code blocks
   with horizontal scroll).

2. **Reading width** (`--measure: 68ch`): The comfortable reading column
   applied specifically to `.default-content-wrapper`. This is the dominant
   visible width for prose content. At Source Sans 3 body sizes (18-20px),
   68ch renders approximately 550-612px.

The two tiers nest: `.default-content-wrapper` is centered within the
`--layout-max` container. On wide screens, the prose floats centered with
generous whitespace on each side — mimicking book margins, appropriate for the
warm-white-paper aesthetic.

ASCII wireframes MUST show both mobile and desktop views with token annotations.
Show the nesting of layout-max and measure. Use box-drawing characters.

Mobile wireframe should show:
- Full-width viewport
- Content-padding-mobile (20px) on each side
- Content filling remaining space (measure is wider than available space, so viewport is the constraint)

Tablet wireframe (600px+) should show:
- Content-padding-tablet (24px) on each side
- The transition point where --measure becomes the constraining factor

Desktop wireframe (900px+) should show:
- Content-padding-desktop (32px) as a safety minimum
- --measure (68ch ~550-612px) centered within --layout-max (1200px)
- The automatic whitespace created by centering

Wide desktop wireframe (1200px+) should show:
- Same as desktop but with even more surrounding whitespace

#### Proposal — Typography

This section should be BRIEF — DDD-001 covers layout, not typography. State
only the font-family tokens and size tokens that affect layout calculations
(body-font-size-m determines the ch unit, heading font affects heading
container width). Point to DDD-006 for detailed typography decisions.

#### Proposal — Spacing & Rhythm

Define a **three-tier spacing scale**:

| Token | Value | Use |
|---|---|---|
| `--space-paragraph` | 1em (~18-20px) | Between paragraphs within a section |
| `--space-element` | 1.5em (~27-30px) | Between distinct elements: after code blocks, after pull-quotes, between index entries |
| `--section-spacing` | 48px (existing token) | Between major page sections |

Using `em` for paragraph and element spacing ties rhythm to the responsive
font size (20px mobile, 18px desktop), providing proportional spacing without
fluid math.

Define **asymmetric heading spacing**:
- 2em above headings (h2/h3) — creates scannable "rest stops" for engineers
  scanning long build-logs
- 0.5em below headings — tight coupling between heading and its content

This is the single highest-impact vertical rhythm decision: headings visually
"belong to" what follows, not what precedes.

**ADVISORY [simplicity]**: Keep the spacing section focused on the three-tier scale
and asymmetric heading principle ONLY. Do NOT include a detailed element-pair
spacing table (paragraph-to-paragraph, code-block-above/below, etc.) — those
specific per-element values are DDD-005/006's scope. DDD-001 establishes the
scale and principles; downstream DDDs set exact values per element. A brief
note saying "Specific per-element spacing values will be defined in DDD-005/006
using this scale" is sufficient.

#### Proposal — Responsive Behavior

Document the **three-tier padding progression** and the conceptual shift:

| Breakpoint | Padding | Content constraint | Mental model |
|---|---|---|---|
| Base (<600px) | 20px (`--content-padding-mobile`) | Viewport width minus padding | Padding IS the margin |
| 600px+ | 24px (`--content-padding-tablet`) | --measure starts to constrain | Transition zone |
| 900px+ | 32px (`--content-padding-desktop`) | --measure always constrains | Centering IS the margin |
| 1200px+ | 32px (no change) | --measure in ample whitespace | Whitespace distributes naturally |

The critical insight to document: on mobile and small tablet, padding defines
the margin between text and screen edge. On desktop, the centered `--measure`
column creates its own generous margin and padding becomes a safety net.

A new token `--content-padding-tablet: 24px` needs to be proposed for
tokens.css. The DDD should note this as a proposed addition.

#### HTML Structure

Show the semantic page skeleton AFTER AEM Edge Delivery decoration:

```html
<body>
  <header>
    <div class="header-wrapper">
      <div class="header block" data-block-status="loaded">
        <!-- DDD-002 defines header content -->
      </div>
    </div>
  </header>
  <main>
    <div class="section">
      <div class="default-content-wrapper">
        <!-- Prose content: headings, paragraphs, lists -->
        <!-- Constrained to --measure -->
      </div>
      <div class="blockname-wrapper">
        <div class="blockname block">
          <!-- Block content -->
          <!-- Constrained to --layout-max -->
        </div>
      </div>
    </div>
    <!-- Additional sections... -->
  </main>
  <footer>
    <div class="footer-wrapper">
      <div class="footer block" data-block-status="loaded">
        <!-- DDD-003 defines footer content -->
      </div>
    </div>
  </footer>
</body>
```

Annotate with comments showing which width constraint applies where.

#### CSS Approach

Document the key architectural decisions:

1. **Token loading**: Load `tokens.css` as a separate `<link>` in `head.html`
   BEFORE `styles.css`. This avoids the render-blocking chain of `@import`
   while keeping files editable independently. The `@import` comment in
   `tokens.css` header is misleading and should be noted as needing an update.

2. **Boilerplate variable replacement**: Full replacement, no mapping layer.
   Remove the entire boilerplate `:root` block from `styles.css` and use token
   names directly. Provide the mapping table showing boilerplate variables and
   their token equivalents:

   | Boilerplate Variable | Token Equivalent | Action |
   |---|---|---|
   | `--background-color` | `--color-background` | Replace |
   | `--light-color` | `--color-background-soft` | Replace |
   | `--dark-color` | (none) | Remove (unused) |
   | `--text-color` | `--color-text` | Replace |
   | `--link-color` | `--color-link` | Replace |
   | `--link-hover-color` | `--color-link-hover` | Replace |
   | `--body-font-family` | `--font-body` | Replace |
   | `--heading-font-family` | `--font-heading` | Replace |

3. **Two-tier width selectors**:
   - `main > .section > div { max-width: var(--layout-max, 1200px); margin: auto; }` — outer guardrail
   - `main > .section > .default-content-wrapper { max-width: var(--measure); margin: auto; }` — reading column

4. **Section spacing**: Replace hardcoded `margin: 40px 0` with `margin: var(--section-spacing) 0`.

5. **Code block escape hatch**: The container architecture MUST allow child
   elements within `.default-content-wrapper` to visually extend beyond
   `--measure` up to `--layout-max`. Do NOT use `overflow: hidden` on the
   `.default-content-wrapper`. The exact mechanism (negative margins, wider
   container for `<pre>`) is DDD-006's decision, but DDD-001 must not
   foreclose it. Note this constraint explicitly.

**ADVISORY [simplicity]**: Do NOT include "Boilerplate cleanup notes" as a
CSS Approach subsection. Items like dead pre-decoration rules, border-radius
violations, or Roboto font-face replacements are implementation trivia, not
design decisions. They belong in the implementation task brief, not this DDD.

#### Token Usage

Map every layout element to its CSS custom property:

| Element | Property | Token |
|---|---|---|
| Page background | background-color | `--color-background` |
| Body text | font-family | `--font-body` |
| Body text | font-size | `--body-font-size-m` |
| Body text | line-height | `--line-height-body` |
| Body text | color | `--color-text` |
| Headings | font-family | `--font-heading` |
| Headings | line-height | `--line-height-heading` |
| Headings | color | `--color-heading` |
| Reading column | max-width | `--measure` |
| Layout container | max-width | `--layout-max` (proposed) |
| Section gap | margin | `--section-spacing` |
| Mobile padding | padding-inline | `--content-padding-mobile` |
| Tablet padding | padding-inline | `--content-padding-tablet` (proposed) |
| Desktop padding | padding-inline | `--content-padding-desktop` |
| Nav area | height | `--nav-height` |
| Paragraph spacing | margin-block | `--space-paragraph` (proposed) |
| Element spacing | margin-block | `--space-element` (proposed) |

Mark proposed new tokens clearly with "(proposed)" so the reviewer knows
what is new vs. existing.

#### Open Questions

Include these as numbered open questions:

1. Should header/footer content align with the `--measure` reading column or
   the `--layout-max` container? (Recommendation: align with `--measure` for
   visual coherence, but this is DDD-002/003's decision. DDD-001 should enable
   either approach.)

2. The `ch` unit is font-dependent. `68ch` in Source Sans 3 produces a
   different pixel width than `68ch` in Source Code Pro. Since `--measure`
   constrains the container (in body font), not individual elements, this is
   correct behavior. But the actual rendered width should be validated once
   fonts load. Does the expected ~550-612px range feel right at both 18px and
   20px body sizes?

3. Mobile body font at 20px on a 375px screen (minus 40px padding) yields
   ~38 characters per line. This is below the 45-character minimum for
   comfortable reading. Should mobile font size be reduced, or is the trade-off
   acceptable given the preference for larger readable text on small screens?
   (This is a DDD-005/006 typography question, flagged here because layout and
   font size are coupled.)

   **ADVISORY [usability]**: Add an explicit amendment clause: "If DDD-005/006
   resolves this by changing mobile font size or measure, DDD-001's wireframes
   and responsive behavior table must be updated to reflect the new geometry."

4. Section spacing of 48px is fixed. Short-form content (TILs at 100-500
   words) may feel like it floats in excessive whitespace compared to long
   build-logs. Should DDD-005 define per-type spacing adjustments, or is
   uniform spacing the right default?

5. **ADVISORY [accessibility]**: The accent color token `--color-accent`
   (#D9B84A gold) is designated in CLAUDE.md as the focus ring color. It
   achieves approximately 2.7:1 contrast against `--color-background`
   (#F6F4EE), which is below the 3:1 threshold required by WCAG 2.4.13
   (Focus Appearance). The implementing agent must verify focus indicator
   contrast and may need to darken the focus ring or add a secondary
   indicator to meet AA compliance.

**ADVISORY [simplicity]**: Do NOT include an open question about boilerplate
divergence tracking. The risk table already acknowledges this is a one-way
fork, and tracking upstream changes is a process question, not a design
question.

#### Decision

Include the standard decision checkboxes and empty Reviewer Notes section per
the DDD template.

### What NOT to Include

- No actual CSS implementation — this is a design document, not code
- No header or footer content (those are DDD-002 and DDD-003)
- No detailed typography rules beyond what affects layout (DDD-006)
- No dark mode specifics (DDD-008)
- No block-level styling decisions
- No font-face declarations or font loading strategy (implementation concern)
- No detailed element-pair spacing table (DDD-005/006 scope)
- No boilerplate cleanup notes (implementation trivia)

### Reference Files

Read these files for the full context you need:

- `/Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/README.md` — DDD format template (follow exactly)
- `/Users/ben/github/benpeter/mostly-hallucinations/styles/tokens.css` — all design tokens
- `/Users/ben/github/benpeter/mostly-hallucinations/styles/styles.css` — current boilerplate to reconcile
- `/Users/ben/github/benpeter/mostly-hallucinations/docs/site-structure.md` — site structure constraints
- `/Users/ben/github/benpeter/mostly-hallucinations/docs/content-model.md` — content types (affects spacing considerations)
- `/Users/ben/github/benpeter/mostly-hallucinations/CLAUDE.md` — design rules and aesthetic constraints
- `/Users/ben/github/benpeter/mostly-hallucinations/AGENTS.md` — EDS conventions and breakpoints

### Quality Checks

Before considering this complete, verify:
- [ ] DDD format matches README.md template exactly (all required sections present)
- [ ] Status is "Proposal"
- [ ] Every visual value references a token from tokens.css (no hardcoded hex, px without token)
- [ ] Layout uses --measure (68ch) as reading width, not a pixel max-width
- [ ] Responsive breakpoints are mobile-first at 600px / 900px / 1200px
- [ ] ASCII wireframes show spatial arrangement at mobile and desktop (minimum), ideally all four breakpoints
- [ ] HTML Structure shows the semantic page skeleton after EDS decoration
- [ ] CSS Approach explains token loading, boilerplate replacement, two-tier width model
- [ ] Token Usage table maps every layout element to its CSS custom property
- [ ] Proposed new tokens are clearly marked
- [ ] Open questions are numbered
- [ ] No detailed element-pair spacing table (scale and principles only)
- [ ] No boilerplate cleanup notes in CSS Approach
- [ ] Amendment clause present in Open Question #3
- [ ] Focus ring contrast note present in Open Questions
