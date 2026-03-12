## Domain Plan Contribution: test-minion

### Recommendations

#### 1. `npm run lint` -- Current State and Identified Traps

**Lint is already failing.** Running `npm run lint` today (before any DDD-001 changes) exits with 5 errors, all in `styles/tokens.css`. This means the success criterion "`npm run lint` passes" requires the implementing agent to also fix pre-existing lint issues in `tokens.css`, not just avoid introducing new ones.

The lint pipeline runs two tools sequentially:

| Script | Tool | Scope |
|---|---|---|
| `lint:js` | ESLint (Airbnb config, Babel parser) | All `.js` files |
| `lint:css` | Stylelint 17.3.0 with `stylelint-config-standard` v40 | `blocks/**/*.css` and `styles/*.css` |

ESLint will not be affected by CSS-only changes. The risk is entirely in Stylelint.

**Pre-existing Stylelint errors in `tokens.css` (5 errors, all auto-fixable):**

| Line | Rule | Issue |
|---|---|---|
| 78 | `custom-property-empty-line-before` | Blank line before `--color-text` in dark mode block (after comment, not after another custom property) |
| 81 | `custom-property-empty-line-before` | Same pattern: blank line before `--color-heading` |
| 85 | `custom-property-empty-line-before` | Same pattern: blank line before `--color-border` |
| 94 | `media-feature-range-notation` | Uses `(min-width: 900px)` -- Stylelint requires `(width >= 900px)` |
| 100 | `custom-property-empty-line-before` | Blank line before `--heading-font-size-xxl` in desktop block |

**The current `styles.css` and all block CSS files pass lint cleanly.** The boilerplate files use `(width >= 900px)` everywhere, which is the notation Stylelint mandates.

#### Critical Trap: Media Query Syntax Mismatch

This is the single highest-risk lint issue for this task.

The `stylelint-config-standard` v40 enforces `media-feature-range-notation: "context"`, which requires the modern range syntax:

- **Required by lint:** `@media (width >= 900px)`
- **Rejected by lint:** `@media (min-width: 900px)`

The DDD-001 spec uses `(min-width: 600px)` and `(min-width: 900px)` in its CSS code examples. The `tokens.css` file already has one violation of this rule at line 94 (`@media (min-width: 900px)`). The existing boilerplate `styles.css` uses the context notation correctly (`@media (width >= 900px)`).

**The implementing agent MUST use context range notation in all new media queries:**

```css
/* CORRECT -- passes Stylelint */
@media (width >= 600px) { ... }
@media (width >= 900px) { ... }

/* WRONG -- fails Stylelint */
@media (min-width: 600px) { ... }
@media (min-width: 900px) { ... }
```

The DDD-001 spec code examples should be treated as intent, not as literal copy-paste targets. The CSS syntax must conform to the project's linter, not to the spec's illustrative examples.

Additionally, the existing `tokens.css` line 94 (`@media (min-width: 900px)`) must be fixed to `@media (width >= 900px)` as part of this work, since the success criterion requires `npm run lint` to pass.

#### The `custom-property-empty-line-before` Rule

The `stylelint-config-standard` rule `custom-property-empty-line-before` is set to `"always"` with exceptions for `after-custom-property` and `first-nested`. This means:

- Consecutive custom properties (one after another): no blank line needed (exception applies)
- Custom property after a comment: blank line IS expected (no exception for after-comment... wait, actually `after-comment` IS in the ignore list for this rule)

Let me be precise. The rule configuration from `stylelint-config-standard` v40 is:

```js
'custom-property-empty-line-before': ['always', {
  except: ['after-custom-property', 'first-nested'],
  ignore: ['after-comment', 'inside-single-line-block'],
}]
```

The existing errors in `tokens.css` occur at lines 78, 81, 85, and 100 -- inside the dark mode and desktop media query blocks. These are blank lines that appear between groups of custom properties within a `:root` block, where the Stylelint rule sees them as unexpected empty lines before a custom property that follows another custom property. The fix is to either remove the blank lines between property groups or accept that visual grouping requires a different approach (e.g., comments as group headers, which trigger the `ignore: ['after-comment']` clause).

