MODE: META-PLAN

You are creating a meta-plan — a plan for who should help plan.

## Task

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

## Working Directory
/Users/ben/github/benpeter/mostly-hallucinations

## External Skill Discovery
Before analyzing the task, scan for project-local skills. If skills are discovered, include an "External Skill Integration" section in your meta-plan (see your Core Knowledge for the output format).

## Instructions
1. Read relevant files to understand the codebase context (styles/tokens.css, styles/styles.css, head.html, docs/design-decisions/DDD-001-global-layout.md, AGENTS.md, CLAUDE.md)
2. Discover external skills:
   a. Scan .claude/skills/ and .skills/ in the working directory for SKILL.md files
   b. Read frontmatter (name, description) for each discovered skill
   c. For skills whose description matches the task domain, classify as ORCHESTRATION or LEAF
   d. Check the project's CLAUDE.md for explicit skill preferences
   e. Include discovered skills in your meta-plan output
3. Analyze the task against your delegation table
4. Identify which specialists should be CONSULTED FOR PLANNING (not execution — planning). These are agents whose domain expertise is needed to create a good plan.
5. For each specialist, write a specific planning question that draws on their unique expertise.
6. Return the meta-plan in the structured format.
7. Write your complete meta-plan to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-bZH1RI/implement-ddd-001-global-layout-css/phase1-metaplan.md
