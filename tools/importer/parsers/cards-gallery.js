/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base block: cards.
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-31
 *
 * Image-only gallery variant: the grid-layout has N direct-child divs, each
 * containing a single cover image and no text. Each image becomes one card
 * row with a single image cell. No title/description/CTA cells exist for
 * this variant.
 */
export default function parse(element, { document }) {
  // Each direct child div is one gallery card holding a single image.
  const items = Array.from(element.querySelectorAll(':scope > div'));

  const cells = [];
  items.forEach((item) => {
    const img = item.querySelector('img');
    if (img) cells.push([img]);
  });

  // Empty-block guard: no images found.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
