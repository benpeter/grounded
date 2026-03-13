## Domain Plan Contribution: frontend-minion

### Recommendations

#### (a) Authored `/footer` fragment markup

The footer content `(c) 2026 Ben Peter . LinkedIn . Legal Notice . Privacy Policy` should be authored as a **single `<p>` element with inline links and text nodes**. The middot separators are authored as literal ` · ` (space-middot-space) characters in the paragraph.

The authored content in the CMS produces this `.plain.html`:

```html
<div>
  <p>
    (c) 2026 Ben Peter · <a href="https://www.linkedin.com/in/benpeter/">LinkedIn</a> · <a href="/legal">Legal Notice</a> · <a href="/privacy">Privacy Policy</a>
  </p>
</div>
```

After EDS decoration via `loadFragment` -> `decorateMain`, this becomes:

```html
<div class="section">
  <div class="default-content-wrapper">
    <p>
      (c) 2026 Ben Peter · <a href="https://www.linkedin.com/in/benpeter/">LinkedIn</a> · <a href="/legal">Legal Notice</a> · <a href="/privacy">Privacy Policy</a>
    </p>
  </div>
</div>
```

**Why a single `<p>` and not multiple `<p>` elements?** This is critical because of `decorateButtons`. The EDS boilerplate `decorateButtons()` function (lines 424-454 of `aem.js`) converts any `<a>` that is the **sole child** of a `<p>` into a `.button` with `.button-container` styling (pill-shaped, colored background). If each link were in its own `<p>`, every link would become a button — destroying the understated single-line treatment. By placing all links inline within one `<p>` alongside text nodes (the copyright text and middots), `decorateButtons` will not trigger because none of the `<a>` elements are the sole child of their parent `<p>`. This is the correct EDS authoring pattern for inline links.

#### (b) Whether `decorate()` needs changes

**The current `decorate()` function needs changes, but minimal ones.** Here is why:

The current `footer.js` does:
1. Loads the fragment (which runs `decorateMain` -> `decorateButtons`, `decorateSections`, etc.)
2. Clears `block.textContent`
3. Creates a wrapping `<div>`
4. Moves all fragment children into the wrapping `<div>`
5. Appends the wrapper to block

This produces the DOM: `footer > .footer > div > .section > .default-content-wrapper > p`. That is three levels of wrapping `<div>` before reaching the actual content, which makes CSS targeting unnecessarily deep.

**Recommended approach -- keep `decorate()` almost as-is, but adjust CSS selectors to work with the existing structure.** The fragment loading pattern is boilerplate-standard and produces predictable DOM. Rather than fighting it, the CSS should target through it. The `<div>` wrapper the current JS creates is harmless.

However, there is one consideration: the header implementation (DDD-002) took the approach of building DOM fresh rather than moving fragment nodes, explicitly to avoid `decorateButtons` class contamination. For the footer, this is not necessary because:

1. If authored correctly as a single `<p>` with mixed content, `decorateButtons` will not fire on the links (they are not sole children of `<p>`).
2. The footer content is simple enough that the fragment structure is predictable and CSS can handle it.

**Minimal JS change recommended**: Add a semantic `aria-label` or `role` annotation and ensure the content wrapper has a known class for CSS targeting. Specifically:

```javascript
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);
}
```

This is essentially the current code unchanged. The key is that `block` already gets `class="footer block"` from `buildBlock` and `decorateBlock` in `aem.js`, so selectors like `.footer .default-content-wrapper p` will work.

**Alternative (stronger) approach**: If we want explicit control like the header does, `decorate()` could extract the `<p>` innerHTML from the fragment and build a clean `<p>` to avoid any possible boilerplate class contamination. But this adds complexity for marginal benefit. I recommend keeping the current JS and solving with CSS unless testing reveals problems.

#### (c) CSS selector chain and element targeting

The final DOM after decoration will be:

```html
<footer>
  <div class="footer block" data-block-name="footer" data-block-status="loaded">
    <div>                                    <!-- JS wrapper div -->
      <div class="section">                  <!-- from decorateSections -->
        <div class="default-content-wrapper"> <!-- from decorateSections -->
          <p>
            (c) 2026 Ben Peter ·
            <a href="...">LinkedIn</a> ·
            <a href="/legal">Legal Notice</a> ·
            <a href="/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</footer>
```

CSS targeting strategy:

```css
/* Layout: align with DDD-001 width model */
footer .footer > div {
  max-width: var(--layout-max);
  margin-inline: auto;
  padding-inline: var(--content-padding-mobile);
  padding-block: 24px;
}

/* The single paragraph - the entire footer line */
footer .footer p {
  margin: 0;
  font-size: var(--body-font-size-xs);
  color: var(--color-text-muted);
  text-align: center;                /* centered single line */
}

/* Links within the footer */
footer .footer a:any-link {
  color: var(--color-text-muted);    /* muted like surrounding text */
  text-decoration: none;
}

footer .footer a:hover {
  color: var(--color-link-hover);
  text-decoration: underline;
}

/* Focus ring for keyboard navigation */
footer .footer a:focus-visible {
  outline: 2px solid var(--color-heading);
  outline-offset: 2px;
}
```

