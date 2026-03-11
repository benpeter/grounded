## Domain Plan Contribution: ux-strategy-minion

### Recommendations

#### (a) Section spacing at 68ch measure: values and fixed vs. fluid

**The 48px section spacing is appropriate but needs nuance.** At 68ch with an 18px body font and 1.7 line height, one line of body text occupies ~30.6px of vertical space. The 48px section spacing is roughly 1.57 lines -- this is in the right range for section breaks in long-form reading, where you want a clear visual pause without a chasm.

However, 48px as a single fixed value is too blunt an instrument. The DDD should establish a spacing *scale*, not a single value. Technical content has multiple levels of separation: paragraph-to-paragraph, heading-to-body, section-to-section, and major-section-to-major-section (e.g., a horizontal rule or thematic break). A single `--section-spacing` collapses these distinctions.

**Recommendation: Keep spacing fixed, not fluid.** Fluid spacing (via clamp() or viewport units) adds engineering complexity with negligible reading benefit. The reading column is already capped at 68ch -- the text doesn't grow, so the spacing doesn't need to. The desktop font-size adjustment (20px mobile to 18px desktop) already provides a subtle density shift. Adding fluid spacing on top would create a moving target that's harder to reason about and debug.

The one exception: the gap between the header/footer and content can be slightly more generous on large viewports, because the page chrome benefits from breathing room proportional to the viewport's emptiness. But this belongs in DDD-002/003, not here.

**Proposed spacing scale for the DDD:**

| Token | Value | Use |
|---|---|---|
| `--space-paragraph` | 1em (~18-20px) | Between paragraphs within a section |
| `--space-element` | 1.5em (~27-30px) | Between distinct elements: after a code block, after a pull-quote, between index entries |
| `--section-spacing` | 48px (keep as-is) | Between major page sections (header-to-content, content-to-footer, between `<section>` elements) |

Using `em` for paragraph and element spacing ties the rhythm to the font size, which is already responsive (20px mobile, 18px desktop). This is the simplest way to get proportional spacing without introducing clamp() or viewport math.

#### (b) Should 68ch apply uniformly to all surfaces?

**No. The reading width should NOT be the layout width.**

This is a critical distinction the DDD must make explicit, because getting it wrong will create visible awkwardness on every page:

- **Post body text**: `--measure` (68ch). This is the reading column. It's the right width for sustained reading of Source Sans 3 at 18-20px.
- **Post index entries on the home page**: `--measure` (68ch). Each entry is a small block of text (title, description, metadata). Keeping it at the reading width maintains visual consistency and avoids the index feeling like a different site.
- **Header and footer**: Should span a wider container (e.g., `--layout-max` at ~72rem / 1152px) with content *within* them optionally constrained to `--measure`. The header logo + tagline and footer copyright + links are single-line elements; constraining them to 68ch won't hurt, but the background treatment (warm white, no visible container) means the distinction is moot. What matters is horizontal padding alignment: header, body, and footer content should share the same left edge.
- **Code blocks**: This is where 68ch becomes a problem. Technical code often has lines longer than 68 characters. Code blocks should be allowed to break out of `--measure` slightly (perhaps up to `--measure-wide`, 80ch or 90ch) with horizontal scroll as a fallback. This decision properly belongs in DDD-006 (Typography & Code), but DDD-001 must establish the container architecture that *permits* this breakout. If the layout wraps everything in a `max-width: 68ch` container with `overflow: hidden`, code blocks are trapped.

**The DDD should define two width tokens:**
1. `--measure`: 68ch -- reading column for prose
2. `--layout-max`: ~72rem (1152px) -- the outermost content boundary, used for header/footer alignment and as the constraint for the page itself

The page container uses `--layout-max`. Within it, prose sections constrain themselves to `--measure`. This gives code blocks and other wide elements room to breathe without requiring hack-y negative margins.

#### (c) Vertical rhythm between content elements

For a technical blog targeting senior engineers, the vertical rhythm must serve *scanning* as much as *reading*. Engineers often scroll a 2000-word build-log looking for the code example or the "what went wrong" section. Clear heading spacing and distinct code block treatment are what make that scan efficient.

**Recommended vertical rhythm rules for the DDD:**

