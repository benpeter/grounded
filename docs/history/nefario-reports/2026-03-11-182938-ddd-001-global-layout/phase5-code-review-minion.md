# Code Review: DDD-001-global-layout.md

Reviewed against:
- `/Users/ben/github/benpeter/mostly-hallucinations/styles/tokens.css`
- `/Users/ben/github/benpeter/mostly-hallucinations/styles/styles.css`
- `/Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/README.md`

---

VERDICT: ADVISE

FINDINGS:

- [BLOCK] DDD-001:278-303 -- Two proposed tokens used in CSS snippets (`--layout-max`, `--content-padding-tablet`) are absent from `styles/tokens.css`. The Token Usage table correctly marks them "Proposed," but the CSS Approach section presents them as ready-to-use. Any agent implementing directly from Section 3 will get silent CSS failures (unresolved custom properties fall back to their initial value — `max-width: initial` means no constraint, `padding-inline: initial` means no padding).
  FIX: Add a visible callout immediately before the CSS Approach snippets: "The tokens marked 'Proposed' in the Token Usage table (`--layout-max`, `--content-padding-tablet`, `--space-paragraph`, `--space-element`) must be added to `styles/tokens.css` before implementing this CSS." Alternatively, inline the proposed token definitions in the CSS snippets as comments showing the intended values (`--layout-max: 1200px`, `--content-padding-tablet: 24px`).

- [ADVISE] DDD-001:299-302 -- The comment "inherits margin-inline: auto from parent centering" is technically imprecise and risks confusing an implementing agent. `margin-inline: auto` is not inherited; it is applied to `.default-content-wrapper` through the cascade because that element also matches the `main > .section > div` rule in the same block. The mechanism is the cascade, not inheritance. An agent that reads "inherits" may assume no explicit rule is needed and omit centering in other contexts (e.g., a block-level wrapper that does not match the outer selector).
  FIX: Replace the comment with: `/* centered via the cascade: .default-content-wrapper also matches main > .section > div above */`

- [ADVISE] DDD-001:310-316 -- Section spacing CSS mixes a logical property (`margin-block`) with a physical override (`margin-top: 0`). This works correctly in horizontal writing modes — `margin-top` maps to `margin-block-start` — but the inconsistency could cause surprises if writing-mode is ever changed, and it is inconsistent with the `margin-inline: auto` logical usage elsewhere in the same document.
  FIX: Replace `margin-top: 0` with `margin-block-start: 0` for consistency:
  ```css
  main > .section:first-of-type {
    margin-block-start: 0;
  }
  ```

- [ADVISE] DDD-001:220-226 -- The HTML structure comment "Outer section div: constrained to --layout-max (1200px)" is placed outside the first `.section` closing tag (line 224), between two sibling `.section` elements. It reads as an annotation for the outer `.section` container but appears in the whitespace between sections, not adjacent to the element it describes. An implementing agent reading this HTML skeleton may misattribute the constraint.
  FIX: Move the comment inside the `.section > div` it describes, adjacent to the `default-content-wrapper`. Alternatively, place it as an opening comment on the `<div class="section">` opening tag. The annotation belongs at the `div` level, not floating between sections.

- [ADVISE] DDD-001:147 -- The typography section states `--body-font-size-m` is "20px mobile / 18px desktop at >= 900px." This is correct per `tokens.css` (line 45 and line 96). However, the document also states `--measure: 68ch` is "relative to the `0` character width of `--font-body` at the current `--body-font-size-m`." The `ch` unit is defined by the `0` glyph of the element's own computed font — Source Sans 3 in this case. Since `--body-font-size-m` changes at the 900px breakpoint (20px → 18px), `--measure` will resolve to different pixel widths at mobile vs desktop without any token change. The Open Question #2 correctly flags this for in-browser validation. No change needed here, but the implementing agent for DDD-005/006 must be directed to this open question explicitly.
  FIX: Add a cross-reference note: "See Open Question #2 before implementing any typography rule that assumes a fixed pixel width for the reading column."

- [NIT] DDD-001:181 -- The responsive behavior table lists four breakpoint rows but the wireframes section has four diagrams. The table entry for >= 1200px describes padding as `--content-padding-desktop (32px, unchanged)` — the "(unchanged)" note is clear and correct. No inconsistency. This is a confirm, not a finding.

- [NIT] DDD-001:249-253 -- The token loading section describes `tokens.css` loading as a separate `<link>` before `styles.css`. The current `styles.css` file header comment (line 5) says `@import url('tokens.css')` — but the actual `styles.css` file does not contain that `@import`. The DDD's `<link>` approach (two separate stylesheet tags in `head.html`) is architecturally correct for EDS (avoids render-blocking import chains) and should be used. But the discrepancy between the comment in `tokens.css` and the DDD's `<link>` approach should be resolved: the comment in `tokens.css` line 5 should be updated to match the actual loading strategy when the file is committed.
  FIX: When implementing, update the `tokens.css` file comment from `@import url('tokens.css')` to reflect that the file is loaded via a `<link>` tag in `head.html`, not via `@import`.

- [NIT] DDD-001:314-316 -- `main > .section:first-of-type` targets the first `.section` type-selector match. Since `.section` is a class (not an element type), `:first-of-type` matches the first `div` element that is a direct child of `main`, regardless of whether it has the `.section` class. If EDS ever inserts a non-`.section` `div` as the first child of `main`, this selector behaves unexpectedly. The existing `styles.css` line 241 has the same pattern — so this is a pre-existing convention, not a regression. Flagging for awareness.
  FIX: No immediate change required since this matches the existing boilerplate convention. If the DDD is updated, consider noting this limitation in an Open Question or flagging it for the implementing agent.

---

## Summary

The document is structurally sound, internally consistent between wireframes and the responsive behavior table, and correctly references existing tokens by their exact names from `styles/tokens.css`. The two blocking concerns are both about the same root issue: proposed tokens used in CSS snippets without surfacing that they will not resolve until added to `tokens.css`. An implementing agent reading only Section 3 (CSS Approach) would produce silently broken layout. Fix the callout and this document is ready to approve.
