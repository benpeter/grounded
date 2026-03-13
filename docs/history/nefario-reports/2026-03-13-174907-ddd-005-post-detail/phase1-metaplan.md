# Meta-Plan: DDD-005 Post Detail

## Task Summary

Create DDD-005-post-detail.md — a design decision document specifying the complete reading experience for individual blog posts. This covers post title, metadata display, and every content element an article body can contain (headings, paragraphs, code blocks, inline code, blockquotes, pull-quotes, lists, links). The scope absorbs what was originally split between DDD-005 (post detail layout) and DDD-006 (typography & code), producing a single comprehensive spec.

This is a **design document task**, not an implementation task. The output is one markdown file following the established DDD template.

## Planning Consultations

### Consultation 1: Typography & Reading Rhythm

- **Agent**: ux-design-minion
- **Planning question**: Given the existing token set (Source Sans 3 body at 20px/18px, Source Code Pro headings, Source Serif 4 editorial, 68ch measure, 1.7 line-height), what are the optimal spacing ratios for a long-form technical article? Specifically: (a) heading spacing above/below h2 and h3 (DDD-001 proposes 2em above / 0.5em below — validate or revise), (b) paragraph-to-code-block transitions, (c) blockquote and pull-quote indentation and vertical spacing, (d) list item spacing inside ordered and unordered lists. Consider that this is a technical blog where code blocks and lists are frequent — rhythm must not break at these transitions.
- **Context to provide**: `styles/tokens.css` (full file), DDD-001 spacing proposals, DDD-004 as format exemplar, site-structure.md single post section, CLAUDE.md aesthetic rules
- **Why this agent**: ux-design-minion has deep expertise in visual hierarchy, typographic spacing, and component-level design decisions. The reading rhythm and element spacing are fundamentally design decisions that benefit from a design-trained eye rather than pure engineering judgment.

### Consultation 2: Semantic HTML & Accessibility Structure

- **Agent**: accessibility-minion
- **Planning question**: For a long-form technical article page with these elements — h1 title, metadata line (type badge, date, updated date, tags), article body with h2/h3, code blocks, blockquotes, pull-quotes, lists, inline code, and links — what is the optimal semantic HTML structure? Specifically: (a) Should the metadata line use the same `<footer>` pattern as DDD-004 entries, or a different structure since this is a single-page context? (b) What ARIA landmarks and roles are needed beyond `<article>` and heading hierarchy? (c) How should pull-quotes be marked up (blockquote with a class? aside? figure?)? (d) How should the "updated" date relate to the "published" date in the DOM for screen readers? (e) Code block accessibility — should `<pre><code>` blocks have any ARIA attributes or labeling?
- **Context to provide**: DDD-004 HTML structure (as precedent), content-model.md (metadata fields), CLAUDE.md accessibility requirements (WCAG 2.2 AA), the post elements list from the issue
- **Why this agent**: The HTML structure is the foundation that CSS targets and implementation agents build. Getting semantic markup right is a prerequisite for both accessibility compliance and clean CSS selectors. This agent catches structural issues that are expensive to fix after implementation.

### Consultation 3: Code Block & Technical Content Design

- **Agent**: frontend-minion
- **Planning question**: For EDS-decorated blog posts containing code blocks, what are the implementation constraints and design implications? Specifically: (a) How does EDS deliver code blocks in the decorated DOM — what is the actual HTML structure after section/block decoration for `<pre><code>` content? (b) Should code blocks break out of the `--measure` constraint or stay within it (considering that 68ch is narrow for code)? (c) What horizontal overflow strategy should the DDD specify — horizontal scroll on `<pre>`, or something else? (d) Are there EDS-specific patterns for syntax highlighting that the DDD should account for (even if not V1)? (e) What is the actual DOM structure EDS produces for inline code, lists, and blockquotes in default content?
- **Context to provide**: AGENTS.md (EDS markup conventions), DDD-001 code block escape hatch note, scripts/aem.js (for decoration patterns), existing blocks as reference
- **Why this agent**: frontend-minion understands EDS's decoration pipeline and the actual DOM structures that CSS must target. Without this input, the DDD might specify HTML that doesn't match what EDS actually produces, leading to implementation friction.

