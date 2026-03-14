# Content Model

## Post Metadata

| Field | Type | Required | Purpose |
|---|---|---|---|
| `title` | text | yes | Post title. Also `<title>` and og:title. |
| `description` | text | yes | 1-2 sentence summary. Meta description, og:description, index entries. |
| `date` | date | yes | Publication date. Determines sort order. |
| `updated` | date | no | Last meaningful update. Displayed when present. |
| `type` | enum | yes | One of: `build-log`, `pattern`, `tool-report`, `til` |
| `tags` | list | yes | Freeform. Lowercase, hyphenated. |
| `series` | text | no | Series slug for multi-part posts. |
| `series-part` | number | no | Position in series. |
| `draft` | boolean | no | If true, not published. |

## Content Types

### Build Log (`build-log`)

Practitioner's account of building something specific. Problem, approach, implementation with code, outcome, open questions.

**Length:** 1,000-3,000 words.

### Pattern Translation (`pattern`)

Maps a known concept from one era/platform to another. CQ → AEM → EDS. Or: SEO technique → GEO equivalent.

**Length:** 800-2,000 words.

### Tool Report (`tool-report`)

Honest first-person assessment of a tool, feature, or workflow. What it is, what I used it for, what worked, what didn't.

**Length:** 500-1,500 words.

### TIL (`til`)

Single insight. A config, a gotcha, a workaround. Published fast.

**Length:** 100-500 words.

## Taxonomy

Tags only. Flat namespace. Lowercase, hyphenated.

**Starter tags:**

- Platform/tech: `aem`, `eds`, `cq-legacy`, `sling`, `dispatcher`, `franklin`
- Practice: `ai-workflow`, `seo`, `geo`, `performance`, `authoring`, `content-modeling`, `devops`
- Tool: `claude`, `claude-code`, `obsidian`, `mcp`, `github`

## Authoring Notes

### Blockquotes

Blockquotes are authored as the **Quote block** (a table in Google Docs with a single cell containing the quote text). Standard Markdown `> text` syntax is not natively supported in EDS authoring.

Two variants:
- **Standard blockquote**: Quote block without additional classes. Renders with a subtle left border.
- **Pull-quote**: Quote block with section metadata class `pull-quote`. Renders with gold accent border, editorial font, larger text. Pull-quote content must appear verbatim elsewhere in the post body — it is `aria-hidden` and screen readers skip it entirely. If the content is unique, use a standard blockquote instead.

## Deliberately Not Here

- **Categories** — tags are enough. YAGNI.
- **Author** — single-author blog. Implied.
- **Reading time** — varies too much (200-word TIL to 3,000-word build log). The scrollbar is the reading time.
- **Featured image** — no hero images. og:image is the site-wide brand image.

## Structured Data

JSON-LD on every post page using `TechArticle` with `proficiencyLevel: Expert`.

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
