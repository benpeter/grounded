ADVISE

- [accessibility]: Test HTML in Task 5 lacks document shell with `lang` attribute
  SCOPE: `drafts/layout-test.html` — the HTML snippet in the Task 5 prompt begins at `<body>` with no `<!DOCTYPE html>`, `<html lang="en">`, `<head>`, or `<title>` element.
  CHANGE: Wrap the content in a minimal document shell: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Layout Test</title></head><body>...</body></html>`. The `lang` attribute on `<html>` is mandatory for WCAG 2.2 SC 3.1.1 (Language of Page, Level A). The `<title>` element is mandatory for WCAG 2.2 SC 2.4.2 (Page Titled, Level A).
  WHY: The EDS dev server may inject a document shell at runtime, but the file itself would be non-conformant HTML and could mislead future contributors about correct markup. Test content that models incorrect structure propagates bad patterns. Both 3.1.1 and 2.4.2 are Level A — the lowest bar for conformance.
  TASK: Task 5

No other accessibility concerns identified. The two-tier width model is CSS-only and does not alter DOM reading order. Prohibiting `overflow: hidden` on `.default-content-wrapper` eliminates the focus trap risk explicitly. Responsive padding uses fluid values with no fixed breakpoint jumps that would affect touch targets. No color values are introduced or changed. WCAG 1.4.10 Reflow and 1.4.4 Resize Text are not impacted by this layout geometry.
