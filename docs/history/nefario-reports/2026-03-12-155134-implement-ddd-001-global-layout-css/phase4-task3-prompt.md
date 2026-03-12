You are working in the project at `/Users/ben/github/benpeter/mostly-hallucinations`.

## Task

Wholesale replace the boilerplate `:root` block, Roboto `@font-face` declarations, and responsive `:root` overrides in `styles/styles.css`. Remap every `var()` reference to use project token names from `tokens.css`. Then implement the DDD-001 two-tier width model, responsive padding, and section spacing.

## Context

`tokens.css` is now loaded via `<link>` in `head.html` before `styles.css`. All design tokens are defined in `tokens.css`. The boilerplate `:root` block in `styles.css` defines conflicting variable names that must be removed entirely. Every `var()` reference in `styles.css` must be updated to use the project token names.

**CRITICAL**: This project uses `stylelint-config-standard` v40, which enforces CSS Media Queries Level 4 range notation. All media queries MUST use `(width >= Npx)` syntax, NOT `(min-width: Npx)`. Any `min-width` syntax will fail lint.

## Phase A: Delete boilerplate blocks

### Delete the boilerplate `:root` block

Remove the entire block from `:root {` through its closing `}`. This includes:
- `--background-color`, `--light-color`, `--dark-color`, `--text-color`, `--link-color`, `--link-hover-color`
- `--body-font-family`, `--heading-font-family`
- `--body-font-size-*`, `--heading-font-size-*`
- `--nav-height`

All of these are now defined in `tokens.css` under project names.

### Delete both Roboto `@font-face` fallback blocks

Remove the `/* fallback fonts */` comment and both `@font-face` blocks for `roboto-condensed-fallback` and `roboto-fallback`. This project uses Source Sans 3 / Source Code Pro / Source Serif 4, not Roboto.

### Delete the boilerplate responsive `:root` block

Remove the `@media (width >= 900px) { :root { ... } }` block that overrides font sizes. The equivalent responsive overrides already exist in `tokens.css`.

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
- `var(--body-font-size-m)`, `var(--body-font-size-s)` — same name in `tokens.css`
- `var(--nav-height)` — same name
- `var(--heading-font-size-*)` — same names

Additional line-level changes:

**In the `body` rule:**
- `background-color: var(--background-color)` → `background-color: var(--color-background)`
- `color: var(--text-color)` → `color: var(--color-text)`
- `font-family: var(--body-font-family)` → `font-family: var(--font-body)`
- `line-height: 1.6` → `line-height: var(--line-height-body)`

**In the heading rule (h1-h6):**
- `font-family: var(--heading-font-family)` → `font-family: var(--font-heading)`
- `line-height: 1.25` → `line-height: var(--line-height-heading)`

**In the `pre` rule:**
- `background-color: var(--light-color)` → `background-color: var(--color-background-soft)`
- `border-radius: 8px` → **REMOVE THIS LINE ENTIRELY** (DDD-001 aesthetic rule: no rounded containers)

**In the `a:any-link` rule:**
- `color: var(--link-color)` → `color: var(--color-link)`

**In the `a:hover` rule:**
- `color: var(--link-hover-color)` → `color: var(--color-link-hover)`

**In the button rules:**
- `font-family: var(--body-font-family)` → `font-family: var(--font-body)`
- `background-color: var(--link-color)` → `background-color: var(--color-link)`
- `color: var(--background-color)` → `color: var(--color-background)`

**In the button hover rule:**
- `background-color: var(--link-hover-color)` → `background-color: var(--color-link-hover)`

**In the disabled button rule:**
- `background-color: var(--light-color)` → `background-color: var(--color-background-soft)`

**In the secondary button rule:**
- `color: var(--text-color)` → `color: var(--color-text)`

## Phase C: Implement two-tier width model, responsive padding, and section spacing

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

### Replace the sections block

Replace the entire sections block (from `/* sections */` through the end of the section metadata styles) with:

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
  padding-inline: 0;
}

/* Section metadata variants */
main .section.light,
main .section.highlight {
  background-color: var(--color-background-soft);
  margin: 0;
  padding: var(--section-spacing) 0;
}
```

**Note**: `padding-inline: 0` on `.default-content-wrapper` is REQUIRED. Without it, the `.default-content-wrapper` inherits `padding-inline` from the `main > .section > div` rule (both selectors match the same element), which would shrink the content area from 68ch to approximately 52ch.

## Verification

1. Run `npx stylelint styles/styles.css` — must exit 0.
2. Run orphaned variable grep:
   ```bash
   grep -n 'var(--background-color)\|var(--light-color)\|var(--dark-color)\|var(--text-color)\|var(--link-color)\|var(--link-hover-color)\|var(--body-font-family)\|var(--heading-font-family)' styles/styles.css
   ```
   Must return zero results.
3. Confirm no `@import` directives: `grep -n '@import' styles/styles.css` returns zero results.
4. Spot-check for orphaned media query: `grep -n '@media.*900' styles/styles.css` should return exactly ONE result (the `@media (width >= 900px)` block for `main > .section > div`). If there are two, the old boilerplate responsive `:root` block was not fully removed.

## When done

Mark Task #3 completed with TaskUpdate. Then send a message to team-lead with:
- File paths changed with line counts (+N/-M)
- 1-2 sentence summary of what was produced

## Boundaries

- Only edit `styles/styles.css`
- Do NOT edit `tokens.css`, `head.html`, or block CSS files
- Do NOT add `overflow: hidden` to `.default-content-wrapper`
- Do NOT add `padding-inline` to `.default-content-wrapper` except `padding-inline: 0`
- Keep the Apache 2.0 license header at the top of the file
- All media queries must use `(width >= Npx)` syntax, never `min-width`
