## Domain Plan Contribution: accessibility-minion

### Recommendations

#### 1. Each post entry MUST be an `<article>` element

Each post entry in the index should be wrapped in `<article>`. This is not optional -- it is the semantically correct element per the HTML specification: "a self-contained composition in a document, page, application, or site ... which is intended to be independently distributable or reusable." A post summary in an index is exactly this. Screen readers announce `<article>` landmarks, allowing users to navigate directly between posts using shortcut keys (NVDA: `d`, JAWS: unassigned by default but navigable via Elements List, VoiceOver: rotor). With 20+ entries before pagination, this navigation shortcut becomes critical -- without it, users must tab or arrow through every element in every entry sequentially.

Each `<article>` should have an accessible name derived from the post title. The most natural way to achieve this is via the heading inside the article (screen readers automatically compute the accessible name from the first heading child). Adding `aria-labelledby` pointing to the heading element's `id` makes this explicit and reliable across all screen reader/browser combinations.

#### 2. The index SHOULD be wrapped in a landmark, but not `<section>`

The post list occupies the `<main>` content area of the home page. Since the home page IS the post index, the `<main>` landmark already identifies this content region. Adding a nested `<section aria-label="Posts">` would create a redundant landmark -- on a page with only one content purpose, it adds noise to the landmark list without aiding navigation.

However, if the home page ever gains content above or below the post list (e.g., a brief intro paragraph), a `<section aria-label="Recent posts">` around the list would become valuable for disambiguation. For V1, where the home page is exclusively the post index, rely on `<main>` as the containing landmark.

Do NOT use `role="feed"` (ARIA 1.1). While semantically tempting for a reverse-chronological post list, `role="feed"` implies infinite scrolling with dynamic content loading, which this site does not do. Misusing it would confuse assistive technology users who expect feed-specific interactions (e.g., `article` focus management, `aria-busy` states during loading).

#### 3. Post titles MUST use `<h2>` on the home page

The heading hierarchy for the home page:

- **`<h1>`**: The page title. On the home page, this is implicit -- the site name "Mostly Hallucinations" serves as the `<h1>`. However, the header uses `<span>` elements (not heading elements) for the logo text, as established in DDD-002. This means the `<h1>` must come from the page content itself. The home page should have a visually hidden or visible `<h1>` such as "Recent Posts" or the site name.
- **`<h2>`**: Each post title. This is the correct level directly under `<h1>`.

Using `<h3>` would imply each post title is a subsection of some intermediate `<h2>`, which does not exist on this page. WCAG SC 1.3.1 (Info and Relationships, Level A) requires heading levels to reflect the logical structure of the content. Skipping from `<h1>` to `<h3>` violates this.

**Critical decision needed**: The CLAUDE.md states "one `<h1>`, proper heading hierarchy." The header does not provide an `<h1>` (it uses spans). The home page needs an explicit `<h1>`. Options:

- **Option A**: A visible `<h1>` like "Recent Posts" or "Latest" -- but this may conflict with the minimal aesthetic.
- **Option B**: A visually hidden `<h1>` (`.sr-only` / `clip-rect` pattern) containing the site name or "Posts" -- screen readers find it, visual users see only the post list.
- **Option C**: The site name in the header is changed to an `<h1>` on the home page only (conditional rendering). This is the most semantically clean approach but adds implementation complexity in the EDS block model.

**Recommendation**: Option B (visually hidden `<h1>`). It satisfies WCAG without visual impact and avoids conditional logic in the header block. The `<h1>` text should be "Posts" or "Recent Posts" -- short, descriptive, and matching the page's `<title>` element. This is a well-established pattern used by major blogs and content sites.

#### 4. Type badges should be announced as a visually hidden prefix within the heading

The type badge (build-log, pattern, tool-report, til) conveys the post's content type. This information is meaningful to all users and should be available to screen readers. Three approaches considered:

**Approach A (Recommended): Visually hidden text prefix in the heading, visible badge as a sibling element.**

```html
<article aria-labelledby="post-1-title">
  <span class="post-type" aria-hidden="true">build-log</span>
  <h2 id="post-1-title">
    <span class="sr-only">Build Log: </span>
    Building This Blog with Edge Delivery Services
  </h2>
</article>
```

This gives screen readers the announcement "heading level 2, Build Log: Building This Blog with Edge Delivery Services" -- the type is naturally part of the heading context. The visible badge is `aria-hidden="true"` to prevent double announcement. The accessible name of the `<article>` (via `aria-labelledby`) includes the type prefix, so users navigating by article landmarks also hear the type.

**Approach B (Acceptable alternative): Badge as separate text, announced before heading.**

```html
<article>
  <p class="post-type">build-log</p>
  <h2>Building This Blog with Edge Delivery Services</h2>
</article>
```

Screen readers announce "build-log" then "heading level 2, Building This Blog..." in reading order. The type is heard, but it is not part of the heading, so navigating by headings alone skips it. This is acceptable but less informative for heading-only navigation, which is the primary navigation mode for screen reader users scanning a long list.

