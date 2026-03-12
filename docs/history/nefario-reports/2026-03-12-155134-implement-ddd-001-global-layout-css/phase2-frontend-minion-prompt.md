You are contributing to the PLANNING phase of a multi-agent project.
You are NOT executing yet — you are providing your domain expertise to help build a comprehensive plan.

## Project Task

<github-issue>
Implement DDD-001 Global Layout CSS contract

**Outcome**: The approved global layout from DDD-001 is live in the site's CSS, establishing the foundational geometry (two-tier width model, responsive padding, section spacing) that all subsequent surfaces — header, footer, post index, post detail — will build on. This unblocks implementation of DDD-002+ by providing the layout contract in code, not just on paper.

**Success criteria**:
- Proposed tokens added to `styles/tokens.css`: `--layout-max`, `--content-padding-tablet`, `--space-paragraph`, `--space-element`
- `tokens.css` loaded as a separate `<link>` in `head.html` before `styles.css`
- All boilerplate `:root` variables in `styles.css` replaced with project tokens per DDD-001 mapping table (no mapping layer, wholesale replacement)
- Two-tier width model implemented: `main > .section > div` constrained to `--layout-max`, `.default-content-wrapper` constrained to `--measure`
- Responsive padding progression works at all four breakpoints (base/600/900/1200)
- Section spacing applied with `--section-spacing`, first section has no top margin
- `.default-content-wrapper` does not use `overflow: hidden` (code block escape hatch)
- Test content in `drafts/` renders correctly in local dev server at mobile, tablet, and desktop widths
- `npm run lint` passes
- Lighthouse score remains 100 on local preview

**Scope**:
- In: `styles/tokens.css`, `styles/styles.css`, `head.html`, `drafts/` test content for local preview
- Out: Header internals (DDD-002), footer internals (DDD-003), typography details (DDD-005/006), block-specific styling, CMS content authoring

**Constraints**:
- All CSS values must reference design tokens — no hardcoded hex or pixel values outside token definitions
- Follow EDS three-phase loading and markup conventions (`main > .section > .default-content-wrapper`)
- DDD-001 (`docs/design-decisions/DDD-001-global-layout.md`) is the spec — its CSS snippets, token table, and HTML structure are authoritative
</github-issue>

## Your Planning Questions

1. **Migration sequence**: Given the current boilerplate `styles.css` with its `:root` block of conflicting variable names, `@font-face` fallbacks, and hardcoded values throughout, what is the safest edit sequence to: (a) add the four proposed tokens to `tokens.css`, (b) wholesale-replace the boilerplate `:root` and all `var()` references with project tokens per DDD-001 mapping table, (c) implement the two-tier width model and responsive padding? Should the roboto `@font-face` fallback blocks be removed or kept?

2. **EDS selector compatibility**: Confirm: (a) Does EDS decoration always produce a `div` child inside `.section`? (b) The boilerplate uses `(width >= 900px)` syntax while DDD-001 uses `(min-width: 900px)` — which should we standardize on, given stylelint rules? (c) Is there any EDS decoration code that might set `overflow: hidden` on `.default-content-wrapper`?

3. **Drafts test content**: What should `drafts/` test content look like to validate all four breakpoints, both width tiers, section spacing, and the code block escape hatch? What EDS-valid markup structure should the HTML follow?

## Context

Read these files in /Users/ben/github/benpeter/mostly-hallucinations:
- `styles/tokens.css` — current design tokens
- `styles/styles.css` — current boilerplate styles (identify all `var()` references to remap)
- `head.html` — current head template (needs tokens.css link added)
- `styles/fonts.css` — font definitions (check for roboto references)
- `docs/design-decisions/DDD-001-global-layout.md` — the authoritative spec with CSS snippets and token mapping table
- `scripts/scripts.js` — EDS decoration code (check for overflow:hidden or wrapper class assignments)
- `AGENTS.md` — EDS conventions and breakpoint rules

## Instructions
1. Read all context files listed above
2. Apply your frontend/CSS expertise to answer all three planning questions
3. Identify risks, dependencies, and specific line-level edits needed
4. Return your contribution in the standard format
5. Write your complete contribution to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-bZH1RI/implement-ddd-001-global-layout-css/phase2-frontend-minion.md
