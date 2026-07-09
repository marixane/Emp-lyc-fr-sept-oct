import { useEffect } from 'react';
import Tab from './Tab.jsx';

const SCHOOL_START_YEAR = 2026;
const SCHOOL_END_YEAR = 2027;
const SCHOOL_START_DATE = new Date(2026, 8, 1);
const SCHOOL_END_DATE = new Date(2027, 6, 10);
const DATE_PATTERN = /\b(\d{2})\/(\d{2})(?!\/\d{4})\b/g;
const FULL_DATE_PATTERN = /\b(\d{2})\/(\d{2})\/(\d{4})\b/g;
const DAY_NAMES = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];

const CANONICAL_EVENTS = [
  { start: '05/09/2026', end: '06/09/2026', label: 'Religieuse', text: 'Vacance religieuse : Aïd Al Mawlid Annabaoui', type: 'holiday' },
  { start: '18/10/2026', end: '25/10/2026', label: 'Scolaire', text: 'Vacance scolaire : Vacances intermédiaires 1', type: 'holiday' },
  { start: '31/10/2026', end: '31/10/2026', label: 'Nationale', text: 'Fête nationale : Fête de l’Unité', type: 'holiday' },
  { start: '06/11/2026', end: '06/11/2026', label: 'Nationale', text: 'Fête nationale : Marche Verte', type: 'holiday' },
  { start: '18/11/2026', end: '18/11/2026', label: 'Nationale', text: 'Fête nationale : Fête de l’Indépendance', type: 'holiday' },
  { start: '06/12/2026', end: '13/12/2026', label: 'Scolaire', text: 'Vacance scolaire : Vacances intermédiaires 2', type: 'holiday' },
  { start: '01/01/2027', end: '01/01/2027', label: 'Nationale', text: 'Fête nationale : Nouvel An', type: 'holiday' },
  { start: '11/01/2027', end: '11/01/2027', label: 'Nationale', text: 'Fête nationale : Manifeste de l’Indépendance', type: 'holiday' },
  { start: '14/01/2027', end: '14/01/2027', label: 'Nationale', text: 'Fête nationale : Nouvel An Amazigh', type: 'holiday' },
  { start: '20/01/2027', end: '24/01/2027', label: 'Primaire', text: 'Examen : Examen normalisé local', type: 'exam' },
  { start: '24/01/2027', end: '31/01/2027', label: 'Scolaire', text: 'Vacance scolaire : Vacances de mi-année', type: 'holiday' },
  { start: '15/03/2027', end: '22/03/2027', label: 'Scolaire', text: 'Vacance scolaire : Vacances intermédiaires 3', type: 'holiday' },
  { start: '20/03/2027', end: '22/03/2027', label: 'Religieuse', text: 'Vacance religieuse : Aïd Al-Fitr', type: 'holiday' },
  { start: '01/05/2027', end: '01/05/2027', label: 'Nationale', text: 'Fête nationale : Fête du Travail', type: 'holiday' },
  { start: '09/05/2027', end: '16/05/2027', label: 'Scolaire', text: 'Vacance scolaire : Vacances intermédiaires 4', type: 'holiday' },
  { start: '27/05/2027', end: '30/05/2027', label: 'Religieuse', text: 'Vacance religieuse : Aïd Al-Adha', type: 'holiday' },
  { start: '29/05/2027', end: '30/05/2027', label: 'Lycée', text: 'Examen : Examen régional 1ère Bac', type: 'exam' },
  { start: '01/06/2027', end: '04/06/2027', label: 'Lycée', text: 'Examen : Examen national 2ème Bac', type: 'exam' },
  { start: '16/06/2027', end: '16/06/2027', label: 'Religieuse', text: 'Vacance religieuse : 1er Moharram', type: 'holiday' },
  { start: '16/06/2027', end: '17/06/2027', label: 'Collège', text: 'Examen : Examen régional', type: 'exam' },
  { start: '23/06/2027', end: '24/06/2027', label: 'Primaire', text: 'Examen : Examen normalisé provincial', type: 'exam' },
  { start: '03/07/2027', end: '04/07/2027', label: 'Lycée', text: 'Rattrapage : 1ère Bac', type: 'exam' },
  { start: '06/07/2027', end: '09/07/2027', label: 'Lycée', text: 'Rattrapage : 2ème Bac', type: 'exam' },
  { start: '10/07/2027', end: '10/07/2027', label: 'Lycée', text: 'Signature du Procès-verbal de sortie', type: 'exam' }
];