**Why not `role="status"` or `role="img"`**: The badge is static content, not a live status update. `role="img"` with `aria-label` would work but adds unnecessary complexity for what is fundamentally text content.

**Display text**: The raw enum values (`build-log`, `tool-report`) should be transformed to human-readable labels for both visual and screen reader users: "Build Log", "Pattern", "Tool Report", "TIL". The visually hidden prefix in the heading should match the visible badge text for consistency (WCAG SC 2.5.3 Label in Name, Level A -- the accessible name must contain the visible label).

#### 5. Date markup: `<time datetime="">` with explicit human-readable text

```html
<time datetime="2026-03-12">March 12, 2026</time>
```

Requirements:

- **`datetime` attribute**: Machine-readable ISO 8601 format (`YYYY-MM-DD`). Required for structured data, search engines, and assistive technology that may process dates programmatically.
- **Human-readable text content**: "March 12, 2026" (not "2026-03-12" or "Mar 12"). Screen readers read the text content, not the `datetime` attribute. Abbreviated month names ("Mar") are acceptable but full names are clearer for cognitive accessibility.
- **No `aria-label` on `<time>`**: The text content IS the accessible name. Adding `aria-label` would be redundant.

**Announcement order in the post entry**: The date should appear after the title and description in DOM order. The reading flow should be: type badge, title (heading), description, date, tags. This matches the visual hierarchy described in site-structure.md (type label, title, description, date, tags) and ensures screen reader users get the most important information (what the post is about) before metadata (when it was published).

Do not use relative dates ("3 days ago") -- they become stale and meaningless. Always use absolute dates.

#### 6. Tags: an unordered list of links with group labeling

```html
<ul class="post-tags" aria-label="Tags">
  <li><a href="/tags/eds">EDS</a></li>
  <li><a href="/tags/ai-workflow">AI Workflow</a></li>
  <li><a href="/tags/claude-code">Claude Code</a></li>
</ul>
```

**Why `<ul>` of links, not comma-separated inline links:**

- **List semantics**: Screen readers announce "list, 3 items" -- users immediately know how many tags exist and can skip the list entirely if they want. With comma-separated links, users must tab through every tag to discover how many there are.
- **Navigation efficiency**: NVDA and JAWS allow skipping past lists entirely (`l` key navigates between lists). With 20+ posts, each potentially having 3-5 tags, that is 60-100 extra tab stops if tags are individual inline links without list semantics.
- **`aria-label="Tags"` on the `<ul>`**: Identifies the purpose of the list. Screen readers announce "Tags, list, 3 items."
- **No comma separators needed in the DOM**: Visual separation can be achieved with CSS (`li + li::before` or flexbox gap). Screen readers ignore CSS-generated content in most configurations, and the list semantics already provide separation.

**Tag display text**: Tags in the content model are lowercase-hyphenated (`ai-workflow`). The visible text should be title-cased or naturally cased for readability ("AI Workflow", "Claude Code", "EDS"). The `href` uses the slug form (`/tags/ai-workflow`).

**Alternative considered -- comma-separated inline links**: Acceptable for very short tag lists (1-2 tags) but scales poorly. With the starter tag vocabulary already at 15+ tags and posts potentially having 3-5 tags each, the `<ul>` approach is the right investment.

#### 7. Additional semantic and accessibility considerations

**Focus indicators (WCAG 2.4.13 Focus Appearance, AA)**: All interactive elements in the post index -- title links, tag links -- must have visible focus indicators. Use the established pattern from DDD-002 and DDD-003: `outline: 2px solid var(--color-heading); outline-offset: 2px`. This achieves 7.75:1 contrast on `--color-background` (light mode), well above the 3:1 minimum.

**Target size (WCAG 2.5.8 Target Size Minimum, AA)**: Tag links and the post title link must have a minimum 24x24 CSS pixel target area. Tags at `--body-font-size-xs` (14-15px) with minimal padding may fall below this threshold. Ensure tag links have sufficient padding to meet the 24x24px minimum. The "inline" exception in WCAG 2.5.8 applies to links within sentences of text, but tag links are standalone interactive elements -- the exception does not apply.

**Consistent help (WCAG 3.2.6, AA)**: Not directly applicable to the post index, but if any help/navigation mechanisms are added, they must maintain consistent relative ordering across the home page and individual post pages.

**Redundant entry (WCAG 3.3.7, AA)**: Not applicable -- no form inputs on the post index.

**Link purpose (WCAG 2.4.4, Level A)**: The post title link must be descriptive of its destination. The title text itself satisfies this. If the entire post entry (not just the title) is made clickable, ensure the accessible name comes from the title text, not from a generic "Read more" label.

**Color independence (WCAG 1.4.1, Level A)**: Type badges must not rely on color alone to convey the post type. The text label ("Build Log", "Pattern", etc.) provides the information textually. If badges use background colors or colored text to differentiate types visually, the text label is the primary information carrier -- the color is supplementary.

**Content reflow (WCAG 1.4.10, Level AA)**: The post index must be usable at 320px viewport width (equivalent to 1280px at 400% zoom) without horizontal scrolling. The single-column layout established in DDD-001 already supports this, but verify that post entries with long titles or many tags do not break layout at narrow widths.

