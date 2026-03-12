A Design Decision Document (DDD-001-global-layout.md) exists at docs/design-decisions/ that defines the page chrome — max content width, margins, responsive breakpoints, and section spacing — so that all subsequent design surfaces (header, footer, post index, post detail) build on an approved foundation. The DDD follows the format defined in docs/design-decisions/README.md and references tokens from styles/tokens.css.

Success criteria:
- DDD-001-global-layout.md exists at docs/design-decisions/ and follows the project's DDD format exactly (all required sections present)
- Layout uses --measure (68ch) as reading width, not a pixel max-width
- Responsive breakpoints are mobile-first at 600px / 900px / 1200px using min-width media queries
- Every visual value references a token from styles/tokens.css — no hardcoded hex/px values that duplicate existing tokens
- ASCII wireframe shows spatial arrangement at mobile and desktop
- HTML Structure section shows the semantic page skeleton (body > header, main, footer)
- CSS Approach section explains how tokens.css integrates into styles.css (import order, cascade)
- Token Usage table maps every element to its CSS custom property
- Status is set to "Proposal" (human reviews and approves before implementation)

Scope:
- In: Page-level layout (content width, margins, section spacing, breakpoints), tokens.css → styles.css integration strategy, semantic page skeleton HTML
- Out: Header/footer content (separate DDDs), typography decisions beyond layout, dark mode, any block-level styling, actual CSS implementation (that happens after approval)

Constraints:
- Single-column layout, no sidebar
- Warm white background (via --color-background token)
- Mobile-first CSS with min-width breakpoints at 600/900/1200px per AGENTS.md
- Output format must match docs/design-decisions/README.md template exactly
- AEM Edge Delivery Services markup conventions (sections, blocks) must be respected in HTML Structure
