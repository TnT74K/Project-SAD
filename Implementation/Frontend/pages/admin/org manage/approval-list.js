/* ═══════════════════════════════════════════════════════
   app.js — منطق اصلی صفحه تأیید کسب‌وکارها
   ═══════════════════════════════════════════════════════ */

const API_BASE_URL = "http://localhost:5000/api";
function getToken() { return localStorage.getItem("token"); }


/* ─────────────────────────────────────────
   داده‌های کسب‌وکارها — از API لود میشن
───────────────────────────────────────── */
let businesses = [];


/* ─────────────────────────────────────────
   وضعیت عملیات در انتظار
   وقتی کاربر روی تأیید یا رد کلیک می‌کنه،
   قبل از انجام نهایی اینجا نگه می‌داریم
───────────────────────────────────────── */
let pendingId   = null;  // شناسه کسب‌وکاری که داره پردازش میشه
let pendingType = null;  // نوع عملیات: 'approve' یا 'reject'

/* لیست آیدی‌هایی که الان توی جدول نمایش دارن */
let visibleIds = [];


/* ═══════════════════════════════════════════════════════
   رندر و نمایش
   ═══════════════════════════════════════════════════════ */

/**
 * نوار آمار بالای جدول رو به‌روز می‌کنه
 * تعداد کل، در انتظار و ثبت‌شده امروز
 */
