# Meta-Plan: DDD-001 Global Layout

## Task Summary

Create a Design Decision Document (DDD-001-global-layout.md) that defines the page chrome for the Mostly Hallucinations blog: content width (`--measure` at 68ch), margins, responsive breakpoints (mobile-first at 600/900/1200px), and section spacing. This is a design specification document, not an implementation task. The DDD must follow the exact format in `docs/design-decisions/README.md` and reference only tokens from `styles/tokens.css`.

## Codebase Analysis

Key observations from reading the relevant files:

1. **tokens.css already defines the layout tokens**: `--measure: 68ch`, `--section-spacing: 48px`, `--content-padding-mobile: 20px`, `--content-padding-desktop: 32px`, `--nav-height: 80px`. The DDD must use these, not invent new values.

2. **styles.css is still the AEM boilerplate default**: It uses `--background-color`, `--body-font-family`, `--light-color` etc. (boilerplate variables), NOT the project's tokens from `tokens.css`. The section layout uses `max-width: 1200px` with `padding: 0 24px/32px`. The DDD needs to specify how `tokens.css` replaces these boilerplate values.

3. **tokens.css is not yet imported into styles.css**: The `head.html` loads `styles/styles.css` but there is no `@import` of `tokens.css` in `styles.css`. The CSS Approach section of the DDD must address this integration gap.

4. **EDS page structure**: The AEM framework generates `body > header + main + footer`, with `main > .section > div` as the content containers. The DDD's HTML Structure must respect this generated DOM.

5. **fonts.css still defines Roboto fonts**, not the project's Source Sans / Source Code Pro / Source Serif families. This is out of scope for DDD-001 but notable context.

## Planning Consultations

### Consultation 1: Frontend Layout Architecture

- **Agent**: frontend-minion
- **Planning question**: Given the EDS page structure (`main > .section > div` as content containers) and the existing boilerplate styles.css (which uses `max-width: 1200px` on section divs), what is the correct CSS approach for constraining content to `--measure` (68ch) while respecting the EDS section/block model? Specifically: (a) Should `--measure` apply to `main > .section > div` or to a narrower container within it? (b) How should the `1200px` boilerplate max-width relate to `--measure`? (c) What is the right import order for tokens.css into styles.css given EDS's three-phase loading (eager/lazy/delayed) where styles.css loads eagerly via head.html?
- **Context to provide**: `styles/styles.css` (current boilerplate state), `styles/tokens.css` (available tokens), `head.html` (load order), `scripts/scripts.js` (three-phase loading), EDS section/block markup conventions from AGENTS.md
- **Why this agent**: The core challenge is mapping design tokens onto the EDS-specific DOM structure. frontend-minion understands CSS layout architecture, the interplay between `ch` units and container width, and how to structure CSS for a progressive-loading system.

### Consultation 2: UX Strategy -- Reading Experience and Spacing

- **Agent**: ux-strategy-minion
- **Planning question**: For a single-column reading-focused blog, what spacing rhythm creates the right breathing room between sections while maintaining reading flow? The tokens define `--section-spacing: 48px`, `--content-padding-mobile: 20px`, and `--content-padding-desktop: 32px`. Are these values appropriate for a long-form technical content site at 68ch measure? Should section spacing scale with viewport (fluid) or remain fixed? Should the reading width (68ch) apply uniformly to all content types (post body, post index entries, header, footer) or should some surfaces use a wider container?
- **Context to provide**: `styles/tokens.css` (spacing tokens), `docs/site-structure.md` (page types), `docs/content-model.md` (content types with varying lengths), CLAUDE.md aesthetic rules (warm white dominant, typography creates hierarchy)
- **Why this agent**: This is about whether the spatial decisions serve the reading experience. ux-strategy-minion evaluates whether the proposed layout serves the user's job-to-be-done (reading technical content comfortably) and catches cognitive load issues before they're baked into a spec.

