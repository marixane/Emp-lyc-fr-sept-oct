function syncNoteScaleButtonLabels() {
  document.querySelectorAll('.note-scale-button').forEach(function (button) {
    var text = (button.textContent || '').trim();
    if (text === 'Sur 10') button.textContent = '/ 10';
    if (text === 'Sur 20') button.textContent = '/ 20';
  });
}

syncNoteScaleButtonLabels();
setTimeout(syncNoteScaleButtonLabels, 100);
setTimeout(syncNoteScaleButtonLabels, 400);

new MutationObserver(syncNoteScaleButtonLabels).observe(document.body, { childList: true, subtree: true });
