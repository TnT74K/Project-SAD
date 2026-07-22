const API_BASE_URL = "http://localhost:5041/api";

/* =============================================
   وضعیت چیپ‌های فیلتر
   false = خاموش، true = روشن (فعال)
   ============================================= */
const activeChips = {
  rating: false,
  success: false,
  open: false
};

/* ---- مپینگ شهر (HTML value → CityEnum int) ---- */
const CITY_MAP = {
  tehran: 1,        // تهران
  isfahan: 2,       // اصفهان
mashhad: 3,         // مشهد
  shiraz: 4,        // شیراز
  tabriz: 5,        // تبریز
  ahvaz: 6,         // اهواز
  kermanshah: 7,    // کرمانشاه
  karaj: 8          // کرج
};

/* ---- مپینگ دسته‌بندی (HTML value → OrgTypeEnum int) ---- */
const CAT_MAP = {
  barbershop: 1,
  beauty: 2,
  dental: 3,
  clinic: 4,
  gym: 5,
  trad: 6
};

/* ---- مپینگ مرتب‌سازی (HTML value → sortBy int) ---- */
const SORT_MAP = {
  default: 0,   // Recommended
  rating: 1,   // MostSuccessful
  success: 1,   // MostSuccessful
  newest: 2    // Newest
};

/* ---- پیش‌فرض ایموجی و گرادینت بر اساس orgTypeName ---- */
const ORG_STYLE = {
  'آرایشگاه مردانه':    { emoji: '✂️', bg: 'linear-gradient(135deg,#1a2d45,#2e5f8a)' },
  'سالن زیبایی':        { emoji: '💅', bg: 'linear-gradient(135deg,#2d1a4a,#6b21a8)' },
  'دندانپزشکی':         { emoji: '🦷', bg: 'linear-gradient(135deg,#1a0e2e,#4c1d95)' },
  'کلینیک':             { emoji: '🏥', bg: 'linear-gradient(135deg,#0a1e3a,#1b4f72)' },
'باشگاه ورزشی':         { emoji: '💪', bg: 'linear-gradient(135deg,#1a0d0d,#a83232)' },
  'طب سنتی':            { emoji: '🌿', bg: 'linear-gradient(135deg,#0d3d2a,#1a7a55)' }
};

const DEFAULT_STYLE = { emoji: '🏢', bg: 'linear-gradient(135deg,#1a1a2e,#16213e)' };

/* ---- حالت صفحه‌بندی ---- */
let currentPage = 1;
const PAGE_SIZE = 10;

/* ---- تایمر دِبَنس برای جستجو ---- */
let debounceTimer = null;
const DEBOUNCE_MS = 400;


/*
  toggleChip - وقتی روی چیپ‌های فیلتر کلیک میشه
  وضعیت رو برعکس می‌کنه و فیلترها رو دوباره اجرا می‌کنه
*/
function toggleChip(key) {
  activeChips[key] = !activeChips[key];
  document.getElementById('chip-' + key).classList.toggle('on', activeChips[key]);
  currentPage = 1;
  applyFilters();
}


/* =============================================
   applyFilters - قلب صفحه
   هر بار که کاربر یه فیلتر یا سورت تغییر میده
   این تابع صدا زده میشه — حالا async و سمت سرور
   ============================================= */
async function applyFilters() {
  const cityVal = document.getElementById('filterCity').value;
  const catVal = document.getElementById('filterCat').value;
  const sortVal = document.getElementById('sortBy').value;
  const query = document.getElementById('searchInput').value.trim();

  /* ساخت پارامترهای کوئری */
  const params = new URLSearchParams();

  if (query) params.set('query', query);
  if (cityVal && CITY_MAP[cityVal]) params.set('city', CITY_MAP[cityVal]);
  if (catVal && CAT_MAP[catVal]) params.set('orgType', CAT_MAP[catVal]);
  if (activeChips.rating) params.set('upFourStar', 'true');
  if (activeChips.success) params.set('up500Appointment', 'true');
  if (activeChips.open) params.set('hasAppointment', 'true');

  params.set('sortBy', SORT_MAP[sortVal] ?? 0);
  params.set('page', currentPage);
  params.set('pageSize', PAGE_SIZE);

  /* نمایش لودینگ */
  const grid = document.getElementById('cards-grid');
  grid.innerHTML = `
    <div class="no-results" style="padding:60px 0">
      <div class="icon" style="font-size:32px;animation:spin 1s linear infinite">⏳</div>
      <p style="margin-top:12px">در حال جستجو...</p>
    </div>`;

  try {
    const res = await fetch(`${API_BASE_URL}/Search?${params.toString()}`);
    const json = await res.json();

    if (!json.isSuccess || !json.data) {
      grid.innerHTML = `
        <div class="no-results">
          <div class="icon">⚠️</div>
          <p>خطا در دریافت اطلاعات از سرور.</p>
        </div>`;
      document.getElementById('result-count').textContent = '۰ کسب‌وکار یافت شد';
      document.getElementById('query-text').textContent = query || 'همه';
      return;
    }

    const { items, totalCount } = json.data;

    /* آپدیت متن‌های بالای نتایج */
    document.getElementById('query-text').textContent = query || 'همه';
    document.getElementById('result-count').textContent = toFa(totalCount) + ' کسب‌وکار یافت شد';

    /* رندر کارت‌ها */
    renderCards(items || []);

  } catch (err) {
    console.error('Search API error:', err);
    grid.innerHTML = `
      <div class="no-results">
        <div class="icon">⚠️</div>
        <p>خطا در ارتباط با سرور.<br>لطفاً اتصال اینترنت خود را بررسی کنید.</p>
      </div>`;
    document.getElementById('result-count').textContent = '۰ کسب‌وکار یافت شد';
    document.getElementById('query-text').textContent = query || 'همه';
  }
}


