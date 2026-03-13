---
agent: frontend-minion
phase: planning
task: implement-ddd-003-footer-block
---

# Frontend Minion Planning Contribution — DDD-003 Footer Block

## Verification: Tablet Breakpoint in Current File

Confirmed: the current `footer.css` has **only one media query** at `(width >= 900px)`. The `(width >= 600px)` tablet breakpoint does **not exist** in the boilerplate footer and must be added. The header confirms this is the correct project pattern — `header.css` has both breakpoints. The footer implementation task must add the 600px breakpoint from scratch.

---

## Minimal Correct CSS Structure

The complete replacement CSS, covering all six DDD-003 selectors with no extraneous rules:

```css
footer {
  background-color: var(--color-background);
  font-size: var(--body-font-size-xs);
}

footer .footer > div {
  max-width: var(--layout-max);
  margin-inline: auto;
  padding-inline: var(--content-padding-mobile);
  padding-block: var(--section-spacing) 24px;
  border-top: 1px solid var(--color-border-subtle);
}

footer .footer p {
  margin: 0;
  font-size: var(--body-font-size-xs);
  color: var(--color-text-muted);
  text-align: center;
  text-wrap: balance;
}

footer .footer a:any-link {
  color: var(--color-link);
  text-decoration: underline;
}

footer .footer a:hover {
  color: var(--color-link-hover);
  text-decoration: underline;
}

footer .footer a:focus-visible {
  outline: 2px solid var(--color-heading);
  outline-offset: 2px;
}

@media (width >= 600px) {
  footer .footer > div {
    padding-inline: var(--content-padding-tablet);
  }

  footer .footer p {
    text-align: left;
  }
}

@media (width >= 900px) {
  footer .footer > div {
    padding-inline: var(--content-padding-desktop);
  }
}
```

**Total: ~38 lines.** Zero hardcoded values, all six selectors covered.

---

## Rationale for Each Decision

### `footer` element