**When the implementing agent adds new tokens to `tokens.css`**, blank lines between groups of custom properties within the same `:root` block must be avoided, OR each group must be preceded by a comment (which the `ignore: ['after-comment']` clause handles). All 5 existing errors are auto-fixable with `npm run lint:fix`, but the fix will remove visual grouping whitespace. The implementing agent should decide whether to auto-fix (losing visual grouping) or restructure with comment headers (preserving grouping).

#### 2. Block CSS Files Reference Boilerplate Variables -- Scope Creep Risk

The DDD-001 spec says to replace boilerplate variable references in `styles.css`. However, **block CSS files also reference boilerplate variables that will become undefined after the `:root` block is removed from `styles.css`:**

| File | Boilerplate Variable References |
|---|---|
| `blocks/header/header.css` | `var(--background-color)` (lines 3, 75), `var(--body-font-family)` (line 21), `var(--light-color)` (lines 248, 261) |
| `blocks/footer/footer.css` | `var(--light-color)` (line 2) |
| `blocks/cards/cards.css` | `var(--background-color)` (line 12) |
| `blocks/hero/hero.css` | `var(--background-color)` (line 16) |

If the implementing agent removes the boilerplate `:root` block from `styles.css` without updating these block files, those `var()` references will resolve to their CSS initial values:

- `var(--background-color)` resolves to `initial` (transparent for `background-color`, meaning elements lose their background)
- `var(--light-color)` resolves to `initial` (transparent for `background-color`, same issue)
- `var(--body-font-family)` resolves to `initial` (browser default serif font)

**This is a ship-stopping defect.** The implementing agent must do one of:

1. **Update block CSS files** to reference project tokens (`--color-background`, `--color-background-soft`, `--font-body`) -- this is the correct approach per DDD-001's intent.
2. **Add backwards-compatibility aliases** in `tokens.css` that map old names to new tokens -- this is a mapping layer the DDD explicitly rejected.
3. **Keep the boilerplate variable declarations** in `styles.css` but point them at the project tokens -- this is also a mapping layer.

Option 1 is the only approach consistent with the DDD. The block CSS files are boilerplate code that will eventually be replaced by project-specific blocks (DDD-002, DDD-003, etc.), but they must work during development.

**Verification: after the `:root` replacement, run a project-wide search for every boilerplate variable name:**

```bash
grep -rn 'var(--background-color)\|var(--light-color)\|var(--dark-color)\|var(--text-color)\|var(--link-color)\|var(--link-hover-color)\|var(--body-font-family)\|var(--heading-font-family)' blocks/ styles/
```

If this returns any results, those references must be updated before the lint/render check.

#### 3. Lighthouse 100 -- Practical Validation Strategy

**The "Lighthouse 100 on local preview" criterion cannot be validated through standard Lighthouse tooling against `localhost:3000` in a meaningful way for this task.** Here is why and what to do instead.

**Why standard Lighthouse is problematic here:**

- Lighthouse requires a running page with real content. The `drafts/` content must be served by the AEM CLI dev server (`npx @adobe/aem-cli up --html-folder drafts`).
- Lighthouse against `localhost` in a CI-less environment produces scores that vary with machine load, cold caches, and font loading timing. The score is not deterministic.
- The task changes CSS layout geometry, not performance-critical resources. The changes that could impact Lighthouse are: (a) adding a second `<link>` in `head.html` for `tokens.css` (one additional render-blocking request), and (b) any `@import` chains if the implementation accidentally uses `@import` instead of `<link>`.

**What actually matters for Lighthouse 100:**

1. **No `@import` in CSS.** The DDD specifies loading `tokens.css` via a separate `<link>` in `head.html`, not via `@import` in `styles.css`. This is correct. Verify by confirming no `@import` directives exist in `styles.css` or `tokens.css` (only `<link>` in `head.html`).

