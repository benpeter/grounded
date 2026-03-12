# Phase 3: Synthesis — DDD-001 Global Layout

## Delegation Plan

**Team name**: ddd-001-global-layout
**Description**: Create the Design Decision Document for global page layout, defining content widths, responsive breakpoints, spacing scale, and CSS architecture for an AEM Edge Delivery Services blog.

### Task 1: Write DDD-001-global-layout.md
- **Agent**: frontend-minion
- **Delegation type**: standard
- **Model**: sonnet
- **Mode**: default
- **Blocked by**: none
- **Approval gate**: yes
- **Gate reason**: This DDD is the foundational design contract that all subsequent DDDs (002-008) depend on. Layout-max, measure, spacing scale, breakpoints, and CSS architecture decisions propagate to every surface. Hard to reverse once downstream DDDs and implementation build on it. This is the single highest-blast-radius decision in the design system.
- **Prompt**: |

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

    Include the full element-pair spacing table:

    | Element pair | Spacing | Rationale |
    |---|---|---|
    | Paragraph to paragraph | 1em | Standard prose flow |
    | Heading (h2/h3) above | 2em | Topic shift — scannable rest stop |
    | Heading (h2/h3) below | 0.5em | Tight coupling to following content |
    | Code block above/below | 1.5em | Breathing room for visually distinct elements |
    | Pull-quote above/below | 2em | Editorial interruption — visual prominence |
    | List above/below | 1em | Lists are inline content |
    | List item to list item | 0.25em-0.5em | Tight grouping |
    | Image/figure above/below | 1.5em | Same as code blocks |
    | HR / thematic break | 3em above, 3em below | Explicit "new chapter" signal |

    Note: these values are recommendations for DDD-005/006 to formalize. DDD-001
    establishes the scale and principles; downstream DDDs set exact values per
    element.

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

    5. **Boilerplate cleanup notes**: The `main > div` pre-decoration rule
       (margin: 40px 16px) is dead code in EDS (body is hidden until JS runs).
       The `border-radius: 8px` on `<pre>` violates the "no rounded containers"
       rule. The boilerplate Roboto font-face declarations need replacement. These
       are implementation notes, not DDD-001 scope, but document them as guidance
       for the implementing agent.

    6. **Code block escape hatch**: The container architecture MUST allow child
       elements within `.default-content-wrapper` to visually extend beyond
       `--measure` up to `--layout-max`. Do NOT use `overflow: hidden` on the
       `.default-content-wrapper`. The exact mechanism (negative margins, wider
       container for `<pre>`) is DDD-006's decision, but DDD-001 must not
       foreclose it. Note this constraint explicitly.

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

    4. Section spacing of 48px is fixed. Short-form content (TILs at 100-500
       words) may feel like it floats in excessive whitespace compared to long
       build-logs. Should DDD-005 define per-type spacing adjustments, or is
       uniform spacing the right default?

    5. Should the boilerplate divergence (our styles.css vs. upstream
       adobe/aem-boilerplate) be formally tracked, or is it accepted that this is a
       one-way fork for styles?

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

- **Deliverables**: `/Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-001-global-layout.md`
- **Success criteria**: The DDD exists, follows the template format exactly, contains all required sections, every visual value references a token, ASCII wireframes show the two-tier width model at multiple breakpoints, and status is "Proposal".

### Cross-Cutting Coverage

- **Testing** (test-minion): Not applicable. This task produces a design document, not executable code. No tests to run.
- **Security** (security-minion): Not applicable. A design document creates no attack surface, handles no user input, and manages no secrets.
- **Usability -- Strategy** (ux-strategy-minion): Covered. ux-strategy-minion contributed to planning. Their spacing scale, vertical rhythm rules, padding progression, and reading-width analysis are incorporated directly into the Task 1 prompt. No separate execution task needed — the specialist input is baked into the writing instructions.
- **Usability -- Design** (ux-design-minion, accessibility-minion): Not applicable as a separate execution task. The DDD itself documents the spatial layout; no UI components are being built. Accessibility constraint (WCAG 1.4.12 text spacing override tolerance) is included as a note in the prompt.
- **Documentation** (software-docs-minion, user-docs-minion): The DDD IS the documentation. It is a design specification document. No additional documentation task is needed.
- **Observability** (observability-minion, sitespeed-minion): Not applicable. No runtime components are produced. Performance constraints (Lighthouse 100, <100KB) are referenced in the DDD context but no measurement is possible until implementation.

### Architecture Review Agents

- **Mandatory** (5): security-minion, test-minion, ux-strategy-minion, lucy, margo
- **Discretionary picks**:
  - accessibility-minion: The DDD defines the page container architecture including overflow behavior. WCAG 1.4.12 (text spacing) requires that containers not break under user-overridden spacing. Review ensures the layout architecture permits this. References Task 1 (container overflow and spacing decisions).
- **Not selected**: ux-design-minion (no UI components produced), sitespeed-minion (no runtime code), observability-minion (no runtime components), user-docs-minion (no end-user documentation impact)

### Conflict Resolutions

No conflicts between specialists. frontend-minion and ux-strategy-minion reached consensus on all key decisions:

