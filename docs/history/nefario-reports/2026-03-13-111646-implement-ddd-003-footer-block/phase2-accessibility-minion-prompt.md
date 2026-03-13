You are contributing to the PLANNING phase of a multi-agent project.
You are NOT executing yet — you are providing your domain expertise to help build a comprehensive plan.

## Project Task

Implement DDD-003 footer block: Replace blocks/footer/footer.css to match the design specification, and author the /footer fragment content. CSS-only change — footer.js is unchanged.

## Your Planning Question

DDD-003 makes specific WCAG claims: --color-text-muted (#6F6A5E) at 4.89:1, --color-link (#5A7543) at 4.70:1 on --color-background (#F6F4EE), --color-heading (#3F5232) focus ring at 7.75:1, and text-decoration: underline as the load-bearing WCAG 1.4.1 non-color distinguisher. The LinkedIn link uses aria-label="Ben Peter on LinkedIn". What should the execution task verify to confirm these claims hold in the rendered footer, and are there additional WCAG 2.2 AA concerns (landmark, tab order, external link announcement) that the CSS or fragment authoring needs to address?

## Context

### DDD-003 Accessibility findings:
Two token-level contrast failures that previously affected the footer have been resolved site-wide. --color-text-muted (#6F6A5E) now achieves 4.89:1 and --color-link (#5A7543) achieves 4.70:1 on --color-background, both passing WCAG 1.4.3 AA. The footer uses text-decoration: underline on all links by default to satisfy WCAG 1.4.1 (non-color indicator for link distinguishability), which remains load-bearing since the new link and muted text colors have approximately 1:1 luminance contrast against each other.

### DDD-003 Interactions:
- Link default: color: var(--color-link), text-decoration: underline
- Link hover: color: var(--color-link-hover), text-decoration: underline
- Link focus-visible: outline: 2px solid var(--color-heading); outline-offset: 2px
- Keyboard navigation: Tab order follows DOM order: "Ben Peter", "Legal Notice", "Privacy Policy" (three tab stops)
- External link (LinkedIn): target="_blank" rel="noopener"
- Screen reader: <footer> landmark is announced. Links are read as inline text within the paragraph. Literal middot characters ("·") cause a brief natural pause — no aria-hidden or aria-label needed for middot separators.

### DDD-003 HTML Structure (authored /footer fragment):
```html
<div>
  <p>
    &copy;&nbsp;2026&nbsp;<a href="https://www.linkedin.com/in/benpeter/" target="_blank" rel="noopener" aria-label="Ben Peter on LinkedIn">Ben Peter</a> · <a href="/legal">Legal Notice</a> · <a href="/privacy">Privacy Policy</a>
  </p>
</div>
```

### DDD-003 focus ring precedent from DDD-002 header:
```css
.header nav .site-logo:focus-visible {
  outline: 2px solid var(--color-heading);
  outline-offset: 4px;
}
```
Note: DDD-003 specifies outline-offset: 2px for footer links (not 4px like header). The header's 4px offset accounts for the SVG displacement filter on the logo text.

### Design tokens relevant to accessibility:
- --color-background: #F6F4EE (light), #3A3A33 (dark)
- --color-text-muted: #6F6A5E (light), #C9C3B8 (dark)
- --color-link: #5A7543 (light, 4.70:1), #9FB68A (dark, ~5.3:1)
- --color-link-hover: #3F5232 (light), #F6F4EE (dark)
- --color-heading: #3F5232 (light, 7.75:1), #F6F4EE (dark, 10.42:1)

## Instructions
1. Read relevant files to understand the current state
2. Apply your domain expertise to the planning question
3. Identify risks, dependencies, and requirements from your perspective
4. If you believe additional specialists should be involved that aren't already part of the planning, say so and explain why
5. Return your contribution in this format:

## Domain Plan Contribution: accessibility-minion

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

6. Write your complete contribution to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-HJIIfF/implement-ddd-003-footer-block/phase2-accessibility-minion.md
