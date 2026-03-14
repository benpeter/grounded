Implement DDD-005 Post Detail page reading experience.

The post detail page at `/blog/{slug}` renders the complete reading experience defined in DDD-005, so that individual blog posts display with correct typography, spacing, semantic HTML, and accessibility patterns — making the primary content surface of the site functional for readers.

Success criteria:
- Path-based detection (`/blog/*`) adds `body.post-detail` class in `scripts.js`
- Post header decoration produces type badge (`aria-hidden`), h1 with sr-only prefix, and metadata line (dates, tags) matching DDD-005 HTML structure
- Scoped CSS overrides for heading margins (h2 2em/0.5em, h3 1.5em/0.5em, h2+h3 collapse), paragraph spacing, code blocks, inline code, lists, tables, and horizontal rules — all within `body.post-detail` scope, global `styles.css` unchanged
- Quote block implemented with standard and pull-quote variant (gold accent border, Source Serif 4)
- Body links underlined by default within post content (inverted from global style)
- `tabindex="0"` added to `<pre>` elements for keyboard scrolling
- Code block `border-radius: 0` within post context
- All token references resolve to existing values in `styles/tokens.css` — no new tokens
- `decorateButtons()` side effect documented or scoped out of post body
- Lighthouse accessibility score maintains 100
- Local dev server renders a test post matching DDD-005 wireframes

Scope:
- In: `scripts.js` page detection, post header decoration JS, post-detail scoped CSS (new file or lazy-styles addition), Quote block (JS + CSS), `<pre>` tabindex decoration, test content for local preview
- Out: Series navigation (#24), syntax highlighting (#25), dark mode token changes, content model changes, structured data (JSON-LD), any V1 exclusions listed in CLAUDE.md

Constraints:
- All specs, token mappings, HTML structure, and CSS approach defined in `docs/design-decisions/DDD-005-post-detail.md` — this is the implementation contract
- EDS conventions: vanilla JS, no build step, no frameworks, CSP-compliant DOM construction (createElement/textContent, no innerHTML)
- Three-phase loading: eager (detection + body class), lazy (CSS + header decoration), delayed (future syntax highlighting hook only)

---
Additional context: churn through it, all approvals given. pause after PR creation only