// ========================================
// بخش ۱: پر کردن سلکت‌های ساعت
// ========================================

// ─── ساعت‌ها را پر کن ───────────────────────────────────────
// تابع برای پر کردن لیست ساعت‌ها در سلکت‌های شروع، پایان و استراحت
function fillTimeSelects() {
  // آرایه包含 شناسه‌های سلکت‌هایی که باید ساعت در آنها پر شود
  const selects = ['openTime', 'closeTime', 'breakStart', 'breakEnd'];

  // حلقه روی هر سلکت
  selects.forEach(id => {
    const el = document.getElementById(id);           // دریافت المان سلکت
    const first = el.options[0].cloneNode(true);      // ذخیره گزینه اول (placeholder)
    el.innerHTML = '';                                // پاک کردن محتوای قبلی
    el.appendChild(first);                            // اضافه کردن دوباره گزینه اول

    // حلقه برای ساعت‌ها از ۰ تا ۲۳
    for (let h = 0; h < 24; h++) {
      // حلقه برای دقیقه‌ها با پله ۳۰ دقیقه (۰ و ۳۰)
      for (let m = 0; m < 60; m += 30) {
        const hh = String(h).padStart(2, '0');        // تبدیل ساعت به دو رقم (مثل ۰۹)
        const mm = String(m).padStart(2, '0');        // تبدیل دقیقه به دو رقم (مثل ۳۰)
        const val = `${hh}:${mm}`;                    // مقدار نهایی مثل "09:30"
        const opt = document.createElement('option'); // ساخت گزینه جدید
        opt.value = val;                              // تنظیم مقدار گزینه
        opt.textContent = val;                        // تنظیم متن نمایشی گزینه
        el.appendChild(opt);                          // اضافه کردن به سلکت
      }
    }
  });
}

// اجرای تابع برای پر کردن سلکت‌ها هنگام بارگذاری صفحه
fillTimeSelects();

// ========================================
// بخش ۲: توابع کمکی تبدیل اعداد
// ========================================

// ─── اعداد فارسی ────────────────────────────────────────────
// تابع تبدیل اعداد انگلیسی به فارسی
function toPersian(n) {
  // جایگزینی هر رقم انگلیسی با رقم فارسی متناظر
  return String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
}

// ========================================
// بخش ۳: شمارنده کاراکتر فیلدها
// ========================================

// ─── شمارشگر کاراکتر ────────────────────────────────────────
// رویداد تایپ در فیلد نام کسب‌وکار
document.getElementById('bizName').addEventListener('input', function () {
  // به‌روزرسانی نمایش تعداد کاراکترها به فارسی
  document.getElementById('nameHint').textContent =
    `${toPersian(this.value.length)} / ${toPersian(80)} کاراکتر`;
});

// رویداد تایپ در فیلد توضیحات کسب‌وکار
document.getElementById('bizDesc').addEventListener('input', function () {
  // به‌روزرسانی نمایش تعداد کاراکترها به فارسی
  document.getElementById('descHint').textContent =
    `${toPersian(this.value.length)} / ${toPersian(500)} کاراکتر`;
});

// ========================================
// بخش ۴: فرمت تاریخ شمسی
// ========================================

// ─── فرمت تاریخ شمسی ────────────────────────────────────────
// رویداد تایپ در فیلد تاریخ تأسیس
document.getElementById('bizDate').addEventListener('input', function () {
  // حذف هر کاراکتر غیر عددی (فارسی یا انگلیسی)
  let val = this.value.replace(/[^\d۰-۹]/g, '');

  // تبدیل اعداد فارسی به انگلیسی برای پردازش
  val = val.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));

  // اضافه کردن اسلش بعد از سال (۴ رقم اول)
  if (val.length > 4) val = val.slice(0, 4) + '/' + val.slice(4);

  // اضافه کردن اسلش بعد از ماه (۷ رقم اول)
  if (val.length > 7) val = val.slice(0, 7) + '/' + val.slice(7);

  // محدودیت حداکثر ۱۰ رقم (۱۳۹۹/۱۲/۲۵)
  if (val.length > 10) val = val.slice(0, 10);

  // تبدیل مجدد به اعداد فارسی برای نمایش
  this.value = val.replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
});

