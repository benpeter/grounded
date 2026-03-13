# Meta-Plan: DDD-004 Home Page / Post Index

## Task Summary

Produce a Design Decision Document (DDD-004-home-post-index.md) that defines how the home page displays posts as a reverse-chronological list. Each entry shows type badge, title, description, date, and tags. The DDD must follow the exact format established in `docs/design-decisions/README.md` and be consistent with the existing approved DDDs (001 global layout, 002 header, 003 footer).

This is a **design document task**, not an implementation task. The output is a single markdown file. No code, no CSS, no JS.

## Planning Consultations

### Consultation 1: UX Strategy — Post Entry Information Hierarchy

- **Agent**: ux-strategy-minion
- **Planning question**: Given a reverse-chronological post index with five data points per entry (type badge, title, description, date, tags), what is the optimal visual hierarchy and reading order? The site has four post types (build-log, pattern, tool-report, til) with wildly different lengths (100-word TILs to 3,000-word build logs). Should the type badge lead (category-first scanning) or follow the title (title-first scanning)? How should tags be treated — as navigation affordances or as metadata? Consider that this is a single-author technical blog where repeat visitors scan for new content and new visitors scan for topic relevance.
- **Context to provide**: `docs/site-structure.md` (home page section), `docs/content-model.md` (post types, metadata fields, taxonomy), `CLAUDE.md` (aesthetic rules: no cards, no shadows, typography-driven hierarchy, warm white paper), `styles/tokens.css` (available tokens), DDD-001 (two-tier width model), DDD-003 (as format exemplar)
- **Why this agent**: UX strategy determines WHAT information to emphasize and WHY, before any visual design decisions are made. The hierarchy decision (type-first vs. title-first, tag prominence) is a user journey decision that cascades into every downstream design choice.

### Consultation 2: UX Design — Type Badge Visual Treatment

- **Agent**: ux-design-minion
- **Planning question**: The site needs four type badges (build-log, pattern, tool-report, til) that are "small, muted, unobtrusive" per `site-structure.md`. The site aesthetic prohibits cards, shadows, gradients, rounded containers, and decorative icons. Color is a "quiet guest" — `--color-accent` (gold) appears at most once per screen. What visual treatment can differentiate four post types while remaining understated? Options include: text-only labels with subtle weight/case differences, a single-character prefix or symbol, a thin left border accent per type, or differentiated text color. The treatment must work in both light and dark mode and pass WCAG AA contrast. How should these badges relate to the existing token palette without requiring new color tokens?
- **Context to provide**: `styles/tokens.css` (full token set including dark mode), `CLAUDE.md` (aesthetic rules, especially "Green and gold are NOT co-equal theme colors"), `docs/site-structure.md` ("Type label — small, muted, unobtrusive"), `docs/content-model.md` (the four types and their semantic meaning)
- **Why this agent**: Badge visual treatment is an interaction design problem — it needs to communicate type at a glance without competing with the title or violating the minimal aesthetic. This is ux-design's core domain: visual differentiation within constraints.

### Consultation 3: Accessibility — Post Index Semantics and Contrast

- **Agent**: accessibility-minion
- **Planning question**: What semantic HTML structure should the post index use? Specifically: (1) Should each post entry be an `<article>` element? (2) Should the index be wrapped in a landmark (e.g., `<section aria-label="Posts">`)? (3) What heading level should post titles use on the home page (h2 under an implicit h1, or h3)? (4) How should type badges be announced — as part of the heading, as a separate element with a specific role, or as visually-hidden prefix text? (5) How should the date be marked up for `<time datetime="">` and screen reader announcement order? (6) How should tags be structured — as a `<ul>` of links, as comma-separated inline links, or as something else? Consider that this list will eventually have 20+ items before pagination kicks in.
- **Context to provide**: `docs/content-model.md`, `docs/site-structure.md`, DDD-001 HTML structure section, DDD-003 (screen reader/accessibility treatment precedent), `CLAUDE.md` (WCAG 2.2 AA requirement, semantic HTML rules)
- **Why this agent**: The HTML structure of the post index is the foundation that CSS targets and screen readers consume. Getting semantics right at the DDD stage prevents costly rework. The heading hierarchy question is particularly important given the single-h1 constraint and the fact that DDD-005 (post detail) will need to coordinate.

### Consultation 4: Frontend — EDS Post Index Rendering Pattern

