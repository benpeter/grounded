## Domain Plan Contribution: ux-strategy-minion

### Recommendations

#### 1. Title-First Scanning, Not Category-First

**Recommendation: Title leads. Type badge follows.**

The question of whether the type badge should lead or follow the title is resolved by understanding the two user jobs this index serves:

**Repeat visitors** scan for "what's new." Their primary recognition signal is the title — they are looking for new titles they haven't seen before. The type badge is secondary confirmation ("ah, it's a build log, so it'll be meaty"). Placing the type badge before the title would force them to parse a category label on every entry before reaching the title, adding unnecessary cognitive overhead to the dominant use case.

**New visitors** scan for "is this relevant to me." They scan titles for topic keywords (AEM, Edge Delivery, Claude Code) and descriptions for depth signals. The type badge helps them calibrate expectations ("tool-report" = evaluation, "til" = quick hit), but only after the title has established topic relevance. A type badge in isolation ("build-log") tells a new visitor nothing about whether the post is relevant — only the title does that.

Both jobs converge on the same hierarchy: **title is the primary entry point for every scan pattern.**

The type badge's job is to set expectations about format and depth, not to function as a filtering mechanism (there is no type filter in V1 scope). It should appear near the title — ideally on the same visual line or immediately adjacent — so the reader can absorb "title + type" as a single cognitive chunk. But it must never compete with the title for attention.

**Evidence from comparable sites:** Technical blogs that lead with category badges (e.g., "TUTORIAL" pill before the title) optimize for browsing diverse content libraries. Single-author niche blogs optimize for scanning a curated feed. This is the latter.

#### 2. Visual Hierarchy and Reading Order

The five data points should follow this hierarchy, from strongest to weakest visual weight:

```
1. Title         — strongest: --color-heading, largest size, link
2. Description   — second: --color-text, body size, the "why should I read this"
3. Type badge    — third: small, muted, format signal near the title
4. Date          — fourth: muted, temporal anchor for repeat visitors
5. Tags          — weakest: smallest, most muted, navigation affordance
```

**Rationale by cognitive function:**

- **Title** is the decision point. It answers "what is this about?" Every scan starts here.
- **Description** is the conversion point. It answers "why should I read this?" Users who pause on a title need the description to decide whether to click. It must be immediately accessible after the title with no intervening elements.
- **Type badge** is the calibration signal. It answers "what kind of reading experience is this?" This is especially valuable given the extreme length variance (100-word TILs to 3,000-word build logs). Placing it near the title but at reduced visual weight lets readers absorb "Title + Type" as one unit.
- **Date** is the freshness signal. Repeat visitors use it to find their "last visited" boundary. New visitors use it to assess currency. It does not need prominent placement — muted text is sufficient.
- **Tags** are the "more like this" affordance. They are not the primary discovery mechanism (the flat chronological list is). Tags matter when a reader has found something relevant and wants related content.

#### 3. Recommended Reading Order (Top to Bottom Within Each Entry)

```
[type badge]  Title of the Post
Description text spanning one to two lines, summarizing the post's
value proposition in concrete terms.
date                                                    tag1  tag2
```

**Type badge placement:** Same line as title, preceding it, at reduced size and muted color. This creates a "label: title" pattern that reads as a single unit. The badge is visually subordinate (smaller, muted) but spatially coupled (same line). This is the "inline label" pattern, not the "stacked category" pattern.

**Why same-line, not stacked above:** Stacking the type badge above the title creates an extra line of muted text that the eye must process before reaching the title. On a list of 10+ entries, this adds significant vertical space and scanning cost. The inline pattern keeps entries compact and title-first in the visual scan path.

**Date and tags on the same terminal line:** Date left-aligned, tags right-aligned (or simply following after the date). This is the metadata footer of each entry — information you want available but not competing with the title-description pair. Both are rendered in `--color-text-muted` at `--body-font-size-xs`.

#### 4. Tags as Navigation Affordances, Not Metadata

**Recommendation: Tags are clickable links to tag index pages. They are navigation affordances, not decorative metadata.**

The site structure defines tag index pages (`/tags/{tag}`). Tags in the post index should link to these pages. This serves the "more like this" job — a reader interested in "eds" content can click the tag to see all EDS posts.

**However, tags should be visually quiet.** They should not be styled as pills, badges, or buttons. This is consistent with the site's aesthetic rules: no rounded containers, no color blocks. Tags should be plain text links at `--body-font-size-xs` in `--color-link`, separated by a simple character (middot, comma, or whitespace). The underline-on-hover or always-underline treatment (consistent with footer link styling for WCAG 1.4.1) makes them recognizable as links without adding visual noise.

