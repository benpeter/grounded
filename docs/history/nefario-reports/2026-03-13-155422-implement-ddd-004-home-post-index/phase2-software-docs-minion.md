# Domain Plan Contribution: software-docs-minion

## Recommendations

### 1. `docs/content-model.md` needs a query index section

The content model document defines post metadata fields (title, description, date, type, tags) but says nothing about how that metadata is exposed to the frontend. With `helix-query.yaml` entering the project, the content model now has a concrete data pipeline: author writes metadata -> EDS indexes it -> `query-index.json` serves it -> blocks consume it. The content model doc should document this pipeline, specifically:

- That `helix-query.yaml` at project root controls which fields are indexed
- That `query-index.json` is the JSON endpoint blocks fetch client-side
- Which fields are indexed (the six columns: path, title, description, date, type, tags)
- The include path (`/blog/**`) that scopes which pages are indexed

This is "why" documentation, not "what" -- it explains the contract between content authoring and frontend rendering. Without it, a future developer adding a new metadata field (e.g., `series`) won't know they also need to update `helix-query.yaml` to make it available to blocks.

### 2. `docs/site-structure.md` does NOT need changes

The site structure doc describes pages, URLs, and layout at a conceptual level. It already says the home page is the post index with reverse-chronological posts. The query index is an implementation mechanism, not a site structure concern. Adding `helix-query.yaml` details to site-structure.md would mix abstraction levels.

### 3. `helix-query.yaml` itself should have an inline comment

EDS configuration files are not self-documenting. A brief YAML comment block at the top of `helix-query.yaml` explaining what the file does and linking to the content model doc is sufficient. This is the lightest-weight documentation that works -- the file is small, the comment is right where someone will see it.

### 4. No EDS-specific documentation conventions exist for query index configuration

EDS does not prescribe a documentation format for `helix-query.yaml`. The AEM boilerplate includes it as a bare configuration file. Our project's existing pattern -- design decisions in `docs/design-decisions/`, content contracts in `docs/content-model.md` -- is the right place. No new documentation structure is needed.

### 5. DDD-004 status update after implementation

Following the precedent set by DDD-001 (where status was changed from "Approved" to "Implemented" and an implementation note was appended), DDD-004 should receive the same treatment after the block ships. This is a post-implementation task, not a pre-implementation one.

## Proposed Tasks

### Task 1: Add query index section to `docs/content-model.md`

**What to do:** Add a new section titled "Query Index" (or "Content Index") after the "Structured Data" section in `docs/content-model.md`. Document:
- `helix-query.yaml` as the configuration source
- Include path: `/blog/**`
- Indexed columns: `path`, `title`, `description`, `date`, `type`, `tags`
- Endpoint: `/query-index.json`
- Note that adding new metadata fields to the content model requires a corresponding update to `helix-query.yaml`

**Deliverable:** Updated `docs/content-model.md` with query index section.

**Dependencies:** Must happen alongside or after `helix-query.yaml` is created, so the documentation matches the actual configuration. Can be done in the same PR as the implementation.

### Task 2: Add inline comment to `helix-query.yaml`

**What to do:** Include a YAML comment block at the top of `helix-query.yaml` with:
- One-line purpose statement
- Reference to `docs/content-model.md` for the full content model
- Reference to DDD-004 for the design rationale

**Deliverable:** `helix-query.yaml` with header comment.

**Dependencies:** This is part of creating `helix-query.yaml` itself -- the implementing agent should include the comment when creating the file.

### Task 3: Update DDD-004 status (post-implementation)

**What to do:** After the block is implemented and merged:
- Change status from `**Proposal**` to `**Implemented**`
- Add implementation note to Reviewer Notes with date and branch name
- Resolve any Open Questions that were decided during implementation (record the decisions inline)

**Deliverable:** Updated `docs/design-decisions/DDD-004-home-post-index.md`.

**Dependencies:** Must happen after implementation is complete and merged. Same pattern as DDD-001.

## Risks and Concerns

### Open Question 7 (description provenance) has documentation implications

If the `description` field is auto-extracted by EDS rather than explicitly authored, this is a content authoring constraint that must be documented in `docs/content-model.md`. The content model currently says description is "required" -- but "required to be authored" and "auto-extracted from first paragraph" are very different contracts. The implementing agent should resolve OQ-7 and the docs update should reflect the answer.

### `helix-query.yaml` changes require reindexing awareness

When someone changes `helix-query.yaml` in the future (adding columns, changing include paths), they need to know that EDS reindexing is not instant. This operational detail is worth a one-line note in the content model doc: "Changes to `helix-query.yaml` take effect after EDS reindexes content."

### Tag link 404s (Open Question 3) should be noted

DDD-004 accepts that `/tags/{slug}` links will 404 until DDD-007 ships. This is fine as an implementation decision, but `docs/site-structure.md` already lists `/tags/{tag}` as a page type. A reader of site-structure.md might expect those pages to exist. No change needed now, but whoever implements DDD-007 should be aware of this gap.

## Additional Agents Needed

None. The documentation updates are straightforward edits to existing files. The implementing agent (frontend-minion or equivalent) can include the `helix-query.yaml` comment and the content-model.md update in the same PR as the implementation. The DDD-004 status update is a post-merge task that follows established precedent.