**Key CSS decisions:**

1. **Width alignment**: Use `--layout-max`, `margin-inline: auto`, and `--content-padding-*` tokens matching DDD-001 and DDD-002. The footer's left/right edges align with the header and main content outer container.

2. **Text alignment**: Centered. The footer is a single understated line. Centering it within the content area creates a balanced, anchoring visual at the page bottom. (This differs from the left-aligned header, which is appropriate because the header is a branded element with hierarchy; the footer is a symmetric utility element.)

3. **No separate targeting of middots or copyright**: The middot separators are plain text nodes within the `<p>`. They inherit `color: var(--color-text-muted)` from the paragraph. No special targeting needed. The copyright symbol is also a text node. CSS cannot independently target text nodes without wrapping elements, and wrapping them would be over-engineering.

4. **Link color muted**: Footer links should match `--color-text-muted`, not `--color-link` (sage green). The footer is supposed to recede. Using the standard link color would make three sage-green links the most colorful thing at the bottom of every page, violating the "understated line" intent. On hover, they brighten to `--color-link-hover` to confirm interactivity.

5. **Override `main > .section > div` padding**: The fragment's `.section > .default-content-wrapper` will inherit the `main > .section > div` rules from `styles.css` if they are scoped to `main >`. Since this fragment is loaded into `footer`, NOT `main`, those selectors will NOT apply. The footer block CSS must set its own padding. This is actually correct behavior -- it means the footer is self-contained.

   **Wait -- correction**: Looking at `styles.css` line 84: `main > div { margin: var(--section-spacing) var(--content-padding-mobile); }`. This targets `main > div` specifically. The fragment runs `decorateMain` which calls `decorateSections`, adding `.section` class. But since the fragment is inserted into `footer`, not `main`, the `main > .section > div` selectors in `styles.css` (lines 179-195) will not match. The `footer .footer > div` selector in the footer CSS is the correct place to handle width constraints.

6. **Background**: The current CSS sets `background-color: var(--color-background-soft)`. For the minimal design, I recommend either `var(--color-background)` (same as page, truly invisible footer) or keeping `var(--color-background-soft)` (barely-there tonal separation). The DDD should decide this -- it is a design decision.

7. **Border top**: Consider a `1px solid var(--color-border-subtle)` top border to mirror the header's bottom border. This creates symmetry: the header and footer are the thinnest frames around the content. Again, a design decision.

#### Additional implementation notes

**The `main > div` rule in `styles.css` line 84-86**: This applies `margin: var(--section-spacing) var(--content-padding-mobile)` to direct `div` children of `main`. Since the footer is inside `<footer>`, not `<main>`, this rule does not affect it. No conflict.

**Hardcoded `max-width: 1200px` in current footer CSS**: The current `footer.css` has `max-width: 1200px` hardcoded. This should be changed to `var(--layout-max)` for consistency with the token system. DDD-001 established `--layout-max: 1200px` as the token.

**Responsive padding**: Follow the same three-tier pattern as header:
```css
footer .footer > div {
  padding-inline: var(--content-padding-mobile);
}

@media (width >= 600px) {
  footer .footer > div {
    padding-inline: var(--content-padding-tablet);
  }
}

@media (width >= 900px) {
  footer .footer > div {
    padding-inline: var(--content-padding-desktop);
  }
}
```

**Line wrapping on narrow viewports**: On mobile (375px), the full line `(c) 2026 Ben Peter . LinkedIn . Legal Notice . Privacy Policy` at `--body-font-size-xs` (15px mobile, 14px desktop) is approximately 45-50 characters. At 15px Source Sans 3 in a 335px content area, this may wrap to two lines. This is acceptable -- `text-align: center` handles multi-line gracefully. Alternatively, the DDD could specify `white-space: nowrap` if a single line is mandatory, but this risks horizontal overflow or text being cut off on very small screens. I recommend allowing natural wrapping.

### Proposed Tasks

**Task 1: Author footer fragment content**
- **What**: Create the `/footer` page content in the CMS (or a `drafts/footer.html` test file) with the single `<p>` markup containing the copyright text, middot separators, and three inline links (LinkedIn, Legal Notice, Privacy Policy).
- **Deliverable**: Footer fragment accessible at `/footer.plain.html` returning the expected markup.
- **Dependencies**: CMS access or static draft file approach. Must be authored BEFORE the CSS/JS can be tested.
- **Risk**: If authored as separate paragraphs, `decorateButtons` will convert links to pills. The authoring guidance must be explicit.

