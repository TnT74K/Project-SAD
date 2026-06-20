// =======================================================
// profile-edit.js
// مدیریت پروفایل سازمان، خدمات و نوبت‌ها
// =======================================================

// -----------------------------------------------
// داده‌های اصلی برنامه - Services
// -----------------------------------------------

let services = [
    { id: 1, name: "مشاوره", duration: 60 },
    { id: 2, name: "پشتیبانی", duration: 30 },
    { id: 3, name: "ثبت نام", duration: 45 }
];

let editingServiceId = null;

// -----------------------------------------------
// توابع کمکی - Helper Functions
// -----------------------------------------------

function pad2(n) {
    return String(n).padStart(2, "0");
}
/**
 * تبدیل یک تاریخ شمسی به آبجکت Date میلادی در ساعت 00:00
 */
function jalaliToDate(jy, jm, jd) {
    const g = jalaliToGregorian(jy, jm, jd);
    return new Date(g.year, g.month - 1, g.day);
}

/**
 * بررسی اینکه آیا یک تاریخ شمسی قبل از امروز است یا نه
 */
function isPastJalaliDate(jy, jm, jd) {
    const targetDate = jalaliToDate(jy, jm, jd);
    targetDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return targetDate < today;
}

function formatPrice(price) {
    return Number(price).toLocaleString("en-US");
}

function getServiceById(id) {
    return services.find(service => Number(service.id) === Number(id));
}

// -----------------------------------------------
// توابع تبدیل تاریخ شمسی <-> میلادی
// -----------------------------------------------

function gregorianToJalali(gy, gm, gd) {
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

    let jy = gy > 1600 ? 979 : 0;

    if (gy > 1600) {
        gy -= 1600;
    } else {
        gy -= 621;
    }

    const gy2 = gm > 2 ? gy + 1 : gy;

    let days =
        365 * gy +
        Math.floor((gy2 + 3) / 4) -
        Math.floor((gy2 + 99) / 100) +
        Math.floor((gy2 + 399) / 400) -
        80 +
        gd +
        g_d_m[gm - 1];

    jy += 33 * Math.floor(days / 12053);
    days %= 12053;

    jy += 4 * Math.floor(days / 1461);
    days %= 1461;

    if (days > 365) {
        jy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365;
    }

    const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
    const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);

    return { year: jy, month: jm, day: jd };
}

