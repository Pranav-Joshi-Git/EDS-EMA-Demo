/* eslint-disable */
/* global WebImporter */
/**
 * Parser for authored data tables. Base block: table.
 * Source: https://wknd-trendsetters.site/blog/* (spec tables)
 * Generated: 2026-08-03
 *
 * EDS convention: the block's first row holds only the block name ("table");
 * each subsequent row is a data row, with one cell per column. Without this
 * parser a raw <table> in the body is ingested by EDS as a block named after
 * its first header cell (e.g. "Spec"), producing an unknown block that 404s.
 *
 * createBlock() emits the required name row automatically, so `cells` here is
 * exactly the data rows. The source header row (<thead>) is passed as the
 * first data row; the table block decorator promotes it back to <thead>.
 */
export default function parse(element, { document }) {
  const rows = Array.from(element.querySelectorAll('tr'));
  if (rows.length === 0) {
    element.remove();
    return;
  }

  // Each source <tr> -> one block row; each <td>/<th> -> one cell.
  // Preserve inline markup (e.g. <strong>) inside each cell.
  const cells = rows.map((tr) => Array.from(tr.children).map((cell) => {
    const frag = document.createElement('div');
    frag.append(...cell.childNodes);
    return frag;
  }));

  const block = WebImporter.Blocks.createBlock(document, { name: 'table', cells });
  element.replaceWith(block);
}
