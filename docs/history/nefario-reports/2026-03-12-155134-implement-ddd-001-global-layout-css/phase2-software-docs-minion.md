# Domain Plan Contribution: software-docs-minion

## Recommendations

### 1. AGENTS.md: Yes, update -- but surgically

The token loading order (`tokens.css` before `styles.css` in `head.html`) is an architectural convention that future agents and contributors must honor. If someone reorders the `<link>` tags or tries to merge tokens back into `styles.css`, the custom property cascade breaks silently. This is exactly the kind of "why" that belongs in developer conventions.

However, the update should be minimal. AGENTS.md already has a "Project Structure" section that lists `styles/` contents. The right approach is:

- Add `tokens.css` to the existing `styles/` listing in the Project Structure tree (it is currently missing -- only `styles.css`, `lazy-styles.css`, and `fonts.css` are listed).
- Add a one-line annotation explaining the load order dependency, inline with the tree listing.
- Do NOT add a new section or lengthy explanation. The convention is simple; the documentation should match.

Proposed change to the Project Structure tree in AGENTS.md:

```
├── styles/          # Global styles and CSS
    ├── tokens.css          # Design tokens (loaded first — must precede styles.css in head.html)
    ├── styles.css          # Minimal global styling and layout for your website required for LCP
    ├── lazy-styles.css     # Additional global styling and layout for below the fold/post LCP content
    └── fonts.css           # Font definitions
```

That is sufficient. Any agent reading the project structure will see the dependency. No additional prose needed.

### 2. DDD-001: No implementation addendum needed

DDDs in this project serve as the **contract between design intent and implementation**, not as implementation journals. The DDD README makes this clear: DDDs are reviewed, approved, then consumed by implementation agents. They are not living documents that track implementation specifics.

Recording "we removed the Roboto @font-face fallback" or "we chose `min-width` over `width >=` for media queries" in DDD-001 would:

- Blur the line between spec and implementation log. The DDD says *what to build*; the code and commit history say *what was built*.
- Create a second source of truth that drifts from the actual CSS. The code is authoritative for implementation details.
- Set a precedent where every DDD accumulates post-implementation notes, making them harder to read as specs.

The right places for implementation details are:

- **Commit messages**: Document the Roboto removal, the media query syntax choice, the specific token values added. These are discoverable via `git log` and `git blame`.
- **Code comments**: If a CSS choice is non-obvious (e.g., why `min-width` rather than the `width >=` syntax that stylelint might prefer), a brief inline comment in `styles.css` is the right location.
- **The code itself**: Token values are self-documenting in `tokens.css`. The mapping table in DDD-001 already lists proposed vs. existing tokens; the implementation simply resolves the "proposed" ones into actual values.

One exception: if the implementation **deviates** from DDD-001 (e.g., a different `--layout-max` value, or a token that was proposed but not added), that deviation should be recorded as a Reviewer Note or a brief "Implementation Deviations" note at the bottom of DDD-001. But only deviations from spec, not confirmations of it.

### 3. Other documentation that needs updating

#### 3a. CLAUDE.md -- No changes needed

CLAUDE.md already correctly states that `styles/tokens.css` is the single source of truth for design tokens. The DDD-001 implementation does not change this contract; it fulfills it. No update required.

#### 3b. docs/site-structure.md -- No changes needed

Site structure describes layout intent (single-column, no sidebar, header/footer composition). DDD-001 implements that intent in CSS. The site-structure doc does not reference CSS files or token names, so it remains accurate.

#### 3c. docs/content-model.md -- No changes needed

Content model is orthogonal to layout CSS.

#### 3d. head.html -- this IS the implementation, not documentation

The `head.html` change (adding the `tokens.css` link before `styles.css`) is part of the implementation, not a documentation task. Mentioning it here for completeness: the implementing agent must add:

```html
<link rel="stylesheet" href="/styles/tokens.css"/>
```

before the existing `<link rel="stylesheet" href="/styles/styles.css"/>` line. This is already specified in DDD-001 section "CSS Approach > 1. Token loading."

#### 3e. tokens.css file header comment -- Minor update

The current `tokens.css` header comment says:

```css
/* Import this at the top of styles.css: @import url('tokens.css'); */
```

After the implementation, tokens.css is loaded as a separate `<link>` in `head.html`, not via `@import`. This comment becomes misleading. The implementing agent should update the comment to reflect the actual loading mechanism:

```css
/* Loaded via <link> in head.html before styles.css. */
```

This is a one-line change but prevents future confusion about the loading mechanism.

## Proposed Tasks

These are documentation tasks to be executed as part of the implementation PR (not as separate PRs):

1. **Update AGENTS.md Project Structure tree**: Add `tokens.css` to the `styles/` listing with the load-order annotation. (~2 lines changed)

2. **Update tokens.css file header comment**: Replace the `@import` instruction with accurate `<link>` loading description. (~1 line changed)

3. **Write descriptive commit messages**: The commit(s) that implement DDD-001 should document key implementation choices in their messages -- specifically the boilerplate variable replacement, the Roboto fallback removal, and any deviations from the DDD spec. This is not a file change but a process requirement for the implementing agent.

4. **Record deviations only**: If the implementing agent makes any choice that contradicts DDD-001 (different token values, omitted tokens, changed selectors), add a brief note to DDD-001 under Reviewer Notes. If implementation matches spec exactly, no DDD update is needed.

## Risks and Concerns

### Risk: Silent cascade failure from load order

If a future contributor or agent reorders the `<link>` tags in `head.html` (putting `styles.css` before `tokens.css`), custom properties used in `styles.css` will resolve to their `initial` values. The page will render with broken layout -- no max-width, no padding, wrong colors. This failure is silent (no console errors) and visually dramatic.

**Mitigation**: The AGENTS.md annotation (proposed above) makes the dependency visible. A code comment in `head.html` would also help but EDS head.html files tend to be minimal and comment-free; the AGENTS.md note is the primary defense.

### Risk: Boilerplate variable name collision

DDD-001 specifies removing boilerplate variables (`--background-color`, `--text-color`, etc.) from `styles.css` and replacing all references with project tokens. If the removal is incomplete -- if any `var(--background-color)` reference survives in `styles.css` or in a block CSS file -- the property resolves to its initial value (transparent for background-color, black for color). The implementing agent must do a project-wide search for boilerplate variable names after replacement.

**Documentation implication**: None directly, but the commit message should explicitly state that all boilerplate variable references were replaced, so reviewers know to verify this.

### Risk: DDD format precedent

If DDD-001 gets an implementation addendum, every subsequent DDD implementation will be expected to produce one. This adds overhead without proportional value -- the code and git history already capture implementation details more accurately. Keeping DDDs as clean specs preserves their usefulness as contracts.

## Additional Agents Needed

No additional agents are needed for the documentation aspects of this task. The implementing agent (likely a frontend/CSS agent) should handle the AGENTS.md tree update and the tokens.css comment update as part of the same PR -- these are small, mechanical changes that belong with the code, not in a separate documentation PR.

If the implementing agent encounters a deviation from DDD-001 that requires a design judgment (e.g., the focus ring contrast issue noted in Open Question #5), that decision should be escalated to the human reviewer rather than resolved by a documentation agent.
