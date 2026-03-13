## Domain Plan Contribution: ux-strategy-minion

### Recommendations

#### (a) Single-line middot hierarchy: Yes, with one refinement

The middot-separated single-line pattern is the right call. Here is why, grounded in the user's actual journey:

**The footer's JTBD is "close the page, not open a new one."** Visitors reaching the footer have finished reading. Their job is either to scroll back up (already done mentally), leave the site, or -- in rare legal/compliance cases -- find the Impressum. The footer's role is to signal "you've reached the end" and provide legally required links. It is not a discovery surface.

A single flat line of middot-separated items correctly communicates equal low-priority: nothing here competes for attention, nothing demands a decision. This matches the site's overall philosophy of typography-as-hierarchy without color blocks or boxes.

**Copyright should NOT be visually distinct from links.** Giving the copyright its own visual weight (larger, bolder, different color) would create a false hierarchy -- it would suggest the copyright is more important to the user than the links, when in fact it is the least actionable item on the line. In a footer this minimal, visual parity communicates "this is all one quiet utility line." The only distinction needed is that links look like links (via `--color-link`) and the copyright text uses `--color-text-muted`. This is a natural, earned distinction -- interactive elements signal interactivity through link color, non-interactive text stays muted. No additional treatment needed.

**One refinement**: The copyright symbol and year ("(c) 2026") should be non-breaking relative to "Ben Peter" so the line never wraps between the symbol and the name. On narrow viewports, the ideal wrap point is after a middot, not mid-phrase. This is a detail for implementation, but the strategy decision is: the line may wrap to two lines on mobile, and that is fine -- but it should wrap at semantic boundaries (between items), not within them.

#### (b) Footer carries zero wayfinding burden

This site has a deliberate architectural decision: **zero navigation**. The header links home and that is all (DDD-002). There are no nav links, no hamburger, no search. The footer does not inherit wayfinding responsibility by default.

Looking at the site structure: the home page IS the post index. Tags are reachable from post pages. Individual posts are reachable from the index. The navigational model is hub-and-spoke: home -> post -> home. Users navigate via:
- The header logo (back to home/index)
- Tag links within posts (to tag index pages)
- Browser back button

The footer is **purely legal/attribution**. It answers: "Who made this?" and "Where are the legally required disclosures?" It does not answer "Where can I go next?" and should not try to. Adding wayfinding to the footer would contradict the deliberate zero-navigation posture and add cognitive load to a surface that should be invisible.

This is validated by the Kano model: footer navigation on a minimal blog is an *indifferent* feature -- its presence would not increase satisfaction, and its absence does not decrease it. Users of technical blogs do not navigate via footers; they use the content itself (links within posts, tag taxonomy) or the browser.

#### (c) "Ben Peter" should link to LinkedIn; the word "LinkedIn" should not appear separately

The current spec says both "Ben Peter" and "LinkedIn" are separate text links. This creates a real UX problem:

**Two adjacent links to the same destination violate Krug's satisficing principle.** Users scanning the footer see "Ben Peter" and "LinkedIn" as two separate actions. They pause -- however briefly -- to wonder: "Does 'Ben Peter' go to an about page? Or is it the same as 'LinkedIn'?" That question mark is unnecessary cognitive load.

My recommendation: **"Ben Peter" is the link, and it goes to LinkedIn. The word "LinkedIn" does not appear.**

Rationale:
1. **There is no about page.** The spec explicitly says: "No bio. No headshot. No 'about the author' section." So "Ben Peter" cannot link to an internal about page -- there is none.
2. **The author's name IS the social link.** On a single-author blog with one social presence, the name suffices. Users who want to know more about "Ben Peter" click the name. The destination (LinkedIn profile) is the about page.
3. **Removing "LinkedIn" simplifies the line.** The footer goes from five items to four: `(c) 2026 Ben Peter . Legal Notice . Privacy Policy`. Fewer items, less scanning, same functionality.
4. **Screen readers**: The link on "Ben Peter" should have an accessible label clarifying the destination, e.g., `aria-label="Ben Peter on LinkedIn"`. The visual simplification should not create an accessibility ambiguity.

The resulting footer: `(c) 2026 Ben Peter . Legal Notice . Privacy Policy`

This is cleaner, eliminates a redundant link, and every item on the line now serves a distinct purpose: attribution (Ben Peter/LinkedIn), legal (Legal Notice), legal (Privacy Policy).

**Alternative if the team wants "LinkedIn" visible**: If there is a strong brand reason to show the platform name (e.g., signaling professional presence specifically), then remove the link from "Ben Peter" and keep only "LinkedIn" as the linked text. The rule is: one link per destination. Never two adjacent text items linking to the same URL.

#### (d) Legal links: Equal weight, not subordinated

German law (DDG SS5, DSGVO) requires Impressum and Privacy Policy links to be **easily accessible from every page**. German courts have repeatedly ruled that legal links must not be hidden, buried in sub-menus, or made visually subordinate to other content. The standard is: a reasonable user must be able to find them without effort.

**Subordinating legal links would create legal risk with zero UX benefit.** Making them smaller, lighter, or otherwise visually quieter than the brand content invites the argument that they are "hidden." On this site, there is no business reason to de-emphasize them -- the footer is already a single quiet line. Making two of four items even quieter within an already-quiet line creates a visual hierarchy problem (the line would have three different visual weights for four items, which reads as messy, not minimal).

**Recommendation: All items in the footer line should share the same typographic treatment.** Same font size (`--body-font-size-xs`), same line. Links use `--color-link`; non-linked copyright text uses `--color-text-muted`. That is the only visual distinction, and it is a functional one (interactive vs. non-interactive), not a hierarchy one.

