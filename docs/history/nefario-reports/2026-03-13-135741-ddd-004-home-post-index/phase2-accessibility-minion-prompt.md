You are contributing to the PLANNING phase of a multi-agent project.
You are NOT executing yet — you are providing your domain expertise
to help build a comprehensive plan.

## Project Task

Produce a Design Decision Document (DDD-004-home-post-index.md) that defines how the home page displays posts as a reverse-chronological list. Each entry shows type badge, title, description, date, and tags. The DDD must follow the exact format established in docs/design-decisions/README.md. This is a design document, not implementation.

## Your Planning Question

What semantic HTML structure should the post index use? Specifically: (1) Should each post entry be an <article> element? (2) Should the index be wrapped in a landmark (e.g., <section aria-label="Posts">)? (3) What heading level should post titles use on the home page (h2 under an implicit h1, or h3)? (4) How should type badges be announced — as part of the heading, as a separate element with a specific role, or as visually-hidden prefix text? (5) How should the date be marked up for <time datetime=""> and screen reader announcement order? (6) How should tags be structured — as a <ul> of links, as comma-separated inline links, or as something else? Consider that this list will eventually have 20+ items before pagination kicks in.

## Context

Read these files for context:
- /Users/ben/github/benpeter/mostly-hallucinations/docs/content-model.md
- /Users/ben/github/benpeter/mostly-hallucinations/docs/site-structure.md
- /Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-001-global-layout.md (HTML structure section)
- /Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-003-footer.md (accessibility precedent)
- /Users/ben/github/benpeter/mostly-hallucinations/CLAUDE.md (WCAG 2.2 AA requirement, semantic HTML rules)

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

### Risks and Concerns
<things that could go wrong from your domain perspective>

### Additional Agents Needed
<any specialists not yet involved who should be, and why>

6. Write your complete contribution to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-uCqtZX/ddd-004-home-post-index/phase2-accessibility-minion.md
