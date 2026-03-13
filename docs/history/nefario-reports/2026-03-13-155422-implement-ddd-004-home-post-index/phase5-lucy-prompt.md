You are reviewing code produced during an orchestrated execution.

## Changed Files
- `/Users/ben/github/benpeter/mostly-hallucinations/helix-query.yaml` (new)
- `/Users/ben/github/benpeter/mostly-hallucinations/blocks/post-index/post-index.css` (new)
- `/Users/ben/github/benpeter/mostly-hallucinations/blocks/post-index/post-index.js` (new)
- `/Users/ben/github/benpeter/mostly-hallucinations/scripts/scripts.js` (modified)
- `/Users/ben/github/benpeter/mostly-hallucinations/styles/styles.css` (modified)
- `/Users/ben/github/benpeter/mostly-hallucinations/.gitignore` (modified)

## Execution Context
Design spec: `/Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-004-home-post-index.md`
Project rules: `/Users/ben/github/benpeter/mostly-hallucinations/CLAUDE.md` and `/Users/ben/github/benpeter/mostly-hallucinations/AGENTS.md`

## Your Review Focus
Convention adherence, CLAUDE.md compliance, intent drift. Verify:
- Design tokens from tokens.css (no hardcoded hex values)
- No frameworks used
- Semantic HTML with proper heading hierarchy
- WCAG 2.2 AA compliance patterns
- CSS scoped to block (`.post-index ...`)
- ESLint/Stylelint rules followed

## Instructions
Review the actual code files listed above. Return verdict:

VERDICT: APPROVE | ADVISE | BLOCK
FINDINGS:
- [BLOCK|ADVISE|NIT] <file>:<line-range> -- <description>
  AGENT: <producing-agent>
  FIX: <specific fix>

Write findings to: /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-d3ZWda/implement-ddd-004-home-post-index/phase5-lucy.md
