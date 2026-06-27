/* =============================================
   داده‌های کسب‌وکارها (Mock Data)
   در پروژه واقعی از API دریافت می‌شود
   =============================================
   هر آبجکت شامل:
     name     : نام سازمان
     category : دسته‌بندی فعالیت
     owner    : نام مالک / مدیر
     blocked  : وضعیت مسدود (true/false)
   ============================================= */
let businesses = [
  {
    name: "کلینیک دندانپزشکی مهر",
    category: "دندانپزشکی",
    owner: "دکتر رضا نوری",
    blocked: false
  },
  {
    name: "آرایشگاه مردانه سپهر",
    category: "آرایشگاه مردانه",
    owner: "امیرحسین کاظمی",
    blocked: false
  },
   {
    name: "سالن زیبایی رز سفید",
    category: "سالن زیبایی",
    owner: "مهسا رضایی",
    blocked: true
  },
   {
    name: "مطب پزشک عمومی سلامت",
    category: "پزشک عمومی",
    owner: "دکتر نازنین احمدی",
    blocked: false
  },
  {
    name: "کلینیک دندانپزشکی مهر",
    category: "خدمات پزشکی",
    owner: "دکتر رضا نوری",
    blocked: true
  },
  {
    name: "باشگاه ورزشی انرژی",
    category: "باشگاه ورزشی",
    owner: "علیرضا محمدی",
    blocked: false
  },
 {
    name: "تعمیرگاه خودرو اعتماد",
    category: "مکانیکی و تعمیر خودرو",
    owner: "حمید اکبری",
    blocked: false
  },
  {
    name: "آتلیه عکاسی نگاه",
    category: "آتلیه عکاسی",
    owner: "سعید عباسی",
    blocked: false
  }
];

/* =============================================
   متغیرهای وضعیت (State)
   ============================================= */

// ایندکس کسب‌وکاری که در انتظار تأیید عملیات است
let pendingIndex = null;

// آرایه ایندکس‌های کسب‌وکارهای نمایش‌داده‌شده (بعد از فیلتر جستجو)
let filteredIndices = businesses.map((_, i) => i);

/* =============================================
   تابع renderStats
   آمار کلی را در نوار بالای جدول نمایش می‌دهد
   ============================================= */
function renderStats() {
  const total = businesses.length;
  const blocked = businesses.filter(b => b.blocked).length;
  const active = total - blocked;

  document.getElementById("statsBar").innerHTML = `
    <div class="stat-badge total">🏢 کل: ${total}</div>
    <div class="stat-badge active">✅ فعال: ${active}</div>
    <div class="stat-badge blocked">🚫 مسدود: ${blocked}</div>
  `;
}

/* =============================================
   تابع render
   ردیف‌های جدول را بر اساس آرایه ایندکس‌ها رندر می‌کند
   @param {number[]} indices - آرایه ایندکس‌های قابل نمایش
   ============================================= */
function render(indices) {
  const table = document.getElementById("businessTable");

  // اگر نتیجه‌ای وجود نداشت، پیام خالی نمایش بده
  if (indices.length === 0) {
    table.innerHTML = `<tr><td colspan="5" class="empty-state">هیچ کسب‌وکاری یافت نشد.</td></tr>`;
    return;
  }

  // ساخت HTML هر ردیف
  table.innerHTML = indices.map(i => {
    const b = businesses[i];

    // انتخاب نشانگر وضعیت بر اساس مقدار blocked
    const statusHtml = b.blocked
      ? `<span class="status-blocked">مسدود</span>`
      : `<span class="status-active">فعال</span>`;

    // انتخاب دکمه عملیاتی بر اساس وضعیت
    const actionBtn = b.blocked
      ? `<button class="btn-unblock" onclick="askToggle(${i})">رفع مسدودیت</button>`
      : `<button class="btn-block" onclick="askToggle(${i})">مسدودسازی</button>`;

    // data-label برای نمایش موبایل (کارت‌شده) استفاده می‌شود
    return `
      <tr>
        <td data-label="نام سازمان">
          <div class="business-name">${b.name}</div>
        </td>
        <td data-label="دسته‌بندی"><span class="category-badge">${b.category}</span></td>
        <td data-label="مالک">${b.owner}</td>
        <td data-label="وضعیت">${statusHtml}</td>
        <td data-label="عملیات" class="actions">${actionBtn}</td>
      </tr>
    `;
  }).join('');

  // به‌روزرسانی آمار بعد از هر بار رندر
  renderStats();
}

