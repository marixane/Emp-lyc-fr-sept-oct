const EVENT_START_DATE_ORDER = [
  '05/09', '19/10', '06/11', '18/11', '07/12', '01/01', '11/01', '14/01', '20/01', '25/01',
  '15/03', '20/03', '01/05', '03/05', '27/05', '29/05', '01/06', '16/06', '23/06', '03/07', '06/07'
];

const getHomeworkPageTitle = (page) => String(
  page.querySelector('.homework-page > div:first-child > div:first-child')?.textContent ||
  page.firstElementChild?.firstElementChild?.textContent ||
  ''
).trim();

const getPageFirstEventIndex = (page) => {
  const dateText = String(page.querySelector('.homework-date')?.textContent || '');
  const match = dateText.match(/\b\d{2}\/\d{2}\b/);
  if (!match) return 999;
  const found = EVENT_START_DATE_ORDER.indexOf(match[0]);
  return found >= 0 ? found : 999;
};

const getClassGroupStates = () => {
  const timetablePage = Array.from(document.querySelectorAll('.cahier-page'))
    .find((page) => page.querySelector('.timetable-table'));

  const groupsWrap = Array.from(timetablePage?.children || []).find((child) => {
    const style = String(child.getAttribute('style') || '');
    return style.includes('grid-template-columns: repeat(5');
  });

  return Array.from(groupsWrap?.children || []).map((group) => ({
    title: String(group.children?.[0]?.textContent || '').trim(),
    hasClass: Boolean(group.children?.[1]?.querySelector('span'))
  })).filter((group) => group.title);
};

const splitHomeworkPagesIntoBlocks = (pages) => {
  const blocks = [];
  let currentBlock = null;

  pages.forEach((page) => {
    const title = getHomeworkPageTitle(page);
    const firstIndex = getPageFirstEventIndex(page);
    const startsNewBlock = !currentBlock || title !== currentBlock.title || firstIndex <= currentBlock.lastIndex;

    if (startsNewBlock) {
      currentBlock = { title, pages: [], lastIndex: -1 };
      blocks.push(currentBlock);
    }

    currentBlock.pages.push(page);
    currentBlock.lastIndex = firstIndex;
  });

  return blocks;
};

const applyEmptyGroupPageVisibility = () => {
  if (!document.body.classList.contains('cahier-tab-active')) return;

  const groupStates = getClassGroupStates();
  const homeworkPages = Array.from(document.querySelectorAll('.homework-page'));
  const blocks = splitHomeworkPagesIntoBlocks(homeworkPages);

  blocks.forEach((block, index) => {
    const group = groupStates[index];
    const shouldShow = Boolean(group?.hasClass);
    block.pages.forEach((page) => {
      page.style.display = shouldShow ? '' : 'none';
    });
  });
};

let emptyGroupPagesRaf = 0;
const scheduleEmptyGroupPageVisibility = () => {
  if (emptyGroupPagesRaf) return;
  emptyGroupPagesRaf = window.requestAnimationFrame(() => {
    emptyGroupPagesRaf = 0;
    applyEmptyGroupPageVisibility();
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleEmptyGroupPageVisibility, { once: true });
} else {
  scheduleEmptyGroupPageVisibility();
}

window.setTimeout(scheduleEmptyGroupPageVisibility, 250);
window.setTimeout(scheduleEmptyGroupPageVisibility, 800);
window.setTimeout(scheduleEmptyGroupPageVisibility, 1600);

document.addEventListener('input', (event) => {
  if (event.target?.closest?.('.timetable-table')) window.setTimeout(scheduleEmptyGroupPageVisibility, 120);
}, { passive: true });
document.addEventListener('drop', () => window.setTimeout(scheduleEmptyGroupPageVisibility, 150), { passive: true });
document.addEventListener('mouseup', () => window.setTimeout(scheduleEmptyGroupPageVisibility, 150), { passive: true });