- Remove `--color-background-soft` (boilerplate defect #1 — wrong token). Use `--color-background` per DDD-003.
- Keep `font-size: var(--body-font-size-xs)` here. This sets the base on the `<footer>` element, which is inherited by `p`. The `p` rule also sets it explicitly to make the intent self-documenting and to resist inheritance surprises if the footer ever contains non-`p` content.

### `footer .footer > div` (inner content wrapper)

- Replace `margin: auto` with `margin-inline: auto` to match header precedent — the logical property is correct and preferred.
- Replace hardcoded `1200px` (boilerplate defect #2) with `var(--layout-max)`.
- Replace the shorthand `padding: 40px 24px 24px` with split logical properties:
  - `padding-inline: var(--content-padding-mobile)` — responsive, starts at 20px mobile.
  - `padding-block: var(--section-spacing) 24px` — 48px top, 24px bottom. Using `--section-spacing` for the top is consistent with the spec. Note: the original boilerplate used `40px` for top padding — DDD-003 specifies `--section-spacing` (48px). The task prompt must call this out explicitly as a deliberate value change.
- `border-top` goes on the inner `div`, **not** `footer`. This is the spec requirement. The border visually separates the footer from the page body without a full-width background seam.

### `footer .footer p`

- `margin: 0` — retained from boilerplate.
- `font-size: var(--body-font-size-xs)` — explicit redundancy is intentional (see above).
- `color: var(--color-text-muted)` — new; not in boilerplate. Required per DDD-003.
- `text-align: center` — mobile default (< 600px). Switches to `left` at 600px breakpoint.
- `text-wrap: balance` — improves appearance of the short copyright/link line at narrow widths. Low-risk, widely supported in modern browsers, ignored gracefully in older ones.

### Link states

None of these exist in the boilerplate. All three must be added:
- `:any-link` is the correct pseudo-class (covers both `:link` and `:visited`).
- `:hover` keeps underline on hover to avoid a visual pop. This is intentional — the spec explicitly states `text-decoration: underline` on hover.
- `:focus-visible` uses `outline-offset: 2px`, **not** 4px like the header. The spec difference is intentional per DDD-003 and the task prompt should flag it so the implementer does not copy the header value.

---

## Pitfalls to Call Out Explicitly in the Task Prompt

### 1. Do not add `display: flex` or `display: grid` to any selector

DDD-003 explicitly prohibits flexbox/grid for the footer. The footer content is a single short paragraph — no layout primitives are needed. If an implementer reaches for flex to center the mobile text, they must be stopped: `text-align: center` is the correct tool here.

### 2. The border belongs on `.footer > div`, not on `footer`

A common mistake is placing `border-top` on the `<footer>` element itself (full-width, touching browser edge) rather than on the inner content div (inset, with padding). The spec places it on the inner wrapper for a reason: it gives the border the same inset as the content. Do not move it.

### 3. `--color-background-soft` vs `--color-background`

The boilerplate has `--color-background-soft` (#EFE9DD, warmer/darker). DDD-003 specifies `--color-background` (#F6F4EE). They are different tokens with different hex values. This is a known defect in the boilerplate — the task prompt must name this token replacement explicitly to avoid the implementer assuming it is the same color.

### 4. Hardcoded `1200px` must be replaced

The boilerplate uses literal `max-width: 1200px`. DDD-003 requires `var(--layout-max)`. Even though `--layout-max` currently resolves to 1200px, the var must be used — hardcoded pixel values in block CSS are a project convention violation and will fail design-system refactors.

### 5. Top padding change: 40px → `--section-spacing` (48px)

The boilerplate uses `40px` top padding. DDD-003 specifies `var(--section-spacing)` which is currently `48px`. This is a deliberate 8px increase. The implementer should not "preserve" 40px by assuming it matches — it does not.

### 6. `font-size` on `footer` vs `p` — both are intentional

The `font-size: var(--body-font-size-xs)` appears on both `footer` and `footer .footer p`. The one on `footer` sets inherited base size (also catches any non-`p` footer text). The one on `p` is explicit for clarity. Do not remove either as "redundant" — the duplication is intentional.

### 7. `text-align: left` must be in the 600px breakpoint, not 900px

The boilerplate has only a 900px breakpoint. The text-align switch from `center` to `left` must happen at **600px**, per DDD-003. If the implementer only adds the padding change to the 600px breakpoint and forgets to also move text-align there, the layout will be wrong on tablet (600–899px range) — centered text with left-aligned padding.

### 8. Stylelint range notation enforcement

The project's Stylelint config enforces `(width >= 600px)` syntax. The legacy `(min-width: 600px)` will fail lint. This is already correct in the CSS above, but the task prompt should remind the implementer explicitly.

### 9. `margin: auto` → `margin-inline: auto`

The boilerplate shorthand `margin: auto` sets all four margins to auto. The spec and header precedent use `margin-inline: auto` (logical property, horizontal centering only). These are functionally equivalent for centering but the logical property is the project convention. Replace, do not preserve.

### 10. No `footer-container` or `footer-wrapper` class names

AGENTS.md prohibits these class names as they conflict with auto-generated section wrapper classes. Not a risk in the footer specifically (the block generates `.footer > div`), but worth noting for the footer fragment content authoring — do not author any wrapper divs with those class names.

---

## Fragment Content Authoring

The `/footer` fragment is authored as a document page. The correct content for the footer body (one `<p>` with inline links) should render as:

```
© 2026 Ben Peter · Legal Notice · Privacy Policy
```

Where "Legal Notice" links to `/legal-notice` and "Privacy Policy" links to `/privacy-policy`. The separator `·` (U+00B7 middle dot) is plain text, not a list item or separator element. The entire thing is one paragraph.

The implementer should author the fragment with a single paragraph containing this text. No headings, no lists, no additional divs. The `footer.js` block decorator will wrap it in `.footer > div`.

---

## Dependency Check

- `footer.js` — unchanged, no modifications needed. Verify it generates `.footer > div` as the inner wrapper (this is the selector the CSS targets).
- `styles/tokens.css` — all referenced tokens (`--color-background`, `--color-background-soft`, `--color-text-muted`, `--color-link`, `--color-link-hover`, `--color-heading`, `--color-border-subtle`, `--layout-max`, `--section-spacing`, `--content-padding-mobile`, `--content-padding-tablet`, `--content-padding-desktop`, `--body-font-size-xs`) must be confirmed present before implementation. Based on the provided token list, all are present.
- `--body-font-size-xs` is responsive (15px mobile, 14px at 900px) — this is handled by the tokens file itself via its own media query, not by the footer CSS. The footer correctly defers to the token.

---

## Implementation Order

1. Replace `blocks/footer/footer.css` with the CSS above.
2. Run `npm run lint` — verify zero Stylelint errors.
3. Author or update the `/footer` fragment content as a single paragraph with the copyright line and two links.
4. Start dev server, inspect at mobile (< 600px), tablet (600–899px), and desktop (>= 900px).
5. Verify border-top appears on the inner div (inset), not full-width on the `<footer>` element.
6. Verify `text-align: center` at mobile, `left` at 600px+.
7. Tab through links — focus ring should be 2px solid `#3F5232` with 2px offset.
