# Meta-Plan: DDD-003 Footer Design Decision

## Planning Consultations

### Consultation 1: EDS Footer Block Conventions and Fragment Structure

- **Agent**: frontend-minion
- **Planning question**: Given the current footer block implementation (`blocks/footer/footer.js` loads a `/footer` fragment, clears `block.textContent`, and appends fragment children into a wrapping `<div>`), what is the correct semantic HTML structure for a single-line footer in EDS? Specifically: (a) What does the authored `/footer` fragment markup look like for a line of `(c) 2026 Ben Peter . LinkedIn . Legal Notice . Privacy Policy` — is this a single `<p>` with inline links, or multiple `<p>` elements? (b) Does the current `decorate()` function need changes, or can the CSS alone reshape the fragment output into the target single-line treatment? (c) How should the `footer > .footer > div` selector chain work with the fragment's DOM to target individual elements (copyright text, links, separators)? Reference `blocks/footer/footer.js`, the boilerplate fragment loading pattern, and DDD-001's width model (`--layout-max`, `--content-padding-*` tokens).
- **Context to provide**: `blocks/footer/footer.js` (current implementation), `blocks/footer/footer.css` (current styles showing `background-color: var(--color-background-soft)` and hardcoded `max-width: 1200px`), DDD-001 width model and padding tokens, DDD-002 as precedent for how a DDD specifies HTML Structure and CSS Approach for an EDS block.
- **Why this agent**: frontend-minion understands EDS block conventions, fragment loading, DOM decoration patterns, and how authored content maps to decorated HTML. The footer's HTML Structure section must be implementable within these conventions.

### Consultation 2: Footer Information Hierarchy and Cognitive Load

- **Agent**: ux-strategy-minion
- **Planning question**: The footer contains four distinct pieces: copyright attribution, a social link (LinkedIn), and two legal compliance links (Legal Notice, Privacy Policy). From a user journey perspective: (a) Is the middot-separated single-line treatment the right information hierarchy — or should copyright be visually distinct from the links (e.g., copyright on left, links on right)? (b) The site has zero navigation in the header (by design). Does the footer need to carry any wayfinding burden, or is it purely legal/attribution? (c) Should "Ben Peter" be a link (to LinkedIn or an about page), or should only "LinkedIn" link out? The site-structure.md says both are separate text links — validate whether this creates confusion (two links that go to the same destination?). (d) German law requires Impressum/Privacy links — should these be visually subordinated to the brand content, or treated as equal-weight items in the line?
- **Context to provide**: `docs/site-structure.md` (footer spec: `(c) 2026 Ben Peter . LinkedIn . Legal Notice . Privacy Policy`, "Ben Peter" and "LinkedIn" are separate text links), CLAUDE.md aesthetic rules (no icons, typography creates hierarchy), the site's zero-navigation header design, DDD-002 interactions section as precedent.
- **Why this agent**: ux-strategy-minion evaluates whether the proposed content model serves real user needs. The footer's content and link targets need strategic validation before visual design begins — especially the question of whether "Ben Peter" and "LinkedIn" should both be links and where they point.

### Consultation 3: Visual Specification and Responsive Treatment

- **Agent**: ux-design-minion
- **Planning question**: For a single-line footer with `(c) 2026 Ben Peter . LinkedIn . Legal Notice . Privacy Policy`: (a) What is the right typographic treatment? The current CSS uses `--body-font-size-xs` and `--color-background-soft` as background — should the footer background match the page background (`--color-background`) instead, consistent with the "warm white paper" aesthetic where color is a quiet guest? (b) How should the middot separators be implemented — literal `·` characters in the markup, or CSS `::before`/`::after` pseudo-elements? What is the right color and spacing for the separators? (c) At mobile widths (< 600px), a single line of `(c) 2026 Ben Peter . LinkedIn . Legal Notice . Privacy Policy` may not fit. What is the graceful wrap behavior — wrap at natural break points within the line, or restructure into a stacked layout? (d) What are the link hover/focus states for footer links — should they match body link behavior (`--color-link` to `--color-link-hover`) or have a subtler treatment given the footer's understated role? (e) How should vertical spacing above the footer work — does the footer get a top border like the header's bottom border (`1px solid var(--color-border-subtle)`), or is the section spacing from DDD-001 sufficient?
- **Context to provide**: `styles/tokens.css` (full token set), `blocks/footer/footer.css` (current styles), DDD-001 layout contract (padding tokens, section spacing), DDD-002 as precedent (interaction states, border treatment, token usage table format), CLAUDE.md aesthetic rules.
- **Why this agent**: ux-design-minion specifies the visual details — typography, spacing, color, interaction states, responsive behavior — that become the Token Usage table and CSS Approach sections of the DDD. These must be precise enough for an implementation agent to build from.

