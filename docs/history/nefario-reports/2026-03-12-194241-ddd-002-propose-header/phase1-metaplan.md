# Meta-Plan: DDD-002 Header Design Decision Document

## Planning Consultations

### Consultation 1: Header UX Strategy

- **Agent**: ux-strategy-minion
- **Planning question**: The header for Mostly Hallucinations is deliberately minimal -- logo + tagline, no navigation. Given this constraint, what is the header's job in the user journey? Specifically: (1) How should the corrupted-letterform concept on "Hallucinations" balance brand expression against cognitive load -- at what point does visual disruption become friction? (2) The header links home and nothing else. What mental model should the user form from this header on first visit vs. repeat visits? (3) The tagline "Generated, meet grounded." is doing heavy thematic lifting. Should it be visually prominent or recessive, and how does this change on mobile where vertical space is precious?
- **Context to provide**:
  - Brand Identity doc (`~/Documents/Ben 2025/5 - Blog/Meta/Brand/Brand Identity.md`) -- Logo Concept section describes the corrupted letterform treatment, voice guidelines establish the practitioner tone
  - Site structure (`docs/site-structure.md`) -- header spec: "Logo text + tagline. No navigation links. The header links home and that's it."
  - DDD-001 Global Layout (approved) -- confirms header uses `--layout-max` (1200px) width, not `--measure`; `--nav-height` is 80px
  - Design tokens (`styles/tokens.css`) -- `--color-heading` (#3F5232), `--color-text-muted` (#817B6F), `--font-heading` (Source Code Pro)
  - CLAUDE.md aesthetic rules -- green and gold are quiet guests, typography creates hierarchy
- **Why this agent**: UX strategy must evaluate whether the corrupted-letterform concept serves the user or just the brand. The header is the first thing every visitor sees -- the strategy must ensure it communicates "practitioner's blog about grounded knowledge" within seconds, and that the hallucination effect enhances rather than undermines that signal. ux-strategy also arbitrates the tension between the tagline's importance (it's the thesis statement) and the minimalist aesthetic (visual quietness).

### Consultation 2: Header Visual Design & Corrupted Letterform Treatment

