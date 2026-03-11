MODE: SYNTHESIS

You are synthesizing specialist planning contributions into a final execution plan.

## Original Task

Create a Design Decision Document (DDD-001-global-layout.md) at docs/design-decisions/ that defines the page chrome — max content width, margins, responsive breakpoints, and section spacing — for an AEM Edge Delivery Services blog. The DDD follows the format defined in docs/design-decisions/README.md and references tokens from styles/tokens.css.

Success criteria:
- DDD-001-global-layout.md exists at docs/design-decisions/ and follows the project's DDD format exactly
- Layout uses --measure (68ch) as reading width, not a pixel max-width
- Responsive breakpoints are mobile-first at 600px / 900px / 1200px
- Every visual value references a token from styles/tokens.css
- ASCII wireframe shows spatial arrangement at mobile and desktop
- HTML Structure section shows the semantic page skeleton
- CSS Approach section explains how tokens.css integrates into styles.css
- Token Usage table maps every element to its CSS custom property
- Status is set to "Proposal"

Scope:
- In: Page-level layout, tokens.css integration strategy, semantic page skeleton HTML
- Out: Header/footer content, typography beyond layout, dark mode, block-level styling, actual CSS implementation

Constraints:
- Single-column layout, no sidebar
- Warm white background via --color-background token
- Mobile-first CSS with min-width breakpoints at 600/900/1200px
- DDD format must match docs/design-decisions/README.md template exactly
- AEM Edge Delivery Services markup conventions

## Specialist Contributions

Read the following scratch files for full specialist contributions:
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-lCokhB/ddd-001-global-layout/phase2-frontend-minion.md
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-lCokhB/ddd-001-global-layout/phase2-ux-strategy-minion.md

## Key consensus across specialists:

## Summary: frontend-minion
Phase: planning
Recommendation: Two-tier width model (--layout-max: 1200px for sections, --measure: 68ch for prose in .default-content-wrapper). Load tokens.css as separate link in head.html before styles.css. Replace boilerplate :root variables entirely, no mapping layer.
Tasks: 3 -- Write DDD-001 with CSS architecture for two-tier width; Update head.html token loading; Document token replacement strategy
Risks: 68ch renders ~550-612px depending on font metrics; three font families increase CLS risk; tokens.css @import comment is misleading
Conflicts: none

## Summary: ux-strategy-minion
Phase: planning
Recommendation: Three-tier spacing scale (paragraph 1em, element 1.5em, section 48px). Two-container model matching frontend-minion. Asymmetric heading spacing (2em above, 0.5em below) for scanability. Add tablet padding tier (20px/24px/32px).
Tasks: 3 -- Define spacing scale in DDD; Document vertical rhythm rules; Add tablet padding tier
Risks: ch unit font-dependency; mobile font size may produce sub-45-char lines; code blocks need escape hatch from --measure
Conflicts: none

## External Skills Context
No external skills detected.

## Instructions
1. Review all specialist contributions (read the full files)
2. Resolve any conflicts between recommendations
3. Incorporate risks and concerns into the plan
4. Create the final execution plan in structured format
5. Ensure every task has a complete, self-contained prompt

IMPORTANT: This is a DESIGN DOCUMENT task, not a code implementation task. The execution plan should produce ONE deliverable: the DDD-001-global-layout.md file. The task needs ONE execution agent that writes the document. Do NOT over-decompose this into multiple tasks — a single agent writes the entire DDD file based on the specialist input.

The approval gate is the DDD document itself (human reviews and approves before any implementation begins).

Also read these project files for context needed in the task prompt:
- docs/design-decisions/README.md (DDD format template)
- styles/tokens.css (design tokens)
- styles/styles.css (current boilerplate to be reconciled)
- docs/site-structure.md (site structure)

6. Write your complete delegation plan to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-lCokhB/ddd-001-global-layout/phase3-synthesis.md