## Cross-Cutting Checklist

- **Testing**: Excluded per user request. (The task produces a design document, not executable code.)
- **Security**: Excluded per user request. (The task produces a design document with no attack surface.)
- **Usability -- Strategy**: INCLUDED -- Consultation 2 above. Planning question covers information hierarchy, link targets, wayfinding burden, and legal compliance link treatment.
- **Usability -- Design**: INCLUDED -- Consultation 3 above (ux-design-minion). accessibility-minion is not needed at the planning stage — the DDD will specify semantic HTML and interaction states, and accessibility review will occur during Phase 3.5 architecture review if the plan proceeds to execution.
- **Documentation**: Not included for planning. The DDD itself IS the documentation artifact. software-docs-minion would review the DDD format compliance during execution, not planning. If the DDD is approved and implementation follows, Phase 8 handles downstream documentation.
- **Observability**: Excluded. The footer is a static HTML/CSS surface with no runtime components, no logging, no metrics.

## Anticipated Approval Gates

1. **DDD-003-footer.md content** (MUST gate): The completed DDD is the sole deliverable. It is hard to reverse (defines the implementation contract for the footer block) and has downstream dependents (the footer implementation task will read this DDD as its spec). The user must review and set the Decision status before any implementation proceeds. Gate classification: hard to reverse + high blast radius = MUST.

No other gates anticipated. This is a single-deliverable task.

## Rationale

Three specialists were selected per user request, each covering a distinct dimension of the footer DDD:

- **frontend-minion**: The DDD must specify HTML Structure and CSS Approach that work within EDS block conventions. The current footer block loads a fragment and has minimal decoration — frontend-minion determines whether the `decorate()` function needs changes or if CSS alone suffices, and what the authored fragment markup should look like.
- **ux-strategy-minion**: Before visual design, the footer's content model needs validation. The site-structure.md specifies "Ben Peter" and "LinkedIn" as separate text links, but this raises questions about link targets and redundancy. Strategy review also validates whether the single-line treatment is the right hierarchy for mixed brand/legal content.
- **ux-design-minion**: The DDD requires precise visual specification — typography, token mapping, spacing, responsive wrap behavior, interaction states, border treatment. This agent produces the detail that becomes the Token Usage table, Spacing & Rhythm section, and Responsive Behavior section.

These three agents cover the full scope of the DDD template sections. The DDD-002 header serves as a strong precedent for format, depth, and style — all three agents should reference it.

## Scope

**In scope**: Authoring DDD-003-footer.md with all required sections per the DDD template: Context, Proposal (Layout, Typography, Spacing & Rhythm, Responsive Behavior, Interactions), HTML Structure, CSS Approach, Token Usage, Open Questions, Decision (set to Proposal).

**Content**: Footer line is exactly `(c) 2026 Ben Peter . LinkedIn . Legal Notice . Privacy Policy` — no multi-column layout, no newsletter signup, no social icon grid, no bio, no headshot.

**Out of scope**: Header (DDD-002), global layout (DDD-001), legal page content, actual CSS/JS implementation of the footer block, dark mode specifics beyond token references.

## External Skill Integration

No external skills detected in project. Scanned `.claude/skills/` and `.skills/` in the working directory — neither directory exists. Global skills (`juli`, `obsidian-tasks`, `transcribe`) are not relevant to design decision document authoring.
