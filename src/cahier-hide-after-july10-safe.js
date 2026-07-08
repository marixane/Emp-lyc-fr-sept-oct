const isAfterJuly10 = (text) => {
  const match = String(text || '').match(/(\d{1,2})\/07(?:\/\d{4})?/);
  return match ? Number(match[1]) > 10 : false;
};

const updateJulyVisibility = () => {
  document.querySelectorAll('.homework-entry').forEach((entry) => {
    const dateText = entry.querySelector('.homework-date')?.textContent || '';
    if (isAfterJuly10(dateText)) {
      entry.hidden = true;
      entry.style.setProperty('display', 'none', 'important');
    } else {
      entry.hidden = false;
      entry.style.removeProperty('display');
    }
  });
};

let scheduled = false;
const scheduleUpdate = () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    updateJulyVisibility();
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleUpdate, { once: true });
} else {
  scheduleUpdate();
}

new MutationObserver(scheduleUpdate).observe(document.documentElement, {
  childList: true,
  subtree: true
});
