import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export const config = {
  maxDuration: 60
};

const MAX_HTML_SIZE = 8 * 1024 * 1024;

const escapeBaseUrl = (url) => String(url || 'https://a4exam.com').replace(/["<>]/g, '');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { html, baseUrl } = req.body || {};
  if (!html || typeof html !== 'string') {
    return res.status(400).json({ error: 'HTML manquant' });
  }
  if (html.length > MAX_HTML_SIZE) {
    return res.status(413).json({ error: 'Document trop grand pour générer le PDF' });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: { width: 1240, height: 1754 },
      executablePath: await chromium.executablePath(),
      headless: chromium.headless
    });

    const page = await browser.newPage();
    const safeBase = escapeBaseUrl(baseUrl);
    const preparedHtml = `<!doctype html><html><head><base href="${safeBase}/"><meta charset="utf-8"><style>@page{size:A4 portrait;margin:0}*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}.cahier-pdf-export-button,.app-tabs,.tab-button,button{display:none!important}.cahier-preview-zone{overflow:visible!important;height:auto!important;max-height:none!important}.a4-page,.cahier-page{break-after:page!important;page-break-after:always!important}</style></head><body>${html}</body></html>`;

    await page.setContent(preparedHtml, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready.catch(() => {});
      window.scrollTo(0, 0);
    });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      scale: 1
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="Cahier-de-texte-2026-2027.pdf"');
    res.status(200).send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.message || 'Erreur génération PDF' });
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}
