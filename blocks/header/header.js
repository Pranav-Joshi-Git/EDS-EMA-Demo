// Media query that indicates desktop width (nav breakpoint)
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Fetch the nav fragment HTML. Tries the local path first (aem up / localhost),
 * then the metadata-driven path (DA/EDS production).
 * @param {string} navPath path to the nav document without the .plain.html suffix
 * @returns {Promise<Document|null>}
 */
async function fetchNav(navPath) {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) {
    resp = await fetch(`${navPath}.plain.html`);
  }
  if (!resp.ok) return null;
  const html = await resp.text();
  return new DOMParser().parseFromString(html, 'text/html');
}

/**
 * Close all open dropdowns in the nav.
 * @param {Element} nav
 */
function closeAllDropdowns(nav) {
  nav.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((drop) => {
    drop.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Build a caret icon element for dropdown triggers.
 * @returns {Element}
 */
function buildCaret() {
  const span = document.createElement('span');
  span.className = 'nav-caret';
  span.innerHTML = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  return span;
}

// Mega-panel item icons (match source): a circle for trend groups, a file for
// the inspo group, and an arrow for the featured card's "Discover" link.
const ICON_CIRCLE = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 4a12 12 0 1 0 12 12A12 12 0 0 0 16 4Zm0 22a10 10 0 1 1 10-10 10 10 0 0 1-10 10Z"/><path d="M16 10a6 6 0 1 0 6 6 6 6 0 0 0-6-6Zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4Z"/></svg>';
const ICON_FILE = '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="m25.7 9.3l-7-7A.9.9 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.9.9 0 0 0-.3-.7M18 4.4l5.6 5.6H18ZM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6Z"/></svg>';
const ICON_ARROW = '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8H14.5M14.5 8L8.5 2M14.5 8L8.5 14" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';

/**
 * Enrich a mega dropdown panel to match the source design: group headings,
 * icon + bold title + grey description per link, and a black featured card.
 * Content stays in nav.plain.html ("Title — Description"); this only restructures.
 * @param {Element} panel the panel <ul>
 */
function decorateMegaPanel(panel) {
  const groups = [...panel.children].filter((li) => li.querySelector(':scope > ul'));

  groups.forEach((groupLi, groupIndex) => {
    groupLi.classList.add('nav-mega-group');
    const list = groupLi.querySelector(':scope > ul');

    // The group's own leading text (e.g. "Casual") becomes a heading.
    const heading = document.createElement('span');
    heading.className = 'nav-mega-heading';
    while (groupLi.firstChild && groupLi.firstChild !== list) {
      heading.append(groupLi.firstChild);
    }
    groupLi.prepend(heading);

    // The inspo group (last) uses the file icon; trend groups use the circle.
    const iconSvg = groupIndex === groups.length - 1 ? ICON_FILE : ICON_CIRCLE;

    list.querySelectorAll(':scope > li > a').forEach((a) => {
      a.classList.add('nav-mega-item');
      const [title, desc] = a.textContent.split(/\s+—\s+/);
      a.textContent = '';

      const icon = document.createElement('span');
      icon.className = 'nav-mega-icon';
      icon.innerHTML = iconSvg;

      const text = document.createElement('span');
      text.className = 'nav-mega-text';
      const titleEl = document.createElement('strong');
      titleEl.textContent = title.trim();
      text.append(titleEl);
      if (desc) {
        const descEl = document.createElement('span');
        descEl.className = 'nav-mega-desc';
        descEl.textContent = desc.trim();
        text.append(descEl);
      }
      a.append(icon, text);
    });
  });

  // The remaining direct link (no nested list) is the featured card.
  const featured = [...panel.children].find((li) => !li.querySelector(':scope > ul') && li.querySelector(':scope > a'));
  if (featured) {
    featured.classList.add('nav-mega-featured');
    const a = featured.querySelector(':scope > a');
    a.classList.add('nav-mega-featured-link');
    const [title, desc] = a.textContent.split(/\s+—\s+/);
    a.textContent = '';

    const titleEl = document.createElement('strong');
    titleEl.className = 'nav-mega-featured-title';
    titleEl.textContent = title.trim();

    const cta = document.createElement('span');
    cta.className = 'nav-mega-featured-cta';
    cta.innerHTML = `<span>Discover</span><span class="nav-mega-arrow">${ICON_ARROW}</span>`;

    a.append(titleEl);
    if (desc) {
      const descEl = document.createElement('span');
      descEl.className = 'nav-mega-featured-desc';
      descEl.textContent = desc.trim();
      a.append(descEl);
    }
    a.append(cta);
  }
}

/**
 * Decorate a top-level nav item that contains a nested <ul> as a dropdown.
 * The item's own text becomes the trigger; the nested list becomes the panel.
 * @param {Element} li the top-level list item
 * @param {Element} nav the nav root (for closing siblings)
 */
function decorateDropdown(li, nav) {
  const panel = li.querySelector(':scope > ul');
  if (!panel) return;

  // Wrap the trigger label (all nodes before the panel) in a button-like span.
  const trigger = document.createElement('span');
  trigger.className = 'nav-trigger';
  trigger.setAttribute('role', 'button');
  trigger.setAttribute('tabindex', '0');
  while (li.firstChild && li.firstChild !== panel) {
    trigger.append(li.firstChild);
  }
  trigger.append(buildCaret());
  li.prepend(trigger);

  li.classList.add('nav-drop');
  li.setAttribute('aria-expanded', 'false');
  panel.classList.add('nav-dropdown-panel');

  // If the panel has nested group lists, it is a mega dropdown.
  if (panel.querySelector(':scope > li > ul')) {
    li.classList.add('nav-drop-mega');
    decorateMegaPanel(panel);
  }

  const toggle = () => {
    const open = li.getAttribute('aria-expanded') === 'true';
    closeAllDropdowns(nav);
    li.setAttribute('aria-expanded', open ? 'false' : 'true');
  };

  trigger.addEventListener('click', toggle);
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });

  // Desktop: open on hover.
  li.addEventListener('mouseenter', () => {
    if (isDesktop.matches) li.setAttribute('aria-expanded', 'true');
  });
  li.addEventListener('mouseleave', () => {
    if (isDesktop.matches) li.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Reset the nav to its default (closed) state — used on breakpoint changes.
 * @param {Element} nav
 * @param {Element} hamburger
 */
function resetNav(nav, hamburger) {
  closeAllDropdowns(nav);
  nav.setAttribute('aria-expanded', 'false');
  if (hamburger) {
    const button = hamburger.querySelector('button');
    if (button) button.setAttribute('aria-label', 'Open navigation');
  }
  document.body.style.overflowY = '';
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navPath = '/nav';
  const doc = await fetchNav(navPath);
  block.textContent = '';
  if (!doc) return;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');
  [...doc.body.children].forEach((section) => nav.append(section));

  // Assign roles: brand, sections, tools (in document order).
  const classNames = ['nav-brand', 'nav-sections', 'nav-tools'];
  [...nav.children].forEach((section, i) => {
    if (classNames[i]) section.classList.add(classNames[i]);
  });

  // Inject the brand logo from the repo (icons/logo.svg) so it is served from
  // code and never needs uploading as a content asset.
  const brandLink = nav.querySelector('.nav-brand a');
  if (brandLink && !brandLink.querySelector('.nav-logo')) {
    try {
      const logoResp = await fetch('/icons/logo.svg');
      if (logoResp.ok) {
        const svg = await logoResp.text();
        const logo = document.createElement('span');
        logo.className = 'nav-logo';
        logo.setAttribute('aria-hidden', 'true');
        logo.innerHTML = svg;
        brandLink.prepend(logo);
      }
    } catch (e) {
      // logo is decorative; ignore fetch/parse failures
    }
  }

  // Decorate dropdowns in the nav-sections list.
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope > ul > li').forEach((li) => {
      if (li.querySelector(':scope > ul')) decorateDropdown(li, nav);
    });
  }

  // Style the CTA in nav-tools as a primary button.
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    navTools.querySelectorAll('a').forEach((a) => a.classList.add('button', 'primary'));
  }

  // Hamburger (mobile only, shown via CSS below the breakpoint).
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    hamburger.querySelector('button').setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';
  });
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // Close open dropdowns / mobile menu on outside click.
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      closeAllDropdowns(nav);
      if (!isDesktop.matches) resetNav(nav, hamburger);
    }
  });

  // Close on Escape.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns(nav);
      if (!isDesktop.matches) resetNav(nav, hamburger);
    }
  });

  // Reset cleanly when crossing the breakpoint.
  isDesktop.addEventListener('change', () => resetNav(nav, hamburger));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
