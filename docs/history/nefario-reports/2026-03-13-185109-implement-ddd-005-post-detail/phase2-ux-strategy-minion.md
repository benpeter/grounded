# UX Strategy Contribution: DDD-005 Quote Block & Pull-Quote

## Question 1: Is the Quote block authoring model clear?

**Assessment: Clear enough, with one caveat worth documenting.**

The authoring model follows standard EDS conventions and is straightforward:

- **Standard blockquote**: Author creates a "Quote" block table in Google Docs. EDS renders it as `.quote-wrapper > .quote.block > blockquote`. No variant class needed.
- **Pull-quote variant**: Author creates the same "Quote" block table, then applies section metadata with `style: pull-quote`. EDS adds the `.pull-quote` class to the block element, producing `.quote.pull-quote.block`.

This is idiomatic EDS -- block + section metadata variant is the established pattern. Any author or agent familiar with EDS will recognize it immediately. The contract between author and developer is clean.

**One clarification the implementing agent should confirm**: The DDD shows the pull-quote class on the block div (`<div class="quote pull-quote block">`), which implies EDS propagates section metadata `style` values as classes on blocks within that section. The implementing agent should verify this behavior with `curl` against a test page, because if the class lands on the section wrapper instead, the CSS selectors need adjustment. This is a technical verification, not a UX concern.

**Recommendation**: No changes needed to the authoring model. It's the simplest viable approach.

---

## Question 2: Pull-quote content discipline -- enforce, document, or both?

**Recommendation: Document as convention only. Do not enforce programmatically.**

### Rationale

**Programmatic enforcement would create more problems than it solves.**

1. **False negatives are inevitable.** Matching pull-quote text to body text requires fuzzy string matching. Authors may slightly rephrase, add emphasis, or excerpt a clause rather than a full sentence. Any enforcement that rejects valid editorial choices creates friction in the authoring flow -- the opposite of what the convention intends.

2. **False positives undermine trust.** A validation warning that fires incorrectly ("this pull-quote doesn't match body text") teaches authors to ignore warnings. This is worse than no validation at all (the "cry wolf" pattern from error prevention heuristics).

3. **The cost-benefit is wrong.** This is a solo-author blog. The author (Ben) understands the convention. Programmatic enforcement protects against a mistake that is unlikely to happen, at the cost of implementation complexity and ongoing maintenance. Every feature is a permanent tax -- this one has near-zero payoff.

4. **The `aria-hidden="true"` decision already encodes the intent.** If a pull-quote doesn't repeat body text, the accessibility consequence is that screen reader users miss content. That's a strong enough guardrail: the author knows the pull-quote is invisible to assistive technology and therefore must be redundant.

**What to document (in the content model or a brief authoring guide):**

> Pull-quotes must repeat text that appears verbatim elsewhere in the post body. They are decorative emphasis -- `aria-hidden="true"` means screen readers skip them entirely. If the text is unique to the pull-quote, it must be a standard blockquote instead.

This is a one-sentence rule. It's easy to remember because the reasoning is self-evident: hidden from screen readers = must be redundant.

---

## Question 3: Is `aria-hidden="true"` the right UX call for pull-quotes?

**Assessment: Yes. This is the correct accessibility decision, given the content discipline.**

### The reasoning chain

1. **Pull-quotes are a print-era convention.** They exist to break up long columns of text visually and draw scanning readers into the content. They repeat existing text -- that's definitional. In print, a reader's eye skips over a pull-quote they've already read. The visual emphasis is the entire value.

2. **Screen readers have no "visual emphasis" channel.** Without `aria-hidden`, a screen reader user hears the same sentence twice in close proximity with no signal that it's a decorative repetition. This is not emphasis -- it's confusion. The user wonders: "Did I miss something? Is this different from what I just heard?" That's unnecessary cognitive load.

3. **The alternative -- `role="presentation"` or `<aside>`** -- doesn't solve the problem:
   - `role="presentation"` strips the blockquote semantics but still reads the text content.
   - `<aside>` signals supplementary content, but a pull-quote isn't supplementary -- it's *identical*. Announcing it as an aside is misleading.
   - `aria-hidden="true"` is the only mechanism that correctly communicates: "this content exists for visual readers only and adds nothing to the content stream."

4. **The content discipline is the prerequisite, not a nice-to-have.** `aria-hidden="true"` is only correct *because* the pull-quote text appears elsewhere. If the discipline is violated -- if unique content appears only in a pull-quote -- then screen reader users lose information. This is why the convention must be documented clearly (see Question 2).

5. **Precedent supports this pattern.** Major publications (NYT, Guardian) and accessibility guides treat pull-quotes as decorative duplications. `aria-hidden` on repeated decorative content is a well-established pattern.

### One edge case to flag

If a future author uses a pull-quote for a *citation* or *external quote* that doesn't appear in the body text, the `aria-hidden` would hide unique content from screen readers. The content model documentation should make the distinction explicit:

- **Pull-quote** (`.pull-quote` variant): Repeats body text. `aria-hidden="true"`. For visual emphasis only.
- **Standard blockquote** (no variant): Original/unique quoted content. Fully accessible. Use this for citations, external quotes, or any text that doesn't appear elsewhere in the post.

This distinction is already implied by the DDD but should be stated explicitly in authoring guidance so the choice between "Quote block" and "Quote block + pull-quote style" is a conscious editorial decision, not an aesthetic one.

---

## Summary of Recommendations

| Question | Recommendation | Confidence |
|---|---|---|
| Quote block authoring model clarity | Clear, no changes needed. Verify class propagation during implementation. | High |
| Content discipline enforcement | Document as convention only. No programmatic enforcement. | High |
| `aria-hidden="true"` on pull-quotes | Correct decision. Document the blockquote vs. pull-quote distinction explicitly. | High |

### Key implementation note for the implementing agent

The authoring guidance distinction (pull-quote = decorative repetition, standard blockquote = unique content) should surface somewhere durable -- either in `docs/content-model.md` or as a comment in the Quote block CSS/JS. This is a content discipline, not a code constraint, but it needs to be findable by anyone adding content to the site.
