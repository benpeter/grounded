# Test-Minion Review — DDD-004 Home Post Index

Verdict: **ADVISE**

---

- [testing]: The `datetime` attribute format on `<time>` is underspecified — the DDD shows `datetime="2026-03-12"` (ISO 8601 date-only) but does not state this as a normative requirement, creating ambiguity for future test assertions.
  SCOPE: HTML Structure section — `<time>` element in the decorated DOM example
  CHANGE: Add a normative statement: "The `datetime` attribute MUST be ISO 8601 date-only format (`YYYY-MM-DD`). Implementations must not use datetime strings with time components or Unix timestamps."
  WHY: Without a specified format contract, an implementation could use `datetime="2026-03-12T00:00:00Z"` and pass visual review while breaking any machine-readable extraction test or structured data validator. The display format ("March 12, 2026") is clearly specified but the machine-readable format is only implied by example.
  TASK: Task 1

- [testing]: The `id` attribute generation scheme for `aria-labelledby` (shown as `post-1-title`, `post-2-title`) is not specified — whether it is position-based, slug-based, or hash-based is undefined, making DOM structure tests fragile.
  SCOPE: HTML Structure section — `id` attributes on `<h2>` elements and `aria-labelledby` on `<article>` elements
  CHANGE: Add one sentence specifying the id generation scheme: either "IDs are positional (`post-{n}-title`) and are generated client-side based on render order" or "IDs are derived from the post path slug". Either is acceptable but the choice must be explicit so implementation tests can assert `aria-labelledby` references a valid `id` without guessing the pattern.
  WHY: If the id scheme is position-based, parallel rendering or reordering breaks `aria-labelledby` correctness in ways that are hard to detect without explicit test contracts. If slug-based, there is no collision risk but the slug sanitization rules must be defined. An unspecified id scheme is an untestable accessibility contract.
  TASK: Task 1

- [testing]: The Open Questions section lists the auto-block vs. authored-block question (Question 6) without flagging that the answer changes the testable integration surface — an auto-block injected by `buildAutoBlocks()` requires testing `scripts.js` behavior, while an authored block requires only testing the block's `decorate()` function.
  SCOPE: Open Questions section — Question 6 (auto-block vs. authored block)
  CHANGE: Add a note to Question 6: "Resolution of this question affects the integration test surface. Auto-block approach requires verifying `buildAutoBlocks()` injection logic; authored approach scopes tests to the block's `decorate()` function only. Flag this dependency when writing implementation tasks."
  WHY: This is not a blocker for the DDD itself, but without this annotation the implementation agent is likely to omit the `buildAutoBlocks()` path from any test plan, leaving a gap in coverage for the more common deployment pattern.
  TASK: Task 1
