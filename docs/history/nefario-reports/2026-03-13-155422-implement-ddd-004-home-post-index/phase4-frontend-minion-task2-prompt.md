## Task: Create the post-index block (CSS + JS)

You are implementing the post-index block for an Edge Delivery Services site per DDD-004. The design spec is at `/Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-004-home-post-index.md`. Read it first -- it is comprehensive and contains the exact DOM structure, CSS selectors, and behavior.

Create two files:
- `/Users/ben/github/benpeter/mostly-hallucinations/blocks/post-index/post-index.css`
- `/Users/ben/github/benpeter/mostly-hallucinations/blocks/post-index/post-index.js`

### post-index.css

Implement all 17 CSS selectors from DDD-004's "CSS Approach" section. Key implementation notes:

1. Block-level: `max-width: var(--measure); margin-inline: auto; padding-inline: 0` -- the EDS section wrapper (`main > .section > div`) already applies padding, so zero out padding on the block itself to avoid double-padding. Add a CSS comment explaining this: `/* EDS section wrapper handles horizontal padding */`
2. Entry separation: use `.post-index .post-entry + .post-entry` with `border-top: 1px solid var(--color-border-subtle)` and `padding-block-start: var(--section-spacing)`. This avoids border on first entry.
3. Entry bottom margin: `.post-index .post-entry` gets `margin-block-end: var(--section-spacing)`.
4. Override global h2 styles: `.post-index h2` must set `font-size: var(--heading-font-size-m)` (overrides global `--heading-font-size-xl`) and `margin-block: 0` (overrides global `margin-top: 0.8em; margin-bottom: 0.25em`).
5. Override global `p` margins: `.post-index .post-description` should have appropriate spacing.
6. Type badge: `display: block; font-family: var(--font-heading); font-size: var(--body-font-size-xs); color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; line-height: 1`.
7. Metadata line: `.post-index .post-meta` is inline flow. `.post-tags` is `display: inline; list-style: none; margin: 0; padding: 0`. Tags `li` are `display: inline`.
8. Middot separators: `.post-tags li + li::before { content: " \B7 "; color: var(--color-text-muted); }` and `.post-meta time + .post-tags::before { content: " \B7 "; color: var(--color-text-muted); }`.
9. Focus rings: `outline: 2px solid var(--color-heading); outline-offset: 2px` on `:focus-visible` for both title links and tag links.
10. No responsive media queries needed for layout -- only font sizes change via tokens.css.
11. Override global `a:any-link` and `a:hover` styles for title links: `.post-index h2 a` should use `color: inherit` (inherits --color-heading) and `.post-index h2 a:hover` should NOT change color, only add underline.

### post-index.js

The `decorate()` function must:

1. Fetch `/query-index.json`. Handle failure gracefully: if fetch fails or returns non-200, log `console.error('Post index: failed to load query-index.json', error)` and render only the sr-only h1.
2. Parse response JSON. Extract `.data` array.
3. Sort by `date` descending. Date handling: EDS may return dates as Unix timestamps (seconds since epoch -- multiply by 1000 for JS Date) or ISO strings. Implement parsing:
   ```js
   function parseDate(value) {
     if (!value) return 0;
     const num = Number(value);
     if (!Number.isNaN(num) && num > 0) {
       // Unix timestamp in seconds (EDS convention)
       return num * 1000;
     }
     return new Date(value).getTime() || 0;
   }
   ```
   NOTE: Do NOT claim to handle Excel serial numbers -- they are indistinguishable from Unix timestamps. Just handle Unix timestamps (seconds) and ISO strings.
4. Clear block content (`block.textContent = ''`).
5. Create sr-only `<h1 class="sr-only">Posts</h1>` and append to block FIRST.
6. **SECURITY: Validate entry paths before use.** For each entry, check `entry.path && entry.path.startsWith('/')` before using the path in any href. Skip entries with invalid paths (missing or not starting with `/`). This prevents open redirect if query-index.json is poisoned with external URLs.
7. For each entry in the sorted array, build an `<article>` with this exact structure (from DDD-004):

   ```html
   <article class="post-entry" aria-labelledby="post-{n}-title">
     <span class="post-type" aria-hidden="true">{Type Label}</span>
     <h2 id="post-{n}-title">
       <span class="sr-only">{Type Label}: </span>
       <a href="{path}">{title}</a>
     </h2>
     <p class="post-description">{description}</p>
     <footer class="post-meta">
       <time datetime="{YYYY-MM-DD}">{formatted date}</time>
       <ul class="post-tags">
         <li><a href="/tags/{slug}">{slug}</a></li>
       </ul>
     </footer>
   </article>
   ```

8. Type label mapping (slug to display text):
   ```js
   const TYPE_LABELS = {
     'build-log': 'Build Log',
     pattern: 'Pattern',
     'tool-report': 'Tool Report',
     til: 'TIL',
   };
   ```

9. Position-based IDs: entry at sorted index 0 gets `post-1-title`, index 1 gets `post-2-title`, etc.

10. **sr-only span text MUST end with `: ` (colon-space)** -- e.g., `'Build Log: '`. This trailing space ensures screen readers separate the type prefix from the title without relying on whitespace text nodes.

11. Format dates: `new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date)`. The `datetime` attribute uses ISO format (`YYYY-MM-DD`).

12. Tag slug validation: validate each tag slug against `/^[a-z0-9-]+$/` before using in `href`. Skip invalid slugs entirely.

13. Tags come from `query-index.json` as a comma-separated string. Split on `,` and trim each value.

14. Handle missing fields gracefully:
    - Missing `title`: skip the entire entry
    - Missing `type`: skip the badge and sr-only prefix
    - Missing `description`: skip the `<p>` element
    - Missing `date`: skip the `<time>` element (place entry at end of sort)
    - Missing `tags`: skip the `<ul>` entirely

15. Build all DOM via `document.createElement()` and `textContent`/`setAttribute()`. NO `innerHTML`. This is required for CSP compliance.

16. Empty state: if no valid entries, only the sr-only `<h1>` renders.

17. **ACCESSIBILITY NOTE**: The tag `<ul class="post-tags">` intentionally omits `aria-label`. Each article contains exactly one list, making a label redundant. Add a code comment near the tag list construction:
    ```js
    // Intentionally no aria-label on tag list -- single list per article makes it unambiguous
    ```

### Existing patterns to follow

Look at `/Users/ben/github/benpeter/mostly-hallucinations/blocks/header/header.js` for the established DOM construction pattern in this project: createElement, set properties, append children.

### What NOT to do
- Do not modify scripts.js (auto-block wiring is a separate task)
- Do not create test content
- Do not add any external dependencies
- Do not use innerHTML
- Do not add pagination, filtering, or any V1 exclusions listed in CLAUDE.md

### Deliverables
1. `/Users/ben/github/benpeter/mostly-hallucinations/blocks/post-index/post-index.css`
2. `/Users/ben/github/benpeter/mostly-hallucinations/blocks/post-index/post-index.js`

### Code signature
Include `// tva` in both files (place near imports or at top).

Run `npm run lint` after creating both files and fix any lint issues.

When you finish, mark task #2 completed with TaskUpdate and send a message to the team lead with file paths and change summary.