| Element pair | Spacing | Rationale |
|---|---|---|
| Paragraph to paragraph | 1em | Standard prose flow. Source Sans 3 at 1.7 line-height already creates generous inter-line space, so 1em between paragraphs is enough visual separation. |
| Heading (h2/h3) above | 2em | A heading signals a topic shift. 2em above creates a scannable "rest stop." This is the single most important scanning signal on the page. |
| Heading (h2/h3) below | 0.5em | Tight coupling between heading and its content. The heading introduces what follows; large gaps break that relationship. |
| Code block above/below | 1.5em | Code blocks are visually distinct (background color, monospace font) and need breathing room, but not so much that they feel detached from the prose that explains them. |
| Pull-quote above/below | 2em | Pull-quotes are editorial interruptions -- they deserve visual prominence. The gold left border (per site-structure.md) plus generous spacing creates the "pause and consider" moment. |
| List above/below | 1em | Lists are inline content, not block-level breaks. |
| List item to list item | 0.25em-0.5em | Tight grouping within lists. |
| Image/figure above/below | 1.5em | Same treatment as code blocks -- visually distinct elements that need room but not isolation. |
| HR / thematic break | 3em above, 3em below | An explicit "new chapter" signal. Rare in typical posts, but important for build-logs with major phase transitions. |

**Key principle: heading spacing is asymmetric.** More space above (detach from preceding content), less space below (attach to following content). This is the single highest-impact vertical rhythm decision. It makes scanning work because headings visually "belong to" what follows them, not what precedes them.

#### (d) Horizontal padding at each breakpoint

The current tokens define two values: 20px mobile, 32px desktop. This is close but needs one more step.

**The problem with only two padding values:** At 600-900px (tablet), the content column hasn't yet hit the 68ch max-width, so horizontal padding is doing the heavy lifting. 20px is fine on a 375px phone (that's 5.3% of viewport width), but on a 768px tablet, 20px leaves the text uncomfortably close to the edge -- the ratio drops to 2.6% and it feels cramped. Meanwhile, 32px is correct for desktop but unnecessary on tablet where the screen is already modest.

**Recommended padding progression:**

| Breakpoint | Padding | Rationale |
|---|---|---|
| Base (mobile, <600px) | 20px (`--content-padding-mobile`) | Standard mobile margin. At 375px, this leaves 335px for content -- enough for ~38ch at 20px font, which is tight but acceptable for mobile reading. |
| 600px+ (tablet) | 24px | A modest bump. At 768px, this leaves 720px for content. The 68ch measure (at 18px, roughly 612px) fits comfortably with 54px of breathing room on each side. This is where `--measure` first becomes the constraining factor rather than the viewport. |
| 900px+ (desktop) | 32px (`--content-padding-desktop`) | At 900px+, the measure is always narrower than the viewport minus padding. The padding now serves as minimum margin between the reading column and the viewport edge, but the centering of the `--measure` column creates the real whitespace. |
| 1200px+ (wide desktop) | 32px (no change) | Beyond 1200px, the centered reading column floats in ample whitespace. Increasing padding is unnecessary -- the space distributes itself naturally around the centered `max-width: 68ch` column. |

**The critical insight:** On mobile and small tablet, padding IS the margin. On desktop, padding is a safety net -- the centered reading column creates its own margin. The DDD should make this explicit so implementers understand the transition point.

**Consider adding a token for tablet padding:** `--content-padding-tablet: 24px` at the 600px breakpoint. Or consolidate to a single responsive approach: `padding-inline: max(20px, 5vw)` -- but this introduces fluid math and may be overengineering for three static values.

I lean toward the three static tokens. They're easy to understand, easy to override, and the mental model is clear: "20, 24, 32."

### Proposed Tasks

**Task 1: Define the spacing scale in tokens.css**

Add `--space-paragraph`, `--space-element`, and `--content-padding-tablet` to the existing token file. Rename or alias `--section-spacing` if needed. This is the foundation everything else builds on.

- Deliverable: Updated `styles/tokens.css` with new spacing tokens
- Dependencies: None (this is the root)

**Task 2: Define layout container architecture in the DDD**

