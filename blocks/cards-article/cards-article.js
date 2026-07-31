import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-article-card-image';
      else div.className = 'cards-article-card-body';
    });
    ul.append(li);
  });
  // split the meta paragraph ("Category May 12") into a category tag + date
  ul.querySelectorAll('.cards-article-card-body > p').forEach((p) => {
    const text = p.textContent.trim();
    const match = text.match(/^(.*?)\s+([A-Z][a-z]+\.?\s+\d{1,2})$/);
    if (!match) return;
    const [, tagText, dateText] = match;
    p.textContent = '';
    const tag = document.createElement('span');
    tag.className = 'cards-article-tag';
    tag.textContent = tagText;
    const date = document.createElement('span');
    date.className = 'cards-article-date';
    date.textContent = dateText;
    p.append(tag, date);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
