MODE: META-PLAN

You are creating a meta-plan -- a plan for who should help plan.

## Task

<github-issue>
A Design Decision Document (DDD-002-header.md) exists at docs/design-decisions/ that defines the header treatment -- typographic logo, tagline placement, and the corrupted-letterform concept for "Hallucinations" -- so that the existing header block at blocks/header/ can be redesigned to match the brand identity. The DDD follows the format in docs/design-decisions/README.md.

Success criteria:
- DDD-002-header.md exists at docs/design-decisions/ with all required sections per the DDD format
- Logo is typographic only: "Mostly Hallucinations" in Source Code Pro (--font-heading token)
- Proposal describes the corrupted letterform effect on "Hallucinations" (wrong strokes, floating counters, misplaced serifs) with enough specificity for CSS/SVG implementation
- Tagline placement and typography are defined with token references
- No navigation links in the header (deliberately minimal)
- ASCII wireframe shows mobile and desktop layout
- HTML Structure reflects the existing blocks/header/ decoration pattern (AEM EDS block conventions)
- Token Usage table maps every visual element to a CSS custom property from styles/tokens.css
- Status is set to "Proposal"

Scope:
- In: Logo treatment, tagline, corrupted letterform concept, header block HTML structure, responsive behavior
- Out: Navigation (there is none), footer, global layout (DDD-001), actual CSS/JS implementation

Constraints:
- Must work within AEM Edge Delivery Services block conventions (blocks/header/ structure)
- Existing header block at blocks/header/ will be redesigned, not built from scratch
- Source Code Pro for logo text (--font-heading token)
- Output format must match docs/design-decisions/README.md template exactly
</github-issue>

---
Additional context: do not include security and test in the reviewers list. skip context compaction. use frontend, ux strategy and ux design minions for the planning team

## Working Directory
/Users/ben/github/benpeter/mostly-hallucinations

## External Skill Discovery
Before analyzing the task, scan for project-local skills. If skills are discovered, include an "External Skill Integration" section in your meta-plan (see your Core Knowledge for the output format).

## Instructions
1. Read relevant files to understand the codebase context
2. Discover external skills:
   a. Scan .claude/skills/ and .skills/ in the working directory for SKILL.md files
   b. Read frontmatter (name, description) for each discovered skill
   c. For skills whose description matches the task domain, classify as ORCHESTRATION or LEAF (see External Skill Integration in your Core Knowledge)
   d. Check the project's CLAUDE.md for explicit skill preferences
   e. Include discovered skills in your meta-plan output
3. Analyze the task against your delegation table
4. Identify which specialists should be CONSULTED FOR PLANNING (not execution -- planning). These are agents whose domain expertise is needed to create a good plan.

   IMPORTANT: The user has specifically requested these agents for the planning team:
   - frontend-minion
   - ux-strategy-minion
   - ux-design-minion

5. For each specialist, write a specific planning question that draws on their unique expertise.
6. Return the meta-plan in the structured format.
7. Write your complete meta-plan to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-sy6iW5/ddd-002-propose-header/phase1-metaplan.md

## Key Context

### DDD Format (from docs/design-decisions/README.md)
The DDD must include: Context, Proposal (Layout wireframes, Typography, Spacing & Rhythm, Responsive Behavior, Interactions), HTML Structure, CSS Approach, Token Usage table, Open Questions, Decision section.

### Existing Header Block
- blocks/header/header.js: Current boilerplate EDS header with nav, hamburger, brand, sections, tools areas
- blocks/header/header.css: Full nav-oriented CSS with hamburger, sections, tools
- The current code is the AEM boilerplate header -- it will be redesigned to be much simpler (logo + tagline only, no nav)

### Design Tokens (styles/tokens.css)
Key tokens: --font-heading (Source Code Pro), --color-heading (#3F5232), --color-text-muted (#817B6F), --color-background (#F6F4EE), --nav-height (80px), --content-padding-mobile (20px), --content-padding-desktop (32px), --layout-max (1200px)

### Brand Identity (from Obsidian vault)
Logo concept: "Mostly Hallucinations" in Source Code Pro. "Mostly" is solid, grounded. "Hallucinations" has subtly corrupted letterforms -- strokes that don't close, counters that drift, serifs appearing where they shouldn't on a monospaced face. Effect should evoke uncanny valley of AI-generated text.

### Site Structure
Header: logo + tagline only, no navigation. Links home. Tagline: "Generated, meet grounded."

### DDD-001 (Global Layout) - Approved and Implemented
- Two-tier width model: --layout-max (1200px) outer, --measure (68ch) inner
- Header uses --layout-max width, not --measure
- Open Question #1 from DDD-001: confirmed header constrains to --layout-max
