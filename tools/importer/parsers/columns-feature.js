/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature. Base block: columns.
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-31
 *
 * Flexible columns block: the grid-layout has N direct-child divs, each of
 * which becomes one column. Instance 1 = [text+CTAs | image stack];
 * Instance 2 = [image | breadcrumbs+heading+author meta]. The parser treats
 * each direct child of the grid as a single column cell so any content
 * grouping is preserved.
 */
export default function parse(element, { document }) {
  // Each direct child of the grid-layout is a column.
  let columns = Array.from(element.querySelectorAll(':scope > div'));

  // Fallback: if no direct-child divs, treat the element's own children as columns.
  if (columns.length === 0) {
    columns = Array.from(element.children);
  }

  // Empty-block guard: nothing to lay out.
  if (columns.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Single content row: one cell per column, preserving each column's contents.
  cells.push(columns);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
