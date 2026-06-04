// -----------------------------------------------
// توابع کمکی (Helper Functions)
// -----------------------------------------------

/**
 * یک عدد را به صورت دو رقمی با صفر ابتدا نمایش می‌دهد
 * مثال: 5 => "05"
 */
function pad2(n) {
    return String(n).padStart(2, "0");
}

// -----------------------------------------------
// توابع تبدیل تاریخ شمسی <-> میلادی
// -----------------------------------------------

/**
 * تبدیل تاریخ میلادی به شمسی (جلالی)
 * @param {number} gy - سال میلادی
 * @param {number} gm - ماه میلادی (1-12)
 * @param {number} gd - روز میلادی
 * @returns {object} - شامل year, month, day شمسی
 */
function gregorianToJalali(gy, gm, gd) {
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    let jy = (gy > 1600) ? 979 : 0;
    if (gy > 1600) gy -= 1600;
    else gy -= 621;
    let gy2 = (gm > 2) ? gy + 1 : gy;
    let days = 365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
    jy += 33 * Math.floor(days / 12053);
    days %= 12053;
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
        jy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365;
    }
    let jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
    let jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
    return { year: jy, month: jm, day: jd };
}

/**
 * تبدیل تاریخ شمسی به میلادی
 * @param {number} jy - سال شمسی
 * @param {number} jm - ماه شمسی (1-12)
 * @param {number} jd - روز شمسی
 * @returns {object} - شامل year, month, day میلادی
 */