function jalaliToGregorian(jy, jm, jd) {
    jy += 1595;

    let days =
        -355668 +
        365 * jy +
        Math.floor(jy / 33) * 8 +
        Math.floor(((jy % 33) + 3) / 4) +
        jd;

    if (jm < 7) {
        days += (jm - 1) * 31;
    } else {
        days += (jm - 7) * 30 + 186;
    }

    let gy = 400 * Math.floor(days / 146097);
    days %= 146097;

    if (days > 36524) {
        gy += 100 * Math.floor(--days / 36524);
        days %= 36524;

        if (days >= 365) {
            days++;
        }
    }

    gy += 4 * Math.floor(days / 1461);
    days %= 1461;

    if (days > 365) {
        gy += Math.floor((days - 1) / 365);
        days = (days - 1) % 365;
    }

    let gd = days + 1;

    const sal_a = [
        0,
        31,
        (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ];

    let gm;

    for (gm = 1; gm <= 12; gm++) {
        const v = sal_a[gm];

        if (gd <= v) {
            break;
        }

        gd -= v;
    }

    return { year: gy, month: gm, day: gd };
}



function jalaliMonthDays(jy, jm) {
    if (jm <= 6) return 31;
    if (jm <= 11) return 30;

    // محاسبه ساده کبیسه جلالی
    return ((jy % 33) % 4 === 1) ? 30 : 29;
}

function jalaliFirstWeekday(jy, jm) {
    const g = jalaliToGregorian(jy, jm, 1);
    const d = new Date(g.year, g.month - 1, g.day);

    // getDay: Sunday = 0
    // تبدیل به Saturday = 0
    return (d.getDay() + 1) % 7;
}

// -----------------------------------------------
// State برنامه
// -----------------------------------------------

let selectedJalaliDate = null;
let viewYear;
let viewMonth;
let editingSlot = null;

let organization = {
    name: "مرکز تخصصی رزروسنتر",
    fullName: "سازمان خدمات نمونه کشوری",
    start: "08:00",
    end: "18:00",
    desc: "ارائه خدمات تخصصی در حوزه رزرواسیون آنلاین با بالاترین کیفیت",
    image: "https://formafzar.com/attachment/images/%D8%B1%D8%B2%D8%B1%D9%88-%D8%A2%D9%86%D9%84%D8%A7%DB%8C%D9%86.jpg",
    active: true
};

let slots = [
    {
        id: 1001,
        serviceId: 1,
        date: "2026-08-10",
        time: "10:00",
        status: "available",
        price: 10000,
        customer: null
    },
    {
        id: 1002,
        serviceId: 2,
        date: "2026-08-10",
        time: "11:30",
        status: "available",
        price: 12000,
        customer: null
    },
    {
        id: 1003,
        serviceId: 1,
        date: "2026-08-12",
        time: "09:00",
        status: "booked",
        price: 15200,
        customer: {
            first: "احمد",
            last: "رضایی",
            phone: "09128893645"
        }
    }
];

// -----------------------------------------------
// مدیریت مودال‌ها
// -----------------------------------------------

function openModal(id) {
    const modal = document.getElementById(id);

    if (modal) {
        modal.style.display = "flex";
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);

    if (modal) {
        modal.style.display = "none";
    }
}

// برای سازگاری با HTMLهای قبلی
function closeServicesModal() {
    closeModal("servicesModal");
}

// -----------------------------------------------
// مدیریت اطلاعات سازمان
// -----------------------------------------------

function renderOrg() {
    document.getElementById("orgName").innerText = organization.name;
    document.getElementById("orgFullName").innerText = organization.fullName;
    document.getElementById("orgHours").innerHTML = `${organization.start} الی ${organization.end}`;
    document.getElementById("orgDesc").innerText = organization.desc;
    document.getElementById("orgImage").src = organization.image;

    const statusSpan = document.getElementById("orgStatus");

    if (organization.active) {
        statusSpan.innerHTML = "● فعال";
        statusSpan.className = "meta-value status-active status-badge";
    } else {
        statusSpan.innerHTML = "● غیرفعال";
        statusSpan.className = "meta-value status-inactive status-badge";
    }
}

function openOrgModal() {
    document.getElementById("inputName").value = organization.name;
    document.getElementById("inputFullName").value = organization.fullName;
    document.getElementById("startHour").value = organization.start;
    document.getElementById("endHour").value = organization.end;
    document.getElementById("inputDesc").value = organization.desc;
    document.getElementById("orgActive").value = organization.active ? "true" : "false";

    openModal("orgModal");
}

function saveOrg() {
    const name = document.getElementById("inputName").value.trim();
    const fullName = document.getElementById("inputFullName").value.trim();
    const start = document.getElementById("startHour").value;
    const end = document.getElementById("endHour").value;
    const desc = document.getElementById("inputDesc").value.trim();
    const active = document.getElementById("orgActive").value === "true";

    if (!name) {
        alert("نام سازمان را وارد کنید");
        return;
    }

    organization.name = name;
    organization.fullName = fullName;
    organization.start = start;
    organization.end = end;
    organization.desc = desc;
    organization.active = active;

    const file = document.getElementById("imageUpload").files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = e => {
            organization.image = e.target.result;
            renderOrg();
        };

        reader.readAsDataURL(file);
    } else {
        renderOrg();
    }

    closeModal("orgModal");
}

// -----------------------------------------------
// مدیریت خدمات - CRUD Services
// -----------------------------------------------

function openServicesModal() {
    editingServiceId = null;

    document.getElementById("serviceName").value = "";
    document.getElementById("serviceDuration").value = "";

    renderServices();
    openModal("servicesModal");
}

