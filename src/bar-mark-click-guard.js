var gradingMarkActive = false;
var gradingMarkBlockUntil = 0;

function isGradingMark(target) {
  return target && target.closest && target.closest('.bar-mark');
}

function isPhotoZone(target) {
  return target && target.closest && target.closest('.clickable-photo-zone');
}

function blockNextPhotoClick(ms) {
  gradingMarkBlockUntil = Date.now() + (ms || 500);
}

document.addEventListener('mousedown', function (event) {
  if (isGradingMark(event.target)) {
    gradingMarkActive = true;
    blockNextPhotoClick(900);
  }
}, true);

document.addEventListener('mouseup', function () {
  if (gradingMarkActive) {
    blockNextPhotoClick(900);
    setTimeout(function () {
      gradingMarkActive = false;
    }, 350);
  }
}, true);

document.addEventListener('click', function (event) {
  if ((gradingMarkActive || Date.now() < gradingMarkBlockUntil) && isPhotoZone(event.target) && !isGradingMark(event.target)) {
    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();
  }
}, true);

document.addEventListener('dragstart', function (event) {
  if (isGradingMark(event.target)) {
    event.preventDefault();
  }
}, true);
