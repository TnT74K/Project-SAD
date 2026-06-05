// تاریخ امروز به شمسی — برای مقایسه با روز جاری
const TODAY = '۱۴۰۵/۰۳/۱۳';

// داده‌های هر روز: کلید = تاریخ شمسی، مقدار = آرایه نوبت‌ها
// وضعیت پیش‌فرض برای روزهای گذشته: لغو شده / حضور یافت / حضور نیافت (بدون "در انتظار")
// وضعیت پیش‌فرض برای امروز و آینده: جدید
const DAYS_DATA = {
  '۱۴۰۵/۰۳/۱۱': [
    { name: 'حسن موسوی',    service: 'ماساژ',     time: '۰۹:۰۰', status: 'badge-green', statusText: 'حضور یافت' },
    { name: 'زینب نوری',    service: 'کوتاهی مو', time: '۱۱:۳۰', status: 'badge-red',   statusText: 'لغو شده'   },
  ],
  '۱۴۰۵/۰۳/۱۲': [
    { name: 'علی رضایی',    service: 'کوتاهی مو', time: '۱۰:۳۰', status: 'badge-green',  statusText: 'حضور یافت' },
    { name: 'سارا محمدی',   service: 'رنگ مو',    time: '۱۱:۰۰', status: 'badge-yellow', statusText: 'حضور نیافت' },
    { name: 'مهدی کریمی',   service: 'اصلاح ریش', time: '۱۲:۳۰', status: 'badge-green',  statusText: 'حضور یافت' },
    { name: 'نیلوفر احمدی', service: 'مانیکور',   time: '۱۴:۰۰', status: 'badge-red',    statusText: 'لغو شده'   },
    { name: 'رضا حسینی',    service: 'ماساژ',     time: '۱۵:۳۰', status: 'badge-red',    statusText: 'لغو شده'   },
  ],
  '۱۴۰۵/۰۳/۱۳': [
    // امروز: وضعیت پیش‌فرض = جدید
    { name: 'مریم صادقی',   service: 'پاکسازی',   time: '۰۹:۳۰', status: 'badge-blue', statusText: 'جدید' },
    { name: 'امیر تهرانی',  service: 'کوتاهی مو', time: '۱۲:۰۰', status: 'badge-blue', statusText: 'جدید' },
  ],
  '۱۴۰۵/۰۳/۱۴': [
    // آینده: وضعیت پیش‌فرض = جدید
    { name: 'فاطمه کرمی',   service: 'رنگ مو',    time: '۱۰:۰۰', status: 'badge-blue', statusText: 'جدید' },
  ],
};

// آرایه مرتب تاریخ‌ها از روی کلیدهای DAYS_DATA
const DATES = Object.keys(DAYS_DATA);
// ایندکس روز جاری نمایش‌داده‌شده (اولیه = امروز)
let currentIndex = DATES.indexOf(TODAY);

// نقشه وضعیت‌ها: هر type → کلاس badge و کلاس ردیف
// سه حالت گذشته: حضور یافت / حضور نیافت / لغو شده
const STATUS_MAP = {
  present: { text: 'حضور یافت',  cls: 'badge-green',  row: 'row-green'  },
  absent:  { text: 'حضور نیافت', cls: 'badge-yellow', row: 'row-yellow' },
  cancel:  { text: 'لغو شده',    cls: 'badge-red',    row: 'row-red'    },
};

// دکمه‌های عملیات بر اساس نوع روز متفاوتند
function getActionButtons(dateType) {
  // روزهای گذشته: بدون دکمه — ستون عملیات خالی است
  if (dateType === 'past') return '';

  // روزهای آینده: فقط لغو و پاک (وضعیت پیش‌فرض = جدید)
  if (dateType === 'future') return `
    <button class="btn-action btn-cancel"  onclick="setStatus(this,'cancel')">🚫 لغو</button>
    <button class="btn-action btn-reset"   onclick="clearStatus(this)">↺ پاک</button>`;

  // امروز: حضور / لغو / عدم حضور / پاک
  return `
    <button class="btn-action btn-present" onclick="setStatus(this,'present')">✔ حضور</button>
    <button class="btn-action btn-cancel"  onclick="setStatus(this,'cancel')">✖ لغو</button>
    <button class="btn-action btn-absent"  onclick="setStatus(this,'absent')">— عدم حضور</button>
    <button class="btn-action btn-reset"   onclick="clearStatus(this)">↺ پاک</button>`;
}

// رندر کل جدول برای روز جاری
function render() {
  const date = DATES[currentIndex];
  const rows = DAYS_DATA[date] || [];

  // تعیین نوع روز: گذشته / امروز / آینده (مقایسه رشته‌ای کار می‌کند چون فرمت یکسان است)
  const dateType = date === TODAY ? 'today' : date < TODAY ? 'past' : 'future';

  // نمایش تاریخ در span هدر
  document.getElementById('currentDate').textContent = date;

  // اضافه/حذف کلاس not-today روی کارت برای استایل قرمز
  document.querySelector('.card').classList.toggle('not-today', date !== TODAY);

  // ساخت ردیف‌های جدول
  // data-init-badge-class و data-init-badge-text: ذخیره وضعیت اولیه برای clearStatus
  document.getElementById('appointmentsBody').innerHTML = rows.map((r, i) => `
    <tr data-init-badge-class="badge ${r.status}" data-init-badge-text="${r.statusText}">
      <td>${toPersianNum(i + 1)}</td>
      <td>${r.name}</td>
      <td>${r.service}</td>
      <td>${date}</td>
      <td>${r.time}</td>
      <td class="confirm-code">—</td>
      <td><span class="badge ${r.status}">${r.statusText}</span></td>
      <td><div class="actions">${getActionButtons(dateType)}</div></td>
    </tr>`).join('');
}

// جابه‌جایی بین روزها
// dir=1 یعنی کلیک دکمه چپ (روز قبل) چون RTL است next = currentIndex - dir
function changeDay(dir) {
  const next = currentIndex - dir;
  if (next >= 0 && next < DATES.length) { currentIndex = next; render(); }
}

// اعمال وضعیت جدید روی یک ردیف
function setStatus(btn, type) {
  const row = btn.closest('tr');
  const s = STATUS_MAP[type];
  row.querySelector('.badge').className = 'badge ' + s.cls;
  row.querySelector('.badge').textContent = s.text;
  row.className = s.row; // رنگ پس‌زمینه ردیف
}

// بازگشت به وضعیت اولیه (از data-attribute ذخیره‌شده)
function clearStatus(btn) {
  const row = btn.closest('tr');
  const badge = row.querySelector('.badge');
  badge.className = row.dataset.initBadgeClass;
  badge.textContent = row.dataset.initBadgeText;
  row.className = ''; // حذف رنگ ردیف
}

// تبدیل اعداد لاتین به فارسی
function toPersianNum(n) {
  return String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
}

render(); // اجرای اولیه هنگام لود صفحه