/* =============================================
   renderCards - رندر کارت‌ها توی گرید
   لیست آیتم‌های API رو میگیره و HTML میسازه
   ============================================= */
function renderCards(items) {
  const grid = document.getElementById('cards-grid');

  if (!items.length) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="icon">🔍</div>
        <p>هیچ نتیجه‌ای یافت نشد.<br>فیلترها را تغییر دهید.</p>
      </div>`;
    return;
  }

  grid.innerHTML = items.map(item => {
    /* انتخاب ایموجی و گرادینت بر اساس نوع سازمان */
    const style = ORG_STYLE[item.orgTypeName] || DEFAULT_STYLE;

    /* متن وضعیت */
    const status = item.isActive ? 'open' : 'closed';
    const statusLabel = item.isActive ? 'نوبت دارد' : 'بسته';

    /* ساعت‌ها — API جستجو سِل‌ها رو برنمی‌گردونه */
    const slots = `<span class="no-slot">مشاهده</span>`;

    /* بج "برتر" برای isPremier */
    const premiumBadge = item.isPremier
      ? `<span class="badge-premium">👑 برتر</span>`
      : '';

    const sponsoredNote = item.isPremier
      ? `<div class="sponsored-label">تبلیغ</div>`
      : '';

    return `
      <div class="biz-card ${item.isPremier ? 'gold' : ''}">
        ${sponsoredNote}
        <div class="card-cover" style="background:${style.bg}">
          <span style="position:relative;z-index:1">${style.emoji}</span>
          <div class="card-cover-overlay"></div>
          <div class="badge-wrap">
            ${premiumBadge}
            <span class="badge-status ${status}">${statusLabel}</span>
          </div>
        </div>
        <div class="card-body">
          <div class="card-cat">${item.orgTypeName || ''}</div>
          <div class="card-name">${item.name}</div>
          <div class="card-slots">${slots}</div>
          <div class="card-stats">
            <div class="stat-item">
              <span class="stat-star">★</span>
              <span class="stat-val">${toFa(item.starCount)}</span>
            </div>
            <div class="stat-dot"></div>
            <div class="stat-item">${toFa(item.voterCount)} تعدادامتیازدهنده</div>
            <div class="stat-dot"></div>
            <div class="stat-item">✅ ${toFa(item.successAppointmentCount)}+ نوبت موفق</div>
          </div>
          <div class="card-footer">
            <div class="card-price"><strong>${item.cityName || ''}</strong></div>
            <button class="btn-reserve" onclick="window.location.href = '/pages/org/profile/profile.html?id=' + ${item.id}">مشاهده پروفايل</button>
          </div>
        </div>
      </div>`;
  }).join('');
}


/* =============================================
   clearSearch - پاک کردن جستجو
   وقتی کاربر × رو می‌زنه
   ============================================= */
function clearSearch() {
  document.getElementById('searchInput').value = '';
  document.getElementById('query-text').textContent = 'همه';
  currentPage = 1;
  applyFilters();
}


/* =============================================
   toFa - تبدیل اعداد انگلیسی به فارسی
   مثلاً: 247 → ۲۴۷
   ============================================= */
function toFa(n) {
  return String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
}


/* =============================================
   دِبَنس برای اینپوت جستجو
   کاربر تایپ می‌کنه و بعد از یک فاصله کوتاه
   درخواست به سرور ارسال میشه
   ============================================= */
document.getElementById('searchInput').addEventListener('input', function () {
  clearTimeout(debounceTimer);
  currentPage = 1;
  debounceTimer = setTimeout(() => {
    applyFilters();
  }, DEBOUNCE_MS);
});


/* اجرای اولیه - صفحه که لود میشه نتایج رو از سرور میگیره */
applyFilters();