**Avoid pill/badge styling for tags.** Pill-shaped tags are a strong visual pattern that would compete with the type badge and the title. On a minimalist site where "typography creates hierarchy, not color blocks or boxes," plain text links are the correct treatment.

#### 5. Type Badge Treatment

The type badge must be recognizable across entries without becoming a visual distraction. Recommendations:

- **Text only, no background color.** Consistent with the "no cards, no color blocks" aesthetic.
- **Font:** `--font-heading` (Source Code Pro) at `--body-font-size-xs`. The monospace face creates a subtle visual distinction from body text (Source Sans 3) without requiring color differentiation.
- **Color:** `--color-text-muted`. Subordinate to the title.
- **No abbreviation.** Write "build-log", "pattern", "tool-report", "til" as-is. These are short enough that abbreviation would reduce recognizability without meaningful space savings. The hyphenated, lowercase format matches the content model and has a "code" feel appropriate for a technical blog.
- **No icons.** The V1 scope excludes decorative icons, and the aesthetic rules forbid them. Text-only badges are clearer for a technical audience.

#### 6. Entry Separation

The site-structure.md specifies "breathing room and perhaps the faintest rule line (`--color-border-subtle`)."

**Recommendation: Use whitespace as the primary separator, with an optional `--color-border-subtle` rule.**

- **Vertical spacing between entries:** `--section-spacing` (48px) is too much — it would create a sparse, disconnected feel for a list. Something closer to `--space-element` (1.5em, ~27-30px) plus a faint 1px rule creates visual grouping without excessive whitespace.
- **The rule line helps for lists longer than 5 entries.** Without rules, adjacent descriptions and metadata lines can blur together. The `--color-border-subtle` rule is near-invisible on the warm white background — it provides just enough structure.
- **No alternating backgrounds, no hover highlights on the entire entry.** These would create visual noise inconsistent with the aesthetic.

#### 7. TIL vs. Build-Log Length Disparity

The most significant UX challenge is that TIL entries (100-500 words) and build-log entries (1,000-3,000 words) appear in the same list but represent very different reading commitments. The type badge partially addresses this, but consider:

