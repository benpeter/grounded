## Delegation Plan

**Team name**: ddd-001-global-layout
**Description**: Implement the approved DDD-001 global layout CSS contract -- two-tier width model, responsive padding, section spacing, boilerplate variable replacement, and block CSS audit.

### Task 1: Add layout tokens to `tokens.css` and fix lint errors
- **Agent**: frontend-minion
- **Delegation type**: standard
- **Model**: sonnet
- **Mode**: bypassPermissions
- **Blocked by**: none
- **Approval gate**: no
- **Prompt**: |
    You are working in the project at `/Users/ben/github/benpeter/mostly-hallucinations`.

    ## Task

    Add four proposed layout tokens to `styles/tokens.css` and fix the five pre-existing Stylelint errors in the same file.

    ## Context

    This is part of implementing DDD-001 (Global Layout). `tokens.css` is the single source of truth for design tokens. It currently passes no lint check -- there are 5 Stylelint errors. You must fix those AND add the new tokens so `styles/tokens.css` lints cleanly.

    ## Edits

    ### 1. Update file header comment (line 5)

    Replace:
    ```
     * Import this at the top of styles.css: @import url('tokens.css');
    ```
    With:
    ```
     * Loaded via <link> in head.html before styles.css.
    ```

    ### 2. Add four tokens to the `/* --- Spacing --- */` section

    Add these four properties after line 67 (`--content-padding-desktop: 32px;`) and before the closing `}` of the light-mode `:root` block (line 68):

    ```css
    --layout-max: 1200px;
    --content-padding-tablet: 24px;
    --space-paragraph: 1em;
    --space-element: 1.5em;
    ```

    The spacing section should end up looking like:
    ```css
    /* --- Spacing --- */

    --nav-height: 80px;
    --section-spacing: 48px;
    --content-padding-mobile: 20px;
    --content-padding-desktop: 32px;
    --layout-max: 1200px;
    --content-padding-tablet: 24px;
    --space-paragraph: 1em;
    --space-element: 1.5em;
    ```

    ### 3. Fix dark mode `:root` blank-line errors (lines 74-89)

    The Stylelint rule `custom-property-empty-line-before` forbids blank lines between consecutive custom properties (exception: after-comment is allowed). Currently the dark mode block has blank lines between property groups. Remove the blank lines between consecutive custom properties. The current dark mode block:

    ```css
    @media (prefers-color-scheme: dark) {
      :root {
        --color-background: #3A3A33;
        --color-background-soft: #3F5232;
        --color-background-tinted: #3F5232;

        --color-text: #F6F4EE;
        --color-text-muted: #C9C3B8;

        --color-heading: #F6F4EE;
        --color-link: #9FB68A;            /* Light sage — 5.3:1 contrast on dark bg */
        --color-link-hover: #F6F4EE;

        --color-border: #5F7846;
        --color-border-subtle: #4A4A42;

        /* Gold accent unchanged */
      }
    }
    ```

    Should become (blank lines removed, comment separators retained):
    ```css
    @media (prefers-color-scheme: dark) {
      :root {
        --color-background: #3A3A33;
        --color-background-soft: #3F5232;
        --color-background-tinted: #3F5232;
        --color-text: #F6F4EE;
        --color-text-muted: #C9C3B8;
        --color-heading: #F6F4EE;
        --color-link: #9FB68A;            /* Light sage — 5.3:1 contrast on dark bg */
        --color-link-hover: #F6F4EE;
        --color-border: #5F7846;
        --color-border-subtle: #4A4A42;

        /* Gold accent unchanged */
      }
    }
    ```

    ### 4. Fix desktop media query syntax (line 94)

    Replace:
    ```css
    @media (min-width: 900px) {
    ```
    With:
    ```css
    @media (width >= 900px) {
    ```

    ### 5. Fix desktop `:root` block blank-line error (line 100)

    The blank line before `--heading-font-size-xxl` inside the desktop `:root` block violates `custom-property-empty-line-before`. Remove it. The block currently:

    ```css
    @media (width >= 900px) {
      :root {
        --body-font-size-m: 18px;
        --body-font-size-s: 16px;
        --body-font-size-xs: 14px;

        --heading-font-size-xxl: 42px;
        --heading-font-size-xl: 32px;
        --heading-font-size-l: 26px;
        --heading-font-size-m: 21px;
        --heading-font-size-s: 18px;
        --heading-font-size-xs: 16px;
      }
    }
    ```

    Should become:
    ```css
    @media (width >= 900px) {
      :root {
        --body-font-size-m: 18px;
        --body-font-size-s: 16px;
        --body-font-size-xs: 14px;
        --heading-font-size-xxl: 42px;
        --heading-font-size-xl: 32px;
        --heading-font-size-l: 26px;
        --heading-font-size-m: 21px;
        --heading-font-size-s: 18px;
        --heading-font-size-xs: 16px;
      }
    }
    ```

    ## Verification

    Run: `npx stylelint styles/tokens.css`

    Must exit with zero errors.

    ## Boundaries

    - Only edit `styles/tokens.css`
    - Do NOT edit `styles/styles.css`, block CSS files, or any other files
    - Do NOT change token values that already exist -- only add new tokens and fix lint errors
