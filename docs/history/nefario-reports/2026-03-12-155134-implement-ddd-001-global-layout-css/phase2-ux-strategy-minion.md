## Domain Plan Contribution: ux-strategy-minion

### Recommendations

#### 1. The Mobile Line Length Deferral is Acceptable -- But Needs a Guard Rail

**Assessment: Deferral to DDD-005/006 is the correct call, with one condition.**

The 37-40 character line length on a 375px mobile viewport is below the 45-character minimum I would normally advocate for comfortable reading. However, three factors make deferral acceptable rather than dangerous:

**a) This is the universal mobile reality, not a design deficiency.** At 375px viewport width, every single-column reading site faces this constraint. The New York Times, Medium, every Substack, the Smashing Magazine mobile view -- they all land in the 35-42 character range on an iPhone SE/13 mini. Users have internalized short-line reading on mobile. The cognitive adaptation is already in place. Calling this a "regression" would imply there was a better state to regress from; there isn't one at this viewport width without shrinking font size below accessibility thresholds.

**b) The lever is font size, not padding.** The DDD correctly identifies that the fix lives in DDD-005/006 (typography), not in layout padding. Shrinking `--content-padding-mobile` below 20px would create a claustrophobic edge-to-edge reading experience that damages readability more than short lines do. The typography DDD should evaluate whether `--body-font-size-m: 20px` is the right mobile size for Source Sans 3 -- many reading-optimized sites use 17-18px on mobile, which would push line length to 41-45 characters. That's the right conversation, and it belongs in the typography DDD.

**c) The layout contract is intentionally abstract.** DDD-001 defines geometry -- containers, padding, max-widths. It does not define the rendering of text within those containers. Coupling a font-size decision into the layout DDD would violate the separation of concerns the DDD system is designed to maintain. The layout should be correct at any reasonable font size; the typography DDD should then choose the font size that produces optimal reading within the established geometry.

**The guard rail:** DDD-001's Open Question #3 must remain open and explicitly referenced in DDD-005/006's context section. The implementing agent for DDD-005/006 must treat mobile line length as a first-class constraint, not an afterthought. I recommend adding a sentence to DDD-001's Open Question #3 (or to the plan for the implementing agent) that says: "The typography DDD must validate that the chosen mobile font size yields at least 42 characters per line within the 335px content column on a 375px viewport." This makes the handoff contract explicit.

**UX risk of shipping as-is:** Low. There is no regression because the boilerplate has no reading-optimized layout at all. Users will encounter a layout that is better than what exists today (nothing) even if the mobile line length is not yet optimal. The typography DDD will arrive before any real content is published. This is a greenfield site with zero posts -- the layout contract will be validated against real content before any reader encounters it.

#### 2. The Padding Progression: 20px to 24px to 32px

**Assessment: The 4px jump from mobile to tablet is too subtle to justify a distinct token. Simplify to a two-tier model.**

Here is the core UX question: does the user perceive a difference between 20px and 24px padding? Let me work through the perceptual math:

- **20px to 24px** is a 20% increase. On a 600px viewport, that's 552px vs 560px content width -- an 8px difference total, 4px per side. This is below the threshold of conscious perception for spatial relationships in a reading context. The user will not notice this change. It serves no functional purpose.
- **24px to 32px** is a 33% increase. This is perceptible and meaningful. The padding at 32px creates visible breathing room that signals "you are on a larger screen with comfortable margins."
- **20px to 32px** (if we skip the middle tier) is a 60% increase. This is a clear step change that users perceive as a distinct spatial upgrade when they cross the tablet breakpoint.

From a cognitive standpoint, the three-tier model introduces a token (`--content-padding-tablet`) that exists solely for a transition the user cannot perceive. Every token is maintenance cost. Every token is a decision that future DDDs must account for. The Kano model would classify this as an "indifferent" feature -- its presence or absence does not affect satisfaction.

**My recommendation: two tiers, not three.**

| Breakpoint | Padding | Rationale |
|---|---|---|
| Base (< 900px) | `--content-padding-mobile` (20px) | Content-first, minimal gutter. On tablets (600-899px), the `--measure` constraint begins to create natural centering whitespace, making padding increases unnecessary. |
| >= 900px | `--content-padding-desktop` (32px) | Generous gutter for desktop, where content is centered within ample space. |

This eliminates the `--content-padding-tablet` token entirely. At 600px, the viewport is 600 - 40 = 560px of content. The `--measure` at 68ch (~612px at 20px) doesn't constrain yet, so the content fills 560px. At 700px, content is 660px and `--measure` starts constraining. The centering whitespace from `--measure` takes over the role that padding was trying to play. By 900px when we jump to 32px padding, the content is firmly constrained by `--measure` and the larger padding creates the "desktop breathing room" that signals spatial generosity.

If the implementing team strongly prefers three tiers, the tablet padding should be at least 28px (a 40% step from 20px, perceptible) rather than 24px. But I would advocate for two tiers as the simpler, equally effective solution.

#### 3. Additional UX Observations on the Layout Contract

**a) The `--measure: 68ch` value is well-chosen.** My persistent knowledge base records the optimal line length as 45-75 characters with 66 as the sweet spot. At 68ch, Source Sans 3 will render approximately 60-68 actual characters (the `ch` unit is based on the `0` glyph, and proportional fonts have varying character widths). This lands squarely in the optimal range. No change needed.

**b) The section spacing concern (Open Question #4) is real but correctly deferred.** 48px between sections on a 300-word TIL post could make a single-section post feel like it's floating in space. But this is a content-level concern, not a layout-contract concern. The layout contract should define the default; the content DDDs can override for specific post types.

**c) The heading spacing asymmetry (2em above, 0.5em below) is excellent UX.** This leverages the Gestalt principle of proximity -- headings are pulled toward the content they introduce, creating clear visual grouping without needing rules or color. This is invisible design done right.

### Proposed Tasks

1. **Simplify to two-tier padding** (in implementation plan): Remove `--content-padding-tablet` from the proposed token additions. Use `--content-padding-mobile` for all viewports below 900px, `--content-padding-desktop` at 900px+. This eliminates one token, one media query, and one decision point.

2. **Add explicit handoff constraint to DDD-005/006 backlog**: Create a requirement that the typography DDD must validate mobile line length >= 42 characters per line at 375px viewport width. This makes the deferral safe by ensuring it cannot be forgotten.

3. **No changes to `--measure`, `--layout-max`, or `--section-spacing`**: These values are well-chosen and should ship as specified.

### Risks and Concerns

| Risk | Severity | Mitigation |
|---|---|---|
| Mobile line length ships below 45 chars and typography DDD never adjusts it | Medium | Explicit handoff constraint in DDD-005/006 context; friction log against real content before launch |
| Three-tier padding adds unnecessary token complexity | Low | Simplify to two tiers (recommendation above) |
| `ch` unit variance across fonts causes `--measure` to render outside 45-75 char range | Low | Open Question #2 already flags this; in-browser validation required before DDD-005/006 finalizes |
| Section spacing too generous for short TIL posts | Low | Correctly deferred to content DDDs; not a layout-contract concern |

### Additional Agents Needed

None beyond those already planned. The UX concerns raised here are addressed by:
- **The implementing agent** (for the two-tier padding simplification)
- **The typography DDD authors** (for mobile line length validation in DDD-005/006)

No additional UX review is needed for DDD-001 implementation. The layout contract is sound.
