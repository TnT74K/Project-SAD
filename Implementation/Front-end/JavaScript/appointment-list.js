/* =====================================================
   appointment-list.js
   مدیریت لیست نوبت‌های روزانه + مودال اطلاعات مشتری
   ===================================================== */

/* ---------- داده‌ها ---------- */

// تاریخ امروز (برای مقایسه و تعیین نوع روز)
const TODAY = '۱۴۰۵/۰۳/۱۳';

// تمام نوبت‌ها به تفکیک روز
// هر آیتم شامل: نام، تلفن، کد نوبت، سرویس، ساعت، وضعیت اولیه
const DAYS_DATA = {
  '۱۴۰۵/۰۳/۱۱': [
    { name: 'حسن موسوی',    phone: '۰۹۱۲۱۱۱۲۲۳۳', code: 'A-۱۰۱', service: 'ماساژ',     time: '۰۹:۰۰', status: 'badge-green',  statusText: 'حضور یافت'  },
    { name: 'زینب نوری',    phone: '۰۹۳۵۴۴۴۵۵۶۶', code: 'A-۱۰۲', service: 'کوتاهی مو', time: '۱۱:۳۰', status: 'badge-red',    statusText: 'لغو شده'    },
  ],
  '۱۴۰۵/۰۳/۱۲': [
    { name: 'علی رضایی',    phone: '۰۹۱۰۲۲۲۳۳۴۴', code: 'A-۱۰۳', service: 'کوتاهی مو', time: '۱۰:۳۰', status: 'badge-green',  statusText: 'حضور یافت'  },
    { name: 'سارا محمدی',   phone: '۰۹۱۵۳۳۳۴۴۵۵', code: 'A-۱۰۴', service: 'رنگ مو',    time: '۱۱:۰۰', status: 'badge-yellow', statusText: 'حضور نیافت' },
    { name: 'مهدی کریمی',   phone: '۰۹۱۸۵۵۵۶۶۷۷', code: 'A-۱۰۵', service: 'اصلاح ریش', time: '۱۲:۳۰', status: 'badge-green',  statusText: 'حضور یافت'  },
    { name: 'نیلوفر احمدی', phone: '۰۹۳۰۶۶۶۷۷۸۸', code: 'A-۱۰۶', service: 'مانیکور',   time: '۱۴:۰۰', status: 'badge-red',    statusText: 'لغو شده'    },
    { name: 'رضا حسینی',    phone: '۰۹۳۷۷۷۷۸۸۹۹', code: 'A-۱۰۷', service: 'ماساژ',     time: '۱۵:۳۰', status: 'badge-red',    statusText: 'لغو شده'    },
  ],
  '۱۴۰۵/۰۳/۱۳': [
    { name: 'مریم صادقی',   phone: '۰۹۱۲۸۸۸۹۹۰۰', code: 'A-۱۰۸', service: 'پاکسازی',   time: '۰۹:۳۰', status: 'badge-blue', statusText: 'جدید' },
    { name: 'امیر تهرانی',  phone: '۰۹۱۹۹۹۹۰۰۱۱', code: 'A-۱۰۹', service: 'کوتاهی مو', time: '۱۲:۰۰', status: 'badge-blue', statusText: 'جدید' },
  ],
  '۱۴۰۵/۰۳/۱۴': [
    { name: 'فاطمه کرمی',   phone: '۰۹۱۶۰۰۰۱۱۲۲', code: 'A-۱۱۰', service: 'رنگ مو',    time: '۱۰:۰۰', status: 'badge-blue', statusText: 'جدید' },
  ],
};

/* ---------- وضعیت جاری ---------- */

// آرایه‌ای از تاریخ‌ها برای ناوبری با دکمه‌های قبل/بعد
const DATES = Object.keys(DAYS_DATA);

// ایندکس روز جاری در آرایه DATES
let currentIndex = DATES.indexOf(TODAY);

/* ---------- نگاشت وضعیت‌ها ---------- */

// متن و کلاس badge و row برای هر نوع وضعیت
const STATUS_MAP = {
  present: { text: 'حضور یافت',  cls: 'badge-green',  row: 'row-green'  },
  absent:  { text: 'حضور نیافت', cls: 'badge-yellow', row: 'row-yellow' },
  cancel:  { text: 'لغو شده',    cls: 'badge-red',    row: 'row-red'    },
};

/* ---------- توابع رندر ---------- */

/**
 * دکمه‌های عملیات را بر اساس نوع روز برمی‌گرداند:
 * - past   (گذشته): بدون دکمه
 * - future (آینده): فقط لغو و پاک‌کردن
 * - today  (امروز): همه دکمه‌ها
 */
function getActionButtons(dateType) {
  if (dateType === 'past') return '';
  if (dateType === 'future') return `
    <button class="btn-action btn-cancel"  onclick="setStatus(this,'cancel')">🚫 لغو</button>
    <button class="btn-action btn-reset"   onclick="clearStatus(this)">↺ پاک</button>`;
  return `
    <button class="btn-action btn-present" onclick="setStatus(this,'present')">✔ حضور</button>
    <button class="btn-action btn-cancel"  onclick="setStatus(this,'cancel')">✖ لغو</button>
    <button class="btn-action btn-absent"  onclick="setStatus(this,'absent')">— عدم حضور</button>
    <button class="btn-action btn-reset"   onclick="clearStatus(this)">↺ پاک</button>`;
}

