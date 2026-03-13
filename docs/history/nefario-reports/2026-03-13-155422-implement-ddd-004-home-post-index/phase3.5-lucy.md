# Lucy Review: DDD-004 Home Post Index Implementation Plan

## Verdict: ADVISE

The plan faithfully implements DDD-004 with good traceability from requirements to tasks. Three issues need attention before or during execution.

---

### Finding 1: CSS padding contradiction with DDD-004 spec

**Type**: COMPLIANCE
**Severity**: Medium
**Location**: Task 2 prompt, item 1: "Block-level: `max-width: var(--measure); margin-inline: auto; padding-inline: 0`"

**CHANGE**: Task 2 instructs `padding-inline: 0` on the `.post-index` block element, with the rationale that "the wrapper already has padding from `main > .section > div`."

**WHY this is flagged**: DDD-004's "Spacing & Rhythm" table (lines 254-256) explicitly specifies responsive `padding-inline` using `--content-padding-mobile` (20px), `--content-padding-tablet` (24px), and `--content-padding-desktop` (32px) on the block. The Responsive Behavior table (lines 264-266) repeats these values per breakpoint. The plan's `padding-inline: 0` contradicts the design spec. The plan may be correct about EDS section wrappers already providing this padding, but if so, DDD-004 is wrong and should be updated -- the implementation should not silently diverge from the spec.

**Fix**: Either (a) implement the responsive padding as DDD-004 specifies, or (b) verify that EDS section wrappers provide equivalent padding and update DDD-004's Spacing & Rhythm and Responsive Behavior tables to reflect the actual approach. The Task 2 prompt should not silently override the spec without documenting why.

---

### Finding 2: `drafts/` directory not in `.gitignore`

**Type**: CONVENTION
**Severity**: Low
**Location**: Task 3 prompt, deliverable 3: "Verify `drafts/` is excluded from git tracking (check .gitignore/.hlxignore)"

**CHANGE**: Task 3 creates test HTML files in `drafts/` and asks the agent to verify the directory is excluded from git tracking.

**WHY this is flagged**: The current `.gitignore` does not include `drafts/`. The `.hlxignore` excludes `*.plain.html` and `*.md` but not regular `.html` files in arbitrary directories. The task says "verify" but should say "add `drafts/` to `.gitignore` if not already present." Without an explicit instruction, the agent may check, find it missing, and either commit the test files or do nothing.

**Fix**: Change Task 3's prompt to explicitly instruct: "Add `drafts/` to `.gitignore` if it is not already listed."

---

### Finding 3: DDD-004 status changed to "Implemented" before formal approval

**Type**: DRIFT
**Severity**: Low
**Location**: Task 4 prompt, Part B: "Change the status line from `Status: **Proposal**` to `Status: **Implemented**`"

**CHANGE**: Task 4 changes DDD-004's status directly from "Proposal" to "Implemented," skipping the approval step.

**WHY this is flagged**: DDD-004 has an unchecked approval checkbox and a "Reviewer Notes" section that says "_Human writes here during review._" The decision was never formally approved. Changing status to "Implemented" implies approval happened. This is a minor process gap -- the user likely considers the prompt itself as implicit approval -- but the document's own structure suggests an intermediate "Approved" state was intended.

**Fix**: Either (a) change status to "Implemented" as planned and accept this as implicit approval via the implementation request, or (b) check the "Approved" box and then set status to "Implemented." Either way, this is a judgment call for the human, not a blocker.

---

### Traceability Check

| Requirement (from prompt.md) | Plan task |
|---|---|
| `blocks/post-index/post-index.js` and `.css` exist | Task 2 |
| `helix-query.yaml` with correct columns and include path | Task 1A |
| Home page renders entries matching DDD-004 DOM structure | Task 2 (DOM) + Task 3 (wiring) |
| All design tokens map to existing CSS custom properties | Task 2 (all 17 selectors use tokens from tokens.css) |
| Type badges as uppercase text-only labels via CSS | Task 2 (selector 4) |
| Tag slug validation `/^[a-z0-9-]+$/` | Task 2 (item 11) |
| DOM built via createElement, no innerHTML | Task 2 (item 14) |
| Visually hidden h1 first in main DOM order | Task 2 (item 5) + Task 3 (main.prepend) |
| Focus indicators match DDD-002/DDD-003 | Task 2 (selectors 8, 17) |
| `.sr-only` utility class defined | Task 1B |
| Empty state: no articles when zero results | Task 2 (item 15) |
| `npm run lint` passes | All tasks |
| Local dev server renders correctly | Task 3 (test content) |
| Resolve DDD-004 Open Questions | Task 4 Part B (OQ resolutions) |

**Coverage**: All 14 stated requirements trace to plan tasks. No orphaned tasks (all trace back to requirements or DDD-004 spec). No unaddressed requirements.

### CLAUDE.md Compliance

- **Design tokens**: All CSS uses tokens from `tokens.css`. No hardcoded hex values. No new tokens.
- **No frameworks**: Vanilla JS/CSS only. No dependencies introduced.
- **Performance**: Block is text-only, client-side fetch of small JSON. Well within <100KB target.
- **Accessibility**: WCAG 2.2 AA addressed via sr-only h1, aria-labelledby, aria-hidden, focus-visible rings, semantic HTML.
- **V1 exclusions**: No pagination, no filtering, no RSS, no search, no dark mode toggle. Plan respects all exclusions.
- **PR preview links**: Not in scope of this plan (PR creation is a post-execution step), but the plan references the correct preview URL format in verification step 8.
- **EDS conventions**: Block follows `blocks/{name}/{name}.js` + `.css` pattern. Auto-block follows established `buildAutoBlocks` pattern. Lint verification included in every task.

### Scope Assessment

No scope creep detected. The four tasks map directly to the stated deliverables: infrastructure (helix-query.yaml, sr-only), block implementation, wiring + test content, documentation. Task count is proportional to the work.
