# Margo Review: DDD-002 Header

VERDICT: ADVISE

The document is well-structured and follows the DDD format established by DDD-001. The header is genuinely the most design-critical surface on this site (the corrupted letterforms ARE the brand), so the detail level is largely justified as essential complexity. That said, there are a few areas where the document specifies more than a Proposal-status DDD needs to.

## FINDINGS

- [ADVISE] DDD-002-header.md:126-143 -- The corruption map table is over-specified for a Proposal. The document itself says "(ILLUSTRATIVE -- specific letter assignments may change during design review)" on line 125, which is an honest acknowledgment that this detail is premature. A 16-row table of per-letter corruption assignments that will likely change during review is accidental complexity in the spec itself -- it creates a false sense of precision that the reviewer and implementer must then mentally discount. The rules (lines 118-123) are the actual design intent; the map is speculative implementation detail.
  FIX: Collapse the corruption map table into 2-3 example corruptions inline with the rules. For example: "e.g., a vertical stroke extending below baseline (overshoot), a counter curling inward (closure), a serif appearing where none belongs (phantom serif)." Keep the six governing rules (lines 118-123), which are excellent. Drop the 14-row table. The implementer and designer will work out specific letter assignments during visual prototyping -- which is exactly what Open Question #1 already acknowledges.

- [ADVISE] DDD-002-header.md:262-283 -- The Token Usage table duplicates information already stated in the Typography, Spacing, and CSS Approach sections. DDD-001 established this table format, but DDD-001 was also proposing NEW tokens (--layout-max, --content-padding-tablet, --space-paragraph, --space-element) so the table served as a clear inventory of what needed to be created. DDD-002 proposes zero new tokens (stated explicitly on line 284). When every entry says "Existing" and each token is already named in context where it's used, the table is a maintenance liability rather than a reference aid -- any change to the proposal sections requires a synchronized change to the table.
  FIX: Replace the full table with a short statement: "All tokens referenced in this document exist in `styles/tokens.css`. No new tokens are proposed. See Typography, Spacing, and CSS Approach sections above for specific token-to-element mappings." This eliminates 20 lines of duplicated information. If future revisions introduce new tokens, restore the table for those entries only.

- [NIT] DDD-002-header.md:37-39 -- The "Boilerplate state" paragraph in Context (171 lines, hamburger menus, escape-key handlers, etc.) is repeated almost verbatim in CSS Approach item #3 (lines 240-241). Saying it once is valuable context; saying it twice is noise.
  FIX: Keep the Context paragraph (lines 37-39) as-is. In CSS Approach item #3 (line 240), shorten to: "The boilerplate header scaffolding does not apply (see Context > Boilerplate state). The implementation needs a replacement `decorate()` function that reads the nav fragment and produces the HTML Structure defined above."

- [NIT] DDD-002-header.md:248-254 -- The three corruption implementation approaches (CSS-only, SVG, hybrid) with pros/cons is good analysis, but the recommendation to "start with CSS, escalate to SVG" is already captured in Open Question #1 (line 290). Having the recommendation in two places creates ambiguity about which is authoritative.
  FIX: Keep the implementation approaches in CSS Approach (lines 248-254) as the authoritative discussion. In Open Question #1, reference it: "See CSS Approach > Corruption Effect for analysis. Decision deferred to visual prototyping."

## COMPLEXITY ASSESSMENT

Overall document complexity is proportional to the problem. The header IS the brand surface and the corrupted letterform treatment is the single most distinctive design element on the site. The document correctly identifies the essential complexity (corruption rules, accessibility with aria-label, semantic HTML choices, alignment with DDD-001 layout contract) and separates it from open questions.

The four items above are minor -- they trim approximately 30-40 lines of duplicated or premature detail without losing any design intent. The core proposal (three-line stacked layout, typography choices, corruption principles, HTML structure, CSS approach) is well-reasoned, properly constrained, and ready for human review.
