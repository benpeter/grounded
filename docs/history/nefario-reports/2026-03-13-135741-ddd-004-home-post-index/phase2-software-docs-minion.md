# Domain Plan Contribution: software-docs-minion

## Recommendations

### Question 1: ASCII wireframe style

**Follow the existing DDDs, not the template's literal wording.** The template says "Use box-drawing characters" but the CLAUDE.md is authoritative and explicitly forbids Unicode box-drawing characters (`U+250x` family). All three existing DDDs comply with CLAUDE.md: they use only `+`, `-`, `|`, `.`, `<`, `>`, `(`, `)`, and plain text. Specifically:

- DDD-001 uses `+--+` corners, `|` vertical edges, `<-->` annotations
- DDD-002 uses the same ASCII convention, plus `.....` for border indicators
- DDD-003 mirrors DDD-002's style exactly

DDD-004 must use the same pure ASCII characters. The wireframes should show individual post entries stacked vertically with annotation callouts for tokens and spacing. The `.....` convention (used in DDD-002 and DDD-003 for border-subtle lines) is the established way to indicate faint rule separators between entries.

**Important CLAUDE.md requirement**: Every line in a diagram must be the same character width, and the author must verify this with `awk '{print length, $0}'` or equivalent after generation. The existing DDDs do not appear to follow this strictly (line lengths vary), but the rule exists and DDD-004 should comply or the team should acknowledge the deviation.

### Question 2: Interactions section and Open Questions format

**Interactions section**: The template marks it as "(optional)". DDD-002 and DDD-003 include it because they have interactive elements (links, hover states, focus rings). DDD-001 omits it because global layout has no interactive elements.

DDD-004 **should include an Interactions section** because the post index has several interactive elements:
- Each post title is a link to the post detail page
- Tags are clickable links to the tag index pages
- Hover/focus states need specification for both titles and tags
- Screen reader behavior for the list structure matters (should it be a semantic `<ul>`? `<article>` elements? How does the type badge announce?)

**Open Questions format**: DDD-002 and DDD-003 both use "Open Questions (Resolved)" where questions are struck through with `~~` and followed by a bold "Resolved:" explanation. This is a pattern the team has established for DDDs that went through iteration before submission. DDD-001 uses plain "Open Questions" (unresolved at time of writing, some still open).

For DDD-004, use "Open Questions" if there are genuinely unresolved design questions that need human review. Use the "(Resolved)" suffix and strikethrough format only for questions that were resolved during DDD drafting. Do not manufacture resolved questions for the sake of matching the format.

Likely open questions for DDD-004:
1. Should entries be separated by rule lines (`--color-border-subtle`) or whitespace alone? (site-structure.md says "perhaps the faintest rule line")
2. How does the EDS query index work? Where does the post data come from? (This is an EDS-specific concern — the index sheet at `query-index.json`)
3. Should the type badge use `--font-heading` (Source Code Pro) to signal its metadata nature, or `--font-body` to stay subordinate?
4. Tag click behavior — navigate to `/tags/{tag}` page that doesn't exist yet (DDD-007). What is the tag markup before DDD-007 ships?

### Question 3: CSS Approach — what to document vs. defer

The existing DDDs establish a clear pattern for the CSS Approach section: **document architectural layout choices and key selector strategy, not implementation details**.

For DDD-004, the CSS Approach section should document:

**Document (architectural decisions):**
- Layout method for the overall list: standard block flow? Each entry as a block-level element with vertical stacking?
- Layout method within each entry: flexbox for the metadata line (date + type + tags)? Or pure inline flow?
- Width constraint: does the post index use `--measure` (reading width) or `--layout-max`? This is a real architectural question. The index entries are scannable, not long-form reading. `--measure` at 68ch may be too narrow for entries with long titles + tags. But `--layout-max` at 1200px is too wide for a text list. The DDD needs to make this call.
- Key selectors strategy: how CSS reaches the elements given EDS's wrapper nesting
- Whether the type badge is implemented as a CSS class modifier, a data attribute, or a styled text element

**Defer to implementation:**
- Exact margin/padding pixel values beyond token references
- Specific color values (these go in Token Usage table instead)
- Transition/animation details for hover states
- Badge shape details (border-radius, padding specifics)

