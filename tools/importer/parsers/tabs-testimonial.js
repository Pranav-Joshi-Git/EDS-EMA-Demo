/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base block: tabs.
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-31
 *
 * 2-column tabs block: each row is one tab — [label | content].
 * Source has two parallel structures:
 *   - .tabs-content .tab-pane  → the panel content (image + name/role + quote)
 *   - .tab-menu .tab-menu-link → the tab button (avatar + name + role)
 * Panes and buttons are index-aligned. The button content is used as the tab
 * label; the pane's inner content is used as the tab content.
 */
export default function parse(element, { document }) {
  const panes = Array.from(element.querySelectorAll(':scope .tabs-content .tab-pane'));
  const buttons = Array.from(element.querySelectorAll(':scope .tab-menu .tab-menu-link'));

  const cells = [];
  panes.forEach((pane, i) => {
    const button = buttons[i];
    // Label cell: prefer the matching tab button's content; fall back to a
    // generated label so the row is never short.
    const labelCell = button ? button.querySelector(':scope > div') || button : `Tab ${i + 1}`;
    // Content cell: the pane's inner layout (image + testimonial text).
    const contentCell = pane.querySelector(':scope > div') || pane;
    cells.push([labelCell, contentCell]);
  });

  // Empty-block guard: no tabs found.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
