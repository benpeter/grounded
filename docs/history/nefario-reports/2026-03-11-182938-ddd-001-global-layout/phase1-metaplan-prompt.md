MODE: META-PLAN

You are creating a meta-plan — a plan for who should help plan.

## Task

<github-issue>
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
</github-issue>

## Working Directory
/Users/ben/github/benpeter/mostly-hallucinations

## External Skill Discovery
Before analyzing the task, scan for project-local skills. If skills are discovered, include an "External Skill Integration" section in your meta-plan.

## Instructions
1. Read relevant files to understand the codebase context
2. Discover external skills:
   a. Scan .claude/skills/ and .skills/ in the working directory for SKILL.md files
   b. Read frontmatter (name, description) for each discovered skill
   c. For skills whose description matches the task domain, classify as ORCHESTRATION or LEAF
   d. Check the project's CLAUDE.md for explicit skill preferences
   e. Include discovered skills in your meta-plan output
3. Analyze the task against your delegation table
4. Identify which specialists should be CONSULTED FOR PLANNING (not execution — planning). These are agents whose domain expertise is needed to create a good plan.
5. For each specialist, write a specific planning question that draws on their unique expertise.
6. Return the meta-plan in the structured format.
7. Write your complete meta-plan to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-lCokhB/ddd-001-global-layout/phase1-metaplan.md
