## Task: Implement DDD-003 Footer Block

Replace `blocks/footer/footer.css` with the complete DDD-003 spec implementation and
author the `/footer` fragment as a static draft HTML file.

**DO NOT modify `blocks/footer/footer.js`** — this file is intentionally unchanged.
**DO NOT modify `styles/tokens.css`** — all required tokens already exist.

---

## Deliverable 1: blocks/footer/footer.css

Replace the entire file with the following CSS. Copy it exactly — do not interpret or
modify. Every decision is deliberate and documented below.

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

### Pitfalls — read before implementing

1. **`--color-background-soft` vs `--color-background`**: The boilerplate uses
   `--color-background-soft` (#EFE9DD). DDD-003 requires `--color-background` (#F6F4EE).
   These are different tokens with different hex values. The replacement is mandatory —
   the contrast ratios for all footer text are calculated against #F6F4EE. If the
   background is wrong, the contrast ratios are invalid.

2. **`max-width: 1200px` hardcode**: Replace with `var(--layout-max)`. Even though
   `--layout-max` resolves to 1200px today, hardcoded pixel values violate the
   project token convention.

3. **Top padding change — 40px to `--section-spacing` (48px)**: The boilerplate uses
   `40px` top padding. DDD-003 uses `var(--section-spacing)` = 48px. This is a
   deliberate 8px increase. Do not preserve the 40px value.

4. **`border-top` on the inner `div`, not on `footer`**: The border goes on
   `footer .footer > div`, not the `<footer>` element. This keeps the rule aligned
   with the content column edges rather than running viewport-edge to viewport-edge.
   Do not move it to `footer`.

5. **`margin-inline: auto` not `margin: auto`**: Use the logical property. It is the
   project convention (matches the header CSS).

6. **`font-size` appears on both `footer` and `footer .footer p`**: Both are
   intentional. The one on `footer` sets an inherited base for any non-`<p>` content.
   The one on `p` is explicit for clarity. Do not remove either as "redundant."

7. **`text-align: left` in the 600px breakpoint**: The text-align switch from `center`
   to `left` belongs in the `(width >= 600px)` media query, not the 900px one.
   If you place it only in 900px, tablet viewports (600–899px) will show centered
   text with left-aligned padding — that is wrong.

8. **Stylelint range notation**: Use `(width >= 600px)` and `(width >= 900px)` syntax.
   Do not use `(min-width: ...)`. The project's Stylelint config enforces range
   notation and will fail the legacy syntax.

9. **No `display: flex` or `display: grid`**: DDD-003 explicitly prohibits layout
   primitives for the footer. A single short paragraph does not need flexbox or grid.
   `text-align: center` on mobile (not flex + justify-content) is the correct tool.

10. **No `footer-container` or `footer-wrapper` class names**: AGENTS.md prohibits
    these class names as they conflict with auto-generated section wrapper classes.
    Not directly relevant to the CSS but do not author any wrapper divs with these
    names in the fragment.

---

## Deliverable 2: drafts/footer.plain.html

Create this file at `drafts/footer.plain.html`. It is the static draft for the
`/footer` fragment, served by the dev server at `http://localhost:3000/footer`.

```html
<div>
  <p>
    &copy;&nbsp;2026&nbsp;<a href="https://www.linkedin.com/in/benpeter/" target="_blank" rel="noopener" aria-label="Ben Peter on LinkedIn (opens in new tab)">Ben Peter</a> · <a href="/legal">Legal Notice</a> · <a href="/privacy">Privacy Policy</a>
  </p>
</div>
```

### Fragment authoring rules

- **Single `<p>` with inline content**: All three links, the copyright text, and the
  middot separators must be in one `<p>` element. The EDS `decorateButtons()` function
  converts an `<a>` that is the sole child of a `<p>` into a styled button. Having
  inline text (`© 2026 `, ` · `) alongside the links prevents this promotion.
  Never give each link its own `<p>`.

- **`aria-label` on the LinkedIn link**: The LinkedIn link must have
  `aria-label="Ben Peter on LinkedIn (opens in new tab)"`. This provides the accessible
  name that distinguishes it as an external destination AND announces the new-tab behavior
  to screen reader users.

- **`target="_blank" rel="noopener"`**: Only the LinkedIn link gets `target="_blank"`.
  The internal links (`/legal`, `/privacy`) must NOT have `target="_blank"`.
  `rel="noopener"` is required on the `_blank` link.

- **`&nbsp;` between copyright phrase parts**: The `&copy;&nbsp;2026&nbsp;` prevents
  the copyright phrase from wrapping mid-unit on narrow viewports. The middot
  separators ` · ` (space, U+00B7, space) are plain text — no entities needed.

- **No `target="_blank"` on internal links**: `/legal` and `/privacy` are same-site
  pages and open in the same tab.

---

## Deliverable 3: Verification (inline, during implementation)

Run `npm run lint` from `/Users/ben/github/benpeter/mostly-hallucinations` after
replacing footer.css and before considering the task complete. Zero Stylelint errors
required. The linter enforces range notation media queries and CSS property order
conventions.

Additionally, verify with curl checks:
- `grep -q 'aria-label="Ben Peter on LinkedIn (opens in new tab)"' drafts/footer.plain.html` — confirm aria-label is in source HTML
- If dev server is available: `curl -s http://localhost:3000/footer.plain.html | grep -q 'Legal Notice'` — confirm fragment is served

If the dev server is available, verify visually:
- **Computed background**: DevTools > Computed > background-color on `<footer>` must
  show `rgb(246, 244, 238)` (i.e., #F6F4EE), NOT `rgb(239, 233, 221)` (#EFE9DD).
- **Border placement**: `border-top` must appear on the inner div (the one with
  `max-width`), not on the `<footer>` element itself.
- **Text alignment**: `text-align: center` at mobile (< 600px viewport),
  `text-align: left` at tablet (>= 600px).
- **Focus ring**: Tab to each footer link — each must show a 2px solid `#3F5232`
  outline with 2px offset.
- **Underline on links**: Footer links must be underlined in default and hover states.

Note: Lighthouse accessibility score verification is deferred to the PR stage per
AGENTS.md publishing workflow.

---

## Project Context

- Working directory: `/Users/ben/github/benpeter/mostly-hallucinations`
- Lint command: `npm run lint`
- The `footer.js` decorator calls `loadFragment('/footer')`, which the dev server
  serves from `drafts/footer.plain.html`.
- The DOM structure after `decorate()` runs:
  ```
  footer
    .footer.block
      div
        .section
          .default-content-wrapper
            p (your content)
  ```
  The CSS selectors `footer .footer > div` and `footer .footer p` reach through this
  nesting correctly via descendant combinators.

---

## Success Criteria

1. `blocks/footer/footer.css` contains exactly the CSS specified above (~38 lines,
   zero hardcoded pixel values except the intentional `24px` bottom padding, zero
   hardcoded colors).
2. `drafts/footer.plain.html` exists with the single-`<p>` structure, three links,
   correct `aria-label` with "(opens in new tab)", `target="_blank" rel="noopener"` on LinkedIn only.
3. `npm run lint` exits with zero errors and zero warnings.
4. `blocks/footer/footer.js` is unmodified.
5. `styles/tokens.css` is unmodified.
