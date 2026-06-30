function disableA4OverviewForPdfButtons(panel) {
  panel.querySelectorAll(':scope > button').forEach(function (pdfButton) {
    var text = pdfButton.textContent || '';
    if (!text.includes('Voir PDF') && !text.includes('Exporter PDF')) return;
    if (pdfButton.dataset.a4OverviewPdfBound === 'true') return;
    pdfButton.dataset.a4OverviewPdfBound = 'true';
    pdfButton.addEventListener('click', function () {
      document.body.classList.remove('a4-overview-mode');
      syncA4OverviewButton();
    }, true);
  });
}

function focusArabicA4Overview() {
  if (window.__examLanguage !== 'ar') return;
  if (!document.body.classList.contains('a4-overview-mode')) return;

  var preview = document.querySelector('.preview-zone');
  var page = document.querySelector('.preview-zone .a4-page');
  if (!preview || !page) return;

  requestAnimationFrame(function () {
    preview.scrollTop = 0;
    preview.scrollLeft = 0;

    page.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start'
    });

    window.scrollBy({
      left: -12,
      top: 0,
      behavior: 'smooth'
    });
  });
}

function syncA4OverviewButton() {
  var panel = document.querySelector('.panel');
  if (!panel) return;

  disableA4OverviewForPdfButtons(panel);

  var button = document.querySelector('.a4-overview-toggle');
  if (!button) {
    button = document.createElement('button');
    button.type = 'button';
    button.className = 'a4-overview-toggle';
    button.addEventListener('click', function () {
      document.body.classList.toggle('a4-overview-mode');
      syncA4OverviewButton();
      focusArabicA4Overview();
    });

    var pdfButton = Array.from(panel.querySelectorAll(':scope > button')).find(function (item) {
      return (item.textContent || '').includes('Voir PDF');
    });

    if (pdfButton && pdfButton.parentNode) {
      pdfButton.parentNode.insertBefore(button, pdfButton);
    } else {
      panel.appendChild(button);
    }
  }

  var active = document.body.classList.contains('a4-overview-mode');
  button.textContent = active ? 'Aperçu normal' : 'Aperçu A4';
  button.classList.toggle('active', active);
}

syncA4OverviewButton();
setTimeout(syncA4OverviewButton, 100);
setTimeout(syncA4OverviewButton, 400);

new MutationObserver(syncA4OverviewButton).observe(document.body, { childList: true, subtree: true });