### Cross-Cutting Checklist

- **Testing**: Exclude from planning. This task produces a design document, not executable code. No tests to write or validate at this stage.
- **Security**: Exclude from planning. A layout DDD creates no attack surface, handles no user input, and introduces no dependencies.
- **Usability -- Strategy**: INCLUDED as Consultation 2. Every layout decision affects reading comfort and navigation flow. The spacing and width choices are fundamentally UX decisions.
- **Usability -- Design**: Exclude from planning consultation. ux-design-minion's domain (visual hierarchy, interaction patterns, component design) is not yet relevant -- DDD-001 defines the spatial container, not the visual treatment of content within it. Their input becomes relevant in DDD-002+ (header, footer, post layout).
- **Accessibility**: Exclude from planning consultation. DDD-001 defines widths, margins, and breakpoints. Accessibility concerns (contrast, semantics, screen reader behavior) arise at the component/content level in later DDDs. The HTML Structure section will use semantic elements, but that's standard practice not requiring specialist planning input.
- **Documentation**: Exclude from planning consultation. The DDD IS the documentation -- it is a self-contained spec document following an established format. No separate documentation artifact is needed.
- **Observability**: Exclude from planning. No runtime components are being created.

### Anticipated Approval Gates

1. **DDD-001-global-layout.md itself** -- This is the only deliverable, and it is explicitly a "Proposal" status document designed for human review. The entire point of the DDD format is that a human reviews and approves before any implementation occurs. This is a natural MUST-gate: it is hard to reverse (all subsequent DDDs depend on the layout foundation) and has high blast radius (DDDs 002-008 all list DDD-001 as a dependency in the surface inventory).

No other gates are anticipated. This is a single-document, single-agent task.

### Rationale

This task is narrower than it might first appear. It produces one markdown document following a strict template. The substantive decisions are:

1. **CSS architecture**: How tokens.css integrates with the boilerplate styles.css in the EDS loading model (frontend-minion expertise)
2. **Spatial design**: Whether the spacing tokens create appropriate reading rhythm (ux-strategy-minion expertise)

Only two specialists are needed for planning because:
- The DDD format is already defined (no software-docs-minion input needed for format)
- The tokens already exist (no design decisions to make about color or typography)
- The HTML structure is dictated by the EDS framework (limited freedom)
- The scope explicitly excludes header/footer content, block styling, and dark mode

The real value of specialist input is preventing two specific mistakes: (a) choosing a CSS architecture that fights the EDS model (causing rework in implementation), and (b) choosing spacing values that look right in a wireframe but fail the reading experience.

### Scope

**In scope:**
- Page-level layout: content width (--measure), margins, section spacing, breakpoints
- tokens.css to styles.css integration strategy (import order, cascade, which boilerplate values get replaced)
- Semantic page skeleton HTML (body > header, main, footer) respecting EDS-generated DOM
- ASCII wireframes at mobile and desktop breakpoints
- Token Usage table mapping every layout element to its CSS custom property
- Responsive behavior at 600/900/1200px mobile-first breakpoints

**Out of scope:**
- Header/footer content and visual treatment (DDD-002, DDD-003)
- Typography decisions beyond what's needed for layout (font sizes are in tokens.css, not this DDD's concern)
- Dark mode (DDD-008)
- Block-level styling
- Actual CSS implementation (happens after DDD approval)
- Creating or modifying tokens (tokens.css is the source of truth; DDD references existing tokens)

### External Skill Integration

No external skills detected in project. Scanned `.claude/skills/` and `.skills/` relative to `/Users/ben/github/benpeter/mostly-hallucinations/` -- neither directory exists. User-global skills at `~/.claude/skills/` are all either despicable-agents agents (nefario, despicable-prompter) or unrelated domains (daily-recap, juli, obsidian-tasks, recap, session-review, srf-gruppennewsletter, transcribe). None are relevant to this design document task.
