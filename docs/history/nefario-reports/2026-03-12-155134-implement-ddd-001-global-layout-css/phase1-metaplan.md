# Meta-Plan: Implement DDD-001 Global Layout CSS Contract

## Task Summary

Implement the approved DDD-001 global layout specification into working CSS. This involves four files (`styles/tokens.css`, `styles/styles.css`, `head.html`, `drafts/` test content) and establishes the foundational geometry -- two-tier width model, responsive padding, section spacing -- that all subsequent surfaces (header, footer, post index, post detail) depend on.

## Planning Consultations

### Consultation 1: Frontend Implementation Strategy

- **Agent**: frontend-minion
- **Planning question**: Given the DDD-001 spec, the current boilerplate `styles.css` (258 lines of Adobe boilerplate with hardcoded values and conflicting `:root` variables), and the existing `tokens.css` (107 lines with most tokens already defined), what is the safest approach to: (a) add the four proposed tokens (`--layout-max`, `--content-padding-tablet`, `--space-paragraph`, `--space-element`) to `tokens.css`, (b) replace the boilerplate `:root` block and all `var()` references in `styles.css` with project tokens per the DDD-001 mapping table, (c) implement the two-tier width model and section spacing, and (d) ensure `tokens.css` loads before `styles.css` via `head.html`? Specifically: should the boilerplate `:root` block (lines 13-41) be deleted entirely or commented, and what is the risk of breaking the `@font-face` fallback declarations (lines 44-54) that reference `roboto` -- a font this project does not use?
- **Context to provide**: `styles/tokens.css`, `styles/styles.css`, `head.html`, DDD-001 spec (CSS snippets and mapping table), `scripts/scripts.js` (for loading order awareness), `styles/fonts.css` (still references roboto fonts -- needs cleanup awareness)
- **Why this agent**: Frontend-minion owns CSS architecture decisions. The boilerplate-to-project-token migration is the riskiest part of this task -- getting the `:root` replacement wrong could break the entire site. The agent needs to identify every `var()` reference that must change and plan the exact edit sequence.

### Consultation 2: EDS Platform Compatibility

- **Agent**: frontend-minion (same agent, second question)
- **Planning question**: The DDD-001 spec targets `main > .section > div` for the outer width tier and `main > .section > .default-content-wrapper` for the reading width tier. The existing boilerplate already has `main > .section > div { max-width: 1200px; margin: auto; padding: 0 24px; }` on line 235-239. Two concerns: (1) The boilerplate uses `main > div { margin: 40px 16px; }` on line 145-147 as a fallback before sections are decorated -- should this be kept, removed, or updated to use tokens? (2) The spec says `.default-content-wrapper` must NOT have `overflow: hidden` -- is there any boilerplate or EDS decoration code that might add it?
- **Context to provide**: Same files as Consultation 1 plus `scripts/aem.js` (should not be modified but may add classes/styles), AGENTS.md EDS markup conventions
- **Why this agent**: EDS has specific decoration patterns that produce the `main > .section > div` structure. The agent needs to confirm the CSS selectors will match the decorated DOM and that no EDS decoration code conflicts with the layout contract.

### Consultation 3: Test Content Structure

- **Agent**: frontend-minion (same agent, third question)
- **Planning question**: What should the `drafts/` test content HTML look like to validate all DDD-001 layout behaviors? The test content needs to exercise: multiple sections, default content wrappers with headings and paragraphs, a block wrapper (even a placeholder), and enough content to verify responsive padding at all four breakpoints (base, 600, 900, 1200). Should we create one comprehensive test page or separate test pages per concern? What EDS markup structure must the HTML follow (per the markup reference at aem.live)?
- **Context to provide**: DDD-001 wireframes and HTML structure section, AGENTS.md drafts folder pattern (`--html-folder drafts`), EDS markup conventions
- **Why this agent**: The test content must use valid EDS markup that the decoration pipeline will process correctly. Getting the markup wrong means the CSS selectors won't match and the test is useless.

## Cross-Cutting Checklist

- **Testing** (test-minion): YES, include for planning. The success criteria include "Lighthouse score remains 100" and "responsive padding works at all four breakpoints". test-minion should advise on how to verify these criteria -- whether manual browser inspection at each breakpoint is sufficient or whether automated visual regression tests are warranted. Also: `npm run lint` must pass, which means the CSS must conform to stylelint. test-minion should identify if the existing stylelint config will flag the `min-width` media query syntax (DDD-001 uses `(min-width: 600px)` while the boilerplate uses `(width >= 900px)`).

- **Security** (security-minion): NO, exclude. This task modifies CSS files and an HTML head fragment. No attack surface, no user input handling, no authentication, no dependencies added. The `head.html` already has a Content-Security-Policy; adding a `<link rel="stylesheet">` for `tokens.css` does not change the CSP posture.

