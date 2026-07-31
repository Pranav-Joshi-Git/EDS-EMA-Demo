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
