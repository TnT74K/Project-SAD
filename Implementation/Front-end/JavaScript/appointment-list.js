/* =====================================================
   appointment-list.js
   مدیریت لیست نوبت‌های روزانه + مودال اطلاعات مشتری
   ===================================================== */

/* ---------- داده‌ها ---------- */

// تاریخ امروز (برای مقایسه و تعیین نوع روز)
const TODAY = '1405/03/13';

// تمام نوبت‌ها به تفکیک روز
// هر آیتم شامل: نام، تلفن، کد نوبت، سرویس، ساعت، وضعیت اولیه
const DAYS_DATA = {
  '1405/03/11': [
    { name: 'حسن موسوی',    phone: '09121112233', code: 'A-101', service: 'ماساژ',     time: '09:00', status: 'badge-green',  statusText: 'حضور یافت'  },
    { name: 'زینب نوری',    phone: '09354445566', code: 'A-102', service: 'کوتاهی مو', time: '11:30', status: 'badge-red',    statusText: 'لغو شده'    },
  ],
  '1405/03/12': [
    { name: 'علی رضایی',    phone: '09102223344', code: 'A-103', service: 'کوتاهی مو', time: '10:30', status: 'badge-green',  statusText: 'حضور یافت'  },
    { name: 'سارا محمدی',   phone: '09153334455', code: 'A-104', service: 'رنگ مو',    time: '11:00', status: 'badge-yellow', statusText: 'حضور نیافت' },
    { name: 'مهدی کریمی',   phone: '09185556677', code: 'A-105', service: 'اصلاح ریش', time: '12:30', status: 'badge-green',  statusText: 'حضور یافت'  },
    { name: 'نیلوفر احمدی', phone: '09306667788', code: 'A-106', service: 'مانیکور',   time: '14:00', status: 'badge-red',    statusText: 'لغو شده'    },
    { name: 'رضا حسینی',    phone: '09377778899', code: 'A-107', service: 'ماساژ',     time: '15:30', status: 'badge-red',    statusText: 'لغو شده'    },
  ],
  '1405/03/13': [
    { name: 'مریم صادقی',   phone: '09128889900', code: 'A-108', service: 'پاکسازی',   time: '09:30', status: 'badge-blue', statusText: 'جدید' },
    { name: 'امیر تهرانی',  phone: '09199990011', code: 'A-109', service: 'کوتاهی مو', time: '12:00', status: 'badge-blue', statusText: 'جدید' },
  ],
  '1405/03/14': [
    { name: 'فاطمه کرمی',   phone: '09160001122', code: 'A-110', service: 'رنگ مو',    time: '10:00', status: 'badge-blue', statusText: 'جدید' },
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
      <td data-label="#">${i + 1}</td>

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
