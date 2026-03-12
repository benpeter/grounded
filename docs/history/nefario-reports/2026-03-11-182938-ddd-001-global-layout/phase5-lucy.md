# DDD-001 Global Layout -- Alignment & Convention Review

**Reviewer:** Lucy (consistency guardian)
**File:** `/Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-001-global-layout.md`

---

## VERDICT: ADVISE

The DDD follows the template structure faithfully, aligns with CLAUDE.md aesthetic rules and site-structure constraints, and correctly identifies which tokens exist vs. need creation. Two findings require adjustment before an implementation agent can execute cleanly; the rest are minor.

---

## FINDINGS

### [ADVISE] DDD-001-global-layout.md:301-302 -- Incorrect CSS centering comment will mislead implementation agent

The CSS Approach section states:

```css
main > .section > .default-content-wrapper {
  max-width: var(--measure);
  /* inherits margin-inline: auto from parent centering */
}
```

`margin-inline: auto` on the parent (`main > .section > div`) centers the parent within `.section`. CSS margin properties are not inherited. The child `.default-content-wrapper` with `max-width: var(--measure)` will be left-aligned within its parent unless it explicitly has its own `margin-inline: auto`. An implementation agent reading this comment literally will produce a reading column flush-left within the 1200px container instead of centered.

**Category:** COMPLIANCE (factual accuracy affecting implementation correctness)

**FIX:** Replace the comment with an explicit declaration:

```css
main > .section > .default-content-wrapper {
  max-width: var(--measure);
  margin-inline: auto;
}
```

---

### [ADVISE] DDD-001-global-layout.md:249-254 -- Token loading strategy contradicts existing tokens.css inline comment

The DDD proposes loading `tokens.css` as a separate `<link>` in `head.html`:

```html
<link rel="stylesheet" href="/styles/tokens.css" />
<link rel="stylesheet" href="/styles/styles.css" />
```

However, `styles/tokens.css` line 5 says: `Import this at the top of styles.css: @import url('tokens.css');`. An implementation agent will encounter conflicting guidance: the DDD says separate `<link>`, the file itself says `@import` inside `styles.css`.

Either approach works, but the DDD should explicitly state that the `tokens.css` file comment is superseded by this decision and must be updated when implementing. Otherwise the implementing agent may `@import` instead of adding a `<link>`, or add both.

**Category:** CONVENTION (conflicting instructions between DDD and existing file)

**FIX:** Add a note in the CSS Approach section: "The `@import` comment in `tokens.css` line 5 is superseded by this approach. The implementing agent must update that comment to reflect the `<link>` loading strategy."

---

### [NIT] DDD-001-global-layout.md:147 -- Body font size description has inverted mobile/desktop labels

Line 147-148 reads:

> Body text: `--font-body` ('Source Sans 3'), `--body-font-size-m` (20px mobile / 18px desktop at >= 900px).

This is factually correct per `tokens.css` (20px default, 18px at >=900px). However, the phrasing "20px mobile / 18px desktop" is slightly counterintuitive -- mobile text is larger than desktop. This is intentional per the token definitions, but a reader may assume it is a typo. No change needed unless the author wants to add a brief rationale (e.g., "larger mobile size compensates for closer viewing distance").

**Category:** CONVENTION (clarity)

**FIX:** Optional. Could add: "(mobile is intentionally larger to compensate for smaller viewport and closer viewing distance)" if the author wants to preempt questions.

---

### [NIT] DDD-001-global-layout.md:224 -- Misplaced HTML comment creates ambiguity

Line 224: `<!-- Outer section div: constrained to --layout-max (1200px) -->` appears after the closing `</div>` for the first `.section` block. It reads as an annotation for the second section below rather than the first section above. This could confuse an implementation agent about which element the constraint applies to.

**Category:** CONVENTION (clarity of HTML Structure section)

**FIX:** Move the comment inside the `<div class="section">` block it describes, immediately after the opening tag on line 206.

---

## TEMPLATE COMPLIANCE CHECK

| Template Section | Present | Notes |
|---|---|---|
| `# DDD-{NNN}: {Surface Name}` | Yes | `DDD-001: Global Layout` |
| `Status:` | Yes | `Proposal` |
| `## Context` | Yes | Thorough. References CLAUDE.md, tokens.css, site-structure.md, AGENTS.md |
| `## Proposal > Layout` | Yes | Four wireframes covering all breakpoints |
| `## Proposal > Typography` | Yes | Appropriately defers detail to DDD-005/006 |
| `## Proposal > Spacing & Rhythm` | Yes | Three-tier scale with heading asymmetry |
| `## Proposal > Responsive Behavior` | Yes | Four-tier breakpoint table |
| `## Proposal > Interactions` | Omitted | Template marks this optional. Acceptable for a layout surface. |
| `## HTML Structure` | Yes | Full page skeleton with annotations |
| `## CSS Approach` | Yes | Five subsections with code examples |
| `## Token Usage` | Yes | 14 entries with Existing/Proposed status |
| `## Open Questions` | Yes | 5 questions, all well-scoped |
| `## Decision` | Yes | Checkbox format matches template |

All required sections present. Template compliance is complete.

---

## CLAUDE.md ALIGNMENT CHECK

| CLAUDE.md Directive | DDD Compliance | Notes |
|---|---|---|
| `tokens.css` is single source of truth | Compliant | DDD references tokens by name, proposes new tokens clearly marked |
| Never hardcode hex values | Compliant | All values reference CSS custom properties |
| Warm white paper dominant | Compliant | Wireframes show background as the primary visual |
| No cards/shadows/gradients/rounded containers | Compliant | No such elements proposed |
| Typography creates hierarchy | Compliant | Heading spacing asymmetry, no color blocks |
| Single-column, no sidebar | Compliant | Two-tier width model is single-column |
| Header: logo + tagline only | Compliant | DDD defers header internals to DDD-002 |
| <100KB, Lighthouse 100 | Compliant | No new dependencies, pure CSS layout |
| WCAG 2.2 AA | Compliant | Focus ring contrast flagged as Open Question #5 |
| Mobile-first, min-width queries | Compliant | CSS examples follow mobile-first order |
| EDS three-phase loading | Compliant | Token loading in eager phase via `head.html` |

No CLAUDE.md violations detected.

---

## SCOPE CHECK

No scope creep detected. The DDD stays within the "Global Layout" surface as defined in the README inventory: "Page chrome, max-width, margins, breakpoints." Cross-references to other DDDs (002, 003, 005, 006) are appropriate deferrals, not scope expansion.

---

## TOKEN STATUS VERIFICATION

Verified against `/Users/ben/github/benpeter/mostly-hallucinations/styles/tokens.css`:

| Token | DDD Status | Actual Status | Match |
|---|---|---|---|
| `--layout-max` | Proposed | Absent from tokens.css | Correct |
| `--content-padding-tablet` | Proposed | Absent from tokens.css | Correct |
| `--space-paragraph` | Proposed | Absent from tokens.css | Correct |
| `--space-element` | Proposed | Absent from tokens.css | Correct |
| `--measure` | Existing | Present (line 60) | Correct |
| `--content-padding-mobile` | Existing | Present (line 66) | Correct |
| `--content-padding-desktop` | Existing | Present (line 67) | Correct |
| `--section-spacing` | Existing | Present (line 65) | Correct |
| `--nav-height` | Existing | Present (line 64) | Correct |

All token status labels are accurate.
