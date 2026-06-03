// ─── ساعت‌ها را پر کن ───────────────────────────────────────
function fillTimeSelects() {
  const selects = ['openTime','closeTime','breakStart','breakEnd'];
  selects.forEach(id => {
    const el = document.getElementById(id);
    const first = el.options[0].cloneNode(true);
    el.innerHTML = '';
    el.appendChild(first);
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hh = String(h).padStart(2,'0');
        const mm = String(m).padStart(2,'0');
        const val = `${hh}:${mm}`;
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = val;
        el.appendChild(opt);
      }
    }
  });
}
fillTimeSelects();

// ─── اعداد فارسی ────────────────────────────────────────────
function toPersian(n) {
  return String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
}

// ─── شمارشگر کاراکتر ────────────────────────────────────────
document.getElementById('bizName').addEventListener('input', function() {
  document.getElementById('nameHint').textContent =
    `${toPersian(this.value.length)} / ${toPersian(80)} کاراکتر`;
});
document.getElementById('bizDesc').addEventListener('input', function() {
  document.getElementById('descHint').textContent =
    `${toPersian(this.value.length)} / ${toPersian(500)} کاراکتر`;
});

// ─── فرمت تاریخ شمسی ────────────────────────────────────────
document.getElementById('bizDate').addEventListener('input', function() {
  let val = this.value.replace(/[^\d۰-۹]/g,'');
  val = val.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
  if (val.length > 4) val = val.slice(0,4) + '/' + val.slice(4);
  if (val.length > 7) val = val.slice(0,7) + '/' + val.slice(7);
  if (val.length > 10) val = val.slice(0,10);
  // تبدیل به فارسی
  this.value = val.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
});

// ─── آپلود تصویر ─────────────────────────────────────────────
const imageInput = document.getElementById('imageInput');
const uploadArea  = document.getElementById('uploadArea');
const previewWrap = document.getElementById('previewWrap');
const previewImg  = document.getElementById('previewImg');

imageInput.addEventListener('change', handleImageSelect);

uploadArea.addEventListener('dragover', e => {
  e.preventDefault();
  uploadArea.classList.add('drag-over');
});
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
uploadArea.addEventListener('drop', e => {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) loadImage(file);
});

function handleImageSelect() {
  const file = imageInput.files[0];
  if (file) loadImage(file);
}

function loadImage(file) {
  const reader = new FileReader();
  reader.onload = e => {
    previewImg.src = e.target.result;
    uploadArea.style.display = 'none';
    previewWrap.classList.add('visible');
  };
  reader.readAsDataURL(file);
}

function changeImage() {
  imageInput.click();
}

function removeImage() {
  previewImg.src = '';
  imageInput.value = '';
  previewWrap.classList.remove('visible');
  uploadArea.style.display = '';
}

// ─── خلاصه ساعات کاری ──────────────────────────────────────
const dayNames = {
  saturday:'شنبه', sunday:'یک‌شنبه', monday:'دوشنبه',
  tuesday:'سه‌شنبه', wednesday:'چهارشنبه', thursday:'پنج‌شنبه', friday:'جمعه'
};

function updateSummary() {
  const checks   = document.querySelectorAll('.day-check:checked');
  const openT    = document.getElementById('openTime').value;
  const closeT   = document.getElementById('closeTime').value;
  const breakS   = document.getElementById('breakStart').value;
  const breakE   = document.getElementById('breakEnd').value;
  const box      = document.getElementById('summaryBox');
  const txt      = document.getElementById('summaryText');

  if (!checks.length || !openT || !closeT) { box.style.display='none'; return; }

  const selectedDays = Array.from(checks).map(c => dayNames[c.value]).join('، ');
  let html = `<strong>📆 روزهای کاری:</strong> ${selectedDays}<br>`;
  html += `<strong>🕐 ساعت کار:</strong> ${openT} تا ${closeT}`;
  if (breakS && breakE) html += `<br><strong>☕ استراحت:</strong> ${breakS} تا ${breakE}`;
  txt.innerHTML = html;
  box.style.display = 'block';
}

