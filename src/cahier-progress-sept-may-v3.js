const PROGRESS_FLAG_DATES = ['19/10', '07/12', '15/03', '03/05'];

const getProgressStartYear = () => {
  const now = new Date();
  return now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
};

const parseProgressDate = (text, startYear) => {
  const found = String(text || '').match(/[0-9]{1,2}\/[0-9]{1,2}/);
  if (!found) return null;
  const [day, month] = found[0].split('/').map(Number);
  return new Date(month >= 9 ? startYear : startYear + 1, month - 1, day);
};

const calculateProgress = (date, startYear) => {
  const start = new Date(startYear, 8, 1);
  const end = new Date(startYear + 1, 4, 30);
  const percent = ((date - start) / (end - start)) * 100;
  return Math.max(0, Math.min(100, Math.round(percent)));
};

const updateOneProgressPage = (page, startYear) => {
  const pageDate = parseProgressDate(page.querySelector('.homework-date')?.textContent, startYear);
  if (!pageDate) return;

  const percentLabel = Array.from(page.querySelectorAll('div')).find((node) => /^\s*[0-9]{1,3}%\s*$/.test(node.textContent || ''));
  if (!percentLabel) return;

  const progressWrap = percentLabel.parentElement;
  const progressBar = progressWrap?.firstElementChild;
  const fill = progressBar?.firstElementChild;
  if (!progressBar || !fill) return;

  const percent = calculateProgress(pageDate, startYear);
  fill.style.setProperty('width', percent + '%', 'important');
  percentLabel.textContent = percent + '%';

  Array.from(progressBar.querySelectorAll('span')).forEach((flag, index) => {
    const flagDate = parseProgressDate(PROGRESS_FLAG_DATES[index], startYear);
    if (flagDate) flag.style.setProperty('left', calculateProgress(flagDate, startYear) + '%', 'important');
  });
};

const updateAllProgressPages = () => {
  const startYear = getProgressStartYear();
  document.querySelectorAll('.homework-page').forEach((page) => updateOneProgressPage(page, startYear));
};

let progressFrame = 0;
const scheduleProgressRefresh = () => {
  cancelAnimationFrame(progressFrame);
  progressFrame = requestAnimationFrame(updateAllProgressPages);
};

const startProgressWatcher = () => {
  updateAllProgressPages();
  const preview = document.querySelector('.cahier-preview-zone');
  if (!preview || preview.dataset.progressWatcherActive === 'true') return;
  preview.dataset.progressWatcherActive = 'true';

  const observer = new MutationObserver(scheduleProgressRefresh);
  observer.observe(preview, { childList: true, subtree: true, characterData: true });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startProgressWatcher, { once: true });
} else {
  startProgressWatcher();
}

window.addEventListener('load', startProgressWatcher, { once: true });
