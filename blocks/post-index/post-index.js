// tva

/**
 * Post Index block — fetches /query-index.json and renders a reverse-chronological
 * list of post entries on the home page.
 *
 * Design spec: docs/design-decisions/DDD-004-home-post-index.md
 */

import {
  TYPE_LABELS, DATE_FORMATTER, parseDate, toIsoDate,
} from '../../scripts/post-utils.js';

/**
 * Build a single post entry <article> element.
 * @param {Object} entry - A single entry from query-index.json .data array
 * @param {number} position - 1-based position in sorted list (for aria-labelledby IDs)
 * @returns {HTMLElement|null} article element, or null if entry should be skipped
 */
function buildEntry(entry, position) {
  const {
    path, title, type, description, date, tags,
  } = entry;

  // Required field — skip entry entirely if missing
  if (!title) return null;

  // Security: validate path before use in href
  if (!path || !path.startsWith('/')) return null;

  const titleId = `post-${position}-title`;
  const typeLabel = TYPE_LABELS[type] || null;

  const article = document.createElement('article');
  article.className = 'post-entry';
  article.setAttribute('aria-labelledby', titleId);

  // Type badge (visible, aria-hidden — heading sr-only prefix carries the type for AT)
  if (typeLabel) {
    const badge = document.createElement('span');
    badge.className = 'post-type';
    badge.setAttribute('aria-hidden', 'true');
    badge.textContent = typeLabel;
    article.append(badge);
  }

  // Title heading
  const h2 = document.createElement('h2');
  h2.id = titleId;

  if (typeLabel) {
    // sr-only prefix gives screen reader heading nav the type context.
    // Trailing ': ' (colon-space) ensures AT separates type from title without
    // relying on whitespace text nodes.
    const srPrefix = document.createElement('span');
    srPrefix.className = 'sr-only';
    srPrefix.textContent = `${typeLabel}: `;
    h2.append(srPrefix);
  }

  const titleLink = document.createElement('a');
  titleLink.href = path;
  titleLink.textContent = title;
  h2.append(titleLink);
  article.append(h2);

  // Description
  if (description) {
    const p = document.createElement('p');
    p.className = 'post-description';
    p.textContent = description;
    article.append(p);
  }

  // Metadata footer (date + tags)
  const footer = document.createElement('footer');
  footer.className = 'post-meta';

  const dateMs = parseDate(date);
  if (dateMs) {
    const time = document.createElement('time');
    time.setAttribute('datetime', toIsoDate(dateMs));
    time.textContent = DATE_FORMATTER.format(new Date(dateMs));
    footer.append(time);
  }

  if (tags) {
    const slugs = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => /^[a-z0-9-]+$/.test(t)); // validate slug before use in href

    if (slugs.length > 0) {
      // Intentionally no aria-label on tag list -- single list per article makes it unambiguous
      const ul = document.createElement('ul');
      ul.className = 'post-tags';

      slugs.forEach((slug) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `/tags/${slug}`;
        a.textContent = slug;
        li.append(a);
        ul.append(li);
      });

      footer.append(ul);
    }
  }

  // Only append footer if it has content
  if (footer.children.length > 0) {
    article.append(footer);
  }

  return article;
}

/**
 * Loads and decorates the post-index block.
 * Fetches /query-index.json, sorts by date descending, renders entries.
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // sr-only h1 must appear first in DOM order
  const h1 = document.createElement('h1');
  h1.className = 'sr-only';
  h1.textContent = 'Posts';

  block.textContent = '';
  block.append(h1);

  let entries;
  try {
    const response = await fetch('/query-index.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const json = await response.json();
    entries = json.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Post index: failed to load query-index.json', error);
    return;
  }

  if (!Array.isArray(entries) || entries.length === 0) {
    // eslint-disable-next-line no-console
    console.warn('Post index: query-index.json returned no entries');
    return;
  }

  // Sort by date descending; entries without dates fall to end
  entries.sort((a, b) => {
    const da = parseDate(a.date);
    const db = parseDate(b.date);
    return db - da;
  });

  entries.forEach((entry, i) => {
    const article = buildEntry(entry, i + 1);
    if (article) {
      block.append(article);
    }
  });
}
