/* ── TAB SWITCHING ── */
function switchTab(name, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + name).classList.add('active');
}

/* ── EDIT OVERLAY ── */
function openEdit() {
  const overlay = document.getElementById('editOverlay');
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // sync form values from current profile
  document.getElementById('editFirstName').value = document.getElementById('infoName').textContent.split(' ')[0];
  document.getElementById('editLastName').value = document.getElementById('infoName').textContent.split(' ')[1] || '';
  document.getElementById('editMobile').value = document.getElementById('infoMobile').textContent;
  document.getElementById('editNid').value = document.getElementById('infoNid').textContent;
}

function closeEdit() {
  document.getElementById('editOverlay').style.display = 'none';
  document.body.style.overflow = '';
}

/* ── SAVE PROFILE ── */
function saveProfile() {
  const fn = document.getElementById('editFirstName').value.trim();
  const ln = document.getElementById('editLastName').value.trim();
  const mob = document.getElementById('editMobile').value.trim();
  const nid = document.getElementById('editNid').value.trim();
  const city = document.getElementById('editCity').value;

  if (!fn || !ln || !mob) {
    showToast('لطفاً فیلدهای اجباری را تکمیل کنید', false);
    return;
  }

  const fullName = fn + ' ' + ln;

  // update profile card
  document.getElementById('infoName').textContent = fullName;
  document.getElementById('infoMobile').textContent = mob;
  document.getElementById('infoNid').textContent = nid;
  document.getElementById('infoCity').textContent = city;
  document.getElementById('profileName').textContent = fullName;
  document.getElementById('profileMobile').textContent = mob;

  // avatar initial
  document.querySelectorAll('.avatar').forEach(a => {
    if (!a.querySelector('img')) a.textContent = fn[0] || 'ک';
  });
  document.querySelector('.topbar-avatar').textContent = fn[0] || 'ک';
  document.querySelector('.topbar-greeting strong').textContent = fullName;

  closeEdit();
  showToast('اطلاعات پروفایل با موفقیت ذخیره شد');
}

/* ── CANCEL APPOINTMENT ── */
function cancelAppt(btn) {
  const card = btn.closest('.appt-card');
  const bizName = card.querySelector('.appt-biz').textContent;
  if (!confirm(`آیا از لغو نوبت "${bizName}" اطمینان دارید؟`)) return;
  card.style.transition = 'opacity 0.35s, transform 0.35s';
  card.style.opacity = '0';
  card.style.transform = 'translateX(20px)';
  setTimeout(() => card.remove(), 350);
  showToast('نوبت با موفقیت لغو شد');
}

/* ── TOAST ── */
function showToast(msg, success = true) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.style.background = success ? 'var(--navy)' : '#c0392b';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

/* ── ESC to close ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeEdit();
});
