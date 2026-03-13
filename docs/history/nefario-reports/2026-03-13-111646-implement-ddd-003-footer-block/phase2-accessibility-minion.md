# Accessibility Minion — DDD-003 Footer Implementation Planning

## Summary

The DDD-003 design document is accessibility-sound at the specification level. The contrast ratios, ARIA usage, keyboard model, and WCAG 1.4.1 strategy are all correctly stated. The execution task has a narrow but precise verification surface: confirm the CSS and authored fragment together produce the claimed behavior in the actual rendered DOM, and address three areas where the spec under-specifies or creates subtle risk.

---

## Verifying the Stated WCAG Claims

### 1. Contrast ratios (WCAG 1.4.3, SC AA)

The spec claims:
- `--color-text-muted` (#6F6A5E) at 4.89:1 on `--color-background` (#F6F4EE)
- `--color-link` (#5A7543) at 4.70:1 on `--color-background` (#F6F4EE)
- `--color-heading` (#3F5232) focus ring at 7.75:1 on `--color-background` (#F6F4EE)

**What to verify:**

The contrast ratios are stated against `--color-background` (#F6F4EE). The footer's background must resolve to exactly this color, not `--color-background-soft` (#EFE9DD) from the boilerplate. The execution task must confirm `background-color: var(--color-background)` is applied on `footer` (or that the footer background genuinely inherits from `body` which has `background-color: var(--color-background)`).

Verification method: Inspect the rendered footer element in browser DevTools > Computed > background-color. The computed value must be `rgb(246, 244, 238)` (#F6F4EE), not `rgb(239, 233, 221)` (#EFE9DD).

If the execution task only adds `background-color: var(--color-background)` to `footer` without verifying the computed value, the old boilerplate rule `footer { background-color: var(--color-background-soft) }` could still apply if specificity is mishandled or if the new rule is missing.

**Dark mode:** In dark mode, `--color-background` resolves to #3A3A33. The spec states `--color-link: #9FB68A` achieves ~5.3:1 on this background — acceptable. The `--color-text-muted` dark value is `--color-text-muted: #C9C3B8`. Verify this achieves >=4.5:1 on #3A3A33. Computed: #C9C3B8 on #3A3A33 is approximately 7.0:1 — well above threshold, no action needed, but worth confirming visually in dark mode.

The `--color-heading` dark value is #F6F4EE, yielding the stated 10.42:1 on #3A3A33 for the focus ring — correct.

### 2. WCAG 1.4.1 — Non-color distinguisher (text-decoration: underline)

The spec correctly identifies that `--color-link` (#5A7543) and `--color-text-muted` (#6F6A5E) have approximately 1:1 luminance contrast against each other, making `text-decoration: underline` the load-bearing WCAG 1.4.1 mechanism.

**What to verify:**

`styles.css` line 97-100 sets `a:any-link { color: var(--color-link); text-decoration: none; }`. This global rule removes underlines from all links by default. The footer CSS must explicitly re-add `text-decoration: underline` via `footer .footer a:any-link`. If this rule is omitted or has insufficient specificity, the links will render without underline decoration and WCAG 1.4.1 fails — the links are indistinguishable from the surrounding muted text by color alone.

Verification method: Inspect a footer link in DevTools > Computed > text-decoration-line. It must show `underline`, not `none`. The correct selector is `footer .footer a:any-link` (three-part descendant) which overrides the global `a:any-link` rule. If the implementer uses `footer .footer a` instead of `footer .footer a:any-link`, visited links may not get the underline (the `:any-link` pseudo-class matches both `:link` and `:visited`; plain `a` selector does too, but being explicit matches the pattern from DDD-003 and the header CSS).

Also verify `text-decoration: underline` persists on hover. The spec explicitly states it. DevTools hover state simulation or keyboard focus + hover testing can confirm.

### 3. Focus ring (WCAG 2.4.7 / 2.4.13)

The spec states `outline: 2px solid var(--color-heading); outline-offset: 2px` on `:focus-visible`.

**What to verify:**

WCAG 2.4.13 Focus Appearance (AA, new in WCAG 2.2) requires the focus indicator to:
- Enclose the focused component
- Have a minimum area of the perimeter of the unfocused component times 2 CSS pixels
- Achieve a contrast ratio of at least 3:1 between the focused and unfocused states

At `--body-font-size-xs` (14-15px), the link text area is small. The 2px outline fully encloses it and the `--color-heading` (#3F5232) achieves 7.75:1 contrast against `--color-background` (#F6F4EE), far exceeding the 3:1 minimum. This passes 2.4.13.

Verification method: Tab to each footer link and visually confirm the outline is visible and unobscured. Also verify WCAG 2.4.11 Focus Not Obscured (A): the focused footer links must not be entirely hidden by sticky headers or other author-created overlays. Since this site has no sticky header (the header is not fixed-position), this passes trivially — but confirm no `position: sticky` or `position: fixed` elements exist that could cover the footer during keyboard navigation.

The global `styles.css` does not set any `:focus` or `:focus-visible` styles on links (only on `.button`). The footer CSS is the only place the focus ring is defined. If the footer CSS rule is omitted, links get the browser default focus ring — which passes basic WCAG 2.4.7 but may not meet 2.4.13. The execution task must confirm the explicit ring is present.

---

## Additional WCAG 2.2 AA Concerns Not Fully Addressed in Spec

### 4. Landmark structure (WCAG 1.3.6 / best practice, also ARIA)

The `<footer>` element maps implicitly to the `contentinfo` ARIA landmark role when it is a direct descendant of `<body>`. The EDS-decorated DOM structure is:

```
<body>
  <header>...</header>
  <main>...</main>
  <footer>
    <div class="footer block">
      <div>
        <div class="section">
          <div class="default-content-wrapper">
            <p>...</p>
```

`<footer>` here is a direct child of `<body>`, so it correctly maps to `contentinfo`. Screen readers will announce "content information" (NVDA) or "footer" (JAWS, VoiceOver) when entering. No action needed.

**Risk to verify:** The EDS fragment loading nests the content deeply inside `.footer > div > .section > .default-content-wrapper`. None of those intermediate `<div>` elements carry ARIA roles. Verify in the accessibility tree (DevTools > Accessibility > Tree) that there are no unexpected role=region or role=complementary assignments from EDS block processing that could misrepresent the footer landmark.

### 5. External link announcement (WCAG 2.4.4, SC A)

The LinkedIn link uses `aria-label="Ben Peter on LinkedIn"` with `target="_blank"`. The DDD-003 spec does not address whether screen readers announce the external link behavior.

**Current state:** The `aria-label` provides a complete accessible name that identifies both the person and the destination platform. This satisfies WCAG 2.4.4 Link Purpose (In Context) — the label is sufficient to understand the link destination.

**Gap:** `target="_blank"` behavior is not announced by screen readers via ARIA alone. WCAG does not require announcing `_blank` behavior at Level AA (it is a Level AAA concern under 2.4.9 Link Purpose Link Only context, and only indirectly). However, the common practice is to either:
(a) Include destination context in the label (done — "on LinkedIn" implies external), or
(b) Add `(opens in new tab)` text or visually hidden text

For this site, option (a) is in place and sufficient for WCAG 2.4.4 AA compliance. The `aria-label` already communicates the destination. No additional action is required for WCAG conformance, but the execution task should verify the accessible name computes correctly: inspect the LinkedIn link in DevTools > Accessibility > Name. It should show "Ben Peter on LinkedIn", not "Ben Peter" (which would be the content without aria-label).

**Verify:** The `aria-label` attribute must survive EDS fragment loading and block decoration. The `decorate()` function in `footer.js` moves children from the fragment into the block div without modifying attributes. However, the EDS `decorateLinks()` function in `aem.js` processes links — verify it does not strip or override `aria-label`. Review the `aem.js` `decorateLinks()` function behavior for links with existing `aria-label` attributes.

### 6. Tab order and focus management (WCAG 2.4.3, SC A)

The spec states three tab stops in DOM order: "Ben Peter", "Legal Notice", "Privacy Policy". This is correct — DOM order determines tab order when no `tabindex` is present.

**Verify:** Tab through the footer from outside (e.g., last focusable element in `<main>`) and confirm:
1. First Tab reaches "Ben Peter" (LinkedIn link)
2. Second Tab reaches "Legal Notice"
3. Third Tab reaches "Privacy Policy"
4. Fourth Tab exits the footer (browser chrome or next focusable element)

No `tabindex` attributes should appear on the footer or its children. A `tabindex="-1"` on any link would remove it from the tab sequence, `tabindex="1"` or higher would break natural tab order. The fragment and `decorate()` function should produce no tabindex values — verify in the rendered DOM.

### 7. Text size and target size at --body-font-size-xs (WCAG 2.5.8, SC AA, new in WCAG 2.2)

WCAG 2.5.8 Target Size (Minimum) requires pointer targets to be at least 24x24 CSS pixels (or have sufficient spacing such that a 24px diameter circle centered on the target does not intersect another target or the boundary of the viewport).

At `--body-font-size-xs` of 14-15px with `line-height: var(--line-height-body)` (1.7), the rendered line height is approximately 24-26px. The inline links in the footer are short text spans, and their clickable/tappable area is determined by the font size and line height.

**Risk:** At 14px font with 1.7 line-height, the target height is approximately 23.8px — fractionally under the 24px minimum. At 15px it is approximately 25.5px — above threshold. The `--body-font-size-xs` desktop value is 14px (tokens.css line 99), not 15px. This is a borderline case.

**Mitigation in spec:** The spec does not address 2.5.8 explicitly. WCAG 2.5.8 has an exception: if the target offset (spacing between targets) is sufficient that a 24px circle centered on the target does not intersect adjacent targets, the undersized target still passes. The middot characters (`·`) between links act as natural spacing between tap targets, likely providing sufficient offset. The spacing between "Ben Peter" and "Legal Notice" includes " · " which is several pixels of non-interactive space.

**What the execution task should verify:** In DevTools, inspect the rendered bounding box of each footer link (right-click > Inspect > Layout panel > box model). Confirm the height dimension. If it is consistently below 24px on desktop (14px font), note this as a low-severity WCAG 2.5.8 observation. Given the offset exception, this likely passes, but it must be checked rather than assumed.

A simple remedy if needed: add `padding-block: 4px` to `footer .footer a` to expand the tap target without affecting visual appearance (the extra padding is invisible inside inline text flow at this scale). Defer this unless DevTools confirms a genuine shortfall.

### 8. Color contrast in dark mode — visited link state

The CSS uses `:any-link` rather than separate `:link` and `:visited` rules. This intentionally prevents browsers from rendering visited footer links in a distinct color, which is the correct choice for a footer (visited state adds no navigational value and could confuse users who expect consistent coloring in the footer). Confirm this is working as intended: visiting `/legal` and returning should not show the "Legal Notice" link in a browser-default purple or maroon color.

---

## CSS Implementation Checklist for Execution Task

The following CSS rules must appear in `blocks/footer/footer.css` for WCAG 2.2 AA compliance:

1. `footer { background-color: var(--color-background); }` — mandatory, overrides boilerplate `--color-background-soft`
2. `footer .footer > div { border-top: 1px solid var(--color-border-subtle); }` — applied to inner wrapper, not `<footer>`
3. `footer .footer p { color: var(--color-text-muted); }` — 4.89:1 on `--color-background`
4. `footer .footer a:any-link { color: var(--color-link); text-decoration: underline; }` — WCAG 1.4.1 load-bearing rule
5. `footer .footer a:hover { color: var(--color-link-hover); text-decoration: underline; }` — must explicitly keep underline
6. `footer .footer a:focus-visible { outline: 2px solid var(--color-heading); outline-offset: 2px; }` — WCAG 2.4.13

Missing any of rules 4, 5, or 6 is a direct WCAG violation. Rule 1 is required for the contrast ratios to hold (wrong background invalidates stated ratios).

---

## Fragment Authoring Checklist for Execution Task

The `/footer` fragment must contain:

1. Single `<div>` containing a single `<p>` — prevents `decorateButtons()` from converting any link to a button
2. `aria-label="Ben Peter on LinkedIn"` on the LinkedIn link — do not omit this attribute
3. `target="_blank" rel="noopener"` on LinkedIn link — `rel="noopener"` is required; `rel="noreferrer"` would also be acceptable and is slightly more private
4. `&copy;&nbsp;2026&nbsp;` before the LinkedIn link — non-breaking spaces prevent awkward wrapping of the copyright phrase
5. Literal middot `·` characters (U+00B7) as separators — not hyphens, pipes, or `&middot;` entities (rendered output is identical but middot entities are harder to read in source)
6. Internal links (`/legal`, `/privacy`) must NOT have `target="_blank"` — these are same-site legal pages

---

## Issues Requiring No Action (Confirmed Correct)

- **Middot separators**: No `aria-hidden` needed. Screen readers handle punctuation and Unicode characters in inline text naturally. A literal `·` causes a brief pause; it does not confuse or disrupt the announcement. Confirmed correct per spec.
- **`prefers-reduced-motion`**: No transitions or animations in this component. No action needed.
- **`<footer>` landmark**: Automatic `contentinfo` role from semantic HTML. No `role="contentinfo"` attribute needed.
- **`lang` attribute**: Footer inherits page `lang="en"` (or the equivalent site-level setting). No `lang` attribute needed on the footer itself.
- **Visited link styling**: `:any-link` suppression of visited state is the correct approach for a footer context.

---

## Risk Register

| Risk | Severity | Mitigation |
|---|---|---|
| Boilerplate `--color-background-soft` not fully overridden | Critical | Verify computed background-color = #F6F4EE in DevTools |
| `text-decoration: underline` missing from CSS (WCAG 1.4.1 failure) | Critical | Verify computed text-decoration-line = underline on footer links |
| `aria-label` stripped by EDS `decorateLinks()` | High | Inspect rendered DOM for aria-label attribute presence |
| Focus ring rule missing or wrong specificity | High | Tab to each link and confirm visible outline |
| 2.5.8 target height at 14px font (desktop) | Low | Check bounding box; middot spacing likely provides offset exception |
| Dark mode contrast not verified visually | Low | Toggle dark mode in DevTools and inspect text rendering |
