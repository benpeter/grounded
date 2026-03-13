# Phase 2: Software Docs — Documentation Plan for DDD-005

## Summary

DDD-005 introduces two cross-cutting patterns that future agents will rely on:

1. **Page-type detection** — `window.location.pathname.startsWith('/blog/')` adds `body.post-detail` in `scripts.js`. This is a new project-level convention, not block-scoped logic. Future DDDs for other page types (e.g., tag index, about) will replicate this pattern. If it is not documented, the next agent will either duplicate it inconsistently or invent a different mechanism.

2. **Quote block authoring model** — The DDD establishes that blockquotes require the EDS Quote block (table format in Google Docs). This is a non-obvious constraint: authors familiar with Markdown might try `> text` syntax, which EDS does not natively render. This author-facing constraint belongs in `docs/content-model.md`, not in code comments.

The DDD itself (`docs/design-decisions/DDD-005-post-detail.md`) is already the authoritative design record. The documentation work is: (a) add the page-type detection pattern to AGENTS.md so future agents follow the same convention, (b) add the blockquote authoring constraint to `docs/content-model.md`, and (c) mark DDD-005 as Implemented after the PR merges.

---

## Required Documentation Changes

### 1. AGENTS.md — Add Page-Type Detection Pattern

**Where**: Add a new subsection under `## Key Concepts`, after the existing `### Auto-Blocking` section.

**Why this belongs in AGENTS.md**: AGENTS.md is the agent's primary reference for project conventions. Page-type detection is not block-specific — it lives in `scripts.js` and drives CSS scoping across blocks and global styles. Any future surface that needs page-type-specific behavior (tag index, 404 overrides, etc.) will follow this same pattern. Without documentation, the next agent will either miss the pattern or discover it only by reading `scripts.js`.

**Content to add**:

```markdown
### Page-Type Detection

Pages requiring surface-specific behavior use a body class added during eager decoration in `scripts.js`. Detection is path-based.

Current page types:

| Body class | Detection condition | Surface |
|---|---|---|
| `post-detail` | `window.location.pathname.startsWith('/blog/')` | Individual post pages |

**How to add a new page type**:
1. Add a condition in the eager phase of `loadPage()` in `scripts.js`
2. Add the body class: `document.body.classList.add('your-page-type')`
3. Scope all page-type-specific CSS selectors with `body.your-page-type`
4. Document the new type in this table

**Coupling note**: Page-type detection is coupled to URL structure. If the URL pattern for a page type changes (e.g., `/blog/` moves to `/posts/`), the detection condition in `scripts.js` must be updated alongside the URL change.
```

---

### 2. docs/content-model.md — Add Blockquote Authoring Constraint

**Where**: In the content model documentation, in whatever section covers post body authoring or block usage. If the file has a section on inline content or body formatting, add there. If no such section exists, add a "Authoring Notes" or "Block Constraints" section.

**Why this belongs in docs/content-model.md**: This is an author-facing constraint. `docs/content-model.md` is referenced in `CLAUDE.md` as the canonical reference for content authoring. Agents writing content or creating test HTML need to know that `> text` Markdown blockquotes are not EDS-native and that blockquotes require the Quote block table format.

**Content to add** (adapt to fit the existing file structure):

```markdown
#### Blockquotes

Blockquotes are authored as the **Quote block** (a table in Google Docs with a single cell containing the quote text). Standard Markdown `> text` syntax is not natively supported in EDS authoring.

Two variants:
- **Standard blockquote**: Quote block without additional classes. Renders with a subtle left border.
- **Pull-quote**: Quote block with section metadata class `pull-quote`. Renders with gold accent border, editorial font, larger text. Pull-quote content must appear verbatim elsewhere in the post body (it is aria-hidden — screen readers skip it).

For static HTML test files, use the EDS-decorated structure directly:
```html
<div class="quote-wrapper">
  <div class="quote block">
    <blockquote><p>Quote text here.</p></blockquote>
  </div>
</div>
```
```

---

### 3. DDD-005-post-detail.md — Mark as Implemented After PR Merges

**Where**: Line 3 of `docs/design-decisions/DDD-005-post-detail.md` — status field.

**What**: Change `Status: **Approved**` to `Status: **Implemented**` after the implementing PR merges to main. Append an implementation note to the Reviewer Notes section:

> Implemented 2026-03-XX. Post detail reading experience shipped in branch `nefario/implement-ddd-005-post-detail`.

This follows the precedent set by DDD-001 (documented in `docs/history/nefario-reports/2026-03-12-155134-implement-ddd-001-global-layout-css/phase8-software-docs.md`).

**Timing**: Do not mark Implemented during implementation. Mark after the PR is merged to main.

---

## What Does NOT Need Documentation

- **CSS scoping strategy** (`body.post-detail`): The rationale is already in DDD-005, Section "CSS Approach". Code comments pointing to the DDD are sufficient.
- **Typography and spacing tables**: Already fully documented in DDD-005. Not duplicated in AGENTS.md or elsewhere.
- **Token usage**: Already documented in DDD-005 and authoritative in `styles/tokens.css`. No new tokens proposed.
- **Interaction patterns** (focus rings, link underlines): DDD-005 documents them. The patterns themselves are inherited from DDD-002/003/004 and already established.
- **Series metadata (parsed but not rendered)**: Tracked in GitHub issue #24. No documentation needed until that DDD is written.

---

## Sequencing

These changes should happen in this order:

1. **During implementation**: No documentation changes. Let the implementer focus on code.
2. **After implementation, before PR opens**: Add the AGENTS.md page-type detection section and the content-model.md blockquote constraint. These help reviewers understand the pattern.
3. **After PR merges to main**: Update DDD-005 status to Implemented.

The AGENTS.md and content-model.md changes can be included in the implementing PR. The DDD status update should be a separate docs-only commit after merge (or included at the end of the PR if the team prefers).

---

## Files to Change

| File | Change | When |
|---|---|---|
| `AGENTS.md` | Add "Page-Type Detection" subsection under Key Concepts | Before or during PR |
| `docs/content-model.md` | Add blockquote authoring constraint | Before or during PR |
| `docs/design-decisions/DDD-005-post-detail.md` | Status: Implemented + implementation note | After PR merges |
