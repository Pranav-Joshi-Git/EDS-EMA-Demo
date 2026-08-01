export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-feature-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pictures = [...col.querySelectorAll('picture')];
      if (pictures.length === 0) return;

      // An image column is one whose only meaningful content is pictures
      // (no heading/body text). This holds regardless of how the source
      // wrapped the pictures — one shared <p>, one <p> each, or bare.
      const hasText = col.textContent.trim().length > 0;
      if (!hasText) {
        col.classList.add('columns-feature-img-col');

        // Normalize: move every <picture> to be a direct child of the column
        // and drop the now-empty <p> wrappers, so layout does not depend on
        // the source's paragraph structure.
        pictures.forEach((picture) => col.append(picture));
        [...col.querySelectorAll('p')].forEach((p) => {
          if (!p.querySelector('picture') && p.textContent.trim() === '') p.remove();
        });

        // 2+ images → lay them out in a grid; a single image stays full width.
        if (pictures.length > 1) col.classList.add('columns-feature-img-grid');
      }
    });
  });
}
