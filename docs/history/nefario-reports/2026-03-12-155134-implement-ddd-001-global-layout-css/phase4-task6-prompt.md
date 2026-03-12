You are working in the project at `/Users/ben/github/benpeter/mostly-hallucinations`.

## Task

Run the complete verification suite for the DDD-001 implementation. This is a **check-only task** — do NOT edit any files. If any check fails, report the failure clearly so it can be addressed.

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
Must return zero results. Any match means a `var()` reference will resolve to `initial` at runtime.

### 3. No `@import` in stylesheets
```bash
grep -rn '@import' styles/
```
Must return zero results. `tokens.css` is loaded via `<link>` in `head.html`, not `@import`.

### 4. Media query blocks exist at correct breakpoints
```bash
grep -n '@media' styles/styles.css
```
Must contain exactly:
- One `@media (width >= 600px)` block (for tablet padding)
- One `@media (width >= 900px)` block (for desktop padding on `main > .section > div`)

Note: The 1200px figure is NOT a media query breakpoint — it is the value of `--layout-max` used as a `max-width`. There is intentionally no `@media (width >= 1200px)` in `styles.css`. This is correct per DDD-001.

Also confirm there are no orphaned old media queries from the deleted boilerplate `:root` block:
```bash
grep -c '@media' styles/styles.css
```
Should return 2 (the two padding breakpoints). If it returns more, the old responsive `:root` block was not fully removed.

### 5. No `border-radius: 8px` on `pre`
```bash
grep -n 'border-radius' styles/styles.css
```
Must return zero results. The DDD-001 aesthetic rule "no rounded containers" requires removing `border-radius: 8px` from the `pre` rule.

### 6. `tokens.css` is linked before `styles.css` in `head.html`
```bash
grep -n 'stylesheet' head.html
```
The `tokens.css` line number must be lower than the `styles.css` line number.

### 7. `style-src` CSP is in `head.html`
```bash
grep 'style-src' head.html
```
Must return the updated CSP meta tag containing `style-src 'self'`.

### 8. Dev server smoke test
Start the dev server with drafts content:
```bash
npx @adobe/aem-cli up --html-folder drafts --no-open --forward-browser-logs &
DEV_PID=$!
sleep 5
curl -s http://localhost:3000/layout-test | grep -c 'class=' || echo "No decorated classes yet"
curl -s http://localhost:3000/layout-test | grep -i 'section\|default-content-wrapper\|DOCTYPE\|html' | head -10
kill $DEV_PID 2>/dev/null
```
The page should return HTML content with EDS-decorated classes (`section`, `default-content-wrapper`) visible in the decorated response. If not yet decorated on first load, confirm at minimum that the HTML file is served (not 404).

Note: Lighthouse 100 score validation requires a deployed branch preview at
`https://{branch}--mostly-hallucinations--benpeter.aem.page/layout-test` via PageSpeed Insights.
This cannot be validated locally and is deferred to the PR review step.

## Reporting

Report each check as PASS or FAIL with exact command output. If any check fails:
- Describe what went wrong
- Identify which task needs to fix it (Task 1-5)
- Do NOT attempt to fix it yourself

## When done

Mark Task #6 completed with TaskUpdate. Then send a message to team-lead with:
- Summary of all 8 checks (PASS/FAIL table)
- Any failures with task assignments

## Boundaries

- This is a READ-ONLY verification task
- Do NOT edit any files
- Do NOT attempt to fix failures — only report them
