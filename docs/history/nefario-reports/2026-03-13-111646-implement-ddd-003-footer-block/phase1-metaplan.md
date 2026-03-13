## Meta-Plan

**Task**: Implement DDD-003 footer block — replace `blocks/footer/footer.css` with the
spec-compliant version and author the `/footer` fragment HTML.

---

### Planning Consultations

#### Consultation 1: CSS Implementation Approach
- **Agent**: frontend-minion
- **Planning question**: DDD-003 specifies a footer with no flexbox/grid, responsive padding via three breakpoints (< 600px / >= 600px / >= 900px), `text-align: center` below 600px and `left` above, and a top border on the inner content wrapper (not `<footer>`). The current `footer.css` is 20 lines of boilerplate with two known defects (`--color-background-soft` and hardcoded `1200px`). What is the minimal, correct CSS structure to fully implement the spec — covering all six selectors listed in DDD-003 — and what pitfalls should the implementation task prompt call out explicitly? Also, confirm the tablet breakpoint (>= 600px) is not already in the boilerplate file and would need to be added.
- **Context to provide**: `blocks/footer/footer.css` (current), `blocks/header/header.css` (DDD-002 precedent for focus ring and padding pattern), `styles/tokens.css` (all referenced tokens), `docs/design-decisions/DDD-003-footer.md` (full spec — especially the CSS Approach, Token Usage, and Responsive Behavior sections).
- **Why this agent**: Owns CSS authoring, understands EDS selector conventions, knows the header precedent pattern, and can identify edge cases like `margin` vs `margin-inline: auto` and `:any-link` vs `:link/:visited`.

#### Consultation 2: Accessibility Compliance Verification
- **Agent**: accessibility-minion
- **Planning question**: DDD-003 makes specific WCAG claims: `--color-text-muted` (#6F6A5E) at 4.89:1, `--color-link` (#5A7543) at 4.70:1 on `--color-background` (#F6F4EE), `--color-heading` (#3F5232) focus ring at 7.75:1, and `text-decoration: underline` as the load-bearing WCAG 1.4.1 non-color distinguisher. The LinkedIn link uses `aria-label="Ben Peter on LinkedIn"`. What should the execution task verify to confirm these claims hold in the implemented footer, and are there any additional WCAG 2.2 AA concerns (landmark, tab order, external link announcement) that the CSS implementation or fragment authoring needs to address?
- **Context to provide**: `docs/design-decisions/DDD-003-footer.md` (Accessibility findings, Interactions, HTML Structure, and Screen reader sections), `styles/tokens.css` (token values), existing `blocks/header/header.css` (focus ring pattern).
- **Why this agent**: Can verify the WCAG contrast arithmetic, confirm `:any-link` prevents visited-link color divergence issue, and flag whether `target="_blank"` needs a screen reader hint beyond `aria-label`.

---

### Cross-Cutting Checklist

- **Testing**: Include — lint must pass (`npm run lint`) and the Lighthouse accessibility score must remain 100. The execution task should include lint verification and note the Lighthouse check requirement.
- **Security**: Exclude — this is a CSS-only change with fragment HTML containing only static links. The LinkedIn link uses `rel="noopener"` per spec. No auth, no user input, no new dependencies.
- **Usability -- Strategy**: Include (mandatory). Planning question: The footer is a closing legal attribution line carrying zero wayfinding burden. DDD-003 is fully resolved with no open questions. Confirm the single-line inline text approach with three tab stops serves the user job (legal compliance + author attribution) without cognitive friction, and that no scope additions are warranted.
- **Usability -- Design**: Exclude for dedicated ux-design-minion consultation — DDD-003 fully specifies the visual treatment, spacing, and interactions. There is no open design decision. Accessibility review via accessibility-minion covers the WCAG requirements.
- **Documentation**: Exclude for dedicated docs consultation — scope explicitly calls out DDD-003 document updates as out of scope. No new API surface, no architectural change.
- **Observability**: Exclude — footer is a static CSS block with no runtime behavior, no logging, no metrics surface.

---

### Anticipated Approval Gates

This is a focused CSS implementation task with a complete, approved spec. The DDD-003 decision box has no open questions and the spec is deterministic. Expected gates:

- **One gate**: Completed `footer.css` + fragment HTML before PR creation. The CSS is easy to reverse (CSS change, additive) but has 2+ dependents (every page on the site uses the footer), which pushes it to OPTIONAL gate territory. Given the spec is fully settled, this gate is optional — include it as a notification rather than a blocking gate unless the execution skill mandates one.

---

### Rationale

Two consultations are sufficient:

1. **frontend-minion** has ownership of the CSS deliverable and can produce a precise, lint-compliant implementation. The planning question surfaces pitfalls (tablet breakpoint gap, `margin-inline` shorthand, `:any-link` usage) that would otherwise require a revision cycle.

2. **accessibility-minion** validates the WCAG claims made in DDD-003 before execution, ensuring the implementation task prompt encodes the correct verification steps. The footer's inline-text-with-links pattern has a specific WCAG 1.4.1 dependency on `text-decoration: underline` that is easy to break accidentally.

Agents not included:
- **iac-minion, data-minion, ai-modeling-minion**: No infrastructure, data, or AI surface.
- **security-minion**: Static HTML fragment, no auth or user input.
- **software-docs-minion / user-docs-minion**: Out of scope per the issue.
- **ux-design-minion**: DDD-003 fully specifies visual treatment; no open design decisions.
- **observability-minion / sitespeed-minion**: No runtime components; Lighthouse check is a verification step within execution, not a planning concern.
- **gru / product-marketing-minion**: No strategic technology decision or messaging work.

---

### Scope

**In scope:**
- `blocks/footer/footer.css` — full replacement implementing DDD-003 spec (six selectors, three responsive breakpoints, correct tokens)
- `/footer` fragment content authoring — the single `<p>` with inline links matching the HTML structure in DDD-003

**Out of scope (per issue):**
- `footer.js` — no changes
- Token value changes — already resolved in `styles/tokens.css`
- `docs/design-decisions/DDD-003-footer.md` updates
- Header block, other blocks
- Any new CSS tokens

---

### External Skill Integration

No external skills detected in project (`.claude/skills/` and `.skills/` directories not present).
