// tva

/**
 * Quote block — decorates blockquotes and pull-quotes in post content.
 *
 * Authored as a "Quote" table in Google Docs. EDS converts it to
 * nested <div> elements; this block transforms those into semantic
 * <blockquote> markup.
 *
 * Variants:
 *   - Standard (.quote): subtle left border, body-font prose
 *   - Pull-quote (.quote.pull-quote): gold left border, editorial font, aria-hidden
 *
 * Design spec: docs/design-decisions/DDD-005-post-detail.md
 */

/**
 * Collect non-empty text segments from an element's subtree.
 * Recursively walks child nodes so that content inside nested elements
 * (e.g. <strong>, <em>) is captured as plain text per child node.
 *
 * @param {Element} el - Element to walk
 * @returns {string[]} Array of non-empty trimmed text strings, one per text node
 */
function collectTextSegments(el) {
  const segments = [];

  el.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) segments.push(text);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      segments.push(...collectTextSegments(node));
    }
  });

  return segments;
}

/**
 * Extract paragraph strings from EDS block child divs.
 *
 * EDS converts each table row to a <div> (row), and each cell to a
 * nested <div> (cell). A single-cell table produces one row-div with
 * one cell-div. Multi-row tables produce multiple row-divs.
 *
 * For a Quote block, each row is treated as a separate paragraph.
 * If a cell itself contains block-level children (e.g. <p> elements),
 * each child is treated as its own paragraph.
 *
 * @param {Element} block - The .quote.block element
 * @returns {string[]} Array of paragraph strings
 */
function extractParagraphs(block) {
  const paragraphs = [];

  // Each direct child is a row div
  block.querySelectorAll(':scope > div').forEach((rowDiv) => {
    // Each child of the row is a cell div
    rowDiv.querySelectorAll(':scope > div').forEach((cellDiv) => {
      // If the cell contains block-level children, treat each as a paragraph
      const blockChildren = cellDiv.querySelectorAll(':scope > p, :scope > div');

      if (blockChildren.length > 0) {
        blockChildren.forEach((child) => {
          const text = child.textContent.trim();
          if (text) paragraphs.push(text);
        });
      } else {
        // Plain text cell — treat whole cell as one paragraph
        const text = collectTextSegments(cellDiv).join(' ');
        if (text) paragraphs.push(text);
      }
    });
  });

  return paragraphs;
}

/**
 * Build a <blockquote> element containing one <p> per paragraph string.
 *
 * @param {string[]} paragraphs - Non-empty paragraph strings
 * @returns {HTMLElement} blockquote element
 */
function buildBlockquote(paragraphs) {
  const blockquote = document.createElement('blockquote');

  paragraphs.forEach((text) => {
    const p = document.createElement('p');
    p.textContent = text;
    blockquote.append(p);
  });

  return blockquote;
}

/**
 * Loads and decorates the quote block.
 *
 * @param {Element} block The block element (.quote.block)
 */
export default async function decorate(block) {
  const isPullQuote = block.classList.contains('pull-quote');
  const paragraphs = extractParagraphs(block);

  // Clear EDS-generated div structure
  block.textContent = '';

  if (paragraphs.length === 0) return;

  const blockquote = buildBlockquote(paragraphs);

  if (isPullQuote) {
    const figure = document.createElement('figure');
    figure.setAttribute('aria-hidden', 'true');
    figure.append(blockquote);
    block.append(figure);
  } else {
    block.append(blockquote);
  }
}
