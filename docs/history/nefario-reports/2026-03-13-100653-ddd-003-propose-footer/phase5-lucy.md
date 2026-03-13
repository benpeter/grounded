# Lucy Review: DDD-003-footer.md

**VERDICT: ADVISE**

Minor issues found; the document can proceed with noted adjustments.

---

## Summary

DDD-003 is a thorough, well-structured footer design decision document. It faithfully follows the DDD template from `docs/design-decisions/README.md`, respects CLAUDE.md aesthetic rules, correctly reflects the footer content from `docs/site-structure.md`, and carries a `Proposal` status. Depth is comparable to DDD-002. All token references are verified against `styles/tokens.css`. The ASCII wireframes use only ASCII characters. Open Questions are genuinely unresolved and appropriately scoped. The document accurately describes the current boilerplate state of `footer.css` and `footer.js`.

Two findings warrant attention before approval.

---

## Template Compliance

| Required Section (per README.md) | Present | Notes |
|---|---|---|
| Title `DDD-{NNN}: {Surface Name}` | Yes | `DDD-003: Footer` |
| Status | Yes | `Proposal` -- correct |
| Context | Yes | Thorough, with governing constraints subsection |
| Proposal > Layout | Yes | With wireframes |
| Proposal > Typography | Yes | Table format |
| Proposal > Spacing & Rhythm | Yes | Table format |
| Proposal > Responsive Behavior | Yes | Table format |
| Proposal > Interactions (optional) | Yes | Table format |
| HTML Structure | Yes | Both authored and decorated DOM |
| CSS Approach | Yes | Key selectors and rationale |
| Token Usage | Yes | Full table, all verified existing |
| Open Questions (optional) | Yes | Three questions, all genuinely unresolved |
| Decision | Yes | Unchecked checkboxes, reviewer notes placeholder |

All required sections present. No missing sections.

---

## CLAUDE.md Compliance

| Directive | Status |
|---|---|
| `--color-background` is the dominant visual | Compliant -- explicitly replaces boilerplate `--color-background-soft` |
| No cards, shadows, gradients, rounded containers | Compliant -- no such elements proposed |
| Typography creates hierarchy, not color blocks | Compliant -- single `<p>`, no visual boxes |
| Borders almost melt into background | Compliant -- `--color-border-subtle` |
| `--color-accent` at most once per screen | Compliant -- no accent color used |
| Use CSS custom properties, never hardcode hex | Compliant -- all hex values appear only as token documentation, not in proposed CSS |
| V1 exclusions (no newsletter, RSS, social icons, etc.) | Compliant -- explicitly listed as excluded |
| WCAG 2.2 AA compliance | Partially addressed -- see Finding 1 |

---

## Site-Structure Compliance

The footer content in DDD-003 matches `docs/site-structure.md` exactly:

| site-structure.md requirement | DDD-003 coverage |
|---|---|
| `(c) 2026 Ben Peter . LinkedIn . Legal Notice . Privacy Policy` | Matched verbatim in wireframes and HTML |
| "Ben Peter" and "LinkedIn" are separate text links | Matched in HTML; alternative proposed as Open Question 1 |
| LinkedIn is single social link | Matched |
| No icons | Matched |
| Legal Notice and Privacy Policy required (German law) | Matched, with DDG/DSGVO citations |
| Separate pages, linked from footer, not indexed | Matched (`/legal`, `/privacy`) |
| No bio, headshot, "about the author" | Matched |

---

## Findings

### 1. [ADVISE] DDD-003-footer.md:56-58 -- Accessibility findings claim is imprecise about CLAUDE.md

CHANGE: Lines 78-79 of CLAUDE.md state "All color pairings in `styles/tokens.css` are verified for contrast compliance." DDD-003 Open Questions 2 and 3 identify that `--color-text-muted` (3.82:1) and `--color-link` (2.85:1) both fail WCAG AA 4.5:1 on `--color-background`. The DDD correctly identifies these as site-wide token issues rather than footer-specific ones. However, line 22 of `tokens.css` contains the comment "WCAG AA compliant on --color-background" for `--color-text-muted`, which is factually incorrect at 3.82:1.

WHY: CLAUDE.md's Accessibility section claims "All color pairings in `styles/tokens.css` are verified for contrast compliance." The DDD has uncovered that this claim is false for at least two tokens. This is not a DDD defect -- it is a valuable finding. However, the DDD should explicitly note the CLAUDE.md contradiction, not just the `tokens.css` comment.

AGENT: software-docs-minion

FIX: In Open Question 2 or 3, add a sentence noting that CLAUDE.md's Accessibility section ("All color pairings in `styles/tokens.css` are verified for contrast compliance") is contradicted by these findings and should be corrected when the token-level contrast issue is resolved. This creates a traceable audit trail for the CLAUDE.md inaccuracy.

### 2. [ADVISE] DDD-003-footer.md:82 -- Wireframe border visualization is ambiguous

CHANGE: In the mobile wireframe (lines 78-94), line 82 shows `<-- 1px --color-border-subtle ------------->` followed by a dotted line on line 83. In the desktop wireframe (lines 101-116), the same pattern appears. The dotted line (`.....`) visually suggests the border, but the annotation line above it is the one describing the border. The relationship between the annotation and the visual representation is unclear -- it is not obvious whether the dots or the dashes represent the border.

WHY: DDD-002's wireframes use `......` consistently for the border line with a label below it. DDD-003 places the label above the dots. This inconsistency between the two DDDs could cause confusion during implementation review.

AGENT: software-docs-minion

FIX: Match DDD-002's wireframe convention: place the dotted line first, then the annotation below it. In DDD-002, the border appears as `|.................................................|` followed by the label. Adopt the same ordering in DDD-003 for consistency across the DDD series.

### 3. [NIT] DDD-003-footer.md:187 -- `target="_blank"` on authored HTML fragment may not survive CMS round-trip

CHANGE: The authored `/footer` fragment HTML on line 187 includes `target="_blank" rel="noopener"` directly on the LinkedIn `<a>` tag. This is CMS-authored content -- the fragment goes through the EDS content pipeline.

WHY: EDS content authored in Google Docs or SharePoint may strip or normalize HTML attributes like `target` and `rel` during the `.plain.html` conversion. If the authored content source is the CMS (not a committed HTML file), these attributes may need to be applied in `decorate()` rather than relying on the authored markup. The DDD states that `footer.js` does not need changes, which could be incorrect if the CMS strips these attributes.

AGENT: software-docs-minion

FIX: Add a note in the HTML Structure section acknowledging that `target="_blank" rel="noopener"` may need to be applied programmatically in `decorate()` if the CMS content pipeline strips these attributes. This does not change the design decision but flags a known implementation concern.

---

## Scope Assessment

No scope creep detected. The DDD is tightly scoped to the footer surface. It explicitly excludes V1 out-of-scope items, defers token-level contrast issues to separate reviews, and proposes no new tokens or JS changes. The three Open Questions are all genuine decision points that require human input. The document does not propose features beyond what site-structure.md and CLAUDE.md require.

## Depth Comparison with DDD-002

DDD-003 is comparable in depth to DDD-002. Both documents follow the same structural pattern: governing constraints, wireframes for mobile and desktop, typography table, spacing table, responsive behavior table, interaction table, authored and decorated HTML, CSS approach with key selectors, and token usage table. DDD-003 is appropriately shorter than DDD-002 because the footer is a simpler surface (no corruption effects, no custom `decorate()` logic, no SVG filters). The ratio of documentation depth to design complexity is proportional.
