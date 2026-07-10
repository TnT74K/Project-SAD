
const businesses = [
  {
    id: 1, premium: true,
    emoji: '✂️', bg: 'linear-gradient(135deg,#1a2d45,#2e5f8a)',
    cat: 'آرایشگاه مردانه', catKey: 'barbershop',
    name: 'آرایشگاه دایموند تهران',
    city: 'tehran', status: 'open',
    slots: ['۱۰:۰۰', '۱۱:۳۰', '۱۴:۰۰'],
    rating: 4.9, reviews: 247, success: 1840,
    price: 'از ۱۵۰٬۰۰۰ تومان'
  },
  {
    id: 2, premium: true,
    emoji: '🌿', bg: 'linear-gradient(135deg,#0d3d2a,#1a7a55)',
    cat: 'طب سنتی', catKey: 'trad',
    name: 'مرکز طب سنتی حکیم',
    city: 'tehran', status: 'open',
    slots: ['۰۹:۰۰', '۱۱:۰۰', '۱۶:۳۰'],
    rating: 4.9, reviews: 561, success: 3200,
    price: 'از ۲۰۰٬۰۰۰ تومان'
  },
  {
    id: 3, premium: false,
    emoji: '🦷', bg: 'linear-gradient(135deg,#1a0e2e,#4c1d95)',
    cat: 'دندانپزشکی', catKey: 'dental',
    name: 'کلینیک دندانپزشکی دکتر رضایی',
    city: 'mashhad', status: 'busy',
    slots: ['۰۹:۰۰', '۱۵:۳۰'],
    rating: 4.8, reviews: 183, success: 920,
    price: 'از ۳۰۰٬۰۰۰ تومان'
  },
  {
    id: 4, premium: false,
    emoji: '💅', bg: 'linear-gradient(135deg,#2d1a4a,#6b21a8)',
    cat: 'سالن زیبایی', catKey: 'beauty',
    name: 'سالن آرایش بانوان لونا',
    city: 'tehran', status: 'open',
    slots: ['۱۲:۰۰', '۱۳:۳۰', '۱۶:۰۰'],
    rating: 4.7, reviews: 312, success: 1150,
    price: 'از ۱۸۰٬۰۰۰ تومان'
  },
  {
    id: 5, premium: true,
    emoji: '💪', bg: 'linear-gradient(135deg,#1a0d0d,#a83232)',
    cat: 'باشگاه ورزشی', catKey: 'gym',
    name: 'باشگاه فیتنس ایران‌زمین',
    city: 'isfahan', status: 'full',
    slots: [],  /* ظرفیت تکمیله، نوبت خالی نداره */
    rating: 4.6, reviews: 458, success: 2600,
    price: 'از ۵۰۰٬۰۰۰ تومان'
  },
  {
    id: 6, premium: false,
    emoji: '✂️', bg: 'linear-gradient(135deg,#0f2a1a,#196640)',
    cat: 'آرایشگاه مردانه', catKey: 'barbershop',
    name: 'آرایشگاه مدرن آقایان',
    city: 'shiraz', status: 'open',
    slots: ['۱۰:۳۰', '۱۲:۰۰'],
    rating: 4.3, reviews: 89, success: 410,
    price: 'از ۱۲۰٬۰۰۰ تومان'
  },
  {
    id: 7, premium: false,
    emoji: '🏥', bg: 'linear-gradient(135deg,#0a1e3a,#1b4f72)',
    cat: 'کلینیک', catKey: 'clinic',
    name: 'کلینیک پوست و مو دکتر احمدی',
    city: 'tehran', status: 'open',
    slots: ['۰۸:۰۰', '۱۱:۰۰', '۱۴:۳۰'],
    rating: 4.5, reviews: 204, success: 780,
    price: 'از ۲۵۰٬۰۰۰ تومان'
  },
  {
    id: 8, premium: false,
    emoji: '💈', bg: 'linear-gradient(135deg,#1a1000,#7a4800)',
    cat: 'آرایشگاه مردانه', catKey: 'barbershop',
    name: 'آرایشگاه کلاسیک برادران',
    city: 'tabriz', status: 'busy',
    slots: ['۱۵:۰۰'],
    rating: 4.2, reviews: 67, success: 320,
    price: 'از ۱۰۰٬۰۰۰ تومان'
  },
  {
    id: 9, premium: false,
    emoji: '🧖', bg: 'linear-gradient(135deg,#1a0a2e,#5b21b6)',
    cat: 'سالن زیبایی', catKey: 'beauty',
    name: 'سالن زیبایی ستاره',
    city: 'karaj', status: 'open',
    slots: ['۱۰:۰۰', '۱۳:۰۰', '۱۵:۳۰', '۱۷:۰۰'],
    rating: 4.4, reviews: 131, success: 590,
    price: 'از ۱۶۰٬۰۰۰ تومان'
  }
];


/* =============================================
   وضعیت چیپ‌های فیلتر
   false = خاموش، true = روشن (فعال)
   ============================================= */
const activeChips = {
  rating: false,
  success: false,
  open: false
};

