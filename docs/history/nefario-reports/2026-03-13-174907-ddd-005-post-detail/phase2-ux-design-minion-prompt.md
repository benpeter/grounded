You are contributing to the PLANNING phase of a multi-agent project.
You are NOT executing yet — you are providing your domain expertise to help build a comprehensive plan.

## Project Task

Create DDD-005-post-detail.md — a Design Decision Document that defines the complete reading experience for individual blog posts on a technical blog (benpeter.dev). This includes: post title (h1), metadata line (type badge, date, updated date, tags), and every content element an article body can contain (headings h2/h3, paragraphs, code blocks, inline code, blockquotes, pull-quotes, lists, links). The DDD must define reading rhythm, typography specs, spacing, responsive behavior, and ASCII wireframes.

## Your Planning Question

Given the existing token set (Source Sans 3 at 20px/18px body, Source Code Pro for headings/code, Source Serif 4 for editorial/pull-quotes, 68ch measure, 1.7 line-height), what are the optimal spacing ratios for a long-form technical article?

Specifically:
1. Validate or revise DDD-001's proposed 2em above / 0.5em below for h2/h3 headings
2. Define spacing for paragraph-to-code-block transitions (above and below `<pre>` blocks)
3. Define blockquote and pull-quote indentation and vertical spacing
4. Define list item spacing (ul/ol) — both within lists and list-to-surrounding-content
5. Define heading-to-heading transitions (h2 immediately followed by h3)
6. Consider that code blocks and lists are FREQUENT in technical writing — rhythm must not break at these transitions
7. Propose the pull-quote visual treatment: left border thickness, indentation, font size relative to body

Also address:
- Should the post title (h1) use --heading-font-size-xxl (48px/42px) or a smaller size?
- How should the metadata line (type badge + date + updated + tags) relate spatially to the title above and the body below?
- What vertical rhythm creates "breathing room" between the metadata and the first body paragraph?

## Context

### Design Tokens (styles/tokens.css)
Colors: --color-background (#F6F4EE), --color-background-soft (#EFE9DD), --color-text (#3A3A33), --color-text-muted (#6F6A5E), --color-heading (#3F5232), --color-link (#5A7543), --color-accent (#D9B84A gold)
Fonts: --font-body (Source Sans 3), --font-heading (Source Code Pro), --font-code (Source Code Pro), --font-editorial (Source Serif 4)
Body sizes: --body-font-size-m (20px mobile / 18px desktop), --body-font-size-s (17px/16px), --body-font-size-xs (15px/14px)
Heading sizes: --heading-font-size-xxl (48px/42px), --heading-font-size-xl (36px/32px), --heading-font-size-l (28px/26px), --heading-font-size-m (22px/21px), --heading-font-size-s (18px/18px)
Rhythm: --line-height-body (1.7), --line-height-heading (1.25), --measure (68ch)
Spacing: --section-spacing (48px), --space-paragraph (1em), --space-element (1.5em), --content-padding-mobile (20px), --content-padding-tablet (24px), --content-padding-desktop (32px)

### DDD-001 Global Layout
Two-tier width: --layout-max (1200px) outer, --measure (68ch) inner reading column. Heading spacing proposed: 2em above, 0.5em below h2/h3. Section spacing: --section-spacing (48px). Code block escape hatch: .default-content-wrapper must NOT have overflow:hidden — code blocks scroll horizontally.

### DDD-004 Home Post Index (precedent)
Type badge: --font-heading, --body-font-size-xs, --color-text-muted, uppercase via CSS, letter-spacing 0.05em
Title link: --font-heading, --heading-font-size-m, --color-heading, weight 600
Metadata line: date + middot + tags, --body-font-size-xs, --color-text-muted / --color-link
Focus ring: outline: 2px solid var(--color-heading); outline-offset: 2px

### Aesthetic Rules (CLAUDE.md)
- Warm white paper (#F6F4EE) is the dominant visual
- --color-heading (#3F5232) is the strongest color — everything else recedes
- Gold accent appears at most once per screen — pull-quote border only
- No cards, shadows, gradients, rounded containers, decorative icons
- Typography creates hierarchy, not color blocks

### Site Structure — Single Post
URL: /blog/{slug}. Post title (h1), type label, date, tags at top. Single-column body at --measure. Code blocks on --color-background-soft. Pull-quotes: Source Serif 4, thin --color-accent left border. Series navigation when applicable.

## Instructions
1. Read relevant files to understand the current state
2. Apply your domain expertise to the planning question
3. Identify risks, dependencies, and requirements from your perspective
4. If you believe additional specialists should be involved that aren't already part of the planning, say so and explain why
5. Return your contribution in this format:

## Domain Plan Contribution: ux-design-minion

### Recommendations
<your expert recommendations for this aspect of the task>

### Proposed Tasks
<specific tasks that should be in the execution plan>
For each task: what to do, deliverables, dependencies

### Risks and Concerns
<things that could go wrong from your domain perspective>

### Additional Agents Needed
<any specialists not yet involved who should be, and why>
(or "None" if the current team is sufficient)

6. Write your complete contribution to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-40acDz/ddd-005-post-detail/phase2-ux-design-minion.md
