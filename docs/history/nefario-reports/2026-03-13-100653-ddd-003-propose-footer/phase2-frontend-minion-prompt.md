You are contributing to the PLANNING phase of a multi-agent project.
You are NOT executing yet — you are providing your domain expertise
to help build a comprehensive plan.

## Project Task

A Design Decision Document (DDD-003-footer.md) exists at docs/design-decisions/ that defines the footer as a single understated line — copyright, LinkedIn link, Legal Notice, Privacy Policy separated by middots — so that the existing footer block at blocks/footer/ can be redesigned to match the brand's minimal aesthetic.

Footer content is exactly: © 2026 Ben Peter · LinkedIn · Legal Notice · Privacy Policy

## Your Planning Question

Given the current footer block implementation (`blocks/footer/footer.js` loads a `/footer` fragment, clears `block.textContent`, and appends fragment children into a wrapping `<div>`), what is the correct semantic HTML structure for a single-line footer in EDS? Specifically:

(a) What does the authored `/footer` fragment markup look like for a line of `© 2026 Ben Peter · LinkedIn · Legal Notice · Privacy Policy` — is this a single `<p>` with inline links, or multiple `<p>` elements?

(b) Does the current `decorate()` function need changes, or can the CSS alone reshape the fragment output into the target single-line treatment?

(c) How should the `footer > .footer > div` selector chain work with the fragment's DOM to target individual elements (copyright text, links, separators)?

Reference `blocks/footer/footer.js`, the boilerplate fragment loading pattern, and DDD-001's width model (`--layout-max`, `--content-padding-*` tokens).

## Context

Read these files for context:
- /Users/ben/github/benpeter/mostly-hallucinations/blocks/footer/footer.js (current implementation)
- /Users/ben/github/benpeter/mostly-hallucinations/blocks/footer/footer.css (current styles)
- /Users/ben/github/benpeter/mostly-hallucinations/blocks/header/header.js (DDD-002 implementation as reference for how a simple EDS block decorates)
- /Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-002-header.md (precedent for HTML Structure section)
- /Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-001-global-layout.md (layout contract)
- /Users/ben/github/benpeter/mostly-hallucinations/AGENTS.md (EDS block conventions)

## Instructions
1. Read relevant files to understand the current state
2. Apply your domain expertise to the planning question
3. Identify risks, dependencies, and requirements from your perspective
4. If you believe additional specialists should be involved that aren't already part of the planning, say so and explain why
5. Return your contribution in this format:

## Domain Plan Contribution: frontend-minion

### Recommendations
<your expert recommendations for this aspect of the task>

### Proposed Tasks
<specific tasks that should be in the execution plan>
For each task: what to do, deliverables, dependencies

### Risks and Concerns
<things that could go wrong from your domain perspective>

### Additional Agents Needed
<any specialists not yet involved who should be, and why>
(or "None" if the current team is sufficient)

6. Write your complete contribution to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-4bW4Uj/ddd-003-propose-footer/phase2-frontend-minion.md