// ========================================
// بخش ۵: آپلود و پیش‌نمایش تصویر
// ========================================

// ─── آپلود تصویر ─────────────────────────────────────────────
// دریافت المان‌های مربوط به آپلود تصویر
const imageInput = document.getElementById('imageInput');     // input فایل
const uploadArea = document.getElementById('uploadArea');     // ناحیه آپلود
const previewWrap = document.getElementById('previewWrap');   // کانتینر پیش‌نمایش
const previewImg = document.getElementById('previewImg');     // تصویر پیش‌نمایش

// رویداد تغییر فایل (انتخاب فایل توسط کاربر)
imageInput.addEventListener('change', handleImageSelect);

// رویداد کشیدن فایل روی ناحیه آپلود
uploadArea.addEventListener('dragover', e => {
  e.preventDefault();                     // جلوگیری از رفتار پیش‌فرض
  uploadArea.classList.add('drag-over');  // اضافه کردن کلاس برای تغییر استایل
});

// رویداد خروج فایل از ناحیه آپلود
uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));

// رویداد رها کردن فایل در ناحیه آپلود
uploadArea.addEventListener('drop', e => {
  e.preventDefault();                     // جلوگیری از رفتار پیش‌فرض
  uploadArea.classList.remove('drag-over'); // حذف کلاس درگ
  const file = e.dataTransfer.files[0];   // دریافت فایل رها شده
  if (file && file.type.startsWith('image/')) loadImage(file); // اگر تصویر بود بارگذاری کن
});

// تابع مدیریت انتخاب فایل
function handleImageSelect() {
  const file = imageInput.files[0];        // دریافت فایل انتخاب شده
  if (file) loadImage(file);               // اگر فایل وجود داشت بارگذاری کن
}

// تابع بارگذاری و نمایش تصویر
function loadImage(file) {
  const reader = new FileReader();          // ایجاد شیء FileReader
  reader.onload = e => {                   // وقتی بارگذاری کامل شد
    previewImg.src = e.target.result;      // تنظیم منبع تصویر
    uploadArea.style.display = 'none';     // مخفی کردن ناحیه آپلود
    previewWrap.classList.add('visible');  // نمایش پیش‌نمایش
  };
  reader.readAsDataURL(file);              // خواندن فایل به صورت DataURL
}

// تابع تغییر تصویر (باز کردن دوباره دیالوگ انتخاب فایل)
function changeImage() {
  imageInput.click();                      // کلیک روی input فایل
}

// تابع حذف تصویر
function removeImage() {
  previewImg.src = '';                     // پاک کردن منبع تصویر
  imageInput.value = '';                   // پاک کردن مقدار input
  previewWrap.classList.remove('visible'); // مخفی کردن پیش‌نمایش
  uploadArea.style.display = '';           // نمایش دوباره ناحیه آپلود
}

// ========================================
// بخش ۶: خلاصه ساعات کاری
// ========================================

// ─── خلاصه ساعات کاری ──────────────────────────────────────
// آبجکت包含 نام روزها به فارسی
const dayNames = {
  saturday: 'شنبه', sunday: 'یک‌شنبه', monday: 'دوشنبه',
  tuesday: 'سه‌شنبه', wednesday: 'چهارشنبه', thursday: 'پنج‌شنبه', friday: 'جمعه'
};

// تابع به‌روزرسانی خلاصه ساعات کاری
function updateSummary() {
  const checks = document.querySelectorAll('.day-check:checked'); // روزهای انتخاب شده
  const openT = document.getElementById('openTime').value;        // ساعت شروع
  const closeT = document.getElementById('closeTime').value;      // ساعت پایان
  const breakS = document.getElementById('breakStart').value;     // شروع استراحت
  const breakE = document.getElementById('breakEnd').value;       // پایان استراحت
  const box = document.getElementById('summaryBox');              // کانتینر خلاصه
  const txt = document.getElementById('summaryText');             // متن خلاصه

  // اگر روزی انتخاب نشده یا ساعت شروع/پایان خالی است، خلاصه را مخفی کن
  if (!checks.length || !openT || !closeT) { box.style.display = 'none'; return; }

  // ساخت متن روزهای انتخاب شده
  const selectedDays = Array.from(checks).map(c => dayNames[c.value]).join('، ');
  let html = `<strong>📆 روزهای کاری:</strong> ${selectedDays}<br>`;
  html += `<strong>🕐 ساعت کار:</strong> ${openT} تا ${closeT}`;
  // اگر استراحت وارد شده بود، آن را هم اضافه کن
  if (breakS && breakE) html += `<br><strong>☕ استراحت:</strong> ${breakS} تا ${breakE}`;
  txt.innerHTML = html;          // قرار دادن متن در صفحه
  box.style.display = 'block';   // نمایش خلاصه
}

