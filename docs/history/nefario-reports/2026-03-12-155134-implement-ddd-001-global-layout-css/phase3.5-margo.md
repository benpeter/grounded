# Margo Review: DDD-001 Global Layout Implementation Plan

## Verdict: ADVISE

The plan is proportional to the problem. Six tasks for replacing boilerplate variables, adding four tokens, implementing the two-tier width model, fixing block references, creating test content, and running verification -- this is a reasonable task count for a foundational layout change where missed variable references break silently with no console error. The approval gate on Task 3 is well-placed. No YAGNI violations, no dependency additions, no unnecessary abstractions.

Three advisory items follow.

---

### 1. [complexity]: tokens.css as a separate file adds a network request for zero runtime benefit

SCOPE: `head.html`, `styles/tokens.css`

CHANGE: The DDD-001 spec mandates `tokens.css` as a separate `<link>` in `head.html`. The plan implements this faithfully. However, the stated rationale ("allows an agent to update tokens without touching styles") is a developer-convenience argument, not a runtime or architecture argument. A CSS `@import` or inlining the `:root` block at the top of `styles.css` achieves the same separation-of-concerns with one fewer render-blocking request. On EDS, both files are served from the same CDN edge, so the latency cost is small but nonzero -- one additional round-trip on cold cache. For a site targeting Lighthouse 100 and sub-second loads, every render-blocking resource matters.

WHY: This is not blocking because (a) the DDD is approved and explicitly specifies this approach, and (b) the actual cost is small (~1-5ms on CDN). But it is worth noting as a complexity-for-convenience trade-off. If Lighthouse flags it later, inlining the `:root` block into `styles.css` (with a file comment pointing to `tokens.css` as the source of truth) is the simpler path.

TASK: Task 2

---

### 2. [scope]: `--space-paragraph` and `--space-element` tokens are added but unused in this plan

SCOPE: `styles/tokens.css`, new tokens `--space-paragraph` and `--space-element`

CHANGE: Task 1 adds `--space-paragraph: 1em` and `--space-element: 1.5em` to `tokens.css`. No task in this plan references these tokens in any CSS rule. DDD-001 itself says "Specific per-element spacing values for all other element pairs... will be defined in DDD-005/006 using this scale." These tokens exist solely for future DDDs.

WHY: Strictly speaking, adding tokens that nothing consumes is a mild YAGNI signal -- the tokens could be added in DDD-005/006 when they are actually used. The counter-argument is that DDD-001's Token Usage table lists them as "Proposed" and this is the implementation of DDD-001, so adding them now is spec-faithful. The cost is two CSS custom property declarations (trivial). Not blocking, but worth noting: if the values change when DDD-005/006 arrives, the "single source of truth" will have shipped unused values that then need updating.

TASK: Task 1

---

### 3. [scope]: AGENTS.md update is doc maintenance, not implementation

SCOPE: `AGENTS.md` project structure tree

CHANGE: Task 5 updates the project structure tree in `AGENTS.md` to include `tokens.css`. This is reasonable documentation hygiene but is not required for the layout implementation to work. It could be folded into an existing task (Task 1 or Task 2) as a single-line edit rather than occupying part of a separate task with its own verification step.

WHY: Minor inefficiency. Task 5 bundles the AGENTS.md edit with the drafts test content, which is a reasonable grouping. No real cost, just noting that it could be simpler.

TASK: Task 5

---

### Summary

The plan is well-scoped, proportional, and faithfully implements the approved DDD-001 spec. No blocking concerns. The three advisories above are minor: one inherited from the DDD's architecture choice (separate CSS file), one mild YAGNI signal on unused tokens, and one observation about task granularity. None warrant plan changes before execution.
