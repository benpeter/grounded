You are contributing to the PLANNING phase of a multi-agent project.
You are NOT executing yet — you are providing your domain expertise
to help build a comprehensive plan.

## Project Task

A Design Decision Document (DDD-003-footer.md) exists at docs/design-decisions/ that defines the footer as a single understated line — copyright, LinkedIn link, Legal Notice, Privacy Policy separated by middots — so that the existing footer block at blocks/footer/ can be redesigned to match the brand's minimal aesthetic.

Footer content is exactly: © 2026 Ben Peter · LinkedIn · Legal Notice · Privacy Policy

## Your Planning Question

For the single-line footer:

(a) What is the right typographic treatment? The current CSS uses `--body-font-size-xs` and `--color-background-soft` as background — should the footer background match the page background (`--color-background`) instead, consistent with the "warm white paper" aesthetic where color is a quiet guest?

(b) How should the middot separators be implemented — literal `·` characters in the markup, or CSS `::before`/`::after` pseudo-elements? What is the right color and spacing for the separators?

(c) At mobile widths (< 600px), a single line of `© 2026 Ben Peter · LinkedIn · Legal Notice · Privacy Policy` may not fit. What is the graceful wrap behavior — wrap at natural break points within the line, or restructure into a stacked layout?

(d) What are the link hover/focus states for footer links — should they match body link behavior (`--color-link` to `--color-link-hover`) or have a subtler treatment given the footer's understated role?

(e) How should vertical spacing above the footer work — does the footer get a top border like the header's bottom border (`1px solid var(--color-border-subtle)`), or is the section spacing from DDD-001 sufficient?

## Context

Read these files for context:
- /Users/ben/github/benpeter/mostly-hallucinations/styles/tokens.css (full token set)
- /Users/ben/github/benpeter/mostly-hallucinations/blocks/footer/footer.css (current styles)
- /Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-001-global-layout.md (layout contract, padding tokens, section spacing)
- /Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-002-header.md (precedent: interaction states, border treatment, token usage table format)
- /Users/ben/github/benpeter/mostly-hallucinations/CLAUDE.md (aesthetic rules)

Key tokens from tokens.css:
- --color-background: #F6F4EE (warm white)
- --color-background-soft: #EFE9DD (code blocks, subtle surfaces)
- --color-text-muted: #817B6F (dates, metadata)
- --color-border-subtle: #EFE9DD (near-invisible separators)
- --color-link: #7F9A63 (sage green links)
- --color-link-hover: #3F5232 (deepens to heading green)
- --body-font-size-xs: 15px (mobile) / 14px (desktop >= 900px)
- --font-body: Source Sans 3
- --content-padding-mobile: 20px
- --content-padding-tablet: 24px
- --content-padding-desktop: 32px
- --layout-max: 1200px

DDD-002 header border treatment: 1px solid var(--color-border-subtle) at bottom — "faintest structural separation"
DDD-002 focus ring: --color-heading used for focus-visible (gold rejected for contrast)

## Instructions
1. Read relevant files to understand the current state
2. Apply your domain expertise to the planning question
3. Identify risks, dependencies, and requirements from your perspective
4. If you believe additional specialists should be involved that aren't already part of the planning, say so and explain why
5. Return your contribution in this format:

## Domain Plan Contribution: ux-design-minion

### Recommendations
<your expert recommendations for this aspect of the task>

### Proposed Tasks
<specific tasks that should be in the execution plan>
For each task: what to do, deliverables, dependencies

### Risks and Concerns
<things that could go wrong from your domain perspective>

### Additional Agents Needed
<any specialists not yet involved who should be, and why>
(or "None" if the current team is sufficient)

6. Write your complete contribution to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-4bW4Uj/ddd-003-propose-footer/phase2-ux-design-minion.md