// اضافه کردن رویداد change به همه چک‌باکس‌های روزها
document.querySelectorAll('.day-check').forEach(c => c.addEventListener('change', updateSummary));

// اضافه کردن رویداد change به سلکت‌های ساعت
document.getElementById('openTime').addEventListener('change', updateSummary);
document.getElementById('closeTime').addEventListener('change', updateSummary);
document.getElementById('breakStart').addEventListener('change', updateSummary);
document.getElementById('breakEnd').addEventListener('change', updateSummary);

// ========================================
// بخش ۷: اعتبارسنجی فرم
// ========================================

// ─── Validation ──────────────────────────────────────────────
// تابع اصلی اعتبارسنجی فرم
function validate() {
  // دریافت مقادیر فیلدها
  const name = document.getElementById('bizName').value.trim();      // نام کسب‌وکار
  const desc = document.getElementById('bizDesc').value.trim();      // توضیحات
  const date = document.getElementById('bizDate').value.trim();      // تاریخ تأسیس
  const openT = document.getElementById('openTime').value;           // ساعت شروع
  const closeT = document.getElementById('closeTime').value;         // ساعت پایان
  const bizType = document.getElementById('bizType').value;          // نوع کسب‌وکار
  const hasDays = document.querySelectorAll('.day-check:checked').length > 0; // آیا روزی انتخاب شده؟

  // بررسی نام کسب‌وکار
  if (!name) { shake('bizName'); showToast('⚠️ نام کسب‌وکار را وارد کنید', true); return false; }

  // بررسی توضیحات
  if (!desc) { shake('bizDesc'); showToast('⚠️ توضیح مختصر را وارد کنید', true); return false; }

  // بررسی تاریخ تأسیس
  if (!date) { shake('bizDate'); showToast('⚠️ تاریخ تأسیس را وارد کنید', true); return false; }

  // بررسی انتخاب حداقل یک روز کاری
  if (!hasDays) { showToast('⚠️ حداقل یک روز کاری انتخاب کنید', true); return false; }

  // بررسی ساعت شروع
  if (!openT) { shake('openTime'); showToast('⚠️ ساعت شروع کار را انتخاب کنید', true); return false; }

  // بررسی ساعت پایان
  if (!closeT) { shake('closeTime'); showToast('⚠️ ساعت پایان کار را انتخاب کنید', true); return false; }

  // بررسی نوع کسب‌وکار
  if (!bizType) { shake('bizType'); showToast('⚠️ نوع کسب‌وکار را انتخاب کنید', true); return false; }

  // بررسی منطقی بودن ساعت (پایان باید بعد از شروع باشد)
  if (openT >= closeT) { showToast('⚠️ ساعت پایان باید بعد از شروع باشد', true); return false; }

  // همه چیز درست است
  return true;
}

// تابع تکان دادن فیلد (برای جلب توجه کاربر)
function shake(id) {
  const el = document.getElementById(id);   // دریافت المان
  if (!el) return;                           // اگر المان وجود نداشت، خارج شو

  // ایجاد انیمیشن تکان خوردن با تغییر موقعیت
  el.style.transition = 'transform .1s';
  el.style.transform = 'translateX(6px)';   // حرکت به راست
  setTimeout(() => el.style.transform = 'translateX(-6px)', 100); // حرکت به چپ
  setTimeout(() => el.style.transform = 'translateX(4px)', 200);  // حرکت به راست (کمتر)
  setTimeout(() => el.style.transform = 'translateX(0)', 300);     // بازگشت به حالت اول

  // اگر المان focus دارد و select نیست، فوکوس کن
  if (!el.focus && el.tagName !== 'SELECT') {
    el.focus();
  }
}

