# Margo Review — DDD-005 Post Detail

## Verdict: ADVISE

The plan is proportionate to the task -- it produces a single design document with a single task and a single approval gate. No code, no services, no dependencies, no infrastructure. The scope is well-bounded.

Two concerns worth noting, neither blocking:

### 1. Over-specification of implementation details in a design document

The prompt prescribes exact CSS selectors (`.post-detail .default-content-wrapper h2`), exact `tabindex` attributes, exact `padding` values (`0.15em 0.3em`), and specific scoping strategies. A DDD should define the *what* (visual contract, spacing scale, semantic structure) and leave the *how* (selector strategy, DOM manipulation approach, scoping technique) to the implementing agent. Embedding implementation details in a design spec creates two sources of truth -- the DDD and the code -- which will drift.

**Simpler alternative**: The DDD should specify visual outcomes and constraints (e.g., "heading margins in post detail context must not affect global styles"). Implementation agents choose the selector strategy. This keeps the DDD as a single-purpose design contract.

### 2. Exhaustive spacing table risks false precision

Specifying 15+ element-to-element transitions to `0.05em` granularity (0.3em vs 0.35em for list items, resolved as a "conflict") is design gold-plating. At 18px body text, `0.05em` is less than 1px -- sub-pixel and invisible. The spacing table is valuable as a *scale* (small/medium/large gaps mapped to tokens), not as a pixel-perfect lookup table that implies every value was carefully calibrated.

**Simpler alternative**: Define 3-4 spacing tiers mapped to tokens (`--space-paragraph`, `--space-element`, `--space-section`) and assign elements to tiers. This communicates design intent without false precision that will be ignored during implementation.

---

Neither concern justifies blocking a design document. The plan is a single task producing a single `.md` file with no runtime complexity, no dependencies, and no infrastructure. The scope aligns with the request. The concerns above are about keeping the DDD maintainable and avoiding premature implementation decisions inside a design artifact.
