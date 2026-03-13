You are contributing to the PLANNING phase of a multi-agent project.
You are NOT executing yet — you are providing your domain expertise
to help build a comprehensive plan.

## Project Task

Produce a Design Decision Document (DDD-004-home-post-index.md) that defines how the home page displays posts as a reverse-chronological list. Each entry shows type badge, title, description, date, and tags. The DDD must follow the exact format established in docs/design-decisions/README.md. This is a design document, not implementation.

## Your Planning Question

The site needs four type badges (build-log, pattern, tool-report, til) that are "small, muted, unobtrusive" per site-structure.md. The site aesthetic prohibits cards, shadows, gradients, rounded containers, and decorative icons. Color is a "quiet guest" — --color-accent (gold) appears at most once per screen. What visual treatment can differentiate four post types while remaining understated? Options include: text-only labels with subtle weight/case differences, a single-character prefix or symbol, a thin left border accent per type, or differentiated text color. The treatment must work in both light and dark mode and pass WCAG AA contrast. How should these badges relate to the existing token palette without requiring new color tokens?

## Context

Read these files for context:
- /Users/ben/github/benpeter/mostly-hallucinations/styles/tokens.css (full token set including dark mode)
- /Users/ben/github/benpeter/mostly-hallucinations/CLAUDE.md (aesthetic rules, especially "Green and gold are NOT co-equal theme colors")
- /Users/ben/github/benpeter/mostly-hallucinations/docs/site-structure.md ("Type label — small, muted, unobtrusive")
- /Users/ben/github/benpeter/mostly-hallucinations/docs/content-model.md (the four types and their semantic meaning)

## Instructions
1. Read relevant files to understand the current state
2. Apply your domain expertise to the planning question
3. Identify risks, dependencies, and requirements from your perspective
4. If you believe additional specialists should be involved that
   aren't already part of the planning, say so and explain why
5. Return your contribution in this format:

## Domain Plan Contribution: ux-design-minion

### Recommendations
<your expert recommendations for this aspect of the task>

### Proposed Tasks
<specific tasks that should be in the execution plan>

### Risks and Concerns
<things that could go wrong from your domain perspective>

### Additional Agents Needed
<any specialists not yet involved who should be, and why>

6. Write your complete contribution to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-uCqtZX/ddd-004-home-post-index/phase2-ux-design-minion.md
