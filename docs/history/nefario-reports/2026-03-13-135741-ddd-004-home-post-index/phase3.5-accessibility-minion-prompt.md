You are reviewing a delegation plan before execution begins.
Your role: identify gaps, risks, or concerns from your domain.

## Delegation Plan
Read the full plan from: /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T/nefario-scratch-uCqtZX/ddd-004-home-post-index/phase3-synthesis.md

## Your Review Focus
Accessibility gaps in the proposed design for the home page post index. Specifically:
1. Is the ARIA dual-pattern for type badges correct (visible badge aria-hidden="true" + sr-only prefix in h2)?
2. Is the heading hierarchy sound (visually hidden h1, h2 for post titles)?
3. Is the tag list markup (<ul aria-label="Tags"> with <li><a>) appropriate?
4. Does the <time datetime> usage follow best practices?
5. Are there any WCAG 2.2 AA concerns with the proposed color contrast (--color-text-muted at 4.89:1)?
6. Are there keyboard navigation or focus management concerns for the post list?

## Original User Request
Read the original user request from: /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T/nefario-scratch-uCqtZX/ddd-004-home-post-index/prompt.md

## Instructions
Return exactly one verdict:

- APPROVE: No concerns from your domain.

- ADVISE: Return warnings using this format for each concern:
  - [accessibility]: <one-sentence description>
    SCOPE: <file, component, or concept affected>
    CHANGE: <what should change, in domain terms>
    WHY: <risk or rationale, self-contained>
    TASK: <task number affected>

- BLOCK: Return using this format:
  SCOPE: <file, component, or concept affected>
  ISSUE: <description of the blocking concern>
  RISK: <what happens if this is not addressed>
  SUGGESTION: <how the plan could be revised>

Be concise. Only flag issues within your domain expertise.

Write your verdict to: /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T/nefario-scratch-uCqtZX/ddd-004-home-post-index/phase3.5-accessibility-minion.md
