const LOCKED_DOTTED_TEXT = `${'.'.repeat(74)}\n${'.'.repeat(74)}\n${'.'.repeat(74)}`;

const isDottedHomeworkText = (node) => {
  const text = String(node.textContent || '').trim();
  return text && /^[.\s]+$/.test(text);
};

const lockDottedHomeworkLines = () => {
  if (!document.body.classList.contains('cahier-tab-active')) return;
  document.querySelectorAll('.homework-text').forEach((node) => {
    if (!isDottedHomeworkText(node)) return;
    if (node.textContent !== LOCKED_DOTTED_TEXT) node.textContent = LOCKED_DOTTED_TEXT;
    node.classList.add('cahier-dotted-locked');
    node.setAttribute('contenteditable', 'false');
    node.setAttribute('aria-readonly', 'true');
  });
};

let dottedLockRaf = 0;
const scheduleDottedLock = () => {
  if (dottedLockRaf) return;
  dottedLockRaf = window.requestAnimationFrame(() => {
    dottedLockRaf = 0;
    lockDottedHomeworkLines();
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleDottedLock, { once: true });
} else {
  scheduleDottedLock();
}

window.setTimeout(scheduleDottedLock, 300);
window.setTimeout(scheduleDottedLock, 900);
window.setTimeout(scheduleDottedLock, 1800);

document.addEventListener('input', (event) => {
  if (event.target?.closest?.('.timetable-table')) window.setTimeout(scheduleDottedLock, 120);
}, { passive: true });

document.addEventListener('focusin', (event) => {
  if (event.target?.classList?.contains('cahier-dotted-locked')) event.target.blur();
});

new MutationObserver(scheduleDottedLock).observe(document.body, {
  childList: true,
  subtree: true
});
