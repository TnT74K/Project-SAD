// ========================================
// بخش ۱: تبدیل تاریخ شمسی (جلالی) و میلادی (گریگوری)
// ========================================

// ─── تبدیل تاریخ میلادی به شمسی ───────────────────────────────────────────
// تابع تبدیل تاریخ میلادی به شمسی (جلالی)
// ورودی: سال، ماه و روز میلادی
// خروجی: شیء شامل سال، ماه و روز شمسی
function gregorianToJalali(gy, gm, gd) {
  // تعداد روزهای هر ماه میلادی
  const g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  // تعداد روزهای هر ماه شمسی
  const j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

  // تعیین سال مبنا برای محاسبه کبیسه
  let gy2 = gm > 2 ? gy + 1 : gy;
  
  // محاسبه تعداد روزهای گذشته از مبدأ (سال ۱۲۵۷ شمسی)
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400);

  // اضافه کردن روزهای ماه‌های گذشته سال جاری میلادی
  for (let i = 0; i < gm - 1; i++) days += g_days_in_month[i];
  days += gd;

  // محاسبه سال شمسی
  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;

  // تنظیم نهایی سال شمسی
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  // محاسبه ماه و روز شمسی
  let jm = 0,
    jd = days;
  for (let i = 0; i < 11; i++) {
    if (jd > j_days_in_month[i]) {
      jd -= j_days_in_month[i];
      jm++;
    } else break;
  }

  // برگرداندن نتیجه (سال، ماه و روز شمسی)
  return { year: jy, month: jm + 1, day: jd + 1 };
}

// ─── تبدیل تاریخ شمسی به میلادی ───────────────────────────────────────────
// تابع تبدیل تاریخ شمسی به میلادی (گریگوری)
// ورودی: سال، ماه و روز شمسی
// خروجی: شیء شامل سال، ماه و روز میلادی
function jalaliToGregorian(jy, jm, jd) {
  jy += 1595; // تنظیم سال مبنا
  
  // محاسبه تعداد روزهای گذشته از مبدأ
  let days =
    -355779 +
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor(((jy % 33) + 3) / 4) +
    jd;

  // آرایه روزهای تجمعی ماه‌های شمسی
  const jMonthDays = [0, 31, 62, 93, 125, 155, 186, 216, 247, 277, 304, 334];
  days += jMonthDays[jm - 1];

  // محاسبه سال میلادی
  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;

  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }

  gy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  // آرایه روزهای هر ماه میلادی با در نظر گرفتن کبیسه
  const gMonthDays = [
    31,
    gy % 4 == 0 && (gy % 100 != 0 || gy % 400 == 0) ? 29 : 28, // محاسبه کبیسه
    31, 30, 31, 30, 31, 31, 30, 31, 30, 31
  ];

  // محاسبه ماه و روز میلادی
  let gm = 1;
  for (let i = 0; i < 12; i++) {
    if (days < gMonthDays[i]) {
      gm = i + 1;
      break;
    }
    days -= gMonthDays[i];
  }
  
  return { year: gy, month: gm, day: days };
}

// ─── تعداد روزهای هر ماه شمسی ─────────────────────────────────────────────
// تابع محاسبه تعداد روزهای هر ماه شمسی
// ورودی: سال و ماه شمسی
// خروجی: تعداد روزهای آن ماه
function jalaliMonthDays(jy, jm) {
  // ماه‌های اول تا ششم (فروردین تا شهریور) ۳۱ روز دارند
  if (jm <= 6) return 31;
  
  // ماه‌های هفتم تا یازدهم (مهر تا بهمن) ۳۰ روز دارند
  if (jm <= 11) return 30;
  
  // ماه اسفند: بررسی کبیسه بودن سال شمسی
  // سال‌های کبیسه شمسی: ۱، ۵، ۹، ۱۳، ۱۷، ۲۲، ۲۶، ۳۰ (باقیمانده تقسیم بر ۳۳)
  return jy % 33 === 1 ||
    jy % 33 === 5 ||
    jy % 33 === 9 ||
    jy % 33 === 13 ||
    jy % 33 === 17 ||
    jy % 33 === 22 ||
    jy % 33 === 26 ||
    jy % 33 === 30
    ? 30   // سال کبیسه: اسفند ۳۰ روز
    : 29;  // سال عادی: اسفند ۲۹ روز
}

