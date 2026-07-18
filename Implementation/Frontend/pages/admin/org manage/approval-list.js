/* ═══════════════════════════════════════════════════════
   app.js — منطق اصلی صفحه تأیید کسب‌وکارها
   ═══════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────
   داده‌های نمونه — لیست کسب‌وکارهایی که
   منتظر بررسی هستن. در یه پروژه واقعی
   این‌ها از API سرور میان
───────────────────────────────────────── */
let businesses = [
  {
    id: "BIZ-1001",
    name: "آرایشگاه مدرن ولیعصر",
    category: "آرایشگاه",
    owner: "علی رضایی",
    ownerPhone: "09123456789",
    city: "تهران",
    address: "خیابان ولیعصر، نرسیده به میدان ونک",
    submitDate: "1405/03/01",
    description: "آرایشگاه مردانه با بیش از ۱۰ سال سابقه، ارائه خدمات کوتاهی مو، اصلاح ریش و رنگ‌آمیزی."
  },
  {
    id: "BIZ-1002",
    name: "کلینیک تخصصی آرمیتا",
    category: "کلینیک",
    owner: "دکتر مریم احمدی",
    ownerPhone: "09387654321",
    city: "تهران",
    address: "نیاوران، خیابان کامرانیه شمالی",
    submitDate: "1405/03/03",
    description: "کلینیک زیبایی و پوست با تجهیزات پیشرفته، ارائه خدمات لیزر، بوتاکس و فیلر.",
  },
  {
    id: "BIZ-1003",
    name: "باشگاه پاور فیتنس",
    category: "باشگاه",
    owner: "رضا کریمی",
    ownerPhone: "09211234567",
    city: "تهران",
    address: "سعادت‌آباد، بلوار دادمان",
    submitDate: "1405/03/05",
    description: "باشگاه بدنسازی مجهز با دستگاه‌های روز دنیا و مربیان دارای مدرک فدراسیون.",
  },
  {
    id: "BIZ-1004",
    name: "دندانپزشکی دکتر نوری",
    category: "دندانپزشکی",
    owner: "دکتر سعید نوری",
    ownerPhone: "09141122334",
    city: "اصفهان",
    address: "خیابان چهارباغ بالا، پلاک ۲۴",
    submitDate: "1405/03/06",
    description: "مطب تخصصی دندانپزشکی ارائه‌دهنده خدمات ایمپلنت، ارتودنسی، لمینت و بلیچینگ.",
  },
  {
    id: "BIZ-1005",
    name: "سالن زیبایی نگار",
    category: "سالن زیبایی",
    owner: "فاطمه حسینی",
    ownerPhone: "09369988776",
    city: "مشهد",
    address: "خیابان امام رضا، نبش کوچه ۱۲",
    submitDate: "1405/03/08",
    description: "سالن زیبایی بانوان با خدمات کامل شامل آرایش عروس، کوتاهی و رنگ مو در فضایی لوکس.",
  },
];


/* ─────────────────────────────────────────
   وضعیت عملیات در انتظار
   وقتی کاربر روی تأیید یا رد کلیک می‌کنه،
   قبل از انجام نهایی اینجا نگه می‌داریم
───────────────────────────────────────── */
let pendingId = null;  // شناسه کسب‌وکاری که داره پردازش میشه
let pendingType = null;  // نوع عملیات: 'approve' یا 'reject'

/* لیست آیدی‌هایی که الان توی جدول نمایش دارن */
let visibleIds = businesses.map(b => b.id);


/* ═══════════════════════════════════════════════════════
   رندر و نمایش
   ═══════════════════════════════════════════════════════ */

/**
 * نوار آمار بالای جدول رو به‌روز می‌کنه
 * تعداد کل، در انتظار و ثبت‌شده امروز
 */
function renderStats() {
  const total = businesses.length;

  // فیلتر موردی — فقط ثبت‌شده‌های امروز (۰۴/۰۸) رو حساب می‌کنیم
  // در پروژه واقعی باید با تاریخ امروز مقایسه بشه
  const todayCount = businesses.filter(b => b.submitDate.includes("۰۴/۰۸")).length;

  document.getElementById("statsBar").innerHTML = `
    <div class="stat-badge total">🏢 در انتظار بررسی: ${total}</div>
    <div class="stat-badge pending">⏳ ثبت‌شده: ${total}</div>
    <div class="stat-badge today">📅 امروز: ${todayCount}</div>
  `;
}


