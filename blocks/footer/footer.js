import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// Social icons keyed by link label. SVGs live in the repo /icons/ folder so
// they are served directly by EDS in every environment (no DA upload needed).
const SOCIAL_ICONS = {
  facebook: '/icons/social-facebook.svg',
  instagram: '/icons/social-instagram.svg',
  x: '/icons/social-x.svg',
  linkedin: '/icons/social-linkedin.svg',
  youtube: '/icons/social-youtube.svg',
};

/**
 * Fetch an SVG from the repo and return its markup (or null on failure).
 * @param {string} path Absolute path to the SVG (e.g. /icons/logo.svg)
 */
async function fetchIcon(path) {
  try {
    const resp = await fetch(path);
    if (resp.ok) return resp.text();
  } catch (e) {
    // icons are decorative; ignore fetch/parse failures
  }
  return null;
}

/**
 * Replace a social link's text with its inlined icon, preserving an
 * accessible label.
 * @param {HTMLAnchorElement} link the social link
 */
async function decorateSocialLink(link) {
  const label = link.textContent.trim();
  const iconPath = SOCIAL_ICONS[label.toLowerCase()];
  if (!iconPath) return;
  const svg = await fetchIcon(iconPath);
  if (!svg) return;
  link.setAttribute('aria-label', label);
  const icon = document.createElement('span');
  icon.className = 'footer-social-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = svg;
  link.textContent = '';
  link.append(icon);
}

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
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) {
    resp = await fetch(`${footerPath}.plain.html`);
  }
  if (resp.ok) {
    const html = await resp.text();
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
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

  // Inject the brand logo (repo icon) before the brand wordmark link text.
  const brandLink = footer.querySelector('.footer-brand > p a');
  if (brandLink) {
    const svg = await fetchIcon('/icons/footer-logo.svg');
    if (svg) {
      const logo = document.createElement('span');
      logo.className = 'footer-logo';
      logo.setAttribute('aria-hidden', 'true');
      logo.innerHTML = svg;
      brandLink.prepend(logo);
    }
  }

  // Replace social link text with inlined repo icons.
  const socialLinks = footer.querySelectorAll('.footer-brand ul a');
  await Promise.all([...socialLinks].map(decorateSocialLink));
}
