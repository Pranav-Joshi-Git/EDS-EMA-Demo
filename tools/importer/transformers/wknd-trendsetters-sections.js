/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters section boundaries + section metadata.
 * Driven by payload.template.sections (from page-templates.json). Runs in
 * afterTransform only. For each section it:
 *   - inserts a Section Metadata block (when the section has a `style`), placed
 *     at the end of that section's content;
 *   - inserts an <hr> section break before every section except the first.
 *
 * Section selectors come from the template and are anchored under
 * #main-content (verified against cleaned.html). They are used as-is against
 * `element` (the body/wrapper that contains #main-content), so the sections
 * are found via descendant match; inserts are made relative to the matched
 * element's real parent (#main-content).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const sections = payload && payload.template && payload.template.sections;
  if (!Array.isArray(sections) || sections.length < 2) return;

  const document = element.ownerDocument;

  // Process in reverse so earlier insertions never shift later section nodes.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    if (!section || !section.selector) continue;

    const el = element.querySelector(section.selector);
    if (!el || !el.parentNode) continue;

    const parent = el.parentNode;

    // Section Metadata block for sections that carry a style.
    if (section.style) {
      const block = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      // Place at end of the section (after its content, before the next <hr>).
      parent.insertBefore(block, el.nextSibling);
    }

    // Section break before every section except the first.
    if (i > 0) {
      parent.insertBefore(document.createElement('hr'), el);
    }
  }
}