/**
 * جدول رو با لیست آیدی‌های داده‌شده رندر می‌کنه
 * اگه لیست خالی بود، پیام "موردی یافت نشد" نشون میده
 *
 * @param {string[]} ids - آرایه‌ای از شناسه‌های کسب‌وکار
 */
function render(ids) {
  const table = document.getElementById("businessTable");

  // اگه نتیجه‌ای نبود، یه پیام ساده نشون بده
  if (ids.length === 0) {
    table.innerHTML = `<tr><td colspan="6" class="empty-state">هیچ کسب‌وکاری برای نمایش وجود ندارد.</td></tr>`;
    renderStats();
    return;
  }

  // برای هر آیدی، یه ردیف HTML میسازیم
  table.innerHTML = ids.map(id => {
    const b = businesses.find(x => x.id === id);
    if (!b) return ''; // اگه کسب‌وکار پیدا نشد رد میکنیم

    return `
      <tr>
        <!-- ستون نام: آیکون + اسم -->
        <td data-label="نام کسب‌وکار">
          <div class="biz-cell">
            <div>
              <div class="business-name">${b.name}</div>
            </div>
          </div>
        </td>

        <!-- دسته‌بندی با بج رنگی -->
        <td data-label="دسته‌بندی"><span class="category-badge">${b.category}</span></td>

        <td data-label="مالک">${b.owner}</td>
        <td data-label="شهر">${b.city}</td>

        <!-- تاریخ ثبت — LTR چون عدده -->
        <td data-label="تاریخ ثبت" style="direction:ltr;font-size:0.82rem;color:var(--text);">${b.submitDate}</td>

        <!-- دکمه‌های عملیات -->
        <td data-label="عملیات" class="actions">
          <button class="btn-detail"  onclick="openDetail('${b.id}')">🔵 جزئیات</button>
          <button class="btn-approve" onclick="askAction('${b.id}','approve')">✓ تأیید</button>
          <button class="btn-reject"  onclick="askAction('${b.id}','reject')">✕ رد</button>
        </td>
      </tr>`;
  }).join('');

  renderStats();
}


/* ═══════════════════════════════════════════════════════
   جستجو و فیلتر
   ═══════════════════════════════════════════════════════ */

/**
 * فیلترها رو اعمال می‌کنه و جدول رو دوباره رندر میگیره
 * هم جستجوی آزاد (متن) هم فیلتر دسته‌بندی رو پشتیبانی می‌کنه
 */
function applyFilters() {
  const q = document.getElementById("searchInput").value.trim();
  const cat = document.getElementById("catFilter").value;

  visibleIds = businesses
    .filter(b => {
      // اگه جستجویی وارد شده، باید توی نام، مالک یا شهر باشه
      const matchQ = !q || b.name.includes(q) || b.owner.includes(q) || b.city.includes(q);

      // اگه دسته‌بندی انتخاب شده، باید مطابقت داشته باشه
      const matchCat = !cat || b.category === cat;

      return matchQ && matchCat;
    })
    .map(b => b.id);

  render(visibleIds);
}


/**
 * فیلترها رو پاک می‌کنه و همه کسب‌وکارها رو نشون میده
 */
function showAll() {
  document.getElementById("searchInput").value = "";
  document.getElementById("catFilter").value = "";
  visibleIds = businesses.map(b => b.id);
  render(visibleIds);
}

/* جستجو با Enter هم کار کنه — راحت‌تره */
document.getElementById("searchInput").addEventListener("keydown", e => {
  if (e.key === "Enter") applyFilters();
});


/* ═══════════════════════════════════════════════════════
   مدال جزئیات کسب‌وکار
   ═══════════════════════════════════════════════════════ */

/**
 * مدال جزئیات رو با اطلاعات کسب‌وکار انتخاب‌شده باز می‌کنه
 * @param {string} id - شناسه کسب‌وکار
 */
