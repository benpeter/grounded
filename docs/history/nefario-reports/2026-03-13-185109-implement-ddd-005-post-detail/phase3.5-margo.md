# Margo Review — DDD-005 Post Detail

## Verdict: APPROVE

## Assessment

The plan is proportional to the problem. Five tasks for the site's primary content surface (post detail page) is reasonable -- this is not task count inflation. The request covers page detection, header decoration, scoped CSS, a new block, test content, and integration verification. Each task maps to a distinct deliverable with clear boundaries.

### Complexity budget

| Item | Type | Cost |
|---|---|---|
| `scripts/post-utils.js` extraction | Refactor (shared module) | 0 (reduces duplication) |
| `decoratePostDetail()` in scripts.js | Application logic | 0 (essential complexity) |
| `styles/post-detail.css` | Scoped CSS file | 0 (essential complexity) |
| Quote block (`blocks/quote/`) | New EDS block | 1 (new abstraction, but follows established block pattern) |

Total: 1. Well within budget for the primary content surface.

### What is done well

- **No new dependencies.** Vanilla JS, vanilla CSS, no frameworks, no libraries. Exactly right.
- **No new tokens.** All CSS values reference existing design tokens.
- **YAGNI discipline.** Series navigation, syntax highlighting, JSON-LD, dark mode toggle -- all explicitly out of scope. Good.
- **Utility extraction before duplication.** Task 1 extracts shared utilities before Task 2 needs them, preventing copy-paste. The right sequence.
- **CSS override over JS exclusion** for `decorateButtons()`. Avoids coupling to `aem.js` internals. Simpler.
- **No `<article>` wrapper.** The accessibility-minion correctly identified the simpler alternative and the plan adopted it. Less DOM, same semantics.
- **No test framework.** Lint + draft pages + manual verification. Proportional to a single-author blog.

### Minor observations (non-blocking)

1. **Task 2 prompt is very long (~140 lines).** The CSS specification is exhaustive, which is fine for correctness, but a shorter prompt pointing to the DDD-005 spec ("implement the CSS rules from the DDD-005 CSS Approach section") would reduce duplication between the spec and the prompt. Not blocking because the redundancy is harmless -- it just means two places to update if the spec changes.

2. **`role="region"` on every `<pre>` element.** The plan applies `role="region"` with `aria-label="Code example"` universally. This is a V1 tradeoff acknowledged by accessibility-minion. For posts with many code blocks, multiple regions with identical labels may create screen reader noise. Acceptable for now; worth revisiting if posts regularly contain 5+ code blocks.

3. **Task 2 blocked by Task 1, but Task 2 only needs `post-utils.js` to exist.** If Task 1 fails or is delayed, Task 2 could inline the import and be unblocked. The dependency is real but shallow. No action needed -- just noting the coupling is minimal.

## Conclusion

Five tasks, zero new dependencies, zero new tokens, zero new services. Essential complexity for the site's primary reading surface. The plan follows EDS conventions, scopes all changes behind `body.post-detail`, and explicitly excludes future-proofing. Ship it.