- **Description length should be consistent across types (1-2 sentences).** The description field already normalizes this — it's the authored summary, not the full post. As long as descriptions are held to 1-2 sentences, entries will have consistent visual weight regardless of post length.
- **Do NOT add reading time estimates.** The content model explicitly excludes them ("the scrollbar is the reading time"). The type badge implicitly communicates expected depth: "til" = quick, "build-log" = long.
- **Do NOT visually differentiate entry layout by type.** All four types should use identical entry structure. Varying the layout would add scanning complexity and violate consistency (Nielsen heuristic #4). The type badge is sufficient to signal format differences.

#### 8. Entry as a Click Target

**The title should be the primary link.** The entire entry should NOT be a single large click target (no `<a>` wrapping the whole entry). Reasons:

- Tags need to be independent click targets (linking to tag pages, not the post).
- A large click target would prevent text selection for the description.
- The title as link is the established web convention for post lists.

**The title link should use `--color-heading` (not `--color-link`).** This is consistent with how headings-as-links are typically treated — the heading color signals hierarchy, and the link behavior is discovered through cursor change and optional hover treatment. Using `--color-link` (sage green) would subordinate the title visually, which contradicts its position as the strongest element. On hover, the title could deepen or gain an underline, but the default state should read as a heading.

#### 9. Accessibility Requirements

- Each entry should use `<article>` to create a feed-like landmark structure.
- The date should use `<time datetime="...">` for machine readability.
- The type badge should be visible text (not `aria-label` only) — it provides useful information to all users.
- Tag links should have no special ARIA treatment — they are standard text links.
- The list itself needs no `role="feed"` in V1 (no infinite scroll, no pagination).
- Heading hierarchy: if the page has an `<h1>` (which could be implicit — the home page title), post titles in the index should be `<h2>` or `<h3>` depending on context. The home page likely has no visible `<h1>` (the header logo is `<span>`, not `<h1>`), so post titles as `<h2>` is the safest choice. However, there should be a non-visible `<h1>` for accessibility, or the page's `<h1>` could be the site title. This needs resolution.

#### 10. Mobile Considerations

On mobile (< 600px), the reading order becomes even more critical because vertical space is precious:

- **Type badge and title must remain on the same line** if possible. If the title is long enough to wrap, the badge sits at the start of the first line and the title wraps naturally.
- **Description below, full width.**
- **Date and tags can stack** if horizontal space is insufficient, but they should remain at the bottom of each entry.
- **Touch targets for tags:** At `--body-font-size-xs` (15px on mobile), tag links may be below the 44px minimum touch target recommended by WCAG 2.5.8 (enhanced). Since this is AA (not AAA), the minimum is 24x24px. Tags at 15px font size with normal line-height and some padding should clear this, but it needs verification.

### Proposed Tasks

1. **Draft DDD-004-home-post-index.md** following the established DDD format (Context, Proposal with Layout/Typography/Spacing/Responsive/Interactions, HTML Structure, CSS Approach, Token Usage, Open Questions, Decision). The ux-design-minion should produce the wireframes and CSS approach; this UX strategy contribution provides the hierarchy and behavioral requirements.

2. **Resolve the `<h1>` question for the home page.** The header uses `<span>` for the logo (correct per DDD-002). The home page needs an accessible heading structure. Options: (a) a visually hidden `<h1>` like "Latest Posts" or "Mostly Hallucinations", (b) post titles as `<h2>` with an implicit page-level heading. This is an accessibility architecture decision that affects the HTML Structure section of DDD-004.

3. **Define the EDS block structure for the post index.** Determine whether this is a custom block (e.g., `post-index`), an auto-block built in `scripts.js`, or default content decorated in-place. This depends on how the CMS-authored content maps to the five metadata fields. The EDS agent should weigh in on the content authoring pattern.

4. **Validate tag touch targets on mobile.** After the design is specified, verify that tag links at `--body-font-size-xs` with the proposed spacing meet the 24x24px minimum touch target requirement.

5. **Define the empty state.** What does the home page show when there are zero posts? This is a V1 launch concern. Even a simple "Coming soon." line in `--color-text-muted` needs to be specified.

### Risks and Concerns

1. **Heading hierarchy ambiguity.** The home page has no natural `<h1>` — the logo is a `<span>`, and the page has no editorial title. If post titles are `<h2>` with no preceding `<h1>`, accessibility tools will flag an incomplete heading hierarchy. This must be resolved explicitly in DDD-004, not left to the implementing agent.

2. **Type badge visual competition with title.** If the type badge is too prominent (wrong size, wrong color, wrong font weight), it will steal the first-fixation point from the title. The badge must be clearly subordinate. The risk is that "build-log" in Source Code Pro at any size looks like a code label that demands attention. Verification in-browser is essential.

3. **Tag discoverability vs. tag noise.** Tags styled as plain text links may be so quiet that users don't recognize them as interactive. But tags styled as pills would violate the aesthetic. The balance point is underline treatment — tags should be underlined (always or on hover) to signal interactivity without adding visual weight. This is consistent with the footer's approach (underline is the load-bearing distinguisher for links among muted text).

4. **Content density at scale.** With 5 data points per entry and 20 entries visible (no pagination until 20+), the page could become quite long. At the proposed spacing, 20 entries at approximately 120-140px each would create a 2,400-2,800px page. This is acceptable for a technical blog — readers are comfortable scrolling — but it should be validated against the DDD-001 concern about section spacing for short-form content.

5. **EDS content model mapping.** The five metadata fields (type, title, description, date, tags) must be sourced from somewhere. In EDS, content typically comes from a query index or authored fragments. How this data flows into the block's initial DOM structure affects what the `decorate()` function needs to do. If the mapping is complex, the block JS becomes a risk for performance and maintainability.

6. **Dark mode readability.** The type badge in `--color-text-muted` on dark mode (`#C9C3B8` on `#3A3A33`) achieves approximately 3.5:1 contrast. At `--body-font-size-xs` (14px desktop), this may fall below WCAG 1.4.3 AA (4.5:1 for normal text under 18px/14px bold). The DDD should verify this pairing or propose an alternative dark mode treatment for the badge.

### Additional Agents Needed

1. **EDS/AEM specialist** — to define the content sourcing pattern (query index vs. fragment), the authored markup structure the block expects, and any auto-blocking logic. The post index block's contract with the CMS is a critical dependency that affects every design decision about HTML structure.

2. **Accessibility specialist** (if available) — to resolve the `<h1>` question, validate the `<article>` feed pattern, and verify that the proposed tag link sizing meets touch target requirements. The ux-design-minion can handle basic WCAG compliance, but the heading hierarchy question on a page without a natural `<h1>` benefits from specialist review.
