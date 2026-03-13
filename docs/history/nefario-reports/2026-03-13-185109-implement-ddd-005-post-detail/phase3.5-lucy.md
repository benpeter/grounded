# Lucy Review: DDD-005 Post Detail Implementation Plan

## Verdict: ADVISE

The plan is well-aligned with the original request and DDD-005 spec. Five tasks map cleanly to the stated requirements. No scope creep, no feature substitution, no gold-plating. Two items warrant attention before execution.

---

### Findings

#### 1. [DRIFT] CSS loading phase contradicts original request constraint

**CHANGE**: Task 2 loads `post-detail.css` in the eager phase (`await loadCSS()` before `body.appear`).

**Original request states**: "Three-phase loading: eager (detection + body class), lazy (CSS + header decoration), delayed (future syntax highlighting hook only)."

**Plan's rationale** (conflict resolution #4): "simpler, avoids FOUC."

**Assessment**: The rationale is sound -- eager CSS loading prevents a flash of unstyled content for the primary content surface. The original request's phase assignment was likely a rough sketch, and the plan explicitly documents the deviation with justification. However, the implementing agent should be aware this is a conscious override, not the original constraint. If the user cares about the phase boundary, this should be called out.

**Recommendation**: No action needed if the user approved "churn through it, all approvals given." The plan documents the rationale. Acceptable as-is.

#### 2. [CONVENTION] `// tva` placement in CSS file

**CHANGE**: Task 2 prompt says "Include `// tva` as a comment near the top" of `post-detail.css`. Task 3 prompt says "Add `/* tva */` as a comment near the top" of `quote.css`.

**Convention**: CSS files use `/* */` comments, not `//`. The `// tva` syntax is invalid CSS and will cause a stylelint error.

**Recommendation**: Task 2's prompt should use `/* tva */` (as Task 3 already does). The implementing agent may catch this at lint time, but the prompt should not introduce a known lint failure. Minor -- likely self-correcting.

---

### Traceability

| Requirement (from prompt) | Plan Task |
|---|---|
| Path-based detection, `body.post-detail` class | Task 2 (scripts.js) |
| Post header decoration (badge, sr-only, metadata) | Task 2 (scripts.js) |
| Scoped CSS overrides (headings, spacing, code, tables, hr, lists) | Task 2 (post-detail.css) |
| Quote block (standard + pull-quote) | Task 3 |
| Body links underlined by default | Task 2 (post-detail.css) |
| `tabindex="0"` on `<pre>` | Task 2 (scripts.js) |
| Code block `border-radius: 0` | Task 2 (post-detail.css) |
| All tokens resolve to existing values | Task 2 (verified in prompt) |
| `decorateButtons()` scoped out | Task 2 (CSS override approach) |
| Lighthouse a11y 100 | Task 5 (integration verification) |
| Local dev server renders test post | Task 4 (drafts) + Task 5 (verification) |
| No new tokens | Task 2 prompt explicitly states this |
| Structured data (JSON-LD) | Correctly excluded (listed as Out in prompt) |
| Series navigation | Correctly excluded (listed as Out in prompt) |
| Syntax highlighting | Correctly excluded (listed as Out in prompt) |

All stated requirements have corresponding plan tasks. No orphaned tasks. No unaddressed requirements.

### CLAUDE.md / AGENTS.md Compliance

- Vanilla JS, no frameworks, no build step: Compliant.
- `.js` extension in imports: Explicitly verified in Task 1 and Task 2 success criteria.
- `aem.js` never modified: Explicitly called out in all task "What NOT to do" sections.
- Design tokens from `tokens.css` only, no hardcoded hex: Compliant (DDD-005 token table verified, no new tokens).
- PR preview links: Not in scope of this plan (PR creation is a separate step). Acceptable.
- CSS selectors scoped to block: Quote block CSS is scoped to `.quote`. Post-detail CSS scoped to `body.post-detail`. Compliant.
- ESLint Airbnb rules, stylelint standard: Lint check in every task's success criteria. Compliant.
- EDS three-phase loading: See Finding #1. Documented deviation.
- `.hlxignore` excludes `*.md`: Draft HTML files are correctly `.html`. Compliant.

### Proportionality

Five tasks for a feature that touches scripts.js, a new CSS file, a new block (2 files), test content (2 draft pages), and documentation updates (2 files). The task count matches the file count. No inflation detected.

### Summary

The plan is a faithful implementation of DDD-005 with appropriate accessibility enhancements from Phase 2 review. The only actionable item is the CSS comment syntax in Task 2's `// tva` instruction -- change to `/* tva */` to avoid a lint error. The loading phase deviation is documented and justified. Proceed.