function renderServices() {
    const list = document.getElementById("servicesList");

    if (!list) return;

    list.innerHTML = "";

    if (services.length === 0) {
        list.innerHTML = `<li class="empty-state">هنوز خدمتی ثبت نشده است.</li>`;
        return;
    }

    services.forEach(service => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="service-item">
                <div>
                    <strong>${service.name}</strong>
                    <span>(${service.duration} دقیقه)</span>
                </div>

                <div class="service-actions">
                    <button type="button" onclick="editService(${service.id})" title="ویرایش">✏️</button>
                    <button type="button" onclick="deleteService(${service.id})" title="حذف">🗑️</button>
                </div>
            </div>
        `;

        list.appendChild(li);
    });
}

function saveService() {
    const name = document.getElementById("serviceName").value.trim();
    const durationValue = document.getElementById("serviceDuration").value.trim();
    const duration = Number(durationValue);

    if (!name) {
        alert("نام خدمت را وارد کنید");
        return;
    }

    if (!durationValue || isNaN(duration) || duration <= 0) {
        alert("مدت زمان خدمت را به‌درستی وارد کنید");
        return;
    }

    if (editingServiceId) {
        const service = services.find(s => Number(s.id) === Number(editingServiceId));

        if (service) {
            service.name = name;
            service.duration = duration;
        }

        editingServiceId = null;
    } else {
        services.push({
            id: Date.now(),
            name,
            duration
        });
    }

    document.getElementById("serviceName").value = "";
    document.getElementById("serviceDuration").value = "";

    renderServices();
    populateServiceFilter();
    populateServiceSelect();
    renderSlots();
}

function editService(id) {
    const service = getServiceById(id);

    if (!service) {
        alert("خدمت موردنظر پیدا نشد");
        return;
    }

    document.getElementById("serviceName").value = service.name;
    document.getElementById("serviceDuration").value = service.duration;

    editingServiceId = id;
}

function deleteService(id) {
    const service = getServiceById(id);

    if (!service) {
        alert("خدمت موردنظر پیدا نشد");
        return;
    }

    const hasSlots = slots.some(slot => Number(slot.serviceId) === Number(id));

    if (hasSlots) {
        alert("این خدمت دارای نوبت ثبت‌شده است. ابتدا نوبت‌های مربوط به آن را حذف کنید.");
        return;
    }

    const confirmDelete = confirm(`آیا از حذف خدمت "${service.name}" مطمئن هستید؟`);

    if (!confirmDelete) return;

    services = services.filter(s => Number(s.id) !== Number(id));

    if (Number(editingServiceId) === Number(id)) {
        editingServiceId = null;
        document.getElementById("serviceName").value = "";
        document.getElementById("serviceDuration").value = "";
    }

    renderServices();
    populateServiceFilter();
    populateServiceSelect();
    renderSlots();
}

function populateServiceSelect(selectedServiceId = null) {
    const select = document.getElementById("slotService");

    if (!select) return;

    select.innerHTML = "";

    if (services.length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "هیچ خدمتی ثبت نشده";
        select.appendChild(option);
        return;
    }

    services.forEach(service => {
        const option = document.createElement("option");
        option.value = service.id;
        option.textContent = `${service.name} - ${service.duration} دقیقه`;

        if (selectedServiceId && Number(selectedServiceId) === Number(service.id)) {
            option.selected = true;
        }

        select.appendChild(option);
    });
}

function populateServiceFilter() {
    const select = document.getElementById("filterService");

    if (!select) return;

    const currentValue = select.value;

    select.innerHTML = `<option value="">همه خدمات</option>`;

    services.forEach(service => {
        const option = document.createElement("option");
        option.value = service.id;
        option.textContent = service.name;

        if (currentValue && Number(currentValue) === Number(service.id)) {
            option.selected = true;
        }

        select.appendChild(option);
    });
}

// -----------------------------------------------
// مدیریت نوبت‌ها
// -----------------------------------------------

function renderSlots() {
    const container = document.getElementById("appointments");

    if (!container) return;

    const filterService = document.getElementById("filterService")?.value || "";

    let filteredSlots = [...slots];

    if (filterService) {
        filteredSlots = filteredSlots.filter(slot => Number(slot.serviceId) === Number(filterService));
    }

    filteredSlots.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);

        if (dateCompare !== 0) return dateCompare;

        return a.time.localeCompare(b.time);
    });

    container.innerHTML = "";

    if (filteredSlots.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                نوبتی برای نمایش وجود ندارد.
            </div>
        `;
        return;
    }

    const groups = {};

    filteredSlots.forEach(slot => {
        if (!groups[slot.date]) {
            groups[slot.date] = [];
        }

        groups[slot.date].push(slot);
    });

    Object.keys(groups).sort().forEach(date => {
        const [year, month, day] = date.split("-").map(Number);
        const j = gregorianToJalali(year, month, day);

        const card = document.createElement("div");
        card.className = "appointment-group";

        let html = `
            <div class="appointment-date">
                📆 ${j.year}/${pad2(j.month)}/${pad2(j.day)}
            </div>

            <div class="appointment-times">
        `;

        groups[date].forEach(slot => {
            const service = getServiceById(slot.serviceId);
            const serviceName = service ? service.name : "خدمت حذف‌شده";
            const isBooked = slot.status === "booked";

            html += `
                <div class="time-slot">
                    <button 
                        type="button"
                        class="time-btn ${isBooked ? "booked" : "available"}"
                        onclick="slotClick(${slot.id})"
                    >
                        <span>${slot.time}</span>
                        <small>${serviceName}</small>
                        <strong>${slot.price ? formatPrice(slot.price) + " تومان" : "بدون قیمت"}</strong>
                    </button>

                    <div class="slot-actions">
                        <button type="button" onclick="editSlot(${slot.id})" title="ویرایش">✏️</button>
                        <button type="button" onclick="deleteSlot(${slot.id})" title="حذف">🗑️</button>
                    </div>
                </div>
            `;
        });

        html += `</div>`;

        card.innerHTML = html;
        container.appendChild(card);
    });
}

