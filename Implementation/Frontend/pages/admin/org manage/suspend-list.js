/* =============================================
   مدیریت مسدودسازی سازمان‌ها - متصل به API
   ============================================= */

const API_BASE_URL = "http://localhost:5041/api";
function getToken() { return localStorage.getItem("token"); }

/* =============================================
   داده‌های کسب‌وکارها - از API لود می‌شود
   ============================================= */
let businesses = [];

/* =============================================
   متغیرهای وضعیت (State)
   ============================================= */
let pendingId = null;
let filteredIndices = [];

/* =============================================
   لود داده از API
   ============================================= */
async function loadBusinesses() {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/admin/org-suspend-list`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    // مدیریت خطا - طبق استاندارد پروژه
    if (response.status === 400) {
      const errData = await response.json().catch(() => ({}));
      alert(errData.message || "درخواست نامعتبر است");
      return;
    }

    if (response.status === 403) {
      window.location.href = "/pages/errors/error-403.html";
      return;
    }

    if (!response.ok) throw new Error(`خطا در دریافت اطلاعات (${response.status})`);

    const data = await response.json();
    
    // تبدیل داده‌های API به فرمت مورد نیاز
    businesses = Array.isArray(data) ? data.map(item => ({
      id: item.id,
      name: item.name || item.orgName || '',
      category: item.categoryName || item.category || item.orgTypeName || '',
      owner: item.ownerName || item.owner || '',
      blocked: item.isSuspended !== undefined ? item.isSuspended : (item.blocked || false)
    })) : [];

    filteredIndices = businesses.map((_, i) => i);
    render(filteredIndices);
  } catch (err) {
    console.error("loadBusinesses error:", err);
    document.getElementById("businessTable").innerHTML =
      `<tr><td colspan="5" class="empty-state">خطا در بارگذاری داده‌ها. لطفاً دوباره تلاش کنید.</td></tr>`;
  }
}

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
      ? `<button class="btn-unblock" onclick="askToggle(${b.id}, true)">رفع مسدودیت</button>`
      : `<button class="btn-block" onclick="askToggle(${b.id}, false)">مسدودسازی</button>`;

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
document.addEventListener("DOMContentLoaded", function() {
  // Event listener برای جستجو
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keydown", e => {
      if (e.key === "Enter") searchBusiness();
    });
  }

  // لود اولیه داده‌ها از API
  loadBusinesses();
});

/* =============================================
   تابع askToggle
   مودال تأیید را باز کرده و اطلاعات کسب‌وکار را درون آن نمایش می‌دهد
   @param {number} id - شناسه کسب‌وکار
   @param {boolean} isBlocked - آیا مسدود است؟
   ============================================= */
function askToggle(id, isBlocked) {
  pendingId = id; 
  const business = businesses.find(b => b.id === id);

  if (!business) return;

  // تنظیم عنوان مودال بر اساس عملیات
  document.getElementById("modalTitle").textContent =
    isBlocked ? "رفع مسدودیت کسب‌وکار" : "مسدودسازی کسب‌وکار";

  // تنظیم متن پیام مودال
  document.getElementById("modalBody").innerHTML = isBlocked
    ? `آیا از رفع مسدودیت کسب‌وکار <span>${business.name}</span> اطمینان دارید؟`
    : `آیا از مسدودسازی کسب‌وکار <span>${business.name}</span> اطمینان دارید؟`;

  // تنظیم رنگ و متن دکمه تأیید
  const btn = document.getElementById("modalConfirmBtn");
  btn.textContent = isBlocked ? "رفع مسدودیت" : "مسدودسازی";
  btn.style.background = isBlocked ? "var(--green)" : "var(--red)";
  btn.style.color = "white";

  // ذخیره وضعیت فعلی برای استفاده در confirmAction
  btn.dataset.wasBlocked = isBlocked;

  // نمایش مودال
  document.getElementById("confirmModal").classList.add("open");
}

/* =============================================
   تابع confirmAction
   عملیات تغییر وضعیت را با API Call اجرا می‌کند
   ============================================= */
async function confirmAction() {
  if (pendingId === null) return;

  try {
    const token = getToken();
    const btn = document.getElementById("modalConfirmBtn");
    const wasBlocked = btn.dataset.wasBlocked === 'true';
    
    // تعیین endpoint بر اساس عملیات
    const endpoint = wasBlocked
      ? `${API_BASE_URL}/admin/org-suspend-list/${pendingId}/unlock`
      : `${API_BASE_URL}/admin/org-suspend-list/${pendingId}/suspend`;

    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    // مدیریت خطا - طبق استاندارد پروژه
    if (response.status === 400) {
      const errData = await response.json().catch(() => ({}));
      alert(errData.message || "درخواست نامعتبر است");
      return;
    }

    if (response.status === 403) {
      window.location.href = "/pages/errors/error-403.html";
      return;
    }

    if (!response.ok) {
      throw new Error(`خطا در انجام عملیات (${response.status})`);
    }

    // موفقیت آمیز - بارگذاری مجدد لیست
    await loadBusinesses();
    closeModal();

  } catch (err) {
    console.error("confirmAction error:", err);
    alert(err.message || "خطا در انجام عملیات.");
    closeModal();
  }
}

/* =============================================
   تابع closeModal
   مودال را می‌بندد و وضعیت pendingId را ریست می‌کند
   ============================================= */
function closeModal() {
  document.getElementById("confirmModal").classList.remove("open");
  pendingId = null;
}
