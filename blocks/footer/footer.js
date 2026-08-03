import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Resolve the footer fragment path (metadata override, else default).
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/footer';

  // Content-first: read the authored fragment. Localhost/aem up serves the
  // working copy at /content/footer.plain.html; DA/EDS serves it at the
  // metadata path.
  let fragment = null;
  let fragmentUrl = '/content/footer.plain.html';
  let resp = await fetch(fragmentUrl);
  if (!resp.ok) {
    fragmentUrl = `${footerPath}.plain.html`;
    resp = await fetch(fragmentUrl);
  }
  if (resp.ok) {
    const html = await resp.text();
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    // Relative image paths in the fragment resolve against the host page URL,
    // not the fragment's location. Rebase them against the fragment directory.
    const base = fragmentUrl.substring(0, fragmentUrl.lastIndexOf('/') + 1);
    tmp.querySelectorAll('img[src]').forEach((img) => {
      const src = img.getAttribute('src');
      if (src && !/^(https?:)?\/\//.test(src) && !src.startsWith('/')) {
        img.setAttribute('src', base + src);
      }
    });
    fragment = tmp;
  } else {
    // Fallback to the fragment loader (handles decorated fragment pages).
    fragment = await loadFragment(footerPath);
  }

  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-content';

  const columns = fragment ? [...fragment.children] : [];
  columns.forEach((col, i) => {
    const column = document.createElement('div');
    column.className = i === 0 ? 'footer-brand' : 'footer-links';
    while (col.firstChild) column.append(col.firstChild);
    footer.append(column);
  });

  block.append(footer);
}
