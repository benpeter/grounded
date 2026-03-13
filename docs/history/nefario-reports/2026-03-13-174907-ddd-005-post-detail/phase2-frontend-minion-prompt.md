You are contributing to the PLANNING phase of a multi-agent project.
You are NOT executing yet — you are providing your domain expertise to help build a comprehensive plan.

## Project Task

Create DDD-005-post-detail.md — a Design Decision Document that defines the complete reading experience for individual blog posts on a technical blog built with Adobe Edge Delivery Services (EDS). This includes: post title (h1), metadata line (type badge, date, updated date, tags), and every content element an article body can contain (headings h2/h3, paragraphs, code blocks, inline code, blockquotes, pull-quotes, lists, links).

## Your Planning Question

How does EDS deliver code blocks, inline code, lists, and blockquotes in the decorated DOM? Specifically:

1. What DOM structure does EDS produce for authored code blocks? Is it `<pre><code>` or something else? Are language classes added automatically?
2. What DOM structure does EDS produce for blockquotes? Standard `<blockquote>` or wrapped differently?
3. How does EDS handle inline code (`<code>` elements)?
4. How does EDS deliver ordered and unordered lists?
5. Should code blocks break out of the 68ch measure (narrow for code) or stay within it with horizontal scroll? What is the recommended horizontal overflow strategy for `<pre>` within a max-width: 68ch container?
6. Are there EDS-specific decoration patterns that constrain the HTML structures the DDD can specify? For example, does `decorateBlock()` or `decorateButtons()` in scripts.js/aem.js modify link elements in ways the DDD needs to account for?
7. How should pull-quotes be authored in EDS? As a custom block? As specially formatted blockquotes? What block naming convention should the DDD specify?
8. What about syntax highlighting — does EDS provide it, or would a library (loaded in delayed.js) be needed?

## Context

### EDS Markup Conventions (from AGENTS.md)
- `main > .section > .default-content-wrapper` for default content (paragraphs, headings, lists)
- `main > .section > .{blockname}-wrapper` for blocks
- Blocks add styling and functionality to content via `decorate()` function
- DOM construction must use createElement/textContent, not innerHTML (CSP compliance)
- Three-phase loading: eager → lazy → delayed

### DDD-001 Code Block Note
"`.default-content-wrapper` must not have `overflow: hidden`. Code blocks inside it may contain wide pre-formatted content that should scroll horizontally rather than be clipped. The overflow behavior is managed at the `pre` element level, not the wrapper."

### Current scripts.js and aem.js
Read these files to understand what EDS decoration functions exist and how they transform authored content. Key functions to check: `decorateBlock()`, `decorateBlocks()`, `decorateButtons()`, `decorateIcons()`, `decorateSections()`, and the `buildAutoBlocks()` function.

### Design Tokens
--measure: 68ch (reading width)
--color-background-soft: #EFE9DD (code block background)
--font-code: Source Code Pro (code font)
--font-editorial: Source Serif 4 (pull-quote font)
--color-accent: #D9B84A (gold, pull-quote border only)

### Project Structure
```
blocks/          # Reusable content blocks (each: blockname/blockname.js + blockname.css)
styles/          # Global styles (tokens.css, styles.css, lazy-styles.css, fonts.css)
scripts/         # aem.js (NEVER MODIFY), scripts.js, delayed.js
```

## Instructions
1. Read the following files to understand EDS DOM patterns:
   - scripts/aem.js (core EDS library — check decoration functions)
   - scripts/scripts.js (project customizations, buildAutoBlocks)
   - styles/styles.css (current global styles)
   - styles/lazy-styles.css (lazy-loaded styles)
2. Apply your domain expertise to the planning question
3. Identify risks, dependencies, and requirements from your perspective
4. If you believe additional specialists should be involved that aren't already part of the planning, say so and explain why
5. Return your contribution in this format:

## Domain Plan Contribution: frontend-minion

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

6. Write your complete contribution to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-40acDz/ddd-005-post-detail/phase2-frontend-minion.md