## Cross-Cutting Checklist

- **Testing**: EXCLUDE from planning. This is a design document, not executable code. No test strategy input needed for DDD authoring. (Test-minion will review the plan in Phase 3.5.)
- **Security**: EXCLUDE from planning. No attack surface, no user input handling, no auth. Pure design document. (Security-minion will review in Phase 3.5.)
- **Usability -- Strategy**: INCLUDE via ux-design-minion consultation above. Planning question: The post detail page is the core reading experience — does the proposed element set (title, metadata, body elements) cover all user jobs-to-be-done for a technical blog reader? Are there reading-experience patterns we should explicitly exclude or include? (Note: ux-strategy-minion's concerns are covered by ux-design-minion's consultation since this is a single-surface design task, not a multi-surface journey question. ux-strategy-minion will review in Phase 3.5.)
- **Usability -- Design**: INCLUDE — Consultation 1 (ux-design-minion) covers this directly.
- **Documentation**: EXCLUDE from planning. The DDD itself IS the documentation artifact. software-docs-minion has no additive planning value here. Will participate in Phase 3.5 review.
- **Observability**: EXCLUDE. No runtime components. Pure design document.

## Anticipated Approval Gates

1. **DDD-005-post-detail.md (the deliverable itself)** — This is a MUST gate. It is hard to reverse (defines the CSS contract for the entire reading experience) and has high blast radius (DDD-006 depends on it per the surface inventory, plus all future post-page implementation). The DDD format is specifically designed for human review before implementation.

This is the only gate needed. The task produces a single document that requires approval before any downstream implementation work begins.

## Rationale

Three specialists are consulted for planning because this DDD sits at the intersection of three domains:

1. **Visual design** (ux-design-minion): The reading rhythm and spacing ratios are the heart of this DDD. A technical blog lives or dies on its typographic quality. These decisions are judgment calls that benefit from design expertise.

2. **Accessibility** (accessibility-minion): The HTML structure section is a binding contract for implementation. Semantic markup decisions (how to mark up pull-quotes, metadata, updated dates) affect both accessibility and CSS targeting. Getting this right in the DDD prevents rework.

3. **Frontend/EDS** (frontend-minion): EDS has specific DOM decoration patterns that constrain what HTML structures are possible. The DDD must specify HTML that aligns with what EDS actually produces, not idealized HTML. Code block handling is an EDS-specific concern.

Agents NOT consulted for planning:
- **ai-modeling-minion**: No prompt engineering or agent architecture involved.
- **software-docs-minion**: The DDD template is already established; no documentation strategy input needed.
- **ux-strategy-minion**: The single post page is a well-understood reading experience. Journey-level strategy questions (how does the reader get here? what do they do after?) are already answered by the site structure doc. ux-strategy-minion will review in Phase 3.5.
- **margo / lucy**: Governance reviewers triggered unconditionally in Phase 3.5. No planning input needed.

## Scope

**In scope:**
- Post title (h1) treatment and typography
- Metadata line: type badge, publication date, updated date (when present), tags
- All article body content elements: h2, h3, paragraphs, code blocks (`<pre><code>`), inline code, blockquotes, pull-quotes, ordered lists, unordered lists, links
- Reading rhythm: line-height, measure, paragraph spacing, heading spacing, element transition spacing
- Pull-quote design: Source Serif 4, gold accent left border
- Code block design: Source Code Pro, warm cream background
- Responsive behavior at all breakpoints
- ASCII wireframes for mobile and desktop
- Semantic HTML structure
- Token usage table mapping every element to CSS custom properties
- CSS approach (key selectors, layout method)

**Out of scope:**
- Home page / post index (DDD-004, already implemented)
- Tag index page (DDD-007)
- Global layout (DDD-001, already implemented)
- Dark mode toggle (DDD-008; `prefers-color-scheme` token overrides are automatic)
- JSON-LD structured data
- Series navigation (mentioned in site-structure.md but not in the issue scope)
- Actual CSS/JS implementation
- Sidebar, table of contents, author bio, related posts (explicitly excluded by CLAUDE.md V1 scope)

## External Skill Integration

No external skills detected in project. Neither `.claude/skills/` nor `.skills/` directories exist in the working directory.
