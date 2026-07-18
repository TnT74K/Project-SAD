// dashboard.js

// ============================================================
// بخش ۱: تبدیل تاریخ (میلادی ↔ شمسی)
// ============================================================

function gregorianToJalali(gy, gm, gd) {
    const g_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const j_days = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    let gy2 = gm > 2 ? gy + 1 : gy;
    let days = 355666 + 365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400);
    for (let i = 0; i < gm - 1; i++) days += g_days[i];
    days += gd;
    let jy = -1595 + 33 * Math.floor(days / 12053);
    days %= 12053;
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) { jy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365; }
    let jm = 0,
        jd = days;
    for (let i = 0; i < 11; i++) {
        if (jd > j_days[i]) { jd -= j_days[i];
            jm++; } else break;
    }
    return { year: jy, month: jm + 1, day: jd + 1 };
}

function jalaliToGregorian(jy, jm, jd) {
    jy += 1595;
    let days = -355779 + 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4) + jd;
    const jMonthDays = [0, 31, 62, 93, 125, 155, 186, 216, 247, 277, 304, 334];
    days += jMonthDays[jm - 1];
    let gy = 400 * Math.floor(days / 146097);
    days %= 146097;
    if (days > 36524) { gy += 100 * Math.floor(--days / 36524);
        days %= 36524; if (days >= 365) days++; }
    gy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) { gy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365; }
    const gMonthDays = [31, gy % 4 == 0 && (gy % 100 != 0 || gy % 400 == 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let gm = 1;
    for (let i = 0; i < 12; i++) {
        if (days < gMonthDays[i]) { gm = i + 1; break; }
        days -= gMonthDays[i];
    }
    return { year: gy, month: gm, day: days };
}

function jalaliMonthDays(jy, jm) {
    if (jm <= 6) return 31;
    if (jm <= 11) return 30;
    return jy % 33 === 1 || jy % 33 === 5 || jy % 33 === 9 || jy % 33 === 13 ||
        jy % 33 === 17 || jy % 33 === 22 || jy % 33 === 26 || jy % 33 === 30 ? 30 : 29;
}

function jalaliFirstWeekday(jy, jm) {
    const g = jalaliToGregorian(jy, jm, 1);
    return (new Date(g.year, g.month - 1, g.day).getDay() + 1) % 7;
}

function toPersianNum(n) {
    return String(n).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

// ============================================================
// بخش ۲: تنظیمات نقش‌ها (مهم‌ترین بخش)
// ============================================================

const ROLE_CONFIG = {
    manager: {
        title: 'داشبورد مدیریتی',
        profileName: 'مدیر کسب‌وکار',
        profileRole: 'مدیریت کسب‌وکار',
        avatar: 'م',
        rightStats: [
            { label: 'کل رزرو', key: 'totalReservations' },
            { label: 'امتیاز', key: 'rating' },
            { label: 'تعداد امتیازدهندگان', key: 'raters' }
        ]
    },
    supporter: {
        title: 'داشبورد پشتیبان',
        profileName: 'پشتیبان سازمان',
        profileRole: 'پشتیبانی سازمان',
        avatar: 'پ',
        rightStats: [
            { label: 'کل رزرو', key: 'totalReservations' },
            { label: 'امتیاز', key: 'rating' },
            { label: 'تعداد امتیازدهندگان', key: 'raters' }
        ]
    },
    employee: {
        title: 'داشبورد کارمند حضور',
        profileName: 'کارمند حضور',
        profileRole: 'کارمند حضور کسب‌وکار',
        avatar: 'ک',
        rightStats: [
            { label: 'کل رزرو', key: 'totalReservations' },
            { label: 'امتیاز', key: 'rating' },
            { label: 'تعداد امتیازدهندگان', key: 'raters' }
        ]
    },
    admin: {
        title: 'داشبورد مدیریت سیستم',
        profileName: 'مدیر سیستم',
        profileRole: 'مدیر ارشد رزروسنتر',
        avatar: 'م',
        rightStats: [
            { label: 'کل نوبت‌ها', key: 'totalAppointments' },
            { label: 'کل کاربران', key: 'totalUsers' },
            { label: 'کل کسب‌وکارها', key: 'totalBusinesses' }
        ]
    }
};

// ============================================================
// بخش ۳: داده‌های نمونه (Mock Data) – برای تست
// ============================================================

const MOCK_USER = {
    role: 'admin', // این را به 'manager' یا 'supporter' یا 'employee' تغییر بده
    name: 'علی رضوی',
    stats: {
        todayReservations: 124,
        confirmed: 98,
        pending: 18,
        cancelled: 8,
        totalReservations: 1240,
        rating: '4.8',
        raters: 342,
        totalAppointments: 5840,
        totalUsers: 1240,
        totalBusinesses: 156
    }
};

// ============================================================
// بخش ۴: توابع رندر کردن داشبورد
// ============================================================

function renderDashboard(userData) {
    const role = userData.role;
    const config = ROLE_CONFIG[role];
    if (!config) {
        console.error('نقش کاربر نامعتبر است:', role);
        return;
    }

    const stats = userData.stats;

    // ---- ۱. هدر اصلی ----
    document.getElementById('dashboardTitle').textContent = config.title;

    // ---- ۲. پروفایل (سمت راست) ----
    document.getElementById('profileName').textContent = config.profileName;
    document.getElementById('profileRole').textContent = config.profileRole;
    document.getElementById('profileAvatar').textContent = config.avatar;

    // ---- ۳. سه فیلد سمت راست ----
    const profileStatsContainer = document.getElementById('profileStats');
    profileStatsContainer.innerHTML = '';
    config.rightStats.forEach(stat => {
        const val = stats[stat.key] !== undefined ? stats[stat.key] : 0;
        const div = document.createElement('div');
        div.className = 'profile-stat';
        div.innerHTML = `
            <div class="val">${toPersianNum(val)}</div>
            <div class="lbl">${stat.label}</div>
        `;
        profileStatsContainer.appendChild(div);
    });

    // ---- ۴. چهار فیلد سمت چپ (ثابت برای همه) ----
    const statsGrid = document.getElementById('statsGrid');
    const leftStats = [
        { icon: '📅', label: 'رزرو امروز', key: 'todayReservations', change: '↑ 8% نسبت به دیروز', changeClass: 'up' },
        { icon: '✅', label: 'تأیید شده', key: 'confirmed', change: '↑ 12%', changeClass: 'up' },
        { icon: '⏳', label: 'در انتظار', key: 'pending', change: '↓ 3%', changeClass: 'down' },
        { icon: '❌', label: 'لغو شده', key: 'cancelled', change: '↓ 5%', changeClass: 'down' }
    ];
    statsGrid.innerHTML = '';
    leftStats.forEach((item, index) => {
        const val = stats[item.key] !== undefined ? stats[item.key] : 0;
        const icons = ['blue', 'green', 'yellow', 'red'];
        const card = document.createElement('div');
        card.className = 'stat-card';
        card.style.animationDelay = (index * 0.05) + 's';
        card.innerHTML = `
            <div class="stat-icon ${icons[index]}">${item.icon}</div>
            <div class="stat-info">
                <div class="value">${toPersianNum(val)}</div>
                <div class="label">${item.label}</div>
                <div class="change ${item.changeClass}">${item.change}</div>
            </div>
        `;
        statsGrid.appendChild(card);
    });
}

// ============================================================
// بخش ۵: تقویم و ساعت
// ============================================================

const todayG = new Date();
const todayJ = gregorianToJalali(todayG.getFullYear(), todayG.getMonth() + 1, todayG.getDate());

let viewYear = todayJ.year;
let viewMonth = todayJ.month;
let selectedDay = null;

const MONTH_NAMES = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
const WEEK_HEADERS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
const EVENTS = [];

function hasEvent(jy, jm, jd) {
    return EVENTS.some(e => e.year === jy && e.month === jm && e.day === jd);
}

function renderCalendar() {
    const grid = document.getElementById('calGrid');
    const label = document.getElementById('calMonthLabel');
    grid.innerHTML = '';
    label.textContent = `${MONTH_NAMES[viewMonth - 1]} ${viewYear}`;

    WEEK_HEADERS.forEach((h, i) => {
        const el = document.createElement('div');
        el.className = 'cal-header' + (i === 6 ? ' holiday-header' : '');
        el.textContent = h;
        grid.appendChild(el);
    });

    const totalDays = jalaliMonthDays(viewYear, viewMonth);
    const firstWday = jalaliFirstWeekday(viewYear, viewMonth);

    for (let i = 0; i < firstWday; i++) {
        const el = document.createElement('div');
        el.className = 'cal-day empty';
        grid.appendChild(el);
    }

    for (let d = 1; d <= totalDays; d++) {
        const el = document.createElement('div');
        el.className = 'cal-day';
        el.textContent = toPersianNum(d);

        const weekday = (firstWday + d - 1) % 7;
        const isFriday = weekday === 6;
        const isToday = viewYear === todayJ.year && viewMonth === todayJ.month && d === todayJ.day;
        const isSelected = selectedDay && selectedDay.year === viewYear &&
            selectedDay.month === viewMonth && selectedDay.day === d;

        if (isFriday) el.classList.add('holiday');
        if (isToday) el.classList.add('today');
        if (isSelected) el.classList.add('selected');
        if (hasEvent(viewYear, viewMonth, d)) el.classList.add('has-event');

        el.addEventListener('click', () => {
            selectedDay = { year: viewYear, month: viewMonth, day: d };
            renderCalendar();
        });

        grid.appendChild(el);
    }
}

document.getElementById('calPrev').addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 1) { viewMonth = 12;
        viewYear--; }
    renderCalendar();
});