function openSlotModal() {
    if (services.length === 0) {
        alert("ابتدا حداقل یک خدمت تعریف کنید.");
        openServicesModal();
        return;
    }

    editingSlot = null;

    const today = new Date();
    const j = gregorianToJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());

    viewYear = j.year;
    viewMonth = j.month;
    selectedJalaliDate = null;

    document.getElementById("slotTitle").innerText = "📆 ثبت نوبت جدید";
    document.getElementById("slotTime").value = "";
    document.getElementById("slotPrice").value = "";

    populateServiceSelect();
    renderCalendar();

    openModal("slotModal");
}

function saveSlot() {
    if (services.length === 0) {
        alert("ابتدا یک خدمت تعریف کنید");
        return;
    }

    const serviceId = Number(document.getElementById("slotService").value);

    if (!serviceId) {
        alert("لطفاً خدمت را انتخاب کنید");
        return;
    }

    if (!selectedJalaliDate) {
        alert("لطفاً یک روز از تقویم انتخاب کنید");
        return;
    }

    if (
        isPastJalaliDate(
            selectedJalaliDate.jy,
            selectedJalaliDate.jm,
            selectedJalaliDate.jd
        )
    ) {
        alert("امکان ثبت نوبت برای روزهای گذشته وجود ندارد");
        return;
    }

    const timeVal = document.getElementById("slotTime").value;

    if (!timeVal) {
        alert("لطفاً ساعت نوبت را وارد کنید");
        return;
    }

    const priceInput = document.getElementById("slotPrice").value.trim();

    if (priceInput === "") {
        alert("لطفاً مبلغ را وارد کنید");
        return;
    }

    const price = Number(priceInput);

    if (isNaN(price) || price < 0) {
        alert("مبلغ وارد شده نامعتبر است");
        return;
    }

    const greg = jalaliToGregorian(
        selectedJalaliDate.jy,
        selectedJalaliDate.jm,
        selectedJalaliDate.jd
    );

    const dateStr = `${greg.year}-${pad2(greg.month)}-${pad2(greg.day)}`;

    const duplicate = slots.find(slot => {
        const isSameSlot =
            slot.date === dateStr &&
            slot.time === timeVal &&
            Number(slot.serviceId) === Number(serviceId);

        const isNotCurrentEditingSlot =
            !editingSlot || Number(slot.id) !== Number(editingSlot);

        return isSameSlot && isNotCurrentEditingSlot;
    });

    if (duplicate) {
        alert("برای این خدمت، در این تاریخ و ساعت قبلاً نوبت ثبت شده است.");
        return;
    }

    if (editingSlot) {
        const slot = slots.find(s => Number(s.id) === Number(editingSlot));

        if (slot) {
            slot.serviceId = serviceId;
            slot.date = dateStr;
            slot.time = timeVal;
            slot.price = price;
        }
    } else {
        slots.push({
            id: Date.now(),
            serviceId,
            date: dateStr,
            time: timeVal,
            status: "available",
            price,
            customer: null
        });
    }

    editingSlot = null;

    closeModal("slotModal");
    renderSlots();
}