- **Usability -- Strategy** (ux-strategy-minion): YES, include (mandatory). Planning question: DDD-001 Open Question #3 flags that mobile line length may be below the 45-character minimum at 375px viewport width. Since this DDD-001 implementation will establish the mobile padding, should the implementing agent flag this or is it explicitly deferred to DDD-005/006? Also: the responsive padding progression (20px -> 24px -> 32px) creates a visual "jump" at breakpoints -- is this acceptable or should transitions be considered?

- **Usability -- Design** (ux-design-minion): NO, exclude from planning. DDD-001 is a layout geometry contract, not a UI component or interaction pattern. There are no visual design decisions to make -- the wireframes and spacing values are already approved. Design review applies to DDD-002+ when actual UI surfaces are built.

- **Accessibility** (accessibility-minion): NO, exclude from planning. DDD-001 is structural CSS (width constraints, padding, margins). It does not introduce interactive elements, color pairings requiring contrast checks, or ARIA patterns. The one accessibility-adjacent concern (Open Question #5 about focus ring contrast) is flagged in the DDD but is not in scope for this implementation.

- **Documentation** (software-docs-minion): YES, include (mandatory). Planning question: After DDD-001 is implemented, should the DDD document be updated with an "Implementation Notes" section recording any deviations from spec, or is the DDD considered frozen once approved? Also: should `AGENTS.md` be updated to reference the token loading order (`tokens.css` before `styles.css`) as a project convention?

- **Observability** (observability-minion / sitespeed-minion): NO, exclude from planning. This is static CSS with no runtime components. Lighthouse 100 is a success criterion but is verified by the implementing agent at the end, not by an observability strategy.

## Anticipated Approval Gates

1. **Token additions to `tokens.css` + boilerplate `:root` replacement in `styles.css`** -- MUST gate. This is the highest-risk change: replacing the boilerplate's variable names affects every `var()` reference in the file. Getting it wrong breaks the entire site visually. High blast radius (all subsequent DDDs depend on these tokens being correct). Hard to reverse without re-examining every reference. Downstream tasks (DDD-002 header, DDD-003 footer, DDD-005/006 typography) all inherit this token contract.

2. **Two-tier width model + section spacing CSS** -- NO gate. This is additive CSS that follows the approved DDD-001 spec precisely. Easy to reverse (delete the rules). Low ambiguity -- the spec provides exact CSS snippets.

3. **Test content in `drafts/`** -- NO gate. Test content is ephemeral and does not affect production. Easy to modify or replace.

## Rationale

This task is primarily a **frontend CSS implementation** task with a clear, approved spec (DDD-001). The core complexity is the migration from boilerplate variables to project tokens -- this is a mechanical but error-prone transformation that requires careful tracking of every `var()` reference. A single agent (frontend-minion) owns all the implementation work.

The planning consultations are focused on the frontend-minion because:
- The boilerplate-to-token migration has hidden gotchas (roboto font fallbacks, the `main > div` pre-decoration fallback, `(width >= 900px)` vs `(min-width: 900px)` syntax)
- EDS markup decoration patterns must be understood to write correct selectors
- Test content must follow EDS conventions to exercise the layout

Cross-cutting concerns are lightweight here: test-minion advises on verification approach, ux-strategy-minion validates the mobile line-length deferral, and software-docs-minion advises on documentation updates. None of these need deep planning contributions -- they can be handled as review-phase inputs.

## Scope

**In scope**:
- Add proposed tokens to `styles/tokens.css`: `--layout-max`, `--content-padding-tablet`, `--space-paragraph`, `--space-element`
- Update `head.html` to load `tokens.css` as a separate `<link>` before `styles.css`
- Replace boilerplate `:root` variables in `styles.css` with project tokens (no mapping layer)
- Update all `var()` references in `styles.css` to use project token names
- Implement two-tier width model (`main > .section > div` at `--layout-max`, `.default-content-wrapper` at `--measure`)
- Implement responsive padding progression (mobile/tablet/desktop)
- Implement section spacing with first-section exception
- Ensure `.default-content-wrapper` has no `overflow: hidden`
- Create test content in `drafts/` for local dev verification
- Pass `npm run lint`
- Maintain Lighthouse 100

**Out of scope**:
- Header internals (DDD-002)
- Footer internals (DDD-003)
- Typography details (DDD-005/006)
- Block-specific styling
- CMS content authoring
- Font file replacement (fonts.css still references roboto -- that is a separate cleanup task)
- Dark mode adjustments beyond what tokens.css already provides
- Any changes to `scripts/aem.js`

## External Skill Integration

### Discovered Skills

| Skill | Location | Classification | Domain | Recommendation |
|-------|----------|---------------|--------|----------------|
| juli | `~/.claude/skills/juli/` | LEAF | Personal conversations (non-technical) | Not relevant -- exclude |

No project-local skills detected in `.claude/skills/` or `.skills/` directories.

### Precedence Decisions

No precedence conflicts. The `juli` skill is in a completely different domain (personal conversations) and has no overlap with any specialist agent.
