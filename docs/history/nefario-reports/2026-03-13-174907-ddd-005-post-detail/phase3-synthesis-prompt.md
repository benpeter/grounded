MODE: SYNTHESIS

You are synthesizing specialist planning contributions into a final execution plan.

## Original Task

Create DDD-005-post-detail.md at docs/design-decisions/ — a Design Decision Document that defines the complete reading experience for individual blog posts. Title, metadata, and every content element. Must follow the DDD template format exactly.

Source issue: #6

## Specialist Contributions

Read the following scratch files for full specialist contributions:
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-40acDz/ddd-005-post-detail/phase2-ux-design-minion.md
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-40acDz/ddd-005-post-detail/phase2-accessibility-minion.md
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-40acDz/ddd-005-post-detail/phase2-frontend-minion.md

## Key consensus across specialists:

### ux-design-minion
- Validated heading spacing (h2 2em/0.5em, h3 1.5em/0.5em), symmetric 1.5em code block spacing
- Pull-quote: 3px gold left border, Source Serif 4 at --heading-font-size-m, 2em vertical space
- h1 at --heading-font-size-xxl (48px/42px), metadata 0.75em below h1, 2em before first body paragraph
- Risk: global styles.css heading margins conflict — must scope to post detail context

### accessibility-minion
- Use <header> (not <footer>) for post metadata within <article>
- Pull-quotes: <figure aria-hidden="true"><blockquote> — visual-only device, content must exist elsewhere
- Type badge: adapted DDD-004 pattern with sr-only prefix in h1
- tabindex="0" on <pre> for keyboard scrollability
- h4+ explicitly prohibited in heading hierarchy
- Risk: EDS doesn't produce <article> wrapper natively — must be added via JS

### frontend-minion
- EDS delivers standard pre/code, lists, inline code as expected HTML
- CRITICAL: blockquotes NOT in EDS allowed default content — must use "Quote" block (authored as table in Google Docs)
- Pull-quotes should be a variant of the Quote block
- decorateButtons() transforms standalone links — DDD must document to prevent unexpected button styling
- No syntax highlighting in V1 — ship without, add Prism.js later in delayed.js
- 68ch measure = ~40-45 monospace chars — horizontal scroll handles overflow
- Boilerplate border-radius: 8px on code blocks must be overridden to 0

## External Skills Context
No external skills detected.

## Instructions
1. Review all specialist contributions (read the full files)
2. Resolve any conflicts between recommendations
3. Incorporate risks and concerns into the plan
4. Create the final execution plan in structured format
5. Ensure every task has a complete, self-contained prompt
6. This is a single-deliverable task (one markdown file), so the plan should be a single task with one approval gate
7. The task output is docs/design-decisions/DDD-005-post-detail.md
8. The executing agent should be ux-design-minion (design document authoring) with opus model
9. Write your complete delegation plan to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-40acDz/ddd-005-post-detail/phase3-synthesis.md

## Key References the Executing Agent Will Need
- docs/design-decisions/README.md (DDD template)
- docs/design-decisions/DDD-001-global-layout.md (layout contract)
- docs/design-decisions/DDD-004-home-post-index.md (precedent for type badge, metadata, a11y patterns)
- docs/content-model.md (post types, metadata fields)
- docs/site-structure.md (single post page spec)
- styles/tokens.css (all design tokens)
- styles/styles.css (current global styles — check for conflicts)
- scripts/aem.js (EDS decoration patterns — check allowed elements)
- CLAUDE.md (aesthetic rules, V1 scope exclusions)
