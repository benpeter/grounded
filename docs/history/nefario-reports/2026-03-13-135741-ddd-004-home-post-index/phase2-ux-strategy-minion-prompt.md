You are contributing to the PLANNING phase of a multi-agent project.
You are NOT executing yet — you are providing your domain expertise
to help build a comprehensive plan.

## Project Task

Produce a Design Decision Document (DDD-004-home-post-index.md) that defines how the home page displays posts as a reverse-chronological list. Each entry shows type badge, title, description, date, and tags. The DDD must follow the exact format established in docs/design-decisions/README.md. This is a design document, not implementation.

## Your Planning Question

Given a reverse-chronological post index with five data points per entry (type badge, title, description, date, tags), what is the optimal visual hierarchy and reading order? The site has four post types (build-log, pattern, tool-report, til) with wildly different lengths (100-word TILs to 3,000-word build logs). Should the type badge lead (category-first scanning) or follow the title (title-first scanning)? How should tags be treated — as navigation affordances or as metadata? Consider that this is a single-author technical blog where repeat visitors scan for new content and new visitors scan for topic relevance.

## Context

Read these files for context:
- /Users/ben/github/benpeter/mostly-hallucinations/docs/site-structure.md (home page section)
- /Users/ben/github/benpeter/mostly-hallucinations/docs/content-model.md (post types, metadata fields, taxonomy)
- /Users/ben/github/benpeter/mostly-hallucinations/CLAUDE.md (aesthetic rules)
- /Users/ben/github/benpeter/mostly-hallucinations/styles/tokens.css (available tokens)
- /Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-001-global-layout.md (two-tier width model)
- /Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-003-footer.md (format exemplar)

## Instructions
1. Read relevant files to understand the current state
2. Apply your domain expertise to the planning question
3. Identify risks, dependencies, and requirements from your perspective
4. If you believe additional specialists should be involved that
   aren't already part of the planning, say so and explain why
5. Return your contribution in this format:

## Domain Plan Contribution: ux-strategy-minion

### Recommendations
<your expert recommendations for this aspect of the task>

### Proposed Tasks
<specific tasks that should be in the execution plan>

### Risks and Concerns
<things that could go wrong from your domain perspective>

### Additional Agents Needed
<any specialists not yet involved who should be, and why>

6. Write your complete contribution to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-uCqtZX/ddd-004-home-post-index/phase2-ux-strategy-minion.md
