You are working in the project at `/Users/ben/github/benpeter/mostly-hallucinations`.

## Task

Add four proposed layout tokens to `styles/tokens.css` and fix the five pre-existing Stylelint errors in the same file.

## Context

This is part of implementing DDD-001 (Global Layout). `tokens.css` is the single source of truth for design tokens. It currently has 5 Stylelint errors. You must fix those AND add the new tokens so `styles/tokens.css` lints cleanly.

## Edits

### 1. Update file header comment

Find the line:
```
 * Import this at the top of styles.css: @import url('tokens.css');
```
Replace with:
```
 * Loaded via <link> in head.html before styles.css.
```

### 2. Add four tokens to the `/* --- Spacing --- */` section

Add these four properties after `--content-padding-desktop: 32px;` and before the closing `}` of the light-mode `:root` block:

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

### 3. Fix dark mode `:root` blank-line errors

The `custom-property-empty-line-before` rule forbids blank lines between consecutive custom properties (exception: after-comment is allowed). In the dark mode `@media (prefers-color-scheme: dark)` block, remove all blank lines between consecutive custom properties. Keep comment-separated groups (blank line before a comment is fine). The result should have no blank lines between consecutive property declarations.

### 4. Fix desktop media query syntax

Replace:
```css
@media (min-width: 900px) {
```
With:
```css
@media (width >= 900px) {
```

### 5. Fix desktop `:root` block blank-line error

Inside the `@media (width >= 900px)` `:root` block, remove the blank line between `--body-font-size-xs` and `--heading-font-size-xxl`.

## Verification

Run: `npx stylelint styles/tokens.css`

Must exit with zero errors.

## When done

Mark Task #1 completed with TaskUpdate. Then send a message to team-lead with:
- File paths changed with line counts
- 1-2 sentence summary of what was produced

## Boundaries

- Only edit `styles/tokens.css`
- Do NOT edit `styles/styles.css`, block CSS files, or any other files
- Do NOT change token values that already exist — only add new tokens and fix lint errors
