const clearClassPlaceholders = (root = document) => {
  root.querySelectorAll?.('.timetable-table textarea[placeholder="Classe"]').forEach((textarea) => {
    textarea.setAttribute('placeholder', '');
  });
};

clearClassPlaceholders();

document.addEventListener('DOMContentLoaded', () => clearClassPlaceholders(), { once: true });

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) clearClassPlaceholders(node);
    });
  });
});

observer.observe(document.documentElement, { childList: true, subtree: true });
