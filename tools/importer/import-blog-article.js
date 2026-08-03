/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS (reused)
import columnsFeatureParser from './parsers/columns-feature.js';
import tableParser from './parsers/table.js';

// TRANSFORMER IMPORTS (site-wide, template-driven — shared)
import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

// PARSER REGISTRY
const parsers = {
  'columns-feature': columnsFeatureParser,
  table: tableParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json (blog-article)
const PAGE_TEMPLATE = {
  name: 'blog-article',
  description: 'Blog article detail pages: 2-column article header + long-form default-content body.',
  urls: [
    'https://wknd-trendsetters.site/blog/ace-pro-court-polo',
    'https://wknd-trendsetters.site/blog/fashion-blog-post',
    'https://wknd-trendsetters.site/blog/fashion-trends-young-culture',
    'https://wknd-trendsetters.site/blog/fashion-trends-young-style',
    'https://wknd-trendsetters.site/blog/flip-flop-summer-style',
    'https://wknd-trendsetters.site/blog/latest-trends-young-casual-fashion',
    'https://wknd-trendsetters.site/blog/street-style-trends',
  ],
  blocks: [
    {
      name: 'columns-feature',
      instances: [
        '#main-content > section.section:nth-of-type(1) > div.container > div.grid-layout.grid-gap-lg',
      ],
    },
    {
      name: 'table',
      instances: [
        '#main-content table',
      ],
    },
  ],
  sections: [
    { id: 'rc2', name: 'Article header', selector: '#main-content > section.section:nth-of-type(1)', style: null, blocks: ['columns-feature'], defaultContent: [] },
    { id: 'rc3', name: 'Article body', selector: '#main-content > section.section:nth-of-type(2)', style: null, blocks: [], defaultContent: ['#main-content > section.section:nth-of-type(2) > div.container'] },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, sections after
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
      let elements = [];
      try {
        elements = document.querySelectorAll(selector);
      } catch (e) {
        console.warn(`Invalid selector skipped: ${selector}`);
      }
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

    // 6. Generate sanitized path. Root maps to /index (defensive).
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
