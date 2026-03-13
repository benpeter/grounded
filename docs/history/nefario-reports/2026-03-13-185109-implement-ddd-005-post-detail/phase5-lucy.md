# Lucy Review: DDD-005 Post Detail Implementation

**Verdict: ADVISE**

The implementation is well-structured, correctly scoped, and faithfully follows the DDD-005 spec in most respects. The shared utility extraction (`post-utils.js`) is a clean refactor. The quote block, post-detail CSS, and `scripts.js` decoration logic all align with the spec's HTML structure, token usage, and spacing table. The AGENTS.md update documenting the page-type detection pattern is a good convention addition.

Three findings require attention before merge.

---

## Findings

### [ADVISE] `scripts/scripts.js`:171-173 -- Code blocks get `role="region"` and `aria-label` not specified in DDD-005

**CHANGE:** Every `<pre>` on a post-detail page receives `role="region"` and `aria-label="Code example"` in addition to the specified `tabindex="0"`.

**WHY:** DDD-005 section "Interactions" (line 373) specifies only `<pre tabindex="0">` for keyboard scrolling. The spec's HTML structure example (lines 442-445) shows `<pre tabindex="0"><code>` with no role or aria-label. Adding `role="region"` causes screen readers to announce every code block as a landmark region, which creates noise when a post has many code blocks. This is a gold-plating addition beyond the spec.

**SEVERITY:** SCOPE

**FIX:** Remove `role="region"` and `aria-label` assignments. Keep only `tabindex="0"` as specified:
```js
main.querySelectorAll('pre').forEach((pre) => {
  pre.setAttribute('tabindex', '0');
});
```
If the team later decides landmarks are valuable for code blocks, that should be a deliberate accessibility decision documented in the DDD, not a silent addition.

---

### [ADVISE] `styles/post-detail.css`:41-49 -- Tag links have subtle underline; spec says `text-decoration: none`

**CHANGE:** `.post-meta a:any-link` receives `text-decoration: underline` with `text-decoration-color: var(--color-border)` (a subtle, muted underline). On hover, the underline color shifts to `currentcolor`.

**WHY:** DDD-005's Interactions table (line 370) explicitly states tag links should have `text-decoration: none` by default and `text-decoration: underline` on hover, matching DDD-004's index tag behavior. The implementation instead gives tags a persistent subtle underline. This is a minor visual deviation from the spec -- likely an intentional design refinement, but it contradicts the documented decision.

**SEVERITY:** DRIFT

**FIX:** Either (a) change the CSS to match the spec (`text-decoration: none` default, `underline` on hover), or (b) update DDD-005's Interactions table to document the subtle-underline treatment as the intended behavior. Do not leave the spec and implementation contradicting each other.

---

### [NIT] `docs/content-model.md`:55-61 -- Blockquote authoring notes added to content model

**CHANGE:** A new "Blockquotes" subsection under "Authoring Notes" documents the Quote block variants (standard and pull-quote), including the `aria-hidden` pull-quote convention.

**WHY:** This is a reasonable location for authoring guidance and traces to DDD-005's quote block scope. No concern with the content -- noting it as reviewed.

**SEVERITY:** N/A (approved)

---

## Traceability

| DDD-005 Requirement | Implementation | Status |
|---|---|---|
| Path-based detection, `body.post-detail` class | `scripts.js` `isPostDetail()` + `decoratePostDetail()` | Covered |
| Type badge with `aria-hidden`, sr-only h1 prefix | `scripts.js`:99-112 | Covered |
| Post metadata (date, updated, tags) | `scripts.js`:117-166 | Covered |
| Heading spacing overrides (h2: 2em/0.5em, h3: 1.5em/0.5em, h2+h3: 0.25em) | `post-detail.css`:61-74 | Covered |
| Paragraph spacing (1em top, 0 bottom) | `post-detail.css`:76-79 | Covered |
| Code block spacing, `border-radius: 0`, `tabindex="0"` | `post-detail.css`:81-84, `scripts.js`:169-170 | Covered |
| Body link underlines (WCAG 1.4.1) | `post-detail.css`:115-121 | Covered |
| `decorateButtons()` override for post context | `post-detail.css`:150-178 | Covered |
| Standard blockquote (3px border, `--color-border`) | `quote.css`:17-21 | Covered |
| Pull-quote (3px `--color-accent`, editorial font, `aria-hidden` figure) | `quote.css`:38-55, `quote.js`:114-118 | Covered |
| Inline code styling (0.9em, background-soft, 2px padding) | `post-detail.css`:138-144 | Covered |
| Table styling (th/td sizes, border colors) | `post-detail.css`:184-200 | Covered |
| HR styling (2em spacing, border-subtle) | `post-detail.css`:99-103 | Covered |
| List item spacing (0.35em) | `post-detail.css`:91-97 | Covered |
| Quote block spacing in post context | `post-detail.css`:215-225 | Covered |
| Shared post utilities refactor (TYPE_LABELS, date parsing) | `post-utils.js` + `post-index.js` import | Covered |
| AGENTS.md page-type detection docs | `AGENTS.md`:113-128 | Covered |
| Content model blockquote authoring notes | `content-model.md`:53-61 | Covered |
| Series metadata parsed but not rendered | Not implemented (acceptable -- DDD-005 says "store parsed values" but no rendering) | Acceptable gap |
| CSS loaded conditionally in eager phase | `scripts.js`:233-234 | Covered |
| Focus ring on pre | `post-detail.css`:206-209 | Covered |
| Dark mode via token overrides only | No structural dark-mode CSS added | Covered |

All spec requirements have corresponding implementation. No orphaned tasks found beyond the two advisory findings above.