- **Agent**: ux-design-minion
- **Planning question**: The Brand Identity calls for "Hallucinations" to have "subtly corrupted letterforms -- strokes that don't close, counters that drift, serifs appearing where they shouldn't on a monospaced face." This needs to be translated into a concrete visual specification implementable in CSS and/or inline SVG. Specifically: (1) Which specific letters in "Hallucinations" should carry corrupted details, and what type of corruption for each? The DDD needs enough specificity that an implementation agent can build it without further design input. (2) Should the effect be static (baked into an SVG) or dynamic (CSS transforms on individual letter spans)? What are the tradeoffs for performance, accessibility, and maintainability? (3) How does the corruption scale across breakpoints -- does it simplify on mobile where fine details collapse? (4) Propose the responsive layout: how do "Mostly", "Hallucinations", and the tagline arrange at mobile vs. desktop? Stacked? Inline?
- **Context to provide**:
  - Brand Identity doc -- Logo Concept section (the full corrupted letterform description)
  - Design tokens -- `--font-heading` (Source Code Pro), `--color-heading` (#3F5232), `--heading-font-size-xxl` (48px), `--heading-font-size-xl` (36px), `--nav-height` (80px)
  - DDD-001 -- header sits within `--layout-max` (1200px), padding follows `--content-padding-*` tokens
  - CLAUDE.md -- "No cards with shadows, no gradients, no rounded containers, no hero images, no decorative icons"
  - Site structure -- "Logo: 'Mostly Hallucinations' in Source Code Pro, --color-heading"
  - EDS performance constraints -- <100KB per page, Lighthouse 100 target, no external dependencies beyond Google Fonts
- **Why this agent**: The corrupted letterform concept is the most design-intensive element in the entire site. It requires specific visual decisions about which letters get which treatment, and those decisions need to be documented at implementation-ready specificity. ux-design-minion must also solve the responsive layout problem (how the logo + tagline arrange across breakpoints within the 80px nav height) and ensure the visual treatment is feasible in CSS/SVG without exceeding performance budgets.

### Consultation 3: Header Block Implementation Feasibility

- **Agent**: frontend-minion
- **Planning question**: The existing `blocks/header/` is the full AEM boilerplate header (hamburger, nav-sections, nav-tools, fragment loading). It will be drastically simplified to logo + tagline only. Given EDS block conventions: (1) What should the target HTML structure look like after decoration? The current `decorate()` loads a nav fragment and creates brand/sections/tools areas -- the new version needs none of this. Should the simplified header still load a fragment, or should it read content directly from the block's initial markup? (2) What is the semantic HTML for the logo link (wrapping "Mostly Hallucinations" + tagline) that links home? How does the corrupted-letterform treatment integrate -- is it `<span>` elements within the heading, an inline SVG replacing text, or something else? (3) What CSS approach handles the layout (logo + tagline within `--layout-max`, vertically centered in `--nav-height`)? Flexbox or grid? (4) Are there EDS-specific gotchas with fixed vs. relative header positioning that the DDD should address? The boilerplate CSS has `position: fixed` on mobile but `position: relative` at 900px+.
- **Context to provide**:
  - `blocks/header/header.js` -- full current boilerplate code showing fragment loading, nav decoration, hamburger creation
  - `blocks/header/header.css` -- full current CSS showing grid layout, hamburger styles, nav-sections, nav-tools
  - DDD-001 HTML Structure section -- shows the `<header>` element and its relationship to `main`
  - DDD-001 CSS Approach -- `--nav-height` reservation, token loading order
  - `scripts/aem.js` -- EDS core library (never modify), provides `getMetadata`
  - `scripts/scripts.js` -- page decoration pipeline, `loadPage` phases (eager/lazy/delayed)
  - AGENTS.md -- block conventions, three-phase loading, CSS scoping rules
  - Design tokens -- `--nav-height` (80px), `--layout-max` (1200px), `--content-padding-*` tokens
- **Why this agent**: frontend-minion knows EDS block conventions and can assess whether design proposals are feasible within the platform's constraints. The DDD must document an HTML Structure that an implementation agent can build -- that requires knowing how EDS block decoration works, what the fragment loading pattern implies, and how the header's CSS interacts with DDD-001's global layout contract. Frontend also needs to flag any performance implications of the corrupted-letterform approach (inline SVG size, number of DOM elements for span-based effects, impact on CLS/LCP).

### Cross-Cutting Checklist

- **Testing**: Exclude from planning. DDD-002 is a design specification document, not executable code. No tests to write or strategy to plan. Test considerations (visual regression, accessibility testing) will be relevant at implementation time but are out of scope for the DDD.
- **Security**: Exclude from planning. The header is a static UI element with a single home link. No user input, no auth, no dynamic content. No attack surface created by this design document.
- **Usability -- Strategy**: INCLUDED as Consultation 1. Planning question: How should the corrupted-letterform concept balance brand expression against cognitive load? What role does the header play in user journey comprehension on first vs. repeat visits?
- **Usability -- Design**: INCLUDED as Consultation 2. Planning question: What specific letterform corruptions should be applied to which letters, and how does the treatment translate to implementable CSS/SVG?
- **Documentation**: Exclude from planning. The DDD itself IS the documentation artifact -- it follows an established template (docs/design-decisions/README.md). No additional documentation strategy is needed for a design proposal.
- **Observability**: Exclude from planning. No runtime components, no services, no APIs. The DDD describes a static header design.

### Anticipated Approval Gates

1. **DDD-002-header.md content** (MUST gate): The complete DDD is the sole deliverable. It defines the visual identity's most distinctive element (corrupted letterforms) and the header's HTML structure, both of which constrain all downstream implementation work. Hard to reverse once implemented, and DDD-003 (footer) will reference its layout patterns. This gate presents the full DDD for human review following the DDD format's built-in Decision section (Approved / Approved with changes / Rejected).

### Rationale

This task produces a design specification, not code. The three specialists cover complementary angles:

- **ux-strategy-minion** evaluates whether the design serves the user's comprehension and the site's communication goals -- the "should we" layer.
- **ux-design-minion** translates the brand concept into specific, implementable visual decisions -- the "what exactly" layer. The corrupted-letterform concept is abstract in the Brand Identity doc and must be made concrete.
- **frontend-minion** validates that design proposals are feasible within EDS block conventions and performance constraints -- the "can we" layer. Without frontend input, the DDD risks proposing structures that conflict with how EDS blocks actually work.

No other specialists are needed because: the DDD is a markdown document (no infrastructure), has no runtime behavior (no observability), creates no attack surface (no security), and follows an established template (no documentation strategy needed). The cross-cutting agents excluded here may be relevant when the DDD is implemented -- but that is a separate task.

### Scope

**In scope:**
- Typographic logo treatment: "Mostly Hallucinations" in Source Code Pro
- Corrupted letterform specification for "Hallucinations" with per-letter detail
- Tagline ("Generated, meet grounded.") placement, typography, and token references
- Responsive layout (mobile and desktop) within `--nav-height` (80px)
- HTML Structure reflecting EDS block conventions for `blocks/header/`
- CSS Approach for layout method and corruption technique
- Token Usage table mapping every element to `styles/tokens.css` custom properties
- ASCII wireframes for mobile and desktop
- All required DDD sections per `docs/design-decisions/README.md`
- Status set to "Proposal"

**Out of scope:**
- Navigation (there is none by design)
- Footer (DDD-003)
- Global layout (DDD-001, already approved and implemented)
- Actual CSS/JS implementation of the header block
- Dark mode treatment (DDD-008)
- Favicon / social avatar simplified "MH" mark

### External Skill Integration

No external skills detected in project.
