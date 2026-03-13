## Task: Add query index section to content-model.md and update DDD-004 status

You are updating documentation for the DDD-004 implementation.

### Part A: Update content-model.md

Edit `/Users/ben/github/benpeter/mostly-hallucinations/docs/content-model.md`. Add a new section titled "Query Index" after the "Structured Data" section (at the end of the file). Document:

```markdown
## Query Index

Blog post metadata is exposed to the frontend via the EDS content index. The `helix-query.yaml` file at the project root controls indexing.

**Endpoint:** `/query-index.json`

**Include path:** `/blog/**` (only blog posts are indexed)

**Indexed columns:**

| Column | Source | Notes |
|---|---|---|
| `path` | Automatic | Page URL path. Included by EDS automatically. |
| `title` | `og:title` meta tag | Page title. |
| `description` | `description` meta tag | 1-2 sentence summary. |
| `date` | `date` meta tag | Publication date. Used for sort order. |
| `type` | `type` meta tag | Post type enum. |
| `tags` | `tags` meta tag | Comma-separated tag slugs. |

Adding a new metadata field to posts requires a corresponding property entry in `helix-query.yaml` to make it available in the index.

Changes to `helix-query.yaml` take effect after EDS reindexes content (automatic on next content preview/publish).
```

### Part B: Update DDD-004 status

Edit `/Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-004-home-post-index.md`.

1. Change the status line from `Status: **Proposal**` to `Status: **Implemented**`
2. Add implementation notes to the "Reviewer Notes" section at the bottom:

```markdown
### Reviewer Notes

**Implemented** on 2026-03-13, branch `nefario/ddd-004-home-post-index`.

**Open Question resolutions:**
- OQ1 (entry spacing): Using `--section-spacing` (48px) as the initial value. Can be tuned with real content.
- OQ2 (tag casing): Tags displayed as lowercase slugs, matching the content model canonical form.
- OQ3 (tag links before DDD-007): Tags rendered as links from day one. 404s are acceptable -- the 404 page has a "Go home" link.
- OQ4 (helix-query.yaml): Configured with standard EDS property selectors. `path` automatic.
- OQ5 (.sr-only placement): Defined in `styles/styles.css` (eager) rather than `lazy-styles.css`, per accessibility review.
- OQ6 (auto-block vs authored): Auto-block via `buildPostIndexBlock()` in `scripts.js`, detecting `pathname === '/'`.
- OQ7 (description provenance): Uses `description` meta tag as authored by the writer. Not auto-extracted.
```

NOTE on DDD-004 status: The design decision was approved through the orchestrated planning process (Phases 1-3.5 with architecture review). Note this in the reviewer notes if there's a natural place.

### What NOT to do
- Do not modify any CSS, JS, or YAML files
- Do not add new documentation files -- only update existing ones
- Do not change the DDD-004 design spec content (only status and reviewer notes)

### Deliverables
1. Updated `/Users/ben/github/benpeter/mostly-hallucinations/docs/content-model.md`
2. Updated `/Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-004-home-post-index.md`

When you finish, mark task #4 completed with TaskUpdate and send a message to the team lead with file paths and change summary.
