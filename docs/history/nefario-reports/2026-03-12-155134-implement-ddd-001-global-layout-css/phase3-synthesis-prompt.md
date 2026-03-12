MODE: SYNTHESIS

You are synthesizing specialist planning contributions into a final execution plan.

## Original Task

Implement DDD-001 Global Layout CSS contract (#11)

**Outcome**: The approved global layout from DDD-001 is live in the site's CSS, establishing the foundational geometry (two-tier width model, responsive padding, section spacing) that all subsequent surfaces will build on.

**Scope In**: `styles/tokens.css`, `styles/styles.css`, `head.html`, `drafts/` test content
**Scope Out**: Header/footer internals (DDD-002/003), typography (DDD-005/006), block-specific styling

## Specialist Contributions

Read the following scratch files for full contributions:
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-bZH1RI/implement-ddd-001-global-layout-css/phase2-frontend-minion.md
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-bZH1RI/implement-ddd-001-global-layout-css/phase2-test-minion.md
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-bZH1RI/implement-ddd-001-global-layout-css/phase2-ux-strategy-minion.md
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-bZH1RI/implement-ddd-001-global-layout-css/phase2-software-docs-minion.md

## Key consensus across specialists

### frontend-minion (CSS architecture)
Phase: planning
Recommendation: CRITICAL — stylelint-config-standard v40 requires range notation (`width >= 600px`), not `min-width`. All DDD-001 CSS snippets must be rewritten in range syntax for implementation. tokens.css already has 5 lint errors to fix. Keep pre-decoration `main > div` fallback updated with tokens. Remove Roboto @font-face from styles.css and border-radius:8px from pre. Full var() remapping table provided. 7 tasks in dependency order.
Risks: DDD-001 CSS snippets use wrong media query syntax (lint would fail as-written); 5 existing tokens.css lint errors; layout flash if pre-decoration fallback removed

### test-minion (verification strategy)
Phase: planning
Recommendation: CRITICAL — block CSS files (header.css, footer.css, cards.css, hero.css) reference boilerplate var names (--background-color, --light-color, --text-color, etc.) that silently break when :root is removed — must audit and update all blocks as part of this task. Lint already failing with 5 tokens.css errors. Lighthouse localhost is non-deterministic; real validation is post-push to .aem.page. 13-item verification checklist defined.
Risks: CRITICAL — block files use boilerplate var names; removing :root without updating blocks breaks appearance silently

### ux-strategy-minion (UX strategy)
Phase: planning
Recommendation: Mobile line-length deferral acceptable (greenfield). Three-tier padding 24px middle value is imperceptible — if we ship three tiers anyway (DDD-001 is approved), note the 24px value in DDD-001 Open Questions as a candidate for adjustment. DDD-005/006 must carry explicit 42-char mobile line-length floor requirement.
Conflicts: DDD-001 was approved with three-tier padding — ux-strategy recommends simplification but spec is authoritative

### software-docs-minion (documentation)
Phase: planning
Recommendation: Add tokens.css to AGENTS.md project structure tree with loading-order annotation. No DDD-001 addendum needed. Update tokens.css header comment from @import instruction to <link> loading description.
Tasks: 2 — AGENTS.md update, tokens.css header comment update

## Key Conflicts to Resolve

1. **Media query syntax**: DDD-001 spec uses `min-width` syntax. Stylelint requires range notation. **Resolution**: Implement using range notation (`width >= Npx`); this is a spec-implementation detail, not a spec deviation. Document in tokens.css or implementation notes.

2. **Tablet padding**: ux-strategy recommends simplifying 3-tier to 2-tier. DDD-001 is approved with 3-tier. **Resolution**: Follow DDD-001 as approved. Surface the 24px imperceptibility finding as an advisory note in the plan, flag for DDD-005/006.

3. **Block CSS audit scope**: test-minion identified that block CSS files (header.css, footer.css, cards.css, hero.css) reference boilerplate vars. This wasn't in the original issue scope but is REQUIRED to avoid silent breakage. **Resolution**: Include block CSS audit and update as a task. Scope expansion is necessary for correctness.

## External Skills Context
No external skills detected.

## Instructions
1. Read all four specialist contribution files
2. Resolve the three conflicts above as directed
3. Create a final execution plan with:
   - Self-contained task prompts that include all necessary context
   - One MUST gate after the token + boilerplate replacement (highest risk change)
   - Clear dependency order
   - The block CSS audit as a parallel or prerequisite task to the :root replacement
4. Write your complete delegation plan to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-bZH1RI/implement-ddd-001-global-layout-css/phase3-synthesis.md