2. **The additional `<link>` for `tokens.css` is render-blocking but trivially small.** `tokens.css` is 107 lines / ~2.5KB uncompressed. On the AEM CDN this serves in under 5ms. It will not impact LCP. However, both stylesheets will be parser-blocking. The implementing agent should confirm that the dev server serves both files and that no console errors appear.

3. **No layout shift.** The layout changes (widths, padding, margins) should not cause CLS because they apply before first paint (both stylesheets are in `<head>`, loaded eagerly). Verify that `body { display: none }` / `body.appear { display: block }` pattern still works correctly -- the body should remain hidden until JS runs and adds the `appear` class.

**Recommended verification approach:**

| Check | Method | Required |
|---|---|---|
| No `@import` in CSS files | `grep -rn '@import' styles/` | Yes -- automated |
| No broken `var()` references | Browser DevTools: check for unresolved custom properties (shown as invalid in Computed tab) | Yes -- manual |
| No console errors on page load | Dev server + browser console | Yes -- manual |
| Layout renders at mobile width | Browser DevTools device mode: 375px | Yes -- manual |
| Layout renders at tablet width | Browser DevTools device mode: 600px | Yes -- manual |
| Layout renders at desktop width | Browser DevTools device mode: 900px, 1200px, 1440px | Yes -- manual |
| `body.appear` pattern intact | Verify body shows after JS executes | Yes -- manual |
| Lighthouse score | Run Lighthouse on `http://localhost:3000/` with draft content served | Recommended but not blocking -- score is informational at this stage |

If the orchestrating system can run Playwright or Puppeteer, a simple screenshot-based smoke test at each breakpoint would be more reliable than Lighthouse. But this is not worth building custom tooling for -- a human opening DevTools at four viewport widths takes 2 minutes and provides higher-confidence validation than any automated approach at this stage.

#### 4. No Existing Tests Touch These Files

There are no test files in this repository. No `*.test.*`, no `*.spec.*`, no `test/` or `tests/` directory, no test runner configured in `package.json`. The only quality gates are:

1. `npm run lint` (ESLint + Stylelint)
2. CI pipeline (`.github/workflows/main.yaml`) which runs `npm ci` then `npm run lint`
3. AEM Code Sync checks after push (PageSpeed Insights against the preview URL)

This means there is no regression test suite to break. However, it also means there is no safety net. The implementing agent's manual verification is the only quality assurance.

#### 5. The `fonts.css` File Still References Roboto

`styles/fonts.css` defines `@font-face` blocks for `roboto` and `roboto-condensed`. These are boilerplate fonts that the project does not use (the project uses Source Sans 3, Source Code Pro, Source Serif 4 per `tokens.css`). The `styles.css` file also has `@font-face` fallback declarations for `roboto-fallback` and `roboto-condensed-fallback` (lines 44-54).

**This is out of DDD-001 scope** (the metaplan explicitly excludes font file replacement), but the implementing agent should be aware that:

- The Roboto fallback `@font-face` blocks in `styles.css` (lines 44-54) reference `--body-font-family` and `--heading-font-family` aliases. After the `:root` replacement, these font families are no longer declared as custom properties. The `@font-face` blocks themselves do not use `var()` -- they hardcode `roboto-fallback` and `roboto-condensed-fallback` as family names. These declarations become dead code (the font families are never referenced) but do not cause errors.
- Leaving them in `styles.css` adds ~200 bytes of dead CSS. Not a Lighthouse concern, but a cleanliness concern. The implementing agent can remove them or leave them with a `/* TODO: remove when fonts.css is updated */` comment.

### Proposed Tasks

These are verification tasks for the executing agent's checklist, not separate agent tasks.

#### Pre-Implementation Checks

1. Run `npm run lint` to confirm the baseline (expected: 5 errors in `tokens.css`, all in Stylelint). Record the output.

2. Run `grep -rn 'var(--background-color)\|var(--light-color)\|var(--dark-color)\|var(--text-color)\|var(--link-color)\|var(--link-hover-color)\|var(--body-font-family)\|var(--heading-font-family)' blocks/ styles/` to inventory all boilerplate variable references across the project.