/* =============================================
   تابع showAll
   فیلتر جستجو را پاک کرده و همه کسب‌وکارها را نمایش می‌دهد
   ============================================= */
function showAll() {
  document.getElementById("searchInput").value = "";
  filteredIndices = businesses.map((_, i) => i); // همه ایندکس‌ها
  render(filteredIndices);
}

/* =============================================
   تابع searchBusiness
   بر اساس متن جستجو، لیست را فیلتر می‌کند
   جستجو در: نام سازمان، نام مالک، دسته‌بندی
   ============================================= */
function searchBusiness() {
  const text = document.getElementById("searchInput").value.trim();

  // اگر متن جستجو خالی بود، همه را نمایش بده
  if (!text) { showAll(); return; }

  // فیلتر کردن بر اساس متن وارد‌شده
  filteredIndices = businesses
    .map((b, i) => ({ b, i }))
    .filter(({ b }) =>
      b.name.includes(text) ||
      b.owner.includes(text) ||
      b.category.includes(text)
    )
    .map(({ i }) => i);

  render(filteredIndices);
}

/* جستجو با فشردن کلید Enter */
document.getElementById("searchInput").addEventListener("keydown", e => {
  if (e.key === "Enter") searchBusiness();
});

/* =============================================
   تابع askToggle
   مودال تأیید را باز کرده و اطلاعات کسب‌وکار را درون آن نمایش می‌دهد
   @param {number} i - ایندکس کسب‌وکار در آرایه businesses
   ============================================= */
function askToggle(i) {
  pendingIndex = i; // ذخیره ایندکس برای استفاده در confirmAction
  const b = businesses[i];
  const isBlocked = b.blocked;

  // تنظیم عنوان مودال بر اساس عملیات
  document.getElementById("modalTitle").textContent =
    isBlocked ? "رفع مسدودیت کسب‌وکار" : "مسدودسازی کسب‌وکار";

  // تنظیم متن پیام مودال
  document.getElementById("modalBody").innerHTML = isBlocked
    ? `آیا از رفع مسدودیت کسب‌وکار <span>${b.name}</span> اطمینان دارید؟`
    : `آیا از مسدودسازی کسب‌وکار <span>${b.name}</span> اطمینان دارید؟`;

  // تنظیم رنگ و متن دکمه تأیید
  const btn = document.getElementById("modalConfirmBtn");
  btn.textContent = isBlocked ? "رفع مسدودیت" : "مسدودسازی";
  btn.style.background = isBlocked ? "var(--green)" : "var(--red)";
  btn.style.color = "white";

  // نمایش مودال
  document.getElementById("confirmModal").classList.add("open");
}

/* =============================================
   تابع confirmAction
   عملیات تغییر وضعیت را اجرا می‌کند
   پس از تأیید کاربر در مودال فراخوانی می‌شود
   ============================================= */
function confirmAction() {
  if (pendingIndex === null) return;

  // معکوس کردن مقدار blocked
  businesses[pendingIndex].blocked = !businesses[pendingIndex].blocked;

  // رندر مجدد جدول با لیست فعلی فیلترشده
  render(filteredIndices);
  closeModal();
}

/* =============================================
   تابع closeModal
   مودال را می‌بندد و وضعیت pendingIndex را ریست می‌کند
   ============================================= */
function closeModal() {
  document.getElementById("confirmModal").classList.remove("open");
  pendingIndex = null;
}

/* =============================================
   اجرای اولیه
   هنگام بارگذاری صفحه، جدول و آمار رندر می‌شوند
   ============================================= */
render(filteredIndices);
renderStats();