# Site Structure

## Header

```
Mostly Hallucinations
Generated, meet grounded.
```

Logo text + tagline. No navigation links. The header links home and that's it.

- Logo: "Mostly Hallucinations" in Source Code Pro, `--color-heading`
- Tagline: "Generated, meet grounded." in lighter weight or `--color-text-muted`

## Footer

```
© 2026 Ben Peter · LinkedIn · Legal Notice · Privacy Policy
```

- "Ben Peter" and "LinkedIn" are separate text links
- LinkedIn sits next to the author's name as the single social link
- No icons
- Legal Notice and Privacy Policy are required (German law: DDG §5, DSGVO)
- Separate pages, linked from footer, not indexed

No bio. No headshot. No "about the author" section.

## Pages

### Home (Post Index)

URL: `/`

The home page IS the post index. Latest posts, reverse chronological. Each entry shows:

- **Type label** (build-log, pattern, tool-report, til) — small, muted, unobtrusive
- **Title** — primary visual element per entry
- **Description** — 1-2 sentences, body text weight
- **Date** — muted
- **Tags** — small, clickable, visually quiet

Entries separated by breathing room and perhaps the faintest rule line (`--color-border-subtle`). Not cards, boxes, or backgrounds.

No pagination until 20+ posts.

### Single Post

URL: `/blog/{slug}`

Reading page optimized for long-form technical content:

- Post title (h1), type label, date, tags at top
- Single-column body text at `--measure` width
- Code blocks on `--color-background-soft`
- Pull-quotes: Source Serif 4, thin `--color-accent` left border (the one place gold appears)
- Series navigation (prev/next) when post belongs to a series
- `updated` date shown when present

### Tag Index

URL: `/tags/{tag}`

Auto-generated page listing posts with that tag, sorted by date. No editorial content — just the filtered list. Reachable via tag links on posts and index entries.

### Legal Pages

- `/legal` — Legal Notice (Impressum)
- `/privacy` — Privacy Policy

Required under German law. Not indexed.

## URL Structure

```
/                    → Home (latest posts)
/blog/{slug}         → Individual post
/tags/{tag}          → Tag index page
```

Slugs derived from titles, manually overrideable. Short, descriptive, no dates in URLs.
