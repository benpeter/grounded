You are working in the project at `/Users/ben/github/benpeter/mostly-hallucinations`.

## Task

Create a test page at `drafts/layout-test.html` for verifying the DDD-001 layout implementation, and update the AGENTS.md project structure and CSS guidance.

## Part 1: Create `drafts/layout-test.html`

Create the `drafts/` directory if it does not exist, then create a test page that exercises all DDD-001 layout behaviors.

The HTML must follow EDS markup conventions:
- `<main>` contains bare `<div>` elements (one per section)
- Inside each `<div>`, inline content (headings, paragraphs, lists, code blocks) is placed directly
- Do NOT add EDS-specific classes like `.section` or `.default-content-wrapper` — the EDS decoration pipeline adds those
- Use a proper HTML5 document shell with `<html lang="en">`, `<head>` with `<title>`, and `<body>`

The file must include:
1. A **reading-width section** with long paragraphs to verify 68ch line length
2. A **code block section** with a very long line to test horizontal scrolling (not clipping)
3. A **mixed content section** with headings, paragraphs, and a list
4. A **two-tier demonstration section** that contains both a `.default-content-wrapper`-eligible block and a wider block — this is the only way to visually verify the two-tier model is working (a wide element demonstrates the outer layout-max tier, while the reading text demonstrates the inner measure tier)
5. A **short content section** (single paragraph) to verify section spacing isn't excessive for brief content
6. An HTML comment near the first section noting the known mobile line-length issue: at 375px with 20px padding, content is ~335px wide, yielding approximately 37-40 characters per line (below the 45-char comfortable minimum). This is deferred to DDD-005/006.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>DDD-001 Layout Test</title>
</head>
<body>
  <header></header>
  <main>
    <!-- Section 1: Reading width verification -->
    <!-- NOTE: At 375px mobile viewport (20px padding), content column is ~335px (~37-40 chars/line).
         This is below the 45-char comfortable minimum. Known issue, deferred to DDD-005/006. -->
    <div>
      <h1>Layout Test Page</h1>
      <p>A paragraph of sufficient length to verify reading width constraint.
         This text should wrap within the --measure (68ch) column at desktop
         widths and fill the viewport minus padding at mobile widths. The
         comfortable reading width is approximately 550-612px depending on
         font size. Adding more text here to ensure the paragraph is long
         enough to demonstrate line wrapping behavior at various viewport
         widths from narrow mobile to wide desktop screens.</p>
      <p>Second paragraph to verify spacing between consecutive paragraphs
         within a section. The gap should be governed by vertical rhythm
         tokens when those are implemented in DDD-005/006.</p>
    </div>

    <!-- Section 2: Code block escape hatch — long line must scroll, not clip -->
    <div>
      <h2>Code Block Overflow Test</h2>
      <p>The following code block contains a very long line that should
         scroll horizontally, not be clipped by the reading-width constraint.</p>
      <pre><code>const veryLongVariableName = someFunction(argumentOne, argumentTwo, argumentThree, argumentFour, argumentFive, argumentSix, argumentSeven) // This line is intentionally very long to test horizontal scrolling behavior within the default-content-wrapper constraint</code></pre>
      <p>Text after the code block should return to normal reading width.</p>
    </div>

    <!-- Section 3: Mixed content for spacing verification -->
    <div>
      <h2>Element Spacing Test</h2>
      <p>Paragraph before a list.</p>
      <ul>
        <li>List item one</li>
        <li>List item two</li>
        <li>List item three</li>
      </ul>
      <p>Paragraph after a list, testing element gap.</p>
      <h3>Subheading Within Section</h3>
      <p>Content under a subheading to verify heading asymmetric spacing
         (more space above heading than below).</p>
    </div>

    <!-- Section 4: Two-tier geometry demonstration -->
    <!-- This section shows both tiers: a full-width image (outer layout-max)
         and reading text (inner measure). Without a wider element, the
         two-tier model cannot be visually verified. -->
    <div>
      <h2>Two-Tier Layout Demonstration</h2>
      <p>This paragraph should be constrained to --measure (68ch) for comfortable
         reading. Notice it is narrower than the section container above and below.</p>
      <p>The section container (outer tier) extends to --layout-max (1200px),
         which becomes visible when a full-width block like an image or card
         grid is placed here. The reading column (inner tier) is --measure (68ch),
         centered within the outer container.</p>
    </div>

    <!-- Section 5: Short content (simulates TIL post) -->
    <div>
      <h2>Short Section</h2>
      <p>A single short paragraph to verify section spacing does not create
         excessive gaps for brief content.</p>
    </div>
  </main>
  <footer></footer>
</body>
</html>
```

## Part 2: Update AGENTS.md

### 2a. Add tokens.css to project structure tree

Find the `styles/` section in the project structure tree and add `tokens.css` as the first entry with a load-order annotation.

Replace:
```
├── styles/          # Global styles and CSS
    ├── styles.css          # Minimal global styling and layout for your website required for LCP
    ├── lazy-styles.css     # Additional global styling and layout for below the fold/post LCP content
    └── fonts.css           # Font definitions
```

With:
```
├── styles/          # Global styles and CSS
    ├── tokens.css          # Design tokens (loaded first -- must precede styles.css in head.html)
    ├── styles.css          # Minimal global styling and layout for your website required for LCP
    ├── lazy-styles.css     # Additional global styling and layout for below the fold/post LCP content
    └── fonts.css           # Font definitions
```

### 2b. Fix the responsive CSS guidance

Find the CSS Style Guidelines section. The current guidance says:
```
  - Declare styles mobile first, use `min-width` media queries at 600px/900px/1200px for tablet and desktop
```

Replace with:
```
  - Declare styles mobile first, use range notation media queries (`width >= 600px`, `width >= 900px`, `width >= 1200px`) for tablet and desktop. Note: `stylelint-config-standard` v40 enforces range notation — `min-width` syntax will fail lint.
```

## Verification

1. Verify `drafts/layout-test.html` exists with proper HTML5 document shell (`html`, `head`, `body`, `lang="en"`, `title`)
2. Verify file contains all 5 test sections
3. Verify `AGENTS.md` contains `tokens.css` in the project structure tree
4. Verify `AGENTS.md` responsive guidance now mentions range notation

## When done

Mark Task #5 completed with TaskUpdate. Then send a message to team-lead with:
- File paths created/changed with line counts
- 1-2 sentence summary of what was produced

## Boundaries

- Create `drafts/layout-test.html` (new file)
- Edit `AGENTS.md` (two specific sections only)
- Do NOT edit any CSS files, `head.html`, or JavaScript files
