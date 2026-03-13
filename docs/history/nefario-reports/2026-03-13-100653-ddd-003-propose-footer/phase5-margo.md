# Margo Review: DDD-003 Footer

**VERDICT: ADVISE**

The document is well-grounded in actual requirements and makes sound technical decisions. The footer is genuinely simple: no JS changes, a handful of CSS rules, and authored HTML in a single `<p>`. The accidental complexity here is not in the proposed implementation but in the document itself -- its depth is disproportionate to the surface it describes.

---

## Findings

### 1. [ADVISE] DDD-003-footer.md -- Document depth disproportionate to implementation complexity

The footer is a single `<p>` of inline text with four links, styled by roughly 30 lines of CSS, requiring zero JavaScript changes. DDD-003 is 333 lines. DDD-002 (the header) is 315 lines and describes a custom SVG displacement filter, a three-line stacked typographic logo with fluid sizing, corruption rules for individual letterforms, and a complete `decorate()` rewrite. The footer's document is longer than the header's despite being an order of magnitude simpler.

Sections that carry more weight than the implementation warrants:

- **Typography table (lines 122-128)**: Every cell says "inherited" -- the footer inherits everything from the page defaults except `font-size` and link `color`. A single sentence ("Footer text uses `--body-font-size-xs` in `--color-text-muted`; links use `--color-link`.") replaces the table.
- **Spacing & Rhythm table (lines 138-145)**: Six rows, four columns for what amounts to: top border, section-spacing above, 24px below, standard content padding. The asymmetric padding rationale is good and worth keeping, but the table format overstates the complexity.
- **Responsive Behavior table (lines 153-157)**: Three rows documenting that `text-align` changes from `center` to `left` at 600px and padding uses the standard tokens. This is a one-sentence behavior.
- **CSS Approach section (lines 236-252)**: Lists six selectors with detailed descriptions. For a component this simple, the CSS itself (which will be ~30 lines) is more readable than the prose describing it. The two corrections from boilerplate (background color and hardcoded max-width) are the valuable content; the rest describes standard link styling.
- **Token Usage table (lines 257-276)**: 19 rows documenting that the footer uses standard tokens with no new ones. The table is useful as a quick reference during implementation, but its length suggests complexity that does not exist.

**Why this matters**: Document complexity sets expectations. A reviewer seeing 333 lines expects 333 lines of implementation nuance. When the implementation is trivial, the document's length becomes a maintenance burden -- future changes require updating prose that is longer than the code it describes.

AGENT: software-docs-minion
FIX: Reduce the document to approximately 150-180 lines. Specific cuts:
- Replace the Typography table with a short paragraph (the "inherited" pattern means there is nothing to specify per-element).
- Collapse the Spacing & Rhythm table into a short list. Keep the asymmetric padding rationale as prose.
- Collapse the Responsive Behavior table into one paragraph (center on mobile, left at 600px+, standard padding tokens).
- Trim the CSS Approach section to: (a) the two boilerplate corrections, (b) the `text-wrap: balance` progressive enhancement note, and (c) the `:any-link` decision. Remove the selector-by-selector walkthrough.
- Keep the Token Usage table but accept that it will shrink naturally once the Typography and Spacing tables are collapsed (fewer rows to cross-reference).

### 2. [NIT] DDD-003-footer.md:74-117 -- ASCII wireframes add little for a single-line element

The mobile and desktop wireframes (44 lines total) visualize a single line of centered/left-aligned text with padding. For the header, wireframes clarified the three-line stacked arrangement and the corruption zone. For the footer, they restate what the prose already says. The desktop wireframe's content line is not even character-width-aligned (line 110 runs longer than the box border).

AGENT: software-docs-minion
FIX: Remove the wireframes. The prose and spacing table already communicate the layout. If wireframes are kept, limit to a single 5-line sketch showing the border, padding, and text line -- not two 20-line diagrams.

### 3. [NIT] DDD-003-footer.md:283-303 -- Open Question 1 is thorough but could be half the length

The "Ben Peter" vs. "LinkedIn" link question is a legitimate design decision. The four-bullet pro/con analysis is reasonable. But 20 lines of arguments for a binary choice on a footer link could be compressed to the two strongest arguments per side and the recommendation.

AGENT: software-docs-minion
FIX: Trim to the single strongest argument per side: "Two links to the same URL is redundant" vs. "'LinkedIn' as visible text signals the destination without hover." Keep the note that no site-structure.md change is proposed.

---

## What the document does well

- **Boilerplate audit (lines 48-54)**: Identifying the two specific CSS corrections (background color and hardcoded max-width) before implementation begins is exactly the right level of analysis. This saves implementation time.
- **EDS constraint note (line 202)**: The warning about `decorateButtons()` promoting solo `<a>` elements in `<p>` tags is a genuine implementation trap. This is essential knowledge for the implementor.
- **Open Questions 2 and 3 (lines 305-321)**: Correctly identifying the site-wide contrast failures and scoping them out of this DDD is disciplined. These are real accessibility issues documented without scope-creeping the footer work.
- **No JS changes proposed**: Correctly identified that the boilerplate `footer.js` is sufficient. No unnecessary code.
- **No new tokens proposed**: The footer uses existing tokens. No abstraction for abstraction's sake.

The implementation plan is sound and proportional. The document describing it is not. Trim the document to match the simplicity of the thing it describes.
