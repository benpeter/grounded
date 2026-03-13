## Task: Wire post-index auto-block and create test content

You are completing the DDD-004 implementation by wiring the post-index block into the home page auto-blocking system and creating test content for verification.

### Part A: Auto-block wiring in scripts.js

Edit `/Users/ben/github/benpeter/mostly-hallucinations/scripts/scripts.js`.

Add a `buildPostIndexBlock` function before `buildAutoBlocks`:

```js
/**
 * Builds post-index block on the home page and prepends to main.
 * @param {Element} main The container element
 */
function buildPostIndexBlock(main) {
  if (window.location.pathname === '/') {
    const section = document.createElement('div');
    section.append(buildBlock('post-index', ''));
    main.prepend(section);
  }
}
```

Then call `buildPostIndexBlock(main)` inside `buildAutoBlocks()`, AFTER the `buildHeroBlock(main)` call:

```js
buildHeroBlock(main);
buildPostIndexBlock(main);
```

Key details:
- `window.location.pathname === '/'` works across localhost, .aem.page, and .aem.live environments
- The block gets an empty content cell (`''`) because data comes from the fetch
- `main.prepend(section)` ensures the post-index block is the first section
- The raw `<div>` section will be processed by `decorateSections()` which runs after `buildAutoBlocks()`

### Part B: Test content

Create test HTML files in `/Users/ben/github/benpeter/mostly-hallucinations/drafts/` to verify the block works with the local dev server (`aem up --html-folder drafts`).

Create these files:

1. `drafts/index.html` -- minimal home page (just header/footer, the auto-block will inject the post-index)
2. `drafts/blog/building-eds-design-system.html` -- test blog post with full metadata
3. `drafts/blog/claude-code-pair-programmer.html` -- second test blog post
4. `drafts/blog/eds-gotcha-source-maps.html` -- third test post (TIL type, fewer tags)
5. `drafts/query-index.json` -- mock query index fixture for local testing (EDS generates this server-side, so local dev needs a mock)

Each blog post HTML must include proper `<meta>` tags in `<head>` for:
- `<meta property="og:title" content="...">`
- `<meta name="description" content="...">`
- `<meta name="date" content="2026-03-12">` (use different dates for sort testing)
- `<meta name="type" content="build-log">` (vary across posts: build-log, tool-report, til)
- `<meta name="tags" content="aem, eds, performance">` (comma-separated)

Follow EDS markup structure. Blog posts should have a simple body with at least a heading and a paragraph.

The `drafts/query-index.json` must match the EDS query index format:
```json
{
  "data": [
    {
      "path": "/blog/building-eds-design-system",
      "title": "...",
      "description": "...",
      "date": "2026-03-12",
      "type": "build-log",
      "tags": "aem, eds, design-system"
    },
    ...
  ],
  "total": 3
}
```
Include one edge-case entry with missing/invalid fields (e.g., missing description, empty tags) to test graceful degradation.

The home page `drafts/index.html` should be minimal -- just enough for the auto-block to work:
```html
<html>
<head>
  <meta property="og:title" content="Mostly Hallucinations">
</head>
<body>
  <header></header>
  <main>
    <div></div>
  </main>
  <footer></footer>
</body>
</html>
```

### Part C: Add drafts/ to .gitignore

Check if `drafts/` is already in `.gitignore`. If not, add it. These are local test files, not deployable content.

### What NOT to do
- Do not modify the block files (post-index.js, post-index.css)
- Do not modify styles.css or lazy-styles.css

### Deliverables
1. Updated `/Users/ben/github/benpeter/mostly-hallucinations/scripts/scripts.js`
2. Test HTML files in `drafts/` directory
3. Mock `drafts/query-index.json`
4. Updated `.gitignore` with `drafts/` entry

Run `npm run lint` after changes and fix any lint issues.

When you finish, mark task #3 completed with TaskUpdate and send a message to the team lead with file paths and change summary.
