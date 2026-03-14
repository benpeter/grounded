# Meta-Plan: Implement DDD-005 Post Detail

## Scope

**In scope**: Implement the post detail reading experience per DDD-005. This includes path-based page detection in `scripts.js`, post header decoration (type badge, h1 with sr-only prefix, metadata line), scoped CSS for post typography/spacing/elements, Quote block (standard + pull-quote variant), `<pre>` tabindex decoration, body link underline inversion, code block `border-radius: 0`, and test content for local preview.

**Out of scope**: Series navigation (#24), syntax highlighting (#25), dark mode token changes, content model changes, structured data (JSON-LD), any V1 exclusions from CLAUDE.md.

## Codebase Context

The project is an EDS (Edge Delivery Services) site using vanilla JS/CSS. Key observations:

- **`scripts.js`** already has path-based detection for home page (`/`) via `buildPostIndexBlock()`. The post-detail detection (`/blog/*`) follows the same pattern. The `decorateButtons()` call in `decorateMain()` needs scoping consideration for post body content.
- **`post-index/post-index.js`** provides the implementation pattern for type badges, sr-only prefixes, date formatting, and tag rendering. Significant code reuse opportunity (shared utilities like `TYPE_LABELS`, `DATE_FORMATTER`, `parseDate`, `toIsoDate`).
- **`styles/styles.css`** has global heading margins (`0.8em/0.25em`) and link styles (`text-decoration: none` default) that must remain unchanged. Post overrides scope via `body.post-detail`.
- **`styles/tokens.css`** has all required tokens. No new tokens needed.
- **No Quote block exists yet** -- must be created as `blocks/quote/quote.js` + `blocks/quote/quote.css`.
- **Draft content exists** at `drafts/blog/` but is minimal (30 lines). Test content needs expansion to demonstrate all DDD-005 elements (code blocks, blockquotes, lists, tables, hr, h2+h3 adjacency).
- **CSP**: `head.html` enforces `script-src 'nonce-aem' 'strict-dynamic'` -- all DOM construction must use DOM APIs, no innerHTML.

## Planning Consultations

### Consultation 1: Frontend Implementation Strategy

- **Agent**: frontend-minion
- **Planning question**: Given the DDD-005 spec, what is the optimal file organization and code-sharing strategy? Specifically: (1) Should the post header decoration logic live in `scripts.js` (in the eager/lazy phase) or as a separate auto-block similar to post-index? (2) How should shared utilities (`TYPE_LABELS`, `DATE_FORMATTER`, `parseDate`, `toIsoDate`) be extracted from `post-index.js` for reuse without breaking EDS code-splitting conventions? (3) Where should the post-detail scoped CSS live -- `lazy-styles.css`, a new `styles/post-detail.css`, or inline in the decoration logic? (4) How should the `decorateButtons()` side effect be handled -- exclude post body sections from the call, or CSS override `.button` styles within post context? Consider EDS conventions (no build step, CSP compliance, three-phase loading).
- **Context to provide**: `scripts.js`, `post-index/post-index.js`, `head.html` (CSP), DDD-005 spec (CSS Approach section, Open Question 5 resolution), AGENTS.md (blocks structure, three-phase loading)
- **Why this agent**: Frontend-minion understands EDS block architecture, vanilla JS patterns, and can determine the right decomposition of JS/CSS files that respects EDS conventions and the three-phase loading model.

### Consultation 2: Accessibility Patterns

- **Agent**: accessibility-minion
- **Planning question**: Review the DDD-005 HTML structure for accessibility correctness. Specifically: (1) Is the `role="article"` + `aria-labelledby` on `<main>` approach sound, or should we wrap `<main>` children in an actual `<article>` element? (2) Is `aria-hidden="true"` on pull-quote `<figure>` the right pattern for decorative repeated content? (3) Does `tabindex="0"` on `<pre>` need an `aria-label` or `role` attribute for keyboard users to understand what they're focusing? (4) Are the body link underline patterns (underline default, remove on hover) WCAG 1.4.1 compliant? (5) Any concerns with the tag link contrast relying on color difference rather than contrast ratio between adjacent elements?
- **Context to provide**: DDD-005 HTML Structure section, DDD-005 Interactions section, existing `post-index.js` a11y patterns, `styles.css` `.sr-only` class
- **Why this agent**: The spec makes several a11y design decisions (aria-hidden pull-quotes, tabindex on pre, article semantics) that need expert validation before implementation locks them in.

### Consultation 3: Quote Block Design

- **Agent**: ux-strategy-minion
- **Planning question**: The Quote block needs two variants (standard blockquote, pull-quote) distinguished by a CSS class. In EDS, block variants are typically applied via "section metadata" tables in the authored content. (1) Is the authoring model clear -- authors create a "Quote" block table, and add a section metadata row with `style: pull-quote` to get the pull-quote variant? (2) Pull-quotes must repeat content from elsewhere in the post (content discipline). Should this constraint be enforced programmatically, documented as a convention, or both? (3) The pull-quote uses `aria-hidden="true"` which means screen reader users never see it -- is this the right UX decision for an editorial emphasis element?
- **Context to provide**: DDD-005 Quote block sections, DDD-004 precedent patterns, EDS block/section metadata conventions from AGENTS.md
- **Why this agent**: UX strategy reviews the "what and why" of the authoring model and accessibility UX decisions. The pull-quote pattern involves a judgment call about whether decorative repetition serves the reader experience.

## Cross-Cutting Checklist

- **Testing**: Include test-minion for planning. Planning question: "What testing approach verifies the post-detail implementation? Consider: (1) Visual regression testing is impractical without a browser in CI. (2) The DOM structure can be unit tested by checking decoration output. (3) CSS spacing/typography can only be verified visually. (4) Should we set up a Lighthouse CI check against the draft test page?" Test-minion's input will shape whether we include a test task in execution or rely on Phase 6.
- **Security**: Exclude from planning. The implementation is client-side CSS/JS operating on CMS-authored content within existing CSP constraints. No new attack surface, no user input handling, no auth, no new dependencies. Security review in Phase 3.5 is sufficient.
- **Usability -- Strategy**: ALWAYS include -- covered by Consultation 3 above (ux-strategy-minion).
- **Usability -- Design**: Exclude from planning. DDD-005 is an approved design spec with wireframes. The design decisions are already made. ux-design-minion review in Phase 3.5 is appropriate if the plan produces UI.
- **Documentation**: Include software-docs-minion for planning. Planning question: "DDD-005 introduces the first page-type detection pattern (`body.post-detail`) and shared utility extraction. Should this be documented in AGENTS.md or a separate architecture doc? Also: the Quote block authoring model needs documentation for content authors. Where should authoring guidance live?" Phase 8 handles documentation execution, but the planning input determines scope.
- **Observability**: Exclude. No runtime services, APIs, or background processes. Pure client-side decoration.

## Anticipated Approval Gates

1. **File organization and code-sharing strategy** (MUST gate) -- Hard to reverse (establishes patterns for all future page types), high blast radius (all execution tasks depend on it). Decision: where shared utilities live, where post-detail CSS lives, how decoration hooks into the loading phases.

2. **Quote block authoring model** (OPTIONAL gate) -- Medium reversibility (block structure can be changed but affects authored content expectations). Decision: how authors create standard vs pull-quote blockquotes in the CMS.

Target: 1-2 gates for this plan. The DDD-005 spec resolves most design decisions already, reducing the need for approval gates.

## Rationale

This task is primarily a **frontend implementation** of an already-approved design spec. The spec (DDD-005) is unusually detailed -- it includes HTML structure, CSS selectors, token references, and spacing values. The main planning unknowns are:

1. **Code organization**: How to structure files within EDS conventions (frontend-minion)
2. **Accessibility validation**: Whether the spec's a11y decisions are correct before implementation (accessibility-minion)
3. **Authoring model clarity**: Whether the Quote block variant mechanism is intuitive for authors (ux-strategy-minion)
4. **Test strategy**: What can realistically be tested (test-minion, via checklist)
5. **Documentation scope**: What needs documenting beyond the code (software-docs-minion, via checklist)

The spec already resolves all open design questions (page detection, mobile blockquote, series deferral, syntax highlighting deferral). Execution is primarily a faithful translation of spec to code.

## External Skill Integration

No external skills detected in project. Neither `.claude/skills/` nor `.skills/` directories exist in the project root.
