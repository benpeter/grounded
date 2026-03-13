# Domain Plan Contribution: ux-strategy-minion

## Recommendations

### The "render nothing" empty state is correct for V1

DDD-004's decision to render only the sr-only `<h1>` and no articles when query-index.json returns zero results is the right call. Here is the reasoning:

**The audience is the author, not the public.** A brand-new blog with zero posts has exactly one visitor: Ben. An "empty state" UI (a "Coming soon!" card, a placeholder illustration) serves no user job. The author already knows the site is empty -- he just built it. Any affordance here is noise, not signal.

**An empty state adds permanent code and cognitive surface for a transient condition.** The blog will have zero posts for approximately one deployment cycle. After the first post is published, the empty state code is dead weight that still needs maintenance, testing, and consideration during future changes. This violates the "every feature is a permanent tax" principle.

**No visitor should see zero posts.** The site should not be promoted or indexed until at least one post exists. If someone stumbles on it, the header ("Mostly Hallucinations / Generated, meet grounded.") plus the warm-white page communicates "this is a blog" sufficiently. A "no posts yet" message does not change what the visitor does next (leave, or bookmark and return).

**One caveat worth noting:** If the query-index fetch fails (network error, malformed JSON, misconfigured helix-query.yaml), the user experience is identical to "no posts." The implementation should distinguish between "zero results" (intentional, render nothing) and "fetch failed" (unintentional, log a console error for the developer). This is not an empty-state UI concern -- it is an error-handling concern for the implementing agent. No user-visible error message is needed; a `console.error` is sufficient for V1.

### First-visit experience assessment

The home page as the sole navigation surface is well-served by the DDD-004 design. Evaluating against the first-visit user journey:

**Job-to-be-done:** "When I land on a technical blog, I want to quickly scan what this person writes about, so I can decide if their content is worth my time."

The post index directly serves this job. Title + description + type badge + tags give the visitor four signals per entry to make the stay-or-leave decision. This is efficient -- no click-through required to assess relevance.

**Scanning behavior (Krug):** The design supports satisficing well. The title is the dominant visual element per entry. A visitor scanning titles alone can assess topical fit in 3-5 seconds across 5+ entries. The type badge adds a secondary filter ("ah, this is hands-on build logs, not opinion pieces") without demanding attention.

**Cognitive load:** Five elements per entry (badge, title, description, date, tags) is within the 7 plus/minus 2 working memory threshold for a single entry. Across the full list, the repeating structure means the pattern is learned once and applied to all entries -- germane load only on the first entry, then recognition for the rest. This is good.

**What is NOT addressed (and should not be for V1):**

- No way to filter or narrow the list. This is fine for fewer than 20 posts. The full list IS the filter. Adding any filtering mechanism before the volume justifies it would add interaction complexity that slows down the scan-and-decide job.
- No "about" context on the home page. The header tagline ("Generated, meet grounded.") and the post titles/descriptions collectively communicate the author's domain. A separate about section or bio would be a second thing to read before reaching the content. The content IS the pitch.
- Tag links go to 404 until DDD-007. This is an acceptable friction point. Tags are visually quiet (small, muted link color). A first-time visitor is far more likely to click a post title than a tag. The rare visitor who clicks a tag and gets a 404 loses a few seconds -- this is minor friction on a secondary interaction path.

### One risk: the sr-only h1 and landmark navigation

The sr-only `<h1>Posts</h1>` is the only heading at the top of the page content. For screen reader users navigating by headings, the first heading they encounter is "Posts" -- which correctly frames the page. But for sighted users, there is no visible page title or label. The header provides context ("Mostly Hallucinations"), and the post list itself is self-evident. This is fine. The page does not need a visible "Posts" heading -- it would be redundant and add visual noise to a page whose entire content is obviously posts.

However, ensure the sr-only h1 appears before any article elements in DOM order. The DDD-004 spec calls this out explicitly. If auto-blocking injects the post-index block into an existing section, the h1 must still be first in the main content flow. This is an implementation detail, but the UX consequence of getting it wrong is that screen reader heading navigation would skip the page-level context.

