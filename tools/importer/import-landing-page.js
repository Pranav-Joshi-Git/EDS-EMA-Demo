/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import columnsFeatureParser from './parsers/columns-feature.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import cardsArticleParser from './parsers/cards-article.js';
import cardsGalleryParser from './parsers/cards-gallery.js';

// TRANSFORMER IMPORTS (site-wide, template-driven — shared with homepage)
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PARSER REGISTRY
const parsers = {
  'columns-feature': columnsFeatureParser,
  'cards-feature': cardsFeatureParser,
  'cards-article': cardsArticleParser,
  'cards-gallery': cardsGalleryParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json (landing-page)
const PAGE_TEMPLATE = {
  name: 'landing-page',
  description: 'Topical trend landing pages: hero, 3-column image+title+description cards, article card grid, image gallery, 2-column feature, and an accent CTA section.',
  urls: [
    'https://wknd-trendsetters.site/fashion-trends-young-adults',
    'https://wknd-trendsetters.site/fashion-trends-of-the-season',
    'https://wknd-trendsetters.site/fashion-trends-young-adults-casual-sport',
  ],
  blocks: [
    {
      name: 'columns-feature',
      instances: [
        '#main-content > header.section > div.container > div.grid-layout',
        '#main-content > section.section > div.container > div.grid-layout.tablet-1-column.grid-gap-lg:not(.desktop-3-column):not(.desktop-4-column)',
      ],
    },
    {
      name: 'cards-feature',
      instances: [
        '#main-content > section.section > div.container > div.grid-layout.desktop-3-column:not(.grid-gap-sm)',
      ],
    },
    {
      name: 'cards-article',
      instances: [
        '#main-content > section.section > div.container > div.grid-layout.desktop-4-column.grid-gap-md',
      ],
    },
    {
      name: 'cards-gallery',
      instances: [
        '#main-content > section.section > div.container > div.grid-layout.desktop-3-column.grid-gap-sm',
        '#main-content > section.section > div.container > div.grid-layout.desktop-4-column.grid-gap-sm',
      ],
    },
  ],
  sections: [
    { id: 'rc2', name: 'Hero intro', selector: '#main-content > header.section.secondary-section', style: 'secondary', blocks: ['columns-feature'], defaultContent: [] },
    { id: 'rc3', name: 'Trend category cards', selector: '#main-content > section.section:nth-of-type(1)', style: null, blocks: ['cards-feature'], defaultContent: [] },
    { id: 'rc4', name: 'Young style intro', selector: '#main-content > section.section.secondary-section:nth-of-type(2)', style: 'secondary', blocks: [], defaultContent: ['#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.utility-text-align-center'] },
    { id: 'rc5', name: 'Trends for every vibe', selector: '#trends', style: null, blocks: ['cards-article'], defaultContent: [] },
    { id: 'rc6', name: 'Style in every snapshot', selector: '#main-content > section.section.secondary-section:nth-of-type(4)', style: 'secondary', blocks: ['cards-gallery'], defaultContent: ['#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.utility-text-align-center'] },
    { id: 'rc7', name: 'Accent CTA', selector: '#main-content > section.section.accent-section', style: 'accent', blocks: [], defaultContent: ['#main-content > section.section.accent-section > div.container > div.utility-text-align-center'] },
  ],
};

// TRANSFORMER REGISTRY - cleanup runs first, sections after
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block; skip elements already replaced by a prior parser
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path. Root maps to /index (defensive; landing pages have paths).
    let pathname = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html$/, '');
    if (!pathname) pathname = '/index';
    const path = WebImporter.FileUtils.sanitizePath(pathname);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
