## Verdict: ADVISE

The plan is coherent and the design decisions are well-resolved. The scanning hierarchy (badge > title > description > metadata) serves the core user job — a returning reader assessing whether a new post is worth reading — correctly. Tag 404s, the empty state, and the heading architecture are all handled appropriately.

One concern within my domain:

---

- [ux-strategy]: The description field's authoring mechanism is unspecified, creating a risk that the most cognitively load-bearing element in the entry degrades silently.
  SCOPE: `docs/design-decisions/DDD-004-home-post-index.md` — Open Questions section and Context > EDS data source
  CHANGE: Add an Open Question explicitly asking: is `description` in `query-index.json` an auto-extracted field (populated from body text by EDS) or a metadata field explicitly authored by the post writer? If auto-extracted, document: (a) what EDS derives it from, (b) whether the author controls it, (c) whether a fallback or truncation rule is needed.
  WHY: The description is the second-heaviest element in the visual hierarchy and the primary signal for whether a reader opens a post. The spec says "1-2 sentences, never truncated" — but `query-index.json` auto-indexes page content and the extraction source determines whether that constraint is achievable. If description comes from uncontrolled body text, post entries could surface fragment sentences, mid-paragraph phrases, or empty strings. That degrades scannability for every reader on every visit. The DDD should lock down authoring ownership before implementation so the block code handles the field with correct assumptions. This is a design surface decision, not an implementation detail.
  TASK: Task 1 (Open Questions section of DDD-004)