- **Deliverables**: Updated `styles/tokens.css` with four new layout tokens and zero Stylelint errors
- **Success criteria**: `npx stylelint styles/tokens.css` exits 0

---

### Task 2: Add `tokens.css` link to `head.html`
- **Agent**: frontend-minion
- **Delegation type**: standard
- **Model**: sonnet
- **Mode**: bypassPermissions
- **Blocked by**: Task 1
- **Approval gate**: no
- **Prompt**: |
    You are working in the project at `/Users/ben/github/benpeter/mostly-hallucinations`.

    ## Task

    Add a `<link>` for `tokens.css` to `head.html`, before the existing `styles.css` link.

    ## Context

    DDD-001 specifies that `tokens.css` loads as a separate stylesheet in `head.html` before `styles.css`. This ensures CSS custom properties defined in `tokens.css` resolve before any layout rules in `styles.css` evaluate. The order is critical -- if `styles.css` loads first, `var()` references to tokens resolve to `initial` values and layout breaks silently.

    ## Current `head.html` (full file)

    ```html
    <meta
      http-equiv="Content-Security-Policy"
      content="script-src 'nonce-aem' 'strict-dynamic' 'unsafe-inline' http: https:; base-uri 'self'; object-src 'none';"
      move-to-http-header="true"
    >
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <script nonce="aem" src="/scripts/aem.js" type="module"></script>
    <script nonce="aem" src="/scripts/scripts.js" type="module"></script>
    <link rel="stylesheet" href="/styles/styles.css"/>
    ```

    ## Edit

    Insert one line before `<link rel="stylesheet" href="/styles/styles.css"/>`:

    ```html
    <link rel="stylesheet" href="/styles/tokens.css"/>
    ```

    The final file should have this order:
    1. CSP meta tag
    2. Viewport meta tag
    3. aem.js script
    4. scripts.js script
    5. **tokens.css link (NEW)**
    6. styles.css link

    ## Boundaries

    - Only edit `head.html`
    - Do NOT add any other links, scripts, or meta tags
    - Do NOT modify the existing styles.css link
- **Deliverables**: Updated `head.html` with `tokens.css` link before `styles.css`
- **Success criteria**: `head.html` contains `tokens.css` link on the line before the `styles.css` link

---