document.getElementById('calNext').addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 12) { viewMonth = 1;
        viewYear++; }
    renderCalendar();
});

function updateClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clockTime').textContent = `${hh}:${mm}:${ss}`;

    const j = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
    document.getElementById('jalaliDate').textContent =
        `${toPersianNum(j.year)}/${toPersianNum(String(j.month).padStart(2, '0'))}/${toPersianNum(String(j.day).padStart(2, '0'))}`;

    const months = ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن', 'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'];
    document.getElementById('gregorianDate').textContent =
        `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

    document.getElementById('topbarDate').textContent =
        `${MONTH_NAMES[j.month - 1]} ${toPersianNum(j.day)}، ${toPersianNum(j.year)}`;
}

// ============================================================

// بخش ۶: تنظیمات اتصال به API

const API_BASE_URL = "http://localhost:5000/api";
function getToken() { return localStorage.getItem("token"); }

// ============================================================
// بخش ۷: مقداردهی اولیه (بارگذاری)
// ============================================================

document.addEventListener('DOMContentLoaded', async function() {
    renderCalendar();
    updateClock();
    setInterval(updateClock, 1000);

    try {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
            headers: { "Authorization": `Bearer ${getToken()}` }
        });
        const result = await response.json();

        if (response.ok && result.IsSuccess) {
            const d = result.Data;
            // Map AdminDashboardDto to the existing MOCK_USER format
            const userData = {
                role: 'admin',
                stats: {
                    todayReservations: d.todayReserved,
                    confirmed: d.todayPresenced,
                    pending: d.todayTotal - d.todayPresenced - d.todayCanceled - d.todayAbsented,
                    cancelled: d.todayCanceled,
                    totalReservations: d.totalAppointments,
                    rating: '—',
                    raters: '—',
                    totalAppointments: d.totalAppointments,
                    totalUsers: d.totalUsers,
                    totalBusinesses: d.totalOrgs
                }
            };
            renderDashboard(userData);
        } else {
            // Fallback to mock on error
            renderDashboard(MOCK_USER);
        }
    } catch (err) {
        console.error('خطا در دریافت داده:', err);
        renderDashboard(MOCK_USER);
    }
});
