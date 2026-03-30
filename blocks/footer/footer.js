/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default function decorate(block) {
  const footer = document.createElement('div');
  const p = document.createElement('p');

  const author = document.createElement('a');
  author.href = 'https://www.linkedin.com/in/benpeter/';
  author.target = '_blank';
  author.rel = 'noopener noreferrer';
  author.setAttribute('aria-label', 'Ben Peter on LinkedIn (opens in new tab)');
  author.textContent = 'Ben Peter';

  const legal = document.createElement('a');
  legal.href = '/legal';
  legal.textContent = 'Legal Notice';

  const privacy = document.createElement('a');
  privacy.href = '/privacy';
  privacy.textContent = 'Privacy Policy';

  p.append('\u00A9\u00A02026\u00A0', author, ' \u00B7 ', legal, ' \u00B7 ', privacy);
  footer.append(p);

  block.textContent = '';
  block.append(footer);
}
