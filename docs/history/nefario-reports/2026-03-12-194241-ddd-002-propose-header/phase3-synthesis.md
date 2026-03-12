# Phase 3: Synthesis — DDD-002 Header

## Delegation Plan

**Team name**: ddd-002-propose-header
**Description**: Write the DDD-002-header.md design decision document specifying the header treatment for the Mostly Hallucinations blog.

### Task 1: Write DDD-002-header.md

- **Agent**: software-docs-minion
- **Delegation type**: standard
- **Model**: sonnet
- **Mode**: bypassPermissions
- **Blocked by**: none
- **Approval gate**: no (the DDD has a built-in review process via its Decision section)
- **Prompt**: |

    ## Task

    Write `docs/design-decisions/DDD-002-header.md` — the design decision document for the header of the Mostly Hallucinations blog. The DDD must follow the exact format defined in `docs/design-decisions/README.md`. Use `docs/design-decisions/DDD-001-global-layout.md` as a format reference for tone, depth, and structure.

    Set Status to **Proposal**.

    ## Context Section

    The header is the site's primary brand surface. It appears on every page. It contains:
    - The blog name "Mostly Hallucinations" — typographic only, no logomark
    - The tagline "Generated, meet grounded."
    - A home link (the blog name itself)
    - NO navigation links, NO hamburger menu, NO search

    Reference these governing documents:
    - Brand Identity: the logo is typographic. "Mostly" is solid and grounded. "Hallucinations" has subtly corrupted letterforms — "a stroke that doesn't quite close, a counter that drifts, serifs that appear where they shouldn't on a monospaced face." The corruption evokes AI-generated text in images.
    - CLAUDE.md: --color-heading (#3F5232) is the strongest color. --color-accent (gold) appears at most once per screen. No cards, shadows, gradients. Typography creates hierarchy.
    - Site structure (docs/site-structure.md): Header is logo text + tagline, no nav links.
    - DDD-001: Establishes the two-tier width model (--layout-max / --measure), padding tokens, and section spacing. The header uses --layout-max as its outer constraint with the same padding tokens so the logo's left edge aligns with body text.

    Reference the dependency on DDD-001 for layout alignment.

    ## Proposal Section

    ### Layout

    Provide ASCII wireframes for mobile (< 600px) and desktop (>= 900px). Use ONLY pure ASCII characters (+, -, |, <, >, etc.) — no Unicode box-drawing characters.

    The layout is a **stacked three-line arrangement**, left-aligned to the content column edge:

    ```
    Line 1: "Mostly"                    (small, regular weight — the qualifier)
    Line 2: "Hallucinations"            (large, semibold — the name)
    Line 3: "Generated, meet grounded." (small, italic, muted — the tagline)
    ```

    Left-aligned, not centered. The left edge of "Mostly" aligns with the left edge of body text in main content (governed by --content-padding-* tokens from DDD-001).

    The header scrolls with the page (`position: relative` at all breakpoints). It is NOT fixed. Rationale: this site has no navigation items that need persistent access. Fixed positioning would waste 80px (12-15% of mobile viewport) on a non-interactive element. The "warm white paper" aesthetic is better served by letting content reclaim the full viewport after the header scrolls away.

    The mobile wireframe should show the stacked layout within the viewport width. The desktop wireframe should show the header within the --layout-max constraint, with padding.

    Annotate wireframes with token names.

    ### Typography

    Document these exact typographic specifications:

    | Element | Font | Weight | Size Strategy | Color | Line-height |
    |---------|------|--------|---------------|-------|-------------|
    | "Mostly" | Source Code Pro (--font-heading) | 400 (regular) | Smaller than "Hallucinations" — acts as a qualifier. Use a size approximately 55-60% of the "Hallucinations" size. Recommend `clamp()` for fluid scaling. | --color-heading | --line-height-heading (1.25) |
    | "Hallucinations" | Source Code Pro (--font-heading) | 600 (semibold) | The dominant brand element. Recommend `font-size: clamp(28px, 8vw, 42px)` for fluid responsive scaling. The max (42px) aligns with --heading-font-size-xxl at desktop. | --color-heading | --line-height-heading (1.25) |
    | Tagline | Source Serif 4 (--font-editorial) | 400 italic | --body-font-size-xs (15px mobile / 14px desktop) | --color-text-muted | 1.4 |

    Rationale for size choices:
    - "Mostly" at a smaller size reads as a modifier ("mostly [hallucinations]"), not a competing headline. This avoids the "two competing headlines" problem (Hick's Law — the user's brain tries to process two messages simultaneously).
    - "Hallucinations" at semibold weight is the single strong typographic statement. It should not use --heading-font-size-xxl (48px/42px) because that size is reserved for post h1 elements. The logo is identity, not a headline.
    - The tagline in Source Serif 4 italic provides a register shift — "a serif voice that adds weight" per the brand identity. Italic further distinguishes it from the logo. The muted color subordinates it.
    - Using `clamp()` avoids discrete breakpoint jumps and handles narrow viewports (320px) gracefully.

    ### Corrupted Letterforms Specification

    This is the most critical design element. Include a dedicated subsection with the full specification.

    **Governing principle**: The word "Hallucinations" must be instantly readable. The corruption is a secondary-processing discovery — something the brain registers a beat after reading the word. If any reader pauses to decode a letter, the design has crossed the line.

    **Corruption rules**:
    1. Structural legibility is preserved for every letter. Corruption operates at the detail level (stroke weight, terminal shape, counter geometry), never at the structural level.
    2. 5 of 14 letters are corrupted. The rest are pristine Source Code Pro.
    3. No two adjacent letters are corrupted.
    4. Corruption density increases toward the end of the word — mimicking how AI image models degrade text (first characters often correct, later ones drift). This creates a left-to-right gradient from "grounded" to "hallucinated."
    5. The corruption types are consistent and systematic — deliberate, repeating distortions that read as design intent, not rendering bugs.
    6. The contrast between "Mostly" (perfectly clean) and "Hallucinations" (corrupted) IS the concept. "Mostly" must be pristine. If both words share corruption, the concept collapses into "this is a weird font."

    **Corruption map — include this exact table:**

    | Position | Letter | Status | Corruption Type | Description |
    |----------|--------|--------|-----------------|-------------|
    | 1 | H | Clean | — | Anchor letter. Corrupting the first letter undermines readability. |
    | 2 | a | Clean | — | Early letters stay grounded. |
    | 3 | l | Clean | — | — |
    | 4 | l | **Corrupted** | Stroke overshoot | The vertical stroke extends ~2px below the baseline, as if the model didn't know where to stop. Simplest glyph (single vertical stroke) makes any deviation immediately noticeable to a trained eye. |
    | 5 | u | Clean | — | Breathing room between corruptions. |
    | 6 | c | **Corrupted** | Counter closure | The open counter curls inward ~1.5px more than it should, nearly closing into an 'o'. AI models frequently fail at open counters — the 'c' almost becoming an 'o' is a canonical AI text-in-images error. |
    | 7 | i | Clean | — | — |
    | 8 | n | **Corrupted** | Phantom serif | A vestigial serif appears at the baseline of the right stem — a tiny 1px horizontal foot that does not belong on a sans-serif monospaced face. Serifs on sans-serif type is a canonical AI hallucination artifact. |
    | 9 | a | Clean | — | — |
    | 10 | t | **Corrupted** | Asymmetric crossbar | The crossbar extends ~2px further to the right than to the left. The vertical stroke remains centered and correct. Crossbar errors are common in AI-generated text. |
    | 11 | i | Clean | — | — |
    | 12 | o | Clean | — | Closed counter, already "complete." Clean here provides contrast. |
    | 13 | n | **Corrupted** | Broken junction | The arch doesn't fully connect to the right stem — a ~1px gap between the arch and the vertical stroke at the top-right junction. The strongest corruption, placed late in the word. |
    | 14 | s | Clean | — | Final letter lands clean, completing the word. Avoids the word feeling "broken." |

    Five distinct corruption types, each referencing a different category of AI text-generation artifact. Corrupted positions: 4, 6, 8, 10, 13 — no two adjacent.

    **Testability criterion**: Show the header to someone for 1 second, then ask them to type the blog name. If they type "Mostly Hallucinations" without hesitation, the corruption level is right. If they pause or misread, it has gone too far.

    ### Spacing & Rhythm

    | Gap | Value | Notes |
    |-----|-------|-------|
    | "Mostly" to "Hallucinations" | 0 (natural line stacking) | The line-height of "Mostly" (1.25) provides the natural gap. The two words flow as a single visual unit. |
    | "Hallucinations" to tagline | 8px | Enough separation to distinguish the tagline from the name, but tight enough to read as a single header block. |
    | Header top/bottom | Vertical centering within --nav-height or min-height | The logo+tagline block is vertically centered in the header area. |
    | Header bottom border | 1px solid --color-border-subtle | The faintest structural separation from content below. Consistent with "borders that almost melt into the background." |

    ### Responsive Behavior

    | Breakpoint | Behavior |
    |------------|----------|
    | < 600px (mobile) | Stacked three-line layout. Font sizes at the lower end of clamp() range. Corruption details are naturally sub-pixel at small sizes and gracefully disappear into anti-aliasing — no separate mobile treatment needed. Header uses --content-padding-mobile (20px). |
    | >= 600px (tablet) | Same stacked layout. Font sizes grow fluidly via clamp(). Corruptions begin to become perceptible. Header uses --content-padding-tablet (24px). |
    | >= 900px (desktop) | Same stacked layout. Font sizes at upper end of clamp(). Corruptions clearly visible on close inspection. Header uses --content-padding-desktop (32px). |
    | All viewports | position: relative (scrolls with content). No fixed positioning. No scroll-triggered show/hide. |

    Note on --nav-height: The stacked layout (logo at ~42px line-height + smaller "Mostly" line + tagline + spacing) may exceed the current 80px --nav-height. The CSS should use `min-height: var(--nav-height)` rather than `height: var(--nav-height)` to accommodate this. The CLS risk is low because the header block is lazy-loaded — by the time it paints, the main content is already laid out.

    ### Interactions

    | Interaction | Behavior |
    |-------------|----------|
    | Home link | The entire logo+tagline is wrapped in a single `<a href="/">`. One tab stop, one interactive target. |
    | Hover | No color change. Cursor changes to pointer. The header-as-home-link is a universal convention that doesn't need visual reinforcement. |
    | Focus | Visible focus ring using --color-accent or a sufficient-contrast alternative (see DDD-001 Open Question #5 about focus ring contrast). |
    | Screen reader | aria-label="Mostly Hallucinations - home" on the link provides the accessible name regardless of visual corruption rendering. |
    | prefers-reduced-motion | If any transitions are applied to corruption effects, they are removed. Static displacement remains (it is part of the visual identity, not animation). |

    ## HTML Structure Section

    The semantic HTML the header block produces after decoration:

    ```html
    <header>
      <div class="header block" data-block-name="header" data-block-status="loaded">
        <div class="nav-wrapper">
          <nav id="nav" aria-label="Site">
            <a href="/" class="site-logo" aria-label="Mostly Hallucinations - home">
              <span class="logo-text">
                <span class="logo-word-mostly">Mostly</span>
                <!-- "Hallucinations" rendered with corruption effect -->
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

    Key decisions in this structure:
    - `<nav>` is retained even though there are no nav links. The header IS the site's navigation landmark (it links home). `aria-label="Site"` differentiates it from any future nav landmarks. This also maintains consistency with the EDS boilerplate pattern.
    - The entire logo+tagline is a single `<a>` linking home. One tab stop.
    - `<span>` elements, not headings, for the logo text. The page's `<h1>` belongs to page content, not site chrome.
    - Two separate `<span>` elements for "Mostly" and "Hallucinations" allow independent styling. The split happens in JS during decoration — the authored content is a single text string.
    - `aria-label` on the link provides a clean accessible name regardless of visual corruption.

    **Authored content (nav fragment)**: The CMS/fragment content is plain text:
    ```html
    <div>
      <p><a href="/">Mostly Hallucinations</a></p>
      <p><em>Generated, meet grounded.</em></p>
    </div>
    ```
    The `decorate()` function reads this and produces the structure above. If JS fails, the user sees plain text "Mostly Hallucinations" — the corruption is a progressive enhancement.

    ## CSS Approach Section

    ### Layout Method
    Flexbox, column direction. The header block contains a single flex container. No grid needed — this is three lines of text with no horizontal complexity.

    ### Key Architectural Decisions

    1. **Width alignment with DDD-001**: The nav-wrapper uses `max-width: var(--layout-max)`, `margin-inline: auto`, and the same --content-padding-* tokens at each breakpoint as `main > .section > div`. This ensures the logo's left edge aligns with body text. This answers DDD-001 Open Question #1: the header constrains to --layout-max (not --measure).

    2. **position: relative at all breakpoints**: The current boilerplate uses `position: fixed` on mobile. This must be removed. The header scrolls with the page.

    3. **Boilerplate header must be rewritten, not patched**: The current header.js has 171 lines of navigation scaffolding (hamburger, toggleMenu, dropdown sections, escape-to-close, focusout handlers). With no nav items, this code is dead weight that leaves orphan DOM elements. A clean rewrite is smaller (~50 lines JS, ~60-80 lines CSS), faster, and easier to maintain.

    4. **min-height replaces height**: `min-height: var(--nav-height)` on the header element instead of `height: var(--nav-height)` to accommodate the stacked layout.

    5. **Home link styling**: The `<a>` has `text-decoration: none` and `color: inherit`. No hover color change. Cursor pointer is the only affordance.

    6. **Header bottom border**: `border-bottom: 1px solid var(--color-border-subtle)`.

    ### Corruption Effect — Implementation Approaches

    The DDD specifies the desired visual outcome (the corruption map above). There are two viable implementation paths. **The DDD recommends describing both and letting the implementation agent choose based on fidelity testing.**

    **Approach A: CSS-only with per-letter spans**

    During decoration, JS splits "Hallucinations" into individual `<span class="glyph">` elements. Corrupted glyphs get CSS custom properties controlling `transform` (translateY, rotate, skewX) and `opacity`. This uses only GPU-accelerated properties.

    Strengths:
    - Zero additional asset weight
    - Live text remains selectable, searchable
    - Scales with font-size automatically
    - Simple to maintain

    Limitations:
    - CSS transforms move whole glyphs — they cannot modify internal anatomy (close a counter, add a serif, break a junction)
    - Only 2 of the 5 specified corruption types are achievable: stroke overshoot (translateY) and asymmetric crossbar (skewX). The other 3 (counter closure, phantom serif, broken junction) require glyph-internal modification.
    - To approximate the other effects, the CSS approach would use: opacity reduction (suggesting degradation), slight rotation, and chromatic aberration via a ::after pseudo-element

    **Approach B: Inline SVG for "Hallucinations"**

    "Mostly" stays as live HTML text. "Hallucinations" is rendered as an inline SVG with paths extracted from Source Code Pro Semibold, with the 5 specified corruptions applied directly to the glyph outlines.

    Strengths:
    - Full control over glyph-internal modifications — all 5 corruption types are achievable exactly as specified
    - SVG uses viewBox (no fixed dimensions) and scales intrinsically — corruptions defined as 1-2px deviations at design size automatically become sub-pixel at smaller sizes, gracefully disappearing into anti-aliasing
    - `fill="currentColor"` inherits from CSS, so dark mode works automatically
    - Estimated size: 3-5KB uncompressed, 1.5-2.5KB gzipped (well within 100KB budget)

    Limitations:
    - SVG text does not use the document's CSS font-family — requires extracted glyph paths
    - Glyph extraction requires matching the exact font weight and metrics to the live "Mostly" text to avoid visual mismatch
    - Hand-authored paths are harder for future maintainers to modify
    - An additional asset (even if inlined) vs. pure text

    **Recommendation for the implementation agent**: Start with Approach A (CSS-only). If the CSS transforms alone do not produce the desired "something is off" effect at the specified corruption points, escalate to Approach B (SVG) for the letters that require glyph-internal modification. A hybrid is also viable: CSS transforms for the achievable corruptions + a targeted SVG or pseudo-element trick for the others.

    ### Font Size Scaling

    Use `clamp()` for fluid responsive scaling of the logo text:
    - "Hallucinations": `font-size: clamp(28px, 8vw, 42px)`
    - "Mostly": scaled proportionally (~55-60% of "Hallucinations" size)

    This avoids discrete breakpoint jumps and handles narrow viewports (320px) where monospaced text at heading sizes will not fit.

    ## Token Usage Section

    | Element | Property | Token | Status |
    |---------|----------|-------|--------|
    | Header background | background-color | --color-background | Existing |
    | Logo text "Mostly" | font-family | --font-heading | Existing |
    | Logo text "Mostly" | color | --color-heading | Existing |
    | Logo text "Hallucinations" | font-family | --font-heading | Existing |
    | Logo text "Hallucinations" | color | --color-heading | Existing |
    | Tagline | font-family | --font-editorial | Existing |
    | Tagline | color | --color-text-muted | Existing |
    | Tagline | font-size | --body-font-size-xs | Existing |
    | Header bottom border | border-color | --color-border-subtle | Existing |
    | Header height | min-height | --nav-height | Existing |
    | Header max-width | max-width | --layout-max | Existing |
    | Mobile padding | padding-inline | --content-padding-mobile | Existing |
    | Tablet padding | padding-inline | --content-padding-tablet | Existing |
    | Desktop padding | padding-inline | --content-padding-desktop | Existing |
    | Heading line height | line-height | --line-height-heading | Existing |
    | Focus ring | outline-color | --color-accent (or contrast-safe alternative) | Existing |

    All tokens are existing in `styles/tokens.css`. No new tokens are proposed. The corruption parameters are implementation details of header.css, not global design tokens.

    ## Open Questions Section

    1. **CSS vs. SVG for corruption effect**: The corruption map specifies 5 types of glyph modification. CSS transforms can achieve 2 of 5 with full fidelity (stroke overshoot, asymmetric crossbar) and approximate the others. SVG can achieve all 5 exactly. The implementation agent should prototype Approach A (CSS) first and escalate to Approach B (SVG) if the visual effect is insufficient. This is a judgment call that requires seeing the rendered result.

    2. **--nav-height adequacy**: The stacked three-line layout may exceed 80px. If so, either update --nav-height in tokens.css or use min-height: var(--nav-height) on the header element. The implementation agent should test at 320px, 375px, and 414px viewport widths and adjust.

    3. **Mobile corruption visibility**: At small font sizes (28px), the 1-2px corruption deviations may be sub-pixel and invisible. If using the SVG approach, this is handled automatically (vector scaling). If using the CSS approach, the transform values may need to be responsive (e.g., using clamp() or calc() with viewport units). Alternatively, accept that corruption is a desktop-only detail that gracefully degrades to clean text on mobile.

    4. **Chromatic aberration enhancement**: An optional CSS ::after pseudo-element could add a 1px-offset ghost in --color-accent at ~8% opacity, producing a "misregistered print" effect. This is a nice-to-have that reinforces the digital corruption theme but adds CSS complexity. The implementation agent should try it and remove it if it doesn't land visually or causes accessibility concerns.

    5. **Favicon / social avatar**: The brand identity specifies simplifying to "MH" at small sizes with the "H" carrying a single hallucinated detail (crossbar at wrong angle). This is a separate asset, not a responsive variant of the header logo. Should this be included in the header implementation scope or tracked as a separate task?

    ## Decision Section

    Include the standard decision checkboxes:

    ```
    - [ ] Approved
    - [ ] Approved with changes
    - [ ] Rejected

    ### Reviewer Notes

    _{Human writes here during review}_
    ```

    ## Writing Guidelines

    - Follow the tone and depth of DDD-001-global-layout.md. The DDD should be thorough enough that an implementation agent can build the header from the document alone, without asking questions.
    - Reference specific token names (--color-heading, --font-heading, etc.) throughout.
    - Include the "Governing constraints" pattern from DDD-001's Context section: list the specific CLAUDE.md rules, brand identity principles, and site structure requirements that govern this surface.
    - ASCII wireframes must use ONLY pure ASCII characters. No Unicode box-drawing. All lines must be the same character width. Verify alignment.
    - The "Corrupted Letterforms Specification" should be a standalone subsection under Proposal, between Typography and Spacing & Rhythm.
    - Do NOT write implementation code (no JS, no full CSS). The CSS Approach section describes architectural choices and key selectors, not a stylesheet.

    ## Files to Read Before Writing

    - `docs/design-decisions/README.md` — DDD format specification
    - `docs/design-decisions/DDD-001-global-layout.md` — format and tone reference
    - `styles/tokens.css` — all available design tokens
    - `docs/site-structure.md` — header requirements

    ## File to Write

    - `docs/design-decisions/DDD-002-header.md`

    ## Scope Boundaries

    DO:
    - Write the complete DDD-002-header.md with all required sections
    - Include the full corrupted letterforms specification
    - Include both implementation approaches in CSS Approach
    - Reference DDD-001 for layout alignment

    DO NOT:
    - Write any JavaScript or CSS implementation code
    - Modify any existing files (tokens.css, header.js, header.css)
    - Create the SVG asset
    - Create the favicon/social avatar
    - Implement the header block

- **Deliverables**: `docs/design-decisions/DDD-002-header.md`
- **Success criteria**:
    - File exists at `docs/design-decisions/DDD-002-header.md`
    - Status is "Proposal"
    - All required DDD sections present: Context, Proposal (Layout, Typography, Corrupted Letterforms Specification, Spacing & Rhythm, Responsive Behavior, Interactions), HTML Structure, CSS Approach, Token Usage, Open Questions, Decision
    - ASCII wireframes for mobile and desktop using only pure ASCII characters
    - Corruption map table with all 14 letters specified
    - Token Usage table maps every visual element to CSS custom property
    - No hardcoded hex values — all visual values reference tokens
    - No implementation code (JS or full CSS)

### Cross-Cutting Coverage

- **Testing**: Not applicable — this task produces a design document, not executable code. Testing will be relevant when the DDD is implemented.
- **Security**: Not applicable — no attack surface, auth, user input, or dependencies in a design document.
- **Usability -- Strategy**: Covered within the task prompt. The ux-strategy-minion's full analysis (tagline hierarchy, no-nav rationale, corruption constraints, scroll-away header recommendation, cognitive load analysis) is synthesized directly into the DDD specification. Key UX strategy decisions embedded in the prompt: tagline recessive not prominent, no-nav as intentional brand signal, 3-5 corrupted letters max, 1-second recognition test criterion, scroll-away header on all viewports.
- **Usability -- Design**: Covered within the task prompt. The ux-design-minion's full analysis (letter-by-letter corruption map, spatial arrangement, responsive scaling, CSS/SVG tradeoffs) is synthesized directly into the DDD specification.
- **Documentation**: This task IS a documentation task — it produces a DDD. No additional documentation agent needed.
- **Observability**: Not applicable — no runtime component, API, or background process.

### Architecture Review Agents

- **Mandatory** (5): security-minion, test-minion, ux-strategy-minion, lucy, margo
- **Discretionary picks**: none — this task produces a single design document with no UI components, no runtime code, no web-facing output, and no multi-service coordination. All discretionary reviewers' domain signals are absent.
- **Not selected**: ux-design-minion, accessibility-minion, sitespeed-minion, observability-minion, user-docs-minion

### Conflict Resolutions

**SVG vs. CSS-only for corruption effect**:
- ux-design-minion recommended inline SVG for "Hallucinations" (full glyph-internal control, all 5 corruption types achievable exactly).
- frontend-minion recommended CSS-only with per-letter spans and transforms (simpler, no SVG complexity, zero asset weight).

Resolution: The DDD is a specification, not implementation. It specifies the desired visual effect (the corruption map) and documents BOTH approaches in the CSS Approach section with their respective strengths and limitations. The recommendation is to start with CSS-only (Approach A) and escalate to SVG (Approach B) if fidelity is insufficient. This defers the implementation decision to the agent who will actually see the rendered result, while giving them full context on both paths. Neither specialist's recommendation is rejected — both are presented as viable options with clear tradeoffs.

**Font size specifications (minor)**:
- ux-design-minion specified "Mostly" at 20px mobile / 18px desktop and "Hallucinations" at 36px mobile / 32px desktop (using --heading-font-size-xl).
- frontend-minion suggested clamp() for fluid scaling and flagged that monospaced text at heading sizes won't fit on narrow viewports.

Resolution: Adopted clamp() as the sizing strategy (frontend-minion's recommendation) with the size range informed by ux-design-minion's specifications. The "Hallucinations" max size is 42px (--heading-font-size-xxl at desktop) rather than 36px (--heading-font-size-xl) — the xxl token at the desktop breakpoint is 42px, which is the appropriate display size for the primary brand element. The DDD specifies the clamp range and rationale; the implementation agent calculates the exact clamp() parameters.

### Risks and Mitigations

1. **Corrupted letterforms perceived as rendering bug** (HIGH severity): If visitors think the font is broken rather than intentionally designed, the brand concept backfires. Mitigation: the DDD specifies sparse corruption (5 of 14 letters), detail-level only (no structural distortion), systematic types (not random), and the clean "Mostly" provides contrast that signals intent. The 1-second recognition test is included as a testability criterion.

2. **SVG glyph extraction fidelity** (MEDIUM severity, conditional on SVG approach): If glyph outlines don't match the browser-rendered font, "Mostly" (live text) and "Hallucinations" (SVG) will look different. Mitigation: documented in Open Questions. The CSS-first recommendation avoids this risk entirely.

3. **--nav-height overflow** (LOW severity): The stacked layout may exceed 80px. Mitigation: the DDD specifies min-height instead of height, and flags this as an Open Question for the implementation agent to test.

4. **Mobile font size and line wrapping** (LOW severity): Monospaced text at heading sizes may not fit on narrow viewports. Mitigation: clamp() fluid scaling and the natural two-line wrap ("Mostly" on line 1, "Hallucinations" on line 2) is the designed layout, not a fallback.

5. **Accessibility of corruption effect**: Screen readers must announce "Mostly Hallucinations" cleanly regardless of visual treatment. Mitigation: aria-label on the link provides the accessible name; visual corruption is decorative.

### Execution Order

Single task — no dependencies, no batching needed.

```
Batch 1: Task 1 (Write DDD-002-header.md)
```

### Verification Steps

1. File exists at `docs/design-decisions/DDD-002-header.md`
2. All required DDD sections are present and populated
3. Status is "Proposal"
4. ASCII wireframes render correctly (all lines equal width, pure ASCII only)
5. Corruption map table has all 14 positions specified with 5 corrupted letters at positions 4, 6, 8, 10, 13
6. Token Usage table references only tokens that exist in `styles/tokens.css`
7. No hardcoded visual values outside of corruption-specific pixel descriptions
8. `npm run lint` passes (if the linter checks markdown — verify)
9. The document is self-contained: an implementation agent could build the header from this document alone