### Task 3: Replace boilerplate `:root`, remap all `var()` references, and implement layout rules in `styles.css`
- **Agent**: frontend-minion
- **Delegation type**: standard
- **Model**: sonnet
- **Mode**: bypassPermissions
- **Blocked by**: Task 1, Task 2
- **Approval gate**: yes
- **Gate reason**: This is the highest-risk change: deleting the boilerplate `:root` block and replacing every `var()` reference in `styles.css`. If any reference is missed, it resolves to `initial` and layout breaks silently with no console error. Hard to reverse (many simultaneous changes across the file) and all subsequent tasks depend on this being correct.
- **Prompt**: |
    You are working in the project at `/Users/ben/github/benpeter/mostly-hallucinations`.

    ## Task

    Wholesale replace the boilerplate `:root` block, Roboto `@font-face` declarations, and responsive `:root` overrides in `styles/styles.css`. Remap every `var()` reference to use project token names from `tokens.css`. Then implement the DDD-001 two-tier width model, responsive padding, and section spacing.

    ## Context

    `tokens.css` is now loaded via `<link>` in `head.html` before `styles.css`. All design tokens are defined in `tokens.css`. The boilerplate `:root` block in `styles.css` defines conflicting variable names that must be removed entirely. Every `var()` reference in `styles.css` must be updated to use the project token names.

    This project uses `stylelint-config-standard` v40, which enforces CSS Media Queries Level 4 range notation. All media queries MUST use `(width >= Npx)` syntax, NOT `(min-width: Npx)`.

    ## Phase A: Delete boilerplate blocks

    ### Delete the boilerplate `:root` block (lines 13-41)

    Remove the entire block from `:root {` through its closing `}`. This includes:
    - `--background-color`, `--light-color`, `--dark-color`, `--text-color`, `--link-color`, `--link-hover-color`
    - `--body-font-family`, `--heading-font-family`
    - `--body-font-size-*`, `--heading-font-size-*`
    - `--nav-height`

    All of these are now defined in `tokens.css` under project names.

    ### Delete both Roboto `@font-face` fallback blocks (lines 43-54)

    Remove:
    ```css
    /* fallback fonts */
    @font-face {
      font-family: roboto-condensed-fallback;
      size-adjust: 88.82%;
      src: local('Arial');
    }

    @font-face {
      font-family: roboto-fallback;
      size-adjust: 99.529%;
      src: local('Arial');
    }
    ```

    This project uses Source Sans 3 / Source Code Pro / Source Serif 4, not Roboto. These declarations are dead code.

    ### Delete the boilerplate responsive `:root` block (lines 56-71)

    Remove:
    ```css
    @media (width >= 900px) {
      :root {
        /* body sizes */
        --body-font-size-m: 18px;
        --body-font-size-s: 16px;
        --body-font-size-xs: 14px;

        /* heading sizes */
        --heading-font-size-xxl: 45px;
        --heading-font-size-xl: 36px;
        --heading-font-size-l: 28px;
        --heading-font-size-m: 22px;
        --heading-font-size-s: 20px;
        --heading-font-size-xs: 18px;
      }
    }
    ```

    The equivalent responsive overrides already exist in `tokens.css`.

    ## Phase B: Remap all `var()` references

    After deleting the boilerplate blocks, replace every `var()` reference in the remaining CSS rules using this exact mapping:

    | Current | Replacement |
    |---------|-------------|
    | `var(--background-color)` | `var(--color-background)` |
    | `var(--text-color)` | `var(--color-text)` |
    | `var(--body-font-family)` | `var(--font-body)` |
    | `var(--light-color)` | `var(--color-background-soft)` |
    | `var(--link-color)` | `var(--color-link)` |
    | `var(--link-hover-color)` | `var(--color-link-hover)` |
    | `var(--heading-font-family)` | `var(--font-heading)` |

    Variables that keep the same name (no change needed):
    - `var(--body-font-size-m)` -- same name in `tokens.css`
    - `var(--body-font-size-s)` -- same name in `tokens.css`
    - `var(--nav-height)` -- same name in `tokens.css` (value updated to 80px there)
    - `var(--heading-font-size-*)` -- same names in `tokens.css`

    Here is the complete list of lines that need `var()` replacement in the remaining rules (line numbers will shift after deleting the boilerplate blocks above -- use the content to find them, not line numbers):

    **In the `body` rule:**
    - `background-color: var(--background-color)` -> `background-color: var(--color-background)`
    - `color: var(--text-color)` -> `color: var(--color-text)`
    - `font-family: var(--body-font-family)` -> `font-family: var(--font-body)`
    - `line-height: 1.6` -> `line-height: var(--line-height-body)` (DDD-001 Token Usage table specifies this)

    **In the heading rule (h1-h6):**
    - `font-family: var(--heading-font-family)` -> `font-family: var(--font-heading)`
    - `line-height: 1.25` -> `line-height: var(--line-height-heading)` (DDD-001 Token Usage table)

    **In the `pre` rule:**
    - `background-color: var(--light-color)` -> `background-color: var(--color-background-soft)`
    - `border-radius: 8px` -> REMOVE THIS LINE entirely. DDD-001 aesthetic rules: "No rounded containers."

    **In the `a:any-link` rule:**
    - `color: var(--link-color)` -> `color: var(--color-link)`

    **In the `a:hover` rule:**
    - `color: var(--link-hover-color)` -> `color: var(--color-link-hover)`

    **In the button rules (`a.button:any-link, button`):**
    - `font-family: var(--body-font-family)` -> `font-family: var(--font-body)`
    - `background-color: var(--link-color)` -> `background-color: var(--color-link)`
    - `color: var(--background-color)` -> `color: var(--color-background)`

    **In the button hover rule:**
    - `background-color: var(--link-hover-color)` -> `background-color: var(--color-link-hover)`

    **In the disabled button rule:**
    - `background-color: var(--light-color)` -> `background-color: var(--color-background-soft)`

    **In the secondary button rule:**
    - `color: var(--text-color)` -> `color: var(--color-text)`

    ## Phase C: Implement two-tier width model, responsive padding, and section spacing

    Replace the existing section layout rules with the DDD-001 specified CSS.

    ### Update pre-decoration fallback

    Replace:
    ```css
    main > div {
      margin: 40px 16px;
    }
    ```

    With:
    ```css
    main > div {
      margin: var(--section-spacing) var(--content-padding-mobile);
    }
    ```

    This rule fires before EDS `decorateSections()` adds the `.section` class. It prevents a flash of unstyled content. Once decoration runs, the `.section` rules below take over.

    ### Replace section rules

    Replace the entire sections block (from `/* sections */` through the end of the file, including the section metadata styles):

    ```css
    /* sections */
    main > .section {
      margin: 40px 0;
    }

    main > .section > div {
      max-width: 1200px;
      margin: auto;
      padding: 0 24px;
    }

    main > .section:first-of-type {
      margin-top: 0;
    }

    @media (width >= 900px) {
      main > .section > div {
        padding: 0 32px;
      }
    }

    /* section metadata */
    main .section.light,
    main .section.highlight {
      background-color: var(--light-color);
      margin: 0;
      padding: 40px 0;
    }
    ```

    With:
    ```css
    /* Section spacing */
    main > .section {
      margin-block: var(--section-spacing);
    }

    main > .section:first-of-type {
      margin-block-start: 0;
    }

    /* Outer tier: layout max on every section container */
    main > .section > div {
      max-width: var(--layout-max);
      margin-inline: auto;
      padding-inline: var(--content-padding-mobile);
    }

    @media (width >= 600px) {
      main > .section > div {
        padding-inline: var(--content-padding-tablet);
      }
    }

    @media (width >= 900px) {
      main > .section > div {
        padding-inline: var(--content-padding-desktop);
      }
    }

    /* Inner tier: reading width on default content */
    main > .section > .default-content-wrapper {
      max-width: var(--measure);
      margin-inline: auto;
    }

    /* Section metadata variants */
    main .section.light,
    main .section.highlight {
      background-color: var(--color-background-soft);
      margin: 0;
      padding: var(--section-spacing) 0;
    }
    ```

    ## Verification

    1. Run `npx stylelint styles/styles.css` -- must exit 0.
    2. Run a project-wide grep for orphaned boilerplate variable references:
       ```
       grep -rn 'var(--background-color)\|var(--light-color)\|var(--dark-color)\|var(--text-color)\|var(--link-color)\|var(--link-hover-color)\|var(--body-font-family)\|var(--heading-font-family)' styles/styles.css
       ```
       Must return zero results.
    3. Confirm no `@import` directives: `grep -rn '@import' styles/styles.css` returns zero results.

    ## Boundaries

    - Only edit `styles/styles.css`
    - Do NOT edit `tokens.css`, `head.html`, or block CSS files (those are handled in other tasks)
    - Do NOT add `overflow: hidden` to `.default-content-wrapper`
    - Do NOT touch heading sizes, font sizes, or element-level spacing beyond what is listed above
    - Keep the Apache 2.0 license header at the top of the file
