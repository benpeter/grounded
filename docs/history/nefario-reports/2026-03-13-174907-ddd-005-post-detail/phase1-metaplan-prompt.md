MODE: META-PLAN

You are creating a meta-plan — a plan for who should help plan.

## Task

<github-issue>
A Design Decision Document (DDD-005-post-detail.md) exists at docs/design-decisions/ that defines the complete reading experience for individual blog posts — title, metadata, and every content element an article body can contain — so that implementation agents can build a cohesive, typographically precise post page.

Success criteria:
- DDD-005-post-detail.md exists at docs/design-decisions/ with all required sections per the DDD format
- Title (h1), metadata line (type badge, date, updated date, tags), and article body are all defined
- Every body element has typography specs: headings (h2/h3), paragraphs, code blocks, inline code, blockquotes, pull-quotes, lists, links
- Reading rhythm defined: line height, measure (68ch), paragraph spacing, heading spacing
- Pull-quotes use gold accent border (--color-accent) and Source Serif 4 (--font-editorial)
- Code blocks use Source Code Pro (--font-code) with warm cream background
- No sidebar, no table of contents, no author bio, no related posts
- ASCII wireframe shows the full post layout at mobile and desktop
- HTML Structure uses semantic markup (article, h1, time, heading hierarchy) consistent with docs/content-model.md
- Token Usage table maps every element to CSS custom properties from styles/tokens.css
- Status is set to "Proposal"

Scope:
- In: Post title, metadata display, all article body content elements (headings, paragraphs, code, blockquotes, pull-quotes, lists, links), reading rhythm, responsive behavior
- Out: Home page / post index (DDD-004), tag index (DDD-007), global layout (DDD-001), dark mode (DDD-008), JSON-LD structured data, actual implementation

Constraints:
- Content model defined in docs/content-model.md (metadata fields, post types)
- Reading measure is 68ch (--measure token)
- Source Code Pro for code, Source Serif 4 for pull-quotes, Source Sans 3 for body
- Gold accent (--color-accent) appears at most once per screen — pull-quote border only
- Output format must match docs/design-decisions/README.md template exactly
</github-issue>

## Working Directory
/Users/ben/github/benpeter/mostly-hallucinations

## External Skill Discovery
Before analyzing the task, scan for project-local skills. If skills are discovered, include an "External Skill Integration" section in your meta-plan (see your Core Knowledge for the output format).

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
7. Write your complete meta-plan to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-40acDz/ddd-005-post-detail/phase1-metaplan.md

## Key Context (pre-loaded to save agent reads)

### DDD Template (docs/design-decisions/README.md)
Required sections: Context, Proposal (Layout, Typography, Spacing & Rhythm, Responsive Behavior, Interactions optional), HTML Structure, CSS Approach, Token Usage, Open Questions optional, Decision.

### Existing DDDs
- DDD-001-global-layout.md (Implemented) — two-tier width model, --layout-max / --measure
- DDD-002-header.md (Implemented) — logo + tagline
- DDD-003-footer.md (Implemented) — copyright line
- DDD-004-home-post-index.md (Implemented) — post list, type badges, metadata line

### Design Tokens (styles/tokens.css)
Colors: --color-background (#F6F4EE), --color-background-soft (#EFE9DD), --color-text (#3A3A33), --color-text-muted (#6F6A5E), --color-heading (#3F5232), --color-link (#5A7543), --color-accent (#D9B84A)
Fonts: --font-body (Source Sans 3), --font-heading (Source Code Pro), --font-code (Source Code Pro), --font-editorial (Source Serif 4)
Sizes: body-font-size-m (20px/18px), body-font-size-s (17px/16px), body-font-size-xs (15px/14px), heading sizes xxl through xs
Rhythm: --line-height-body (1.7), --line-height-heading (1.25), --measure (68ch)
Spacing: --section-spacing (48px), --space-paragraph (1em), --space-element (1.5em)

### Content Model (docs/content-model.md)
Post types: build-log, pattern, tool-report, til
Metadata: title, description, date, updated, type, tags, series, series-part, draft

### Site Structure — Single Post
URL: /blog/{slug}. Reading page optimized for long-form technical content. Post title (h1), type label, date, tags at top. Single-column body at --measure. Code blocks on --color-background-soft. Pull-quotes: Source Serif 4, thin --color-accent left border. Series navigation when applicable. Updated date shown when present.

### Surface Inventory Note
DDD-005 (Post Detail) depends on DDD-001 (Global Layout). DDD-006 (Typography & Code) depends on DDD-005. The issue scope covers what was originally split between DDD-005 and DDD-006 — the issue explicitly asks for all body elements including code blocks, pull-quotes, and lists.
