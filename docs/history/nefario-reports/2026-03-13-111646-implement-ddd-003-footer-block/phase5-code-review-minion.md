---
agent: code-review-minion
phase: code-review
task: implement-ddd-003-footer-block
---

# Code Review — DDD-003 Footer Block

## Summary

Both deliverables (`blocks/footer/footer.css` and `drafts/footer.plain.html`) are
correct, clean, and match the spec. The CSS is a verbatim implementation of the
DDD-003 plan with zero hardcoded hex values and only the one documented intentional
hardcoded pixel value (`24px` bottom padding). Token resolution verified against
`styles/tokens.css` — all 12 referenced tokens are present. No security issues,
no bug patterns, no DRY violations, no complexity concerns.

One advisory finding: the `aria-label` text diverges from the spec in a way that
is actually a WCAG improvement. One nit: `rel` attribute is missing `noreferrer`.

---

VERDICT: APPROVE

FINDINGS:

- [ADVISE] drafts/footer.plain.html:3 -- The `aria-label` on the LinkedIn anchor
  reads `"Ben Peter on LinkedIn (opens in new tab)"`, which diverges from the spec
  value `"Ben Peter on LinkedIn"`. The addition of "(opens in new tab)" is a WCAG
  2.1 technique (G201) that discloses `target="_blank"` behavior to screen reader
  users before they activate the link. This is a net accessibility improvement over
  the spec. However, verify the EDS `decorateLinks()` function does not strip or
  replace the `aria-label` on decorated anchors — if it does, the added text
  disappears silently and the original spec value would have been sufficient. No
  code change required unless EDS strips the attribute.
  AGENT: frontend-minion
  FIX: No change required unless EDS `decorateLinks()` is confirmed to strip
  `aria-label`. In that case, revert to `aria-label="Ben Peter on LinkedIn"` (the
  spec value), since a stripped label produces no accessible name at all. Check
  DevTools > Accessibility > Name on the rendered anchor to confirm the value
  survives decoration.

- [NIT] drafts/footer.plain.html:3 -- The LinkedIn anchor uses `rel="noopener"`
  but omits `noreferrer`. `noreferrer` suppresses the `Referer` header sent to
  LinkedIn, preventing the destination from seeing that the visit originated from
  benpeter.dev. For an author linking to their own LinkedIn profile this is a low
  concern, but the defense-in-depth convention for `target="_blank"` links is
  `rel="noopener noreferrer"`.
  AGENT: frontend-minion
  FIX: Change `rel="noopener"` to `rel="noopener noreferrer"` on the LinkedIn
  anchor.
