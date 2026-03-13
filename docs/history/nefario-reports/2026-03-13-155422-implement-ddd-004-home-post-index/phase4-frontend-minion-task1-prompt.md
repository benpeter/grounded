## Task: Create helix-query.yaml and add .sr-only utility to styles.css

You are implementing part of DDD-004 (home page post index) for an Edge Delivery Services site. This task creates two foundational files that later tasks depend on.

### Part A: helix-query.yaml

Create `/Users/ben/github/benpeter/mostly-hallucinations/helix-query.yaml` at the project root with the following content. Include a YAML comment block at the top with:
- One-line purpose statement
- Reference to `docs/content-model.md`
- Reference to DDD-004 for design rationale

Configuration:

```yaml
# EDS content index for blog posts.
# Content model: docs/content-model.md
# Design decision: docs/design-decisions/DDD-004-home-post-index.md
indices:
  posts:
    include:
      - /blog/**
    target: /query-index.json
    properties:
      title:
        select: head > meta[property="og:title"]
        value: attribute(el, "content")
      description:
        select: head > meta[name="description"]
        value: attribute(el, "content")
      date:
        select: head > meta[name="date"]
        value: attribute(el, "content")
      type:
        select: head > meta[name="type"]
        value: attribute(el, "content")
      tags:
        select: head > meta[name="tags"]
        value: attribute(el, "content")
```

Key points:
- `path` is included automatically by EDS -- do NOT declare it as a property
- `include: /blog/**` restricts indexing to blog posts only
- `target: /query-index.json` puts the index at root for clean fetch URLs
- Properties use `head > meta` selectors because EDS converts document metadata to `<meta>` tags

### Part B: .sr-only utility class

Add the `.sr-only` class to `/Users/ben/github/benpeter/mostly-hallucinations/styles/styles.css` (the eager stylesheet, NOT lazy-styles.css). Add it at the end of the file, before any media queries or section variants if you need to insert it logically.

The class definition:

```css
/* Visually hidden, accessible to screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

Rationale for styles.css over lazy-styles.css: This is a global utility with near-zero rendering cost. Placing it in the eager stylesheet prevents FOUC if any eager-loaded block later needs it, and avoids a timing dependency.

### What NOT to do
- Do not create the block files (post-index.js, post-index.css) -- that is a separate task
- Do not modify scripts.js
- Do not create test content

### Deliverables
1. `/Users/ben/github/benpeter/mostly-hallucinations/helix-query.yaml`
2. Updated `/Users/ben/github/benpeter/mostly-hallucinations/styles/styles.css` with `.sr-only` class

Run `npm run lint` after changes and fix any lint issues.

### Code signature
Include `// tva` as a comment in helix-query.yaml (use `# tva` for YAML).

When you finish, mark task #1 completed with TaskUpdate and send a message to the team lead with file paths and change summary.