- **Agent**: frontend-minion
- **Planning question**: How should the home page post index be rendered in Edge Delivery Services? The key architectural question is: should this be (a) a custom block that fetches a post index JSON endpoint (like EDS's query-index.json) and renders entries client-side, (b) an auto-block pattern triggered by content in the home page document, or (c) default content authored directly in the CMS with each post entry as structured markup? Consider: EDS has a `query-index.json` that exposes page metadata (title, description, path, image, lastModified) and can be extended with custom metadata columns. The post metadata fields (type, tags, date) would need to be available. What are the EDS-idiomatic patterns for a post listing page? What does `buildAutoBlocks` in `scripts.js` do and how could it be extended?
- **Context to provide**: `scripts/scripts.js` (buildAutoBlocks function), `blocks/cards/cards.js` and `blocks/cards/cards.css` (existing card block as reference for list rendering patterns), EDS documentation reference (`site:www.aem.live` for query index), `AGENTS.md` (EDS key concepts, block architecture), `docs/content-model.md` (metadata fields that need to appear)
- **Why this agent**: The data source and rendering mechanism (CMS-authored vs. client-fetched index) fundamentally shapes the HTML structure section of the DDD. This is an EDS-specific architectural decision that the DDD must capture so implementation agents know whether they are building a block, extending auto-blocking, or styling default content.

### Consultation 5: Software Documentation — DDD Format Compliance

- **Agent**: software-docs-minion
- **Planning question**: Review the DDD-004 output requirements against the `docs/design-decisions/README.md` template and the three existing DDDs (001, 002, 003). What patterns have the existing DDDs established beyond the template? Specifically: (1) The template says "ASCII wireframe" but DDD-001 and DDD-003 use `+--+` box-drawing with annotations — should DDD-004 follow the same style? (2) DDD-003 includes an "Interactions" section and "Open Questions (Resolved)" format — which of these are relevant to a post index? (3) The template lists "CSS Approach" as a required section — for a list of entries with badges and tags, what CSS architecture decisions should be documented vs. deferred to implementation? (4) Are there any sections from the template that the existing DDDs handle differently than the template prescribes?
- **Context to provide**: `docs/design-decisions/README.md` (template), DDD-001, DDD-002, DDD-003 (as format exemplars), task success criteria
- **Why this agent**: The DDD must match the established format exactly. software-docs-minion can identify format drift between template and practice, ensuring the output passes review without format-related pushback.

## Cross-Cutting Checklist

- **Testing**: Exclude from planning. This task produces a design document (markdown), not executable code. No test strategy is needed for the DDD itself. Testing will be relevant when the DDD is implemented (Phase 6 of that future plan).
- **Security**: Exclude from planning. The post index displays public content metadata. No authentication, user input processing, or secrets handling. No attack surface.
- **Usability -- Strategy**: INCLUDED as Consultation 1 (ux-strategy-minion). Planning question: what is the optimal information hierarchy for post entries on a technical blog home page?
- **Usability -- Design**: INCLUDED as Consultation 2 (ux-design-minion). Planning question: how to visually differentiate four post type badges within the site's minimal aesthetic. accessibility-minion INCLUDED as Consultation 3 for semantic HTML and contrast.
- **Documentation**: INCLUDED as Consultation 5 (software-docs-minion). Planning question: DDD format compliance with established patterns. user-docs-minion excluded — this is an internal design spec, not user-facing documentation.
- **Observability**: Exclude from planning. No runtime components. The DDD is a static design document.

## Anticipated Approval Gates

**One gate**: The completed DDD-004-home-post-index.md itself.

- **Gate classification**: MUST gate. The DDD is a design contract — hard to reverse once implementation begins, and every downstream task (CSS, JS block, content structure) depends on it. High blast radius (DDD-005 post detail, DDD-007 tag index, and implementation tasks all depend on the decisions made here).
- **Gate reason**: Post index design choices (information hierarchy, badge treatment, HTML structure, EDS rendering pattern) lock in constraints that propagate to DDD-005, DDD-007, and implementation. The user must review before any downstream work proceeds.

This is the only gate. A single-deliverable task does not warrant intermediate gates.

## Rationale

This meta-plan selects five specialists whose expertise directly shapes the DDD content:

1. **ux-strategy-minion** — The information hierarchy question (what to emphasize, in what order) is the foundational design decision. Everything else follows from it.
2. **ux-design-minion** — Type badge treatment is the primary visual design challenge. The site's constraints (no color blocks, no icons, minimal palette) make this a non-trivial design problem.
3. **accessibility-minion** — The HTML structure section of the DDD is the contract for implementation. Semantic markup decisions (article vs. div, heading levels, time elements, tag list structure) must be right before CSS work begins.
4. **frontend-minion** — The EDS rendering pattern (block vs. auto-block vs. query-index fetch) is an architectural decision that the DDD must capture. Without this, the HTML Structure section would be speculative.
5. **software-docs-minion** — Format compliance with established DDD patterns prevents review friction and rework.

**Not included in planning** (with rationale):
- **test-minion**: No executable output to test.
- **security-minion**: No attack surface in a post listing design doc.
- **observability-minion / sitespeed-minion**: No runtime components. Performance considerations (lazy loading, query-index fetch timing) are implementation concerns, not design document concerns.
- **data-minion**: The content model is already defined; the post index reads it, doesn't reshape it.
- **seo-minion**: Structured data (JSON-LD) is defined in the content model as a post-page concern, not an index-page concern. If the frontend-minion's planning response surfaces SEO implications for the index page, those will be captured in synthesis.

## Scope

**In scope**: Post list layout, individual post entry design, type badge treatment, tag display, date formatting, responsive behavior (mobile/tablet/desktop wireframes), HTML structure, CSS approach, token usage — all within the DDD format.

**Out of scope**: Post detail page (DDD-005), tag index page (DDD-007), pagination (not until 20+ posts), global layout (DDD-001, already approved/implemented), actual CSS/JS implementation, structured data/JSON-LD for the index page.

## External Skill Integration

No external skills detected in project. Neither `.claude/skills/` nor `.skills/` directories exist in the working directory.