// ─── روز هفته اول ماه شمسی ─────────────────────────────────────────────────
// تابع محاسبه اولین روز هفته ماه شمسی
// ورودی: سال و ماه شمسی
// خروجی: شماره روز هفته (۰=شنبه تا ۶=جمعه)
function jalaliFirstWeekday(jy, jm) {
  // تبدیل اول ماه به تاریخ میلادی
  const g = jalaliToGregorian(jy, jm, 1);
  
  // getDay(): 0=یکشنبه, 1=دوشنبه, ..., 6=شنبه (در جاوااسکریپت)
  // تبدیل به شنبه=0: (getDay() + 1) % 7
  return (new Date(g.year, g.month - 1, g.day).getDay() + 1) % 7;
}

// ========================================
// بخش ۲: وضعیت (State) و متغیرهای سراسری
// ========================================

// ─── State ───────────────────────────────────────────────────────
// تاریخ امروز میلادی
const todayG = new Date();

// تاریخ امروز شمسی
const todayJ = gregorianToJalali(
  todayG.getFullYear(),
  todayG.getMonth() + 1,  // ماه در جاوااسکریپت از ۰ شروع می‌شود
  todayG.getDate()
);

// سال و ماه در حال نمایش در تقویم (شروع با امروز)
let viewYear = todayJ.year;
let viewMonth = todayJ.month;

// روز انتخاب شده (مقدار اولیه null یعنی هیچ روزی انتخاب نشده)
let selectedDay = null; // { year, month, day }

// ─── آرایه نام ماه‌های شمسی به فارسی ─────────────────────────────────────
const MONTH_NAMES = [
  "فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور",
  "مهر","آبان","آذر","دی","بهمن","اسفند"
];

// ─── آرایه نام روزهای هفته (از شنبه تا جمعه) ───────────────────────────────
const WEEK_HEADERS = ["ش", "ی", "د", "س", "چ", "پ", "ج"]; // شنبه تا جمعه

// ─── رویدادهای نمونه (برای نمایش نقطه روی روزهای خاص) ──────────────────────
// می‌توانید رویدادهای واقعی را به این آرایه اضافه کنید
const EVENTS = [
  // مثال: { year: todayJ.year, month: todayJ.month, day: todayJ.day },
  // { year: todayJ.year, month: todayJ.month, day: todayJ.day + 3 },
];

// ─── بررسی وجود رویداد در یک روز خاص ──────────────────────────────────────
// تابع بررسی می‌کند که آیا روز مشخص شده رویداد دارد یا خیر
function hasEvent(jy, jm, jd) {
  return EVENTS.some((e) => e.year === jy && e.month === jm && e.day === jd);
}

// ========================================
// بخش ۳: رندر و نمایش تقویم
// ========================================

