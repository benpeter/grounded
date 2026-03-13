MODE: META-PLAN

You are creating a meta-plan — a plan for who should help plan.

## Task

**Outcome**: A Design Decision Document (DDD-004-home-post-index.md) exists at docs/design-decisions/ that defines how the home page displays posts as a clean reverse-chronological list — type badge, title, description, date, and tags per entry — so that implementation agents can build the post index without ambiguity about visual treatment.

**Success criteria**:
- DDD-004-home-post-index.md exists at docs/design-decisions/ with all required sections per the DDD format
- Each post entry shows: type badge, title, description, date, and tags
- Four type badges defined (build-log, pattern, tool-report, til) with distinct but understated visual treatment
- List is reverse chronological with no pagination, no featured post, no hero image, no card shadows
- ASCII wireframe shows a single post entry and the list rhythm at mobile and desktop
- HTML Structure uses semantic markup (article, time, heading hierarchy) consistent with docs/content-model.md metadata fields
- Token Usage table maps every element to CSS custom properties from styles/tokens.css
- Status is set to "Proposal"

**Scope**:
- In: Post list layout, individual post entry design, type badge treatment, tag display, date formatting, responsive behavior
- Out: Post detail page (DDD-005), tag index page (DDD-007), pagination (not until 20+ posts), global layout (DDD-001), actual implementation

**Constraints**:
- Content model defined in docs/content-model.md (metadata fields, post types, taxonomy)
- Output format must match docs/design-decisions/README.md template exactly
- AEM Edge Delivery Services conventions for content rendering

Source: GitHub Issue #5 — "DDD-004: Propose Home Page / Post Index"

## Working Directory
/Users/ben/github/benpeter/mostly-hallucinations

## External Skill Discovery
Before analyzing the task, scan for project-local skills. If skills are
discovered, include an "External Skill Integration" section in your meta-plan.

## Instructions
1. Read relevant files to understand the codebase context
2. Discover external skills:
   a. Scan .claude/skills/ and .skills/ in the working directory for SKILL.md files
   b. Read frontmatter (name, description) for each discovered skill
   c. For skills whose description matches the task domain, classify as
      ORCHESTRATION or LEAF
   d. Check the project's CLAUDE.md for explicit skill preferences
   e. Include discovered skills in your meta-plan output
3. Analyze the task against your delegation table
4. Identify which specialists should be CONSULTED FOR PLANNING
   (not execution — planning). These are agents whose domain
   expertise is needed to create a good plan.
5. For each specialist, write a specific planning question that
   draws on their unique expertise.
6. Return the meta-plan in the structured format.
7. Write your complete meta-plan to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-uCqtZX/ddd-004-home-post-index/phase1-metaplan.md
