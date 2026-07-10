const EXAMS_PAGE_ID = 'cahier-exams-groups-page';
const TEMP_PAGE_ID = 'cahier-exams-groups-page-pdf-last';
const PDF_BUTTON_IDS = new Set(['cahier-pdf-button-stable', 'cahier-pdf-preview-stable']);

const prepareExamsPageForPdf = () => {
  const sourcePage = document.getElementById(EXAMS_PAGE_ID);
  const zone = document.querySelector('.cahier-preview-zone');
  if (!sourcePage || !zone) return;

  document.getElementById(TEMP_PAGE_ID)?.remove();

  const recreatedPage = sourcePage.cloneNode(true);
  recreatedPage.id = TEMP_PAGE_ID;
  recreatedPage.classList.add('cahier-exams-groups-page-pdf-last');
  recreatedPage.style.removeProperty('display');
  recreatedPage.style.removeProperty('visibility');
  recreatedPage.style.removeProperty('opacity');

  sourcePage.dataset.previousDisplay = sourcePage.style.display || '';
  sourcePage.style.setProperty('display', 'none', 'important');

  zone.append(recreatedPage);

  window.setTimeout(() => {
    recreatedPage.remove();
    if (sourcePage.dataset.previousDisplay) sourcePage.style.display = sourcePage.dataset.previousDisplay;
    else sourcePage.style.removeProperty('display');
    delete sourcePage.dataset.previousDisplay;
  }, 15000);
};

document.addEventListener('click', (event) => {
  const button = event.target?.closest?.('button');
  if (!button || !PDF_BUTTON_IDS.has(button.id)) return;
  prepareExamsPageForPdf();
}, true);
