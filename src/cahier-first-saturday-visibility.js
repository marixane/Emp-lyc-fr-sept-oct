const FIRST_SATURDAY = '05/09/2026';
const HIDDEN_CLASS = 'cahier-hide-first-saturday';
let scheduled = false;

const normalize = (value) => String(value || '').trim().toUpperCase();

const hasSaturdayClass = () => {
  const rows = Array.from(document.querySelectorAll('.timetable-table tbody tr'));
  const saturdayRow = rows.find((row) => normalize(row.querySelector('.day-cell textarea')?.value) === 'SAMEDI');
  if (!saturdayRow) return false;

  return Array.from(saturdayRow.querySelectorAll('td:not(.day-cell) textarea'))
    .some((textarea) => String(textarea.value || '').trim() !== '');
};

const syncVisibility = () => {
  scheduled = false;
  const shouldHide = !hasSaturdayClass();

  document.querySelectorAll('.homework-entry').forEach((entry) => {
    const date = String(entry.querySelector('.homework-date')?.textContent || '');
    const isFirstSaturday = date.includes(FIRST_SATURDAY) || /\b05\/09\b/.test(date);
    entry.classList.toggle(HIDDEN_CLASS, shouldHide && isFirstSaturday);
  });

  document.querySelectorAll('.homework-page').forEach((page) => {
    const visibleEntries = Array.from(page.querySelectorAll('.homework-entry'))
      .some((entry) => !entry.classList.contains(HIDDEN_CLASS));
    page.classList.toggle('cahier-hide-empty-after-saturday-filter', !visibleEntries);
  });
};

const scheduleSync = () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(syncVisibility);
};

const style = document.createElement('style');
style.textContent = `
  .${HIDDEN_CLASS},
  .cahier-hide-empty-after-saturday-filter {
    display: none !important;
  }
`;
document.head.append(style);

document.addEventListener('input', (event) => {
  if (event.target.closest?.('.timetable-table')) scheduleSync();
}, true);

const observer = new MutationObserver(scheduleSync);
observer.observe(document.documentElement, { childList: true, subtree: true });

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleSync, { once: true });
} else {
  scheduleSync();
}
