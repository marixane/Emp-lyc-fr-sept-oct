const normalize = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim()
  .toLowerCase();

const isDropPlaceholder = (value) => normalize(value) === 'deposer ici';

const removeDropPlaceholder = (root = document) => {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        return isDropPlaceholder(node.nodeValue)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    }
  );

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    node.nodeValue = '';
    node.parentElement?.setAttribute('aria-label', 'Zone de dépôt');
  });
};

let scheduled = false;
const scheduleRemoval = () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    removeDropPlaceholder();
  });
};

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === 'characterData' && isDropPlaceholder(mutation.target.nodeValue)) {
      mutation.target.nodeValue = '';
      mutation.target.parentElement?.setAttribute('aria-label', 'Zone de dépôt');
      continue;
    }

    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && isDropPlaceholder(node.nodeValue)) {
        node.nodeValue = '';
        node.parentElement?.setAttribute('aria-label', 'Zone de dépôt');
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        removeDropPlaceholder(node);
      }
    });
  }
});

observer.observe(document.documentElement, {
  childList: true,
  characterData: true,
  subtree: true
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleRemoval, { once: true });
} else {
  scheduleRemoval();
}
