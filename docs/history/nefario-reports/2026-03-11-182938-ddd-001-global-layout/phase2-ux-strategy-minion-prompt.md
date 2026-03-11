You are contributing to the PLANNING phase of a multi-agent project.
You are NOT executing yet — you are providing your domain expertise
to help build a comprehensive plan.

## Project Task

Create a Design Decision Document (DDD-001-global-layout.md) at docs/design-decisions/ that defines the page chrome — max content width, margins, responsive breakpoints, and section spacing — for an AEM Edge Delivery Services blog called "Mostly Hallucinations." This is a practitioner's technical blog about enterprise web and AI, written by a senior engineer for senior engineers.

Key constraints: single-column layout, no sidebar, warm white paper-like background, mobile-first CSS. The layout uses --measure (68ch) as reading width. Typography creates hierarchy, not color blocks or boxes.

## Your Planning Question

For a single-column reading-focused blog, what spacing rhythm creates the right breathing room between sections while maintaining reading flow? The tokens define:
- `--section-spacing: 48px`
- `--content-padding-mobile: 20px`
- `--content-padding-desktop: 32px`
- `--measure: 68ch` (reading width)
- `--line-height-body: 1.7`
- `--body-font-size-m: 20px` (mobile) / `18px` (desktop 900px+)

Specific questions:
(a) Are these spacing values appropriate for a long-form technical content site at 68ch measure? Should section spacing scale with viewport (fluid) or remain fixed?

(b) Should the reading width (68ch) apply uniformly to all content types (post body, post index entries, header, footer) or should some surfaces use a wider container?

(c) What vertical rhythm should the DDD establish between different content elements (headings, paragraphs, code blocks, pull-quotes) to create comfortable scanning of technical content?

(d) How much horizontal padding is needed at each breakpoint (mobile/tablet/desktop) to prevent content from feeling cramped on small screens or lost on large ones?

## Context

Read these files for full context:
- styles/tokens.css (design token values)
- docs/site-structure.md (header/footer/page layouts)
- docs/content-model.md (post types: build-log up to 3000 words, TIL 100-500 words)
- CLAUDE.md (design aesthetic rules — "warm white paper," "typography creates hierarchy")

## Instructions
1. Read relevant files to understand the current state
2. Apply your domain expertise to the planning question
3. Identify risks, dependencies, and requirements from your perspective
4. If you believe additional specialists should be involved that aren't already part of the planning, say so and explain why
5. Return your contribution in this format:

## Domain Plan Contribution: ux-strategy-minion

### Recommendations
Your expert recommendations for spacing, rhythm, and content width

### Proposed Tasks
Specific tasks that should be in the execution plan.
For each task: what to do, deliverables, dependencies

### Risks and Concerns
Things that could go wrong from your domain perspective

### Additional Agents Needed
Any specialists not yet involved who should be, and why
(or "None" if the current team is sufficient)

6. Write your complete contribution to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-lCokhB/ddd-001-global-layout/phase2-ux-strategy-minion.md