#### Implementation Constraints (for the executing agent)

3. All new `@media` queries MUST use context range notation: `(width >= 600px)`, `(width >= 900px)`. Do NOT copy `(min-width: ...)` from the DDD-001 spec examples.

4. Fix the existing `tokens.css` line 94 media query to `@media (width >= 900px)`.

5. Resolve the 4 `custom-property-empty-line-before` errors in `tokens.css`. Recommended approach: use comment headers for visual grouping instead of blank lines.

6. After removing the boilerplate `:root` block from `styles.css`, update all `var()` references in block CSS files (`blocks/header/header.css`, `blocks/footer/footer.css`, `blocks/cards/cards.css`, `blocks/hero/hero.css`) to use project token names.

#### Post-Implementation Verification Checklist

7. `npm run lint` passes with exit code 0 (both ESLint and Stylelint).

8. `grep -rn 'var(--background-color)\|var(--light-color)\|var(--dark-color)\|var(--text-color)\|var(--link-color)\|var(--link-hover-color)\|var(--body-font-family)\|var(--heading-font-family)' blocks/ styles/` returns zero results.

9. `grep -rn '@import' styles/` returns zero results (no accidental import chains).

10. Start the dev server with `npx @adobe/aem-cli up --html-folder drafts --no-open` and verify:
    - Page loads without console errors
    - Body becomes visible (the `appear` class is applied)
    - No unstyled flash (FOUC) from missing token values

11. In browser DevTools, at each breakpoint (375px, 600px, 900px, 1200px, 1440px), verify:
    - Content padding matches the spec (20px mobile, 24px or 20px tablet per UX decision, 32px desktop)
    - `.default-content-wrapper` is constrained to `--measure` (68ch)
    - `main > .section > div` is constrained to `--layout-max` (1200px)
    - Sections have vertical spacing of `--section-spacing` (48px)
    - First section has no top margin

12. Verify `.default-content-wrapper` does NOT have `overflow: hidden` (check computed styles in DevTools).

13. Run Lighthouse on `http://localhost:3000/` (if dev server is running with draft content). This is informational -- note the score but do not block on it. The meaningful Lighthouse check happens against the `.aem.page` preview URL after code is pushed.

### Risks and Concerns

| Risk | Severity | Mitigation |
|---|---|---|
| Block CSS files break silently after `:root` removal -- boilerplate `var()` references resolve to `initial` | **High** | Mandatory grep check (task 8). The implementing agent MUST update block CSS files. |
| Implementing agent copies DDD-001 `(min-width:)` syntax literally, causing lint failure | **High** | Explicit constraint in checklist (task 3). The DDD examples use illustrative syntax; the project lint requires `(width >= ...)`. |
| `tokens.css` lint errors are not addressed, leaving `npm run lint` broken | **Medium** | Pre-implementation baseline check (task 1) forces awareness. These errors predate DDD-001 but must be fixed as part of "lint passes" criterion. |
| Lighthouse 100 criterion is unverifiable in local-only environment | **Medium** | Redefine the criterion: local verification checks layout correctness and no console errors. Lighthouse 100 is validated post-push against the `.aem.page` preview URL. |
| Second `<link>` in `head.html` introduces additional render-blocking request | **Low** | `tokens.css` is ~2.5KB. On CDN this is sub-5ms. No measurable LCP impact. The AEM platform concatenates/caches linked stylesheets in production. |
| Dead Roboto `@font-face` declarations remain in `styles.css` | **Low** | Out of scope per metaplan. Add TODO comment or remove silently. Does not affect correctness. |

### Additional Agents Needed

None. The verification strategy for this task is manual browser inspection plus automated lint. There is no test framework in the project, and adding one for a CSS layout change is disproportionate to the task scope.

If the project later adopts visual regression testing (e.g., Playwright screenshot comparisons), the `drafts/` test content created for this task would serve as the baseline content for those tests. But that is a future infrastructure decision, not a DDD-001 concern.
