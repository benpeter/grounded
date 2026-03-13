A Design Decision Document (DDD-005-post-detail.md) exists at docs/design-decisions/ that defines the complete reading experience for individual blog posts — title, metadata, and every content element an article body can contain — so that implementation agents can build a cohesive, typographically precise post page.

Success criteria:
- DDD-005-post-detail.md exists at docs/design-decisions/ with all required sections per the DDD format
- Title (h1), metadata line (type badge, date, updated date, tags), and article body are all defined
- Every body element has typography specs: headings (h2/h3), paragraphs, code blocks, inline code, blockquotes, pull-quotes, lists, links
- Reading rhythm defined: line height, measure (68ch), paragraph spacing, heading spacing
- Pull-quotes use gold accent border (--color-accent) and Source Serif 4 (--font-editorial)
- Code blocks use Source Code Pro (--font-code) with warm cream background
- No sidebar, no table of contents, no author bio, no related posts
- ASCII wireframe shows the full post layout at mobile and desktop
- HTML Structure uses semantic markup (article, h1, time, heading hierarchy) consistent with docs/content-model.md
- Token Usage table maps every element to CSS custom properties from styles/tokens.css
- Status is set to "Proposal"

Scope:
- In: Post title, metadata display, all article body content elements (headings, paragraphs, code, blockquotes, pull-quotes, lists, links), reading rhythm, responsive behavior
- Out: Home page / post index (DDD-004), tag index (DDD-007), global layout (DDD-001), dark mode (DDD-008), JSON-LD structured data, actual implementation

Constraints:
- Content model defined in docs/content-model.md (metadata fields, post types)
- Reading measure is 68ch (--measure token)
- Source Code Pro for code, Source Serif 4 for pull-quotes, Source Sans 3 for body
- Gold accent (--color-accent) appears at most once per screen — pull-quote border only
- Output format must match docs/design-decisions/README.md template exactly