This approach is both legally safe and aesthetically correct: a single understated line where every item sits at equal visual weight, consistent with the brand's minimal philosophy.

### Proposed Tasks

**Task 1: Finalize footer content string and link targets**

- What: Confirm the exact footer content, link destinations, and accessible names. Recommended content: `(c) 2026 Ben Peter . Legal Notice . Privacy Policy` where "Ben Peter" links to the LinkedIn profile with `aria-label="Ben Peter on LinkedIn"`, "Legal Notice" links to `/legal`, and "Privacy Policy" links to `/privacy`.
- Deliverable: Updated footer spec in DDD-003 with exact content string, link hrefs, and aria-labels.
- Dependencies: Decision on whether "LinkedIn" appears as separate text (recommendation (c) above). This must be resolved before implementation begins.

**Task 2: Define footer layout and responsive behavior**

- What: Specify the footer's layout model, alignment, padding, and wrapping behavior. The footer should use the same `--layout-max`, `margin-inline: auto`, and `--content-padding-*` tokens as the header (DDD-002) so the footer text aligns with page content. On narrow viewports, the line wraps at middot boundaries. The footer's background should be `--color-background` (not `--color-background-soft` as in the current boilerplate CSS) to maintain the warm-white-paper aesthetic.
- Deliverable: Layout section of DDD-003 with wireframes for mobile and desktop, token usage table.
- Dependencies: DDD-001 layout contract (existing), DDD-002 header alignment tokens (existing).

**Task 3: Define footer interaction states**

- What: Specify hover, focus, and active states for the footer links. Links should follow site-wide link behavior: `--color-link` default, `--color-link-hover` on hover, `focus-visible` ring using `--color-heading` (matching header focus ring decision from DDD-002). External link ("Ben Peter" -> LinkedIn) should open in a new tab with `rel="noopener"`. Internal links (`/legal`, `/privacy`) open in the same tab.
- Deliverable: Interaction states table in DDD-003.
- Dependencies: DDD-002 focus ring decision (resolved: `--color-heading`).

**Task 4: Define footer HTML structure**

- What: Specify the semantic HTML the footer block produces after decoration. Key decisions: `<footer>` landmark (already provided by EDS), `<nav>` is NOT appropriate here (the footer contains legal/attribution links, not site navigation -- using `<nav>` would create a misleading landmark for screen reader users), use a `<p>` or `<div>` containing inline text and links. Middots are literal ` . ` characters in the DOM, not pseudo-elements or list markers.
- Deliverable: HTML structure section of DDD-003.
- Dependencies: Task 1 (content string finalized).

**Task 5: Audit current footer block for necessary changes**

- What: The current `blocks/footer/footer.js` is the boilerplate default (fragment loader). The current CSS uses `--color-background-soft` as background and hardcoded `max-width: 1200px`. Both need updating. The JS may need a `decorate()` function that restructures the CMS fragment into the target HTML structure (similar to what DDD-002 did for the header).
- Deliverable: Implementation delta: what changes in `footer.js` and `footer.css` relative to boilerplate.
- Dependencies: Tasks 1-4 (DDD-003 spec complete).

### Risks and Concerns

**Risk 1: "Ben Peter" link destination ambiguity.** If the spec keeps both "Ben Peter" and "LinkedIn" as separate links to the same URL, users will wonder why there are two links. If only "Ben Peter" links to LinkedIn without any visual indicator of the destination, some users may expect it to go to an about page (which does not exist). Mitigation: `aria-label="Ben Peter on LinkedIn"` for accessibility, and the sighted user context (it is the only external link in a legal/attribution footer) makes the destination predictable enough. If doubt remains, a `title` attribute could provide a tooltip, but that is a weak pattern.

**Risk 2: German legal compliance on link visibility.** If the design process introduces any visual subordination of legal links (smaller font, lower contrast, lighter color), this creates a legal attack surface. German courts interpret "easily accessible" strictly. Mitigation: treat all footer items at equal visual weight, as recommended.

**Risk 3: Footer background color mismatch.** The current boilerplate CSS uses `--color-background-soft` for the footer background, which creates a visible band. The DDD-003 spec (and the site's aesthetic rules) call for the page to be warm white paper throughout. If the footer retains a distinct background color, it visually "announces itself" as a separate zone, contradicting the minimal aesthetic. Mitigation: set footer background to `--color-background` (same as page). If a top border is needed for separation, use `--color-border-subtle` (matching the header's bottom border pattern from DDD-002).

**Risk 4: Copyright year hardcoding.** The spec says "(c) 2026". If this is hardcoded in the CMS fragment, it will be wrong on January 1, 2027. If it is generated by JavaScript, it adds a dependency on JS execution. This is a minor implementation concern but worth noting in the DDD so the team makes a deliberate choice. Recommendation: hardcode in CMS content, accept the annual update -- it is one edit per year, and JS-generated content has SEO and accessibility edge cases.

**Risk 5: Mobile wrapping behavior.** On a 320px viewport, the full line `(c) 2026 Ben Peter . Legal Notice . Privacy Policy` is approximately 50 characters. At `--body-font-size-xs` (15px mobile, 14px desktop), this may wrap to two lines. This is acceptable, but the wrapping should break at middot boundaries, not mid-word. CSS `word-break` and `white-space` settings, plus non-breaking spaces within phrases, control this. The DDD should specify expected wrapping behavior.

### Additional Agents Needed

None. The current team should be sufficient. The footer is a straightforward layout + typography task once the UX strategy decisions above are resolved. The design agent handles token usage and visual execution; the implementation agent handles the EDS block code. No accessibility specialist is needed beyond what is already covered in the recommendations (aria-labels, focus rings, landmark decisions), as the footer is simple enough that standard practices apply.
