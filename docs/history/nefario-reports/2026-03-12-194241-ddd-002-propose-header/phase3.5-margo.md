# Margo Review: DDD-002 Header Plan

## Verdict: ADVISE

The plan is a single task (one agent, one file, one deliverable) that writes a design decision document. The scope is proportional to the problem. No services, no dependencies, no infrastructure, no runtime code. The delegation structure is clean.

Three concerns worth flagging:

### 1. Corrupted Letterforms Specification: Overspecified for a Proposal-status DDD

The corruption map (14-row table with pixel-level descriptions of each letter's treatment) is the right level of detail for an implementation spec, but premature for a DDD at Proposal status. The human reviewer has not yet approved the concept. If they approve with changes -- say, different letters or different corruption types -- a large, tightly-coupled specification needs significant rework.

**The concept is essential complexity; the pixel-level glyph table is premature detail.** The DDD should specify the corruption *rules* (5 of 14 letters, no adjacent, density increases rightward, structural legibility preserved, clean "Mostly" as contrast) and defer the exact letter map to an implementation brief or a second pass after the Proposal is approved.

**Simpler alternative**: Keep the corruption rules and the testability criterion ("1-second recognition test"). Move the 14-row letter-by-letter map to a "Suggested corruption map" subsection clearly marked as illustrative, not normative. This preserves the design intent without creating rework cost if the reviewer adjusts the concept.

**Severity**: Non-blocking. The document will still be useful either way. This is about reducing rework risk if the reviewer iterates on the corruption concept.

### 2. Two Implementation Approaches in CSS Approach Section: Justified but Watch the Depth

Documenting both CSS-only and SVG approaches in the CSS Approach section is appropriate because the choice cannot be resolved without seeing rendered output. However, the plan prompt goes into significant detail on both (strengths, limitations, hybrid recommendations). For a DDD that says "we recommend starting with A and escalating to B," the CSS Approach section should stay brief on both paths rather than becoming a comparative analysis. The implementation agent needs enough to understand the tradeoff, not a decision matrix.

**Simpler alternative**: Two short paragraphs per approach (what it is, what it can and cannot achieve), plus the "start with A, escalate to B" recommendation. The implementation agent will discover the detailed tradeoffs during prototyping.

**Severity**: Non-blocking. Excess detail in a design doc is a minor cost -- it does not create accidental complexity in the codebase.

### 3. Open Question #4 (Chromatic Aberration) and #5 (Favicon): Scope Creep Signals

Open Question #4 proposes a "chromatic aberration enhancement" -- a CSS ::after pseudo-element with a 1px-offset ghost at 8% opacity. This is a nice-to-have visual effect not mentioned in the original request or brand identity. It is a gold-plating signal. If it belongs anywhere, it belongs in a future enhancement ticket, not in the initial header DDD.

Open Question #5 asks whether the favicon/social avatar should be in scope. The original request explicitly scopes this to the header treatment. The answer is obviously "no, separate task" -- raising the question in the DDD invites scope creep.

**Simpler alternative**: Drop Open Question #4 entirely. Replace Open Question #5 with a one-line note: "Favicon and social avatar are tracked separately per the Surface Inventory."

**Severity**: Non-blocking. These are open questions, not proposed features. But including them in the DDD creates a surface for scope expansion during review.

---

## Summary

The plan is well-scoped: one task, one agent, one document, clear success criteria. The concerns above are all non-blocking advisory items about detail level and minor scope creep signals within the DDD content itself. The delegation structure does not need changes.

Complexity budget: effectively zero (it is a markdown file). No technology, no services, no dependencies, no abstractions. The plan is proportional to the problem.
