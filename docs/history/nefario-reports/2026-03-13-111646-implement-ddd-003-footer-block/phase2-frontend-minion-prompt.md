You are contributing to the PLANNING phase of a multi-agent project.
You are NOT executing yet — you are providing your domain expertise to help build a comprehensive plan.

## Project Task

Implement DDD-003 footer block: Replace blocks/footer/footer.css to match the design specification, and author the /footer fragment content. CSS-only change — footer.js is unchanged.

## Your Planning Question

DDD-003 specifies a footer with no flexbox/grid, responsive padding via three breakpoints (< 600px / >= 600px / >= 900px), text-align: center below 600px and left above, and a top border on the inner content wrapper (not <footer>). The current footer.css is 20 lines of boilerplate with two known defects (--color-background-soft and hardcoded 1200px). What is the minimal, correct CSS structure to fully implement the spec — covering all six selectors listed in DDD-003 — and what pitfalls should the implementation task prompt call out explicitly? Also, confirm the tablet breakpoint (>= 600px) is not already in the boilerplate file and would need to be added.

## Context

### Current blocks/footer/footer.css (20 lines):
```css
footer {
  background-color: var(--color-background-soft);
  font-size: var(--body-font-size-xs);
}

footer .footer > div {
  margin: auto;
  max-width: 1200px;
  padding: 40px 24px 24px;
}

footer .footer p {
  margin: 0;
}

@media (width >= 900px) {
  footer .footer > div {
    padding: 40px 32px 24px;
  }
}
```

### DDD-002 header precedent (blocks/header/header.css):
```css
.header .nav-wrapper {
  max-width: var(--layout-max);
  margin-inline: auto;
  padding-inline: var(--content-padding-mobile);
  padding-block: clamp(16px, 3vw, 24px);
  border-bottom: 1px solid var(--color-border-subtle);
}
/* ... */
.header nav .site-logo:focus-visible {
  outline: 2px solid var(--color-heading);
  outline-offset: 4px;
}
/* responsive */
@media (width >= 600px) {
  .header .nav-wrapper {
    padding-inline: var(--content-padding-tablet);
  }
}
@media (width >= 900px) {
  .header .nav-wrapper {
    padding-inline: var(--content-padding-desktop);
  }
}
```

### DDD-003 CSS Approach (Key selectors from spec):
1. `footer` — background-color: var(--color-background)
2. `footer .footer > div` — max-width: var(--layout-max), margin-inline: auto, responsive padding-inline, padding-block, border-top: 1px solid var(--color-border-subtle)
3. `footer .footer p` — margin: 0, font-size: var(--body-font-size-xs), color: var(--color-text-muted), responsive text-align, text-wrap: balance
4. `footer .footer a:any-link` — color: var(--color-link), text-decoration: underline
5. `footer .footer a:hover` — color: var(--color-link-hover), text-decoration: underline
6. `footer .footer a:focus-visible` — outline: 2px solid var(--color-heading), outline-offset: 2px

### Design tokens (styles/tokens.css):
- --color-background: #F6F4EE
- --color-background-soft: #EFE9DD
- --color-text-muted: #6F6A5E (4.89:1 on --color-background)
- --color-link: #5A7543 (4.70:1 on --color-background)
- --color-link-hover: #3F5232
- --color-heading: #3F5232 (7.75:1 on --color-background)
- --color-border-subtle: #EFE9DD
- --layout-max: 1200px
- --section-spacing: 48px
- --content-padding-mobile: 20px
- --content-padding-tablet: 24px
- --content-padding-desktop: 32px
- --body-font-size-xs: 15px (mobile), 14px (>= 900px)

### Responsive behavior from DDD-003:
- < 600px: text-align center, --content-padding-mobile
- >= 600px: text-align left, --content-padding-tablet
- >= 900px: text-align left, --content-padding-desktop

### DDD-003 specifies focus ring outline-offset: 2px (not 4px like header)

## Instructions
1. Read relevant files to understand the current state
2. Apply your domain expertise to the planning question
3. Identify risks, dependencies, and requirements from your perspective
4. If you believe additional specialists should be involved that aren't already part of the planning, say so and explain why
5. Return your contribution in this format:

## Domain Plan Contribution: frontend-minion

### Recommendations
<your expert recommendations for this aspect of the task>

### Proposed Tasks
<specific tasks that should be in the execution plan>
For each task: what to do, deliverables, dependencies

### Risks and Concerns
<things that could go wrong from your domain perspective>

### Additional Agents Needed
<any specialists not yet involved who should be, and why>
(or "None" if the current team is sufficient)

6. Write your complete contribution to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-HJIIfF/implement-ddd-003-footer-block/phase2-frontend-minion.md