**Task 2: Update `footer.css` with DDD-003 styles**
- **What**: Replace the current boilerplate footer CSS with the single-line treatment. Use design tokens (`--layout-max`, `--content-padding-*`, `--color-text-muted`, `--body-font-size-xs`). Implement responsive padding, centered text, muted link colors, focus-visible ring, and the background/border decisions from the DDD.
- **Deliverable**: `blocks/footer/footer.css` implementing the full visual treatment.
- **Dependencies**: Task 1 (need content to test against), DDD-003 approved (for background color and border decisions).

**Task 3: Evaluate and minimally update `footer.js` (if needed)**
- **What**: Verify that the current `decorate()` function produces a workable DOM for CSS targeting. If needed, add a block-level JSDoc comment explaining the design spec reference (matching the header pattern). Ensure no `decorateButtons` contamination.
- **Deliverable**: `blocks/footer/footer.js` -- either unchanged or with minimal updates (comments, aria attributes).
- **Dependencies**: Task 1 (need content to inspect actual decorated DOM).

**Task 4: Verify accessibility**
- **What**: Test keyboard navigation through footer links (Tab order: LinkedIn -> Legal Notice -> Privacy Policy). Verify focus ring visibility at `--color-heading` against footer background. Verify link text is descriptive (no "click here"). Verify `<footer>` landmark is announced by screen readers.
- **Deliverable**: Accessibility verification noted in PR description.
- **Dependencies**: Tasks 2 and 3 complete.

**Task 5: Cross-browser and responsive testing**
- **What**: Test at 375px, 600px, 900px, and 1200px+ viewports. Verify the line wraps gracefully on mobile. Verify padding tokens produce correct alignment with header and main content. Test in light and dark mode.
- **Deliverable**: Visual verification (screenshots or manual sign-off).
- **Dependencies**: Tasks 2 and 3 complete.

### Risks and Concerns

1. **`decorateButtons` contamination (HIGH RISK)**: If the footer fragment is authored incorrectly (each link in its own `<p>`), `decorateButtons` will add `.button` class to every link and `.button-container` to every `<p>`, producing pill-shaped buttons instead of understated inline links. **Mitigation**: The DDD must explicitly document the authoring pattern (single `<p>` with mixed content), and a test content file should be created as part of the implementation.

2. **Fragment loading creates deep DOM nesting**: The `loadFragment` -> `decorateMain` -> `decorateSections` pipeline wraps content in `.section > .default-content-wrapper`, producing `footer > .footer > div > .section > .default-content-wrapper > p`. This is four wrappers deep before reaching the content `<p>`. This is standard EDS behavior and not a bug, but the CSS must account for it. The selectors `footer .footer p` and `footer .footer a` are broad enough to reach through this nesting without specifying every intermediate layer.

3. **Missing footer content page**: The `/footer` page does not currently exist in the CMS (returns 404 on preview). The implementation needs either (a) the page authored in the CMS, or (b) a `drafts/footer.html` file for local testing with `--html-folder drafts`. Without content, the footer block silently renders nothing.

4. **Link color override specificity**: The global `a:any-link { color: var(--color-link); }` in `styles.css` targets all links. The footer CSS needs `footer .footer a:any-link` (higher specificity) to override this with `--color-text-muted`. This should work without `!important`, but the specificity chain must be verified.

5. **Background color decision impacts contrast**: If `--color-background-soft` (#EFE9DD in light mode) is used, all color contrast ratios for footer text and links must be verified against this background, not `--color-background`. The `--color-text-muted` (#817B6F) on `--color-background-soft` (#EFE9DD) yields approximately 3.6:1 -- passing WCAG AA for large text but marginal for small text (4.5:1 required). At `--body-font-size-xs` (14-15px), this is small text. **This needs verification.** If contrast fails, either use `--color-background` (warm white, better contrast) or darken the text color for the footer.

6. **Mobile line wrapping**: The full footer text may wrap to 2 lines on narrow viewports. This is aesthetically acceptable but should be a conscious design decision, not a surprise. The DDD should state whether wrapping is allowed or if the layout should reflow (e.g., stacking copyright on one line and links on another).

### Additional Agents Needed

**None.** The footer is a CSS-only redesign of a simple block. The current team (planning + frontend implementation) is sufficient. The design decision (background color, border, text alignment) is the only variable requiring resolution, and that should be captured in DDD-003 before implementation begins.

One note: if the DDD-003 author needs to verify contrast ratios for the muted text on different background options, they should either compute those themselves or request a quick accessibility check. The frontend implementation will enforce whatever the DDD specifies, but the DDD should specify a contrast-safe combination.
