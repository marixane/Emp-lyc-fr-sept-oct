var gradingMarkActive = false;
var gradingMarkStartedAt = 0;
var gradingMarkBlockUntil = 0;

function isGradingMark(target) {
  return target && target.closest && target.closest('.bar-mark');
}

function isBarRibbonArea(target) {
  return target && target.closest && (target.closest('.bar-mark') || target.closest('.bar-buttons'));
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
    gradingMarkStartedAt = Date.now();
    blockNextPhotoClick(700);
    event.stopPropagation();
  }
}, true);

document.addEventListener('mouseup', function (event) {
  if (gradingMarkActive) {
    blockNextPhotoClick(700);
    event.preventDefault();
    event.stopPropagation();
    setTimeout(function () {
      gradingMarkActive = false;
    }, 350);
  }
}, true);

document.addEventListener('click', function (event) {
  var shouldBlock = gradingMarkActive || Date.now() < gradingMarkBlockUntil || isBarRibbonArea(event.target);
  if (shouldBlock && isPhotoZone(event.target)) {
    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();
    return;
  }

  if (isBarRibbonArea(event.target) && Date.now() - gradingMarkStartedAt < 900) {
    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();
  }
}, true);

document.addEventListener('dragstart', function (event) {
  if (isGradingMark(event.target)) {
    event.preventDefault();
    event.stopPropagation();
  }
}, true);
