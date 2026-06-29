window.__examLanguage = window.__examLanguage || localStorage.getItem('examLanguage') || 'fr';

const FR_HEADER = {
  level: 'Classe : 2 Bac SPF',
  titleTop: 'Devoir individuel',
  titleMiddle: 'Mathématique',
  titleBottom: '',
  rightTop: 'Lycée El jamai ,Tanger',
  rightBottom: 'N° : 1 Semestre : 1'
};

const AR_HEADER = {
  level: 'قسم : 2 باك ع.ف',
  titleTop: 'فرض محروس',
  titleMiddle: 'الرياضيات',
  titleBottom: 'ذ. مروان',
  rightTop: 'ثانوية الجامعي، طنجة',
  rightBottom: 'رقم : 1 الدورة : 1'
};

function setInputValue(selector, value) {
  var input = document.querySelector(selector);
  if (!input || input.value === value) return;
  var setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
  if (setter) setter.call(input, value);
  else input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function syncHeaderLanguage() {
  var header = window.__examLanguage === 'ar' ? AR_HEADER : FR_HEADER;
  setInputValue('.inline-class-input', header.level);
  setInputValue('.title-line-top', header.titleTop);
  setInputValue('.title-line-middle', header.titleMiddle);
  setInputValue('.title-line-bottom', header.titleBottom);
  setInputValue('.right-line-top', header.rightTop);
  setInputValue('.right-line-bottom', header.rightBottom);
}

function syncLanguageButton() {
  var panel = document.querySelector('.panel');
  if (!panel) return;

  var button = document.querySelector('.language-toggle');
  if (!button) {
    button = document.createElement('button');
    button.className = 'language-toggle';
    button.type = 'button';
    button.addEventListener('click', function () {
      window.__examLanguage = window.__examLanguage === 'ar' ? 'fr' : 'ar';
      localStorage.setItem('examLanguage', window.__examLanguage);
      syncLanguageMode();
    });

    var title = panel.querySelector('.eyebrow');
    if (title && title.nextSibling) panel.insertBefore(button, title.nextSibling);
    else panel.insertBefore(button, panel.firstChild);
  }

  button.textContent = window.__examLanguage === 'ar' ? 'Français' : 'العربية';
}

function syncExerciseTitles() {
  var arabic = window.__examLanguage === 'ar';
  document.querySelectorAll('.exam-exercise:not(.blank-exercise) .exercise-title-controls > span:first-child').forEach(function (span) {
    var text = span.textContent || '';
    var match = text.match(/(?:Exercice|\u062a\u0645\u0631\u064a\u0646)\s*(\d+)/i);
    if (!match) return;
    var colon = text.indexOf(':') !== -1 || text.indexOf('\uFF1A') !== -1 ? ' : ' : '';
    var next = arabic ? '\u062a\u0645\u0631\u064a\u0646 ' + match[1] + colon : 'Exercice ' + match[1] + colon;
    if (span.textContent !== next) span.textContent = next;
  });
}

function syncLanguageMode() {
  document.body.classList.toggle('arabic-mode', window.__examLanguage === 'ar');
  document.documentElement.setAttribute('dir', 'ltr');
  syncLanguageButton();
  syncHeaderLanguage();
  syncExerciseTitles();
  if (typeof formatExercisePointLabels === 'function') formatExercisePointLabels();
}

syncLanguageMode();
setTimeout(syncLanguageMode, 100);
setTimeout(syncLanguageMode, 400);

new MutationObserver(function () {
  syncLanguageButton();
  syncExerciseTitles();
}).observe(document.body, { childList: true, subtree: true });