// ─── Render Calendar ─────────────────────────────────────────────
// تابع اصلی رندر کردن تقویم در صفحه
function renderCalendar() {
  const grid = document.getElementById("calGrid");      // المان گرید تقویم
  const label = document.getElementById("calMonthLabel"); // المان نمایش ماه و سال
  grid.innerHTML = "";  // پاک کردن محتوای قبلی

  // تنظیم متن عنوان ماه و سال
  label.textContent = `${MONTH_NAMES[viewMonth - 1]} ${viewYear}`;

  // ─── رندر هدر روزهای هفته ──────────────────────────────────────
  WEEK_HEADERS.forEach((h, i) => {
    const el = document.createElement("div");
    // اگر روز جمعه (اندیس ۶) است، کلاس holiday-header اضافه کن
    el.className = "cal-header" + (i === 6 ? " holiday-header" : "");
    el.textContent = h;
    grid.appendChild(el);
  });

  // ─── محاسبات اولیه ماه ─────────────────────────────────────────
  const totalDays = jalaliMonthDays(viewYear, viewMonth); // تعداد کل روزهای ماه
  const firstWday = jalaliFirstWeekday(viewYear, viewMonth); // اولین روز هفته (۰=شنبه)

  // ─── خانه‌های خالی ابتدای ماه ─────────────────────────────────
  // برای هماهنگی با شروع هفته از شنبه
  for (let i = 0; i < firstWday; i++) {
    const el = document.createElement("div");
    el.className = "cal-day empty";  // کلاس empty برای روزهای خالی
    grid.appendChild(el);
  }

  // ─── رندر روزهای ماه ──────────────────────────────────────────
  for (let d = 1; d <= totalDays; d++) {
    const el = document.createElement("div");
    el.className = "cal-day";
    el.textContent = d;  // نمایش عدد به فارسی

    // محاسبه روز هفته (۰=شنبه تا ۶=جمعه)
    const weekday = (firstWday + d - 1) % 7;
    const isFriday = weekday === 6;  // آیا روز جمعه است؟
    const isToday =
      viewYear === todayJ.year && viewMonth === todayJ.month && d === todayJ.day;
    const isSelected =
      selectedDay &&
      selectedDay.year === viewYear &&
      selectedDay.month === viewMonth &&
      selectedDay.day === d;

    // اضافه کردن کلاس‌های مربوطه
    if (isFriday) el.classList.add("holiday");      // رنگ قرمز برای جمعه
    if (isToday) el.classList.add("today");         // هایلایت امروز
    if (isSelected) el.classList.add("selected");   // هایلایت روز انتخاب شده
    if (hasEvent(viewYear, viewMonth, d)) el.classList.add("has-event"); // نمایش نقطه

    // ─── رویداد کلیک روی هر روز ─────────────────────────────────
    // با کلیک روی روز، آن روز به عنوان روز انتخاب شده ثبت می‌شود
    el.addEventListener("click", () => {
      selectedDay = { year: viewYear, month: viewMonth, day: d };
      renderCalendar();  // رندر مجدد تقویم با انتخاب جدید
    });

    grid.appendChild(el);
  }
}

// ========================================
// بخش ۴: ناوبری تقویم (ماه قبل و بعد)
// ========================================

// ─── دکمه ماه قبل ──────────────────────────────────────────────────
// رویداد کلیک روی دکمه قبلی (ماه قبل)
document.getElementById("calPrev").addEventListener("click", () => {
  viewMonth--;  // کاهش ماه
  if (viewMonth < 1) {  // اگر ماه از فروردین کمتر شد
    viewMonth = 12;      // برو به اسفند
    viewYear--;          // سال قبل
  }
  renderCalendar();  // رندر مجدد تقویم
});

// ─── دکمه ماه بعد ──────────────────────────────────────────────────
// رویداد کلیک روی دکمه بعدی (ماه بعد)
document.getElementById("calNext").addEventListener("click", () => {
  viewMonth++;  // افزایش ماه
  if (viewMonth > 12) {  // اگر ماه از اسفند بیشتر شد
    viewMonth = 1;       // برو به فروردین
    viewYear++;          // سال بعد
  }
  renderCalendar();  // رندر مجدد تقویم
});

// ========================================
// بخش ۵: ساعت و تاریخ (Clock & Dates)
// ========================================