The DDD must specify two distinct width concepts (`--measure` for prose, `--layout-max` for the page) and explain how they nest. This is the most important structural decision in DDD-001 because every subsequent DDD (header, footer, post, index) depends on it.

- Deliverable: Layout section of DDD-001 with ASCII wireframes showing the nesting at each breakpoint
- Dependencies: Task 1 (needs final token values)

**Task 3: Define vertical rhythm rules in the DDD**

Document the heading-spacing asymmetry, code-block spacing, and element-pair spacing table. These rules will be referenced by DDD-005 (Post Detail) and DDD-006 (Typography & Code) but must be established at the global layout level.

- Deliverable: Spacing & Rhythm section of DDD-001
- Dependencies: Task 1

**Task 4: Define responsive padding progression in the DDD**

Document the three-breakpoint padding model and the conceptual shift from "padding as margin" (mobile) to "centering as margin" (desktop).

- Deliverable: Responsive Behavior section of DDD-001
- Dependencies: Task 1

**Task 5: Validate 68ch measure against actual rendered output**

After the layout is implemented, test the actual character count per line with Source Sans 3 at 18px and 20px. The `ch` unit is based on the "0" glyph width, and Source Sans 3's "0" may produce a reading column that's slightly wider or narrower than intended. If the rendered line length falls outside 60-75 characters, adjust `--measure`.

- Deliverable: A validation check (manual or automated) confirming actual characters-per-line
- Dependencies: Implementation of the layout CSS, font loading

### Risks and Concerns

**Risk 1: Code block width conflict.** If DDD-001 establishes a rigid `max-width: 68ch` container with no escape hatch, DDD-006 (Typography & Code) will be forced into ugly workarounds (negative margins, `calc(100vw - ...)` hacks) to give code blocks more room. The layout container architecture MUST allow child elements to exceed `--measure` up to `--layout-max`. This is a hard constraint on the CSS approach section.

**Risk 2: The `ch` unit is font-dependent.** `68ch` in Source Sans 3 produces a different pixel width than `68ch` in Source Code Pro. If headings (Source Code Pro) are also constrained to `--measure`, they'll render at a different physical width than body text. The DDD should specify that `--measure` applies to body-text containers, and heading width is inherited from the same container (not independently constrained).

**Risk 3: Mobile body font size of 20px may be too large.** At 20px with 1.7 line-height, a mobile screen (375px - 40px padding = 335px) fits roughly 38 characters per line. This is below the 45-character minimum I'd recommend for comfortable reading. The content will feel "chunky" -- lots of hyphenation or short lines. At 18px, the same width yields ~43 characters, which is borderline acceptable. This is a typography decision, not a layout decision, but the DDD should flag it because the layout (padding values) and the font size are coupled. If the font size changes, the padding math changes.

**Risk 4: Section spacing of 48px may feel inconsistent between TILs and build-logs.** A 200-word TIL surrounded by 48px of section spacing will feel like it's floating in space. A 3000-word build-log will feel dense by comparison. The DDD establishes global rules, but DDD-005 may need per-type adjustments. Flag this as an open question.

**Risk 5: Header/footer alignment with the reading column.** If header and footer content is left-aligned within a `--layout-max` container while post body text is centered within `--measure`, the left edges won't align. This creates a subtle but noticeable visual jag. The DDD should specify whether header/footer content aligns with the reading column or the layout container. (Recommendation: align with the reading column for visual coherence, which means header/footer effectively use `--measure` too, or use the same centering + max-width approach.)

### Additional Agents Needed

None. The current team is sufficient for the planning phase. The tasks identified here are squarely in the domain of UX strategy (spacing rationale, rhythm rules, cognitive load of layout decisions) and implementation (CSS architecture). A ux-design-minion would be the right agent to translate these spacing rules into the DDD's ASCII wireframes and CSS approach sections, and a frontend-minion would implement and validate.

One note: if there is no accessibility specialist involved, the DDD should explicitly reference WCAG 1.4.12 (Text Spacing) which requires that content remain readable when users override line-height to 1.5x, paragraph spacing to 2x, letter-spacing to 0.12x, and word-spacing to 0.16x. The layout must not break under these conditions. This is a constraint on the container architecture (no fixed heights, no overflow:hidden on text containers).
