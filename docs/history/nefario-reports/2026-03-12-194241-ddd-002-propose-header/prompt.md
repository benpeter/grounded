A Design Decision Document (DDD-002-header.md) exists at docs/design-decisions/ that defines the header treatment -- typographic logo, tagline placement, and the corrupted-letterform concept for "Hallucinations" -- so that the existing header block at blocks/header/ can be redesigned to match the brand identity. The DDD follows the format in docs/design-decisions/README.md.

Success criteria:
- DDD-002-header.md exists at docs/design-decisions/ with all required sections per the DDD format
- Logo is typographic only: "Mostly Hallucinations" in Source Code Pro (--font-heading token)
- Proposal describes the corrupted letterform effect on "Hallucinations" (wrong strokes, floating counters, misplaced serifs) with enough specificity for CSS/SVG implementation
- Tagline placement and typography are defined with token references
- No navigation links in the header (deliberately minimal)
- ASCII wireframe shows mobile and desktop layout
- HTML Structure reflects the existing blocks/header/ decoration pattern (AEM EDS block conventions)
- Token Usage table maps every visual element to a CSS custom property from styles/tokens.css
- Status is set to "Proposal"

Scope:
- In: Logo treatment, tagline, corrupted letterform concept, header block HTML structure, responsive behavior
- Out: Navigation (there is none), footer, global layout (DDD-001), actual CSS/JS implementation

Constraints:
- Must work within AEM Edge Delivery Services block conventions (blocks/header/ structure)
- Existing header block at blocks/header/ will be redesigned, not built from scratch
- Source Code Pro for logo text (--font-heading token)
- Output format must match docs/design-decisions/README.md template exactly

---
Additional context: do not include security and test in the reviewers list. skip context compaction. use frontend, ux strategy and ux design minions for the planning team
