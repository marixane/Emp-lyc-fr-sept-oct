const normalizeClassName = (value) => String(value || '').trim().toUpperCase().replace(/\s+/g, ' ');

const dedupeHolidayClasses = () => {
  if (!document.body.classList.contains('cahier-tab-active')) return;

  document.querySelectorAll('.homework-entry').forEach((entry) => {
    const textBlock = entry.querySelector('.homework-text');
    const text = normalizeClassName(textBlock?.textContent || '');
    const isHoliday = text.includes('VACANCE') || text.includes('VACANCES');
    if (!isHoliday) return;

    const seenClasses = new Set();
    entry.querySelectorAll('.homework-subject > div').forEach((sessionRow) => {
      const spans = sessionRow.querySelectorAll('span');
      const className = normalizeClassName(spans[1]?.textContent || sessionRow.textContent || '');
      if (!className) return;

      if (seenClasses.has(className)) {
        sessionRow.style.display = 'none';
        sessionRow.setAttribute('data-deduped-holiday-class', 'true');
        return;
      }

      seenClasses.add(className);
      if (sessionRow.getAttribute('data-deduped-holiday-class') === 'true') {
        sessionRow.style.display = '';
        sessionRow.removeAttribute('data-deduped-holiday-class');
      }
    });
  });
};

const scheduleDedupe = () => window.requestAnimationFrame(dedupeHolidayClasses);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleDedupe, { once: true });
} else {
  scheduleDedupe();
}

new MutationObserver(scheduleDedupe).observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});
