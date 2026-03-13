# DDD-005: Post Detail

Status: **Proposal**

## Context

The post detail page is the reading experience for individual blog posts at `/blog/{slug}`. It is the primary surface of the site — everything else (header, footer, index) exists to deliver readers here. The page must handle four post types ranging from 100-word TILs to 3,000-word build logs, all within a single layout that prioritizes comfortable reading of technical prose interspersed with code.

### Governing constraints

**Aesthetic rules (CLAUDE.md)**

- `--color-background` (#F6F4EE light) is the dominant visual. The page is warm white paper.
- `--color-heading` (#3F5232 light) is the strongest color on the page. Everything else recedes.
- Borders and rules use `--color-border-subtle` or `--color-border`. They almost melt into the background.
- `--color-accent` (gold) appears at most once per screen — a pull-quote border, a focus ring. Never as a theme color.
- Green and gold are NOT co-equal theme colors. This is a warm-white site where color is a quiet guest.
- No cards with shadows, no gradients, no rounded containers, no hero images, no decorative icons.
- Typography creates hierarchy, not color blocks or boxes.

**Site structure (docs/site-structure.md) — Single Post specification**

```
URL: /blog/{slug}

Reading page optimized for long-form technical content:
- Post title (h1), type label, date, tags at top
- Single-column body text at --measure width
- Code blocks on --color-background-soft
- Pull-quotes: Source Serif 4, thin --color-accent left border (the one place gold appears)
- Series navigation (prev/next) when post belongs to a series
- updated date shown when present
```

**Content model (docs/content-model.md)**

Nine metadata fields, four post types:

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | text | yes | Post title, h1, og:title |
| `description` | text | yes | Summary. Not displayed on post detail page (used in index and meta tags) |
| `date` | date | yes | Publication date |
| `updated` | date | no | Last meaningful update. Displayed when present |
| `type` | enum | yes | `build-log`, `pattern`, `tool-report`, `til` |
| `tags` | list | yes | Lowercase, hyphenated |
| `series` | text | no | Series slug for multi-part posts |
| `series-part` | number | no | Position in series |
| `draft` | boolean | no | If true, not published |

Four post types: `build-log` (1,000-3,000 words), `pattern` (800-2,000 words), `tool-report` (500-1,500 words), `til` (100-500 words).

**DDD-001 layout contract**

The two-tier width model governs all content:

1. **Outer tier**: `--layout-max` (1200px) on `main > .section > div`, with responsive padding (`--content-padding-mobile` 20px, `--content-padding-tablet` 24px, `--content-padding-desktop` 32px).
2. **Inner tier**: `--measure` (68ch) on `.default-content-wrapper`, centered within the outer tier. At `--body-font-size-m` (18-20px), 68ch resolves to approximately 550-612px.

Code block escape hatch: `.default-content-wrapper` must not have `overflow: hidden`. Wide `<pre>` content scrolls horizontally at the element level.

Section spacing: `--section-spacing` (48px) between `main > .section` elements, with the first section having no top margin.

Three-tier spacing scale: `--space-paragraph` (1em), `--space-element` (1.5em), `--section-spacing` (48px).

**DDD-004 precedent (a11y patterns)**

- Type badge: `aria-hidden="true"` on the visible badge, sr-only prefix inside the heading for screen reader context. Title-case DOM text, uppercase via CSS `text-transform`.
- Focus ring: `outline: 2px solid var(--color-heading); outline-offset: 2px` on `:focus-visible`.
- `<time>` elements use ISO 8601 `datetime` attribute with human-readable text content.
- `.sr-only` utility class defined in `styles/styles.css`.

**Design tokens (styles/tokens.css)**

All tokens referenced in this document exist in `styles/tokens.css`. No new tokens are proposed. Key tokens for this surface:

- Colors: `--color-background`, `--color-background-soft`, `--color-text`, `--color-text-muted`, `--color-heading`, `--color-link`, `--color-link-hover`, `--color-border`, `--color-border-subtle`, `--color-accent`
- Typography: `--font-body`, `--font-heading`, `--font-code`, `--font-editorial`
- Sizes: `--body-font-size-m` (20px/18px), `--body-font-size-s` (17px/16px), `--body-font-size-xs` (15px/14px), `--heading-font-size-xxl` (48px/42px), `--heading-font-size-xl` (36px/32px), `--heading-font-size-l` (28px/26px), `--heading-font-size-m` (22px/21px)
- Rhythm: `--line-height-body` (1.7), `--line-height-heading` (1.25), `--measure` (68ch)
- Spacing: `--space-paragraph` (1em), `--space-element` (1.5em), `--section-spacing` (48px)

**Current global styles (styles/styles.css)**

Global heading margins are `margin-top: 0.8em; margin-bottom: 0.25em` for all h1-h6. Global paragraph/list/pre/blockquote margins are `margin-top: 0.8em; margin-bottom: 0.25em`. Global links have `text-decoration: none` by default and `text-decoration: underline` on hover. These globals must remain unchanged — post detail overrides are scoped to the post context only.

**V1 scope exclusions (CLAUDE.md)**

Not shipping: RSS feed, site search, comments, newsletter, analytics, dark mode toggle (OS is the toggle), pagination, related posts, sidebar. Series navigation is defined in the content model but rendering is deferred to a future DDD.

---

## Proposal

### Layout

The post detail page is a single column of content within `--measure` (68ch). No structural changes at any breakpoint. The page flows: post header (type badge, h1, metadata), then the authored body content (headings, paragraphs, code blocks, blockquotes, lists, horizontal rules).

All content lives within `.default-content-wrapper` elements that are already constrained to `--measure` by DDD-001. Code blocks stay within this column and scroll horizontally when content overflows.

#### Wireframe 1: Post header + opening paragraph (mobile, < 600px)

```
+-------------------------------------------+
| <-- viewport (375px) ------------------->  |
|                                            |
| <20px>                          <20px>     |
|        BUILD LOG                           |
|        --font-heading                      |
|        --body-font-size-xs                 |
|        --color-text-muted                  |
|        uppercase via CSS                   |
|                                            |
|        Building a Design                   |
|        System for Edge                     |
|        Delivery Services                   |
|        --font-heading                      |
|        --heading-font-size-xxl (48px)      |
|        --color-heading                     |
|                                            |
|        <-- 0.75em gap ---------->          |
|                                            |
|        March 12, 2026                      |
|        aem . eds . performance             |
|        --body-font-size-xs                 |
|        --color-text-muted (date)           |
|        --color-link (tags)                 |
|                                            |
|        <-- 2em gap ------------->          |
|                                            |
|        A practitioner's approach           |
|        to design tokens in Edge            |
|        Delivery Services, from             |
|        first principles to a               |
|        shipping implementation.            |
|        --font-body                         |
|        --body-font-size-m (20px)           |
|        --color-text                        |
|                                            |
+-------------------------------------------+
```

#### Wireframe 1b: Post header + opening paragraph (desktop, >= 900px)

```
+------------------------------------------------------------------------+
| <-- viewport (900px+) ----------------------------------------------->  |
|                                                                         |
| <32px>                                                      <32px>      |
|        +--------------------------------------------------+             |
|        | <-- --measure (68ch ~ 550px) ------------------> |             |
|        |                                                  |             |
|        | BUILD LOG                                        |             |
|        |                                                  |             |
|        | Building a Design System for                     |             |
|        | Edge Delivery Services                           |             |
|        | --heading-font-size-xxl (42px desktop)           |             |
|        |                                                  |             |
|        | <-- 0.75em gap ------->                          |             |
|        |                                                  |             |
|        | March 12, 2026 . aem . eds . performance         |             |
|        |                                                  |             |
|        | <-- 2em gap ---------->                          |             |
|        |                                                  |             |
|        | A practitioner's approach to design tokens in    |             |
|        | Edge Delivery Services, from first principles    |             |
|        | to a shipping implementation.                    |             |
|        |                                                  |             |
|        +--------------------------------------------------+             |
|                                                                         |
+------------------------------------------------------------------------+
```

#### Wireframe 2: h2 + paragraph + code block + paragraph

```
+--------------------------------------------------+
| <-- --measure (68ch) --------------------------> |
|                                                  |
| <-- 2em above h2 --->                            |
|                                                  |
| Token Architecture                               |
| --font-heading, --heading-font-size-xl           |
| --color-heading                                  |
|                                                  |
| <-- 0.5em below h2 -->                           |
|                                                  |
| The token system follows a three-tier            |
| architecture: reference tokens, semantic         |
| tokens, and component tokens.                    |
| --font-body, --body-font-size-m                  |
|                                                  |
| <-- 1.5em above pre (--space-element) -->        |
|                                                  |
| +----------------------------------------------+ |
| | :root {                                      | |
| |   --color-background: #F6F4EE;              | |
| |   --color-text: #3A3A33;                    | |
| | }                                            | |
| | --font-code, --body-font-size-s             | |
| | --color-background-soft bg                  | |
| | border-radius: 0                            | |
| | overflow-x: auto                            | |
| +----------------------------------------------+ |
|                                                  |
| <-- 1.5em below pre (--space-element) -->        |
|                                                  |
| Each tier references the one above it,           |
| creating a chain of abstraction that             |
| survives theme changes.                          |
|                                                  |
+--------------------------------------------------+
```

#### Wireframe 3: h2 immediately followed by h3 + paragraph

```
+--------------------------------------------------+
| <-- --measure (68ch) --------------------------> |
|                                                  |
| <-- 2em above h2 --->                            |
|                                                  |
| Implementation Details                           |
| --heading-font-size-xl                           |
|                                                  |
| <-- 0.25em on h3 (heading-to-heading) -->        |
|                                                  |
| Color Tokens                                     |
| --heading-font-size-l                            |
|                                                  |
| <-- 0.5em below h3 -->                           |
|                                                  |
| The color system uses OKLCH for perceptually     |
| uniform lightness. Each scale has 10 steps       |
| with consistent contrast ratios.                 |
|                                                  |
+--------------------------------------------------+
```

#### Wireframe 4: Paragraph + pull-quote + paragraph

```
+--------------------------------------------------+
| <-- --measure (68ch) --------------------------> |
|                                                  |
| The approach I landed on was deliberately        |
| simple. No build step, no framework.             |
|                                                  |
| <-- 2em above pull-quote -->                     |
|                                                  |
| +------------------------------------------------+
| |                                                |
| | 3px --color-accent left border                 |
| | padding-left: 1.5em                            |
| |                                                |
| | Most of what you encounter is mostly           |
| | hallucinated -- the practitioner's job         |
| | is knowing which parts are grounded.           |
| | --font-editorial                               |
| | --heading-font-size-m                          |
| | --color-text, line-height: 1.5                 |
| |                                                |
| +------------------------------------------------+
|                                                  |
| <-- 2em below pull-quote -->                     |
|                                                  |
| That thesis informed every design decision       |
| that followed.                                   |
|                                                  |
+--------------------------------------------------+
```

#### Wireframe 5: Paragraph + list + paragraph

```
+--------------------------------------------------+
| <-- --measure (68ch) --------------------------> |
|                                                  |
| The token system has three tiers:                |
|                                                  |
| <-- 1em above list (--space-paragraph) -->       |
|                                                  |
|   * Reference tokens (raw values)               |
|     <-- 0.35em -->                               |
|   * Semantic tokens (purpose-based aliases)      |
|     <-- 0.35em -->                               |
|   * Component tokens (scoped overrides)          |
|                                                  |
| <-- 1em below list (--space-paragraph) -->       |
|                                                  |
| Each tier builds on the one above. Changing      |
| a reference token cascades through semantic      |
| and component tokens automatically.              |
|                                                  |
+--------------------------------------------------+
```

### Typography

| Element | Font | Size token | Weight | Color token | Line-height |
|---|---|---|---|---|---|
| h1 (post title) | `--font-heading` | `--heading-font-size-xxl` (48px / 42px) | 600 | `--color-heading` | `--line-height-heading` (1.25) |
| h2 | `--font-heading` | `--heading-font-size-xl` (36px / 32px) | 600 | `--color-heading` | `--line-height-heading` (1.25) |
| h3 | `--font-heading` | `--heading-font-size-l` (28px / 26px) | 600 | `--color-heading` | `--line-height-heading` (1.25) |
| h4+ | Prohibited. Three levels of hierarchy (h1, h2, h3) are sufficient for all post types. If content needs a fourth level, restructure the outline. |
| Body paragraph | `--font-body` | `--body-font-size-m` (20px / 18px) | 400 | `--color-text` | `--line-height-body` (1.7) |
| Type badge | `--font-heading` | `--body-font-size-xs` (15px / 14px) | 400 | `--color-text-muted` | 1 |
| Date | `--font-body` | `--body-font-size-xs` (15px / 14px) | 400 | `--color-text-muted` | 1.4 |
| Updated date | `--font-body` | `--body-font-size-xs` (15px / 14px) | 400 | `--color-text-muted` | 1.4 |
| Tags | `--font-body` | `--body-font-size-xs` (15px / 14px) | 400 | `--color-link` | 1.4 |
| Inline code | `--font-code` | 0.9em (relative to parent) | 400 | inherit | inherit |
| Code block (`<pre>`) | `--font-code` | `--body-font-size-s` (17px / 16px) | 400 | `--color-text` | 1.5 |
| Blockquote text | `--font-body` | `--body-font-size-m` (20px / 18px) | 400 | `--color-text` | `--line-height-body` (1.7) |
| Pull-quote text | `--font-editorial` | `--heading-font-size-m` (22px / 21px) | 400 | `--color-text` | 1.5 |
| List items | `--font-body` | `--body-font-size-m` (20px / 18px) | 400 | `--color-text` | `--line-height-body` (1.7) |
| Body links | `--font-body` | inherit | inherit | `--color-link` | inherit |
| Table header (`<th>`) | `--font-body` | `--body-font-size-s` (17px / 16px) | 600 | `--color-heading` | `--line-height-heading` (1.25) |
| Table data (`<td>`) | `--font-body` | `--body-font-size-s` (17px / 16px) | 400 | `--color-text` | `--line-height-body` (1.7) |

**Type badge rendering**: Identical to DDD-004. DOM text is title-case ("Build Log", "Pattern", "Tool Report", "TIL"). CSS applies `text-transform: uppercase; letter-spacing: 0.05em`. Screen readers read the DOM text. The sr-only prefix inside h1 matches the badge DOM text.

**Body links**: Unlike global link styles (`text-decoration: none`), body links within post content must have `text-decoration: underline` by default per WCAG 1.4.1 (Use of Color). Links must be distinguishable from surrounding text by more than color alone. Underline is removed on hover as a micro-interaction (inverted from the global pattern). This override is scoped to post body content only.

**Inline code**: Rendered at 0.9em of the parent font size with `--color-background-soft` background and a 2px inline padding. No border-radius (consistent with the no-rounded-containers rule). The slight size reduction prevents monospace code from visually dominating the surrounding proportional text.

### Spacing & Rhythm

The post detail page requires specific spacing overrides on top of the global `0.8em / 0.25em` margins. These overrides are scoped to the post detail context and do not change the global heading/paragraph rules in `styles.css`.

| Transition | Above | Below | Token / Value | Notes |
|---|---|---|---|---|
| h1 (post title) | 0 | 0 | Hardcoded | Title is the first visible element after the type badge. No top margin needed. Bottom margin is 0 because the metadata line controls its own gap. |
| Type badge to h1 | — | 0.25em | Hardcoded | Badge and title are a visual unit. Tight vertical coupling. |
| Metadata to body | — | 2em | Hardcoded | Generous breath between post header and reading content. Signals transition from metadata to prose. |
| h2 | 2em | 0.5em | Hardcoded | Asymmetric spacing: pulls heading toward its content, away from preceding block. Overrides global `0.8em / 0.25em`. |
| h3 | 1.5em | 0.5em | Hardcoded | Slightly less top breathing than h2 to signal subordinate hierarchy. |
| h2 + h3 (adjacent headings) | — | 0.25em on h3 | Hardcoded | When h3 immediately follows h2, h3 top margin collapses to 0.25em. The h2 already created the section break; the h3 is a subsection opener, not a new section. |
| Paragraph | 1em | 0 | `--space-paragraph` / 0 | Standard paragraph rhythm. Top margin only; adjacent paragraphs stack with 1em between them via the next paragraph's top margin. |
| `<pre>` (code block) | 1.5em | 1.5em | `--space-element` | Symmetric spacing. Code blocks are distinct visual elements that need separation from prose flow. |
| Blockquote (standard) | 1.5em | 1.5em | `--space-element` | Symmetric spacing, same as code blocks. |
| Pull-quote | 2em | 2em | Hardcoded | More generous spacing than standard blockquotes. Pull-quotes are decorative emphasis — extra breathing room reinforces their visual weight. |
| `<ul>` / `<ol>` | 1em | 1em | `--space-paragraph` | Lists flow with the same rhythm as paragraphs. |
| `<li>` | — | 0.35em | Hardcoded | Tight spacing between list items. Enough to distinguish items; not so much that the list loses cohesion. |
| `<hr>` | 2em | 2em | Hardcoded | Horizontal rules signal major thematic breaks. Generous symmetric spacing. |
| `<table>` | 1.5em | 1.5em | `--space-element` | Tables are distinct visual elements, treated like code blocks. |

**Critical implementation note**: The global `styles.css` sets `margin-top: 0.8em; margin-bottom: 0.25em` on all headings and on `p, dl, ol, ul, pre, blockquote`. The post detail overrides documented above must be applied only within the post detail context. The scoping strategy is defined in the CSS Approach section.

### Responsive Behavior

No structural changes across breakpoints. The post detail page is always a single column within `--measure`. What changes:

| Breakpoint | Inline padding | Font sizes | Notes |
|---|---|---|---|
| < 600px | `--content-padding-mobile` (20px) | Mobile token values (larger: 20px body, 48px h1) | Content fills viewport minus padding. `--measure` does not constrain yet because 375px - 40px = 335px < 550px (68ch at 20px). |
| >= 600px | `--content-padding-tablet` (24px) | Same as mobile | Transition zone. `--measure` begins to take effect as viewport widens. |
| >= 900px | `--content-padding-desktop` (32px) | Desktop token values (tighter: 18px body, 42px h1) | `--measure` always constrains. Reading column centered within `--layout-max`. |

**Mobile blockquote concern**: At 375px viewport with 20px padding, 335px is available for content. A blockquote with left border (3px) and padding-left (1.5em = ~30px at 20px) reduces the text column to approximately 302px. At 20px body text this yields roughly 34 characters per line — below the recommended 45-character minimum for comfortable reading. This is an acceptable tradeoff for V1: blockquotes are infrequent in technical posts, and the alternative (removing the left border on mobile) loses the visual signal. See Open Question 2.

**Pull-quote on mobile**: At the same 302px text column, pull-quote text at `--heading-font-size-m` (22px) yields approximately 16-18 characters per line. This is very narrow but acceptable because pull-quotes are short excerpts (typically one sentence) and the larger type + editorial font create a clear visual break even at narrow widths.

### Interactions

| Interaction | Behavior |
|---|---|
| **Focus ring (all interactive elements)** | `outline: 2px solid var(--color-heading); outline-offset: 2px` on `:focus-visible`. Matches DDD-002/003/004 convention. `--color-heading` achieves 7.75:1 on `--color-background` (light) and 10.42:1 (dark). |
| **Body links (default)** | `color: var(--color-link); text-decoration: underline`. Underline by default per WCAG 1.4.1 — links in body text must be distinguishable by more than color alone. |
| **Body links (hover)** | `color: var(--color-link-hover); text-decoration: none`. Underline removed on hover as micro-interaction. |
| **Tag links (default)** | `color: var(--color-link); text-decoration: none`. Tags are metadata, not body content — visual treatment matches DDD-004 index tags. |
| **Tag links (hover)** | `text-decoration: underline`. Color unchanged. |
| **Tag link contrast** | `--color-link` (#5A7543) vs `--color-text-muted` (#6F6A5E): these are adjacent in the metadata line. The visual distinction relies on color difference (green vs warm gray) rather than contrast ratio between them. Both individually meet 4.5:1 contrast against `--color-background`. Tags are also interactive (cursor: pointer, hover underline) which provides a non-color affordance. |
| **Code block keyboard scrolling** | `<pre tabindex="0">` makes code blocks keyboard-focusable. When focused, arrow keys scroll horizontally for wide content. Focus ring applies per standard `:focus-visible`. |
| **Dark mode** | All visual changes handled by token overrides in `tokens.css` `@media (prefers-color-scheme: dark)` block. No structural or layout changes. Pull-quote `--color-accent` border is unchanged in dark mode (gold reads well on both backgrounds). |
| **`prefers-reduced-motion`** | No animations proposed for V1. No action required. |

---

## HTML Structure

The post detail page is standard EDS default content — headings, paragraphs, lists, code blocks — decorated by the EDS engine into `.default-content-wrapper` elements within `.section` containers. The post header metadata is the only part that requires custom block decoration.

### Full page structure after EDS decoration

```html
<main>
  <!-- Section 1: Post header (first section of the page) -->
  <div class="section">
    <div class="default-content-wrapper">

      <!-- Type badge: aria-hidden, uppercase via CSS.
           Matches DDD-004 pattern. Injected before h1 by decoration JS. -->
      <p class="post-type" aria-hidden="true">Build Log</p>

      <!-- h1: sr-only prefix provides type context for screen readers.
           aria-labelledby on <article> points here.
           "Build Log: " matches visible badge DOM text (WCAG 2.5.3). -->
      <h1 id="post-title">
        <span class="sr-only">Build Log: </span>
        Building a Design System for Edge Delivery Services
      </h1>

      <!-- Post metadata header. Semantic <header> within <article>
           context (the wrapping <article> is added via JS on <main>
           or detected via body class). -->
      <p class="post-meta">
        <!-- Published date: always present -->
        <time datetime="2026-03-12">March 12, 2026</time>

        <!-- Updated date: absent when not updated.
             Only rendered when the updated metadata field has a value.
             The "Updated" prefix is visible text, not sr-only,
             because the distinction matters to all readers. -->
        <span class="post-updated">
          · Updated <time datetime="2026-03-15">March 15, 2026</time>
        </span>

        <!-- Tags: inline list with middot separators -->
        <span class="post-tags-inline">
          · <a href="/tags/aem">aem</a>
          · <a href="/tags/eds">eds</a>
          · <a href="/tags/performance">performance</a>
        </span>
      </p>

    </div>
  </div>

  <!-- Section 2+: Post body content (authored in CMS) -->
  <div class="section">
    <div class="default-content-wrapper">

      <h2>Token Architecture</h2>

      <p>The token system follows a three-tier architecture:
      reference tokens, semantic tokens, and component tokens.</p>

      <!-- Code blocks: tabindex="0" for keyboard scrolling.
           No syntax highlighting in V1.
           border-radius: 0 (no rounded containers).
           Background: --color-background-soft. -->
      <pre tabindex="0"><code>:root {
  --color-background: #F6F4EE;
  --color-text: #3A3A33;
}</code></pre>

      <p>Each tier references the one above it, creating a chain
      of abstraction that survives theme changes.</p>

      <h3>Color Tokens</h3>

      <p>The color system uses OKLCH for perceptually uniform
      lightness adjustments.</p>

    </div>
  </div>

  <!-- Standard blockquote (via EDS Quote block, table format in Google Docs) -->
  <div class="section">
    <div class="quote-wrapper">
      <div class="quote block" data-block-name="quote" data-block-status="loaded">
        <blockquote>
          <p>The EDS approach deliberately avoids build steps.</p>
        </blockquote>
      </div>
    </div>
  </div>

  <!-- Pull-quote variant (Quote block with "pull-quote" class via section metadata) -->
  <div class="section">
    <div class="quote-wrapper">
      <div class="quote pull-quote block" data-block-name="quote" data-block-status="loaded">
        <!-- aria-hidden: pull-quote content MUST exist elsewhere in the
             post body. The pull-quote is decorative repetition.
             Screen readers skip it to avoid double-reading. -->
        <figure aria-hidden="true">
          <blockquote>
            <p>Most of what you encounter is mostly hallucinated —
            the practitioner's job is knowing which parts are grounded.</p>
          </blockquote>
        </figure>
      </div>
    </div>
  </div>

  <!-- Lists: standard EDS default content -->
  <div class="section">
    <div class="default-content-wrapper">

      <p>The token system has three tiers:</p>

      <ul>
        <li>Reference tokens (raw values)</li>
        <li>Semantic tokens (purpose-based aliases)</li>
        <li>Component tokens (scoped overrides)</li>
      </ul>

      <p>Each tier builds on the one above.</p>

    </div>
  </div>

</main>
```

### Key HTML decisions

1. **`<article>` wrapper**: The `<article>` element with `aria-labelledby="post-title"` wraps the entire post content. In EDS, `<main>` is the outermost content element. The `<article>` role is added via JS — either by wrapping `<main>` children or by adding `role="article"` and `aria-labelledby` to `<main>` itself. See Open Question 5 for detection mechanism.

2. **Post metadata in `<header>`**: The type badge, h1, and metadata line form the post header. In the HTML above they are shown as a `<p class="post-meta">` for simplicity. An implementation could wrap them in a `<header>` element within the `<article>`, but since EDS generates `.default-content-wrapper` around all default content including h1 and the metadata paragraph, the decoration JS would need to restructure DOM to create a semantic `<header>`. The metadata paragraph approach is simpler and semantically adequate — the heading establishes the article context.

3. **Type badge: `<p>` with `aria-hidden="true"`**: The badge is a paragraph injected before h1 by decoration JS. `aria-hidden` prevents screen readers from announcing the type twice (the sr-only span inside h1 carries the type context for heading navigation).

4. **Dates as `<time>` elements**: Both published and updated dates use `<time>` with ISO 8601 `datetime` attributes. The updated date container (`.post-updated`) is absent from the DOM when the `updated` metadata field is not set — not present but hidden.

5. **Pull-quote as `<figure aria-hidden="true">`**: Pull-quotes repeat content that exists elsewhere in the post. The `aria-hidden` attribute prevents screen readers from reading the same sentence twice. The `<figure>` element semantically marks it as a self-contained illustration pulled from the flow. **Content discipline**: every pull-quote sentence must appear verbatim in the post body.

6. **Code blocks: `<pre tabindex="0"><code>`**: `tabindex="0"` makes code blocks keyboard-focusable for horizontal scrolling. No syntax highlighting in V1. No border-radius (consistent with the no-rounded-containers rule).

7. **Blockquotes require the Quote block**: In EDS, blockquotes are authored as tables (the "Quote" block format in Google Docs). They render as `.quote-wrapper > .quote.block > blockquote`. Standard markdown-style blockquotes (`> text`) are not natively supported in EDS authoring. The quote block CSS is part of this DDD's scope.

8. **h1/h2/h3 only**: h4, h5, h6 are prohibited in post content. The type scale and spacing rules are designed for three levels. If content needs a fourth level, the outline should be restructured.

9. **`decorateButtons()` side effect**: The EDS boilerplate's `decorateButtons()` function converts standalone links (links that are the sole content of a paragraph) into `.button` styled elements. In post body content, this is usually undesirable — a paragraph containing only a link (e.g., a reference URL) should remain a plain link, not become a button. The implementation must either: (a) scope `decorateButtons()` to exclude post body sections, or (b) accept the side effect and override `.button` styles within post context. See Open Question 5.

---

## CSS Approach

### 1. Scoping strategy

Post detail overrides must not affect global styles. Two viable scoping approaches:

**Option A: Body class** — Decoration JS adds a class to `<body>` (e.g., `body.post-detail`) when the page is a blog post. All post-specific CSS selectors are prefixed with `body.post-detail`. This is the simplest approach and aligns with EDS conventions where page-type detection drives decoration.

**Option B: Attribute on main** — `<main data-page-type="post">`. Selectors prefix with `main[data-page-type="post"]`.

Recommendation: **Option A** (`body.post-detail`). Detection logic is documented in Open Question 5.

### 2. Global heading margins: unchanged

The global `h1-h6 { margin-top: 0.8em; margin-bottom: 0.25em }` in `styles.css` remains untouched. Post detail heading spacing is applied via:

```css
body.post-detail .default-content-wrapper h2 {
  margin-top: 2em;
  margin-bottom: 0.5em;
}

body.post-detail .default-content-wrapper h3 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

/* Adjacent heading collapse */
body.post-detail .default-content-wrapper h2 + h3 {
  margin-top: 0.25em;
}
```

### 3. Code block styling

```css
body.post-detail pre {
  border-radius: 0;        /* No rounded containers */
  tabindex: /* set via HTML attribute, not CSS */
}
```

The global `pre` styles in `styles.css` already set `background-color: var(--color-background-soft)`, `padding: 16px`, `overflow-x: auto`, and `white-space: pre`. No override needed for those properties.

### 4. Quote block CSS

**Standard blockquote** (`.quote` block without `.pull-quote` class):

- Left border: `3px solid var(--color-border)` (subtle, structural)
- Padding-left: `1.5em`
- No background fill
- Text style: body font at body size (unchanged from surrounding prose)

**Pull-quote** (`.quote.pull-quote` block):

- Left border: `3px solid var(--color-accent)` (gold — the one place it appears)
- Padding-left: `1.5em`
- No background fill
- Text: `--font-editorial`, `--heading-font-size-m`, line-height 1.5
- Max-width: `var(--measure)` (same as reading column)
- `margin-inline: auto` (centered within layout)

### 5. Body link underlines

```css
body.post-detail .default-content-wrapper a:any-link {
  text-decoration: underline;
}

body.post-detail .default-content-wrapper a:hover {
  text-decoration: none;
}
```

This inverts the global link behavior (no underline default, underline on hover) for body content links. Metadata links (tags in the post header) are not in `.default-content-wrapper` after decoration, so they retain the global behavior.

**Correction**: Metadata links ARE in `.default-content-wrapper` because the post header is default content. The scoping must be more specific — either target `body.post-detail .default-content-wrapper p:not(.post-meta) a` or exclude `.post-meta a` and `.post-type a` explicitly. The implementing agent should choose the selector that best fits the final DOM structure.

### 6. Spacing tokens

Use `--space-paragraph` (1em) and `--space-element` (1.5em) for standard spacing. Hardcode values only where the spacing table specifies a value outside the token scale (0.75em metadata gap, 2em below metadata, 0.25em adjacent heading collapse, 0.35em list item gap, 2em pull-quote spacing, 2em hr spacing).

---

## Token Usage

| Element | Property | Token | Notes |
|---|---|---|---|
| Post title (h1) | `font-family` | `--font-heading` | Existing |
| Post title (h1) | `font-size` | `--heading-font-size-xxl` | Existing. 48px mobile / 42px desktop. |
| Post title (h1) | `color` | `--color-heading` | Existing |
| Post title (h1) | `line-height` | `--line-height-heading` | Existing |
| Type badge | `font-family` | `--font-heading` | Existing |
| Type badge | `font-size` | `--body-font-size-xs` | Existing |
| Type badge | `color` | `--color-text-muted` | Existing |
| Type badge | `letter-spacing` | `0.05em` | Hardcoded. Universal typographic value, no semantic token. |
| Dates | `font-size` | `--body-font-size-xs` | Existing |
| Dates | `color` | `--color-text-muted` | Existing |
| Tag links | `font-size` | `--body-font-size-xs` | Existing |
| Tag links | `color` | `--color-link` | Existing |
| Tag links (hover) | `color` | `--color-link-hover` | Existing |
| Body paragraphs | `font-family` | `--font-body` | Existing (inherited from body) |
| Body paragraphs | `font-size` | `--body-font-size-m` | Existing (inherited from body) |
| Body paragraphs | `color` | `--color-text` | Existing (inherited from body) |
| Body paragraphs | `line-height` | `--line-height-body` | Existing (inherited from body) |
| Body links | `color` | `--color-link` | Existing |
| Body links (hover) | `color` | `--color-link-hover` | Existing |
| h2 | `font-family` | `--font-heading` | Existing (inherited from global h2) |
| h2 | `font-size` | `--heading-font-size-xl` | Existing (inherited from global h2) |
| h2 | `color` | `--color-heading` | Existing |
| h3 | `font-family` | `--font-heading` | Existing (inherited from global h3) |
| h3 | `font-size` | `--heading-font-size-l` | Existing (inherited from global h3) |
| h3 | `color` | `--color-heading` | Existing |
| Inline code | `font-family` | `--font-code` | Existing |
| Inline code | `font-size` | `0.9em` | Hardcoded. Relative to parent — must track parent size, not a fixed token. |
| Inline code | `background-color` | `--color-background-soft` | Existing |
| Code block (`<pre>`) | `font-family` | `--font-code` | Existing (inherited from global pre) |
| Code block (`<pre>`) | `font-size` | `--body-font-size-s` | Existing (inherited from global code/pre) |
| Code block (`<pre>`) | `background-color` | `--color-background-soft` | Existing (inherited from global pre) |
| Code block (`<pre>`) | `padding` | `16px` | Hardcoded. Inherited from global pre. |
| Blockquote border | `border-left-color` | `--color-border` | Existing |
| Blockquote border | `border-left-width` | `3px` | Hardcoded. |
| Pull-quote border | `border-left-color` | `--color-accent` | Existing. The one place gold appears. |
| Pull-quote border | `border-left-width` | `3px` | Hardcoded. |
| Pull-quote text | `font-family` | `--font-editorial` | Existing |
| Pull-quote text | `font-size` | `--heading-font-size-m` | Existing |
| Pull-quote text | `color` | `--color-text` | Existing |
| Table header | `font-size` | `--body-font-size-s` | Existing |
| Table header | `color` | `--color-heading` | Existing |
| Table data | `font-size` | `--body-font-size-s` | Existing |
| Table data | `color` | `--color-text` | Existing |
| Table border | `border-color` | `--color-border-subtle` | Existing |
| Horizontal rule | `border-color` | `--color-border-subtle` | Existing |
| Focus ring (all interactive) | `outline-color` | `--color-heading` | Existing |
| Reading column | `max-width` | `--measure` | Existing |
| Section spacing | `margin-block` | `--section-spacing` | Existing |
| Paragraph spacing | `margin-top` | `--space-paragraph` | Existing |
| Element spacing | `margin-block` | `--space-element` | Existing |
| Mobile padding | `padding-inline` | `--content-padding-mobile` | Existing |
| Tablet padding | `padding-inline` | `--content-padding-tablet` | Existing |
| Desktop padding | `padding-inline` | `--content-padding-desktop` | Existing |

No new tokens proposed. All hardcoded values are noted with rationale.

---

## Open Questions

1. **DDD-005 vs DDD-006 scope boundary**
The DDD inventory (README.md) lists DDD-005 as "Post Detail" and DDD-006 as "Typography & Code" with a dependency on 005. This DDD defines typography specifications, code block styling, and blockquote patterns as part of the post detail surface because these elements are inseparable from the reading experience. If DDD-006 is still needed, its scope could focus on global typography refinements that apply outside post detail (e.g., legal pages) or on future additions like syntax highlighting and table-of-contents. Alternatively, DDD-006 could be retired as "covered by DDD-005."

2. **Mobile blockquote line length**
At 375px viewport, blockquotes render at approximately 34 characters per line (302px text column after border and padding). This is below the 45-character recommended minimum. Options: (a) accept for V1 — blockquotes are infrequent in technical posts; (b) reduce padding-left on mobile; (c) remove left border on mobile and use background tint instead. Recommendation: accept for V1, revisit with real content.

3. **Series metadata: parsed but not rendered V1**
The content model defines `series` and `series-part` fields. The post detail page should parse these from metadata (making them available for future use) but not render series navigation in V1. A future DDD will define the series nav component (prev/next links, series name, part indicator). The implementation should store parsed series metadata in a way that's accessible to future decoration JS without requiring DOM changes.

4. **Syntax highlighting language convention**
V1 ships without syntax highlighting. When syntax highlighting is added (likely via Prism.js), the convention for language classes on `<code>` elements should be `class="language-{lang}"` (the Prism default). EDS does not automatically add language classes — this will need decoration JS or author convention (e.g., marking language in the first line of the code block). Defer to the implementing DDD.

5. **Post-detail page detection mechanism**
The CSS scoping strategy requires detecting that the current page is a blog post. Options:
   - **Path-based**: `window.location.pathname.startsWith('/blog/')` in `scripts.js`, adds `body.post-detail` class.
   - **Metadata-based**: Check for presence of `type` meta tag (only blog posts have it).
   - **Template-based**: EDS template metadata on the page.
   The recommendation is path-based detection as it is simplest and aligns with the URL structure (`/blog/{slug}`). This also determines where `decorateButtons()` exclusion logic lives.

6. **68ch = approximately 40-45 monospace characters for code**
`--measure: 68ch` is calculated relative to `--font-body` (Source Sans 3). Code blocks use `--font-code` (Source Code Pro), which is monospace and wider per character. At 68ch of Source Sans 3, a code block fits approximately 40-45 monospace characters before horizontal scrolling triggers. This is adequate for most code samples but may clip longer lines (e.g., full import statements, long variable names). The horizontal scroll behavior (per DDD-001's escape hatch) handles overflow gracefully.

---

## Decision

- [ ] Approved
- [ ] Approved with changes
- [ ] Rejected

### Reviewer Notes

_{Human writes here during review}_