/*
  toggleChip - وقتی روی چیپ‌های فیلتر کلیک میشه
  وضعیت رو برعکس می‌کنه و فیلترها رو دوباره اجرا می‌کنه
*/
function toggleChip(key) {
  activeChips[key] = !activeChips[key];
  document.getElementById('chip-' + key).classList.toggle('on', activeChips[key]);
  applyFilters();
}


/* =============================================
   applyFilters - قلب صفحه
   هر بار که کاربر یه فیلتر یا سورت تغییر میده
   این تابع صدا زده میشه
   ============================================= */
function applyFilters() {
  const city = document.getElementById('filterCity').value;
  const cat = document.getElementById('filterCat').value;
  const sort = document.getElementById('sortBy').value;

  /* اول فیلتر می‌کنیم */
  let list = businesses.filter(b => {
    if (city && b.city !== city) return false;
    if (cat && b.catKey !== cat) return false;

    /* چیپ‌های سه‌گانه */
    if (activeChips.rating && b.rating < 4) return false;  /* زیر ۴ ستاره حذف */
    if (activeChips.success && b.success < 500) return false;  /* کمتر از ۵۰۰ نوبت حذف */
    if (activeChips.open && b.status !== 'open') return false;  /* فقط کسانی که نوبت دارن */

    return true;
  });

  /* بعد مرتب می‌کنیم */
  if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
  if (sort === 'success') list.sort((a, b) => b.success - a.success);
  if (sort === 'newest') list.sort((a, b) => b.id - a.id);

  /*
    مهم: بعد از هر سورتی، کسب‌وکارهای برتر (premium)
    رو به اول لیست میاریم - این رفتار نباید تغییر کنه
  */
  list.sort((a, b) => (b.premium ? 1 : 0) - (a.premium ? 1 : 0));

  /* رندر کارت‌ها */
  renderCards(list);

  /* آپدیت متن‌های بالای نتایج */
  const q = document.getElementById('searchInput').value;
  document.getElementById('query-text').textContent = q || 'همه';
  document.getElementById('result-count').textContent = toFa(list.length) + ' کسب‌وکار یافت شد';
}


/* =============================================
   renderCards - رندر کارت‌ها توی گرید
   لیست فیلترشده رو میگیره و HTML میسازه
   ============================================= */
function renderCards(list) {
  const grid = document.getElementById('cards-grid');

  /* اگه نتیجه‌ای نبود یه پیام نشون بده */
  if (!list.length) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="icon">🔍</div>
        <p>هیچ نتیجه‌ای یافت نشد.<br>فیلترها را تغییر دهید.</p>
      </div>`;
    return;
  }

  grid.innerHTML = list.map(b => {
    /* متن وضعیت بر اساس status */
    const statusLabel = {
      open: 'نوبت دارد',
      busy: 'محدود',
      full: 'تکمیل ظرفیت'
    }[b.status];

    /* ساعت‌های خالی - اگه نبود پیام فردا نشون میده */
    const slots = b.slots.length
      ? b.slots.map(s => `<span class="slot">${s}</span>`).join('')
      : `<span class="no-slot">نوبت خالی فردا موجود است</span>`;

    /* بج "برتر" فقط برای کسب‌وکارهای premium */
    const premiumBadge = b.premium
      ? `<span class="badge-premium">👑 برتر</span>`
      : '';

    /* لیبل "تبلیغ" گوشه کارت - فقط برای premium */
    const sponsoredNote = b.premium
      ? `<div class="sponsored-label">تبلیغ</div>`
      : '';

    return `
      <div class="biz-card ${b.premium ? 'gold' : ''}">
        ${sponsoredNote}
        <div class="card-cover" style="background:${b.bg}">
          <span style="position:relative;z-index:1">${b.emoji}</span>
          <div class="card-cover-overlay"></div>
          <div class="badge-wrap">
            ${premiumBadge}
            <span class="badge-status ${b.status}">${statusLabel}</span>
          </div>
        </div>
        <div class="card-body">
          <div class="card-cat">${b.cat}</div>
          <div class="card-name">${b.name}</div>
          <div class="card-slots">${slots}</div>
          <div class="card-stats">
            <div class="stat-item">
              <span class="stat-star">★</span>
              <span class="stat-val">${toFa(b.rating)}</span>
            </div>
            <div class="stat-dot"></div>
            <div class="stat-item">${toFa(b.reviews)} تعدادامتیازدهنده</div>
            <div class="stat-dot"></div>
            <div class="stat-item">✅ ${toFa(b.success)}+ نوبت موفق</div>
          </div>
          <div class="card-footer">
            <div class="card-price"><strong>${b.price}</strong></div>
            <button class="btn-reserve" onclick="window.location.href = '/pages/org/profile/profile.html'">مشاهده پروفايل</button>
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
  applyFilters();
}


/* =============================================
   toFa - تبدیل اعداد انگلیسی به فارسی
   مثلاً: 247 → ۲۴۷
   ============================================= */
function toFa(n) {
  return String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
}


/* اجرای اولیه - صفحه که لود میشه کارت‌ها رندر بشن */
applyFilters();