const parseDate = (value) => {
  const [day, month, year] = String(value).split('/').map(Number);
  return new Date(year, month - 1, day);
};

const formatDate = (date) => `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
const getDayAndDate = (value) => {
  const date = parseDate(value);
  return `${DAY_NAMES[date.getDay()]} ${formatDate(date)}`;
};
const getEventDateLabel = (event) => event.start === event.end ? getDayAndDate(event.start) : `${getDayAndDate(event.start)} - ${getDayAndDate(event.end)}`;
const getYearForMonth = (month) => Number(month) >= 9 ? SCHOOL_START_YEAR : SCHOOL_END_YEAR;
const addSchoolYearToDates = (text) => String(text ?? '').replace(DATE_PATTERN, (_, day, month) => `${day}/${month}/${getYearForMonth(month)}`);
const getFirstDate = (text) => {
  const match = [...String(text ?? '').matchAll(FULL_DATE_PATTERN)][0];
  return match ? parseDate(match[0]) : null;
};
const isSameDate = (a, b) => a && b && a.getTime() === b.getTime();
const isInside = (date, start, end) => date >= parseDate(start) && date <= parseDate(end);

const setEventEntry = (entry, event) => {
  const dateElement = entry.querySelector('.homework-date');
  const textElement = entry.querySelector('.homework-text');
  const subjectElement = entry.querySelector('.homework-subject');
  if (dateElement) dateElement.textContent = getEventDateLabel(event);
  if (textElement) textElement.textContent = event.text;
  if (subjectElement) subjectElement.innerHTML = `<div style="display:grid;grid-template-columns:52px 1fr;align-items:center;gap:6px;min-height:24px;padding:4px 7px;border:1px solid rgba(63,64,80,.18);border-radius:8px;background:rgba(63,64,80,.045);font-family:Arial,sans-serif;line-height:1"><span style="display:inline-flex;align-items:center;justify-content:center;min-width:72px;height:22px;border-radius:999px;background:var(--homework-color);color:white;font-size:12px;font-weight:900;white-space:nowrap">${event.label}</span><span></span></div>`;
  entry.classList.toggle('cahier-exam-entry', event.type === 'exam');
  entry.classList.toggle('cahier-extra-holiday-entry', event.type === 'holiday');
};

const updateDisplayedDates = () => {
  document.querySelectorAll('.cahier-header input[aria-label="Année scolaire automatique"]').forEach((input) => {
    input.value = 'Année scolaire : 2026 / 2027';
  });

  const entries = [...document.querySelectorAll('.homework-entry')];
  entries.forEach((entry) => {
    const dateElement = entry.querySelector('.homework-date');
    if (!dateElement) return;
    dateElement.textContent = addSchoolYearToDates(dateElement.textContent);
    const firstDate = getFirstDate(dateElement.textContent);
    if (!firstDate || firstDate < SCHOOL_START_DATE || firstDate > SCHOOL_END_DATE) {
      entry.remove();
      return;
    }

    const matchingEvents = CANONICAL_EVENTS.filter((event) => isSameDate(firstDate, parseDate(event.start)));
    const currentText = entry.querySelector('.homework-text')?.textContent || '';
    const exactEvent = matchingEvents.find((event) => currentText.includes(event.text.replace(/^.*?:\s*/, ''))) || matchingEvents[0];
    if (exactEvent) {
      setEventEntry(entry, exactEvent);
      return;
    }

    const blockingHoliday = CANONICAL_EVENTS.find((event) => event.type === 'holiday' && isInside(firstDate, event.start, event.end));
    if (blockingHoliday) entry.remove();
    else dateElement.textContent = getDayAndDate(formatDate(firstDate));
  });

  document.querySelectorAll('.cahier-exams-list tbody tr').forEach((row) => {
    Array.from(row.cells).slice(0, 2).forEach((cell) => {
      cell.textContent = addSchoolYearToDates(cell.textContent);
    });
  });

  document.querySelectorAll('.homework-page').forEach((page) => {
    if (!page.querySelector('.homework-entry')) page.remove();
  });
};

export default function TabWithFullDates() {
  useEffect(() => {
    updateDisplayedDates();
    const observer = new MutationObserver(updateDisplayedDates);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return <>
    <style>{`
      .homework-date {
        border-bottom: 2px dotted rgba(63, 64, 80, 0.5) !important;
        padding-bottom: 8px !important;
      }
    `}</style>
    <Tab />
  </>;
}
