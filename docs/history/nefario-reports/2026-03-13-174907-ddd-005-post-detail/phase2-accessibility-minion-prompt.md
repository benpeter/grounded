You are contributing to the PLANNING phase of a multi-agent project.
You are NOT executing yet — you are providing your domain expertise to help build a comprehensive plan.

## Project Task

Create DDD-005-post-detail.md — a Design Decision Document that defines the complete reading experience for individual blog posts on a technical blog (benpeter.dev). This includes: post title (h1), metadata line (type badge, date, updated date, tags), and every content element an article body can contain (headings h2/h3, paragraphs, code blocks, inline code, blockquotes, pull-quotes, lists, links).

## Your Planning Question

For a post page with h1 title, metadata (type badge, date, updated date, tags), and body elements (h2/h3, code blocks, blockquotes, pull-quotes, lists, links) — what is the optimal semantic HTML structure?

Specifically:
1. Should the post metadata use `<footer>` (like DDD-004 entries) or a different element? Is `<header>` within `<article>` more semantically correct for the post's own metadata?
2. How should pull-quotes be marked up? `<blockquote>` with a distinguishing class? `<aside>`? `<figure>` with `<blockquote>` inside?
3. How should "updated" date relate to "published" date for screen readers? Should both be `<time>` elements? What text pattern makes the relationship clear?
4. Should `<pre><code>` blocks have any ARIA attributes? What about a language label for syntax-highlighted code?
5. What is the correct heading hierarchy? h1 = post title, h2/h3 within body — should the DDD explicitly prohibit h4+ or just recommend against it?
6. How should the type badge be handled on the post detail page? DDD-004 uses aria-hidden on the visible badge with an sr-only prefix in the h2. On the post page, h1 IS the post title — where does the type context go for screen readers?
7. What landmarks or ARIA attributes should the `<article>` element have?

## Context

### DDD-004 HTML Structure (precedent for type badge + metadata)
```html
<article class="post-entry" aria-labelledby="post-1-title">
  <span class="post-type" aria-hidden="true">Build Log</span>
  <h2 id="post-1-title">
    <span class="sr-only">Build Log: </span>
    <a href="/blog/building-eds-design-system">Building a Design System for EDS</a>
  </h2>
  <p class="post-description">...</p>
  <footer class="post-meta">
    <time datetime="2026-03-12">March 12, 2026</time>
    <ul class="post-tags">
      <li><a href="/tags/aem">aem</a></li>
    </ul>
  </footer>
</article>
```

### Content Model (docs/content-model.md)
Post types: build-log, pattern, tool-report, til
Metadata fields: title (required), description (required), date (required), updated (optional), type (required), tags (required), series (optional), series-part (optional)
Structured data: JSON-LD TechArticle with proficiencyLevel: Expert (out of scope for this DDD but informs semantic choices)

### Site Structure — Single Post
URL: /blog/{slug}. Post title (h1), type label, date, tags at top. Single-column body at --measure width. Code blocks on --color-background-soft. Pull-quotes: Source Serif 4, thin --color-accent left border. Series navigation when applicable. Updated date shown when present.

### EDS Markup Convention
EDS produces: main > .section > .default-content-wrapper (for paragraphs, headings, lists) and main > .section > .{blockname}-wrapper (for blocks). The post page body will live in .default-content-wrapper elements. Blocks like code highlighting or pull-quotes may have their own wrappers.

### Accessibility Requirements
WCAG 2.2 AA compliance required. Semantic HTML with one h1, proper heading hierarchy. All color pairings verified for contrast. No content conveyed by color alone.

## Instructions
1. Read relevant files to understand the current state
2. Apply your domain expertise to the planning question
3. Identify risks, dependencies, and requirements from your perspective
4. If you believe additional specialists should be involved that aren't already part of the planning, say so and explain why
5. Return your contribution in this format:

## Domain Plan Contribution: accessibility-minion

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

6. Write your complete contribution to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-40acDz/ddd-005-post-detail/phase2-accessibility-minion.md
