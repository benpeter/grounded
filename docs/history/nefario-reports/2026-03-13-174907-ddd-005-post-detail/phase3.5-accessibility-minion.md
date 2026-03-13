---
reviewer: accessibility-minion
verdict: ADVISE
---

## Verdict: ADVISE

All proposed accessibility patterns are WCAG 2.2 AA compliant. One documentation gap should be addressed in the DDD before implementation.

## Pattern-by-Pattern Assessment

**aria-hidden on pull-quote `<figure>`** — Correct. Pull-quotes repeat existing body content. The documented content rule (pull-quotes MUST only contain text already in the article body) is the essential constraint that makes `aria-hidden` safe here. Content rule must remain in the DDD.

**sr-only prefix in h1** — Correct. The visible badge text ("Build Log") is contained within the h1's accessible name. `aria-hidden` on the sibling `.post-type` span prevents double-announcement. Matches WCAG 2.5.3 Label in Name. Identical to DDD-004 precedent.

**`tabindex="0"` on `<pre>`** — Correct per WCAG 2.1.1 (Keyboard, Level A). Without it, keyboard users cannot scroll overflowing code blocks. The global `:focus-visible` outline style covers `<pre tabindex="0">` so WCAG 2.4.13 Focus Appearance (AA, WCAG 2.2) is satisfied automatically.

**`<header>` for metadata (not `<footer>`)** — Correct. Title + metadata are introductory content; `<header>` is the right semantic container per HTML spec. The note that `<header>` inside `<article>` does NOT create a `banner` landmark is accurate and important — correctly documented.

**Heading hierarchy (h1→h2→h3, h4+ prohibited)** — Correct per WCAG 1.3.1 (Level A). Framing the h4/h5/h6 prohibition as a content constraint (restructure the content) rather than a styling gap is the right approach.

**Body link underlines by default** — Correct per WCAG 1.4.1 (Use of Color, Level A). Underline by default in article body is the right call.

**`<article aria-labelledby="post-title">`** — Correct. Named article landmark aids screen reader navigation. JS decoration requirement correctly flagged as implementation dependency.

**`<time datetime="...">` for dates** — Correct. No `aria-label` on `<time>` is correct (would violate WCAG 2.5.3). Updated span absent from DOM when not present — correct.

## Advisory Item

**Tag link contrast ratio — document or verify in the DDD.**

Tag links in `.post-meta` use `--color-link` with no underline by default (underline on hover only). WCAG 1.4.1 permits omitting underlines when the contrast ratio between the link color and the surrounding non-link text color is at least 3:1 AND a visual cue is provided on focus/hover. The surrounding text uses `--color-text-muted`.

The DDD should explicitly state whether `--color-link` against `--color-text-muted` meets the 3:1 threshold. If it does not, either add underlines by default to tag links, or document the contrast ratio values with confirmation they pass. This is a documentation gap, not a structural flaw — DDD-004 presumably resolved this — but DDD-005 should carry the documentation forward explicitly rather than deferring to DDD-004 by reference.

This is advisory only. It does not block the DDD from proceeding.

## No Blocking Issues

All WCAG 2.2 AA patterns in the HTML Structure section are sound. The document may proceed to execution with the advisory note above addressed during authoring.
