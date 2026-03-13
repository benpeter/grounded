## Task: Write DDD-004-home-post-index.md

Write the design decision document for the home page post index at `docs/design-decisions/DDD-004-home-post-index.md`. This is a NEW FILE — create it from scratch following the established DDD format.

### What to Write

DDD-004 defines how the home page displays posts as a reverse-chronological list. Each entry shows: type badge, title, description, date, and tags. The home page IS the post index — no other content appears on the page.

### Resolved Design Spec

Read the full resolved design spec from:
`/var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T/nefario-scratch-uCqtZX/ddd-004-home-post-index/phase3-synthesis.md`

This file contains ALL resolved design decisions (14 conflict resolutions), the complete HTML structure, typography table, responsive behavior, interactions, CSS approach, and open questions. Use it as the single source of truth for all design decisions.

### Reviewer Advisories (MUST incorporate)

The following advisories from architecture review MUST be incorporated into the DDD:

**A1 [security]: datetime format**
Specify ISO 8601 date-only (`YYYY-MM-DD`) as the normative format for the `datetime` attribute. Document this in the HTML Structure section alongside the `<time>` element.

**A2 [security]: Tag slug validation**
Document in the HTML Structure section that tag slugs from `query-index.json` must be validated against an allowlist pattern (lowercase alphanumeric + hyphens only) before being used in `href` attributes. This prevents path traversal or protocol injection via malicious metadata.

**A3 [security]: createElement constraint placement**
The constraint that DOM must be built via `document.createElement()` + `textContent`/`setAttribute` (not `innerHTML`) belongs in the HTML Structure section, not the CSS Approach section. Place it where implementation agents will look when writing `decorate()`.

**A4 [testing]: ID generation scheme**
Specify a concrete ID derivation rule for `aria-labelledby` references. Use position-based IDs (`post-1-title`, `post-2-title`) since entries are rendered from a sorted array. Document this contract in the HTML Structure section so it is testable.

**A5 [testing]: Open Question 6 test annotation**
Add a note to Open Question 6 (auto-block vs. authored block) that the answer affects test scope: auto-block via `buildAutoBlocks()` requires testing the injection path; an authored block tests only `decorate()`.

