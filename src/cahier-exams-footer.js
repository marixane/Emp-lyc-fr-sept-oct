const EXAM_ROWS = [
  ['Religieuse', 'Aïd Al Mawlid Annabaoui', '05–06 septembre 2025', 'Fête / vacance'],
  ['Scolaire', 'Vacances intermédiaires 1', '19–26 octobre 2025', 'Vacance'],
  ['Nationale', 'Marche Verte', '06 novembre 2025', 'Fête nationale'],
  ['Nationale', 'Fête de l’Indépendance', '18 novembre 2025', 'Fête nationale'],
  ['Scolaire', 'Vacances intermédiaires 2', '07–14 décembre 2025', 'Vacance'],
  ['Nationale', 'Nouvel An', '01 janvier 2026', 'Fête nationale'],
  ['Nationale', 'Manifeste de l’Indépendance', '11 janvier 2026', 'Fête nationale'],
  ['Nationale', 'Nouvel An Amazigh', '14 janvier 2026', 'Fête nationale'],
  ['Primaire', 'Examen normalisé local', '20–24 janvier 2026', 'Examen'],
  ['Scolaire', 'Vacances de mi-année', '25 janvier – 01 février 2026', 'Vacance'],
  ['Scolaire', 'Vacances intermédiaires 3', '15–22 mars 2026', 'Vacance'],
  ['Religieuse', 'Aïd Al-Fitr', '20–22 mars 2026', 'Fête / vacance'],
  ['Nationale', 'Fête du Travail', '01 mai 2026', 'Fête nationale'],
  ['Scolaire', 'Vacances intermédiaires 4', '03–10 mai 2026', 'Vacance'],
  ['Religieuse', 'Aïd Al-Adha', '27–30 mai 2026', 'Fête / vacance'],
  ['Lycée', 'Examen régional 1ère Bac', '29–30 mai 2026', 'Examen'],
  ['Lycée', 'Examen national 2ème Bac', '01–04 juin 2026', 'Examen'],
  ['Religieuse', '1er Moharram', '16 juin 2026', 'Fête / vacance'],
  ['Collège', 'Examen régional', '16–17 juin 2026', 'Examen'],
  ['Primaire', 'Examen normalisé provincial', '23–24 juin 2026', 'Examen'],
  ['Lycée', 'Rattrapage 1ère Bac', '03–04 juillet 2026', 'Rattrapage'],
  ['Lycée', 'Rattrapage 2ème Bac', '06–09 juillet 2026', 'Rattrapage']
];

const makeExamCell = (text, header = false) => {
  const cell = document.createElement(header ? 'th' : 'td');
  cell.textContent = text;
  if (!header) {
    cell.contentEditable = 'true';
    cell.setAttribute('suppresscontenteditablewarning', 'true');
    cell.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        cell.blur();
      }
    });
  }
  return cell;
};

const buildExamTable = () => {
  const wrap = document.createElement('div');
  wrap.className = 'cahier-exams-footer';

  const title = document.createElement('div');
  title.className = 'cahier-exams-title';
  title.textContent = 'Tableau des vacances, fêtes et examens 2025-2026';

  const table = document.createElement('table');
  table.className = 'cahier-exams-table';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['Catégorie / Cycle', 'Événement', 'Date', 'Type'].forEach((text) => headerRow.append(makeExamCell(text, true)));
  thead.append(headerRow);

  const tbody = document.createElement('tbody');
  EXAM_ROWS.forEach((row) => {
    const tr = document.createElement('tr');
    row.forEach((text) => tr.append(makeExamCell(text)));
    tbody.append(tr);
  });

  table.append(thead, tbody);
  wrap.append(title, table);
  return wrap;
};

const getTimetablePage = () => Array.from(document.querySelectorAll('.cahier-page'))
  .find((page) => page.querySelector('.timetable-table'));

const applyCahierExamsFooter = () => {
  if (!document.body.classList.contains('cahier-tab-active')) return false;
  const page = getTimetablePage();
  if (!page) return false;

  page.querySelectorAll('.cahier-footer').forEach((footer) => footer.remove());

  if (!page.querySelector('.cahier-exams-footer')) page.append(buildExamTable());
  return true;
};

let examsFooterRetryCount = 0;
const scheduleCahierExamsFooter = () => window.requestAnimationFrame(() => {
  const done = applyCahierExamsFooter();
  if (!done && examsFooterRetryCount < 18) {
    examsFooterRetryCount += 1;
    window.setTimeout(scheduleCahierExamsFooter, 250);
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', scheduleCahierExamsFooter, { once: true });
} else {
  scheduleCahierExamsFooter();
}

document.addEventListener('click', () => window.setTimeout(scheduleCahierExamsFooter, 120), { passive: true });
