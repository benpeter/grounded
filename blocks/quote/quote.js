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
 * Extract paragraph elements from EDS block child divs, preserving inline markup.
 *
 * EDS converts each table row to a <div> (row), and each cell to a
 * nested <div> (cell). For a Quote block, each row is treated as a
 * separate paragraph. If a cell contains block-level children (<p>),
 * each child becomes its own paragraph.
 *
 * @param {Element} block - The .quote.block element
 * @returns {HTMLParagraphElement[]} Array of <p> elements with preserved markup
 */
function extractParagraphs(block) {
  const paragraphs = [];

  block.querySelectorAll(':scope > div').forEach((rowDiv) => {
    rowDiv.querySelectorAll(':scope > div').forEach((cellDiv) => {
      const blockChildren = cellDiv.querySelectorAll(':scope > p, :scope > div');

      if (blockChildren.length > 0) {
        blockChildren.forEach((child) => {
          if (child.textContent.trim()) {
            const p = document.createElement('p');
            // Move child nodes to preserve inline markup (bold, italic, code, links)
            while (child.firstChild) p.append(child.firstChild);
            paragraphs.push(p);
          }
        });
      } else {
        const text = cellDiv.textContent.trim();
        if (text) {
          const p = document.createElement('p');
          // Move child nodes to preserve any inline markup
          while (cellDiv.firstChild) p.append(cellDiv.firstChild);
          paragraphs.push(p);
        }
      }
    });
  });

  return paragraphs;
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

  const blockquote = document.createElement('blockquote');
  paragraphs.forEach((p) => blockquote.append(p));

  if (isPullQuote) {
    const figure = document.createElement('figure');
    figure.setAttribute('aria-hidden', 'true');
    figure.append(blockquote);
    block.append(figure);
  } else {
    block.append(blockquote);
  }
}