/**
 * جدول نوبت‌ها را برای روز جاری (currentIndex) رندر می‌کند.
 * - تاریخ نمایشی را به‌روز می‌کند
 * - کلاس not-today را در صورت نیاز اعمال می‌کند
 * - ردیف‌های جدول را از DAYS_DATA می‌سازد
 */
function render() {
  const date = DATES[currentIndex];
  const rows = DAYS_DATA[date] || [];

  // تعیین نوع روز برای کنترل دکمه‌های عملیات
  const dateType = date === TODAY ? 'today' : date < TODAY ? 'past' : 'future';

  // به‌روزرسانی عنوان تاریخ در هدر کارت
  document.getElementById('currentDate').textContent = date;

  // اگر روز انتخابی امروز نباشد، کلاس not-today اعمال می‌شود
  document.querySelector('.card').classList.toggle('not-today', date !== TODAY);

  // ساخت ردیف‌های جدول
  // data-init-* برای بازگشت به وضعیت اولیه هنگام کلیک «پاک» ذخیره می‌شود
  document.getElementById('appointmentsBody').innerHTML = rows.map((r, i) => `
    <tr data-init-badge-class="badge ${r.status}" data-init-badge-text="${r.statusText}">
      <td data-label="#">${toPersianNum(i + 1)}</td>

      <!-- نام مشتری: کلیک‌پذیر است و مودال اطلاعات را باز می‌کند -->
      <td data-label="مشتری">
        <span class="customer-link"
              onclick="openModal('${r.name}','${r.phone}','${r.code}')">
          ${r.name}
        </span>
      </td>

      <td data-label="سرویس">${r.service}</td>
      <td data-label="تاریخ">${date}</td>
      <td data-label="ساعت">${r.time}</td>

      <!-- کد تأییدیه اختصاصی هر نوبت -->
      <td data-label="کد تأییدیه" class="confirm-code">${r.code}</td>

      <td data-label="وضعیت"><span class="badge ${r.status}">${r.statusText}</span></td>
      <td data-label="عملیات"><div class="actions">${getActionButtons(dateType)}</div></td>
    </tr>`).join('');
}

/* ---------- ناوبری بین روزها ---------- */

/**
 * روز نمایشی را تغییر می‌دهد.
 * dir = 1  → یک روز به جلو
 * dir = -1 → یک روز به عقب
 */
function changeDay(dir) {
  const next = currentIndex - dir;
  if (next >= 0 && next < DATES.length) {
    currentIndex = next;
    render();
  }
}

/* ---------- توابع تغییر وضعیت نوبت ---------- */

/**
 * وضعیت یک ردیف را به مقدار جدید (present / absent / cancel) تغییر می‌دهد.
 * badge و کلاس ردیف هر دو به‌روز می‌شوند.
 */
function setStatus(btn, type) {
  const row = btn.closest('tr');
  const s = STATUS_MAP[type];
  row.querySelector('.badge').className = 'badge ' + s.cls;
  row.querySelector('.badge').textContent = s.text;
  row.className = s.row;
}

/**
 * وضعیت ردیف را به حالت اولیه بازمی‌گرداند.
 * مقادیر اولیه از data-init-* خوانده می‌شوند.
 */
function clearStatus(btn) {
  const row = btn.closest('tr');
  const badge = row.querySelector('.badge');
  badge.className = row.dataset.initBadgeClass;
  badge.textContent = row.dataset.initBadgeText;
  row.className = '';
}

/* ---------- ابزار ---------- */

// تبدیل اعداد انگلیسی به فارسی (مثلاً ۱، ۲، ۳ ...)
function toPersianNum(n) {
  return String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
}

/* ---------- مودال اطلاعات مشتری ---------- */

/**
 * مودال را باز می‌کند و اطلاعات مشتری را داخل آن قرار می‌دهد.
 * از طریق کلیک روی نام مشتری در جدول فراخوانی می‌شود.
 */
function openModal(name, phone, code) {
  document.getElementById('modal-name').textContent  = name;
  document.getElementById('modal-phone').textContent = phone;
  document.getElementById('modal-code').textContent  = code;
  document.getElementById('customerModal').classList.add('open');
}

// بستن مودال از طریق دکمه ✕
function closeModalDirect() {
  document.getElementById('customerModal').classList.remove('open');
}

/**
 * بستن مودال با کلیک روی overlay (پس‌زمینه تیره).
 * اگر کلیک داخل modal-box باشد، مودال بسته نمی‌شود.
 */
function closeModal(event) {
  if (event.target === document.getElementById('customerModal')) {
    closeModalDirect();
  }
}

/* ---------- اجرای اولیه ---------- */
render();
