/**
 * Header block -- site logo with intentional corruption effect.
 *
 * This replaces the AEM boilerplate header entirely.
 * No navigation, no hamburger menu, no sections/tools grid.
 * The header is a typographic logo with an SVG displacement filter
 * on "Hallucinations" -- a brand identity feature, not a rendering bug.
 *
 * Design spec: docs/design-decisions/DDD-002-header.md
 */

/**
 * Creates an inline SVG filter for the text corruption effect.
 * Uses feTurbulence + feDisplacementMap to produce organic warping.
 * The seed value makes the pattern deterministic (same every load).
 */
function createCorruptionFilter() {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.position = 'absolute';

  const filter = document.createElementNS(svgNS, 'filter');
  filter.id = 'header-corrupt';

  const turbulence = document.createElementNS(svgNS, 'feTurbulence');
  turbulence.setAttribute('type', 'turbulence');
  turbulence.setAttribute('baseFrequency', '0.02 0.06');
  turbulence.setAttribute('numOctaves', '2');
  turbulence.setAttribute('seed', '42');
  turbulence.setAttribute('result', 'noise');

  const displacement = document.createElementNS(svgNS, 'feDisplacementMap');
  displacement.setAttribute('in', 'SourceGraphic');
  displacement.setAttribute('in2', 'noise');
  displacement.setAttribute('scale', '3');
  displacement.setAttribute('xChannelSelector', 'R');
  displacement.setAttribute('yChannelSelector', 'G');

  filter.append(turbulence, displacement);
  svg.append(filter);
  return svg;
}

/**
 * loads and decorates the header block
 * @param {Element} block The header block element
 */
export default function decorate(block) {
  // Build DOM fresh
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
  mostlySpan.textContent = 'Mostly';

  const hallSpan = document.createElement('span');
  hallSpan.className = 'logo-word-hallucinations';
  hallSpan.textContent = 'Hallucinations';

  logoSpan.append(mostlySpan, hallSpan);

  const tagline = document.createElement('span');
  tagline.className = 'tagline';
  tagline.textContent = 'Generated, meet grounded.';

  link.append(logoSpan, tagline);
  nav.append(link);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);

  // Inject SVG filter definition (hidden, zero-size)
  navWrapper.append(createCorruptionFilter());

  block.textContent = '';
  block.append(navWrapper);
}
