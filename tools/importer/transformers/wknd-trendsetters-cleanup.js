/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 * Removes non-authorable site chrome so the import contains only page-level
 * authorable content. All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Breadcrumbs live inside the rc3 columns-feature block content. Remove them
    // before block parsing so they are not captured into the block's cells.
    // Verified in cleaned.html: <div class="breadcrumbs"> ... </div>
    WebImporter.DOMUtils.remove(element, ['.breadcrumbs']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (auto-populated by the site shell in EDS).
    // Verified in cleaned.html:
    //   <a href="#main-content" class="skip-link"> (line 1)
    //   <div class="navbar"> ... nav / mega-menu / mobile toggle (line 1)
    //   <footer class="footer inverse-footer"> (line 98)
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',
      '.navbar',
      'footer.footer',
    ]);
  }
}