## Proposed Tasks

### Task 1: Validate entry spacing with realistic content

**What:** Before finalizing CSS, render the post index with 5-8 entries using realistic title lengths, description lengths, and tag counts. Compare `--section-spacing` (48px) against 36px (`calc(var(--section-spacing) * 0.75)`). The DDD-004 open question 1 flags this.

**Deliverable:** A recommendation on entry spacing backed by visual comparison at mobile (375px) and desktop (900px+) viewports.

**Dependencies:** Requires the post-index block to render (even with mock data). This can be done in parallel with implementation using static test HTML.

**Rationale:** 48px between entries is generous for a list UI. At 10+ entries, it could make the page feel sparse and require excessive scrolling, working against the "efficient archive" goal stated in DDD-004. At 3 entries, 48px feels right. The correct spacing depends on list length, which will grow over time. Pick the value that works at 8-12 entries, since the blog will spend most of its life in that range.

### Task 2: Verify fetch-failure vs. empty-state distinction

**What:** Ensure the `decorate()` implementation distinguishes between "query-index returned zero results" (render nothing, no error) and "fetch failed or returned invalid data" (render nothing, log console.error). Both produce the same visual output, but the console behavior differs.

**Deliverable:** Console error logging on fetch failure. No user-visible difference.

**Dependencies:** Part of the post-index block JS implementation.

**Rationale:** When a developer deploys and sees a blank home page, they need to know whether the index is empty or broken. A console message is the minimum viable developer experience for this diagnostic.

### Task 3: Confirm tag link 404 is acceptable friction

**What:** This is already flagged in DDD-004 open question 3. The UX recommendation is: render tags as links from day one. The 404 is acceptable. But ensure the 404 page (which already exists at `404.html`) does not confuse the visitor -- it should make clear they can navigate back to the home page.

**Deliverable:** Verify `404.html` includes a link back to `/`. If not, flag for the implementing agent to add one.

**Dependencies:** Existing `404.html` file.

**Rationale:** A tag click leading to 404 is minor friction on a secondary path. But a 404 page with no way back to the content is a dead end that breaks the journey entirely. The home page is the only navigation surface -- the 404 page must link to it.

## Risks and Concerns

1. **Tab stop density at scale.** Each entry has 1 + N tab stops (title + tags). With 10 entries averaging 3 tags each, that is 40 tab stops on the page. Keyboard-only users must tab through the entire list sequentially. This is acceptable for V1 (no pagination, no skip links within the list), but should be monitored. If the blog reaches 15+ posts, consider adding a "skip to entry N" mechanism or grouping entries by month with heading-level navigation. This is a future concern, not a V1 blocker.

2. **Description quality drives index usefulness.** The post index's scanning efficiency depends entirely on description quality. If descriptions are auto-extracted from first paragraphs (DDD-004 open question 7), a post that opens with a code block or aside will produce a poor index entry. The UX recommendation: descriptions must be explicitly authored metadata, not auto-extracted. This is a content workflow decision, not a code decision, but it directly affects the usability of the home page. Flag this to the author.

3. **No visual differentiation between post types.** All four types (build-log, pattern, tool-report, til) use identical visual treatment. This is correct per the aesthetic rules. But it means the type badge is the only differentiator, and it is small and muted. If the author finds that visitors do not engage with certain post types, there is no visual lever to pull without violating the design language. This is a deliberate tradeoff -- accept it for V1, revisit if analytics (when added) show type-based engagement patterns.

4. **Mobile metadata line wrapping.** At 375px with 20px padding, the metadata line (date + middot + tag + middot + tag + middot + tag) will wrap. The DDD-004 spec acknowledges this and says left-alignment makes the wrap predictable. Verify this looks acceptable with 4-5 tags -- long tag lists could create a metadata block that visually overwhelms the description above it. If so, consider truncating visible tags to 3 with a "+N more" indicator in a future iteration.

## Additional Agents Needed

None. The current team is sufficient. The UX concerns raised here are either implementation details (handled by the code agent) or content workflow decisions (handled by the author). No additional specialist domain is needed.
