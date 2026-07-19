const pdfButtonIds = new Set(['cahier-pdf-button-stable', 'cahier-pdf-preview-stable']);
const allowedClicks = new WeakSet();

document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button || !pdfButtonIds.has(button.id)) return;
  if (button.dataset.readyPdfUrl) return;
  if (allowedClicks.has(button)) { allowedClicks.delete(button); return; }
  event.preventDefault(); event.stopImmediatePropagation();
  const finish = () => { window.removeEventListener('cahier-pages-generated', finish); allowedClicks.add(button); button.click(); };
  window.addEventListener('cahier-pages-generated', finish, { once: true });
  window.dispatchEvent(new Event('cahier-request-generate-pages'));
  window.setTimeout(finish, 2200);
}, true);
