# Margo Review: DDD-004 Home Post Index

VERDICT: APPROVE

## Summary

This implementation is proportional to the problem. The code is lean: one block JS file (~200 lines), one block CSS file (~100 lines), minimal changes to `scripts.js` (one auto-block function), and a declarative `helix-query.yaml`. No new dependencies, no unnecessary abstractions, no premature generalization.

Complexity budget: 0 new technologies, 0 new services, 0 new abstraction layers, 0 new dependencies. This is the ideal score for a feature addition.

## Findings

- [NIT] `blocks/post-index/post-index.js`:37 -- `parseDate` falls through to `new Date(value).getTime()` for ISO strings, but the `num > 0` check on line 33 means any numeric string (including year-like strings) would be treated as Unix timestamps. In practice this is fine because EDS returns either epoch seconds (large numbers) or ISO date strings (which `Number()` would parse as `NaN` or a year integer). The current logic works for EDS conventions but the `num > 0` guard is broader than intended -- a value like `"2026"` would be treated as Unix timestamp 2026 (Jan 1970). Low risk since EDS date fields are well-structured, but worth a comment.
  AGENT: implementing-agent
  FIX: No code change needed. Optionally add a comment: `// EDS returns epoch seconds (e.g. 1741910400) or ISO strings; small integers are not expected`

- [NIT] `blocks/post-index/post-index.css`:37-39 -- The comment about specificity ordering between title links and tag links is accurate but verbose for a 100-line file where the relationship is visually obvious. Not blocking -- just noting that the `stylelint-disable-next-line` comment on line 88 is the load-bearing annotation; the block comment above it is redundant.
  AGENT: implementing-agent
  FIX: Optional -- remove the block comment on lines 37-39 and 86-87, keeping only the stylelint disable comment on line 88.

- [NIT] `styles/styles.css`:213-223 -- `.sr-only` uses `clip-path: inset(50%)` which is the modern approach. The DDD-004 spec suggested `clip: rect(0, 0, 0, 0)` (the legacy version). The implementation is correct and arguably better -- `clip` is deprecated. Just noting the intentional deviation from spec. Good call.
  AGENT: implementing-agent
  FIX: None needed. Implementation is better than spec.

## What went right

1. **No scope creep.** The spec lists 7 V1 exclusions (pagination, featured posts, reading time, etc.) and none of them leaked into the implementation.
2. **Zero dependencies.** Vanilla DOM APIs, `Intl.DateTimeFormat`, `fetch`. No utility libraries, no templating.
3. **Flat structure.** One exported function (`decorate`), two private helpers (`parseDate`, `buildEntry`), one lookup table (`TYPE_LABELS`), one formatter (`DATE_FORMATTER`). No classes, no inheritance, no event emitters.
4. **Security validation present.** Path validation (`startsWith('/')`) and tag slug validation (`/^[a-z0-9-]+$/`) prevent injection via malicious index data. Proportional security for the threat model.
5. **CSS uses existing tokens exclusively.** No new tokens, no hardcoded colors. The two hardcoded values (`1px`, `0.05em`) are correctly identified as non-semantic.
6. **Auto-block injection is minimal.** `buildPostIndexBlock` is 5 lines with a clear pathname guard. No over-abstraction of the routing concern.
