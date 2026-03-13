# Accessibility Review — DDD-004 Home Post Index

**Verdict: APPROVE**

The ARIA patterns, semantic HTML, and WCAG 2.2 AA requirements are correctly specified. No blocking issues.

---

## What was reviewed

- Task 2 DOM structure and ARIA attribute usage
- Focus indicator specification
- Keyboard navigation model
- `.sr-only` implementation and placement
- Screen reader announcement behavior
- WCAG 2.2 AA compliance across all specified patterns

---

## Findings

### ARIA patterns: correct

**`aria-labelledby` on `<article>`** — Correctly references the `<h2>` ID (`post-1-title`, etc.). This gives each article landmark a computed accessible name. Screen readers that support landmark navigation will announce "article, Build Log: Building a Design System for EDS" or equivalent. Pattern is valid per WAI-ARIA 1.2.

**`aria-hidden="true"` on the visible badge `<span>`** — Correctly applied. The badge text is redundant with the sr-only prefix inside `<h2>`. Without `aria-hidden`, screen readers would announce the type twice: once from the badge (during reading flow) and once from the heading prefix (during heading navigation). The plan handles this correctly.

**sr-only prefix text** — The spec requires the prefix text to end with `: ` (colon-space) and to match the visible badge DOM text exactly (title-case, not CSS-uppercase). This satisfies WCAG 2.5.3 Label in Name. The colon-space ensures screen readers parse "Build Log: Building a Design System" rather than "Build LogBuilding a Design System". Correctly specified.

**`<h1 class="sr-only">Posts</h1>` as first DOM child** — Correctly placed before `<article>` elements. The auto-block injects the section via `main.prepend(section)`, guaranteeing DOM order. The `<h1>` is the only `<h1>` on the page (the site logo in the header is not a heading per DDD-002). Heading hierarchy is valid: one `<h1>` (sr-only), then `<h2>` per entry.

**No `role="feed"`** — Correctly omitted. Feed role implies infinite scroll with specific keyboard requirements (Page Down/Up for item navigation). This list has neither. `<main>` + `<article>` landmarks are the correct structure.

**No `aria-label` on `<ul class="post-tags">`** — Correctly omitted per spec rationale. The enclosing `<article>` landmark provides context; the tag list is the only list per article. Adding 20+ identical `aria-label="Tags"` announcements would create noise without adding value. This is sound ARIA authoring practice (first rule of ARIA: don't over-label when context is unambiguous).

### Focus indicators: compliant with WCAG 2.4.13

The spec uses `outline: 2px solid var(--color-heading); outline-offset: 2px` on `:focus-visible`. DDD-004 documents the contrast ratio: `--color-heading` (#3F5232) achieves 7.75:1 on `--color-background` (#F6F4EE) in light mode. WCAG 2.4.13 Focus Appearance (AA) requires a minimum 3:1 contrast ratio between focused and unfocused states, and a minimum focus area of the perimeter of the element at 2px. The 2px solid outline at 7.75:1 satisfies both requirements by a significant margin.

### Keyboard navigation: correct

Tab order follows DOM order: title link, then each tag link, then next entry's title link. This is the expected and correct reading order for a list of articles. No keyboard traps. No interactive elements with `tabindex > 0` proposed.

### `.sr-only` implementation: correct

The implementation matches the Bootstrap/Tailwind canonical definition, including `clip: rect(0, 0, 0, 0)` and `white-space: nowrap`. Placement in `styles/styles.css` (eager) is correct — the conflict resolution in the synthesis plan is sound.

Note: the modern `.sr-only` variant also includes `clip-path: inset(50%)` for forward compatibility with the deprecated `clip` property. This is optional at current browser support levels — `clip: rect(0, 0, 0, 0)` remains effective. If frontend-minion chooses to add `clip-path: inset(50%)` as a belt-and-suspenders measure, that is acceptable.

### Semantic HTML: correct

- `<article>` per entry: correct sectioning element for self-contained content
- `<footer class="post-meta">` within `<article>`: correct per HTML spec (footer of nearest sectioning ancestor)
- `<time datetime="YYYY-MM-DD">`: ISO 8601 date-only format is correct
- `<h2>` for entry titles under sr-only `<h1>`: correct heading hierarchy
- `<ul>` for tag list: correct for a set of related links

### Missing `<ul>` accessible name for tags (non-blocking, advisory)

The plan relies on the `<article>` landmark for tag list context. This is acceptable when the list is the only list in the article. If a future content type (e.g., a "build-log" with a list of related tools) ever adds a second list inside an article, the tags list would become ambiguous. The current spec is correct for V1; annotate this assumption in the block code so a future author doesn't add a second list without considering the accessibility implication.

### Empty state: correct

When zero results, only the sr-only `<h1>` renders. Screen reader announces the landmark region with its name "Posts" and no items. Acceptable for V1.

### Dark mode contrast: verified

The spec documents `--color-text-muted` (#C9C3B8) on `--color-background` (#3A3A33) at ~5.07:1 in dark mode, passing AA (4.5:1). No issues.

---

## Summary

The plan is well-specified from an accessibility standpoint. The ARIA usage is conservative and correct — the authors have avoided common over-ARIA traps (unnecessary roles, redundant labels). WCAG 2.2 AA compliance is achievable with the specified implementation. No changes to the execution plan are required.

One advisory note (not a blocker): add a brief inline comment in `post-index.js` near the tag `<ul>` construction noting that the absence of `aria-label` is intentional and depends on this being the only list per article. This protects the accessibility model against future inadvertent changes.
