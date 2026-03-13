You are contributing to the PLANNING phase of a multi-agent project.
You are NOT executing yet — you are providing your domain expertise
to help build a comprehensive plan.

## Project Task

Implement the home page post index block as specified in `docs/design-decisions/DDD-004-home-post-index.md`. This involves creating a new EDS block (`blocks/post-index/`), a `helix-query.yaml` configuration file, wiring the block into the home page (auto-block vs authored), and adding the `.sr-only` utility class.

## Your Planning Question

Given the codebase patterns in `scripts/scripts.js` (buildAutoBlocks, loadEager/loadLazy phases) and existing blocks (header.js, footer.js), what is the optimal implementation approach for the post-index block? Specifically:

1. Should the auto-block injection in `buildAutoBlocks()` check `window.location.pathname === '/'` or use a different home page detection method?
2. How should the block handle the fetch of `/query-index.json` -- inline in `decorate()` or via a utility?
3. The `styles/styles.css` applies `main > .section > div { max-width: var(--layout-max) }` -- will the block's `max-width: var(--measure)` work correctly within this container without layout conflicts?
4. What is the correct `helix-query.yaml` syntax for EDS query index configuration?

## Context

Read these files for codebase context:
- `scripts/scripts.js` -- main entry point, buildAutoBlocks, loadEager/loadLazy
- `blocks/header/header.js` -- existing block DOM construction pattern
- `blocks/footer/footer.js` -- simpler fragment-based block
- `styles/styles.css` -- section layout, max-width constraints
- `styles/tokens.css` -- design tokens
- `docs/design-decisions/DDD-004-home-post-index.md` -- the full design contract
- Search EDS documentation at aem.live for `helix-query.yaml` syntax

## Instructions
1. Read relevant files to understand the current state
2. Apply your domain expertise to the planning question
3. Identify risks, dependencies, and requirements from your perspective
4. If you believe additional specialists should be involved that
   aren't already part of the planning, say so and explain why
5. Return your contribution in this format:

## Domain Plan Contribution: frontend-minion

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

6. Write your complete contribution to `/var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-d3ZWda/implement-ddd-004-home-post-index/phase2-frontend-minion.md`
