# Margo Review: DDD-001 Global Layout

## Verdict: ADVISE

The plan is a single-task delegation producing one design document. That is proportional to the request. No code is written, no dependencies are added, no infrastructure is introduced. The scope is well-bounded and the "What NOT to Include" section is disciplined. The single-task, single-agent, single-gate structure is about as simple as a delegation plan can be.

Three concerns, all non-blocking:

---

- [simplicity]: The element-pair spacing table in the prompt specifies 10 exact spacing pairs that are explicitly deferred to DDD-005/006 anyway.
  SCOPE: Task 1 prompt, "Spacing & Rhythm" section (lines 118-134)
  CHANGE: Reduce the element-pair table to the three-tier scale definition (paragraph / element / section) plus one or two examples. State that the full element-pair matrix is DDD-005/006's job. The current table risks locking in values prematurely in a document whose stated purpose is to "establish the scale and principles."
  WHY: The prompt already says "these values are recommendations for DDD-005/006 to formalize." Including ten specific rows in a foundational layout DDD is scope creep into typography territory. If a reviewer approves DDD-001 with these values, downstream DDDs inherit constraints that were never meant to be binding here. Less specificity in the right place is more useful than premature specificity.
  TASK: 1

- [simplicity]: The CSS Approach section prescribes six architectural sub-decisions including boilerplate cleanup notes and code block escape hatches.
  SCOPE: Task 1 prompt, CSS Approach items 5 and 6 (lines 228-237)
  CHANGE: Item 5 (boilerplate cleanup: dead `main > div` rule, `border-radius: 8px`, Roboto font-face) is implementation trivia that belongs in the implementation task, not a design decision document. Move it out of the DDD prompt and into a note for the implementing agent. Item 6 (code block escape hatch) is appropriate to keep since it constrains the layout architecture.
  WHY: A DDD is a design contract. Implementation cleanup notes (which pre-decoration CSS rules are dead code, which border-radius violates a rule) are not design decisions -- they are implementation chores. Including them in the DDD blurs the boundary between "what we decided" and "what we need to clean up," making the document harder to review against its actual purpose.
  TASK: 1

- [simplicity]: Five open questions is borderline high for a single DDD, and question 5 (boilerplate divergence tracking) is a process question, not a design question.
  SCOPE: Task 1 prompt, Open Questions section (lines 266-292)
  CHANGE: Drop open question 5 (boilerplate divergence tracking). It is a project management concern, not a layout design decision. The answer is already implied -- this is a one-way fork, as stated in the plan's own risk table.
  WHY: Open questions should represent genuine design uncertainties that affect subsequent DDDs. A process question about whether to track boilerplate divergence does not affect layout decisions and adds noise to the review surface.
  TASK: 1

---

All three are refinements, not structural problems. The plan is sound. Proceed.