function editSlot(id) {
    const slot = slots.find(s => Number(s.id) === Number(id));

    if (!slot) {
        alert("نوبت موردنظر پیدا نشد");
        return;
    }

    if (slot.status === "booked") {
        slotClick(id);
        return;
    }

    editingSlot = id;

    const [year, month, day] = slot.date.split("-").map(Number);
    const j = gregorianToJalali(year, month, day);

    viewYear = j.year;
    viewMonth = j.month;
    selectedJalaliDate = {
        jy: j.year,
        jm: j.month,
        jd: j.day
    };

    document.getElementById("slotTitle").innerText = "✏️ ویرایش نوبت";
    document.getElementById("slotTime").value = slot.time;
    document.getElementById("slotPrice").value = slot.price || "";

    populateServiceSelect(slot.serviceId);
    renderCalendar();

    openModal("slotModal");
}

function deleteSlot(id) {
    const slot = slots.find(s => Number(s.id) === Number(id));

    if (!slot) {
        alert("نوبت موردنظر پیدا نشد");
        return;
    }

    if (slot.status === "booked") {
        slotClick(id);
        return;
    }

    const confirmDelete = confirm("آیا از حذف این نوبت مطمئن هستید؟");

    if (!confirmDelete) return;

    slots = slots.filter(s => Number(s.id) !== Number(id));

    renderSlots();
}

function slotClick(id) {
    const slot = slots.find(s => Number(s.id) === Number(id));

    if (!slot) {
        alert("نوبت موردنظر پیدا نشد");
        return;
    }

    const service = getServiceById(slot.serviceId);
    const serviceName = service ? service.name : "نامشخص";

    if (slot.status === "booked" && slot.customer) {
        alert(
            `این نوبت رزرو شده است:\n\n` +
            `خدمت: ${serviceName}\n` +
            `ساعت: ${slot.time}\n` +
            `قیمت: ${formatPrice(slot.price)} تومان\n\n` +
            `نام مشتری: ${slot.customer.first} ${slot.customer.last}\n` +
            `شماره تماس: ${slot.customer.phone}`
        );
    } else {
        alert(
            `این نوبت در دسترس است:\n\n` +
            `خدمت: ${serviceName}\n` +
            `ساعت: ${slot.time}\n` +
            `قیمت: ${formatPrice(slot.price)} تومان`
        );
    }
}

// -----------------------------------------------
// تقویم شمسی
// -----------------------------------------------

function renderCalendar() {
    const title = document.getElementById("calendarTitle");
    const grid = document.getElementById("calendarGrid");

    if (!title || !grid) return;

    title.innerHTML = `${viewYear} / ${pad2(viewMonth)}`;
    grid.innerHTML = "";

    const firstDayIndex = jalaliFirstWeekday(viewYear, viewMonth);
    const daysInMonth = jalaliMonthDays(viewYear, viewMonth);

    for (let i = 0; i < firstDayIndex; i++) {
        const empty = document.createElement("div");
        empty.className = "calendar-empty";
        grid.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const cell = document.createElement("div");
        cell.className = "calendar-day";
        cell.innerText = d;

        const isPast = isPastJalaliDate(viewYear, viewMonth, d);

        const isSelected =
            selectedJalaliDate &&
            selectedJalaliDate.jy === viewYear &&
            selectedJalaliDate.jm === viewMonth &&
            selectedJalaliDate.jd === d &&
            !isPast;

        if (isPast) {
            // روزهای گذشته غیرفعال می‌شوند و قابل انتخاب نیستند
            cell.classList.add("disabled");
        } else {
            if (isSelected) {
                cell.classList.add("selected");
            }

            cell.onclick = () => {
                selectedJalaliDate = {
                    jy: viewYear,
                    jm: viewMonth,
                    jd: d
                };

                document.querySelectorAll(".calendar-day").forEach(dayCell => {
                    dayCell.classList.remove("selected");
                });

                cell.classList.add("selected");
            };
        }

        grid.appendChild(cell);
    }
}

function prevMonth() {
    viewMonth--;

    if (viewMonth < 1) {
        viewMonth = 12;
        viewYear--;
    }

    renderCalendar();
}

function nextMonth() {
    viewMonth++;

    if (viewMonth > 12) {
        viewMonth = 1;
        viewYear++;
    }

    renderCalendar();
}

// -----------------------------------------------
// اجرای اولیه صفحه
// -----------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    renderOrg();

    populateServiceFilter();
    populateServiceSelect();
    renderServices();
    renderSlots();
});
