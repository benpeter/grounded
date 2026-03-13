You are contributing to the PLANNING phase of a multi-agent project.
You are NOT executing yet — you are providing your domain expertise
to help build a comprehensive plan.

## Project Task

A Design Decision Document (DDD-003-footer.md) exists at docs/design-decisions/ that defines the footer as a single understated line — copyright, LinkedIn link, Legal Notice, Privacy Policy separated by middots — so that the existing footer block at blocks/footer/ can be redesigned to match the brand's minimal aesthetic.

Footer content is exactly: © 2026 Ben Peter · LinkedIn · Legal Notice · Privacy Policy

## Your Planning Question

The footer has copyright, a social link (LinkedIn), and two legal links. From a user journey perspective:

(a) Is middot-separated single-line the right hierarchy? Should copyright be visually distinct from links?

(b) The site has zero navigation in the header — does the footer carry wayfinding burden? Is it purely legal/attribution?

(c) Should "Ben Peter" be a link (to LinkedIn or an about page), or should only "LinkedIn" link out? The site-structure.md says both are separate text links — validate whether this creates confusion (two links that go to the same destination?).

(d) German law requires Impressum/Privacy links — should these be visually subordinated to the brand content, or treated as equal-weight items in the line?

## Context

Read these files for context:
- /Users/ben/github/benpeter/mostly-hallucinations/docs/site-structure.md (footer spec)
- /Users/ben/github/benpeter/mostly-hallucinations/CLAUDE.md (project design rules, aesthetic rules)
- /Users/ben/github/benpeter/mostly-hallucinations/docs/design-decisions/DDD-002-header.md (interaction states, zero-nav header)
- /Users/ben/github/benpeter/mostly-hallucinations/styles/tokens.css (design tokens)

Key aesthetic rules from CLAUDE.md:
- No cards with shadows, no gradients, no rounded containers, no hero images, no decorative icons
- Typography creates hierarchy, not color blocks or boxes
- --color-accent (gold) appears at most once per screen
- Green and gold are NOT co-equal theme colors. This is a warm-white site where color is a quiet guest.

Site structure footer spec: "© 2026 Ben Peter · LinkedIn · Legal Notice · Privacy Policy"
- "Ben Peter" and "LinkedIn" are separate text links
- LinkedIn sits next to the author's name as the single social link
- No icons
- Legal Notice and Privacy Policy are required (German law: DDG §5, DSGVO)
- No bio. No headshot. No "about the author" section.

## Instructions
1. Read relevant files to understand the current state
2. Apply your domain expertise to the planning question
3. Identify risks, dependencies, and requirements from your perspective
4. If you believe additional specialists should be involved that aren't already part of the planning, say so and explain why
5. Return your contribution in this format:

## Domain Plan Contribution: ux-strategy-minion

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

6. Write your complete contribution to /var/folders/3k/bfjvvz9s6dvdn_hvlhvr8lc00000gn/T//nefario-scratch-4bW4Uj/ddd-003-propose-footer/phase2-ux-strategy-minion.md