// ========================================
// بخش ۸: پیام توست (اعلان)
// ========================================

// ─── Toast ───────────────────────────────────────────────────
// تابع نمایش پیام موقت (توست)
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');    // دریافت المان توست
  const msgEl = document.getElementById('toastMsg'); // دریافت المان متن توست
  msgEl.textContent = msg;                           // تنظیم متن پیام

  // تنظیم رنگ پس‌زمینه بر اساس نوع پیام (خطا یا موفقیت)
  toast.style.background = isError
    ? 'linear-gradient(135deg, #7b1a1a, #c0392b)'  // رنگ قرمز برای خطا
    : 'linear-gradient(135deg, #0a2240, #1B4F72)'; // رنگ آبی برای موفقیت

  toast.classList.add('show');                       // نمایش توست

  // بعد از ۳ ثانیه توست را مخفی کن
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ========================================
// بخش ۹: ارسال فرم
// ========================================

// ─── Submit ──────────────────────────────────────────────────
// تابع ثبت نهایی فرم
function submitForm() {
  // اگر اعتبارسنجی ناموفق بود، خارج شو
  if (!validate()) return;

  // شبیه‌سازی ارسال به سرور
  const btn = document.querySelector('.btn-primary');  // دریافت دکمه ثبت
  btn.disabled = true;                                 // غیرفعال کردن دکمه
  btn.textContent = '⏳ در حال ثبت...';                // تغییر متن دکمه

  // شبیه‌سازی تأخیر شبکه (۱.۵ ثانیه)
  setTimeout(() => {
    btn.disabled = false;                              // فعال کردن دکمه
    btn.textContent = '✅ ثبت کسب‌وکار';               // برگرداندن متن اصلی
    showToast('✅ کسب‌وکار با موفقیت ثبت شد!');        // نمایش پیام موفقیت


    document.getElementById('step2').classList.remove('active');
    document.getElementById('step2').classList.add('done');
    document.getElementById('step2').querySelector('.step-circle').textContent = '✓';
    document.getElementById('step3').classList.remove('active');
    document.getElementById('step3').classList.add('done');
    document.getElementById('step3').querySelector('.step-circle').textContent = '✓';
    document.getElementById('step4').classList.add('active');
    document.getElementById('step4').querySelector('.step-circle').textContent = '✓';
  }, 1500);

  ; window.location.href = '../../index.html';
}

// ========================================
// بخش ۱۰: reset کردن فرم
// ========================================

// ─── Reset ───────────────────────────────────────────────────
// تابع پاک کردن تمام فیلدهای فرم
function resetForm() {
  // پاک کردن فیلدهای متنی
  document.getElementById('bizName').value = '';
  document.getElementById('bizDesc').value = '';
  document.getElementById('bizDate').value = '';

  // reset کردن سلکت نوع کسب‌وکار
  document.getElementById('bizType').value = '';
  document.getElementById('bizType').selectedIndex = 0;

  // reset کردن سلکت‌های ساعت
  document.getElementById('openTime').selectedIndex = 0;
  document.getElementById('closeTime').selectedIndex = 0;
  document.getElementById('breakStart').selectedIndex = 0;
  document.getElementById('breakEnd').selectedIndex = 0;

  // برداشتن تیک همه چک‌باکس‌های روزها
  document.querySelectorAll('.day-check').forEach(c => c.checked = false);

  // حذف تصویر آپلود شده
  removeImage();

  // مخفی کردن خلاصه ساعات کاری
  document.getElementById('summaryBox').style.display = 'none';

  // reset کردن شمارنده کاراکترها
  document.getElementById('nameHint').textContent = '۰ / ۸۰ کاراکتر';
  document.getElementById('descHint').textContent = '۰ / ۵۰۰ کاراکتر';

  // نمایش پیام موفقیت آمیز بودن reset
  showToast('🔄 فرم با موفقیت پاک شد');
}