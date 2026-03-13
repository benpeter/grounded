# Margo Review: DDD-004 Home Post Index Plan

## Verdict: ADVISE

The plan is correctly scoped: one task, one deliverable, one approval gate. The complexity is proportional to the problem. Two non-blocking concerns.

### Concerns

- [simplicity]: Task prompt is excessively prescriptive, dictating exact HTML down to attribute values
  SCOPE: Task 1 prompt (lines 269-461 of phase3-synthesis.md)
  CHANGE: The prompt contains ~200 lines of near-verbatim spec that the writing agent must transcribe into DDD format. The "Resolved Design Spec" section (lines 115-255) already captures every decision. The task prompt then repeats almost all of it a second time with minor reformatting. Trim the task prompt to: (1) point the agent at the Resolved Design Spec as the authoritative source, (2) list the DDD sections required, (3) list the "What NOT to Do" constraints, and (4) point at DDD-003 as the format reference. This cuts the prompt roughly in half without losing any information. The current duplication risks the agent following one version when the two diverge on a detail.
  WHY: Duplicated specifications are a maintenance and coherence risk. If a decision changes during review, it must be updated in two places within the same document. The writing agent needs the decisions and the format -- not the decisions stated twice.
  TASK: 1

- [simplicity]: The dual accessibility pattern for type badges (aria-hidden visible badge + sr-only prefix inside h2) adds implementation fragility for marginal gain
  SCOPE: Conflict Resolution #4 (type badge accessibility pattern), HTML Structure
  CHANGE: No change to the plan needed -- this is an ADVISE, not a block. Flag this as worth noting in the DDD's Open Questions: the simpler alternative is placing the type badge text inside the `<h2>` directly (e.g., `<span class="post-type">Build Log:</span> Title`) with CSS styling, which eliminates the aria-hidden/sr-only duplication pattern entirely. The current pattern has three coordinated elements (visible badge outside h2 with aria-hidden, sr-only span inside h2, matching text in both). If any one is omitted or mismatched during implementation, accessibility degrades silently. The simpler pattern has one element. The accessibility-minion may have reasons to prefer the dual pattern, but the complexity cost should be acknowledged.
  WHY: Three-element coordination patterns are fragile under maintenance. The simpler single-element alternative achieves the same screen reader outcome with fewer moving parts. The DDD should at least acknowledge the tradeoff.
  TASK: 1