**A6 [ux-strategy]: Description field provenance**
Add an Open Question (new #7) about whether descriptions come from explicit CMS metadata or EDS auto-extraction of page content. If auto-extracted, authors lack a clear lever to control what appears in the post index. Flag this as a prerequisite alongside `helix-query.yaml`.

**A7 [governance]: Type badge distinctness**
The original issue #5 says "Four type badges defined with distinct but understated visual treatment." The resolved spec uses identical visual treatment for all four types. The DDD must explicitly acknowledge this decision and document the rationale: the site's aesthetic rules prohibit decorative differentiation (no per-type colors, borders, or icons), and the type label text itself provides sufficient differentiation. If the reviewer disagrees, this becomes an Open Question.

**A8 [accessibility]: aria-label="Tags" repetition**
With 20+ entries, 20+ identical `aria-label="Tags"` lists create screen reader navigation noise. Drop the `aria-label` entirely — the enclosing `<article>` landmark already provides post context, and the `<ul>` is the only list within each article.

**A9 [accessibility]: h1 DOM order guarantee**
The sr-only `<h1>` must appear first within `<main>` DOM order, regardless of EDS block injection order. Document in the HTML Structure section that the implementation must guarantee this — either via auto-block injection order in `buildAutoBlocks()` or by having `decorate()` prepend to `<main>` rather than to the block element.

### User Direction

**PREREQUISITE**: The `helix-query.yaml` configuration is a hard prerequisite for implementation, not just an Open Question. Document it prominently in the Context section as a dependency that blocks implementation. Include what columns are needed (`path`, `title`, `description`, `date`, `type`, `tags`) and the include path (`/blog/**`). This ensures it gets picked up as part of the implementation work.

### Format Requirements

Follow the DDD template at `docs/design-decisions/README.md` EXACTLY, incorporating the established patterns from DDDs 001-003. Specifically:

1. **Status**: `Proposal`
2. **Context section**: Use structured subsections with bold headers, matching DDD-002 and DDD-003:
   - `**Site structure (docs/site-structure.md)**` — quote the relevant home page requirements
   - `**Content model (docs/content-model.md)**` — the five metadata fields, the four post types, the tag taxonomy
   - `**Aesthetic rules (CLAUDE.md)**` — the relevant rules (no cards, no shadows, typography creates hierarchy, color as quiet guest)
   - `**DDD-001 layout contract**` — two-tier width model, padding tokens. State that the post index constrains to `--measure` (reading width), not `--layout-max`
   - `**DDD-002/DDD-003 precedent**` — focus ring pattern, link styling conventions, border-subtle usage
   - `**Design tokens (styles/tokens.css)**` — note that no new tokens are proposed; all elements map to existing tokens
   - `**V1 scope exclusions (CLAUDE.md)**` — no pagination until 20+ posts, no featured post, no hero image, no card shadows, no sidebar
   - `**EDS data source (PREREQUISITE)**` — the post index fetches `query-index.json`. Document that `helix-query.yaml` must be configured at the project root. List required columns. Mark this as a hard implementation prerequisite.

3. **Proposal section** with subsections: Layout (ASCII wireframes), Typography, Spacing & Rhythm, Responsive Behavior, Interactions — all per the resolved spec.

   IMPORTANT: Use ONLY pure ASCII characters (`+`, `-`, `|`, `/`, `\`, `<`, `>`, `.`). NEVER use Unicode box-drawing characters. Follow the conventions from DDDs 001-003.

4. **HTML Structure section**: Show data source example AND final decorated DOM per the resolved spec. Include all security/accessibility constraints (createElement, slug validation, datetime format, h1 DOM order, aria-labelledby IDs).

5. **CSS Approach section**: Layout method, width constraint, tag list styling, type badge text-transform, sr-only class definition.

6. **Token Usage table** with Status column (`Existing | Proposed | Hardcoded`). All tokens should be Existing.

7. **Open Questions**: Include all from the resolved spec PLUS the new ones from advisories (description provenance, test-surface annotation on OQ6).

8. **Decision section**: Empty checkboxes with `_Human writes here during review_` placeholder.

### What NOT to Do

- Do NOT write implementation code (no JS, no CSS files). This is a design document only.
- Do NOT create `helix-query.yaml` or any block files.
- Do NOT use Unicode box-drawing characters in wireframes.
- Do NOT propose new tokens.
- Do NOT add pagination, featured posts, hero images, card shadows, or anything excluded by CLAUDE.md V1 scope.
- Do NOT use `role="feed"` on any element.
- Do NOT use `--color-link` for the title. Title uses `--color-heading`.
- Do NOT create per-type color differentiation for type badges. All four types are visually identical.

### Reference Files to Read

Before writing, read these files for format and context:
- `docs/design-decisions/README.md` — the DDD template
- `docs/design-decisions/DDD-003-footer.md` — the most recent DDD, best format reference
- `docs/design-decisions/DDD-002-header.md` — another format reference
- `docs/design-decisions/DDD-001-global-layout.md` — the layout contract
- `docs/site-structure.md` — home page requirements
- `docs/content-model.md` — post metadata fields and types
- `styles/tokens.css` — all available design tokens
- `CLAUDE.md` — aesthetic rules and V1 scope
- `AGENTS.md` — EDS conventions and block structure

### Deliverables

- `docs/design-decisions/DDD-004-home-post-index.md` — the complete DDD

When you finish, report:
- File path with line count (e.g., "docs/design-decisions/DDD-004-home-post-index.md (new DDD, +N lines)")
- 1-2 sentence summary of what was produced