**Reduced motion (WCAG 2.3.3, Level AAA -- but good practice)**: If any hover transitions are applied to post entries (e.g., subtle background color change, title color transition), respect `prefers-reduced-motion: reduce`.

### Proposed Tasks

1. **Define the `<h1>` strategy for the home page**: Decide between visible or visually hidden `<h1>`. Document in DDD-004. This is a prerequisite for the heading hierarchy decision and affects the header block's behavior on the home page vs. post pages.

2. **Specify the full HTML structure in DDD-004**: Include the complete semantic structure with `<article>`, `<h2>`, `<time>`, `<ul>` for tags, `aria-labelledby`, `aria-label`, and `aria-hidden` attributes. This becomes the implementation contract.

3. **Define human-readable type labels**: Map enum values to display text (`build-log` -> "Build Log", `til` -> "TIL", `pattern` -> "Pattern", `tool-report` -> "Tool Report"). Document the mapping in DDD-004 so the implementing agent produces consistent labels.

4. **Specify the `.sr-only` utility class**: If one does not already exist in the project's CSS, define it in `styles/styles.css`:
   ```css
   .sr-only {
     position: absolute;
     width: 1px;
     height: 1px;
     padding: 0;
     margin: -1px;
     overflow: hidden;
     clip: rect(0, 0, 0, 0);
     white-space: nowrap;
     border: 0;
   }
   ```
   This is needed for the visually hidden `<h1>` (if Option B is chosen) and the type badge prefix in headings.

5. **Verify tag link target sizes**: During implementation, measure tag link target areas at both mobile and desktop font sizes. If any tag link falls below 24x24px, add padding to meet WCAG 2.5.8.

6. **Screen reader testing checklist for post index**: After implementation, test with NVDA + Firefox and VoiceOver + Safari to verify:
   - Article landmarks are announced and navigable
   - Heading navigation (`h` key) reads type prefix + title for each post
   - Tag lists announce item count
   - Dates are read as human-readable text
   - Focus order matches visual order (type -> title -> description -> date -> tags)
   - Focus indicators are visible on all interactive elements

### Risks and Concerns

1. **Missing `<h1>` on the home page**: The header uses `<span>` elements per DDD-002, which means no page-level `<h1>` exists unless the home page content provides one. This is a WCAG SC 1.3.1 (Level A) concern and also triggers axe-core rule `page-has-heading-one`. This must be resolved in DDD-004 before implementation.

2. **EDS block model constraints**: The post index may be implemented as an EDS block that transforms authored content. The semantic structure recommended here (nested `<article>` elements with `<h2>`, `<time>`, `<ul>`) requires the `decorate()` function to produce this DOM. The implementing agent must verify that EDS's `decorateBlock()` pipeline does not inject unwanted classes (e.g., `decorateButtons()` promoting links to `.button` pills) that break the semantic structure. The footer DDD-003 already documents this risk with inline links.

3. **Tag link proliferation**: With 20+ posts and 3-5 tags each, the page may contain 60-100+ tag links. This is a significant number of tab stops for keyboard users. The tag `<ul>` structure mitigates this (users can skip lists), but consider whether tag links on the index page are truly necessary or whether they should be non-linked text labels. If tags are linked, keyboard users navigating with Tab will spend significant time traversing them. Balanced against this, tag links provide valuable filtering functionality. The recommendation is to keep tags as links but ensure list semantics are present so users can skip them.

4. **Type badge double announcement**: If both the visible badge and the heading contain the type text, screen readers will announce it twice unless the visible badge is `aria-hidden="true"`. The recommended structure (Approach A in section 4) handles this correctly, but the implementing agent must not omit the `aria-hidden` on the visible badge.

5. **Focus indicator on `--color-accent`**: DDD-001 Open Question #5 notes that `--color-accent` (#D9B84A) achieves only ~2.7:1 contrast on `--color-background`, below the 3:1 minimum for WCAG 2.4.13. The post index must use `--color-heading` for focus rings, consistent with DDD-002 and DDD-003. This should be documented explicitly in DDD-004 to prevent an implementing agent from defaulting to the accent color.

6. **Long post titles and text truncation**: If post titles are visually truncated (e.g., with `text-overflow: ellipsis`), the full title must remain available to screen readers. CSS truncation does not affect the accessible name, so this is primarily a cognitive accessibility concern -- ensure truncated titles provide enough context to distinguish posts. Recommendation: do not truncate titles. The aesthetic guidelines favor typography over constrained boxes, and truncation contradicts this.

### Additional Agents Needed

No additional agents beyond those likely already involved (ux-design-minion for visual design, frontend-minion for implementation). The accessibility concerns are well-scoped within the post index surface and do not require specialist input beyond what this contribution provides.

One note: if the DDD includes structured data (JSON-LD) for the post index -- which the content model suggests for individual posts (`TechArticle` with `proficiencyLevel: Expert`) -- the structured data specialist aspects can be handled by the implementing agent following schema.org documentation. No separate agent is needed for this.
