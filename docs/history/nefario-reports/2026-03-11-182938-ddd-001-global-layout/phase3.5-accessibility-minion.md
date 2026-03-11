ADVISE

- [accessibility]: The DDD should note that focus indicator styles (color token, minimum area) must be validated against WCAG 2.4.13 Focus Appearance (AA) during implementation, since CLAUDE.md designates `--color-accent` (gold) as the focus ring color and its contrast against `--color-background` (#F6F4EE) and `--color-background-soft` (#EFE9DD) has not been verified in this document.
  SCOPE: CSS Approach section of DDD-001-global-layout.md
  CHANGE: Add a note in the CSS Approach or Open Questions section that the focus indicator must meet WCAG 2.4.13: minimum 2px outline, area not less than perimeter of unfocused component × 2px, and the focus color must achieve at least 3:1 contrast ratio against adjacent colors. Flag this as an implementation-phase verification requirement.
  WHY: `--color-accent` (#D9B84A gold) against `--color-background` (#F6F4EE warm white) yields approximately 2.7:1 contrast — below the 3:1 threshold required by WCAG 2.4.13 (AA). The DDD should not silently adopt this pairing for focus rings without flagging the compliance risk. This does not block the layout architecture decisions, but if unaddressed will cause a WCAG 2.2 AA violation in every implemented surface.
  TASK: Task 1

All other accessibility concerns are adequately addressed:
- WCAG 1.4.12 (Text Spacing): `ch`-based max-width expands under user spacing overrides; no fixed heights proposed; `em`-based spacing is correct.
- Container overflow: explicit hard requirement against `overflow: hidden` on `.default-content-wrapper`.
- Responsive behavior: three-tier padding progression is sound; the 38 chars/line mobile concern is correctly flagged as Open Question #3 and deferred to typography DDDs.
- Semantic structure: `<header>`, `<main>`, `<footer>` landmarks are present in the skeleton; heading hierarchy is noted as a constraint.
