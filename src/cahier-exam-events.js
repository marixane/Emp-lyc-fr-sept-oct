const EXAM_EVENTS = [
  { start: '20/01', end: '24/01', cycle: 'Primaire', text: 'Examen : Examen normalisé local' },
  { start: '23/06', end: '24/06', cycle: 'Primaire', text: 'Examen : Examen normalisé provincial' },
  { start: '16/06', end: '17/06', cycle: 'Collège', text: 'Examen : Examen régional du collège' },
  { start: '29/05', end: '30/05', cycle: 'Lycée', text: 'Examen : Examen régional 1ère Bac' },
  { start: '01/06', end: '04/06', cycle: 'Lycée', text: 'Examen : Examen national 2ème Bac' }
];

const EXTRA_HOLIDAY_EVENTS = [
  { start: '20/03', end: '22/03', text: 'Vacance : Aïd Al-Fitr' },
  { start: '27/05', end: '30/05', text: 'Vacance : Aïd Al-Adha' },
  { start: '16/06', end: '16/06', text: 'Vacance : 1er Moharram' }
];

const EXAM_DAYS = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];

const getExamSchoolStartYear = () => new Date().getMonth() >= 8 ? new Date().getFullYear() : new Date().getFullYear() - 1;

const getExamDateObject = (monthDate) => {
  const [day, month] = String(monthDate).split('/').map(Number);
  const startYear = getExamSchoolStartYear();
  return new Date(month >= 9 ? startYear : startYear + 1, month - 1, day);
};

const getExamDisplayDay = (monthDate) => EXAM_DAYS[getExamDateObject(monthDate).getDay()];

const getExamRangeDates = ({ start, end }) => {
  const dates = [];
  const current = getExamDateObject(start);
  const last = getExamDateObject(end);
  while (current <= last) {
    dates.push(`${String(current.getDate()).padStart(2, '0')}/${String(current.getMonth() + 1).padStart(2, '0')}`);
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const getEntryDateText = (entry) => String(entry.querySelector('.homework-date')?.textContent || '');
const entryHasMonthDate = (entry, monthDate) => getEntryDateText(entry).includes(monthDate);
const getEntryMonthDate = (entry) => {
  const match = getEntryDateText(entry).match(/\b\d{2}\/\d{2}\b/);
  return match?.[0] || '';
};

const getTemplateEntry = (entries, event) => {
  const eventStart = getExamDateObject(event.start).getTime();
  return entries.find((entry) => {
    const entryMonthDate = getEntryMonthDate(entry);
    return entryMonthDate && getExamDateObject(entryMonthDate).getTime() >= eventStart;
  }) || entries[entries.length - 1];
};

const cloneEntryForEvent = (template, event, eventClass) => {
  if (!template) return null;
  const clone = template.cloneNode(true);
  clone.classList.remove('cahier-exam-hidden');
  clone.classList.add(eventClass, 'cahier-event-inserted');
  clone.dataset.eventStart = event.start;
  return clone;
};

const setDateRange = (entry, event) => {
  const dateNode = entry.querySelector('.homework-date');
  if (!dateNode) return;
  dateNode.textContent = event.start === event.end
    ? `${getExamDisplayDay(event.start)} ${event.start}`
    : `${getExamDisplayDay(event.start)} ${event.start} - ${getExamDisplayDay(event.end)} ${event.end}`;
};

const setExamEntryContent = (entry, event) => {
  const textNode = entry.querySelector('.homework-text');
  const subjectNode = entry.querySelector('.homework-subject');

  entry.classList.add('cahier-exam-entry');
  entry.dataset.examStart = event.start;
  setDateRange(entry, event);
  if (textNode) textNode.textContent = event.text;
  if (subjectNode) subjectNode.innerHTML = `<div class="cahier-exam-cycle-pill">${event.cycle}</div>`;
};

const setHolidayEntryContent = (entry, event) => {
  const textNode = entry.querySelector('.homework-text');
  const subjectNode = entry.querySelector('.homework-subject');

  entry.classList.add('cahier-extra-holiday-entry');
  entry.dataset.holidayStart = event.start;
  setDateRange(entry, event);
  if (textNode) textNode.textContent = event.text;
  if (subjectNode) subjectNode.innerHTML = '';
};

const placeEventEntry = (entries, event, eventEntry) => {
  const eventStart = getExamDateObject(event.start).getTime();
  const nextEntry = entries.find((entry) => {
    const entryMonthDate = getEntryMonthDate(entry);
    return entryMonthDate && getExamDateObject(entryMonthDate).getTime() > eventStart;
  });
  if (nextEntry) nextEntry.before(eventEntry);
  else entries[entries.length - 1]?.after(eventEntry);
};

const insertEvents = (page, events, eventClass, setter) => {
  events.forEach((event) => {
    const entries = Array.from(page.querySelectorAll('.homework-entry:not(.cahier-event-inserted)'));
    if (!entries.length) return;

    const rangeDates = getExamRangeDates(event);
    const matchingEntries = entries.filter((entry) => rangeDates.some((date) => entryHasMonthDate(entry, date)));
    const existingEntry = matchingEntries[0];
    const eventEntry = existingEntry || cloneEntryForEvent(getTemplateEntry(entries, event), event, eventClass);
    if (!eventEntry) return;

    setter(eventEntry, event);
    if (!existingEntry) placeEventEntry(entries, event, eventEntry);
    matchingEntries.slice(1).forEach((entry) => entry.classList.add('cahier-exam-hidden'));
  });
};

const applyCahierExamEvents = () => {
  if (!document.body.classList.contains('cahier-tab-active')) return false;
  const pages = Array.from(document.querySelectorAll('.homework-page'));
  if (!pages.length) return false;

  pages.forEach((page) => {
    page.querySelectorAll('.cahier-event-inserted').forEach((entry) => entry.remove());
    page.querySelectorAll('.homework-entry.cahier-exam-entry').forEach((entry) => entry.classList.remove('cahier-exam-entry'));
    page.querySelectorAll('.homework-entry.cahier-extra-holiday-entry').forEach((entry) => entry.classList.remove('cahier-extra-holiday-entry'));
    page.querySelectorAll('.homework-entry.cahier-exam-hidden').forEach((entry) => entry.classList.remove('cahier-exam-hidden'));

    insertEvents(page, EXTRA_HOLIDAY_EVENTS, 'cahier-extra-holiday-entry', setHolidayEntryContent);
    insertEvents(page, EXAM_EVENTS, 'cahier-exam-entry', setExamEntryContent);
  });

  return true;
};

let examEventsRetryCount = 0;
const scheduleCahierExamEvents = () => window.requestAnimationFrame(() => {
  const done = applyCahierExamEvents();
  if (!done && examEventsRetryCount < 24) {
    examEventsRetryCount += 1;
    window.setTimeout(scheduleCahierExamEvents, 250);
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleCahierExamEvents, { once: true });
} else {
  scheduleCahierExamEvents();
}

document.addEventListener('input', (event) => {
  if (event.target?.closest?.('.timetable-table')) window.setTimeout(scheduleCahierExamEvents, 160);
}, { passive: true });
document.addEventListener('drop', () => window.setTimeout(scheduleCahierExamEvents, 180), { passive: true });