function jalaliToGregorian(jy, jm, jd) {
    jy += 1595;
    let days = -355668 + 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4) + jd;
    if (jm < 7) days += (jm - 1) * 31;
    else days += ((jm - 7) * 30) + 186;
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
    let gd = days + 1;
    const sal_a = [0, 31, ((gy % 4 == 0 && gy % 100 != 0) || gy % 400 == 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let gm = 0;
    for (gm = 0; gm < 13; gm++) {
        let v = sal_a[gm];
        if (gd <= v) break;
        gd -= v;
    }
    return { year: gy, month: gm, day: gd };
}

/**
 * محاسبه تعداد روزهای یک ماه شمسی
 * @param {number} jy - سال شمسی
 * @param {number} jm - ماه شمسی
 * @returns {number} - تعداد روزهای آن ماه
 */
function jalaliMonthDays(jy, jm) {
    if (jm <= 6) return 31;      // شش ماه اول 31 روزه
    if (jm <= 11) return 30;     // ماه 7 تا 11 سی روزه
    // ماه اسفند: اگر کبیسه باشد 30 روز،否则 29 روز
    return ((jy % 33) % 4 === 1) ? 30 : 29;
}

/**
 * محاسبه اولین روز هفته یک ماه شمسی (شنبه = 0، جمعه = 6)
 * @param {number} jy - سال شمسی
 * @param {number} jm - ماه شمسی
 * @returns {number} - ایندکس اولین روز ماه (0 تا 6)
 */
function jalaliFirstWeekday(jy, jm) {
    const g = jalaliToGregorian(jy, jm, 1);
    const d = new Date(g.year, g.month - 1, g.day);
    let day = d.getDay();
    return (day + 1) % 7;  // تنظیم بر اساس شنبه = 0
}

// -----------------------------------------------
// داده‌های اصلی برنامه (State)
// -----------------------------------------------

let selectedJalaliDate = null;   // تاریخ انتخاب شده در تقویم
let viewYear;                     // سال در حال نمایش تقویم
let viewMonth;                    // ماه در حال نمایش تقویم
let editingSlot = null;           // آیدی نوبتی که در حال ویرایش است (اگر null باشد یعنی در حال ایجاد جدید)

// اطلاعات سازمان
let organization = {
    name: "مرکز تخصصی رزروسنتر",
    fullName: "سازمان خدمات نمونه کشوری",
    start: "08:00",
    end: "18:00",
    desc: "ارائه خدمات تخصصی در حوزه رزرواسیون آنلاین با بالاترین کیفیت",
    image: "https://formafzar.com/attachment/images/%D8%B1%D8%B2%D8%B1%D9%88-%D8%A2%D9%86%D9%84%D8%A7%DB%8C%D9%86.jpg",
    active: true
};

// لیست نوبت‌ها (هر نوبت شامل id, date, time, status و در صورت رزرو شده customer)
let slots = [
    { id: 1001, date: "2025-06-10", time: "10:00", status: "available" },
    { id: 1002, date: "2025-06-10", time: "11:30", status: "available" },
    { id: 1003, date: "2025-06-12", time: "09:00", status: "booked", customer: { first: "احمد", last: "رضایی", phone: "0912xxx" } }
];

// -----------------------------------------------
// توابع مربوط به رندر اطلاعات سازمان
// -----------------------------------------------

/**
 * نمایش اطلاعات سازمان در صفحه (از روی شی organization)
 */
function renderOrg() {
    document.getElementById("orgName").innerText = organization.name;
    document.getElementById("orgFullName").innerText = organization.fullName;
    document.getElementById("orgHours").innerHTML = `${organization.start} الی ${organization.end}`;
    document.getElementById("orgDesc").innerText = organization.desc;
    document.getElementById("orgImage").src = organization.image;

    const statusSpan = document.getElementById("orgStatus");
    if (organization.active) {
        statusSpan.innerHTML = "● فعال";
        statusSpan.className = "meta-value status-active";
    } else {
        statusSpan.innerHTML = "● غیرفعال";
        statusSpan.className = "meta-value status-inactive";
    }
}

/**
 * باز کردن مودال ویرایش سازمان و پر کردن فیلدها با مقادیر فعلی
 */
function openOrgModal() {
    document.getElementById("inputName").value = organization.name;
    document.getElementById("inputFullName").value = organization.fullName;
    document.getElementById("startHour").value = organization.start;
    document.getElementById("endHour").value = organization.end;
    document.getElementById("inputDesc").value = organization.desc;
    document.getElementById("orgActive").value = organization.active ? "true" : "false";
    document.getElementById("orgModal").style.display = "flex"; // نمایش مودال
}

/**
 * ذخیره اطلاعات ویرایش شده سازمان
 */
function saveOrg() {
    // دریافت مقادیر جدید از فیلدهای مودال
    organization.name = document.getElementById("inputName").value;
    organization.fullName = document.getElementById("inputFullName").value;
    organization.start = document.getElementById("startHour").value;
    organization.end = document.getElementById("endHour").value;
    organization.desc = document.getElementById("inputDesc").value;
    organization.active = document.getElementById("orgActive").value === "true";

    // اگر فایل تصویر انتخاب شده باشد، آن را به صورت Base64 ذخیره کن
    const file = document.getElementById("imageUpload").files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            organization.image = e.target.result;
            renderOrg();  // رندر مجدد
        };
        reader.readAsDataURL(file);
    } else {
        renderOrg();  // فقط رندر مجدد بدون تغییر عکس
    }

    closeModal("orgModal"); // بستن مودال
}

// -----------------------------------------------
// توابع مربوط به نوبت‌ها
// -----------------------------------------------

/**
 * رندر کردن لیست نوبت‌ها بر اساس تاریخ
 * نوبت‌ها را بر اساس تاریخ گروه‌بندی کرده و نمایش می‌دهد
 */
