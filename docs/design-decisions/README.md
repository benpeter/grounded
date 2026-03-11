# Design Decision Documents (DDDs)

## Purpose

DDDs are the contract between human design intent and agent implementation. Each document describes one **design surface** — a visually distinct area of the site that can be built and reviewed independently.

The workflow:
1. An agent proposes a DDD (fills in Context, Proposal, HTML Structure)
2. The human reviews, annotates, and sets a Decision status
3. Implementation agents read approved DDDs as their spec

## Format

Every DDD follows this structure. All sections are required unless marked optional.

```markdown
# DDD-{NNN}: {Surface Name}

Status: **Proposal** | **Approved** | **Approved with changes** | **Rejected**

## Context

What this surface is, what constraints apply. Reference:
- Brand Identity rules (from Obsidian vault or CLAUDE.md)
- Content model requirements (from docs/content-model.md)
- Site structure requirements (from docs/site-structure.md)
- Design tokens (from styles/tokens.css)

Be specific about which tokens and rules govern this surface.

## Proposal

### Layout

ASCII wireframe showing spatial arrangement. Use box-drawing characters.
Annotate with token names where relevant.

### Typography

Which font, size token, color token, and weight for each text element.
Reference tokens by CSS custom property name.

### Spacing & Rhythm

Key spacing decisions. Reference token names or explicit values with rationale.

### Responsive Behavior

How the surface changes across breakpoints (mobile-first → 600px → 900px → 1200px).

### Interactions (optional)

Hover, focus, active states. Keyboard behavior. Screen reader announcements.

## HTML Structure

The semantic HTML the block/section will produce after decoration.
This is what the CSS will target.

```html
<!-- Annotated HTML showing the final DOM structure -->
```

## CSS Approach

Key selectors, layout method (grid/flexbox), and any non-obvious styling decisions.
NOT full CSS — just the architectural choices.

## Token Usage

Table mapping each visual element to its token:

| Element          | Property   | Token                    |
|------------------|------------|--------------------------|
| Heading          | color      | --color-heading          |
| ...              | ...        | ...                      |

## Open Questions (optional)

Anything the proposer is uncertain about. Numbered for easy reference in review.

## Decision

- [ ] Approved
- [ ] Approved with changes
- [ ] Rejected

### Reviewer Notes

_{Human writes here during review}_
```

## Naming Convention

Files: `DDD-{NNN}-{slug}.md`
- `DDD-001-global-layout.md`
- `DDD-002-header.md`
- `DDD-003-footer.md`
- etc.

## Surface Inventory

The following surfaces need DDDs before implementation:

| #   | Surface              | Dependencies | Description                                    |
|-----|----------------------|--------------|------------------------------------------------|
| 001 | Global Layout        | —            | Page chrome, max-width, margins, breakpoints   |
| 002 | Header               | 001          | Logo + tagline treatment                       |
| 003 | Footer               | 001          | Copyright, links layout                        |
| 004 | Home Page: Post Index| 001          | Post list, type badges, tags, dates            |
| 005 | Post Detail          | 001          | Article layout, metadata, heading hierarchy    |
| 006 | Typography & Code    | 005          | Code blocks, inline code, pull-quotes, lists   |
| 007 | Tag Index            | 004          | Filtered post list                             |
| 008 | Dark Mode            | all          | prefers-color-scheme overrides                 |

## Implementation Reference

When implementing from an approved DDD, agents should:

1. Read the DDD fully, including Reviewer Notes
2. Use the HTML Structure as the target DOM
3. Use the Token Usage table — never hardcode values
4. Follow the CSS Approach for layout method
5. Respect the Responsive Behavior section for breakpoints
6. Run `npm run lint` before committing
7. Test at `http://localhost:3000` with the dev server
