MODE: META-PLAN

You are creating a meta-plan — a plan for who should help plan.

## Task

<github-issue>
**Outcome**: The home page displays posts as a reverse-chronological list, implementing the design contract defined in `docs/design-decisions/DDD-004-home-post-index.md`. Visitors landing on the site see an index of all published posts with type badge, title, description, date, and tags per entry — the primary navigation surface for the blog.

**Success criteria**:
- `blocks/post-index/post-index.js` and `blocks/post-index/post-index.css` exist and follow EDS block conventions
- `helix-query.yaml` exists at project root with columns: `path`, `title`, `description`, `date`, `type`, `tags` and include path `/blog/**`
- Home page renders post entries matching the decorated DOM structure in DDD-004 (article > type badge + h2 + description + footer with time and tag list)
- All design tokens map to existing CSS custom properties per DDD-004's Token Usage table — no new tokens
- Type badges render as uppercase text-only labels via CSS `text-transform` with identical treatment for all four types
- Tag slugs validated against `/^[a-z0-9-]+$/` before use in href attributes
- DOM built via `createElement()`/`textContent`/`setAttribute` — no `innerHTML`
- Visually hidden `<h1>` appears first in `<main>` DOM order
- Focus indicators match DDD-002/DDD-003 pattern: `outline: 2px solid var(--color-heading); outline-offset: 2px` on `:focus-visible`
- `.sr-only` utility class defined (or verified existing) in project CSS
- Empty state: no articles rendered when query index returns zero results
- `npm run lint` passes
- Local dev server at `localhost:3000` renders the post index correctly

**Scope**:
- In: `blocks/post-index/` (JS + CSS), `helix-query.yaml`, home page wiring (auto-block or authored — resolve DDD-004 Open Question 6), `.sr-only` class if not already defined
- Out: Tag index pages (DDD-007), blog post detail pages (DDD-005), dark mode toggle, pagination, RSS, search

**Constraints**:
- All implementation decisions must conform to `docs/design-decisions/DDD-004-home-post-index.md`
- Resolve DDD-004 Open Questions during implementation (entry spacing, tag casing, description provenance, auto-block vs authored)
</github-issue>

## Working Directory
/Users/ben/github/benpeter/mostly-hallucinations

## External Skill Discovery
Before analyzing the task, scan for project-local skills. If skills are
discovered, include an "External Skill Integration" section in your meta-plan
(see your Core Knowledge for the output format).

## Instructions
1. Read relevant files to understand the codebase context
2. Discover external skills:
   a. Scan .claude/skills/ and .skills/ in the working directory for SKILL.md files
   b. Read frontmatter (name, description) for each discovered skill
   c. For skills whose description matches the task domain, classify as
      ORCHESTRATION or LEAF (see External Skill Integration in your Core Knowledge)
   d. Check the project's CLAUDE.md for explicit skill preferences
   e. Include discovered skills in your meta-plan output
3. Analyze the task against your delegation table
4. Identify which specialists should be CONSULTED FOR PLANNING
   (not execution — planning). These are agents whose domain
   expertise is needed to create a good plan.
5. For each specialist, write a specific planning question that
   draws on their unique expertise.
6. Return the meta-plan in the structured format.
7. Write your complete meta-plan to `/var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-d3ZWda/implement-ddd-004-home-post-index/phase1-metaplan.md`
