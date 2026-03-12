# Margo Review: DDD-001-global-layout

## VERDICT: ADVISE

The document is well-scoped for what it is -- a foundational layout contract that downstream DDDs depend on. It stays in its lane (global page geometry) and properly defers detailed typography, header, footer, and per-surface concerns to their own DDDs. The wireframes, CSS approach, and HTML structure are concrete enough to implement from. No over-engineering detected in the layout model itself: a two-tier width system is the minimum viable approach for a reading-focused single-column blog.

Three items warrant attention before approval. None are blocking.

---

## FINDINGS

### [ADVISE] DDD-001-global-layout.md:143-172 -- Spacing and typography detail encroaches on DDD-005/006 territory

The document defines a three-tier vertical spacing scale (`--space-paragraph`, `--space-element`, `--section-spacing`) and heading-specific asymmetric margins (`2em` above h2/h3, `0.5em` below). Lines 145-149 also pin typography facts (body font size, heading font family, `ch` unit resolution).

The section spacing token (`--section-spacing`) belongs here because it governs inter-section geometry. But paragraph-level spacing, element-level spacing, and heading margins are typography and content-rhythm decisions that belong in DDD-005/006. Including them here creates two sources of truth -- if DDD-006 adjusts heading rhythm, it must also update DDD-001.

**FIX:** Retain `--section-spacing` (it is layout). Move `--space-paragraph`, `--space-element`, and heading margin values to DDD-005/006. Replace lines 155-172 with a brief note: "Intra-section spacing (paragraph rhythm, heading margins, element gaps) is deferred to DDD-005/006. This DDD governs only inter-section spacing via `--section-spacing`." Similarly, trim lines 145-149 to a single sentence noting that `--measure` depends on the body font; full typography details live in DDD-006.

### [ADVISE] DDD-001-global-layout.md:97,181,338 -- `--content-padding-tablet` marked "proposed" but no token exists, and the 600px breakpoint is absent from current CSS

`tokens.css` defines `--content-padding-mobile` (20px) and `--content-padding-desktop` (32px) but has no tablet token. The DDD proposes `--content-padding-tablet: 24px` and a `@media (min-width: 600px)` rule (lines 286-290). The existing `styles.css` boilerplate jumps from 24px base padding directly to 32px at 900px with no 600px breakpoint.

This is a 4px difference (24px vs the boilerplate's 24px base, then 32px at 900px). The three-tier padding progression adds a token and a media query for a 4px bump that is nearly imperceptible. On a 600px viewport with 24px padding on each side, the content area is 552px -- already within `--measure` range. The tablet padding tier may not carry its weight.

**FIX:** Evaluate whether the 600px breakpoint for padding is necessary at all. If the answer is "the jump from 20px to 32px at 900px is too abrupt," then the tablet token is justified -- document why. If not, drop `--content-padding-tablet` and the 600px padding rule entirely. Two tiers (mobile/desktop) may suffice.

### [NIT] DDD-001-global-layout.md:260-272 -- Boilerplate variable replacement table is implementation sequencing, not design

The table mapping boilerplate variables to project tokens (lines 260-272) and the instruction to remove the boilerplate `:root` block are implementation instructions, not design decisions. They tell an agent _how to refactor styles.css_, not _what the layout should look like_. This is useful context but sits better in implementation task notes or a comment in the PR.

**FIX:** Move the boilerplate replacement table to an implementation note section at the end of the document, or note it as a task instruction rather than part of the design proposal. Alternatively, leave it but acknowledge it is implementation guidance rather than design specification.

---

## Summary

The document is sound. The two-tier width model, EDS-aware selectors, and wireframes are the right level of detail for a foundational layout DDD. The open questions are thoughtful and appropriately scoped. The three findings above are about keeping boundaries clean between this DDD and downstream ones, avoiding a token that may not earn its keep, and separating design decisions from implementation instructions. None require re-architecture.