function renderStats() {
  const total = businesses.length;

  // فیلتر موردی — فقط ثبت‌شده‌های امروز رو حساب می‌کنیم
  // در پروژه واقعی باید با تاریخ امروز مقایسه بشه
  const today = new Date().toLocaleDateString('fa-IR');
  const todayCount = businesses.filter(b => b.submitDate === today).length;

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
   لود داده‌ها از API
   ═══════════════════════════════════════════════════════ */

/**
 * لیست کسب‌وکارهای منتظر تأیید رو از سرور می‌گیره
 */
async function loadBusinesses() {
  try {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/org/admin/approval-list`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error(`خطا در دریافت اطلاعات (${res.status})`);

    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.data || data || []);

    businesses = list.map(item => ({
      id: String(item.id),
      name: item.name,
      category: item.category,
      owner: item.ownerName,
      ownerPhone: '',  // not in list endpoint
      city: item.city,
      address: '',      // not in list endpoint
      submitDate: item.submitDate,
      description: ''   // not in list endpoint
    }));

    visibleIds = businesses.map(b => b.id);
    render(visibleIds);
  } catch (err) {
    console.error("loadBusinesses error:", err);
    document.getElementById("businessTable").innerHTML =
      `<tr><td colspan="6" class="empty-state">خطا در بارگذاری داده‌ها. لطفاً دوباره تلاش کنید.</td></tr>`;
  }
}


/* ═══════════════════════════════════════════════════════
   جستجو و فیلتر
   ═══════════════════════════════════════════════════════ */

/**
 * فیلترها رو اعمال می‌کنه و جدول رو دوباره رندر میگیره
 * هم جستجوی آزاد (متن) هم فیلتر دسته‌بندی رو پشتیبانی می‌کنه
 */
function applyFilters() {
  const q   = document.getElementById("searchInput").value.trim();
  const cat = document.getElementById("catFilter").value;

  visibleIds = businesses
    .filter(b => {
      // اگه جستجویی وارد شده، باید توی نام، مالک یا شهر باشه
      const matchQ   = !q   || b.name.includes(q) || b.owner.includes(q) || b.city.includes(q);

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
  document.getElementById("catFilter").value   = "";
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
 * اطلاعات رو از API جزئیات می‌گیره
 * @param {string} id - شناسه کسب‌وکار
 */
async function openDetail(id) {
  try {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/org/admin/approval-list/${parseInt(id)}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error(`خطا در دریافت جزئیات (${res.status})`);

    const data = await res.json();

    // پر کردن هدر مدال
    document.getElementById("detailName").textContent = data.name;
    document.getElementById("detailCat").textContent  = (data.orgTypeName || '') + " · " + (data.cityName || '');

    // پر کردن گرید اطلاعات
    document.getElementById("detailGrid").innerHTML = `
      <div class="detail-field">
        <div class="detail-field-label">مالک / مسئول</div>
        <div class="detail-field-value">${data.ownerName || ''}</div>
      </div>
      <div class="detail-field">
        <div class="detail-field-label">شماره تماس</div>
        <!-- شماره تلفن LTR نشون داده میشه چون عدده -->
        <div class="detail-field-value" style="direction:ltr;">${data.ownerPhone || ''}</div>
      </div>
      <div class="detail-field">
        <div class="detail-field-label">شهر</div>
        <div class="detail-field-value">${data.cityName || ''}</div>
      </div>
      <div class="detail-field">
        <div class="detail-field-label">تاریخ ثبت</div>
        <div class="detail-field-value" style="direction:ltr;">${data.createdDate || ''}</div>
      </div>
      <!-- آدرس و توضیحات — تمام‌عرض -->
      <div class="detail-field full">
        <div class="detail-field-label">آدرس</div>
        <div class="detail-field-value light">${data.address || ''}</div>
      </div>
      <div class="detail-field full">
        <div class="detail-field-label">توضیحات</div>
        <div class="detail-field-value light">${data.description || ''}</div>
      </div>
    `;

    // دکمه‌های فوتر مدال رو به این کسب‌وکار وصل می‌کنیم
    // اول مدال جزئیات رو می‌بندیم، بعد مدال تأیید باز میشه
    document.getElementById("dfApprove").onclick = () => { closeDetail(); askAction(id, 'approve'); };
    document.getElementById("dfReject").onclick  = () => { closeDetail(); askAction(id, 'reject');  };

    document.getElementById("detailModal").classList.add("open");
  } catch (err) {
    console.error("openDetail error:", err);
    alert("خطا در دریافت جزئیات کسب‌وکار.");
  }
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
  pendingId   = id;
  pendingType = type;

  const okBtn = document.getElementById("confirmOkBtn");

  if (type === 'approve') {
    // حالت تأیید — متن و رنگ سبز
    document.getElementById("confirmTitle").textContent = "تأیید کسب‌وکار";
    document.getElementById("confirmText").innerHTML    = `آیا از تأیید کسب‌وکار <span>${b.name}</span> اطمینان دارید؟`;
    okBtn.textContent = "تأیید";
    okBtn.className   = "ca-approve";
  } else {
    // حالت رد — متن و رنگ قرمز
    document.getElementById("confirmTitle").textContent = "رد کردن کسب‌وکار";
    document.getElementById("confirmText").innerHTML    = `آیا از رد کردن کسب‌وکار <span>${b.name}</span> اطمینان دارید؟`;
    okBtn.textContent = "رد کردن";
    okBtn.className   = "ca-reject";
  }

  document.getElementById("confirmModal").classList.add("open");
}


/**
 * عملیات نهایی رو انجام میده — API call برای تأیید یا رد
 */
async function doAction() {
  try {
    const token = getToken();
    const numericId = parseInt(pendingId);
    const endpoint = pendingType === 'approve'
      ? `${API_BASE_URL}/org/admin/approval-list/${numericId}/approve`
      : `${API_BASE_URL}/org/admin/approval-list/${numericId}/reject`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `خطای سرور (${res.status})`);
    }

    // کسب‌وکار رو از هر دو آرایه حذف می‌کنیم
    businesses = businesses.filter(b => b.id !== pendingId);
    visibleIds = visibleIds.filter(id => id !== pendingId);

    render(visibleIds);
    closeConfirm();
  } catch (err) {
    console.error("doAction error:", err);
    alert(err.message || "خطا در انجام عملیات.");
    closeConfirm();
  }
}


/**
 * مدال تأیید رو می‌بنده و وضعیت pending رو پاک می‌کنه
 */
function closeConfirm() {
  document.getElementById("confirmModal").classList.remove("open");
  pendingId   = null;
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
document.getElementById("detailModal").addEventListener("click",  function(e) {
  if (e.target === this) closeDetail();
});

document.getElementById("confirmModal").addEventListener("click", function(e) {
  if (e.target === this) closeConfirm();
});


/* ─────────────────────────────────────────
   شروع — وقتی صفحه لود میشه داده‌ها رو از API می‌گیره
───────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  loadBusinesses();
});