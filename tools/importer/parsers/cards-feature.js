/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature. Base block: cards.
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-08-01
 *
 * 2-column cards block: each row is one card — [image | text content].
 * Source cards are plain <div> elements (direct children of the grid layout),
 * each wrapping:
 *   - img.cover-image  → image cell
 *   - h2.h3-heading    → title heading (in text cell)
 *   - p.paragraph-sm   → description (in text cell)
 * These cards are NOT clickable (no tag/date, no link), so no anchor wrapping.
 */
export default function parse(element, { document }) {
  // Direct-child card containers. Fallback to any div child for variation.
  const cards = Array.from(element.querySelectorAll(':scope > div'));

  const cells = [];
  cards.forEach((card) => {
    const img = card.querySelector('img.cover-image, img');
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
    const description = card.querySelector('p');

    // Text cell (second column): title heading, then description.
    const textCell = [];
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);

    // Skip cards with no meaningful content.
    if (!img && textCell.length === 0) return;

    // Image cell (first), text cell (second). Pad if image missing to keep 2 cols.
    cells.push([img || '', textCell]);
  });

  // Empty-block guard: no cards found.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