- **Two-tier width model**: Both independently recommended `--measure` for prose within `--layout-max` for the page container. Identical approach.
- **Fixed vs. fluid spacing**: Both recommend fixed values. ux-strategy-minion explicitly argued against clamp()/viewport-unit spacing. Agreed.
- **Section spacing 48px**: Both accept the existing token value. ux-strategy-minion adds nuance (three-tier scale underneath), which complements rather than conflicts with frontend-minion's recommendation.
- **Token loading**: frontend-minion recommended Option 2 (separate `<link>` in head.html). ux-strategy-minion did not address this (correctly — it is outside their domain). No conflict.
- **Boilerplate replacement**: frontend-minion recommended full replacement with no mapping layer. ux-strategy-minion did not address this. No conflict.

One area of emphasis difference (not a conflict): ux-strategy-minion strongly emphasized the code block escape hatch — the need for `.default-content-wrapper` to NOT use `overflow: hidden` so code blocks can extend beyond `--measure`. frontend-minion acknowledged this in the two-tier model but did not elevate it as prominently. Synthesis: elevated to an explicit constraint in the CSS Approach section of the prompt, since getting this wrong would force ugly workarounds in DDD-006.

### Risks and Mitigations

| Risk | Source | Severity | Mitigation |
|---|---|---|---|
| `68ch` renders unpredictable pixel width depending on font metrics | Both specialists | Medium | DDD includes Open Question #2 requesting validation once fonts load. Implementation task should verify actual character count. |
| Mobile 20px font on 375px screen yields ~38 chars/line (below 45-char minimum) | ux-strategy-minion | Low | Flagged as Open Question #3 in DDD. This is a typography decision (DDD-005/006), not a layout decision. Layout enables either answer. |
| Code blocks trapped at 68ch if container uses overflow:hidden | ux-strategy-minion | High | Explicit constraint in CSS Approach: do NOT use overflow:hidden on .default-content-wrapper. Escape hatch architecture is a hard requirement. |
| Boilerplate divergence from upstream adobe/aem-boilerplate | frontend-minion | Low | Flagged as Open Question #5 in DDD. Expected and accepted — boilerplate is a starting point, not a living dependency. |
| Three font families increase CLS risk during loading | frontend-minion | Medium | Out of DDD-001 scope (implementation concern for font loading strategy). Noted for implementing agent. |
| @import comment in tokens.css is misleading | frontend-minion | Low | Noted in CSS Approach section. Will be updated during implementation. |
| WCAG 1.4.12 text spacing — layout must not break under user-overridden spacing | ux-strategy-minion | Medium | Included as accessibility constraint: no fixed heights, no overflow:hidden on text containers. Architecture review by accessibility-minion provides additional coverage. |

### Execution Order

```
Batch 1: Task 1 (Write DDD-001-global-layout.md)
          └─ APPROVAL GATE: Human reviews the DDD
```

Single-task plan. No parallelism needed. The gate is the DDD review itself — this is the foundational design contract for the entire site.

### Verification Steps

1. File exists at `docs/design-decisions/DDD-001-global-layout.md`
2. File follows the DDD template from README.md (all required sections present)
3. Status is "Proposal"
4. No hardcoded visual values — every color, size, spacing references a token
5. ASCII wireframes present for at least mobile and desktop views
6. HTML Structure shows post-EDS-decoration page skeleton
7. CSS Approach covers token loading strategy, boilerplate replacement, and two-tier width
8. Token Usage table is complete with proposed new tokens marked
9. `npm run lint` passes (the .md file itself is not linted, but no code files are modified)

---

## Approval Gate Detail

```
APPROVAL GATE: DDD-001 Global Layout Design Decision
Agent: frontend-minion | Blocked tasks: all subsequent DDDs (002-008), all CSS implementation

DECISION: Foundational layout contract defining two-tier width model (68ch reading
column within 1200px layout max), three-tier spacing scale, and CSS architecture
for token integration with AEM Edge Delivery Services boilerplate.

DELIVERABLE:
  docs/design-decisions/DDD-001-global-layout.md (new file, ~200-300 lines)
  Summary: Design Decision Document specifying page chrome — content widths,
  responsive breakpoints, spacing scale, CSS approach for token system
  integration, and semantic page skeleton.

RATIONALE:
- Two-tier width (--measure + --layout-max) enables prose readability at 68ch
  while giving blocks (code, post-index) room to extend to 1200px
- Three-tier spacing scale (paragraph/element/section) using em units provides
  proportional rhythm that responds to the existing responsive font sizes
- Separate <link> for tokens.css avoids @import render-blocking chain while
  maintaining file independence for the "single source of truth" design
- Rejected: single-tier width (applying --measure to all wrappers) — would trap
  code blocks and future wide blocks at 68ch, requiring negative-margin hacks
- Rejected: fluid spacing with clamp() — unnecessary complexity when the reading
  column is already capped and font sizes provide responsive adjustment

IMPACT: Approving establishes the spatial contract for the entire site. All
subsequent DDDs (header, footer, post detail, typography, dark mode) build on
these width, spacing, and breakpoint decisions. Rejecting means revising the
layout approach before any other design surface can proceed.
Confidence: MEDIUM
```

Confidence is MEDIUM because: the two-tier width model is a sound approach but
the user may have opinions on the specific --measure value (68ch), the proposed
new tokens (--content-padding-tablet, --space-paragraph, --space-element,
--layout-max), or the padding progression (20/24/32px). Multiple valid
alternatives exist for these specific values.
