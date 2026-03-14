# Phase 2: Accessibility Review — DDD-005 Post Detail

## Summary

DDD-005 demonstrates strong accessibility awareness overall. The type badge pattern from DDD-004 is correctly reused, body link underlines address WCAG 1.4.1, and `<time>` elements with ISO datetime attributes are correct. There are five issues to address, two of which are blocking (WCAG AA violations) and three advisory.

---

## Findings

### 1. `<article>` Wrapper Strategy — BLOCKING (WCAG 1.3.1 Info and Relationships, Level A)

**Current DDD-005 text** (HTML Key Decision #1): "The `<article>` role is added via JS — either by wrapping `<main>` children or by adding `role="article"` and `aria-labelledby` to `<main>` itself."

**Recommendation: Wrap `<main>` children in a real `<article>` element. Do NOT use `role="article"` on `<main>`.**

Rationale:
- `<main>` already has an implicit ARIA role of `main`. Adding `role="article"` to `<main>` **replaces** the `main` landmark role — screen reader users lose the ability to navigate to `main` via landmark navigation. This violates WCAG 1.3.1 and ARIA rule 2 ("Don't change native semantics unless absolutely necessary").
- The correct pattern is to inject a real `<article>` element inside `<main>` that wraps all post content sections. `aria-labelledby="post-title"` goes on the `<article>`.
- EDS structure means `<main>` contains multiple `.section` divs. The decoration JS should create an `<article>` element, move all section children of `<main>` into it, then append the `<article>` to `<main>`.

**Implementation guidance:**
```javascript
// In post-detail decoration (scripts.js or a post-detail block)
const article = document.createElement('article');
article.setAttribute('aria-labelledby', 'post-title');
// Move all <main> children into <article>
const main = document.querySelector('main');
while (main.firstChild) {
  article.appendChild(main.firstChild);
}
main.appendChild(article);
```

**CSS impact**: Selectors like `main > .section` would need to become `main > article > .section` or use `body.post-detail .section`. Since DDD-005 already proposes `body.post-detail` scoping, this is low-risk — but the implementing agent must verify all existing `main >` selectors still work.

**Alternative (simpler, acceptable)**: If DOM restructuring is too disruptive to EDS's decoration pipeline, skip the `<article>` wrapper entirely. A single blog post inside `<main>` with proper heading hierarchy is semantically adequate. The `<main>` landmark already communicates "this is the primary content." The `<article>` adds value for pages with multiple independent content items (like the post index), but is not strictly required for a single-post page. If this path is chosen, remove the `aria-labelledby` from `<main>` (it is not needed when `<main>` contains a single `<h1>`).

**Priority: Blocking if `role="article"` on `<main>` is implemented. Non-blocking if the simpler alternative (no wrapper, no role change) is chosen.**

---

### 2. Pull-Quote `aria-hidden="true"` — ADVISORY (Correct Pattern, With Discipline Requirement)

**DDD-005 pattern**: `<figure aria-hidden="true">` on pull-quotes that repeat content from the post body.

**Verdict: This is the correct accessibility pattern.** Pull-quotes are decorative emphasis — repeated content that adds visual variety but no new information. `aria-hidden="true"` correctly prevents screen readers from announcing the same sentence twice.

**Requirements for correctness:**
- **Content discipline is mandatory**: Every pull-quote sentence MUST appear verbatim elsewhere in the post body. DDD-005 already states this ("Content discipline: every pull-quote sentence must appear verbatim in the post body"). This must be enforced editorially — there is no automated check.
- `aria-hidden="true"` on the `<figure>` removes it and all descendants from the accessibility tree. No focusable elements may exist inside. Since pull-quotes contain only a `<blockquote>` with `<p>` text and no links or interactive elements, this is safe.
- The `<figure>` element choice is semantically appropriate — it marks self-contained content pulled from the flow.

**No action needed by implementing agent.** This is a note for content authors.

---

### 3. `<pre tabindex="0">` Keyboard Accessibility — ADVISORY (Improvement Recommended)

**DDD-005 pattern**: `<pre tabindex="0">` makes code blocks keyboard-focusable for horizontal scrolling via arrow keys.

**Current assessment**: `tabindex="0"` is the correct approach for making scrollable regions keyboard-accessible (WCAG 2.1.1 Keyboard, Level A; axe-core rule `scrollable-region-focusable`). The focus ring via `:focus-visible` provides visual indication.

**Recommendation: Add `role="region"` and `aria-label="Code example"` to `<pre>` elements.**

Rationale:
- A focusable `<pre>` without a role or label is announced by screen readers as simply "group" or with no context. NVDA announces "edit" or the raw code text. JAWS may announce "blank" for empty-looking regions.
- Adding `role="region"` and `aria-label="Code example"` (or a more descriptive label when possible) gives screen reader users context about what they are focusing on and why it is focusable.
- This is a best practice, not a strict WCAG AA requirement. The `<pre>` is already keyboard-accessible, which satisfies the SC.

**Implementation guidance:**
```javascript
// During post-detail decoration
block.querySelectorAll('pre').forEach((pre) => {
  pre.setAttribute('tabindex', '0');
  pre.setAttribute('role', 'region');
  pre.setAttribute('aria-label', 'Code example');
});
```

**Caveat**: Only add `tabindex="0"` when the `<pre>` content actually overflows (i.e., when horizontal scrolling is needed). Adding keyboard focus to non-scrollable code blocks creates unnecessary tab stops. However, detecting overflow at decoration time is unreliable (content may not be rendered yet), so applying it universally and accepting the extra tab stops is a reasonable V1 tradeoff.

**Priority: Advisory.** Implement if feasible; acceptable to ship without for V1.

---

### 4. Body Link Underlines — PASS (WCAG 1.4.1 Use of Color, Level A)

**DDD-005 pattern**: Body links have `text-decoration: underline` by default, removed on hover.

**Verdict: Fully WCAG 1.4.1 compliant.** Links in body text are distinguishable from surrounding text by both color (`--color-link` #5A7543 vs `--color-text` #3A3A33) AND underline. The underline is the non-color affordance required by SC 1.4.1.

**One note on the hover state**: Removing the underline on hover is acceptable because:
1. The hover state itself (cursor change, color shift to `--color-link-hover`) provides interaction feedback.
2. WCAG 1.4.1 requires links to be distinguishable in their default state. The hover state is transient and user-initiated.
3. This is a common, well-understood micro-interaction pattern.

**No action needed.**

---

### 5. Tag Link Contrast — BLOCKING (WCAG 1.4.1 Use of Color, Level A)

**DDD-005 text**: "The visual distinction relies on color difference (green vs warm gray) rather than contrast ratio between them. Both individually meet 4.5:1 contrast against --color-background. Tags are also interactive (cursor: pointer, hover underline) which provides a non-color affordance."

**Contrast verification:**
| Pair | Ratio | WCAG AA (normal text) |
|---|---|---|
| `--color-link` (#5A7543) on `--color-background` (#F6F4EE) | 4.70:1 | PASS |
| `--color-text-muted` (#6F6A5E) on `--color-background` (#F6F4EE) | 4.90:1 | PASS |
| `--color-link` vs `--color-text-muted` (adjacent distinction) | 1.04:1 | N/A (not a WCAG contrast requirement between adjacent text colors) |

**The real WCAG 1.4.1 issue**: Tag links in the metadata line (`<span class="post-tags-inline">`) do NOT have underlines by default. They rely on color alone to distinguish themselves from the adjacent muted text (date, middot separators). The DDD-005 interaction table confirms: "Tag links (default): `text-decoration: none`."

WCAG 1.4.1 states: "Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element." Tag links are interactive elements that are visually indistinguishable from surrounding metadata text except by color (green vs warm gray — and the 1.04:1 ratio means these colors are barely distinguishable to anyone, let alone users with color vision deficiency).

**DDD-005 argues**: "Tags are also interactive (cursor: pointer, hover underline) which provides a non-color affordance." This is insufficient — `cursor: pointer` is not perceivable without hovering (fails the "distinguishable at a glance" test), and hover underline only appears on interaction. A user must already know the tags are links to hover over them.

**However**: DDD-004 (post-index) ships the exact same pattern for tags, and this is a deliberate design decision matching DDD-004 precedent. The risk is real but contained:
- Tags are metadata, not primary navigation or call-to-action links.
- The middot separator pattern provides some structural cue (` . aem . eds . performance`).
- The tags are in a metadata context (after the date) where users learn to expect interactive elements.

**Recommended fix (non-disruptive)**: Add a subtle underline to tag links in the metadata line. This can be visually quiet:
```css
.post-meta .post-tags-inline a {
  text-decoration: underline;
  text-decoration-color: var(--color-border);  /* near-invisible underline */
  text-underline-offset: 0.15em;
}
```
This satisfies WCAG 1.4.1 with minimal visual disruption to the design. The underline uses `--color-border` (#C9C3B8) which nearly melts into the background, consistent with the site's aesthetic.

**Alternative**: Accept the risk for V1, acknowledging this is a known WCAG 1.4.1 edge case shared with DDD-004. If accepted, document it as a known issue to be addressed when tag styling is revisited.

**Priority: Blocking per strict WCAG AA compliance. Can be deferred if the team accepts the risk with documentation.**

---

## Additional Findings (From Contrast Verification)

### 6. Link Color on Code Block Background — ADVISORY

**Finding**: `--color-link` (#5A7543) on `--color-background-soft` (#EFE9DD) has a contrast ratio of 4.28:1, which **fails** WCAG AA for normal-sized text (requires 4.5:1). This matters if links appear inside or immediately after code blocks where the soft background extends.

**Risk assessment**: Low for V1. Links inside `<pre>` code blocks are unlikely (code blocks contain `<code>` text, not links). Links in prose paragraphs render on `--color-background` (#F6F4EE), not the soft background. This only becomes an issue if future designs place linked text on `--color-background-soft` surfaces.

**No action needed for V1.** Note for future reference if the design introduces linked content on soft background surfaces.

### 7. Focus Ring Contrast — PASS

`--color-heading` (#3F5232) focus ring on `--color-background` (#F6F4EE): **7.75:1** contrast ratio. Exceeds WCAG 2.4.13 Focus Appearance requirements. Passes in both light and dark modes (dark: `--color-heading` becomes #F6F4EE on #3A3A33 = 10.42:1).

### 8. Dark Mode Contrast — PASS

All dark mode color pairings verified:
| Pair | Ratio | Status |
|---|---|---|
| `--color-link` (#9FB68A) on dark bg (#3A3A33) | 5.20:1 | PASS AA |
| `--color-text-muted` (#C9C3B8) on dark bg (#3A3A33) | 6.54:1 | PASS AA |
| `--color-text` (#F6F4EE) on dark bg (#3A3A33) | 10.42:1 | PASS AA |

---

## Summary Table

| # | Issue | WCAG SC | Severity | Action |
|---|---|---|---|---|
| 1 | `role="article"` on `<main>` removes main landmark | 1.3.1 (A) | Blocking | Use real `<article>` inside `<main>`, or skip the wrapper entirely |
| 2 | Pull-quote `aria-hidden="true"` | N/A | Correct | Enforce content discipline editorially |
| 3 | `<pre tabindex="0">` missing label | Best practice | Advisory | Add `role="region"` + `aria-label="Code example"` |
| 4 | Body link underlines | 1.4.1 (A) | Pass | No action |
| 5 | Tag links rely on color alone | 1.4.1 (A) | Blocking | Add subtle underline, or accept risk with documentation |
| 6 | Link color on soft background | 1.4.3 (AA) | Advisory | Note for future; no V1 impact |
| 7 | Focus ring contrast | 2.4.13 (AA) | Pass | No action |
| 8 | Dark mode contrast | 1.4.3 (AA) | Pass | No action |

---

## Recommendations for Implementation

1. **For the `<article>` question**: Choose the simpler path — do NOT add `role="article"` to `<main>`. Either wrap children in a real `<article>` element or skip it entirely. A single blog post in `<main>` with an `<h1>` is semantically complete.

2. **For tag links**: Add `text-decoration: underline; text-decoration-color: var(--color-border);` to tag links in the metadata line. This is the lowest-impact fix that achieves WCAG 1.4.1 compliance. Apply the same fix to DDD-004 post-index tags for consistency.

3. **For code blocks**: Add `role="region"` and `aria-label="Code example"` alongside `tabindex="0"`. This is low-effort and improves the screen reader experience meaningfully.

4. **Screen reader testing priority**: After implementation, manually test the following with NVDA + Firefox:
   - Heading navigation (h1 should announce with type prefix, e.g., "Build Log: Building a Design System...")
   - Landmark navigation (main landmark must be present)
   - Pull-quote is skipped (not announced)
   - Code block focus (announced with label, arrow keys scroll)
   - Tag links are discoverable via link navigation
