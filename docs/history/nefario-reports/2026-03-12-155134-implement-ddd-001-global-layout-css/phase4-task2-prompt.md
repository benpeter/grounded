You are working in the project at `/Users/ben/github/benpeter/mostly-hallucinations`.

## Task

Add a `<link>` for `tokens.css` to `head.html`, before the existing `styles.css` link. Also add `style-src 'self'` to the existing Content-Security-Policy meta tag.

## Context

DDD-001 specifies that `tokens.css` loads as a separate stylesheet in `head.html` before `styles.css`. This ensures CSS custom properties defined in `tokens.css` resolve before any layout rules in `styles.css` evaluate. The order is critical — if `styles.css` loads first, `var()` references to tokens resolve to `initial` values and layout breaks silently.

The CSP update adds `style-src 'self'` to prevent injected CSS (CSS attribute-selector exfiltration is a known exploited technique). Both stylesheets are same-origin, so this adds no friction.

## Edit 1: Add tokens.css link

Insert one line before `<link rel="stylesheet" href="/styles/styles.css"/>`:

```html
<link rel="stylesheet" href="/styles/tokens.css"/>
```

The final file should have this order:
1. CSP meta tag (updated — see Edit 2)
2. Viewport meta tag
3. aem.js script
4. scripts.js script
5. **tokens.css link (NEW)**
6. styles.css link

## Edit 2: Add style-src to CSP

Find the existing CSP meta tag:
```html
<meta
  http-equiv="Content-Security-Policy"
  content="script-src 'nonce-aem' 'strict-dynamic' 'unsafe-inline' http: https:; base-uri 'self'; object-src 'none';"
  move-to-http-header="true"
>
```

Add `style-src 'self';` to the content attribute. The updated content attribute value should be:
```
script-src 'nonce-aem' 'strict-dynamic' 'unsafe-inline' http: https:; style-src 'self'; base-uri 'self'; object-src 'none';
```

## Verification

1. `grep 'tokens.css' head.html` returns the `<link>` tag
2. `grep -n 'stylesheet' head.html` shows tokens.css line number is lower than styles.css line number
3. `grep 'style-src' head.html` returns the updated CSP meta tag

## When done

Mark Task #2 completed with TaskUpdate. Then send a message to team-lead with:
- File paths changed with line counts
- 1-2 sentence summary of what was produced

## Boundaries

- Only edit `head.html`
- Do NOT add any other links, scripts, or meta tags beyond what is specified
- Do NOT modify the existing styles.css link
