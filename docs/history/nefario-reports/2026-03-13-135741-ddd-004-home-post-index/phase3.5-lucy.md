# Lucy Review: DDD-004 Home Page Post Index

## Verdict: ADVISE

The plan is well-aligned with the original request overall. The deliverable (a single DDD document), the scope (post index layout only), the format (matching DDD-001 through DDD-003 conventions), and the file path are all correct. CLAUDE.md compliance is strong: ASCII-only wireframes are explicitly mandated, all design tokens reference existing values in `styles/tokens.css`, V1 exclusions are respected, and the aesthetic rules are followed. The plan has one intent misalignment and two minor findings.

---

### Findings

- [DRIFT]: Type badge "identical treatment" contradicts the original request's "distinct but understated" requirement
  SCOPE: Type badge visual treatment (Conflict Resolution #7, Resolved Design Spec "Type Badge" section, Task 1 prompt "What NOT to Do" bullet)
  CHANGE: The original request's success criteria state: "Four type badges defined (build-log, pattern, tool-report, til) with **distinct but understated** visual treatment." The plan resolves to "All four types identical visual treatment -- no per-type color or styling" and the Task 1 prompt includes an explicit prohibition: "Do NOT create per-type color differentiation for type badges. All four types are visually identical." This directly contradicts a stated success criterion. Either (a) the plan should explore a minimal visual distinction between types (e.g., subtle per-type muted colors from existing tokens, or different text treatments) while keeping the treatment understated, or (b) the plan should acknowledge this deviation explicitly and flag it as an Open Question for the human reviewer to resolve, rather than hardcoding the "identical" decision and prohibiting alternatives.
  WHY: The original prompt uses "distinct" deliberately -- it asks for differentiation, not uniformity. Overriding this without flagging it as a deviation is goal drift. The human reviewer should make this call.
  TASK: 1

- [CONVENTION]: Task 1 prompt specifies `(c)` in wireframe examples instead of the actual copyright symbol representation
  SCOPE: Task 1 prompt, wireframe examples in "Layout" subsection (lines 316-319 of the synthesis)
  CHANGE: The wireframe example content in the resolved design spec shows `March 12, 2026 . aem . eds . performance` with periods, while the actual separator is a middot. This is fine for ASCII wireframes. No change needed -- noting for completeness that the writing agent should use descriptive labels in wireframes rather than attempting to reproduce exact typography.
  WHY: Non-issue on review. Withdrawn.

- [COMPLIANCE]: DDD README template says "Use box-drawing characters" but CLAUDE.md says ASCII-only -- plan correctly follows CLAUDE.md
  SCOPE: `docs/design-decisions/README.md` line 36: "ASCII wireframe showing spatial arrangement. Use box-drawing characters."
  CHANGE: The README template contains the instruction "Use box-drawing characters" which contradicts the global CLAUDE.md rule requiring pure ASCII (`+`, `-`, `|`, etc.) and never Unicode box-drawing. The plan correctly follows CLAUDE.md (higher authority), but the README template itself has a stale directive that could confuse agents. Consider updating the README template to say "Use ASCII box-drawing" or "Use pure ASCII characters" to prevent future confusion.
  WHY: CLAUDE.md is the higher-priority instruction source. The plan is compliant. This is a housekeeping note for the README, not a blocker for this plan.
  TASK: N/A (project convention hygiene)

---

### Traceability

| Original Requirement | Plan Element | Status |
|---|---|---|
| DDD-004 exists at docs/design-decisions/ | Task 1 deliverable path | Covered |
| Each entry shows type badge, title, description, date, tags | Resolved Design Spec "Visual Hierarchy" | Covered |
| Four type badges with distinct but understated treatment | Resolved to identical treatment | **Drift** |
| Reverse chronological, no pagination/featured/hero/shadows | Resolved Design Spec "Data Source" sort + V1 exclusions in prompt | Covered |
| ASCII wireframe at mobile and desktop | Task 1 prompt "Layout" subsection | Covered |
| Semantic HTML (article, time, heading hierarchy) | Resolved Design Spec "HTML Structure" | Covered |
| Token Usage table maps to styles/tokens.css | Task 1 prompt section 6, all tokens verified as Existing | Covered |
| Status is "Proposal" | Task 1 prompt section 1 | Covered |
| Format matches README.md template | Task 1 prompt "Format Requirements" | Covered |

### Token Verification

All tokens referenced in the Resolved Design Spec exist in `styles/tokens.css`:
- `--font-heading` (Source Code Pro) -- line 40
- `--font-body` (Source Sans 3) -- line 39
- `--body-font-size-xs` (15px mobile / 14px desktop) -- lines 47, 99
- `--heading-font-size-m` (22px mobile / 21px desktop) -- lines 53, 103
- `--body-font-size-s` (17px mobile / 16px desktop) -- lines 46, 98
- `--color-text-muted` (#6F6A5E) -- line 22
- `--color-heading` (#3F5232) -- line 25
- `--color-text` (#3A3A33) -- line 21
- `--color-link` (#5A7543) -- line 26
- `--color-border-subtle` (#EFE9DD) -- line 31
- `--section-spacing` (48px) -- line 65
- `--measure` (68ch) -- line 60
- `--line-height-body` (1.7) -- line 58
- `--line-height-heading` (1.25) -- line 59
- `--content-padding-mobile/tablet/desktop` -- lines 66-69

No proposed or missing tokens. Clean.

### Scope Assessment

No scope creep detected. The plan produces exactly one document. The conflict resolutions are design decisions that belong in a DDD. The data source documentation (helix-query.yaml, query-index.json) is appropriately scoped as a prerequisite note, not as an implementation task. The plan explicitly excludes implementation code.

### Summary

One actionable finding: the type badge "identical treatment" decision contradicts the original request's "distinct but understated" language. The recommended fix is to either (a) add per-type visual distinction using existing tokens or (b) convert this from a hard decision to an Open Question in the DDD so the human reviewer can weigh in. The "Do NOT create per-type color differentiation" prohibition in the Task 1 prompt should be softened accordingly.
