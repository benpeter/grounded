# Margo Review: implement-ddd-001-global-layout-css

## VERDICT: ADVISE

The implementation is proportional to the problem. The CSS is flat, token-driven, and free of unnecessary abstractions. No frameworks, no build steps, no new dependencies. The boilerplate-to-project-token migration is mechanically correct (zero orphaned variable references confirmed). The test HTML is minimal and exercises the right layout behaviors. The AGENTS.md update is a one-line addition plus a legitimate CSS guidance correction.

Four findings, all advisory. None block merging.

---

## FINDINGS

### [ADVISE] styles/tokens.css:70-71 -- Two unused tokens added speculatively

`--space-paragraph: 1em` and `--space-element: 1.5em` are defined in `tokens.css` but referenced by zero CSS rules in the entire codebase. These tokens belong to DDD-005/006 (typography and vertical rhythm), not DDD-001 (global layout). This was flagged during plan review -- the prior margo review of the DDD document explicitly advised moving these to DDD-005/006 scope.

Tokens without consumers are dead code. They cost almost nothing in bytes but add cognitive load: a future contributor reads these tokens, expects them to be used, and may build on them before the consuming CSS exists.

AGENT: nefario (plan included these in Task 1)
FIX: Remove `--space-paragraph` and `--space-element` from `tokens.css`. Add them when DDD-005/006 implements the CSS rules that consume them. If the intent is to "reserve the names," a comment suffices -- a declared-but-unused custom property does not.

### [ADVISE] head.html:3 -- CSP `style-src 'self'` is scope creep from a layout task

The original DDD-001 scope and the phase-3 plan (Task 2) specified only "add tokens.css link to head.html." The `style-src 'self'` CSP addition was injected during execution after a security-minion advisory flagged a pre-existing CSP gap. The change itself is correct and harmless -- both stylesheets are same-origin, no inline styles are blocked, and the EDS core library's programmatic `.style` manipulation is unaffected by `style-src`.

However, it is a security hardening change unrelated to the layout task. Bundling it into a layout PR makes the diff harder to review and makes the git history less legible (a CSP change buried in "implement layout tokens"). It should be its own commit at minimum, or its own PR.

AGENT: nefario (incorporated security-minion advisory into Task 2 execution prompt)
FIX: If this PR has not shipped yet, split the CSP change into a separate commit with a clear message (e.g., "Add style-src 'self' to CSP"). If the PR is already merged, no action needed -- the change is correct, just poorly attributed.

### [ADVISE] styles/styles.css:201 -- `padding-inline: 0` on `.default-content-wrapper` is a defensive rule not specified in DDD-001

DDD-001 section 3 (CSS Approach) specifies two properties on `.default-content-wrapper`:

```css
main > .section > .default-content-wrapper {
  max-width: var(--measure);
  margin-inline: auto;
}
```

The implementation adds a third: `padding-inline: 0`. The rationale (documented in the execution prompt) is that `.default-content-wrapper` inherits padding from `main > .section > div` because it is a child `div`. This reasoning is incorrect: `padding` is not an inherited CSS property. A child element does not inherit its parent's `padding` value. The `main > .section > div` selector sets padding on the section container; `.default-content-wrapper` (a child of that container) gets zero padding by default unless explicitly styled.

The rule is harmless (setting a property to its default value) but it reflects a misunderstanding of CSS inheritance, and it adds a declaration that will confuse future readers into thinking there is a real inheritance problem to guard against.

AGENT: frontend-minion (Task 3 execution)
FIX: Remove `padding-inline: 0` from the `.default-content-wrapper` rule. If there is a specificity concern (e.g., another rule elsewhere sets padding on this element), document the specific rule it overrides. "Inherits from parent" is not the correct justification for a non-inherited property.

### [NIT] drafts/layout-test.html -- Five sections instead of the four specified in the plan

The phase-3 plan (Task 5) specified four sections. The implementation has five: it added a "Two-Tier Layout Demonstration" section (lines 51-65) that was not in the plan. The additional section is a reasonable test case (it documents the two-tier relationship in HTML comments), but it is an undirected addition.

This is a nit because test content is cheap and disposable, and the extra section exercises a real layout behavior. But it illustrates a pattern worth watching: agents adding "while we're at it" content beyond spec.

AGENT: frontend-minion (Task 5 execution)
FIX: No action required. The extra section is harmless and arguably useful.
