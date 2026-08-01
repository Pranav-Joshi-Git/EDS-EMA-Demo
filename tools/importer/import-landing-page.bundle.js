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

  // tools/importer/import-landing-page.js
  var import_landing_page_exports = {};
  __export(import_landing_page_exports, {
    default: () => import_landing_page_default
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

  // tools/importer/parsers/cards-feature.js
  function parse2(element, { document }) {
    const cards = Array.from(element.querySelectorAll(":scope > div"));
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("img.cover-image, img");
      const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');
      const description = card.querySelector("p");
      const textCell = [];
      if (heading) textCell.push(heading);
      if (description) textCell.push(description);
      if (!img && textCell.length === 0) return;
      cells.push([img || "", textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse3(element, { document }) {
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

  // tools/importer/parsers/cards-gallery.js
  function parse4(element, { document }) {
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

  // tools/importer/import-landing-page.js
  var parsers = {
    "columns-feature": parse,
    "cards-feature": parse2,
    "cards-article": parse3,
    "cards-gallery": parse4
  };
  var PAGE_TEMPLATE = {
    name: "landing-page",
    description: "Topical trend landing pages: hero, 3-column image+title+description cards, article card grid, image gallery, 2-column feature, and an accent CTA section.",
    urls: [
      "https://wknd-trendsetters.site/fashion-trends-young-adults",
      "https://wknd-trendsetters.site/fashion-trends-of-the-season",
      "https://wknd-trendsetters.site/fashion-trends-young-adults-casual-sport"
    ],
    blocks: [
      {
        name: "columns-feature",
        instances: [
          "#main-content > header.section > div.container > div.grid-layout",
          "#main-content > section.section > div.container > div.grid-layout.tablet-1-column.grid-gap-lg:not(.desktop-3-column):not(.desktop-4-column)"
        ]
      },
      {
        name: "cards-feature",
        instances: [
          "#main-content > section.section > div.container > div.grid-layout.desktop-3-column:not(.grid-gap-sm)"
        ]
      },
      {
        name: "cards-article",
        instances: [
          "#main-content > section.section > div.container > div.grid-layout.desktop-4-column.grid-gap-md"
        ]
      },
      {
        name: "cards-gallery",
        instances: [
          "#main-content > section.section > div.container > div.grid-layout.desktop-3-column.grid-gap-sm",
          "#main-content > section.section > div.container > div.grid-layout.desktop-4-column.grid-gap-sm"
        ]
      }
    ],
    sections: [
      { id: "rc2", name: "Hero intro", selector: "#main-content > header.section.secondary-section", style: "secondary", blocks: ["columns-feature"], defaultContent: [] },
      { id: "rc3", name: "Trend category cards", selector: "#main-content > section.section:nth-of-type(1)", style: null, blocks: ["cards-feature"], defaultContent: [] },
      { id: "rc4", name: "Young style intro", selector: "#main-content > section.section.secondary-section:nth-of-type(2)", style: "secondary", blocks: [], defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(2) > div.container > div.utility-text-align-center"] },
      { id: "rc5", name: "Trends for every vibe", selector: "#trends", style: null, blocks: ["cards-article"], defaultContent: [] },
      { id: "rc6", name: "Style in every snapshot", selector: "#main-content > section.section.secondary-section:nth-of-type(4)", style: "secondary", blocks: ["cards-gallery"], defaultContent: ["#main-content > section.section.secondary-section:nth-of-type(4) > div.container > div.utility-text-align-center"] },
      { id: "rc7", name: "Accent CTA", selector: "#main-content > section.section.accent-section", style: "accent", blocks: [], defaultContent: ["#main-content > section.section.accent-section > div.container > div.utility-text-align-center"] }
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
  var import_landing_page_default = {
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
  return __toCommonJS(import_landing_page_exports);
})();
