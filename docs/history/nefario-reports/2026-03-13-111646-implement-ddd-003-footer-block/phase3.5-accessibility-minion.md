---
agent: accessibility-minion
phase: review
task: implement-ddd-003-footer-block
verdict: ADVISE
---

# Accessibility Review — DDD-003 Footer Block

## Verified Claims

All claimed contrast ratios confirmed by independent computation against WCAG relative luminance formula:

- `--color-text-muted` (#6F6A5E) on `--color-background` (#F6F4EE): **4.90:1** (plan claims 4.89:1 — rounding difference, both PASS AA normal text)
- `--color-link` (#5A7543) on `--color-background` (#F6F4EE): **4.70:1** (matches claim, PASS AA normal text)
- `--color-link-hover` (#3F5232) on `--color-background` (#F6F4EE): **7.75:1** (not claimed but PASS)
- Dark mode `--color-text-muted` (#C9C3B8) on `--color-background` (#3A3A33): **6.54:1** (PASS)
- Dark mode `--color-link` (#9FB68A) on `--color-background` (#3A3A33): **5.20:1** (plan claims 5.3:1 — rounding, PASS)

**All contrast ratios verified. No failures.**

## Verified: text-decoration Specificity

Global reset: `a:any-link { text-decoration: none; }` = specificity (0, 1, 1)
Footer rule: `footer .footer a:any-link { text-decoration: underline; }` = specificity (0, 2, 2)

Footer rule wins. `text-decoration: underline` is correctly applied. WCAG 1.4.1 (non-color distinguisher for links) is satisfied.

## Verified: WCAG 2.4.13 Focus Appearance

Outline: 2px solid `--color-heading` (#3F5232), offset: 2px.

With `outline-offset: 2px`, a 2px gap filled with background color separates the outline from the link text. The outline is adjacent to:
- Outside: `--color-background` (#F6F4EE) — contrast 7.75:1 (PASS, need >= 3:1)
- Inside gap: `--color-background` (#F6F4EE) — contrast 7.75:1 (PASS)

The link text color (#5A7543) is not directly adjacent to the outline pixels due to the gap. 2.4.13 PASSES. Minimum area also passes — a 2px outline enclosing inline text exceeds the CSS pixel threshold.

Dark mode focus ring: outline `--color-heading` (#F6F4EE) on `--color-background` (#3A3A33) = 10.42:1 (PASS).

## Verified: Landmark Structure

`<footer>` at the top level of the document maps implicitly to `role=contentinfo` (WCAG 1.3.6, ARIA specification). The plan's DOM structure is correct.

## Verified: Keyboard Tab Order

DOM order produces: Ben Peter (LinkedIn) → Legal Notice → Privacy Policy. Follows visual reading order. No `tabindex` attributes introduced. WCAG 2.4.3 (Focus Order) PASS.

## Verified: aria-label Semantics

`aria-label="Ben Peter on LinkedIn"` with visible text "Ben Peter":
- WCAG 2.4.4 Link Purpose: PASS — destination is determinable from the label
- WCAG 2.5.3 Label in Name: PASS — visible text "Ben Peter" is a substring of the accessible name

`decorateButtons()` sets `a.title = a.textContent = "Ben Peter"` on this link. The `aria-label` takes priority in accessible name computation (step 2 in the algorithm vs. step 5 for title). Screen reader announces "Ben Peter on LinkedIn". The `title` attribute being shorter than `aria-label` does not override it.

`decorateButtons()` does NOT promote the LinkedIn link to a button — the `<p>` has multiple child nodes (text nodes and anchor elements), so `childNodes.length > 1` fails the sole-child condition.

## Verified: WCAG 2.5.8 Target Size

Footer links are inline elements within a paragraph sentence. WCAG 2.5.8 provides an explicit inline text link exception. The 14px desktop font size does not trigger any requirement. PASS.

---

## Advisory (not blocking)

- [accessibility]: The LinkedIn link's `aria-label` does not inform screen reader users that the link opens in a new tab.
  SCOPE: `drafts/footer.plain.html`, the LinkedIn anchor element
  CHANGE: Extend `aria-label` to `"Ben Peter on LinkedIn (opens in new tab)"` to signal the new-tab behavior to assistive technology users.
  WHY: `target="_blank"` changes context without user expectation. While not required by WCAG 2.2 AA, failing to warn is a common friction point for screen reader users and flagged by accessibility auditors as a best-practice gap. WCAG 3.2.2 (On Input) does not strictly apply to links, but the principle of predictable navigation applies. Appending "(opens in new tab)" to the aria-label has no layout impact, no risk, and resolves the gap.
  TASK: Task 1

---

All WCAG 2.2 AA criteria within scope of this review pass. The one advisory item above is a best-practice enhancement, not a conformance blocker. The plan may proceed to execution.