- **Deliverables**: Fully updated `styles/styles.css` with no boilerplate variables, all project tokens, and DDD-001 layout rules
- **Success criteria**: `npx stylelint styles/styles.css` passes; grep for boilerplate vars returns zero results; file retains license header

---

### Task 4: Update block CSS files to use project token names
- **Agent**: frontend-minion
- **Delegation type**: standard
- **Model**: sonnet
- **Mode**: bypassPermissions
- **Blocked by**: Task 1
- **Approval gate**: no
- **Prompt**: |
    You are working in the project at `/Users/ben/github/benpeter/mostly-hallucinations`.

    ## Task

    Update all boilerplate variable references in block CSS files to use the project token names from `tokens.css`. These block CSS files are boilerplate code that reference variables which are being removed from `styles.css`. If these references are not updated, they will resolve to CSS `initial` values and break the visual presentation.

    ## Context

    The boilerplate `:root` block in `styles.css` is being removed as part of DDD-001 implementation. Block CSS files reference those boilerplate variable names. The project tokens are defined in `styles/tokens.css`. This task updates the block CSS files so they reference the project tokens instead.

    ## Variable Mapping

    | Boilerplate variable | Project token |
    |---------------------|--------------|
    | `--background-color` | `--color-background` |
    | `--light-color` | `--color-background-soft` |
    | `--body-font-family` | `--font-body` |

    ## Files and exact changes

    ### `blocks/header/header.css`

    **Line 3**: `background-color: var(--background-color);` -> `background-color: var(--color-background);`
    **Line 21**: `font-family: var(--body-font-family);` -> `font-family: var(--font-body);`
    **Line 75**: `background-color: var(--background-color);` -> `background-color: var(--color-background);`
    **Line 248**: `background-color: var(--light-color);` -> `background-color: var(--color-background-soft);`
    **Line 261**: `border-bottom: 8px solid var(--light-color);` -> `border-bottom: 8px solid var(--color-background-soft);`

    ### `blocks/footer/footer.css`

    **Line 2**: `background-color: var(--light-color);` -> `background-color: var(--color-background-soft);`

    ### `blocks/cards/cards.css`

    **Line 12**: `background-color: var(--background-color);` -> `background-color: var(--color-background);`

    ### `blocks/hero/hero.css`

    **Line 16**: `color: var(--background-color);` -> `color: var(--color-background);`

    ## Verification

    1. Run `npx stylelint "blocks/**/*.css"` -- must exit 0.
    2. Run a project-wide grep for orphaned references:
       ```
       grep -rn 'var(--background-color)\|var(--light-color)\|var(--dark-color)\|var(--text-color)\|var(--link-color)\|var(--link-hover-color)\|var(--body-font-family)\|var(--heading-font-family)' blocks/
       ```
       Must return zero results.

    ## Boundaries

    - Only edit the four block CSS files listed above
    - Do NOT change any selectors, only `var()` references
    - Do NOT edit `styles.css`, `tokens.css`, or `head.html`
    - These blocks are boilerplate that will be replaced by project-specific blocks in later DDDs; they just need to work for now
