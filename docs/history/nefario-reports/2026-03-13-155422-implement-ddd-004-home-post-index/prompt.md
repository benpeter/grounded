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
