# Lucy Review -- DDD-001 Global Layout Implementation

## Verdict: ADVISE

The implementation is faithful to DDD-001 and CLAUDE.md. The boilerplate variable replacement, two-tier width model, responsive padding, and section spacing all trace cleanly to the approved design decision document. No scope creep, no gold-plating, no feature substitution. Four findings require attention, two of which are substantive.

---

## Traceability Matrix

| DDD-001 Requirement | Plan Element | File(s) | Status |
|---|---|---|---|
| Two-tier width model (layout-max + measure) | Section rules + default-content-wrapper | styles/styles.css:169-202 | PASS |
| Three-tier responsive padding (20/24/32px) | Three media query blocks | styles/styles.css:182-195 | PASS |
| Section spacing with --section-spacing | margin-block on .section | styles/styles.css:170-176 | PASS |
| Boilerplate :root removal | Entire boilerplate :root deleted | styles/styles.css | PASS |
| Variable remapping (8 boilerplate vars) | All var() references updated | styles/styles.css, blocks/*.css | PASS |
| tokens.css loaded before styles.css in head.html | Link order correct | head.html:9-10 | PASS |
| New tokens: --layout-max, --content-padding-tablet, --space-paragraph, --space-element | Added to spacing section | styles/tokens.css:68-71 | PASS |
| No overflow:hidden on .default-content-wrapper | Not present | styles/styles.css | PASS |
| No @import in stylesheets | Confirmed zero | styles/ | PASS |
| No orphaned boilerplate var() references | Confirmed zero in styles/ and blocks/ | all CSS | PASS |
| AGENTS.md updated with tokens.css | Project structure tree updated | AGENTS.md:35 | PASS |
| Drafts test page for layout verification | Created with EDS-correct markup | drafts/layout-test.html | PASS |
| Roboto @font-face fallbacks removed | Confirmed removed | styles/styles.css | PASS |
| border-radius removed from pre | Confirmed removed | styles/styles.css | PASS |
| License header retained | Present at top of file | styles/styles.css:1-11 | PASS |

---

## Findings

### 1. [ADVISE] head.html:3 -- CSP `style-src 'self'` directive added without documented justification

**CHANGE**: The original `head.html` CSP meta tag contained only `script-src`, `base-uri`, and `object-src` directives. The implementation added `style-src 'self'` to the CSP content attribute. This restricts stylesheet loading to same-origin only.

**WHY**: This addition was not specified in DDD-001, not mentioned in the phase3-synthesis plan (Task 2 says "Do NOT add any other links, scripts, or meta tags" and "Do NOT modify the existing styles.css link" -- it says nothing about modifying the CSP), and was not part of any task prompt. It is a security policy change that could block Google Fonts loading via external `<link>` tags if font CSS is loaded from fonts.googleapis.com rather than self-hosted. The project's CLAUDE.md Performance section states "No external dependencies beyond Google Fonts" -- confirming Google Fonts are an expected external dependency. If fonts are loaded via `@font-face` with self-hosted files this is harmless, but if a future DDD adds a Google Fonts `<link>` to `head.html`, the CSP will silently block it.

**AGENT**: frontend-minion (Task 2)
**FIX**: Verify whether this project loads Google Fonts via external stylesheet link or self-hosted @font-face. If external, either remove `style-src 'self'` or change to `style-src 'self' https://fonts.googleapis.com`. If self-hosted (as appears to be the case from the `fonts/` directory in the project structure), the directive is safe but should be documented as an intentional security hardening addition in the commit message, since it was not part of DDD-001 scope.

**SEVERITY**: SCOPE -- addition not traceable to any stated requirement.

---

### 2. [ADVISE] styles/styles.css:201 -- `padding-inline: 0` on `.default-content-wrapper` not specified in DDD-001

**CHANGE**: The inner-tier rule for `.default-content-wrapper` at line 198-202 includes `padding-inline: 0`, which zeroes out any padding inherited from the parent `main > .section > div` rule.

**WHY**: DDD-001 section "3. Two-tier width model" specifies this CSS for the inner tier:
```css
main > .section > .default-content-wrapper {
  max-width: var(--measure);
  margin-inline: auto;
}
```
That is two properties. The implementation adds a third: `padding-inline: 0`. This is not in the approved DDD. The `.default-content-wrapper` is a child of `main > .section > div`, not a direct child of `main > .section`, so it does not directly inherit the `padding-inline` set on its parent (padding is not an inherited property in CSS). The only scenario where this matters is if `.default-content-wrapper` itself has padding set by some other rule. Since no such rule exists in the current codebase, this line is technically a no-op, but it is still an undocumented deviation from the approved spec.

**AGENT**: frontend-minion (Task 3)
**FIX**: Either remove `padding-inline: 0` to match DDD-001 exactly, or keep it as a defensive reset and note the deviation in the commit message. The practical impact is nil.

**SEVERITY**: SCOPE -- minor addition not traceable to DDD-001.

---

### 3. [NIT] blocks/cards/cards.css:11 -- Hardcoded hex `#dadada` not replaced with token

**CHANGE**: The cards block border uses `border: 1px solid #dadada` (line 11). This was not changed during the block CSS audit (Task 4).

**WHY**: CLAUDE.md Design Tokens section states: "Use the CSS custom properties -- never hardcode hex values." Task 4's scope was limited to remapping the three boilerplate variable names (`--background-color`, `--light-color`, `--body-font-family`), which is correct per the plan. However, this hardcoded hex predates DDD-001 and remains a convention violation. The closest token would be `--color-border` (#C9C3B8). This is not a DDD-001 regression -- it is a pre-existing issue that the plan intentionally did not address ("These blocks are boilerplate that will be replaced by project-specific blocks in later DDDs; they just need to work for now").

**AGENT**: N/A (pre-existing)
**FIX**: No action required for this PR. Flag for cleanup when cards block is rebuilt per its own DDD.

**SEVERITY**: CONVENTION -- pre-existing, acknowledged as out of scope.

---

### 4. [NIT] blocks/footer/footer.css:8 and blocks/hero/hero.css:13 -- Hardcoded `1200px` not replaced with `var(--layout-max)`

**CHANGE**: `footer.css` line 8 uses `max-width: 1200px` and `hero.css` line 13 uses `max-width: 1200px`. Task 4 only remapped boilerplate variable names but did not convert these hardcoded pixel values to the new `--layout-max` token.

**WHY**: CLAUDE.md says "never hardcode hex values" which technically applies to colors, not pixel values. However, DDD-001 establishes `--layout-max: 1200px` as the canonical token for this value, and using the token would ensure these blocks respond to any future layout-max change. These are boilerplate blocks slated for replacement, so the risk is low.

**AGENT**: N/A (pre-existing, outside Task 4 scope)
**FIX**: No action required for this PR. When footer (DDD-003) and hero blocks are rebuilt, use `var(--layout-max)` instead of `1200px`.

**SEVERITY**: CONVENTION -- pre-existing, not a DDD-001 regression.

---

## CLAUDE.md Compliance

| Directive | Status | Notes |
|---|---|---|
| tokens.css is single source of truth | PASS | All new values defined in tokens.css, referenced via var() |
| Never hardcode hex values | PASS (in changed files) | styles.css has zero hardcoded hex. Pre-existing `#dadada` in cards.css not in scope. |
| No rounded containers | PASS | `border-radius: 8px` on `pre` removed. Button `border-radius: 2.4em` retained (buttons are UI controls, not containers). |
| No cards with shadows, gradients | PASS | No new shadows or gradients introduced |
| Typography creates hierarchy | PASS | Line heights remapped to tokens |
| EDS three-phase loading | PASS | tokens.css in head.html (eager phase) |
| WCAG 2.2 AA | NOT TESTED | Layout geometry only; no color or interaction changes |
| Performance <100KB | PASS | tokens.css is ~2KB; net change to styles.css is minimal |
| Mobile-first, min-width queries | PASS | Range notation (`width >= Npx`) used per Stylelint enforcement. AGENTS.md updated to document this. |

## AGENTS.md Update Review

| Change | Correct? | Notes |
|---|---|---|
| tokens.css added to project structure tree | YES | Placed first in styles/ with load-order annotation |
| CSS section updated with range notation guidance | YES | Line 61: documents that `stylelint-config-standard` v40 enforces range notation and `min-width` will fail lint. This is accurate and prevents future agent errors. |
| No other AGENTS.md sections modified | YES | Scope contained to project structure and CSS guidance |

## Drafts Test File Review

`drafts/layout-test.html` follows EDS markup conventions correctly:
- Bare `<div>` elements inside `<main>` (no `.section` classes)
- Empty `<header>` and `<footer>` elements
- Proper HTML5 document structure with `lang="en"`
- Five sections testing: reading width, code block overflow, element spacing, two-tier geometry, short content
- The test page has 5 sections vs the plan's 4. Section 4 ("Two-Tier Layout Demonstration") was added by the implementing agent. This is a reasonable test enhancement that does not affect any shipped code.

## Scope Assessment

The implementation stays within DDD-001 scope with two minor exceptions noted in findings #1 and #2. No features were added beyond what DDD-001 specifies. Block CSS changes were limited to variable name remapping (mandatory to prevent breakage). No new abstractions, no new dependencies, no technology expansion.
