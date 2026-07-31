/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/columns-feature.js
  function parse(element, { document }) {
    let columns = Array.from(element.querySelectorAll(":scope > div"));
    if (columns.length === 0) {
      columns = Array.from(element.children);
    }
    if (columns.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push(columns);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-gallery.js
  function parse2(element, { document }) {
    const items = Array.from(element.querySelectorAll(":scope > div"));
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector("img");
      if (img) cells.push([img]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse3(element, { document }) {
    const panes = Array.from(element.querySelectorAll(":scope .tabs-content .tab-pane"));
    const buttons = Array.from(element.querySelectorAll(":scope .tab-menu .tab-menu-link"));
    const cells = [];
    panes.forEach((pane, i) => {
      const button = buttons[i];
      const labelCell = button ? button.querySelector(":scope > div") || button : `Tab ${i + 1}`;
      const contentCell = pane.querySelector(":scope > div") || pane;
      cells.push([labelCell, contentCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse4(element, { document }) {
    const cards = Array.from(element.querySelectorAll(":scope > a.article-card, :scope > a.card-link"));
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".article-card-image img, img");
      const meta = card.querySelector(".article-card-meta");
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      const href = card.getAttribute("href");
      const textCell = [];
      if (meta) textCell.push(meta);
      if (heading) {
        if (href) {
          const link = document.createElement("a");
          link.setAttribute("href", href);
          link.textContent = heading.textContent;
          heading.textContent = "";
          heading.append(link);
        }
        textCell.push(heading);
      } else if (href) {
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.textContent = href;
        textCell.push(link);
      }
      cells.push([img || "", textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse5(element, { document }) {
    const items = Array.from(element.querySelectorAll(":scope > details.faq-item, :scope > .faq-item"));
    const cells = [];
    items.forEach((item) => {
      const summary = item.querySelector("summary.faq-question, summary, .faq-question");
      const questionSpan = summary ? summary.querySelector("span") : null;
      const answer = item.querySelector(".faq-answer");
      let titleCell = "";
      if (questionSpan) {
        titleCell = questionSpan;
      } else if (summary) {
        titleCell = summary.textContent.trim();
      }
      cells.push([titleCell, answer || ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-overlay.js
  function parse6(element, { document }) {
    const bgImage = element.querySelector('img.cover-image, img[class*="overlay"], img');
    const heading = element.querySelector('h1, h2, h3, [class*="heading"]');
    const subheading = element.querySelector('p, .subheading, [class*="subheading"]');
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button"));
    if (!heading && !subheading && ctaLinks.length === 0 && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    contentCell.push(...ctaLinks);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-overlay", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [".breadcrumbs"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".skip-link",
        ".navbar",
        "footer.footer"
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const sections = payload && payload.template && payload.template.sections;
    if (!Array.isArray(sections) || sections.length < 2) return;
    const document = element.ownerDocument;
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section || !section.selector) continue;
      const el = element.querySelector(section.selector);
      if (!el || !el.parentNode) continue;
      const parent = el.parentNode;
      if (section.style) {
        const block = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        parent.insertBefore(block, el.nextSibling);
      }
      if (i > 0) {
        parent.insertBefore(document.createElement("hr"), el);
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "columns-feature": parse,
    "cards-gallery": parse2,
    "tabs-testimonial": parse3,
    "cards-article": parse4,
    "accordion-faq": parse5,
    "hero-overlay": parse6
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Homepage / editorial landing page with hero, feature sections, testimonial tabs, article card grid, FAQ accordion, and CTA. Hero-led layout with alternating light/dark sections.",
    urls: [
      "https://wknd-trendsetters.site/"
    ],
    blocks: [
      {
        name: "columns-feature",
        instances: [
          "#main-content > header.section.secondary-section > div.container > div.grid-layout",
          "#main-content > section.section:nth-of-type(1) > div.container > div.grid-layout"
        ]
      },
      {
        name: "cards-gallery",
        instances: [
          "#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-sm"
        ]
      },
      {
        name: "tabs-testimonial",
        instances: [
          "#main-content > section.section:nth-of-type(3) > div.container > div.tabs-wrapper"
        ]
      },
      {
        name: "cards-article",
        instances: [
          "#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.grid-layout.desktop-4-column.tablet-2-column-1.mobile-portrait-1-column.grid-gap-md"
        ]
      },
      {
        name: "accordion-faq",
        instances: [
          "#main-content > section.section:nth-of-type(5) .faq-list"
        ]
      },
      {
        name: "hero-overlay",
        instances: [
          "#main-content > section.section.inverse-section > div.container > div.grid-layout.desktop-1-column > div.utility-position-relative.utility-radius-card.utility-overflow-clip"
        ]
      }
    ],
    sections: [
      { id: "rc2", name: "Hero intro", selector: "#main-content > header.section.secondary-section", style: "secondary", blocks: ["columns-feature"], defaultContent: [] },
      { id: "rc3", name: "Featured article header", selector: "#main-content > section.section:nth-of-type(1)", style: null, blocks: ["columns-feature"], defaultContent: [] },
      { id: "rc4", name: "Snapshot gallery", selector: "#main-content > section.section.secondary-section:nth-of-type(2)", style: "secondary", blocks: ["cards-gallery"], defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.utility-text-align-center.utility-margin-bottom-8rem"] },
      { id: "rc5", name: "Testimonials", selector: "#main-content > section.section:nth-of-type(3)", style: null, blocks: ["tabs-testimonial"], defaultContent: [] },
      { id: "rc6", name: "Latest articles", selector: "#main-content > section.section.secondary-section:nth-of-type(4)", style: "secondary", blocks: ["cards-article"], defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.utility-text-align-center"] },
      { id: "rc7", name: "FAQ", selector: "#main-content > section.section:nth-of-type(5)", style: null, blocks: ["accordion-faq"], defaultContent: ["#main-content > section.section:nth-of-type(5) > div.container > div.grid-layout.tablet-1-column.grid-gap-xxl > div:first-child"] },
      { id: "rc8", name: "CTA banner", selector: "#main-content > section.section.inverse-section", style: "dark", blocks: ["hero-overlay"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      let pathname = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      if (!pathname) pathname = "/index";
      const path = WebImporter.FileUtils.sanitizePath(pathname);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
