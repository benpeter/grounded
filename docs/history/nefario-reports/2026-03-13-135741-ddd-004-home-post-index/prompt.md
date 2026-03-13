**Outcome**: A Design Decision Document (DDD-004-home-post-index.md) exists at docs/design-decisions/ that defines how the home page displays posts as a clean reverse-chronological list — type badge, title, description, date, and tags per entry — so that implementation agents can build the post index without ambiguity about visual treatment.

**Success criteria**:
- DDD-004-home-post-index.md exists at docs/design-decisions/ with all required sections per the DDD format
- Each post entry shows: type badge, title, description, date, and tags
- Four type badges defined (build-log, pattern, tool-report, til) with distinct but understated visual treatment
- List is reverse chronological with no pagination, no featured post, no hero image, no card shadows
- ASCII wireframe shows a single post entry and the list rhythm at mobile and desktop
- HTML Structure uses semantic markup (article, time, heading hierarchy) consistent with docs/content-model.md metadata fields
- Token Usage table maps every element to CSS custom properties from styles/tokens.css
- Status is set to "Proposal"

**Scope**:
- In: Post list layout, individual post entry design, type badge treatment, tag display, date formatting, responsive behavior
- Out: Post detail page (DDD-005), tag index page (DDD-007), pagination (not until 20+ posts), global layout (DDD-001), actual implementation

**Constraints**:
- Content model defined in docs/content-model.md (metadata fields, post types, taxonomy)
- Output format must match docs/design-decisions/README.md template exactly
- AEM Edge Delivery Services conventions for content rendering
