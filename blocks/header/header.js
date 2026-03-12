/**
 * Header block -- site logo with intentional corruption effect.
 *
 * This replaces the AEM boilerplate header entirely.
 * No navigation, no hamburger menu, no sections/tools grid.
 * The header is a typographic logo with intentionally corrupted letterforms
 * on "Hallucinations" -- a brand identity feature, not a rendering bug.
 *
 * Design spec: docs/design-decisions/DDD-002-header.md
 */

import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * Corruption map (DDD-002, illustrative -- positions may change in design review):
 *   Position 4  (l): overshoot         -- stroke extends below baseline
 *   Position 6  (c): counter-closure   -- counter curls inward
 *   Position 8  (n): phantom-serif     -- serif appears on right stem
 *   Position 10 (t): asymmetric-crossbar -- crossbar extends right
 *   Position 13 (n): broken-junction   -- arch disconnects from right stem
 */
const CORRUPTION_MAP = {
  4: 'overshoot',
  6: 'counter-closure',
  8: 'phantom-serif',
  10: 'asymmetric-crossbar',
  13: 'broken-junction',
};

/**
 * loads and decorates the header block
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // Extract content from nav fragment, with fallbacks
  const linkEl = fragment?.querySelector('a[href="/"]');
  const emEl = fragment?.querySelector('em');
  const logoText = linkEl?.textContent?.trim() || 'Mostly Hallucinations';
  const taglineText = emEl?.textContent?.trim() || 'Generated, meet grounded.';

  // Split into "Mostly" and "Hallucinations" on the first space
  const spaceIdx = logoText.indexOf(' ');
  const wordMostly = spaceIdx > 0 ? logoText.substring(0, spaceIdx) : 'Mostly';
  const wordHallucinations = spaceIdx > 0 ? logoText.substring(spaceIdx + 1) : 'Hallucinations';

  // Build DOM fresh -- do not move fragment nodes (avoids decorateButtons class contamination)
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Site');

  const link = document.createElement('a');
  link.href = '/';
  link.className = 'site-logo';
  link.setAttribute('aria-label', 'Mostly Hallucinations, home');

  const logoSpan = document.createElement('span');
  logoSpan.className = 'logo-text';

  const mostlySpan = document.createElement('span');
  mostlySpan.className = 'logo-word-mostly';
  mostlySpan.textContent = wordMostly;

  const hallSpan = document.createElement('span');
  hallSpan.className = 'logo-word-hallucinations';

  // Split word into per-letter spans with corruption data attributes
  [...wordHallucinations].forEach((char, i) => {
    const pos = i + 1; // 1-indexed
    const letterSpan = document.createElement('span');
    letterSpan.className = `letter letter-${pos}`;
    letterSpan.textContent = char;
    if (CORRUPTION_MAP[pos]) {
      letterSpan.dataset.corrupt = CORRUPTION_MAP[pos];
    }
    hallSpan.append(letterSpan);
  });

  logoSpan.append(mostlySpan, hallSpan);

  const tagline = document.createElement('span');
  tagline.className = 'tagline';
  tagline.textContent = taglineText;

  link.append(logoSpan, tagline);
  nav.append(link);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);

  block.textContent = '';
  block.append(navWrapper);
}