- **Deliverables**: Updated `blocks/header/header.css`, `blocks/footer/footer.css`, `blocks/cards/cards.css`, `blocks/hero/hero.css` with project token references
- **Success criteria**: `npx stylelint "blocks/**/*.css"` passes; grep for boilerplate vars in `blocks/` returns zero results

---

### Task 5: Create drafts test content and update AGENTS.md
- **Agent**: frontend-minion
- **Delegation type**: standard
- **Model**: sonnet
- **Mode**: bypassPermissions
- **Blocked by**: Task 3, Task 4
- **Approval gate**: no
- **Prompt**: |
    You are working in the project at `/Users/ben/github/benpeter/mostly-hallucinations`.

    ## Task

    Create a test page at `drafts/layout-test.html` for verifying the DDD-001 layout implementation, and update the AGENTS.md project structure to include `tokens.css`.

    ## Part 1: Create `drafts/layout-test.html`

    Create the `drafts/` directory if it does not exist, then create a single test page that exercises all DDD-001 layout behaviors.

    The HTML must follow EDS markup conventions:
    - `<main>` contains bare `<div>` elements (one per section)
    - Inside each `<div>`, inline content (headings, paragraphs, lists, code blocks) is placed directly
    - Do NOT add EDS-specific classes like `.section` or `.default-content-wrapper` -- the EDS decoration pipeline adds those
    - Include `<header></header>` and `<footer></footer>` as empty elements

    ```html
    <body>
      <header></header>
      <main>
        <!-- Section 1: Basic content for reading width verification -->
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
             tokens.</p>
        </div>

        <!-- Section 2: Code block escape hatch -->
        <div>
          <h2>Code Block Overflow Test</h2>
          <p>The following code block contains a very long line that should
             scroll horizontally, not be clipped.</p>
          <pre><code>const veryLongVariableName = someFunction(argumentOne, argumentTwo, argumentThree, argumentFour, argumentFive, argumentSix, argumentSeven) // This line is intentionally very long to test horizontal scrolling behavior within the default-content-wrapper constraint</code></pre>
          <p>Text after the code block should return to normal reading width.</p>
        </div>

        <!-- Section 3: Multiple element types for spacing verification -->
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
             (more space above than below).</p>
        </div>

        <!-- Section 4: Short content (simulates TIL post) -->
        <div>
          <h2>Short Section</h2>
          <p>A single short paragraph to verify section spacing does not create
             excessive gaps for brief content.</p>
        </div>
      </main>
      <footer></footer>
    </body>
    ```

    ## Part 2: Update AGENTS.md project structure

    In `AGENTS.md`, find the `styles/` section of the project structure tree and add `tokens.css` as the first entry with a load-order annotation.

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

    ## Verification

    1. Verify `drafts/layout-test.html` exists and contains valid HTML.
    2. Verify `AGENTS.md` contains `tokens.css` in the project structure tree.

    ## Boundaries

    - Create `drafts/layout-test.html` (new file)
    - Edit `AGENTS.md` (one section only -- the project structure tree)
    - Do NOT edit any CSS files, `head.html`, or JavaScript files
