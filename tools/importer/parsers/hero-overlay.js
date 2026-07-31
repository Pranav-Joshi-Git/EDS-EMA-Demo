/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay. Base block: hero.
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-31
 *
 * 1-column hero block with 3 rows: [block name] / [background image] / [content].
 * Source structure:
 *   - img.cover-image (utility-overlay) → background image row
 *   - .card-body (h2 heading + p subheading + .button-group CTA) → content row
 * The decorative empty .overlay div is ignored. Both content rows are single
 * cells (1-column block).
 */
export default function parse(element, { document }) {
  const bgImage = element.querySelector('img.cover-image, img[class*="overlay"], img');
  const heading = element.querySelector('h1, h2, h3, [class*="heading"]');
  const subheading = element.querySelector('p, .subheading, [class*="subheading"]');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));

  // Empty-block guard: no meaningful hero content.
  if (!heading && !subheading && ctaLinks.length === 0 && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (optional) — single cell.
  if (bgImage) cells.push([bgImage]);

  // Row 3: content (heading + subheading + CTAs) — single cell holding all.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
