function renameA4ExamTitle() {
  var title = document.querySelector('.panel .eyebrow');
  if (title && title.textContent.trim() === 'A4 Exam Maker') {
    title.textContent = 'A4 Exam';
  }
}

renameA4ExamTitle();
setTimeout(renameA4ExamTitle, 100);
setTimeout(renameA4ExamTitle, 300);
setTimeout(renameA4ExamTitle, 700);
window.setInterval(renameA4ExamTitle, 500);
