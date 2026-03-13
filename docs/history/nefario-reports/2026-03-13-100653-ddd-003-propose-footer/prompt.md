A Design Decision Document (DDD-003-footer.md) exists at docs/design-decisions/ that defines the footer as a single understated line — copyright, LinkedIn link, Legal Notice, Privacy Policy separated by middots — so that the existing footer block at blocks/footer/ can be redesigned to match the brand's minimal aesthetic.

Success criteria:
- DDD-003-footer.md exists at docs/design-decisions/ with all required sections per the DDD format
- Footer content is exactly: © 2026 Ben Peter · LinkedIn · Legal Notice · Privacy Policy
- No multi-column layout, no newsletter signup, no social icon grid
- ASCII wireframe shows the single-line treatment at mobile and desktop
- HTML Structure reflects AEM EDS footer block conventions (blocks/footer/)
- Token Usage table maps every element (text color, link color, separator, spacing) to CSS custom properties from styles/tokens.css
- Status is set to "Proposal"

Scope:
- In: Footer content, link treatment, middot separators, spacing, responsive behavior for a single-line footer
- Out: Header (DDD-002), global layout (DDD-001), legal page content, actual CSS/JS implementation

Constraints:
- Must work within AEM Edge Delivery Services block conventions (blocks/footer/ structure)
- Existing footer block at blocks/footer/ will be redesigned, not built from scratch
- Output format must match docs/design-decisions/README.md template exactly

---
Additional context: do not include security and test in the reviewers list. skip context compaction. use frontend, ux strategy and ux design minions for the planning team.