function renderSlots() {
    const container = document.getElementById("appointments");
    container.innerHTML = "";  // پاک کردن محتوای قبلی

    // گروه‌بندی نوبت‌ها بر اساس تاریخ
    const groups = {};
    slots.forEach(s => {
        if (!groups[s.date]) groups[s.date] = [];
        groups[s.date].push(s);
    });

    // برای هر تاریخ، یک کارت بساز
    for (let date in groups) {
        const g = date.split("-").map(Number);  // [year, month, day]
        const j = gregorianToJalali(g[0], g[1], g[2]);  // تبدیل به شمسی برای نمایش

        const card = document.createElement("div");
        card.className = "appointment-group";

        let html = `<div class="appointment-date">📆 ${j.year}/${pad2(j.month)}/${pad2(j.day)}</div><div class="appointment-times">`;

        // برای هر نوبت در این تاریخ، یک دکمه ساعت و دکمه‌های عملیاتی بساز
        groups[date].forEach(slot => {
            html += `
                <div class="time-slot">
                    <button class="time-btn ${slot.status === "booked" ? "booked" : ""}" onclick="slotClick(${slot.id})">
                        ${slot.time}
                    </button>
                    <div class="slot-actions">
                        <button onclick="editSlot(${slot.id})">✏️</button>
                        <button onclick="deleteSlot(${slot.id})">🗑️</button>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        card.innerHTML = html;
        container.appendChild(card);
    }
}

/**
 * باز کردن مودال ثبت نوبت جدید
 */
function openSlotModal() {
    editingSlot = null;  // حالت ایجاد جدید
    const today = new Date();
    const j = gregorianToJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
    viewYear = j.year;
    viewMonth = j.month;
    selectedJalaliDate = null;
    renderCalendar();            // رندر تقویم شمسی
    document.getElementById("slotTime").value = "";  // پاک کردن ساعت
    document.getElementById("slotModal").style.display = "flex";  // نمایش مودال
}

// -----------------------------------------------
// توابع تقویم شمسی
// -----------------------------------------------

/**
 * رندر کردن تقویم شمسی بر اساس viewYear و viewMonth
 */
function renderCalendar() {
    document.getElementById("calendarTitle").innerHTML = `${viewYear} / ${viewMonth}`;
    const grid = document.getElementById("calendarGrid");
    grid.innerHTML = "";

    const firstDayIndex = jalaliFirstWeekday(viewYear, viewMonth);  // اولین روز ماه
    const daysInMonth = jalaliMonthDays(viewYear, viewMonth);       // تعداد روزهای ماه

    // خانه‌های خالی ابتدای ماه
    for (let i = 0; i < firstDayIndex; i++) {
        grid.appendChild(document.createElement("div"));
    }

    // ساختن روزهای ماه
    for (let d = 1; d <= daysInMonth; d++) {
        const cell = document.createElement("div");
        cell.className = "calendar-day";
        cell.innerText = d;

        // رویداد کلیک روی هر روز: انتخاب آن روز
        cell.onclick = () => {
            selectedJalaliDate = { jy: viewYear, jm: viewMonth, jd: d };
            // حذف کلاس selected از همه روزها
            document.querySelectorAll(".calendar-day").forEach(c => c.classList.remove("selected"));
            cell.classList.add("selected");
        };

        grid.appendChild(cell);
    }
}

/**
 * رفتن به ماه قبل در تقویم
 */
function prevMonth() {
    viewMonth--;
    if (viewMonth < 1) {
        viewMonth = 12;
        viewYear--;
    }
    renderCalendar();
}

/**
 * رفتن به ماه بعد در تقویم
 */
function nextMonth() {
    viewMonth++;
    if (viewMonth > 12) {
        viewMonth = 1;
        viewYear++;
    }
    renderCalendar();
}

// -----------------------------------------------
// ذخیره، ویرایش و حذف نوبت‌ها
// -----------------------------------------------

/**
 * ذخیره نوبت جدید یا اعمال ویرایش
 */
function saveSlot() {
    // اعتبارسنجی: آیا روزی انتخاب شده؟
    if (!selectedJalaliDate) {
        alert("لطفاً یک روز از تقویم انتخاب کنید");
        return;
    }

    const timeVal = document.getElementById("slotTime").value;
    if (!timeVal) {
        alert("لطفاً ساعت را وارد کنید");
        return;
    }

    // تبدیل تاریخ انتخاب شده (شمسی) به میلادی برای ذخیره در داده
    const greg = jalaliToGregorian(selectedJalaliDate.jy, selectedJalaliDate.jm, selectedJalaliDate.jd);
    const dateStr = `${greg.year}-${pad2(greg.month)}-${pad2(greg.day)}`;

    // بررسی عدم تکراری بودن (ساعت تکراری برای یک روز)
    const duplicate = slots.find(s => s.date === dateStr && s.time === timeVal && s.id !== editingSlot);
    if (duplicate) {
        alert("این ساعت قبلاً ثبت شده است");
        return;
    }

    if (editingSlot) {
        // حالت ویرایش: پیدا کردن نوبت و بروزرسانی آن
        let slot = slots.find(s => s.id === editingSlot);
        if (slot) {
            slot.date = dateStr;
            slot.time = timeVal;
        }
    } else {
        // حالت ایجاد جدید: اضافه کردن نوبت با id یکتا (timestamp)
        slots.push({
            id: Date.now(),
            date: dateStr,
            time: timeVal,
            status: "available"
        });
    }

    editingSlot = null;
    closeModal("slotModal");
    renderSlots();  // به روز رسانی لیست نوبت‌ها
}

/**
 * ویرایش یک نوبت موجود
 * @param {number} id - آیدی نوبت مورد نظر
 */
function editSlot(id) {
    let slot = slots.find(s => s.id === id);

    // اگر نوبت رزرو شده باشد، اجازه ویرایش نمی‌دهیم و فقط اطلاعات مشتری را نشان می‌دهیم
    if (slot.status === "booked") {
        slotClick(id);
        return;
    }

    editingSlot = id;
    const [year, month, day] = slot.date.split("-").map(Number);
    const j = gregorianToJalali(year, month, day);

    // تنظیم نمای تقویم بر اساس تاریخ نوبت
    viewYear = j.year;
    viewMonth = j.month;
    selectedJalaliDate = { jy: j.year, jm: j.month, jd: j.day };
    renderCalendar();
    document.getElementById("slotTime").value = slot.time;
    document.getElementById("slotModal").style.display = "flex";

    // هایلایت کردن روز انتخاب شده در تقویم (با کمی تأخیر برای اطمینان از رندر شدن)
    setTimeout(() => {
        document.querySelectorAll(".calendar-day").forEach(cell => {
            if (cell.innerText == j.day) cell.classList.add("selected");
        });
    }, 50);
}

/**
 * حذف یک نوبت
 * @param {number} id - آیدی نوبت مورد نظر
 */
function deleteSlot(id) {
    let slot = slots.find(s => s.id === id);
    // اگر نوبت رزرو شده باشد، اجازه حذف نمی‌دهیم
    if (slot.status === "booked") {
        slotClick(id);
        return;
    } else {
        slots = slots.filter(s => s.id !== id);
    }
    renderSlots();
}

/**
 * کلیک روی دکمه ساعت نوبت (نمایش اطلاعات در صورت رزرو شده)
 * @param {number} id - آیدی نوبت
 */
function slotClick(id) {
    let slot = slots.find(s => s.id === id);
    if (slot.status === "booked" && slot.customer) {
        alert(`این نوبت رزرو شده است:\n${slot.customer.first} ${slot.customer.last}\n${slot.customer.phone}`);
    } else {
        alert("این نوبت در دسترس است");
    }
}

// -----------------------------------------------
// توابع عمومی
// -----------------------------------------------

/**
 * بستن مودال با شناسه مشخص
 * @param {string} id - آیدی المنت مودال
 */
function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

// -----------------------------------------------
// اجرای اولیه (بارگذاری صفحه)
// -----------------------------------------------
renderOrg();   // نمایش اطلاعات سازمان
renderSlots(); // نمایش لیست نوبت‌ها