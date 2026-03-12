You are reviewing a delegation plan before execution begins.
Your role: verify the plan matches user intent, enforces repo conventions,
and catches goal drift.

## Delegation Plan
Read the full plan from: /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-bZH1RI/implement-ddd-001-global-layout-css/phase3-synthesis.md

## Your Review Focus
Convention adherence, CLAUDE.md compliance, and intent drift: Does the plan
stay within the declared scope (In/Out from the issue)? Does it follow EDS
coding conventions from AGENTS.md (EDS three-phase loading, selector scoping,
mobile-first CSS, etc.)? Does any task silently exceed scope (e.g., touching
header/footer internals that are explicitly Out of scope)? Does the plan
honor the design token constraints from CLAUDE.md (no hardcoded hex values,
single source of truth in tokens.css)?

The working directory is /Users/ben/github/benpeter/mostly-hallucinations.
Read CLAUDE.md and AGENTS.md to check compliance.

## Original User Request
Read the original user request from: /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-bZH1RI/implement-ddd-001-global-layout-css/prompt.md

## Instructions
Return exactly one verdict:

- APPROVE: No concerns from your domain.

- ADVISE: Return warnings using this format for each concern:
  - [your-domain]: <one-sentence description>
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

Write your verdict to: /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-bZH1RI/implement-ddd-001-global-layout-css/phase3.5-lucy.md
