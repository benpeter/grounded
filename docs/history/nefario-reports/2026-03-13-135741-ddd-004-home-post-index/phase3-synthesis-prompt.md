MODE: SYNTHESIS

You are synthesizing specialist planning contributions into a
final execution plan.

## Original Task

Produce a Design Decision Document (DDD-004-home-post-index.md) at docs/design-decisions/ that defines how the home page displays posts as a reverse-chronological list — type badge, title, description, date, and tags per entry.

Source: GitHub Issue #5 — "DDD-004: Propose Home Page / Post Index"

Success criteria:
- DDD-004-home-post-index.md exists at docs/design-decisions/ with all required sections per the DDD format
- Each post entry shows: type badge, title, description, date, and tags
- Four type badges defined with distinct but understated visual treatment
- List is reverse chronological with no pagination, no featured post, no hero image, no card shadows
- ASCII wireframe shows a single post entry and the list rhythm at mobile and desktop
- HTML Structure uses semantic markup consistent with docs/content-model.md
- Token Usage table maps every element to CSS custom properties from styles/tokens.css
- Status is set to "Proposal"

## Specialist Contributions

Read the following scratch files for full specialist contributions:
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-uCqtZX/ddd-004-home-post-index/phase2-ux-strategy-minion.md
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-uCqtZX/ddd-004-home-post-index/phase2-ux-design-minion.md
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-uCqtZX/ddd-004-home-post-index/phase2-accessibility-minion.md
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-uCqtZX/ddd-004-home-post-index/phase2-frontend-minion.md
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-uCqtZX/ddd-004-home-post-index/phase2-software-docs-minion.md

## Key consensus across specialists:

1. ux-strategy-minion: Title-first scanning; hierarchy: Title > Description > Type badge > Date > Tags; tags as navigation affordances (links to /tags/{tag}); identical layout for all four types.
2. ux-design-minion: Text-only uppercase labels in Source Code Pro at --body-font-size-xs, --color-text-muted, with letter-spacing. Zero new tokens. All types identical visual treatment.
3. accessibility-minion: <article> per entry with aria-labelledby; <h2> for titles; visually hidden <h1>; type badge as sr-only prefix in heading; <time datetime>; <ul aria-label="Tags"> with <li><a> children.
4. frontend-minion: Custom post-index block fetching query-index.json client-side. Requires helix-query.yaml for custom metadata columns (type, date, tags). Width at --measure.
5. software-docs-minion: Follow CLAUDE.md ASCII rules (not Unicode); include Interactions section; document layout method and width constraint in CSS Approach; follow 8 established patterns from DDDs 001-003.

## External Skills Context
No external skills detected.

## Instructions
1. Review all specialist contributions
2. Resolve any conflicts between recommendations
3. Incorporate risks and concerns into the plan
4. Create the final execution plan in structured format
5. Ensure every task has a complete, self-contained prompt
6. Write your complete delegation plan to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-uCqtZX/ddd-004-home-post-index/phase3-synthesis.md

Important context for the plan:
- This is a SINGLE DELIVERABLE task: one markdown file (DDD-004-home-post-index.md)
- The task should be ONE execution task assigned to a single agent (nefario or software-docs-minion) who writes the DDD incorporating all specialist input
- ONE approval gate: the completed DDD itself
- The plan should include all the design decisions resolved from specialist input so the writing agent has a clear, unambiguous spec
- Branch: nefario/ddd-004-home-post-index (will be created from main)
- Report directory: docs/history/nefario-reports/
