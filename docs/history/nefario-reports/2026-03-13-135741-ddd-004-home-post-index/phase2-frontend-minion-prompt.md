You are contributing to the PLANNING phase of a multi-agent project.
You are NOT executing yet — you are providing your domain expertise
to help build a comprehensive plan.

## Project Task

Produce a Design Decision Document (DDD-004-home-post-index.md) that defines how the home page displays posts as a reverse-chronological list. Each entry shows type badge, title, description, date, and tags. The DDD must follow the exact format established in docs/design-decisions/README.md. This is a design document, not implementation.

## Your Planning Question

How should the home page post index be rendered in Edge Delivery Services? The key architectural question is: should this be (a) a custom block that fetches a post index JSON endpoint (like EDS's query-index.json) and renders entries client-side, (b) an auto-block pattern triggered by content in the home page document, or (c) default content authored directly in the CMS with each post entry as structured markup? Consider: EDS has a query-index.json that exposes page metadata (title, description, path, image, lastModified) and can be extended with custom metadata columns. The post metadata fields (type, tags, date) would need to be available. What are the EDS-idiomatic patterns for a post listing page? What does buildAutoBlocks in scripts.js do and how could it be extended?

## Context

Read these files for context:
- /Users/ben/github/benpeter/mostly-hallucinations/scripts/scripts.js (buildAutoBlocks function)
- /Users/ben/github/benpeter/mostly-hallucinations/AGENTS.md (EDS key concepts, block architecture)
- /Users/ben/github/benpeter/mostly-hallucinations/docs/content-model.md (metadata fields that need to appear)
- EDS documentation reference (search with site:www.aem.live for query index patterns)

Also check for existing blocks:
- /Users/ben/github/benpeter/mostly-hallucinations/blocks/ directory

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

### Risks and Concerns
<things that could go wrong from your domain perspective>

### Additional Agents Needed
<any specialists not yet involved who should be, and why>

6. Write your complete contribution to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-uCqtZX/ddd-004-home-post-index/phase2-frontend-minion.md
