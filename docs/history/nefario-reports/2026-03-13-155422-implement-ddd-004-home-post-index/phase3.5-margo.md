# Margo Review: DDD-004 Home Post Index

## Verdict: ADVISE

The plan is proportional to the problem. Four tasks for a block, its data source, auto-block wiring, and docs -- that maps cleanly to the request. No unnecessary abstractions, no extra dependencies, no framework introductions. The implementation stays vanilla JS/CSS per project conventions. Good.

Two non-blocking concerns:

### 1. Task decomposition creates unnecessary serialization

Tasks 1, 2, and 3 are chained sequentially (1 -> 2 -> 3). Task 1 creates `helix-query.yaml` and the `.sr-only` class. Task 2 creates the block. Task 3 wires the auto-block and creates test content.

The block JS/CSS in Task 2 does not depend on `helix-query.yaml` existing at write time -- it fetches `/query-index.json` at runtime. The `.sr-only` class is referenced in Task 2's CSS/JS but Task 2 only creates the block files, it does not run them. The real dependency is runtime, not build-time.

Tasks 1 and 2 could run in parallel. Task 3 genuinely depends on Task 2 (it modifies `scripts.js` to call the block). This is minor -- it affects execution speed, not correctness or complexity.

### 2. Date parsing handles a format (Excel serial numbers) that EDS does not produce in this context

The `parseDate()` function in Task 2 handles Unix timestamps, ISO strings, and implicitly Excel serial numbers via the `num > 0` branch (any positive number gets treated as seconds-since-epoch). The comment says "EDS convention" for Unix timestamps, which is correct. But the function cannot distinguish between a Unix timestamp and an Excel serial number -- both are positive numbers. This is not a bug today (EDS `query-index.json` returns Unix timestamps in seconds), but the code comment suggesting it handles serial numbers is misleading. The function is fine as-is; the comment in the prompt overstates its robustness. Not worth adding complexity to actually handle serial numbers -- YAGNI.

### What looks right

- No pagination, filtering, search, or other V1 exclusions. Scope discipline is solid.
- No external dependencies added.
- DOM construction via `createElement`/`textContent` -- no innerHTML, no templating library.
- Tag slug validation is a reasonable security boundary for href construction.
- `.sr-only` in eager stylesheet is the right call -- near-zero cost, avoids timing issues.
- Auto-block pattern follows existing `buildHeroBlock` convention exactly.
- Empty state is just "render nothing beyond the sr-only h1" -- simplest possible approach.
- Test content in `drafts/` is lightweight and gitignored.

No unnecessary abstractions, no dependency additions, no over-engineering detected. The plan builds exactly what was asked for.
