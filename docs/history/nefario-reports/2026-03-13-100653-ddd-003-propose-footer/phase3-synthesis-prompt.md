MODE: SYNTHESIS

You are synthesizing specialist planning contributions into a
final execution plan.

## Original Task

A Design Decision Document (DDD-003-footer.md) exists at docs/design-decisions/ that defines the footer as a single understated line — copyright, LinkedIn link, Legal Notice, Privacy Policy separated by middots — so that the existing footer block at blocks/footer/ can be redesigned to match the brand's minimal aesthetic.

Success criteria:
- DDD-003-footer.md exists at docs/design-decisions/ with all required sections per the DDD format
- Footer content is exactly: © 2026 Ben Peter · LinkedIn · Legal Notice · Privacy Policy
- No multi-column layout, no newsletter signup, no social icon grid
- ASCII wireframe shows the single-line treatment at mobile and desktop
- HTML Structure reflects AEM EDS footer block conventions (blocks/footer/)
- Token Usage table maps every element (text color, link color, separator, spacing) to CSS custom properties from styles/tokens.css
- Status is set to "Proposal"

Source issue: #4

## Specialist Contributions

Read the following scratch files for full specialist contributions:
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-4bW4Uj/ddd-003-propose-footer/phase2-frontend-minion.md
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-4bW4Uj/ddd-003-propose-footer/phase2-ux-strategy-minion.md
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-4bW4Uj/ddd-003-propose-footer/phase2-ux-design-minion.md

## Key consensus across specialists:

### frontend-minion
- Single `<p>` with inline links and middot text nodes (avoids EDS `decorateButtons()` pill conversion)
- Current `decorate()` function can remain unchanged — CSS alone reshapes output
- CSS selectors: `footer .footer > div` for layout, `footer .footer p` for paragraph, `footer .footer a:any-link` for links
- RISK: --color-text-muted on --color-background-soft fails WCAG AA at 3.6:1

### ux-strategy-minion
- Remove "LinkedIn" as separate text — "Ben Peter" IS the LinkedIn link with aria-label
- Footer carries zero wayfinding burden — purely legal/attribution
- Legal links at equal visual weight with all other items
- All items share same typographic treatment; only distinction is link color vs muted text
- CONFLICT: Proposes removing "LinkedIn" text — deviates from site-structure.md spec

### ux-design-minion
- Background: --color-background (warm white), NOT --color-background-soft
- Middot separators: literal characters in markup, not CSS pseudo-elements
- Mobile: natural text wrap with text-align: center below 600px, left-align above
- Link states: match body links exactly (--color-link to --color-link-hover), --color-heading focus ring
- Top border: 1px solid var(--color-border-subtle) mirroring header bottom border

## Key Conflict to Resolve

ux-strategy-minion proposes changing the footer content from:
  "© 2026 Ben Peter · LinkedIn · Legal Notice · Privacy Policy"
to:
  "© 2026 Ben Peter · Legal Notice · Privacy Policy"
(where "Ben Peter" links to LinkedIn)

This DEVIATES from the explicit site-structure.md spec and the GitHub issue success criteria which say the footer content is EXACTLY "© 2026 Ben Peter · LinkedIn · Legal Notice · Privacy Policy". The DDD should PRESERVE the specified content. The ux-strategy argument has merit but should be documented as an Open Question, not enacted unilaterally in the DDD. The user/reviewer decides during DDD review.

## External Skills Context
No external skills detected.

## Instructions
1. Review all specialist contributions
2. Resolve the conflict: preserve the site-structure.md footer content as specified; document the ux-strategy simplification argument as an Open Question in the DDD
3. Incorporate the consensus: --color-background (not soft), literal middots, natural wrap, top border, match body link states, single <p> fragment, unchanged decorate()
4. Incorporate the WCAG contrast risk: if using --color-background, --color-text-muted achieves 4.34:1 (passes AA for large text but borderline for 14px small text). Flag as Open Question.
5. Create the final execution plan in structured format:
   - Single task: Write DDD-003-footer.md
   - Agent: software-docs-minion (DDD authoring — the DDD IS documentation)
   - One approval gate: the completed DDD
   - Model: sonnet for execution
   - Mode: bypassPermissions
6. Ensure the task prompt is complete and self-contained — the executing agent should be able to write the DDD without consulting other agents
7. The task prompt must include:
   - The DDD template format (from docs/design-decisions/README.md)
   - All resolved design decisions from the three specialists
   - All token references
   - The EDS HTML structure
   - ASCII wireframe specifications
   - Open Questions (the LinkedIn link simplification, the contrast concern)
8. Write your complete delegation plan to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-4bW4Uj/ddd-003-propose-footer/phase3-synthesis.md