- **Deliverables**: `drafts/layout-test.html` test page; updated `AGENTS.md` project structure
- **Success criteria**: Test page contains four sections with correct EDS markup; AGENTS.md lists `tokens.css` in the styles directory

---

### Task 6: Final verification -- lint, grep, and dev server smoke test
- **Agent**: frontend-minion
- **Delegation type**: standard
- **Model**: sonnet
- **Mode**: bypassPermissions
- **Blocked by**: Task 3, Task 4, Task 5
- **Approval gate**: no
- **Prompt**: |
    You are working in the project at `/Users/ben/github/benpeter/mostly-hallucinations`.

    ## Task

    Run the complete verification suite for the DDD-001 implementation. This is a check-only task -- do NOT edit any files. If any check fails, report the failure clearly so it can be addressed.

    ## Checks to run (in order)

    ### 1. Full lint check
    ```bash
    npm run lint
    ```
    Must exit 0 with no errors in either ESLint or Stylelint.

    ### 2. Orphaned boilerplate variable grep
    ```bash
    grep -rn 'var(--background-color)\|var(--light-color)\|var(--dark-color)\|var(--text-color)\|var(--link-color)\|var(--link-hover-color)\|var(--body-font-family)\|var(--heading-font-family)' styles/ blocks/
    ```
    Must return zero results. Any match means a `var()` reference was missed and will resolve to `initial` (transparent/black/serif) at runtime.

    ### 3. No `@import` in stylesheets
    ```bash
    grep -rn '@import' styles/
    ```
    Must return zero results. `tokens.css` is loaded via `<link>` in `head.html`, not `@import`.

    ### 4. Dev server smoke test
    Start the dev server with drafts content:
    ```bash
    npx @adobe/aem-cli up --html-folder drafts --no-open --forward-browser-logs &
    ```
    Wait for it to start, then:
    ```bash
    curl -s http://localhost:3000/layout-test | head -50
    ```
    Verify the response contains HTML content (not a 404). The page should be served correctly.

    After verifying, kill the dev server background process.

    ### 5. Verify `tokens.css` is linked in `head.html`
    ```bash
    grep 'tokens.css' head.html
    ```
    Must return the `<link>` tag.

    ### 6. Verify `tokens.css` link comes before `styles.css` link in `head.html`
    ```bash
    grep -n 'stylesheet' head.html
    ```
    The `tokens.css` line number must be lower than the `styles.css` line number.

    ## Reporting

    Report each check as PASS or FAIL with output. If any check fails, describe what went wrong and which task needs to fix it.

    ## Boundaries

    - This is a READ-ONLY verification task
    - Do NOT edit any files
    - Do NOT attempt to fix failures -- only report them
