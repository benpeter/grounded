You are reviewing a delegation plan before execution begins.
Your role: identify gaps, risks, or concerns from your domain.

## Delegation Plan
Read the full plan from: /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-lCokhB/ddd-001-global-layout/phase3-synthesis.md

## Your Review Focus
Convention adherence and intent alignment: Does the plan match the user's original intent? Does it follow the conventions established in CLAUDE.md and the project's existing patterns? Is there goal drift — does the plan try to do more or less than what was asked?

Also read:
- /Users/ben/github/benpeter/mostly-hallucinations/CLAUDE.md (project conventions)
- /Users/ben/github/benpeter/mostly-hallucinations/AGENTS.md (EDS conventions)
- /Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/README.md (DDD format template)

## Original User Request
Read the original user request from: /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-lCokhB/ddd-001-global-layout/prompt.md

## Instructions
Return exactly one verdict:

- APPROVE: No concerns from your domain.

- ADVISE: Return warnings using this format for each concern:
  - [governance]: <one-sentence description>
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

Write your verdict to: /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-lCokhB/ddd-001-global-layout/phase3.5-lucy.md
