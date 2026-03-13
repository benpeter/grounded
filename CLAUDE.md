# CLAUDE.md — Grounded

See @AGENTS.md for EDS development conventions, project structure, and deployment workflow.

## What This Is

A practitioner's technical blog about enterprise web (Adobe AEM, Edge Delivery Services) and AI. Written by a senior engineer for senior engineers. The name is the thesis: in an AI-augmented practice, most of what you encounter is *mostly* hallucinated — the practitioner's job is knowing which parts are grounded.

**URL:** benpeter.dev

## Design Tokens

All colors, typography, and spacing are defined in `styles/tokens.css`. This is the single source of truth. Use the CSS custom properties — never hardcode hex values.

Key aesthetic rules:

- `--color-background` (#F6F4EE light) is the dominant visual. The page is warm white paper.
- Borders and rules use `--color-border-subtle` or `--color-border`. They almost melt into the background.
- `--color-heading` (#3F5232 light) is the strongest color on the page. Everything else recedes.
- `--color-accent` (gold) appears at most once per screen — a pull-quote border, a focus ring. Never as a theme color.
- Green and gold are NOT co-equal theme colors. This is a warm-white site where color is a quiet guest.
- No cards with shadows, no gradients, no rounded containers, no hero images, no decorative icons.
- Typography creates hierarchy, not color blocks or boxes.

## Site Structure

See `docs/site-structure.md` for header, footer, page layouts, and URL structure.

Key points:
- Header: logo + tagline, no navigation links
- Footer: `© 2026 Ben Peter · Legal Notice · Privacy Policy`
- Single-column layout, no sidebar
- Home page IS the post index

## Content Model

See `docs/content-model.md` for post types, metadata fields, taxonomy, and structured data.

Four post types: `build-log`, `pattern`, `tool-report`, `til`. Tags only, no categories.

## V1 Scope — What's NOT Shipping

Do not build these unless explicitly asked:

- RSS feed
- Site search
- Comments
- Newsletter
- Analytics / tracking scripts
- Dark mode toggle (ship `prefers-color-scheme` only — the OS is the toggle)
- Pagination (until 20+ posts)
- Related posts
- Sidebar or secondary navigation

## Performance

- Target: <100KB per text post, sub-second loads, Lighthouse 100
- No hero images, no decorative images. Images only when they carry information.
- No external dependencies beyond Google Fonts (Source Sans 3, Source Code Pro, Source Serif 4)
- Follow EDS three-phase loading: eager → lazy → delayed

## Pull Requests

Every PR that changes code served by EDS (JS, CSS, HTML, blocks) **must** include preview links in the description:

```
Test URLs:
- Before: https://main--grounded--benpeter.aem.page/
- After: https://<branch>--grounded--benpeter.aem.page/<path>
```

**Branch name in URLs**: Slashes in git branch names become dashes in EDS preview URLs. `nefario/implement-foo` → `nefario-implement-foo--grounded--benpeter.aem.page`.

The `<path>` should point to a page that demonstrates the change. This is required by the EDS review process and the PR template.

**Docs-only PRs** (markdown, design decisions, reports) are exempt — `.hlxignore` excludes `*.md` from EDS serving, so there's no preview page to link.

## Accessibility

- WCAG 2.2 AA compliance
- All color pairings in `styles/tokens.css` are verified for contrast compliance
- Semantic HTML: one `<h1>`, proper heading hierarchy, `<article>`, `<time>`
- No content conveyed by color alone
