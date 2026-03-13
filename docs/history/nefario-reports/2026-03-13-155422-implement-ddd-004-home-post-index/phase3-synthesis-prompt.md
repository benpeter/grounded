MODE: SYNTHESIS

You are synthesizing specialist planning contributions into a
final execution plan.

## Original Task

Implement the home page post index block as specified in `docs/design-decisions/DDD-004-home-post-index.md`. This involves creating a new EDS block (`blocks/post-index/`), a `helix-query.yaml` configuration file, wiring the block into the home page (auto-block), and adding the `.sr-only` utility class. Source issue: #20.

## Specialist Contributions

Read the following scratch files for full specialist contributions:
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-d3ZWda/implement-ddd-004-home-post-index/phase2-frontend-minion.md
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-d3ZWda/implement-ddd-004-home-post-index/phase2-accessibility-minion.md
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-d3ZWda/implement-ddd-004-home-post-index/phase2-ux-strategy-minion.md
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-d3ZWda/implement-ddd-004-home-post-index/phase2-software-docs-minion.md

## Key consensus across specialists:

### frontend-minion
- Use `window.location.pathname === '/'` for home detection following existing buildHeroBlock pattern
- Fetch inline in decorate(), no shared utility needed
- Layout nesting works without conflict (wrapper inherits --layout-max, block constrains to --measure)
- helix-query.yaml uses indices > named index > include/target/properties structure with meta tag selectors
- Date format variability is a risk -- parser must handle timestamps and serial numbers

### accessibility-minion
- aria-labelledby pattern is correct per AccName 1.2 algorithm
- sr-only class should go in styles.css (NOT lazy-styles.css) for eager loading safety
- Focus indicators meet WCAG 2.4.13
- Empty state is valid
- Key detail: sr-only span textContent must end with ": " (colon-space)
- CSS middot pseudo-elements should use aria-hidden or properly handle screen reader announcement
- Global h2 styles need proper override by block-scoped selectors

### ux-strategy-minion
- Empty state "render nothing" is correct for V1
- First-visit scan-and-decide pattern well-served by 5-element entry structure
- Distinguish fetch-failure from empty-state via console logging
- Verify 404 page links back home (tag clicks will 404 until DDD-007)
- Description quality risk if auto-extracted rather than author-written (OQ7)

### software-docs-minion
- Add "Query Index" section to docs/content-model.md
- No changes to site-structure.md needed
- Inline YAML comments in helix-query.yaml
- DDD-004 status update post-implementation
- OQ7 description provenance must be resolved before documenting

## External Skills Context
No external skills detected.

## Instructions
1. Review all specialist contributions
2. Resolve any conflicts between recommendations (notably: sr-only placement in styles.css vs lazy-styles.css -- accessibility-minion recommends styles.css)
3. Incorporate risks and concerns into the plan
4. Create the final execution plan in structured format
5. Ensure every task has a complete, self-contained prompt
6. Write your complete delegation plan to `/var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-d3ZWda/implement-ddd-004-home-post-index/phase3-synthesis.md`

## Additional Context
- Current branch: nefario/ddd-004-home-post-index (already exists)
- The `.claude/CLAUDE.md` has a "Code Signature" rule: Add `// tva` as a comment in every code file created from scratch
- This is an EDS project -- vanilla JS/CSS, no build steps, no frameworks
- DDD-004 design contract is comprehensive; implementation is largely mechanical
- Budget 0-1 approval gates (design decisions are already made)