- **Deliverables**: Verification report with PASS/FAIL for each check
- **Success criteria**: All 6 checks pass

---

### Cross-Cutting Coverage

| Dimension | Coverage | Rationale |
|-----------|----------|-----------|
| **Testing** | Task 6 (verification) + Phase 6 post-execution | No test framework exists in the project. Task 6 runs lint, grep checks, and dev server smoke test. Phase 6 will run lint as the test step. |
| **Security** | Not included | This task is purely CSS layout changes. No auth, no user input, no API surface, no new dependencies. All code is client-side static CSS already served on the public web. |
| **Usability -- Strategy** | Covered via Phase 2 consultation | ux-strategy-minion reviewed the layout contract. Key finding: padding 3-tier vs 2-tier trade-off. Decision: follow DDD-001 as approved (3-tier). Mobile line length deferred to DDD-005/006 with explicit handoff. |
| **Usability -- Design** | Not included for execution | No new UI components or interaction patterns. This is foundational geometry (widths, padding, margins). Visual design review will occur when actual surfaces are built (DDD-002+). |
| **Documentation** | Task 5 (AGENTS.md update) + Phase 8 post-execution | AGENTS.md project structure updated to include `tokens.css` with load-order annotation. `tokens.css` header comment updated in Task 1. |
| **Observability** | Not included | No runtime components, APIs, or background processes. Pure static CSS. |

### Architecture Review Agents

- **Mandatory** (5): security-minion, test-minion, ux-strategy-minion, lucy, margo
- **Discretionary picks**:
  - accessibility-minion: The layout changes padding and max-widths that affect reading experience. While no HTML/UI is being created, the CSS constrains how content renders at all viewports. WCAG 1.4.10 (Reflow) and 1.4.4 (Resize Text) are relevant to layout geometry. Worth a lightweight review.
- **Not selected**: ux-design-minion (no visual components), sitespeed-minion (adding one small CSS file, no performance budget concern), observability-minion (no runtime components), user-docs-minion (no user-facing documentation impact yet)

