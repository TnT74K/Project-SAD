// ─── Jalali Conversion ───────────────────────────────────────────
function gregorianToJalali(gy, gm, gd) {
  const g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

  let gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400);

  for (let i = 0; i < gm - 1; i++) days += g_days_in_month[i];
  days += gd;

  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  let jm = 0,
    jd = days;
  for (let i = 0; i < 11; i++) {
    if (jd > j_days_in_month[i]) {
      jd -= j_days_in_month[i];
      jm++;
    } else break;
  }

  return { year: jy, month: jm + 1, day: jd + 1 };
}

function jalaliToGregorian(jy, jm, jd) {
  jy += 1595;
  let days =
    -355779 +
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor(((jy % 33) + 3) / 4) +
    jd;

  const jMonthDays = [0, 31, 62, 93, 125, 155, 186, 216, 247, 277, 304, 334];
  days += jMonthDays[jm - 1];

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

  const gMonthDays = [
    31,
    gy % 4 == 0 && (gy % 100 != 0 || gy % 400 == 0) ? 29 : 28,
    31, 30, 31, 30, 31, 31, 30, 31, 30, 31
  ];

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

// تعداد روزهای هر ماه جلالی
function jalaliMonthDays(jy, jm) {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  // اسفند: بررسی کبیسه
  return jy % 33 === 1 ||
    jy % 33 === 5 ||
    jy % 33 === 9 ||
    jy % 33 === 13 ||
    jy % 33 === 17 ||
    jy % 33 === 22 ||
    jy % 33 === 26 ||
    jy % 33 === 30
    ? 30
    : 29;
}

// روز هفته اول ماه (0=شنبه … 6=جمعه)
function jalaliFirstWeekday(jy, jm) {
  const g = jalaliToGregorian(jy, jm, 1);
  // getDay(): 0=Sun,1=Mon,...,6=Sat
  // نگاشت به شنبه=0: (getDay()+1)%7
  return (new Date(g.year, g.month - 1, g.day).getDay() + 1) % 7;
}

// ─── State ───────────────────────────────────────────────────────
const todayG = new Date();
const todayJ = gregorianToJalali(
  todayG.getFullYear(),
  todayG.getMonth() + 1,
  todayG.getDate()
);

let viewYear = todayJ.year;
let viewMonth = todayJ.month;
let selectedDay = null; // { year, month, day }

const MONTH_NAMES = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];
const WEEK_HEADERS = ["ش", "ی", "د", "س", "چ", "پ", "ج"]; // شنبه تا جمعه

// رویدادهای نمونه (jYear, jMonth, jDay)
const EVENTS = [
  // { year: todayJ.year, month: todayJ.month, day: todayJ.day },
  // { year: todayJ.year, month: todayJ.month, day: todayJ.day + 3 },
];

function hasEvent(jy, jm, jd) {
  return EVENTS.some((e) => e.year === jy && e.month === jm && e.day === jd);
}

// ─── Render Calendar ─────────────────────────────────────────────
function renderCalendar() {
  const grid = document.getElementById("calGrid");
  const label = document.getElementById("calMonthLabel");
  grid.innerHTML = "";

  label.textContent = `${MONTH_NAMES[viewMonth - 1]} ${viewYear}`;

  // هدر روزهای هفته
  WEEK_HEADERS.forEach((h, i) => {
    const el = document.createElement("div");
    el.className = "cal-header" + (i === 6 ? " holiday-header" : "");
    el.textContent = h;
    grid.appendChild(el);
  });

  const totalDays = jalaliMonthDays(viewYear, viewMonth);
  const firstWday = jalaliFirstWeekday(viewYear, viewMonth); // 0=شنبه

  // خانه‌های خالی ابتدای ماه
  for (let i = 0; i < firstWday; i++) {
    const el = document.createElement("div");
    el.className = "cal-day empty";
    grid.appendChild(el);
  }

  // روزها
  for (let d = 1; d <= totalDays; d++) {
    const el = document.createElement("div");
    el.className = "cal-day";
    el.textContent = (d);

    const weekday = (firstWday + d - 1) % 7;
    const isFriday = weekday === 6;
    const isToday =
      viewYear === todayJ.year && viewMonth === todayJ.month && d === todayJ.day;
    const isSelected =
      selectedDay &&
      selectedDay.year === viewYear &&
      selectedDay.month === viewMonth &&
      selectedDay.day === d;

    if (isFriday) el.classList.add("holiday");
    if (isToday) el.classList.add("today");
    if (isSelected) el.classList.add("selected");
    if (hasEvent(viewYear, viewMonth, d)) el.classList.add("has-event");

    el.addEventListener("click", () => {
      selectedDay = { year: viewYear, month: viewMonth, day: d };
      renderCalendar();
    });

    grid.appendChild(el);
  }
}

// ─── Navigation ──────────────────────────────────────────────────
document.getElementById("calPrev").addEventListener("click", () => {
  viewMonth--;
  if (viewMonth < 1) {
    viewMonth = 12;
    viewYear--;
  }
  renderCalendar();
});

document.getElementById("calNext").addEventListener("click", () => {
  viewMonth++;
  if (viewMonth > 12) {
    viewMonth = 1;
    viewYear++;
  }
  renderCalendar();
});


function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  document.getElementById("clockTime").textContent = `${hh}:${mm}:${ss}`;

  const j = gregorianToJalali(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  );

  document.getElementById("jalaliDate").textContent =
    `${(j.year)}/${(String(j.month).padStart(2, "0"))}/${(String(j.day).padStart(2, "0"))}`;

  const months = [
    "ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن",
    "ژوئیه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر"
  ];

  document.getElementById("gregorianDate").textContent =
    `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  // topbar date
  document.getElementById("topbarDate").textContent =
    `${MONTH_NAMES[j.month - 1]} ${(j.day)}، ${(j.year)}`;
}

// ─── Init ────────────────────────────────────────────────────────
renderCalendar();
updateClock();
setInterval(updateClock, 1000);
