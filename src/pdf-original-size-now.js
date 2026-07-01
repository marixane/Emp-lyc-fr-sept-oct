function enableOriginalPdfSizeNow() {
  document.body.classList.add('pdf-original-size-now');
  document.documentElement.style.setProperty('--pdf-sheet-scale-before-export', document.documentElement.style.getPropertyValue('--sheet-scale') || '1');
  document.documentElement.style.setProperty('--sheet-scale', '1');

  clearTimeout(window.__pdfOriginalSizeTimer);
  window.__pdfOriginalSizeTimer = setTimeout(function () {
    document.body.classList.remove('pdf-original-size-now');
    if (window.syncTwoPageView) window.syncTwoPageView();
  }, 12000);
}

function getPdfButton(target) {
  const button = target && target.closest && target.closest('button');
  if (!button) return null;
  const text = String(button.textContent || '').trim().toLowerCase();
  if (text.includes('voir pdf') || text.includes('exporter pdf')) return button;
  return null;
}

function waitForOriginalA4Ready(callback) {
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      setTimeout(callback, 40);
    });
  });
}

document.addEventListener('pointerdown', function (event) {
  if (getPdfButton(event.target)) enableOriginalPdfSizeNow();
}, true);

document.addEventListener('mousedown', function (event) {
  if (getPdfButton(event.target)) enableOriginalPdfSizeNow();
}, true);

document.addEventListener('click', function (event) {
  const button = getPdfButton(event.target);
  if (!button) return;

  enableOriginalPdfSizeNow();

  if (window.__pdfOriginalReplayClick) return;

  event.preventDefault();
  event.stopPropagation();
  if (event.stopImmediatePropagation) event.stopImmediatePropagation();

  waitForOriginalA4Ready(function () {
    window.__pdfOriginalReplayClick = true;
    button.click();
    window.__pdfOriginalReplayClick = false;
  });
}, true);

window.enableOriginalPdfSizeNow = enableOriginalPdfSizeNow;