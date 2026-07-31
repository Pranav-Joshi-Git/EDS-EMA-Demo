export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-feature-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-feature-img-col');
        }
      }

      // Normalize the image column so layout does not depend on how the
      // source wrapped the images (one <p> vs one <p> per picture vs bare).
      // Move every <picture> to be a direct child of the column and drop the
      // now-empty <p> wrappers. When 2+ images share the column, mark it so
      // CSS lays them out in a grid instead of stacking.
      if (col.classList.contains('columns-feature-img-col')) {
        const pictures = [...col.querySelectorAll('picture')];
        if (pictures.length > 1) {
          pictures.forEach((picture) => col.append(picture));
          [...col.querySelectorAll('p')].forEach((p) => {
            if (!p.querySelector('picture') && p.textContent.trim() === '') p.remove();
          });
          col.classList.add('columns-feature-img-grid');
        }
      }
    });
  });
}