// ─── به‌روزرسانی ساعت و تاریخ ─────────────────────────────────────────
// تابع به‌روزرسانی ویجت ساعت و نمایش تاریخ‌ها
function updateClock() {
  const now = new Date();  // دریافت زمان فعلی
  
  // ─── ساعت دیجیتال ──────────────────────────────────────────────
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  document.getElementById("clockTime").textContent = `${hh}:${mm}:${ss}`;

  // ─── تاریخ شمسی ────────────────────────────────────────────────
  const j = gregorianToJalali(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  );

  // نمایش تاریخ شمسی با فرمت سال/ماه/روز
  document.getElementById("jalaliDate").textContent =
    `${(j.year)}/${(String(j.month).padStart(2, "0"))}/${(String(j.day).padStart(2, "0"))}`;

  // ─── تاریخ میلادی ──────────────────────────────────────────────
  const months = [
    "ژانویه","فوریه","مارس","آوریل","مه","ژوئن",
    "ژوئیه","اوت","سپتامبر","اکتبر","نوامبر","دسامبر"
  ];

  document.getElementById("gregorianDate").textContent =
    `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  // ─── تاریخ در نوار بالایی (Topbar) ────────────────────────────
  document.getElementById("topbarDate").textContent =
    `${MONTH_NAMES[j.month - 1]} ${(j.day)}، ${(j.year)}`;
}

// ========================================
// بخش ۶: مقداردهی اولیه (Init)
// ========================================


// ─── Init ────────────────────────────────────────────────────────
// رندر اولیه تقویم هنگام بارگذاری صفحه
renderCalendar();

// به‌روزرسانی اولیه ساعت و تاریخ
updateClock();

// تنظیم تایمر برای به‌روزرسانی هر ثانیه (۱۰۰۰ میلی‌ثانیه)
setInterval(updateClock, 1000);
// ========================================
// بخش ۷: جدول نوبت‌های امروز و کارکنان
// ========================================

const APPOINTMENTS_TODAY = [
  { name: "علی رضایی",    service: "مشاوره",      time: "۰۹:۰۰", code: "A1B2C", status: "confirmed" },
  { name: "مریم احمدی",   service: "پزشکی عمومی", time: "۱۰:۳۰", code: "D3E4F", status: "pending"   },
  { name: "حسن موسوی",    service: "دندانپزشکی",  time: "۱۱:۰۰", code: "G5H6I", status: "present"   },
  { name: "زهرا کریمی",   service: "مشاوره",      time: "۱۳:۰۰", code: "J7K8L", status: "cancelled" },
  { name: "محمد نوری",    service: "پزشکی عمومی", time: "۱۴:۳۰", code: "M9N0O", status: "pending"   },
];

const STAFF_LIST = [
  { name: "دکتر سارا محمدی",  role: "پزشک عمومی",    status: "active"   },
  { name: "دکتر امیر حسینی",  role: "دندانپزشک",     status: "active"   },
  { name: "خانم نجفی",        role: "پرستار",        status: "active"   },
  { name: "آقای صادقی",       role: "مشاور",         status: "inactive" },
  { name: "خانم قاسمی",       role: "پذیرش",         status: "active"   },
];

const STATUS_MAP = {
  confirmed: { label: "تأیید شده",  badge: "badge-green",  row: "row-green"  },
  pending:   { label: "در انتظار",  badge: "badge-yellow", row: "row-yellow" },
  present:   { label: "حاضر",       badge: "badge-blue",   row: ""           },
  cancelled: { label: "لغو شده",    badge: "badge-red",    row: "row-red"    },
};

function renderAppointments() {
  const tbody = document.getElementById("apptBody");
  const label = document.getElementById("apptDateLabel");
  if (label) label.textContent = `${MONTH_NAMES[todayJ.month - 1]} ${(todayJ.day)}، ${(todayJ.year)}`;
  tbody.innerHTML = APPOINTMENTS_TODAY.map((a, i) => {
    const s = STATUS_MAP[a.status] || STATUS_MAP.pending;
    return `<tr class="${s.row}">
      <td data-label="#">${i + 1}</td>
      <td data-label="مشتری">${a.name}</td>
      <td data-label="سرویس">${a.service}</td>
      <td data-label="ساعت">${a.time}</td>
      <td data-label="کد تأییدیه"><span class="confirm-code">${a.code}</span></td>
      <td data-label="وضعیت"><span class="badge ${s.badge}">${s.label}</span></td>
    </tr>`;
  }).join("");
}

function renderStaff() {
  const tbody = document.getElementById("staffBody");
  tbody.innerHTML = STAFF_LIST.map((s, i) => `<tr class="${s.status === 'active' ? 'row-green' : 'row-gray'}">
    <td data-label="#">${i + 1}</td>
    <td data-label="نام">${s.name}</td>
    <td data-label="نقش">${s.role}</td>
    <td data-label="وضعیت"><span class="badge ${s.status === 'active' ? 'badge-green' : 'badge-gray'}">${s.status === 'active' ? 'فعال' : 'غیرفعال'}</span></td>
  </tr>`).join("");
}

renderAppointments();
renderStaff();