### Question 4: Template deviations in existing DDDs

The existing DDDs have established several patterns that deviate from or extend the template:

1. **Status values beyond the template**: The template lists `Proposal | Approved | Approved with changes | Rejected`. DDD-001 and DDD-002 use **`Implemented`** — a status not in the template but clearly useful for tracking. DDD-004 should use `Proposal` since it has not been reviewed yet.

2. **Context section structure**: The template says "What this surface is, what constraints apply" with bullet references. All three DDDs expand this into a structured sub-section format with bold headers: `**Aesthetic rules (CLAUDE.md)**`, `**Site structure (docs/site-structure.md)**`, `**DDD-001 layout contract**`, `**Design tokens (styles/tokens.css)**`, etc. This is more detailed than the template suggests and should be followed.

3. **Boilerplate state**: DDD-002 and DDD-003 both include a `**Boilerplate state**` or `**Current boilerplate state**` subsection in Context that documents what the existing AEM boilerplate code does and whether it needs replacement. DDD-004 should include this — particularly noting whether a boilerplate post-index or listing block exists.

4. **Cross-DDD references and resolution**: DDD-002 and DDD-003 explicitly reference and resolve open questions from earlier DDDs (e.g., DDD-003 resolves DDD-001 Open Question #1 for the footer). DDD-004 should do the same where applicable.

5. **Authored content section in HTML Structure**: DDD-002 and DDD-003 both show two HTML blocks: the CMS-authored source markup AND the final decorated DOM. The template only asks for "the semantic HTML the block/section will produce after decoration." The DDDs go further by showing the input (what the author writes) and the output (what the decorator produces). This is critical for EDS blocks and DDD-004 must follow this pattern. For the post index, the "authored content" is the query index JSON, not a CMS fragment — this is a significant structural difference from header/footer that the DDD must address.

6. **Accessibility findings in Context**: DDD-003 includes an `**Accessibility findings**` subsection documenting contrast issues discovered during design. If any accessibility concerns arise during DDD-004 drafting (e.g., badge color contrast, tag link contrast at small sizes), document them in Context.

7. **Token Usage table includes a Status column**: All three DDDs add a `Status` column (`Existing | Proposed | Hardcoded`) not shown in the template's example table. DDD-004 must include this column.

8. **Decision section**: DDD-001 and DDD-002 have checkboxes filled in with reviewer notes. DDD-003 (still Proposal status) has empty checkboxes and the placeholder `_Human writes here during review_`. DDD-004 should follow DDD-003's pattern since it will also be a Proposal.

## Proposed Tasks

### Task 1: Gather EDS index mechanism context
Before drafting DDD-004, the author must understand how EDS serves post listings. The standard EDS pattern uses a `query-index.json` (or `query-index.xlsx`) sheet that indexes page metadata. This is fundamentally different from header/footer blocks that load CMS fragments. The DDD must document:
- Where the data comes from (query index sheet)
- What fields are available from the index (maps to content model metadata)
- Whether this is an auto-block (built by `buildAutoBlocks` in `scripts.js`) or an authored block
- How pagination is handled (deferred per CLAUDE.md: "No pagination until 20+ posts")

### Task 2: Define the entry anatomy wireframe
Create ASCII wireframes showing a single post entry and 2-3 entries stacked, at both mobile and desktop breakpoints. Each entry must show the spatial relationship between: type badge, title (as link), description, date, and tags. Annotate with token names. Use the `+--+` / `|` / `.....` conventions established by DDD-001 through DDD-003.

### Task 3: Resolve the width constraint question
The post index is neither long-form reading content (`--measure`) nor a full-width layout element (`--layout-max`). The DDD must decide which width model applies. Options:
- Use `--measure` — keeps entries in the reading column, consistent with single-column philosophy
- Use `--layout-max` — gives entries more room for title + metadata
- Use a new intermediate value — adds a token but may be warranted
The recommendation should be `--measure` for consistency with the site's "typography creates hierarchy" principle, but this must be explicitly stated and justified.

### Task 4: Document the type badge design
The type badge (`build-log`, `pattern`, `tool-report`, `til`) is a new visual element not seen in DDDs 001-003. The DDD must specify:
- Typography (font, size, color, weight)
- Whether it uses a background/border or is text-only
- How it maps to content model's `type` enum
- Whether different types get different colors (the aesthetic rules suggest no — "color is a quiet guest")
- Its position relative to the title

### Task 5: Document the tag treatment
Tags are clickable elements linking to `/tags/{tag}` (DDD-007 dependency). The DDD must specify:
- Visual treatment (inline text? pills? subtle background?)
- Typography and spacing between tags
- Link behavior (color, hover, focus states)
- Whether to show all tags or cap at N with overflow indicator

### Task 6: Write the complete DDD-004
Following the template structure plus established patterns from DDDs 001-003:
1. Context with structured subsections (governing constraints, content model requirements, DDD-001 layout contract, boilerplate state)
2. Proposal with Layout (wireframes), Typography, Spacing & Rhythm, Responsive Behavior, Interactions
3. HTML Structure showing both the data source (query index or auto-block input) and final decorated DOM
4. CSS Approach with layout method and key selector strategy
5. Token Usage table with Status column
6. Open Questions for unresolved design decisions
7. Decision section with empty checkboxes and reviewer placeholder

## Risks and Concerns

### Risk 1: EDS data source uncertainty
The header and footer load CMS-authored fragments (`/nav`, `/footer`). The post index works differently — it needs to query an index of all posts. If the EDS `query-index.json` mechanism is not already set up for this project, the DDD must acknowledge this as a prerequisite. The DDD author should check whether `helix-query.yaml` or equivalent exists in the repo, and whether any `query-index` configuration has been authored.

### Risk 2: Content model fields vs. available index fields
The content model (docs/content-model.md) defines fields like `type`, `tags`, `series`, `draft`. But the EDS query index only exposes fields that are explicitly configured. The DDD might specify a design that depends on metadata not yet available in the index. The DDD should note which fields are required and flag the index configuration as a dependency.

### Risk 3: Empty state
With zero posts published, the home page must still render. The DDD should address the empty state — even if it is simply "nothing renders; the page shows header + footer with no content between them." This is a design decision worth documenting.

### Risk 4: Badge and tag visual weight
The site's aesthetic is restrained: "Typography creates hierarchy, not color blocks or boxes." There is a tension between making type badges and tags scannable (they are metadata filters, not reading content) and keeping them visually quiet. The DDD must navigate this tension explicitly. If badges get background colors or borders, that contradicts "no cards with shadows, no gradients, no rounded containers." If they are text-only, they may not scan as distinct metadata. This is the key design decision in DDD-004.

### Risk 5: DDD-007 dependency for tags
Tags link to `/tags/{tag}` pages, which are defined by DDD-007 (Tag Index). DDD-004 must decide whether tags are rendered as links before DDD-007 exists. The pragmatic answer is yes — they are `<a>` elements from day one, linking to pages that will 404 until DDD-007 ships. The DDD should state this explicitly.

### Risk 6: Line-length verification for wireframes
CLAUDE.md requires equal-width lines in ASCII diagrams with post-generation verification. The existing DDDs do not consistently follow this rule (lines vary in width). The DDD-004 author should either (a) verify and fix line widths, or (b) note that the team has implicitly relaxed this rule for DDD wireframes. Inconsistency here will cause lint-like friction.

## Additional Agents Needed

### EDS/AEM specialist (if not already the frontend-minion)
The post index has a fundamentally different data flow from header/footer. It does not load a CMS fragment — it queries the EDS content index. Someone with EDS expertise needs to verify:
- How `query-index.json` is configured for this project
- What metadata columns are available
- Whether the post list is an auto-block or a standard block
- How the index query is performed client-side (fetch + render pattern)

If the frontend-minion already has deep EDS knowledge, this is covered. If not, an EDS-specific reviewer should validate the HTML Structure and data flow sections of the DDD before human review.

### No additional agents needed beyond the current set
The planning question is well-scoped across the existing specialists (UX design, UX strategy, frontend, accessibility, software docs). The EDS data flow concern is the only gap, and it likely falls within the frontend-minion's scope given the AGENTS.md context.
