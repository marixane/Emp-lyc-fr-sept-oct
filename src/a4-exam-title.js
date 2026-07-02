function removeA4ExamPanelTitle() {
  var title = document.querySelector('.panel .eyebrow');
  if (title) {
    title.remove();
  }
}

removeA4ExamPanelTitle();
setTimeout(removeA4ExamPanelTitle, 100);
setTimeout(removeA4ExamPanelTitle, 300);
setTimeout(removeA4ExamPanelTitle, 700);
setTimeout(removeA4ExamPanelTitle, 1200);
