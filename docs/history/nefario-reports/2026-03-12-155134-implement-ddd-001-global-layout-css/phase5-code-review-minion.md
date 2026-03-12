---
reviewer: code-review-minion
scope: DDD-001 Global Layout CSS — post-execution code review
files-reviewed:
  - styles/tokens.css
  - styles/styles.css
  - head.html
  - blocks/header/header.css
  - blocks/footer/footer.css
  - blocks/cards/cards.css
  - blocks/hero/hero.css
  - drafts/layout-test.html
  - AGENTS.md
---

## VERDICT: ADVISE

All blocking concerns from the spec are satisfied. Four advisory findings below — none prevent merging, but two warrant attention before DDD-002 builds on top of this foundation.

---

## FINDINGS

### [ADVISE] styles/styles.css:120 -- Hardcoded `line-height: 1.25` in button rule
AGENT: frontend-minion (Task 3)
CONTEXT: The body rule correctly uses `var(--line-height-body)` (line 20) and the heading rule correctly uses `var(--line-height-heading)` (line 51). The button rule (`a.button:any-link, button`) retains a hardcoded `line-height: 1.25` at line 120. This is the same numeric value as `--line-height-heading`, but it is expressed inline rather than through the token. This is a minor inconsistency — not a DDD-001 spec violation because the task prompt did not list this line in Phase B — but it leaves one non-tokenized value in a rule where all other values are tokenized.
FIX: Replace `line-height: 1.25` with `line-height: var(--line-height-heading)` in the button rule at line 120.

---

### [ADVISE] blocks/cards/cards.css:11 -- Hardcoded `#dadada` border color out of token system
AGENT: frontend-minion (Task 4)
CONTEXT: Line 11 reads `border: 1px solid #dadada`. This value was present in the boilerplate and is outside the token remap scope defined for Task 4. The task instructions correctly limited changes to the three boilerplate variable names (`--background-color`, `--light-color`, `--body-font-family`). However, `#dadada` is now the only hardcoded color in any CSS file that is not covered by a token. It is close to `--color-border` (#C9C3B8) but not the same value. This card border color will not respond to dark mode and is invisible to future theming.
FIX: Replace `#dadada` with `var(--color-border)` and verify the visual result is acceptable. If the design intent requires a color distinct from `--color-border`, add a new token (e.g., `--color-border-card`) to `tokens.css`. This is pre-existing boilerplate debt; defer to the card block redesign unless DDD-002+ depends on cards.

---

### [ADVISE] styles/styles.css:77-82 -- Duplicate `pre` selector block is correct but fragile
AGENT: frontend-minion (Task 3)
CONTEXT: `pre` appears in three selector contexts: lines 66 (margin, grouped with `p, dl, ol, ul, blockquote`), 73 (font-size, grouped with `code`), and 77 (padding, background, overflow). The three-way split is inherited from boilerplate and is not a bug. However, line 78 uses a hardcoded `padding: 16px` that is not covered by any spacing token. This value is below the granularity of existing spacing tokens and is reasonable for code padding, but it is the only instance of a raw `px` value in a property that arguably belongs in the token system. This is low priority -- note it for DDD-005/006 when spacing tokens are extended.
FIX: No immediate action needed. If `--space-code-padding` or similar is added in DDD-005/006, this line should be updated.

---

### [NIT] blocks/footer/footer.css:8-9 -- Hardcoded layout values not updated to tokens
AGENT: frontend-minion (Task 4)
CONTEXT: `footer.css` has `max-width: 1200px` and `padding: 40px 24px 24px` at lines 8-9, plus `padding: 40px 32px 24px` at line 18. These are not boilerplate variable references so they were correctly outside Task 4 scope. But they are now the only CSS file in the project that hardcodes `1200px` (the layout max) and `24px`/`32px` (the padding scale) as raw values rather than tokens. The same values exist in tokens as `--layout-max`, `--content-padding-tablet`, and `--content-padding-desktop`. Since this footer is boilerplate that will be replaced in a later DDD, this is low priority.
FIX: Defer to footer redesign DDD. No action in this PR.

---

## Passing Checks

- **styles/tokens.css**: All four new tokens present and correctly valued (`--layout-max: 1200px`, `--content-padding-tablet: 24px`, `--space-paragraph: 1em`, `--space-element: 1.5em`). Dark mode blank-line lint errors fixed. Desktop media query uses range notation `(width >= 900px)`. File header comment updated correctly.
- **head.html**: `tokens.css` linked at line 9, `styles.css` at line 10 — correct load order confirmed. CSP contains `style-src 'self'` covering same-origin stylesheets loaded by `loadCSS()`. No external stylesheet URLs in the CSP concern surface area.
- **styles/styles.css**: Apache 2.0 license header preserved at lines 1-11. All seven boilerplate `var()` references remapped (confirmed by grep returning zero results). No `@import` directives. `main > div` pre-decoration fallback uses tokens. DDD-001 two-tier layout implemented: outer tier `main > .section > div` with three-step responsive padding; inner tier `main > .section > .default-content-wrapper` with `max-width: var(--measure)` and `padding-inline: 0`. Section spacing uses `margin-block: var(--section-spacing)` with `margin-block-start: 0` on first section. No `overflow: hidden` on `.default-content-wrapper` (per spec constraint). `border-radius` removed from `pre`. `line-height` in body and heading rules tokenized.
- **blocks/header/header.css**: All five remaps applied (lines 3, 21, 75, 248, 261). No boilerplate references remain.
- **blocks/footer/footer.css**: Single remap applied (line 2). No boilerplate references remain.
- **blocks/hero/hero.css**: Single remap applied (line 16). No boilerplate references remain.
- **Orphaned variable grep**: Zero results for all eight boilerplate variable names across `styles/` and `blocks/`.
- **drafts/layout-test.html**: Valid HTML5 with `<!doctype html>`, `lang="en"`, charset meta, viewport meta. Follows EDS markup conventions (bare `<div>` sections, no EDS class names added). Five sections covering reading width, code overflow, element spacing, two-tier geometry, and short content. Mobile narrow-viewport note documented inline.
- **AGENTS.md**: `tokens.css` added to project structure tree with load-order annotation.
