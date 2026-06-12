const timeButtons = document.querySelectorAll('.time-btn');

timeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const parentGroup = btn.closest('.appointment-group');
    if (!parentGroup) return;

    parentGroup.querySelectorAll('.time-btn').forEach(b => {
      b.classList.remove('selected');
    });

    btn.classList.add('selected');
  });
});
