## Domain Plan Contribution: ux-strategy-minion

### Recommendations

#### 1. Tagline: Recessive, Not Prominent

The tagline "Generated, meet grounded." should be visually subordinate to the blog name. Here is the reasoning:

**The JTBD for the header on first contact is identification, not persuasion.** When a senior engineer lands on this page (likely from a search result, a shared link, or a colleague's recommendation), their job-to-be-done is: "When I arrive at an unfamiliar technical blog, I want to quickly assess whether the author is a peer, so I can decide if this content is worth my time." The blog name alone does most of that work for this audience. The tagline is a reinforcing signal, not the primary one.

**Recessive means readable but not competing.** The tagline should be set in `--color-text-muted` (#817B6F) at a smaller size, below the blog name. It should be instantly readable when the eye drops to it, but it must not split the reader's attention on first fixation. The blog name gets the first 200ms of attention; the tagline confirms within the next 500ms.

**Avoid the "two competing headlines" problem.** When both the site name and tagline are visually prominent, Hick's Law applies: the user's brain tries to process two messages simultaneously, increasing cognitive load at the exact moment you need zero friction. One strong typographic statement plus one quiet supporting line creates a clean visual hierarchy.

#### 2. How a No-Nav Header Communicates "Practitioner's Blog"

The absence of navigation is itself a signal, and a powerful one for this audience. Here is why it works, and the one risk to manage:

**Why it works (recognition over recall):** Senior engineers are fluent in the semiotics of technical blogs. The pattern "monospaced type + no navigation + single-column layout" maps directly to a mental model they already carry: "This is a personal technical blog by someone who writes." Think of sites like danluu.com, rachelbythebay.com, or jvns.ca. Absence of navigation says: "There is no product here, no org chart, no marketing funnel. There is a person and their writing." That is exactly the right signal for this brand.

**The supporting signals that make it work without nav:**
- Source Code Pro for the blog name (monospaced = practitioner's tool)
- The name itself ("Mostly Hallucinations" is a concept, not a company name; it signals a thesis-driven thinker)
- The tagline references "generated" and "grounded" -- immediately marking AI-adjacent subject matter
- Single-column layout below the header confirms "this is about reading"

**The one risk: homepage discoverability from deep pages.** Without navigation, the header must link home. The blog name itself should be the home link (standard pattern, meets user expectations). This is a must-be feature in the Kano sense: its absence would strand users on individual post pages. Its presence is so expected that users will not notice it, which is exactly right.

**What NOT to add:** Do not add a subtle "Home" link or a "Back to posts" link next to the logo. That would contradict the no-nav commitment and introduce a second clickable element that competes with the brand name. The blog name IS the navigation. One element, one purpose.

#### 3. The Corrupted Letterforms: Where "Intriguing" Becomes "Broken"

This is the most critical UX question in the entire header design. The corrupted letterforms on "Hallucinations" are simultaneously the site's strongest brand asset and its highest cognitive load risk. Here is where the line sits:

**The governing principle: the word must be instantly readable.**

Every user must be able to read "Hallucinations" without hesitation on first exposure. The corruption is a secondary-processing discovery -- something the brain registers a beat after reading the word, not instead of reading it. If any user pauses to decode a letter, the design has crossed the line.

**Specific constraints to stay on the right side:**

1. **Structural legibility must be preserved.** Every letter's skeletal form -- the strokes that distinguish an 'H' from an 'N', an 'a' from an 'o' -- must remain intact. Corruption operates at the detail level (stroke weight, terminal shape, counter geometry), not at the structural level.

2. **Corruption density should be sparse.** Not every letter in "Hallucinations" should be corrupted. The brand identity doc describes "subtly corrupted" -- emphasis on "subtly." I recommend 3-5 letterforms maximum carry visible corruption. The rest should be clean Source Code Pro. The brain reads the word via its clean letters, then the corrupted ones create the "something is off" feeling retroactively. If the density is too high, the gestalt breaks and users will perceive a rendering error or a broken font.

3. **The corruption must be consistent, not random.** Random distortions look like bugs. Deliberate, repeating distortions (the same kind of "wrongness" applied to each affected letter) look like intent. The difference between "this font is broken" and "this is a visual concept" is whether the viewer perceives a system behind the imperfections.

4. **The contrast between "Mostly" (clean) and "Hallucinations" (corrupted) IS the concept.** This contrast is what sells the idea. "Mostly" must be pristine, rock-solid, typographically perfect. "Hallucinations" carries the distortion. The juxtaposition creates the meaning. If both words share any corruption, the concept collapses into "this is a weird font."

5. **Scale matters: the effect should be more visible on desktop, less on mobile.** At mobile sizes (where the type is smaller and pixel density may vary), subtle corruption risks looking like rendering artifacts rather than design intent. Consider reducing or eliminating the corruption effect on mobile (below 600px), where the word is small enough that clean legibility is more important than brand expression. The corrupted treatment has its full impact at desktop sizes where users have the screen real estate to perceive fine typographic detail.

**Testing heuristic:** Show the header to someone for 1 second, then ask them to type the blog name. If they type "Mostly Hallucinations" without hesitation, the corruption level is right. If they type "Mostly Hall-something" or pause, it has gone too far.

#### 4. Fixed vs. Scroll-Away Header

**Recommendation: scroll away on all viewports. Do not use position:fixed on mobile.**

The current boilerplate behavior (fixed on mobile, relative on desktop) is wrong for this site. Here is why, applying both cognitive load analysis and the calm technology principle:

**Why fixed headers exist:** Fixed headers solve a navigation problem. They keep nav links accessible as users scroll long pages. This site has no navigation links. The header's function is identification and home-linking -- not persistent wayfinding. Once the user has read the blog name (within 1-2 seconds of landing), the header has done its job.

**The cost of a fixed header on mobile is disproportionate for this site:**
- **80px of `--nav-height` is 12-15% of a mobile viewport.** On a 667px iPhone screen, that is a permanent tax on reading area. For a blog optimized for long-form reading, this is a direct hit to the core experience.
- **It contradicts the "warm white paper" aesthetic.** A fixed header means a persistent visual layer floating above the content. Paper does not have floating elements. The scroll-away header lets content occupy the full viewport, restoring the "reading a page" feeling.
- **It violates calm technology principles.** A fixed header demands peripheral awareness of non-content UI while reading. For a site whose entire purpose is focused reading, this is extraneous cognitive load.

**What about getting home from a long post?** Two patterns handle this without a fixed header:
1. **Scroll-to-top on tap of the status bar (iOS native behavior).** The header becomes visible as soon as the user scrolls to top. This is free.
2. **A home link in the footer.** The footer already has the author's name; linking to the home page from there provides an exit at the natural end of reading.

**The proposed behavior:**
- All viewports: `position: relative`. Header scrolls with content.
- No scroll-triggered show/hide behavior (those are complex, often janky, and add JS weight for a problem this site does not have).
- The header reserves its height via `--nav-height` in the initial layout, then scrolls away normally.

This is simpler to implement, more performant (no scroll listeners, no repaints from position changes), and better aligned with the brand's calm, content-first aesthetic.

### Proposed Tasks

1. **Define header information hierarchy** -- Establish the visual weight ordering: blog name (primary) > tagline (secondary, recessive). Document the specific typographic treatment for each (font, size token, color token, weight). The blog name is the sole interactive element (links home).

2. **Specify corrupted letterform constraints** -- Define the acceptable bounds for the "Hallucinations" letter corruption: maximum number of corrupted letterforms, types of corruption allowed (detail-level only, no structural distortion), and the responsive degradation strategy (full corruption on desktop, reduced/none on mobile).

3. **Remove fixed positioning from header** -- Change from `position: fixed` (mobile) / `position: relative` (desktop) to `position: relative` on all viewports. Remove the hamburger menu entirely (no nav items to toggle). Remove all nav-sections and nav-tools related code from header.js and header.css, as this site has no navigation items.

4. **Define the header's home-link behavior** -- Specify that the entire blog name is wrapped in an `<a href="/">` element. No separate home icon, no additional clickable targets. The link should have no visible underline (it is the brand, not a text link) but must have accessible focus styling.

5. **Validate cognitive load of corrupted letterforms** -- Include a testability criterion in the DDD: the 1-second recognition test. This gives the implementing design agent and the reviewer a shared pass/fail standard for the corruption level.

### Risks and Concerns

**Risk 1: Corrupted letterforms perceived as a rendering bug.** This is the highest-severity risk. If even 10% of first-time visitors think the font is broken rather than intentionally designed, the brand concept backfires. Mitigation: the DDD must define explicit constraints on corruption type and density, and the clean "Mostly" provides the contrast that signals intent.

**Risk 2: SVG/image-based logo creates performance and accessibility costs.** If the corrupted letterforms require a custom SVG or image rather than a web font, this introduces: (a) an image asset that adds to page weight, (b) a text element that is no longer selectable/searchable, (c) an accessibility burden (alt text, scaling behavior). The DDD should specify whether the corruption is achieved via CSS (transforms, clipping -- lighter but limited), SVG (flexible but an asset), or a custom font subset (most elegant but highest upfront effort). Each approach has different UX tradeoffs.

**Risk 3: The tagline "Generated, meet grounded." may not register at recessive weight.** If the tagline is too quiet, it fails to reinforce the brand concept for first-time visitors. The mitigation is to test at the proposed size/color against the warm white background and confirm it is readable without effort -- just not attention-grabbing.

**Risk 4: Removing fixed mobile header may surprise users who expect persistent branding.** This is a low risk for this audience (senior engineers are accustomed to static headers on personal blogs) but worth noting. If user testing reveals disorientation on long posts, the fallback is a minimal show-on-scroll-up header -- but do not build this preemptively. Start simple.

**Risk 5: No-nav header may confuse visitors arriving from non-blog pages (legal, privacy).** Users on `/legal` or `/privacy` pages need a way home. The header-as-home-link handles this, but verify the header appears on all page types, not just blog posts.

### Additional Agents Needed
None -- the current team is sufficient.