### Conflict Resolutions

1. **Tablet padding (2-tier vs 3-tier)**: ux-strategy-minion recommended simplifying to 2-tier padding (dropping `--content-padding-tablet`), arguing the 20px-to-24px step is imperceptible. DDD-001 is approved with 3-tier. **Resolution**: Follow DDD-001 as approved. The DDD is the contract; implementation deviations from an approved spec require explicit approval. The 3-tier model is implemented. This is surfaced as an advisory for Phase 3.5 review -- if the user or reviewers feel strongly, they can flag it for DDD-001 amendment. The token exists, the media query exists; removing them later is trivial.

2. **Media query syntax**: DDD-001 uses `(min-width: Npx)` in CSS examples; Stylelint enforces `(width >= Npx)` range notation. **Resolution**: Use range notation. This is a syntax-level implementation detail with identical browser behavior. Not a spec deviation. Noted in task prompts.

3. **Block CSS scope expansion**: test-minion identified that block CSS files (`header.css`, `footer.css`, `cards.css`, `hero.css`) reference boilerplate variable names that break when the `:root` block is removed. This was not in the original DDD-001 scope but is a mandatory fix. **Resolution**: Added Task 4 (block CSS audit) running in parallel with Task 3. Without this, the site would have invisible broken styles.

### Risks and Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Missed `var()` reference resolves to `initial` (transparent/black/serif) | **High** | Task 6 grep check catches any orphaned boilerplate variable reference across all CSS files. Task prompts include complete mapping tables. |
| Media query syntax mismatch fails lint | **High** | All task prompts explicitly state: use `(width >= Npx)` not `(min-width: Npx)`. Noted as implementation detail, not spec deviation. |
| Block CSS files break after `:root` removal | **High** | Task 4 runs in parallel with Task 3, updating all block files. Task 6 verification grep covers `blocks/` directory. |
| `ch` unit renders differently before font loads | **Medium** | Inherent to the `ch` unit approach. Acknowledged in DDD-001 Open Question #2. Shift is minor (few pixels). No action in this plan; DDD-005/006 validates. |
| `head.html` link order reversed by future contributor | **Medium** | AGENTS.md annotation documents the dependency. `tokens.css` comment updated to say "Loaded via `<link>` in `head.html` before `styles.css`." |
| `drafts/` markup does not match AEM backend output | **Medium** | Test HTML follows EDS conventions (bare `<div>` sections, no EDS classes). Task prompt includes the exact markup. Dev server smoke test in Task 6 confirms decoration runs. |
| Dead Roboto `@font-face` in `fonts.css` wastes bytes | **Low** | Out of scope per meta-plan. `fonts.css` cleanup is a follow-up task. No visual or functional impact. |

### Execution Order

```
Batch 1 (parallel):
  Task 1: Add layout tokens to tokens.css + fix lint errors

Batch 2 (parallel, after Task 1):
  Task 2: Add tokens.css link to head.html
  Task 4: Update block CSS files (depends on Task 1 for token names being defined)

Batch 3 (after Task 2):
  Task 3: Replace boilerplate :root + remap var() + layout rules in styles.css
  >>> APPROVAL GATE <<<

Batch 4 (after Task 3 + Task 4):
  Task 5: Create drafts test content + update AGENTS.md

Batch 5 (after Task 5):
  Task 6: Final verification suite
```

### Verification Steps

After all tasks complete, the integrated result is verified by Task 6's checks:

1. `npm run lint` passes with zero errors across all CSS and JS files
2. No orphaned boilerplate variable references in `styles/` or `blocks/`
3. No `@import` directives in stylesheets
4. Dev server serves `drafts/layout-test.html` successfully
5. `tokens.css` is linked in `head.html` before `styles.css`
6. Manual viewport verification at 375px, 600px, 900px, 1200px, 1440px (deferred to human reviewer or post-push PageSpeed Insights)
