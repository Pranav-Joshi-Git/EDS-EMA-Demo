/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base block: cards.
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-31
 *
 * 2-column cards block: each row is one card — [image | text content].
 * Source cards are anchor elements (.article-card / .card-link) wrapping:
 *   - .article-card-image > img  → image cell
 *   - .article-card-body (meta tag + date + h3 heading) → text cell
 * The card's href is preserved by wrapping the heading text in a link.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > a.card-link'));

  const cells = [];
  cards.forEach((card) => {
    const img = card.querySelector('.article-card-image img, img');
    const meta = card.querySelector('.article-card-meta');
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    const href = card.getAttribute('href');

    // Text cell: meta (tags/date), then heading. If the card links somewhere,
    // wrap the heading text in a link so the destination is preserved.
    const textCell = [];
    if (meta) textCell.push(meta);
    if (heading) {
      if (href) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = heading.textContent;
        heading.textContent = '';
        heading.append(link);
      }
      textCell.push(heading);
    } else if (href) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = href;
      textCell.push(link);
    }

    // Image cell (first), text cell (second). Pad if image missing to keep 2 cols.
    cells.push([img || '', textCell]);
  });

  // Empty-block guard: no cards found.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
