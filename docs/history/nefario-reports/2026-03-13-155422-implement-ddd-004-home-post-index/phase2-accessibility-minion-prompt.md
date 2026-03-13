You are contributing to the PLANNING phase of a multi-agent project.
You are NOT executing yet — you are providing your domain expertise
to help build a comprehensive plan.

## Project Task

Implement the home page post index block as specified in `docs/design-decisions/DDD-004-home-post-index.md`. This involves creating a new EDS block (`blocks/post-index/`) with a sophisticated accessibility pattern including sr-only elements, aria-labelledby, and semantic HTML.

## Your Planning Question

DDD-004 specifies a detailed accessibility pattern: sr-only h1, aria-hidden badges, sr-only prefixes in h2, aria-labelledby on articles, tag validation regex. Review the proposed DOM structure and interaction patterns for correctness. Specifically:

1. Is the `aria-labelledby` pointing to the `<h2>` id correct when the h2 contains both an sr-only span and an anchor? Will screen readers announce the full computed text or just the anchor text?
2. Does the `.sr-only` class definition in DDD-004 match current best practices?
3. Are there any keyboard navigation issues with the tab order (title link, then tag links per entry)?
4. Does the empty state (sr-only h1 only, no articles) create any accessibility issues?

## Context

Read these files for codebase context:
- `docs/design-decisions/DDD-004-home-post-index.md` -- the full design contract with HTML structure and accessibility patterns
- `styles/tokens.css` -- design tokens including focus ring patterns
- `blocks/header/header.js` and `blocks/header/header.css` -- existing focus ring implementation
- `blocks/footer/footer.js` and `blocks/footer/footer.css` -- existing link accessibility patterns

## Instructions
1. Read relevant files to understand the current state
2. Apply your domain expertise to the planning question
3. Identify risks, dependencies, and requirements from your perspective
4. If you believe additional specialists should be involved that
   aren't already part of the planning, say so and explain why
5. Return your contribution in this format:

## Domain Plan Contribution: accessibility-minion

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

6. Write your complete contribution to `/var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-d3ZWda/implement-ddd-004-home-post-index/phase2-accessibility-minion.md`
