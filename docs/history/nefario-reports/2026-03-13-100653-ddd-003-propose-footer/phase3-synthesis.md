## Delegation Plan

**Team name**: ddd-003-propose-footer
**Description**: Author the DDD-003-footer.md design decision document that specifies the footer block's single-line typographic treatment, enabling future implementation.

### Task 1: Write DDD-003-footer.md

- **Agent**: software-docs-minion
- **Delegation type**: standard
- **Model**: sonnet
- **Mode**: bypassPermissions
- **Blocked by**: none
- **Approval gate**: yes
- **Gate reason**: The DDD is the contract between design intent and implementation. It is hard to reverse (all footer implementation will be built to this spec) and has high blast radius (footer CSS, footer JS, CMS authoring, and accessibility testing all depend on it). Content and design direction require human sign-off before any code is written.
- **Prompt**: |

    # Task: Write DDD-003-footer.md

    You are writing a Design Decision Document for the footer of the Mostly Hallucinations blog (benpeter.dev). This is a proposal — the human reviewer will approve, request changes, or reject it. Your job is to document the design decisions clearly and completely so the reviewer can make an informed decision, and so an implementing agent can later build from this spec without ambiguity.

    ## Output

    Write a single file: `docs/design-decisions/DDD-003-footer.md`

    ## Quality Precedent

    Match the depth, structure, and rigor of `docs/design-decisions/DDD-002-header.md`. That document is the quality bar. Read it before writing. Key qualities to match:
    - Thorough Context section that cites governing constraints with specific token names and file paths
    - Proposal sections with clear rationale for every decision
    - ASCII wireframes with token annotations
    - Complete HTML Structure showing the full decorated DOM
    - CSS Approach that explains key selectors and the "why" behind layout choices
    - Token Usage table with Status column (Existing / Proposed / Hardcoded)
    - Open Questions that are genuinely unresolved, not rhetorical

    ## DDD Template

    Follow this structure exactly (all sections required unless marked optional):

    ```
    # DDD-003: Footer

    Status: **Proposal**

    ## Context
    ## Proposal
    ### Layout
    ### Typography
    ### Spacing & Rhythm
    ### Responsive Behavior
    ### Interactions (optional)
    ## HTML Structure
    ## CSS Approach
    ## Token Usage
    ## Open Questions (optional)
    ## Decision
    ```

    ## Design Decisions to Document

    The following decisions have been resolved through specialist consultation. Document each with its rationale.

    ### Context Section

    Reference these governing constraints:

    1. **Site structure (docs/site-structure.md)**: Footer content is exactly:
       `© 2026 Ben Peter · LinkedIn · Legal Notice · Privacy Policy`
       - Per site-structure.md: "Ben Peter" and "LinkedIn" are described as "separate text links"
       - LinkedIn sits next to the author's name as the single social link
       - No icons. No bio. No headshot. No "about the author" section.
       - Legal Notice and Privacy Policy are required (German law: DDG §5, DSGVO)

    2. **CLAUDE.md aesthetic rules**:
       - `--color-background` (#F6F4EE light) is the dominant visual — warm white paper
       - No cards with shadows, no gradients, no rounded containers
       - Typography creates hierarchy, not color blocks or boxes
       - Borders and rules almost melt into the background

    3. **DDD-001 layout contract**: Two-tier width model (`--layout-max` / `--measure`). The footer uses `--layout-max` as its outer constraint with the same `--content-padding-*` tokens. This answers DDD-001 Open Question #1 for the footer: the footer constrains to `--layout-max`, not `--measure`.

    4. **DDD-002 header precedent**: The header uses `background-color: var(--color-background)`, `border-bottom: 1px solid var(--color-border-subtle)`, same padding tokens. The footer mirrors these choices to create symmetric "bookends" framing the content.

    5. **Design tokens**: All tokens referenced exist in `styles/tokens.css`. No new tokens proposed.

    6. **V1 Scope exclusions (CLAUDE.md)**: No newsletter signup, no RSS, no social icon grid, no secondary navigation.

    7. **Current boilerplate state**: `blocks/footer/footer.js` is the boilerplate default (20 lines: load fragment, clear block, append). `blocks/footer/footer.css` uses `background-color: var(--color-background-soft)` and hardcoded `max-width: 1200px`. Both need updating but the JS structure can remain largely unchanged.

    8. **Accessibility findings from architecture review**: Two token-level WCAG failures affect the footer but are site-wide issues, not footer-specific:
       - `--color-text-muted` (#817B6F) on `--color-background` (#F6F4EE): ~3.82:1 — fails WCAG 1.4.3 AA (requires 4.5:1 for normal text)
       - `--color-link` (#7F9A63) on `--color-background` (#F6F4EE): ~2.85:1 — fails WCAG 1.4.3 AA (requires 4.5:1 for normal text)
       - `--color-link` vs adjacent `--color-text-muted` text: ~1.34:1 — fails WCAG 1.4.1 Level A (requires 3:1 for color-only link distinguishability)

       These are documented in Open Questions 2 and 3 but are out of scope for this DDD to resolve. The footer DDD specifies `text-decoration: underline` on links by default to resolve the 1.4.1 distinguishability requirement through a non-color indicator.

    ### Proposal: Layout

    - Single understated line of text, centered within the `--layout-max` container
    - Left edge of the footer content area aligns with header and main content via the same `--content-padding-*` tokens
    - The footer is a purely legal/attribution surface — it carries zero wayfinding burden
    - All items (copyright, links) share equal visual weight — no item is subordinated to another. This satisfies German legal requirements (DDG §5, DSGVO) that legal links be "easily accessible" and not visually hidden or de-emphasized.

    #### ASCII Wireframes

    Provide wireframes for mobile (< 600px) and desktop (>= 900px). Follow the same annotation style as DDD-001 and DDD-002. Use ONLY pure ASCII characters (`+`, `-`, `|`, `/`, `\`, `<`, `>`, `^`, `v`) — never Unicode box-drawing characters.

    **Mobile (< 600px)**: Show the footer text wrapping to two lines with `text-align: center`. Available width at 375px viewport with 20px padding = 335px. The full line is ~45-50 characters at 15px Source Sans 3, so it wraps. Show the top border (`1px --color-border-subtle`) and padding zones.

    **Desktop (>= 900px)**: Show the footer text fitting on a single line with `text-align: left`. Show `max-width: --layout-max`, `margin-inline: auto`, top border, and padding annotations.

    ### Proposal: Typography

    | Element | Font | Size | Color | Weight |
    |---------|------|------|-------|--------|
    | Copyright text ("(c) 2026") | `--font-body` (inherited) | `--body-font-size-xs` | `--color-text-muted` | 400 (inherited) |
    | Author name ("Ben Peter") | `--font-body` (inherited) | `--body-font-size-xs` | See Open Question 1 | 400 (inherited) |
    | Middot separators | `--font-body` (inherited) | `--body-font-size-xs` | `--color-text-muted` (inherited from `<p>`) | 400 (inherited) |
    | Link text ("LinkedIn", "Legal Notice", "Privacy Policy") | `--font-body` (inherited) | `--body-font-size-xs` | `--color-link` | 400 (inherited) |

    Note on "Ben Peter": Site-structure.md describes "Ben Peter" and "LinkedIn" as "separate text links." This means "Ben Peter" is a link in the current spec. However, Open Question 1 discusses whether to simplify by merging the LinkedIn destination into "Ben Peter" and removing the separate "LinkedIn" item. The color of "Ben Peter" depends on the resolution of Open Question 1:
    - If the current spec is kept (both "Ben Peter" and "LinkedIn" as separate links): "Ben Peter" uses `--color-link` and links to an appropriate destination (e.g., an about page, or LinkedIn)
    - If the simplified alternative is adopted: "Ben Peter" links to LinkedIn with `aria-label="Ben Peter on LinkedIn"`, uses `--color-link`

    In either case, all links use `--color-link` (sage green) with `text-decoration: underline` as the default state. This is the standard site link color, not a special footer treatment.

    Rationale for using `--color-link` on footer links (not `--color-text-muted`): The site has very few interactive elements. Using a different (more muted) link treatment in the footer risks making links unrecognizable as links. The standard `--color-link` is already "the understated version" — no need to make it quieter. Consistency across the site reduces cognitive load.

    ### Proposal: Spacing & Rhythm

    | Spacing | Value | Rationale |
    |---------|-------|-----------|
    | Top border | `1px solid var(--color-border-subtle)` | Mirrors header bottom border. Creates symmetric bookends. Applied to the inner content wrapper (not `<footer>`) so the border aligns with content, not viewport edges. |
    | Padding above content (below border) | `padding-block-start: var(--section-spacing)` (48px) | Matches section rhythm. Provides generous separation from the last content section. |
    | Padding below content (page bottom) | `padding-block-end: 24px` | Less below — the page ends, no visual continuation needed. Asymmetric padding matches the footer's role as a closer. |
    | Inline padding (mobile) | `var(--content-padding-mobile)` (20px) | Same as header and main content. |
    | Inline padding (tablet, >= 600px) | `var(--content-padding-tablet)` (24px) | Same as header and main content. |
    | Inline padding (desktop, >= 900px) | `var(--content-padding-desktop)` (32px) | Same as header and main content. |

    ### Proposal: Responsive Behavior

    | Breakpoint | text-align | Wrapping | Padding | Notes |
    |------------|-----------|----------|---------|-------|
    | < 600px | `center` | Natural text wrap. `text-wrap: balance` (progressive enhancement, gracefully ignored in older browsers). | `--content-padding-mobile` | At 375px with 20px padding, 335px available. Line wraps to ~2 lines. Center alignment creates visual balance for short wrapped fragments. |
    | >= 600px | `left` | Single line fits (~420-450px content in 552px available) | `--content-padding-tablet` | Transition to left-align matches header and body text alignment. |
    | >= 900px | `left` | Single line, comfortable | `--content-padding-desktop` | Same as >= 600px behavior. |

    The shift from centered (mobile) to left-aligned (tablet+) mirrors what the eye expects: centered short wrapped text, left-aligned single lines. This is the same responsive pattern used by many minimal footers.

    Non-breaking space between `(c)` and `2026` and between `2026` and `Ben` ensures the copyright phrase never wraps mid-unit. On mobile, wrapping occurs at middot boundaries.

    ### Proposal: Interactions (optional)

    | Interaction | Behavior |
    |-------------|----------|
    | Link default | `color: var(--color-link)`, `text-decoration: underline` — links are always underlined in the footer. Unlike the header (where the link IS the entire component), the footer contains inline links among non-link text. Underline provides a non-color indicator of interactivity, resolving WCAG 1.4.1 regardless of link-to-text color contrast. |
    | Link hover | `color: var(--color-link-hover)`, `text-decoration: underline` — no visual change to decoration on hover; color change provides feedback |
    | Link focus-visible | `outline: 2px solid var(--color-heading); outline-offset: 2px` — matches DDD-002 header focus ring. `--color-heading` achieves 7.75:1 on `--color-background` (light), 10.42:1 (dark). |
    | Link active | No special treatment beyond hover |
    | Keyboard navigation | Tab order follows DOM order through all footer links. Number of tab stops depends on Open Question 1 resolution (three or four links). |
    | External link (LinkedIn) | Opens in a new tab: `target="_blank" rel="noopener"`. Internal links (`/legal`, `/privacy`) open in same tab. |
    | Screen reader | `<footer>` landmark announced. Links are read as inline text within the paragraph. Middot separators cause a natural brief pause — no special ARIA needed for literal middot characters. |

    ### HTML Structure

    Document the **authored content** (CMS fragment) and the **final decorated DOM**.

    **Authored `/footer` fragment (CMS-authored `.plain.html`):**

    ```html
    <div>
      <p>
        &copy; 2026 <a href="https://www.linkedin.com/in/benpeter/">Ben Peter</a> · <a href="https://www.linkedin.com/in/benpeter/">LinkedIn</a> · <a href="/legal">Legal Notice</a> · <a href="/privacy">Privacy Policy</a>
      </p>
    </div>
    ```

    Note: This authored fragment follows site-structure.md where "Ben Peter" and "LinkedIn" are both links. If Open Question 1 is resolved in favor of simplification, the fragment changes to:

    ```html
    <div>
      <p>
        &copy; 2026 <a href="https://www.linkedin.com/in/benpeter/" aria-label="Ben Peter on LinkedIn">Ben Peter</a> · <a href="/legal">Legal Notice</a> · <a href="/privacy">Privacy Policy</a>
      </p>
    </div>
    ```

    CRITICAL: All content must be in a **single `<p>` element** with inline links and text nodes. This is not a stylistic preference — it is an EDS constraint. The `decorateButtons()` function in `aem.js` converts any `<a>` that is the **sole child** of a `<p>` into a `.button` with pill-shaped styling. If each link were in its own `<p>`, every link would become a button. By placing all links inline alongside text nodes (copyright, middots), `decorateButtons` does not trigger.

    **Final decorated DOM after `decorate()` runs:**

    ```html
    <footer>
      <div class="footer block" data-block-name="footer" data-block-status="loaded">
        <div>                                    <!-- JS wrapper div -->
          <div class="section">                  <!-- from decorateSections -->
            <div class="default-content-wrapper"> <!-- from decorateSections -->
              <p>
                &copy; 2026
                <a href="https://www.linkedin.com/in/benpeter/">Ben Peter</a> ·
                <a href="https://www.linkedin.com/in/benpeter/">LinkedIn</a> ·
                <a href="/legal">Legal Notice</a> ·
                <a href="/privacy">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
    ```

    Note the nesting: `footer > .footer > div > .section > .default-content-wrapper > p`. This is standard EDS fragment-loading behavior. The CSS selectors must reach through this nesting. Broad descendant selectors (`footer .footer p`, `footer .footer a`) work cleanly without specifying every intermediate layer.

    **`decorate()` function**: The current boilerplate `footer.js` (load fragment, clear block, append) is sufficient. No DOM restructuring needed — unlike the header (DDD-002), the footer content is simple enough that the fragment structure is predictable and CSS can handle it. The `<p>` with inline links does not trigger `decorateButtons`, so no class contamination occurs.

    ### CSS Approach

    **Layout method**: No flexbox or grid needed. The footer is a single `<p>` of text. Standard block layout with `text-align` governs everything.

    **Key selectors and decisions**:

    1. `footer` — background color only (or omit, inheriting from `body`)
    2. `footer .footer > div` — `max-width: var(--layout-max)`, `margin-inline: auto`, responsive `padding-inline`, `padding-block`, `border-top`
    3. `footer .footer p` — `margin: 0`, `font-size: var(--body-font-size-xs)`, `color: var(--color-text-muted)`, responsive `text-align`
    4. `footer .footer a:any-link` — `color: var(--color-link)`, `text-decoration: underline`
    5. `footer .footer a:hover` — `color: var(--color-link-hover)`, `text-decoration: underline`
    6. `footer .footer a:focus-visible` — `outline: 2px solid var(--color-heading)`, `outline-offset: 2px`

    **Specificity note**: The global `a:any-link { color: var(--color-link) }` in `styles.css` targets all links. `footer .footer a:any-link` has higher specificity and cleanly overrides without `!important`.

    **Width alignment**: The footer's `max-width: var(--layout-max)` + `margin-inline: auto` + `--content-padding-*` tokens match the header (DDD-002) and `main > .section > div` (DDD-001). The footer content's left edge aligns with body text across the page.

    **Background**: `var(--color-background)` (same as page). The current boilerplate CSS uses `var(--color-background-soft)` which creates a tinted band — a visible surface that contradicts the warm-white-paper aesthetic. `--color-background` makes the footer invisible as a surface. The top border provides structural separation.

    **Hardcoded `max-width: 1200px`**: The current footer CSS has this hardcoded. Replace with `var(--layout-max)` for token consistency.

    ### Token Usage Table

    | Element | Property | Token | Status |
    |---------|----------|-------|--------|
    | Footer background | `background-color` | `--color-background` (or inherit) | Existing |
    | Footer text | `color` | `--color-text-muted` | Existing |
    | Footer text | `font-family` | `--font-body` (inherited from body) | Existing |
    | Footer text | `font-size` | `--body-font-size-xs` | Existing |
    | Footer links default | `color` | `--color-link` | Existing |
    | Footer links default | `text-decoration` | `underline` | Hardcoded |
    | Footer links hover | `color` | `--color-link-hover` | Existing |
    | Footer links hover | `text-decoration` | `underline` | Hardcoded |
    | Footer links focus ring | `outline-color` | `--color-heading` | Existing |
    | Middot separators | `color` | `--color-text-muted` (inherited from `<p>`) | Existing |
    | Top border | `border-color` | `--color-border-subtle` | Existing |
    | Content max-width | `max-width` | `--layout-max` | Existing |
    | Padding above content | `padding-block-start` | `--section-spacing` | Existing |
    | Padding below content | `padding-block-end` | `24px` | Hardcoded |
    | Mobile inline padding | `padding-inline` | `--content-padding-mobile` | Existing |
    | Tablet inline padding | `padding-inline` | `--content-padding-tablet` | Existing |
    | Desktop inline padding | `padding-inline` | `--content-padding-desktop` | Existing |

    No new tokens proposed. All values reference existing tokens from `styles/tokens.css`.

    ### Open Questions

    Include these three open questions for the reviewer:

    **Open Question 1: Should "Ben Peter" link to LinkedIn, and should the separate "LinkedIn" item be removed?**

    Site-structure.md (line 21) describes "Ben Peter" and "LinkedIn" as "separate text links." This means the current spec has both as links. This DDD follows that spec: "Ben Peter" links to LinkedIn, and "LinkedIn" also links to LinkedIn as a separate item.

    The UX strategy review recommends simplifying the footer from five items (copyright symbol + year, Ben Peter link, LinkedIn link, Legal Notice link, Privacy Policy link) to four by making "Ben Peter" the LinkedIn link and removing "LinkedIn" as a separate item:
    - Current spec: `(c) 2026 Ben Peter · LinkedIn · Legal Notice · Privacy Policy` (Ben Peter and LinkedIn are both links to LinkedIn)
    - Simplified: `(c) 2026 Ben Peter · Legal Notice · Privacy Policy` (Ben Peter links to LinkedIn with `aria-label="Ben Peter on LinkedIn"`)

    Arguments for simplification:
    - Eliminates a redundant destination (both "Ben Peter" and "LinkedIn" point to the same profile)
    - Reduces cognitive load (users do not have to wonder whether "Ben Peter" goes to a different destination)
    - There is no about page — the LinkedIn profile IS the "about" presence
    - Cleaner line: fewer items, same functionality

    Arguments for the current spec:
    - "LinkedIn" as visible text explicitly signals the platform and destination
    - Site-structure.md specifies both as separate items
    - The word "LinkedIn" provides instant recognition without requiring the user to hover or click

    Note: If the current spec is kept with both as links to the same destination, this is unusual UX — two adjacent links going to the same URL. The reviewer should consider whether this creates confusion.

    This DDD preserves the site-structure.md spec (both as links). The reviewer should decide whether to simplify. If approved as-is, the alternative can be revisited in a future iteration.

    **Open Question 2: `--color-text-muted` contrast fails WCAG AA at `--body-font-size-xs`**

    `--color-text-muted` (#817B6F) on `--color-background` (#F6F4EE) achieves approximately **3.82:1** contrast ratio. WCAG AA requires 4.5:1 for normal text (below 18px regular or 14px bold). At `--body-font-size-xs`:
    - Mobile (15px): fails — 3.82:1 is 0.68 below the 4.5:1 threshold
    - Desktop (14px, per the `>= 900px` media query): fails — at 14px regular weight, this is small text requiring 4.5:1

    This is a **clear AA failure**, not a borderline case. The 3.82:1 ratio is the same token used across the site for metadata (dates, type labels). Options:
    - **Accept as conscious deviation**: The footer's role is deliberately understated. 3.82:1 is a meaningful shortfall (0.68 below threshold). Choosing this means accepting a known WCAG AA failure for supplementary text site-wide.
    - **Use `--color-text`**: Switch to `--color-text` (#3A3A33, 9.15:1) for the non-link footer text. Passes easily but makes the footer more prominent than intended.
    - **Darken `--color-text-muted`**: Adjust the token value site-wide to achieve 4.5:1. This affects all metadata text, not just the footer. This is a token-level decision — see Open Question 3 about a dedicated token audit.

    The reviewer should make this call. The current proposal uses `--color-text-muted` as specified, with this contrast failure documented.

    **Open Question 3: `--color-link` contrast fails WCAG 1.4.3 site-wide**

    `--color-link` (#7F9A63) on `--color-background` (#F6F4EE) achieves approximately **2.85:1** contrast ratio — a clear failure of WCAG 1.4.3 AA (requires 4.5:1 for normal text). Additionally, `--color-link` vs adjacent `--color-text-muted` achieves only ~1.34:1, which would fail WCAG 1.4.1 (3:1 required for color-only link distinguishability).

    This footer DDD mitigates the 1.4.1 issue by specifying `text-decoration: underline` as the default link state — underline is a non-color indicator, so the 3:1 color contrast between links and surrounding text is no longer required. However, the 1.4.3 link-on-background contrast failure remains.

    This is a **site-wide token issue**, not a footer-specific problem. `--color-link` is used for all links across the site. The footer DDD documents this finding but does not attempt to resolve it — changing `--color-link` affects every page.

    Resolution should happen at the token level through DDD-008 (Dark Mode) or a dedicated token audit. Options for that audit:
    - Darken `--color-link` to achieve 4.5:1 on `--color-background`
    - Accept the current color and rely on underline decoration everywhere (partial mitigation — addresses distinguishability but not readability)
    - Define a separate footer link color token (creates inconsistency)

    The reviewer should note this finding. No action is required in this DDD beyond the underline mitigation already specified.

    ### Decision Section

    Use the standard DDD decision checkboxes:
    ```
    - [ ] Approved
    - [ ] Approved with changes
    - [ ] Rejected

    ### Reviewer Notes

    _{Human writes here during review}_
    ```

    ## What NOT To Do

    - Do NOT write CSS or JavaScript implementation code. This is a design decision document, not an implementation PR.
    - Do NOT change the footer content from what site-structure.md specifies. Document alternatives as Open Questions.
    - Do NOT propose new tokens. All values must use existing tokens from `styles/tokens.css`.
    - Do NOT include navigation links, newsletter signup, social icon grid, or any V1 exclusions.
    - Do NOT use Unicode box-drawing characters in wireframes. Use only ASCII: `+`, `-`, `|`, `/`, `\`, `<`, `>`, `^`, `v`.
    - Do NOT wrap middot separators in `<span>` elements in the HTML Structure. Keep them as literal text nodes — this is simpler and the CMS authors type them directly.

    ## Reference Files

    Read these files for context before writing:
    - `docs/design-decisions/README.md` — DDD template and format
    - `docs/design-decisions/DDD-002-header.md` — quality and depth precedent
    - `docs/design-decisions/DDD-001-global-layout.md` — layout contract, width model, Open Question #1
    - `docs/site-structure.md` — footer content specification
    - `styles/tokens.css` — all design tokens
    - `blocks/footer/footer.js` — current boilerplate JS (to describe in Context)
    - `blocks/footer/footer.css` — current boilerplate CSS (to describe in Context)
    - `CLAUDE.md` — aesthetic rules, performance targets, accessibility requirements

- **Deliverables**: `docs/design-decisions/DDD-003-footer.md` with Status set to **Proposal**
- **Success criteria**:
  1. File exists at `docs/design-decisions/DDD-003-footer.md`
  2. All DDD template sections present (Context, Proposal with all subsections, HTML Structure, CSS Approach, Token Usage, Open Questions, Decision)
  3. Status is "Proposal"
  4. Footer content matches site-structure.md: both "Ben Peter" and "LinkedIn" as links per the spec. If Open Question 1 is resolved to simplify, content adjusts accordingly — success criterion is that the DDD is internally consistent with whichever variant it documents.
  5. ASCII wireframes show mobile (centered, wrapped) and desktop (left-aligned, single line) treatments
  6. HTML Structure shows both authored fragment and final decorated DOM
  7. Token Usage table maps every visual element to a CSS custom property
  8. Open Questions include: (1) LinkedIn simplification with "Ben Peter" link status surfaced, (2) --color-text-muted contrast failure at ~3.82:1, (3) --color-link contrast failure at ~2.85:1 site-wide
  9. No new tokens proposed — all existing
  10. `npm run lint` is not applicable (markdown file), but verify the file has no broken markdown
  11. Depth and rigor comparable to DDD-002-header.md
  12. Links in footer use `text-decoration: underline` as default state (not just on hover)
  13. Interactions section header includes `(optional)` marker per the DDD template

### Cross-Cutting Coverage

- **Testing** (test-minion): Not included. This task produces a markdown design document with no executable output. Testing applies at implementation time, not at DDD proposal time.
- **Security** (security-minion): Not included. No attack surface created. The DDD documents an external link (`target="_blank" rel="noopener"`) which is standard practice. No auth, no user input, no secrets.
- **Usability -- Strategy** (ux-strategy-minion): Covered. UX strategy recommendations are fully integrated into the task prompt — zero-wayfinding posture, equal visual weight for legal links, LinkedIn simplification documented as Open Question.
- **Usability -- Design** (ux-design-minion): Covered. Visual design decisions (background color, link states, border treatment, responsive alignment, token mapping) are fully integrated into the task prompt.
- **Accessibility** (accessibility-minion): Covered. Accessibility findings from architecture review are fully integrated: corrected contrast ratios (~3.82:1 for muted text, ~2.85:1 for links), underline-by-default for footer links resolving WCAG 1.4.1, site-wide link contrast flagged as Open Question 3. Focus ring specs, keyboard navigation, screen reader behavior documented in Interactions section.
- **Documentation** (software-docs-minion): This IS the documentation task. The DDD is the deliverable.
- **Observability** (observability-minion): Not included. The footer is a static HTML/CSS surface with no runtime services, APIs, or background processes.

### Architecture Review Agents

- **Mandatory** (5): security-minion, test-minion, ux-strategy-minion, lucy, margo
- **Discretionary picks**:
  - accessibility-minion: The DDD documents WCAG contrast failures (Open Questions 2 and 3), specifies underline-by-default as a 1.4.1 mitigation, and makes specific claims about screen reader behavior and keyboard navigation. Accessibility review of the spec ensures the revised findings are accurately documented and the underline mitigation is sufficient. (Task 1)
- **Not selected**: ux-design-minion (design decisions fully integrated into prompt — no residual design questions for the DDD document itself), observability-minion (no runtime component), sitespeed-minion (no web-facing runtime code in this task — it's a markdown document), user-docs-minion (no end-user documentation changes)

### Conflict Resolutions

**Conflict: Footer link color — `--color-text-muted` vs `--color-link`**

frontend-minion recommended `--color-text-muted` for footer links (making them blend with surrounding text, brightening to `--color-link-hover` on hover). ux-design-minion recommended `--color-link` (standard sage green, matching body links exactly).

**Resolution: `--color-link`** (ux-design-minion's position). Rationale: The site has very few interactive elements. Making footer links visually indistinguishable from non-interactive text until hover contradicts WCAG 1.4.1 (Use of Color — links must be distinguishable from surrounding text by more than color alone OR have a 3:1 contrast ratio against surrounding non-link text). Using `--color-link` provides the standard affordance that these are interactive. The sage green is already understated by design — there is no need to suppress it further. Note: even `--color-link` fails 1.4.1 by color alone (~1.34:1 against `--color-text-muted`), which is why `text-decoration: underline` is specified as the default state.

**Conflict: "Ben Peter" as LinkedIn link vs separate "LinkedIn" text**

ux-strategy-minion recommended removing "LinkedIn" as separate text and making "Ben Peter" the LinkedIn link. Site-structure.md specifies "Ben Peter" and "LinkedIn" as separate text links.

**Resolution: Preserve site-structure.md spec.** The ux-strategy argument has merit and is documented as Open Question 1 in the DDD for the reviewer to decide. The DDD author should not unilaterally change the specified content — that is a scope/intent decision for the human. Lucy's review identified that site-structure.md describes "Ben Peter" as a link, which is now surfaced explicitly in Open Question 1.

**Conflict: Mobile text alignment — centered vs left**

ux-design-minion recommended centered on mobile (< 600px), left-aligned at >= 600px. frontend-minion recommended centered at all widths. ux-strategy-minion did not specify.

**Resolution: Centered mobile, left-aligned tablet+** (ux-design-minion's position). Rationale: Left-aligned short wrapped text on mobile creates orphaned fragments hugging the left edge. Centered alignment creates visual balance for wrapped footer text. At tablet+ widths where the content fits on one line, left alignment matches the header and body text. This is a well-tested responsive pattern.

### Risks and Mitigations

1. **`decorateButtons` contamination** (HIGH): If the footer fragment is authored with each link in its own `<p>`, `decorateButtons` converts links to pill-shaped buttons. **Mitigation**: The DDD explicitly documents the single-`<p>` authoring constraint with the EDS rationale. Implementation agents will follow the HTML Structure section.

2. **Missing `/footer` content page**: The `/footer` page may not exist in the CMS. **Mitigation**: Implementation can use a `drafts/footer.html` test file with `--html-folder drafts`. This is an implementation concern, not a DDD concern, but the DDD's HTML Structure section provides the exact markup to author.

3. **WCAG contrast failures — muted text** (HIGH): `--color-text-muted` at ~3.82:1 fails the 4.5:1 AA threshold for normal text by 0.68. **Mitigation**: Documented as Open Question 2 with three resolution options. The reviewer decides whether to accept, switch tokens, or adjust the token value site-wide.

4. **WCAG contrast failures — link color** (HIGH): `--color-link` at ~2.85:1 fails 4.5:1 AA for normal text. This is site-wide, not footer-specific. **Mitigation**: Documented as Open Question 3. Footer-specific mitigation: `text-decoration: underline` resolves WCAG 1.4.1 (distinguishability). The 1.4.3 readability failure requires token-level resolution.

5. **Copyright year hardcoding**: "(c) 2026" will need annual update. **Mitigation**: Hardcoded in CMS content. One edit per year. JS-generated dates have SEO and accessibility edge cases. This is the standard practice for small sites.

6. **Dark mode border visibility**: `--color-border-subtle` (#4A4A42) on `--color-background` (#3A3A33) in dark mode is very low contrast by design. **Mitigation**: This matches the header's border treatment (DDD-002). If the border vanishes, it degrades gracefully — spacing still provides separation. Can be revisited in DDD-008 (Dark Mode).

### Execution Order

```
Batch 1: Task 1 (Write DDD-003-footer.md)
  |
  v
APPROVAL GATE: DDD-003-footer.md proposal
```

Single task, single gate. No parallelism needed.

### Verification Steps

1. `docs/design-decisions/DDD-003-footer.md` exists and is valid markdown
2. All DDD template sections are present per `docs/design-decisions/README.md`
3. Footer content in HTML Structure matches site-structure.md (both "Ben Peter" and "LinkedIn" as links)
4. Token Usage table references only tokens that exist in `styles/tokens.css`
5. ASCII wireframes use only ASCII characters (no Unicode box-drawing)
6. Open Questions include: LinkedIn simplification (with "Ben Peter" link status surfaced), muted text contrast failure (~3.82:1), and link color contrast failure (~2.85:1)
7. Status is set to "Proposal"
8. Depth and specificity are comparable to DDD-002-header.md
9. Footer links specify `text-decoration: underline` as the default state
10. Interactions section header includes `(optional)` marker

---

## Approval Gate

```
APPROVAL GATE: DDD-003-footer.md Design Decision Document
Agent: software-docs-minion | Blocked tasks: none (this is the only task; future implementation depends on this)

DECISION: Footer design spec documenting the single-line typographic treatment with token mappings, EDS HTML structure, and responsive behavior.

DELIVERABLE:
  docs/design-decisions/DDD-003-footer.md (new file, ~250-350 lines)
  Summary: Complete design decision document specifying the footer as a single middot-separated line of copyright text and links, using existing tokens, with ASCII wireframes for mobile and desktop. Includes three open questions on link simplification, muted text contrast, and site-wide link color contrast.

RATIONALE:
- Footer mirrors the header's minimal approach: same background, same border treatment, same padding tokens, creating symmetric bookends
- Single <p> with inline links avoids EDS decorateButtons contamination — this is a technical constraint, not a style preference
- Links use text-decoration: underline by default — resolves WCAG 1.4.1 distinguishability since --color-link vs --color-text-muted is only ~1.34:1
- Three open questions preserved for human judgment: LinkedIn link simplification (with "Ben Peter" link status from site-structure.md surfaced), muted text contrast failure (~3.82:1 vs 4.5:1 AA requirement), and site-wide link color contrast failure (~2.85:1)
- Rejected: --color-background-soft (creates visible band contradicting warm-white-paper aesthetic)
- Rejected: --color-text-muted for link color (fails WCAG 1.4.1 link distinguishability)
- Rejected: text-decoration: none as default link state (insufficient non-color indicator given ~1.34:1 link-to-text contrast)

IMPACT: Approving establishes the design contract for footer implementation. All future footer CSS/JS work builds to this spec. Rejecting means no footer work proceeds until a revised DDD is proposed.
Confidence: HIGH
```

---

## Revision Summary (Round 1 BLOCK Resolution)

Changes made to address the accessibility-minion BLOCK:

1. **Fixed contrast ratio**: Replaced "4.34:1" with "~3.82:1" throughout. Open Question 2 now correctly states a clear AA failure (0.68 below threshold), not borderline.

2. **Added link contrast findings**: Documented that `--color-link` on `--color-background` fails 1.4.3 at ~2.85:1, and fails 1.4.1 at ~1.34:1 against adjacent muted text. Added to Context section (item 8) and as new Open Question 3.

3. **Changed link default to underline**: Interactions table now specifies `text-decoration: underline` as the default link state (not just on hover). CSS Approach selector 4 updated. Token Usage table updated with both default and hover underline rows. Rationale documented: footer has inline links among non-link text, underline provides non-color indicator resolving WCAG 1.4.1.

4. **Updated Open Question 2**: Corrected to ~3.82:1, reframed as "clear AA failure" not "borderline." Accept option now explicitly states this is a "conscious accessibility deviation."

5. **Added Open Question 3**: New question documenting --color-link site-wide contrast failure. Notes this is out of scope for footer DDD, recommends token-level resolution via DDD-008 or dedicated audit.

6. **Risks updated**: Risk 3 updated with correct ratio. Risk 4 added for link color contrast. Both rated HIGH.

Changes made to incorporate ADVISE verdicts:

7. **lucy — "Ben Peter" link status**: Open Question 1 now explicitly surfaces that site-structure.md describes "Ben Peter" as a link (not plain text). Typography table updated — "Ben Peter" color now references Open Question 1. HTML Structure shows "Ben Peter" as a link in the authored fragment. Both link and simplified variants documented.

8. **lucy — Interactions (optional)**: Template and task prompt updated to include `(optional)` marker on the Interactions section header.

9. **ux-strategy — Success criterion 4**: Now conditional on Open Question 1 resolution instead of locking to five-item spec.

10. **margo — prompt length**: Acknowledged as non-blocking. No structural change needed — the prompt's specificity is the plan's mechanism for ensuring DDD quality.
