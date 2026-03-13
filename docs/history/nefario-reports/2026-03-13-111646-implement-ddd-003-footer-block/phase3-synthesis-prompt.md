MODE: SYNTHESIS

You are synthesizing specialist planning contributions into a final execution plan.

## Original Task

Implement DDD-003 footer block (#17): Replace blocks/footer/footer.css to match the design specification, and author the /footer fragment content. CSS-only change — footer.js is unchanged. Use sonnet throughout for execution.

## Specialist Contributions

Read the following scratch files for full specialist contributions:
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-HJIIfF/implement-ddd-003-footer-block/phase2-frontend-minion.md
- /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-HJIIfF/implement-ddd-003-footer-block/phase2-accessibility-minion.md

## Key consensus across specialists:

### frontend-minion
Phase: planning
Recommendation: Minimal 38-line CSS with mobile-first base rules for 6 selectors, two breakpoints (600px, 900px). Tablet breakpoint confirmed absent from boilerplate and must be added.
Tasks: 1 -- Replace footer.css with complete spec implementation; author /footer fragment content
Risks: 10 pitfalls: background-soft to background, hardcoded 1200px to layout-max, text-align at 600px not 900px, margin to margin-inline, outline-offset 2px not 4px, font-size on both footer and p, text-wrap: balance, no flexbox/grid, border-top on inner div not footer, padding 40px to section-spacing 48px
Conflicts: none

### accessibility-minion
Phase: planning
Recommendation: Verify background-color fix (all contrast ratios depend on it), confirm text-decoration: underline survives specificity fight with global reset in styles.css, keyboard-test focus ring, verify aria-label survives EDS decoration.
Tasks: 1 -- Post-implementation verification of WCAG claims (contrast, underline, focus ring, aria-label, landmark structure)
Risks: WCAG 1.4.1 failure if underline rule loses specificity; WCAG 2.5.8 target size edge case at 14px desktop; decorateButtons() promotion if fragment uses separate p per link
Conflicts: none

## External Skills Context
No external skills detected.

## Additional Context
- The user specified "use sonnet throughout" — all execution agents should use model: sonnet
- This is a tightly-scoped CSS task with a complete DDD spec. One execution task is sufficient.
- The /footer fragment content needs to be authored as a static HTML file since we don't have CMS access
- The footer.js file must NOT be modified

## Instructions
1. Review all specialist contributions
2. Resolve any conflicts between recommendations
3. Incorporate risks and concerns into the plan
4. Create the final execution plan in structured format
5. Ensure every task has a complete, self-contained prompt
6. This is a single-task execution — one frontend-minion agent replaces footer.css and creates the fragment HTML
7. No approval gates needed for this straightforward CSS implementation
8. Write your complete delegation plan to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-HJIIfF/implement-ddd-003-footer-block/phase3-synthesis.md
