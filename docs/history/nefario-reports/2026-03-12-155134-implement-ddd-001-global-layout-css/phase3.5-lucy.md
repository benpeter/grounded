# Lucy Review: DDD-001 Global Layout Implementation Plan

## Verdict: ADVISE

The plan is well-structured, stays within declared scope, and faithfully implements the approved DDD-001 spec. Convention compliance is strong. I have three advisories -- two are minor alignment gaps with the original request, one is a convention note.

---

### Requirements Traceability

| Requirement (from prompt.md) | Plan Task | Status |
|---|---|---|
| Add `--layout-max`, `--content-padding-tablet`, `--space-paragraph`, `--space-element` to `tokens.css` | Task 1 | Covered |
| `tokens.css` loaded as `<link>` in `head.html` before `styles.css` | Task 2 | Covered |
| Boilerplate `:root` replaced wholesale with project tokens | Task 3 Phase A+B | Covered |
| Two-tier width model (`--layout-max` outer, `--measure` inner) | Task 3 Phase C | Covered |
| Responsive padding at all four breakpoints (base/600/900/1200) | Task 3 Phase C | See Advisory 1 |
| Section spacing with `--section-spacing`, first section no top margin | Task 3 Phase C | Covered |
| `.default-content-wrapper` does not use `overflow: hidden` | Task 3 boundary | Covered (explicit prohibition) |
| Test content in `drafts/` | Task 5 | Covered |
| `npm run lint` passes | Task 6 | Covered |
| Lighthouse score remains 100 | Task 6 | See Advisory 2 |
| Out of scope: header/footer internals | Task 4 | Clean -- only remaps `var()` names, no structural changes |
| Out of scope: typography details (DDD-005/006) | All tasks | Clean -- no heading sizes changed |

---

### Advisories

1. [SCOPE]: Responsive padding -- four breakpoints stated, three implemented
   SCOPE: `styles/styles.css` section layout rules (Task 3 Phase C)
   CHANGE: The prompt's success criteria state "Responsive padding progression works at all four breakpoints (base/600/900/1200)." The plan implements three media query tiers (base, 600px, 900px) but not a distinct 1200px tier. At 1200px+ the padding remains `--content-padding-desktop` (32px).
   WHY: This is actually correct behavior per DDD-001's responsive behavior table, which explicitly states the 1200px row uses "32px, unchanged." The success criteria's phrasing "all four breakpoints" is misleading -- there is no CSS change at 1200px because `--layout-max` handles that tier via `max-width`, not via a padding change. No code change needed, but the success criteria text in the prompt could be tightened to avoid confusion during verification. This is informational only.
   TASK: Task 3

2. [TRACE]: Lighthouse verification not covered in automated checks
   SCOPE: Task 6 verification suite
   CHANGE: The prompt's success criteria include "Lighthouse score remains 100 on local preview." Task 6 does not run a Lighthouse check. The cross-cutting coverage table (line 811) defers viewport verification to "human reviewer or post-push PageSpeed Insights."
   WHY: This is a reasonable deferral -- running Lighthouse programmatically from within an agent task is non-trivial and the change (one small CSS file addition, no new JS) has negligible performance risk. However, the gap between stated success criteria and actual verification should be acknowledged. The plan could note this explicitly as a human-verified criterion rather than leaving it implicit.
   TASK: Task 6

3. [CONVENTION]: AGENTS.md media query guidance says `min-width` but Stylelint enforces range notation
   SCOPE: `AGENTS.md` CSS code style guidelines
   CHANGE: AGENTS.md line 60 says "use `min-width` media queries at 600px/900px/1200px." The plan correctly uses `(width >= Npx)` range notation because Stylelint enforces it. The plan's Conflict Resolution #2 documents this. However, AGENTS.md itself is not being updated to reflect the actual enforced convention. Task 5 updates the project structure tree in AGENTS.md but does not fix the `min-width` text.
   WHY: After this plan executes, AGENTS.md will instruct agents to use `min-width` syntax while Stylelint rejects it. This contradiction already exists in the repo (it predates this plan), so it is not a blocking concern introduced by this plan. But since Task 5 is already editing AGENTS.md, it would be low-cost to fix the stale guidance in the same edit. This is advisory -- it can be a follow-up.
   TASK: Task 5

---

### Scope Containment

The plan adds one task not in the original prompt's In-scope list: **Task 4 (block CSS audit)**. This is justified and well-documented in Conflict Resolution #3. Without it, removing the boilerplate `:root` block would silently break `header.css`, `footer.css`, `cards.css`, and `hero.css`. The task is scoped to `var()` name remapping only -- no selectors, no structural changes, no header/footer internal work. This does not constitute scope creep; it is a necessary dependency of the requested work.

### CLAUDE.md Compliance

- **Design tokens as single source of truth**: Respected. All new values go into `tokens.css`; `styles.css` only references tokens.
- **No hardcoded hex values**: Respected. The plan replaces all hardcoded `1200px` / `24px` / `32px` in section rules with token references.
- **No rounded containers**: Addressed. Task 3 explicitly removes `border-radius: 8px` from the `pre` rule.
- **No cards with shadows, gradients, etc.**: No such elements introduced.
- **V1 out-of-scope features**: None introduced.
- **PR preview links**: Not in plan scope (plan is pre-PR), but `drafts/layout-test.html` provides the test content needed for a future PR preview link.

### AGENTS.md / EDS Convention Compliance

- **Mobile-first CSS**: Respected. Base styles are mobile, then `600px`, then `900px` media queries.
- **Selector scoping for blocks**: Not violated. Block CSS changes are `var()` name swaps only.
- **Three-phase loading**: `tokens.css` loads in `head.html` (eager phase). This is correct -- it must resolve before `styles.css`.
- **No modification of `aem.js`**: Respected.
- **`drafts/` folder and `--html-folder` flag**: Task 5 creates test content following EDS markup conventions. Task 6 starts the dev server with `--html-folder drafts`.

### Approval Gate Placement

Task 3 has an approval gate. This is the right choice -- it is the highest-risk change (deleting the boilerplate `:root` and remapping all `var()` references). The gate reason is clear and the risk is well-articulated. No other task warrants a gate.

---

### Summary

The plan is a faithful, well-scoped implementation of DDD-001. The three advisories are minor: one is informational (no code change needed), one is about verification coverage acknowledgment, and one is a pre-existing convention documentation inconsistency that could be fixed opportunistically. No blocking concerns.
