You are contributing to the PLANNING phase of a multi-agent project.
You are NOT executing yet — you are providing your domain expertise to help build a comprehensive plan.

## Project Task

<github-issue>
Implement DDD-001 Global Layout CSS contract

**Outcome**: The approved global layout from DDD-001 is live in the site's CSS, establishing the foundational geometry (two-tier width model, responsive padding, section spacing) that all subsequent surfaces — header, footer, post index, post detail — will build on.

**Success criteria**:
- Proposed tokens added to `styles/tokens.css`: `--layout-max`, `--content-padding-tablet`, `--space-paragraph`, `--space-element`
- `tokens.css` loaded as a separate `<link>` in `head.html` before `styles.css`
- All boilerplate `:root` variables replaced with project tokens
- Two-tier width model implemented
- Responsive padding at all four breakpoints (base/600/900/1200)
- `npm run lint` passes
- Lighthouse score remains 100 on local preview
</github-issue>

## Your Planning Question

What is the appropriate verification strategy for this CSS implementation? Specifically:
1. How should "Lighthouse 100 on local preview" be validated given no live URL exists yet (drafts/ content only)?
2. What does `npm run lint` actually check (ESLint, Stylelint, both)? Will the media query syntax change from `(width >= 900px)` to `(min-width: 900px)` or vice versa trigger any lint failures?
3. Are there any existing tests in this repo that touch styles/ or head.html that could fail after the boilerplate `:root` replacement?
4. What should the verification checklist look like for the executing agent?

## Context

Read these files in /Users/ben/github/benpeter/mostly-hallucinations:
- `package.json` — check lint scripts and test commands
- `.github/workflows/main.yaml` — CI lint configuration
- `styles/styles.css` — note the media query syntax used
- `AGENTS.md` — performance and testing requirements

## Instructions
1. Read all context files
2. Apply your testing/verification expertise
3. Return your contribution in the standard format
4. Write your complete contribution to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-bZH1RI/implement-ddd-001-global-layout-css/phase2-test-minion.md
