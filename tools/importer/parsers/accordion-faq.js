/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base block: accordion.
 * Source: https://wknd-trendsetters.site/
 * Generated: 2026-07-31
 *
 * 2-column accordion block: each row is one item — [title | content].
 * Source items are <details class="faq-item"> holding:
 *   - summary.faq-question > span → the question (title cell). The decorative
 *     toggle <img> icon inside the summary is excluded.
 *   - div.faq-answer → the answer body (content cell).
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > details.faq-item, :scope > .faq-item'));

  const cells = [];
  items.forEach((item) => {
    const summary = item.querySelector('summary.faq-question, summary, .faq-question');
    // Prefer the question text span; fall back to the summary text (excluding icon).
    const questionSpan = summary ? summary.querySelector('span') : null;
    const answer = item.querySelector('.faq-answer');

    let titleCell = '';
    if (questionSpan) {
      titleCell = questionSpan;
    } else if (summary) {
      // Fallback: use summary text only, dropping any decorative icon.
      titleCell = summary.textContent.trim();
    }

    cells.push([titleCell, answer || '']);
  });

  // Empty-block guard: no accordion items found.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
