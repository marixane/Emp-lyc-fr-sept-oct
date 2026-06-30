function isFreeHomeworkTitle() {
  var title = document.querySelector('.title-line-top');
  var value = String((title && (title.value || title.textContent)) || '').toLowerCase();
  return value.indexOf('devoir libre') !== -1 || value.indexOf('devoir à la maison') !== -1 || value.indexOf('devoir a la maison') !== -1;
}

function cleanFreeHomeworkExerciseTitles() {
  if (!isFreeHomeworkTitle()) return;

  document.querySelectorAll('.exercise-title-controls').forEach(function (title) {
    var label = title.querySelector('span:not(.points-decoration)');
    if (!label) return;

    label.textContent = 'Exercice :';
    title.querySelectorAll('button, strong, .points-decoration').forEach(function (node) {
      node.style.display = 'none';
    });
  });
}

function fixExercisePointParentheses() {
  if (isFreeHomeworkTitle()) {
    cleanFreeHomeworkExerciseTitles();
    return;
  }

  document.querySelectorAll('.exercise-title-controls').forEach(function (title) {
    title.querySelectorAll('button, strong, .points-decoration').forEach(function (node) {
      node.style.display = '';
    });
    var spans = title.querySelectorAll('.points-decoration');
    if (spans.length >= 2) {
      if (spans[0].textContent !== '(') spans[0].textContent = '(';
      if (spans[1].textContent !== ')') spans[1].textContent = ')';
    }
  });
}

fixExercisePointParentheses();
setTimeout(fixExercisePointParentheses, 100);
setTimeout(fixExercisePointParentheses, 400);
setInterval(fixExercisePointParentheses, 300);

new MutationObserver(function () {
  fixExercisePointParentheses();
}).observe(document.body, { childList: true, subtree: true, characterData: true });
