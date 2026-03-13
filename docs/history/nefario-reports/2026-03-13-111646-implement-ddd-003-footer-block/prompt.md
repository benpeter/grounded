Implement DDD-003 footer block

Outcome: The footer block renders as a single middot-separated line of copyright, author link, and legal links, matching the design specification in DDD-003-footer.md so that every page closes with a quiet, WCAG AA-compliant attribution line that mirrors the header's visual treatment.

Success criteria:
- Footer displays: © 2026 Ben Peter · Legal Notice · Privacy Policy
- "Ben Peter" links to LinkedIn with target="_blank" rel="noopener" and aria-label
- blocks/footer/footer.css uses var(--color-background) instead of var(--color-background-soft)
- max-width uses var(--layout-max) instead of hardcoded 1200px
- Typography uses --body-font-size-xs, --color-text-muted for text, --color-link for links
- Links underlined by default (text-decoration: underline) with --color-link-hover on hover
- focus-visible ring matches DDD-002 header (2px solid --color-heading, offset 2px)
- Top border: 1px solid var(--color-border-subtle) on inner content wrapper
- Responsive: text-align center below 600px, left at 600px+
- Padding uses --content-padding-mobile / --content-padding-tablet / --content-padding-desktop
- Vertical padding: --section-spacing top, 24px bottom
- footer.js unchanged — no JS modifications
- Lighthouse accessibility score remains 100
- Lint passes (npm run lint)

Scope:
- In: blocks/footer/footer.css, /footer fragment content authoring
- Out: footer.js changes, token value changes (already resolved), DDD-003 document updates, header block, other blocks

Constraints:
- All design values must reference DDD-003-footer.md as the specification — no improvisation beyond the DDD
- Single `<p>` element with inline links to avoid EDS decorateButtons() promotion
- No new CSS tokens — all values exist in styles/tokens.css

---
Additional context: use sonnet throughout