document.querySelectorAll('.day-check').forEach(c => c.addEventListener('change', updateSummary));
document.getElementById('openTime').addEventListener('change', updateSummary);
document.getElementById('closeTime').addEventListener('change', updateSummary);
document.getElementById('breakStart').addEventListener('change', updateSummary);
document.getElementById('breakEnd').addEventListener('change', updateSummary);

// ─── Validation ──────────────────────────────────────────────
function validate() {
  const name  = document.getElementById('bizName').value.trim();
  const desc  = document.getElementById('bizDesc').value.trim();
  const date  = document.getElementById('bizDate').value.trim();
  const openT = document.getElementById('openTime').value;
  const closeT= document.getElementById('closeTime').value;
  const hasImg= previewWrap.classList.contains('visible');
  const hasDays = document.querySelectorAll('.day-check:checked').length > 0;

  if (!name)    { shake('bizName');   showToast('⚠️ نام کسب‌وکار را وارد کنید', true); return false; }
  if (!hasImg)  { shake('uploadArea'); showToast('⚠️ تصویر کسب‌وکار را آپلود کنید', true); return false; }
  if (!desc)    { shake('bizDesc');   showToast('⚠️ توضیح مختصر را وارد کنید', true); return false; }
  if (!date)    { shake('bizDate');   showToast('⚠️ تاریخ تأسیس را وارد کنید', true); return false; }
  if (!hasDays) { showToast('⚠️ حداقل یک روز کاری انتخاب کنید', true); return false; }
  if (!openT)   { shake('openTime');  showToast('⚠️ ساعت شروع کار را انتخاب کنید', true); return false; }
  if (!closeT)  { shake('closeTime'); showToast('⚠️ ساعت پایان کار را انتخاب کنید', true); return false; }
  if (openT >= closeT) { showToast('⚠️ ساعت پایان باید بعد از شروع باشد', true); return false; }
  return true;
}

function shake(id) {
  const el = document.getElementById(id);
  el.style.transition = 'transform .1s';
  el.style.transform = 'translateX(6px)';
  setTimeout(() => el.style.transform = 'translateX(-6px)', 100);
  setTimeout(() => el.style.transform = 'translateX(4px)', 200);
  setTimeout(() => el.style.transform = 'translateX(0)', 300);
  el.focus && el.focus();
}

// ─── Toast ───────────────────────────────────────────────────
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toastMsg');
  msgEl.textContent = msg;
  toast.style.background = isError
    ? 'linear-gradient(135deg, #7b1a1a, #c0392b)'
    : 'linear-gradient(135deg, #0a2240, #1B4F72)';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ─── Submit ──────────────────────────────────────────────────
function submitForm() {
  if (!validate()) return;
  // شبیه‌سازی ارسال
  const btn = document.querySelector('.btn-primary');
  btn.disabled = true;
  btn.textContent = '⏳ در حال ثبت...';
  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = '✅ ثبت کسب‌وکار';
    showToast('✅ کسب‌وکار با موفقیت ثبت شد!');
    // آپدیت progress
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step2').classList.add('done');
    document.getElementById('step2').querySelector('.step-circle').textContent = '✓';
    document.getElementById('step3').classList.remove('active');
    document.getElementById('step3').classList.add('done');
    document.getElementById('step3').querySelector('.step-circle').textContent = '✓';
    document.getElementById('step4').classList.add('active');
    document.getElementById('step4').querySelector('.step-circle').textContent = '✓';
  }, 1500);
}

// ─── Reset ───────────────────────────────────────────────────
function resetForm() {
  document.getElementById('bizName').value = '';
  document.getElementById('bizDesc').value = '';
  document.getElementById('bizDate').value = '';
  document.getElementById('bizType').selectedIndex = 0;
  document.getElementById('openTime').selectedIndex = 0;
  document.getElementById('closeTime').selectedIndex = 0;
  document.getElementById('breakStart').selectedIndex = 0;
  document.getElementById('breakEnd').selectedIndex = 0;
  document.querySelectorAll('.day-check').forEach(c => c.checked = false);
  removeImage();
  document.getElementById('summaryBox').style.display = 'none';
  document.getElementById('nameHint').textContent = '۰ / ۸۰ کاراکتر';
  document.getElementById('descHint').textContent = '۰ / ۵۰۰ کاراکتر';
  showToast('🔄 فرم با موفقیت پاک شد');
}