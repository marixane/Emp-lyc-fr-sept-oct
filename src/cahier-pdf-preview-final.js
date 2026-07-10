const PREVIEW_BUTTON_ID = 'cahier-pdf-preview-stable';
const DOWNLOAD_BUTTON_ID = 'cahier-pdf-button-stable';

const writeLoadingPage = (previewWindow) => {
  previewWindow.document.open();
  previewWindow.document.write(`<!doctype html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Préparation du PDF…</title>
      </head>
      <body style="margin:0;display:flex;min-height:100vh;align-items:center;justify-content:center;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a">
        <div style="text-align:center;padding:32px">
          <h2 style="margin:0 0 12px">Préparation du PDF…</h2>
          <p style="margin:0">Veuillez patienter pendant la génération complète.</p>
        </div>
      </body>
    </html>`);
  previewWindow.document.close();
};

const writePdfViewer = (previewWindow, pdfUrl) => {
  const safeUrl = String(pdfUrl).replace(/"/g, '&quot;');
  previewWindow.document.open();
  previewWindow.document.write(`<!doctype html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Cahier de texte — PDF</title>
        <style>
          html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#334155;font-family:Arial,sans-serif}
          .bar{height:48px;box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;padding:0 14px;background:#0f172a;color:#fff;font-weight:900}
          .bar a{display:inline-flex;align-items:center;padding:8px 13px;border-radius:8px;background:#16a34a;color:#fff;text-decoration:none;font-weight:900}
          .viewer{display:block;width:100%;height:calc(100% - 48px);border:0;background:#fff}
        </style>
      </head>
      <body>
        <div class="bar">
          <span>Aperçu PDF du cahier de texte</span>
          <a href="${safeUrl}" target="_blank" rel="noopener">Ouvrir directement le PDF</a>
        </div>
        <object class="viewer" data="${safeUrl}" type="application/pdf">
          <iframe class="viewer" src="${safeUrl}" title="Aperçu PDF"></iframe>
        </object>
      </body>
    </html>`);
  previewWindow.document.close();
  previewWindow.focus();
};

const replacePreviewBehavior = () => {
  const previewButton = document.getElementById(PREVIEW_BUTTON_ID);
  const downloadButton = document.getElementById(DOWNLOAD_BUTTON_ID);
  if (!previewButton || !downloadButton || previewButton.dataset.pdfPreviewFixed === 'true') return;

  const replacement = previewButton.cloneNode(true);
  replacement.dataset.pdfPreviewFixed = 'true';
  previewButton.replaceWith(replacement);

  replacement.addEventListener('click', () => {
    const previewWindow = window.open('about:blank', '_blank');
    if (!previewWindow) {
      alert('Autorisez les fenêtres surgissantes pour voir le PDF.');
      return;
    }

    writeLoadingPage(previewWindow);

    const originalText = replacement.textContent;
    replacement.disabled = true;
    replacement.textContent = 'Préparation PDF...';

    let completed = false;

    const interceptDownload = async (event) => {
      const link = event.target?.closest?.('a[download]');
      if (!link || !String(link.download).toLowerCase().endsWith('.pdf') || !String(link.href).startsWith('blob:')) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      completed = true;
      document.removeEventListener('click', interceptDownload, true);

      try {
        replacement.textContent = 'Ouverture PDF...';
        const response = await fetch(link.href);
        if (!response.ok) throw new Error('Le fichier PDF généré est inaccessible.');

        const buffer = await response.arrayBuffer();
        const pdfBlob = new Blob([buffer], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        writePdfViewer(previewWindow, pdfUrl);
        replacement.textContent = 'PDF ouvert';
        window.setTimeout(() => URL.revokeObjectURL(pdfUrl), 60 * 60 * 1000);
      } catch (error) {
        if (!previewWindow.closed) previewWindow.close();
        alert(`Erreur PDF : ${error?.message || 'aperçu impossible'}`);
      } finally {
        replacement.disabled = false;
        window.setTimeout(() => { replacement.textContent = originalText; }, 900);
      }
    };

    document.addEventListener('click', interceptDownload, true);
    downloadButton.click();

    window.setTimeout(() => {
      if (completed) return;
      document.removeEventListener('click', interceptDownload, true);
      replacement.disabled = false;
      replacement.textContent = originalText;
      if (!previewWindow.closed) previewWindow.close();
      alert('Le PDF n’a pas été généré dans le délai prévu.');
    }, 120000);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', replacePreviewBehavior, { once: true });
} else {
  replacePreviewBehavior();
}

window.setTimeout(replacePreviewBehavior, 500);
