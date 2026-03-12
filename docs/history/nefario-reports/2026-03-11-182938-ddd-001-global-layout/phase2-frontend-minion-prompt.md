You are contributing to the PLANNING phase of a multi-agent project.
You are NOT executing yet — you are providing your domain expertise
to help build a comprehensive plan.

## Project Task

Create a Design Decision Document (DDD-001-global-layout.md) at docs/design-decisions/ that defines the page chrome — max content width, margins, responsive breakpoints, and section spacing — for an AEM Edge Delivery Services blog. The DDD follows the format defined in docs/design-decisions/README.md and references tokens from styles/tokens.css.

Key constraints: single-column layout, no sidebar, warm white background, mobile-first CSS with min-width breakpoints at 600/900/1200px. The layout uses --measure (68ch) as reading width. Status is "Proposal" for human review.

## Your Planning Question

Given the EDS page structure (`main > .section > div` as content containers) and the existing boilerplate `styles.css` (which uses `max-width: 1200px` on section divs), what is the correct CSS approach for constraining content to `--measure` (68ch) while respecting the EDS section/block model? Specifically:

(a) Should `--measure` apply to `main > .section > div` or to a narrower container within it? Consider that sections can have background colors/images that span full width while content is constrained.

(b) How should the `1200px` boilerplate max-width relate to `--measure`? The boilerplate uses `max-width: 1200px` on `main > .section > div`. Should this be replaced with `max-width: var(--measure)`, or should `--measure` apply at a different level?

(c) What is the right import order for `tokens.css` into `styles.css` given EDS's three-phase loading where `styles.css` loads eagerly via `head.html`? The boilerplate `styles.css` currently defines its own `:root` variables that conflict with `tokens.css`.

(d) How should the boilerplate `:root` variables in `styles.css` (--background-color, --body-font-family, etc.) be reconciled with `tokens.css` (--color-background, --font-body, etc.)? Replace them? Override via cascade? Map old names to new tokens?

## Context

Read these files for full context:
- styles/styles.css (the unmodified AEM boilerplate — note conflicting :root variables)
- styles/tokens.css (the project's design token system)
- docs/design-decisions/README.md (the DDD format template)
- docs/site-structure.md (layout requirements)
- CLAUDE.md (design aesthetic rules)
- AGENTS.md (EDS conventions, block/section markup)
- head.html (how CSS is loaded)
- scripts/scripts.js (three-phase loading: eager/lazy/delayed)

## Instructions
1. Read relevant files to understand the current state
2. Apply your domain expertise to the planning question
3. Identify risks, dependencies, and requirements from your perspective
4. If you believe additional specialists should be involved that aren't already part of the planning, say so and explain why
5. Return your contribution in this format:

## Domain Plan Contribution: frontend-minion

### Recommendations
Your expert recommendations for CSS architecture and token integration

### Proposed Tasks
Specific tasks that should be in the execution plan.
For each task: what to do, deliverables, dependencies

### Risks and Concerns
Things that could go wrong from your domain perspective

### Additional Agents Needed
Any specialists not yet involved who should be, and why
(or "None" if the current team is sufficient)

6. Write your complete contribution to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-lCokhB/ddd-001-global-layout/phase2-frontend-minion.md
