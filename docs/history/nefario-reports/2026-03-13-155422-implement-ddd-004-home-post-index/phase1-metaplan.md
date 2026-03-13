# Phase 1: Meta-Plan — Implement DDD-004 Home Post Index

## Task Summary

Implement the home page post index block as specified in `docs/design-decisions/DDD-004-home-post-index.md`. This involves creating a new EDS block (`blocks/post-index/`), a `helix-query.yaml` configuration file, wiring the block into the home page (auto-block vs authored), and adding the `.sr-only` utility class. The design contract is fully defined -- this is pure implementation work.

## Scope

**In scope**:
- `blocks/post-index/post-index.js` -- fetch query-index.json, sort, build DOM per DDD-004
- `blocks/post-index/post-index.css` -- all styling per DDD-004 CSS Approach section
- `helix-query.yaml` at project root -- columns: path, title, description, date, type, tags; include: /blog/**
- Home page wiring -- auto-block injection in `scripts.js` (DDD-004 OQ6 recommends auto-block)
- `.sr-only` utility class in `styles/lazy-styles.css` (confirmed not yet defined anywhere)
- Resolution of DDD-004 Open Questions 1, 5, 6 during implementation

**Out of scope**: Tag index pages (DDD-007), blog post detail (DDD-005), dark mode toggle, pagination, RSS, search

## Codebase Context

Key observations from reading the codebase:
- **No `.sr-only` class exists** -- `styles/lazy-styles.css` is empty; no definition found anywhere
- **No `helix-query.yaml` exists** -- must be created
- **`buildAutoBlocks()` in `scripts.js`** currently only handles hero blocks and fragments. Post-index auto-blocking needs to be added here
- **Existing block patterns**: Header block shows the DOM construction pattern (createElement, textContent, setAttribute). Footer is simpler (fragment-based). Post-index follows the header pattern since it builds DOM from JSON data
- **`styles/styles.css` section layout**: `main > .section > div` gets `max-width: var(--layout-max)` and responsive padding. The post-index block needs `max-width: var(--measure)` within this container
- **Current branch**: `nefario/ddd-004-home-post-index` (already exists from the design phase)

## Planning Consultations

### Consultation 1: EDS Block Implementation Strategy
- **Agent**: frontend-minion
- **Planning question**: Given the codebase patterns in `scripts/scripts.js` (buildAutoBlocks, loadEager/loadLazy phases) and existing blocks (header.js, footer.js), what is the optimal implementation approach for the post-index block? Specifically: (1) Should the auto-block injection in `buildAutoBlocks()` check `window.location.pathname === '/'` or use a different home page detection method? (2) How should the block handle the fetch of `/query-index.json` -- inline in `decorate()` or via a utility? (3) The `styles/styles.css` applies `main > .section > div { max-width: var(--layout-max) }` -- will the block's `max-width: var(--measure)` work correctly within this container without layout conflicts? (4) What is the correct `helix-query.yaml` syntax for EDS query index configuration?
- **Context to provide**: `scripts/scripts.js`, `blocks/header/header.js`, `styles/styles.css`, DDD-004 HTML Structure and CSS Approach sections, EDS documentation at aem.live
- **Why this agent**: Frontend-minion has EDS block development expertise and can identify implementation pitfalls in the auto-blocking pattern, section layout interaction, and query index fetch

### Consultation 2: Accessibility Implementation Review
- **Agent**: accessibility-minion
- **Planning question**: DDD-004 specifies a detailed accessibility pattern: sr-only h1, aria-hidden badges, sr-only prefixes in h2, aria-labelledby on articles, tag validation regex. Review the proposed DOM structure and interaction patterns for correctness. Specifically: (1) Is the `aria-labelledby` pointing to the `<h2>` id correct when the h2 contains both an sr-only span and an anchor? Will screen readers announce the full computed text or just the anchor text? (2) Does the `.sr-only` class definition in DDD-004 match current best practices? (3) Are there any keyboard navigation issues with the tab order (title link, then tag links per entry)? (4) Does the empty state (sr-only h1 only, no articles) create any accessibility issues?
- **Context to provide**: DDD-004 HTML Structure section, the `.sr-only` class definition, existing focus ring patterns from DDD-002/DDD-003
- **Why this agent**: The accessibility pattern in DDD-004 is sophisticated (dual badge/sr-only, aria-labelledby, tag list semantics). Getting this wrong creates WCAG failures that are hard to catch in code review

## Cross-Cutting Checklist

- **Testing** (test-minion): Not needed for planning. The implementation is a single EDS block with well-defined success criteria. Test strategy is straightforward: lint passes, dev server renders correctly. Phase 6 handles test execution post-implementation.
- **Security** (security-minion): Not needed for planning. The security concern (tag slug validation) is already addressed in DDD-004 with the regex `/^[a-z0-9-]+$/`. No auth, no user input, no secrets. The implementing agent applies the validation as specified.
- **Usability -- Strategy** (ux-strategy-minion): ALWAYS include. The home page IS the primary navigation surface. UX strategy should validate that the implementation plan preserves the user journey coherence defined in DDD-004. Planning question: The home page is the only navigation surface for the blog (no sidebar, no search, no categories). Does the implementation plan adequately address the "first visit" experience? Should the empty state (no posts yet) include any affordance, or is the DDD-004 decision (render nothing) correct for V1?
- **Usability -- Design** (ux-design-minion): Not needed for planning. DDD-004 fully specifies all visual design decisions (typography, spacing, interactions). This is implementation of a resolved design, not design exploration.
- **Documentation** (software-docs-minion): ALWAYS include. Planning question: What documentation updates are needed alongside this implementation? The `helix-query.yaml` is a new configuration artifact. Should `docs/site-structure.md` or `docs/content-model.md` be updated to reference it? Are there any EDS-specific documentation conventions for query index configuration?
- **Observability** (observability-minion): Not needed for planning. This is a client-side block with no backend services, APIs, or background processes. No logging/metrics/tracing needed.

## Anticipated Approval Gates

1. **`helix-query.yaml` configuration** (OPTIONAL gate): This is the EDS query index configuration that determines what data the block can access. It's easy to change later (additive YAML file), but getting the column names or include paths wrong would cause the block to render nothing. Low blast radius (only post-index depends on it) but judgment call on column naming. Could be gated if the frontend-minion raises ambiguity about exact EDS YAML syntax.

2. **Auto-block injection approach** (NO gate): The auto-blocking decision is well-defined in DDD-004 OQ6, easy to reverse (change a few lines in scripts.js), and has low blast radius.

3. **Overall implementation** (NO gate): The DDD-004 design contract is comprehensive enough that the implementation is largely mechanical. Post-execution review (Phase 5) catches quality issues.

Given the thorough DDD-004 spec, this plan likely needs 0-1 gates. The design decisions are already made.

## Rationale

This is an **implementation task with a comprehensive design contract**. DDD-004 specifies the exact DOM structure, CSS selectors, token usage, accessibility patterns, and interaction behaviors. The planning consultations focus on:

1. **frontend-minion**: EDS-specific implementation mechanics (auto-blocking, query index fetch, section layout interaction) that DDD-004 doesn't specify at the code level
2. **accessibility-minion**: Validating that the sophisticated a11y pattern actually works as intended in real browser/screen reader behavior
3. **ux-strategy-minion** (cross-cutting): Journey coherence check on the primary navigation surface
4. **software-docs-minion** (cross-cutting): Documentation impact of new configuration artifacts

Agents NOT consulted for planning:
- **security-minion**: Tag validation regex is already specified; no new attack surface
- **test-minion**: Test strategy is straightforward (lint + visual verification); Phase 6 handles it
- **ux-design-minion**: Design is fully resolved in DDD-004
- **observability-minion**: No runtime services
- **data-minion**: No database; query-index.json is an EDS-generated static file

## External Skill Integration

No external skills detected in project. Scanned `.claude/skills/` and `.skills/` -- no SKILL.md files found.