function openDetail(id) {
  const b = businesses.find(x => x.id === id);
  if (!b) return; // اگه پیدا نشد کاری نمی‌کنیم

  // پر کردن هدر مدال
  document.getElementById("detailName").textContent = b.name;
  document.getElementById("detailCat").textContent = b.category + " · " + b.city;

  // پر کردن گرید اطلاعات
  document.getElementById("detailGrid").innerHTML = `
    <div class="detail-field">
      <div class="detail-field-label">مالک / مسئول</div>
      <div class="detail-field-value">${b.owner}</div>
    </div>
    <div class="detail-field">
      <div class="detail-field-label">شماره تماس</div>
      <!-- شماره تلفن LTR نشون داده میشه چون عدده -->
      <div class="detail-field-value" style="direction:ltr;">${b.ownerPhone}</div>
    </div>
    <div class="detail-field">
      <div class="detail-field-label">شهر</div>
      <div class="detail-field-value">${b.city}</div>
    </div>
    <div class="detail-field">
      <div class="detail-field-label">تاریخ ثبت</div>
      <div class="detail-field-value" style="direction:ltr;">${b.submitDate}</div>
    </div>
    <!-- آدرس و توضیحات — تمام‌عرض -->
    <div class="detail-field full">
      <div class="detail-field-label">آدرس</div>
      <div class="detail-field-value light">${b.address}</div>
    </div>
    <div class="detail-field full">
      <div class="detail-field-label">توضیحات</div>
      <div class="detail-field-value light">${b.description}</div>
    </div>
  `;

  // دکمه‌های فوتر مدال رو به این کسب‌وکار وصل می‌کنیم
  // اول مدال جزئیات رو می‌بندیم، بعد مدال تأیید باز میشه
  document.getElementById("dfApprove").onclick = () => { closeDetail(); askAction(id, 'approve'); };
  document.getElementById("dfReject").onclick = () => { closeDetail(); askAction(id, 'reject'); };

  document.getElementById("detailModal").classList.add("open");
}


/**
 * مدال جزئیات رو می‌بنده
 */
function closeDetail() {
  document.getElementById("detailModal").classList.remove("open");
}


/* ═══════════════════════════════════════════════════════
   مدال تأیید عملیات
   ═══════════════════════════════════════════════════════ */

/**
 * قبل از انجام عملیات تأیید یا رد، از کاربر تأیید می‌گیره
 * متن و رنگ مدال بسته به نوع عملیات تغییر می‌کنه
 *
 * @param {string} id   - شناسه کسب‌وکار
 * @param {string} type - نوع عملیات: 'approve' یا 'reject'
 */
function askAction(id, type) {
  const b = businesses.find(x => x.id === id);
  if (!b) return;

  // وضعیت pending رو ذخیره می‌کنیم تا وقتی کاربر تأیید کرد، بدونیم چیکار کنیم
  pendingId = id;
  pendingType = type;

  const okBtn = document.getElementById("confirmOkBtn");

  if (type === 'approve') {
    // حالت تأیید — متن و رنگ سبز
    document.getElementById("confirmTitle").textContent = "تأیید کسب‌وکار";
    document.getElementById("confirmText").innerHTML = `آیا از تأیید کسب‌وکار <span>${b.name}</span> اطمینان دارید؟`;
    okBtn.textContent = "تأیید";
    okBtn.className = "ca-approve";
  } else {
    // حالت رد — متن و رنگ قرمز
    document.getElementById("confirmTitle").textContent = "رد کردن کسب‌وکار";
    document.getElementById("confirmText").innerHTML = `آیا از رد کردن کسب‌وکار <span>${b.name}</span> اطمینان دارید؟`;
    okBtn.textContent = "رد کردن";
    okBtn.className = "ca-reject";
  }

  document.getElementById("confirmModal").classList.add("open");
}


/**
 * عملیات نهایی رو انجام میده
 * کسب‌وکار رو از لیست حذف می‌کنه (تأیید یا رد — هر دو از صف خارج میشن)
 * در پروژه واقعی باید یه API call بره
 */
function doAction() {
  // کسب‌وکار رو از هر دو آرایه حذف می‌کنیم
  businesses = businesses.filter(b => b.id !== pendingId);
  visibleIds = visibleIds.filter(id => id !== pendingId);

  render(visibleIds);
  closeConfirm();
}


/**
 * مدال تأیید رو می‌بنده و وضعیت pending رو پاک می‌کنه
 */
function closeConfirm() {
  document.getElementById("confirmModal").classList.remove("open");
  pendingId = null;
  pendingType = null;
}


/* ═══════════════════════════════════════════════════════
   رویدادهای کیبورد و کلیک خارج از مدال
   ═══════════════════════════════════════════════════════ */

/* ESC — هر دو مدال رو می‌بنده */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeDetail();
    closeConfirm();
  }
});

/* کلیک روی overlay (خارج از مدال) هم می‌بنده */
document.getElementById("detailModal").addEventListener("click", function (e) {
  if (e.target === this) closeDetail();
});

document.getElementById("confirmModal").addEventListener("click", function (e) {
  if (e.target === this) closeConfirm();
});


/* ─────────────────────────────────────────
   شروع — وقتی صفحه لود میشه جدول رو نشون بده
───────────────────────────────────────── */
render(visibleIds);
