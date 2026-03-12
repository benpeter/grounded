ADVISE

- [test-minion]: The success criterion "responsive padding progression works at all four breakpoints" is entirely deferred to a human reviewer with no automated check.
  SCOPE: Task 6 verification checklist; success criterion #5 in prompt.md
  CHANGE: Task 6 should verify the three responsive breakpoints (600px, 900px) are present in styles.css as literal breakpoints — at minimum, a grep confirming `width >= 600px` and `width >= 900px` exist in `styles/styles.css`. This is a machine-checkable structural assertion, not a visual one. Full visual verification still requires a human, but the breakpoints being absent at all is a silent regression that lint will never catch.
  WHY: The new responsive padding rules live in `styles.css` under `@media (width >= 600px)` and `@media (width >= 900px)`. If those blocks were accidentally omitted or the syntax was wrong (e.g., still using `min-width:` which passes lint because tokens.css already fixed the one instance there), the layout silently degrades to mobile padding at all widths. The dev server smoke test in check #4 only confirms a 200 response — it does not confirm the media queries are present.
  TASK: Task 6

- [test-minion]: The dev server smoke test (check #4) only verifies HTTP 200, not that EDS decoration ran and the `.section` / `.default-content-wrapper` classes were applied.
  SCOPE: Task 6, check #4 — `curl -s http://localhost:3000/layout-test | head -50`
  CHANGE: Extend the curl check to grep for `.section` or `default-content-wrapper` in the response body: `curl -s http://localhost:3000/layout-test | grep -q 'section'`. If EDS decoration fails to run, the `.section` rules in styles.css never fire and the two-tier width model is untested. A bare `head -50` pipe will show undecorated HTML and the agent will likely call it a pass.
  WHY: The DDD-001 layout rules target `main > .section > div` and `main > .section > .default-content-wrapper`. These selectors only apply after EDS decoration adds those classes. If the draft file structure is wrong or the decoration pipeline errors, the layout is never exercised — and a curl that only checks for any HTML will not catch it.
  TASK: Task 6

- [test-minion]: The `border-radius: 8px` removal from the `pre` rule (Task 3, Phase B) has no verification step.
  SCOPE: Task 3 verification checks; Task 6 verification checklist
  CHANGE: Add a grep to Task 6 check confirming `border-radius` does not appear in `styles/styles.css`: `grep -n 'border-radius' styles/styles.css` should return zero results. This enforces the DDD-001 aesthetic rule ("no rounded containers") and confirms the deletion happened.
  WHY: The deletion is specified but lint does not catch `border-radius` — it is valid CSS. The orphaned-var grep does not catch it. If the agent misses this edit, the aesthetic constraint is silently violated and no automated check will surface it. The rule exists in the approved DDD-001 spec as a hard constraint, not a style preference.
  TASK: Task 6

- [test-minion]: The drafts test page has four sections but the success criterion references a 1200px breakpoint that the new CSS does not target with a dedicated rule — the plan implements 600px and 900px only. There is no verification that 1200px behavior is intentionally unaddressed or that this omission is correct per DDD-001.
  SCOPE: Task 5 (`drafts/layout-test.html`); Task 6 check #6; prompt.md success criterion ("all four breakpoints (base/600/900/1200)")
  CHANGE: Add a comment in Task 6's reporting or a grep confirming that the CSS intentionally has no 1200px media query for padding — the `--layout-max: 1200px` token caps the content width but no padding step fires at 1200px. If this is correct per DDD-001, Task 6 should explicitly assert there is no `width >= 1200px` padding rule (so a future contributor doesn't accidentally add one). If it is wrong, the gap should be caught before execution.
  WHY: The success criterion in prompt.md says "all four breakpoints (base/600/900/1200)" but the synthesized CSS in Task 3 only adds padding-inline steps at 600px and 900px. The 1200px figure appears only as `--layout-max` (max-width cap). This discrepancy between the stated success criterion and the implemented CSS is unverified and could cause the human reviewer to flag this as incomplete.
  TASK: Task 6
