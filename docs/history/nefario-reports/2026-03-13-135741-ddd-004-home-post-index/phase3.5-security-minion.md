## Security Review: DDD-004 Home Post Index

### Verdict: ADVISE

The design is fundamentally sound. The attack surface is narrow: this is a read-only block rendering public CMS content. There is no user input, no authentication, and no server-side logic. The only meaningful risk is XSS via untrusted field values from `query-index.json` flowing into the DOM.

The plan makes one correct call — the CSS Approach section notes "DOM built via `document.createElement()` (not innerHTML) for CSP compliance." That note is in the right place, but it is advisory prose in a CSS section. It needs to be a binding constraint in the HTML Structure section, where implementation agents will look for DOM construction requirements.

---

- [security]: The `createElement()` over `innerHTML` requirement is stated once, in the CSS Approach section, as a parenthetical. It is not surfaced as a binding constraint where implementation agents will encounter it — the HTML Structure section.
  SCOPE: DDD-004-home-post-index.md, HTML Structure section
  CHANGE: Add a dedicated "DOM Construction" subsection (or callout) to the HTML Structure section. State explicitly: all fields from `query-index.json` (`title`, `description`, `date`, `tags`, `path`) must be assigned via `textContent`, `setAttribute`, or `href` — never via `innerHTML`, `outerHTML`, or `insertAdjacentHTML`. This is the canonical location an implementation agent reads for DOM requirements.
  WHY: `query-index.json` is populated from CMS author content. A single field containing `<script>` or `<img onerror=...>` assigned via `innerHTML` results in stored XSS. The existing note is easy to overlook. Making it a first-class constraint in the HTML Structure section ensures implementation agents see it before writing any code, not after styling is done.
  TASK: Task 1

- [security]: The tag slug is used directly as a URL path segment (`/tags/{tag}`) without any constraint on what characters are valid in that slug.
  SCOPE: DDD-004-home-post-index.md, HTML Structure section — tag link construction
  CHANGE: The DDD should specify that tag slugs must be validated against an allowlist pattern (lowercase alphanumeric + hyphens only, e.g. `/^[a-z0-9-]+$/`) before being used in `href` construction. A slug of `javascript:alert(1)` or `/../admin` is not a theoretical concern when the value comes from CMS-authored metadata. Document this as an implementation constraint alongside the `href="/tags/{tag}"` example.
  WHY: Tag slugs are the one field in this design where CMS content becomes a URL. If the slug passes through without validation, a crafted value can produce a `javascript:` protocol link (CWE-79) or a path traversal. The `href` is constructed in JS from `query-index.json` data — not from a controlled enum. Allowlist validation before `setAttribute('href', ...)` closes this entirely.
  TASK: Task 1

- [security]: The `datetime` attribute on `<time>` is populated from the `date` field in `query-index.json`. The DDD specifies the display format but does not specify what the raw value in the JSON looks like or how it is validated before use as an attribute value.
  SCOPE: DDD-004-home-post-index.md, HTML Structure section — `<time datetime="...">` construction
  CHANGE: The DDD should specify the expected raw date format from `query-index.json` (e.g., Unix timestamp integer, ISO 8601 string) and note that the implementation must validate this value before calling `setAttribute('datetime', ...)`. An invalid or unexpected value should produce an empty `<time>` element rather than injecting arbitrary content into an attribute.
  WHY: This is a lower-severity concern than the tag slug issue — `datetime` is a non-interactive attribute with no execution context — but an unexpected value (e.g., a string containing `"`) can break attribute quoting in certain edge cases and signals that the data contract between `helix-query.yaml` and the block is unspecified. Documenting expected format also helps the `helix-query.yaml` configuration Open Question (OQ 3).
  TASK: Task 1
