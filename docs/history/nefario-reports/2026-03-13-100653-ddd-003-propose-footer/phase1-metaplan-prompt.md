MODE: META-PLAN

You are creating a meta-plan — a plan for who should help plan.

## Task

A Design Decision Document (DDD-003-footer.md) exists at docs/design-decisions/ that defines the footer as a single understated line — copyright, LinkedIn link, Legal Notice, Privacy Policy separated by middots — so that the existing footer block at blocks/footer/ can be redesigned to match the brand's minimal aesthetic.

Success criteria:
- DDD-003-footer.md exists at docs/design-decisions/ with all required sections per the DDD format
- Footer content is exactly: © 2026 Ben Peter · LinkedIn · Legal Notice · Privacy Policy
- No multi-column layout, no newsletter signup, no social icon grid
- ASCII wireframe shows the single-line treatment at mobile and desktop
- HTML Structure reflects AEM EDS footer block conventions (blocks/footer/)
- Token Usage table maps every element (text color, link color, separator, spacing) to CSS custom properties from styles/tokens.css
- Status is set to "Proposal"

Scope:
- In: Footer content, link treatment, middot separators, spacing, responsive behavior for a single-line footer
- Out: Header (DDD-002), global layout (DDD-001), legal page content, actual CSS/JS implementation

Constraints:
- Must work within AEM Edge Delivery Services block conventions (blocks/footer/ structure)
- Existing footer block at blocks/footer/ will be redesigned, not built from scratch
- Output format must match docs/design-decisions/README.md template exactly

Additional context: do not include security and test in the reviewers list. skip context compaction. use frontend, ux strategy and ux design minions for the planning team.

## Working Directory
/Users/ben/github/benpeter/mostly-hallucinations

## External Skill Discovery
Before analyzing the task, scan for project-local skills. If skills are
discovered, include an "External Skill Integration" section in your meta-plan.

## Instructions
1. Read relevant files to understand the codebase context. Key files:
   - docs/design-decisions/README.md (DDD template format)
   - docs/design-decisions/DDD-002-header.md (recent successful DDD as reference)
   - docs/design-decisions/DDD-001-global-layout.md (layout contract)
   - docs/site-structure.md (footer spec)
   - styles/tokens.css (design tokens)
   - blocks/footer/footer.js and blocks/footer/footer.css (current implementation)
   - CLAUDE.md (project design rules)
2. Discover external skills:
   a. Scan .claude/skills/ and .skills/ in the working directory for SKILL.md files
   b. Read frontmatter (name, description) for each discovered skill
   c. For skills whose description matches the task domain, classify as ORCHESTRATION or LEAF
   d. Check the project's CLAUDE.md for explicit skill preferences
   e. Include discovered skills in your meta-plan output
3. Analyze the task against your delegation table
4. The user has explicitly requested these specialists for planning:
   - frontend-minion (EDS block conventions, footer fragment loading, HTML structure)
   - ux-strategy-minion (cognitive load, footer simplification, information hierarchy)
   - ux-design-minion (visual specification, spacing, responsive treatment)
   Honor this team selection.
5. For each specialist, write a specific planning question that draws on their unique expertise.
6. Return the meta-plan in the structured format.
7. Write your complete meta-plan to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-4bW4Uj/ddd-003-propose-footer/phase1-metaplan.md
