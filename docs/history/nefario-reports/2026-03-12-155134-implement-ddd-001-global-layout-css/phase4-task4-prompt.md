You are working in the project at `/Users/ben/github/benpeter/mostly-hallucinations`.

## Task

Update all boilerplate variable references in block CSS files to use the project token names from `tokens.css`. These block CSS files reference variables that are being removed from `styles.css`. If not updated, they will resolve to CSS `initial` values and silently break visual presentation.

## Context

The boilerplate `:root` block in `styles.css` is being removed as part of DDD-001 implementation. Block CSS files reference those boilerplate variable names. The project tokens are defined in `styles/tokens.css`. This task updates the block CSS files so they reference project tokens instead.

## Variable Mapping

| Boilerplate variable | Project token |
|---------------------|--------------|
| `--background-color` | `--color-background` |
| `--light-color` | `--color-background-soft` |
| `--body-font-family` | `--font-body` |

## Files and exact changes

Read each file first, then make exactly these changes:

### `blocks/header/header.css`

- `background-color: var(--background-color)` → `background-color: var(--color-background)` (appears twice, ~lines 3 and 75)
- `font-family: var(--body-font-family)` → `font-family: var(--font-body)` (~line 21)
- `background-color: var(--light-color)` → `background-color: var(--color-background-soft)` (~line 248)
- `border-bottom: 8px solid var(--light-color)` → `border-bottom: 8px solid var(--color-background-soft)` (~line 261)

### `blocks/footer/footer.css`

- `background-color: var(--light-color)` → `background-color: var(--color-background-soft)` (~line 2)

### `blocks/cards/cards.css`

- `background-color: var(--background-color)` → `background-color: var(--color-background)` (~line 12)

### `blocks/hero/hero.css`

- `color: var(--background-color)` → `color: var(--color-background)` (~line 16)

## Verification

1. Run `npx stylelint "blocks/**/*.css"` — must exit 0.
2. Run orphaned reference grep:
   ```bash
   grep -rn 'var(--background-color)\|var(--light-color)\|var(--dark-color)\|var(--text-color)\|var(--link-color)\|var(--link-hover-color)\|var(--body-font-family)\|var(--heading-font-family)' blocks/
   ```
   Must return zero results.

## When done

Mark Task #4 completed with TaskUpdate. Then send a message to team-lead with:
- File paths changed with line counts
- 1-2 sentence summary of what was produced

## Boundaries

- Only edit the four block CSS files listed above
- Do NOT change any selectors, property names, or values — only `var()` references
- Do NOT edit `styles.css`, `tokens.css`, or `head.html`
