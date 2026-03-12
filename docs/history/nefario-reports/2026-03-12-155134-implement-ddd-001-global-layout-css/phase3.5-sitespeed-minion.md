ADVISE

- [sitespeed]: tokens.css added as a separate render-blocking <link> in head.html adds one extra HTTP request to the critical rendering path before any paint can occur.
  SCOPE: head.html, Task 2
  CHANGE: The concern is real but the tradeoff is acceptable given the EDS and project context — see rationale below. No change required to the plan, but one annotation should be added to the AGENTS.md documentation in Task 5.
  WHY: tokens.css is small (the current file is ~107 lines, well under 5KB uncompressed; with Brotli compression at the edge it will be ~1-2KB). EDS serves all assets from the same origin with HTTP/2, so the extra request does not incur a new TCP connection or TLS handshake — it is multiplexed on the existing connection. The round-trip cost is the same connection latency for one additional HTTP/2 stream, which at edge CDN distances is sub-millisecond. This is not zero cost, but it is not meaningful against a Lighthouse 100 target on a text-only blog with no hero images. The alternative — inlining tokens.css into styles.css or into <style> in head.html — would eliminate the request but create maintenance friction (the plan deliberately separates tokens from layout rules as the single source of truth contract). The render-blocking risk is also mitigated by the fact that styles.css already blocks rendering; adding tokens.css before it means both stylesheets are fetched in parallel by the preload scanner, not sequentially. The net LCP impact is negligible.
  TASK: Task 2

- [sitespeed]: The plan does not include a `<link rel="preload">` for tokens.css, which means the browser discovers it during HTML parsing rather than speculatively fetching it earlier.
  SCOPE: head.html, Task 2
  CHANGE: This is advisory only — do not add a preload for tokens.css. On EDS, head.html is processed server-side and both stylesheet links are in the initial HTML response, so the preload scanner already discovers them at parse time. Adding `rel="preload"` for a stylesheet that is already a render-blocking <link> in the same document provides no benefit and adds unnecessary complexity.
  WHY: Preload is valuable for resources discovered late (fonts in CSS, hero images in markup). A <link rel="stylesheet"> in head.html is discovered as early as possible already. No action needed.
  TASK: Task 2

- [sitespeed]: Task 3's section layout CSS switches hardcoded pixel values (`max-width: 1200px`, `padding: 0 24px`, `padding: 0 32px`) to token references (`var(--layout-max)`, `var(--content-padding-mobile)`, etc.). This is correct and has no performance cost — CSS custom property resolution is done at computed-value time and does not affect rendering performance on modern engines.
  SCOPE: styles/styles.css, Task 3
  CHANGE: No change needed. This is a confirmation that the token-based approach is performance-neutral.
  WHY: CSS custom properties are resolved during style calculation, same phase as static values. No measurable impact on paint or layout timing.
  TASK: Task 3

- [sitespeed]: The plan's Task 5 creates `drafts/layout-test.html` but the success criterion for Lighthouse 100 (stated in the original prompt) is scoped to "local preview" with no explicit plan to run PageSpeed Insights against the feature branch preview URL before merging.
  SCOPE: Publishing process / PR gate
  CHANGE: AGENTS.md already documents running PageSpeed Insights against the feature preview URL as a required step before opening a PR. Task 6's verification suite does not include this step. The user should be reminded that a manual PageSpeed Insights run against the branch preview URL is the correct gate for the Lighthouse 100 criterion — the local dev server smoke test in Task 6 does not substitute for this.
  WHY: Lighthouse scores on localhost can diverge from production/preview due to local server behavior, missing edge compression, and network simulation differences. The Lighthouse 100 success criterion in the original prompt is only verifiable against the deployed preview environment. Task 6 appropriately defers "manual viewport verification" to a human reviewer — the same deferral should be explicit for the PageSpeed Insights check.
  TASK: Task 6

Summary: The two-stylesheet approach (tokens.css + styles.css) is acceptable for this site's performance profile. Both files are small, served from the same HTTP/2 origin, and discovered in parallel by the browser's preload scanner. The render-blocking concern the review prompt raises is real in theory but not material in practice given EDS edge delivery, HTTP/2 multiplexing, and the file sizes involved. No blocking issues identified.
