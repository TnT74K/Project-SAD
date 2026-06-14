/**
 * main.js — رزروسنتر | صفحه اصلی
 *
 * تغییرات اخیر:
 *   [Fix] Enter در فیلد جستجو — listener داخل DOMContentLoaded قرار گرفت
 *   [Add] انیمیشن‌های ورود المان‌ها با IntersectionObserver
 *   [Add] صفحه موقت پس از لاگین کاربر (تابع showPostLoginScreen)
 *
 * ساختار فایل:
 *   1. DOMContentLoaded — نقطه ورود اصلی
 *   2. هدر (سایه اسکرول + همبرگر)
 *   3. چیپ‌ها
 *   4. جستجو  ← [Fix] Enter
 *   5. دسته‌بندی‌ها
 *   6. انیمیشن‌های scroll  ← [Add]
 *   7. صفحه پس از لاگین   ← [Add]
 */


/* ══════════════════════════════════════════════
   نقطه ورود — همه کدها داخل DOMContentLoaded
   تا مطمئن بشیم DOM کاملاً آماده‌ست
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {


  /* ──────────────────────────────────────────
     1. هدر — سایه هنگام اسکرول
     کلاس .scrolled به هدر اضافه/حذف می‌شه
  ────────────────────────────────────────── */
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  });


  /* ──────────────────────────────────────────
     2. منوی موبایل (همبرگر)
     toggle کلاس .open روی منو
     کلیک خارج از هدر → بستن منو
  ────────────────────────────────────────── */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu   = document.getElementById('mobileMenu');

  hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });


  /* ──────────────────────────────────────────
     3. چیپ‌های پرطرفدار
     انتخاب چیپ + پر کردن فیلد جستجو
  ────────────────────────────────────────── */

  /**
   * @param {HTMLElement} el       - چیپ کلیک‌شده
   * @param {string}      category - نام دسته برای جستجو
   */
  window.setChip = function(el, category) {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    const searchInput = document.getElementById('mainSearch');
    searchInput.value = category;
    searchInput.focus();
  };


  /* ──────────────────────────────────────────
     4. جستجو
     [Fix] listener داخل DOMContentLoaded — حل باگ Enter
     قبلاً listener خارج از DOMContentLoaded بود و گاهی
     #mainSearch هنوز در DOM وجود نداشت → خطای null
  ────────────────────────────────────────── */

  window.doSearch = function() {
    const q    = document.getElementById('mainSearch').value.trim();
    const city = document.getElementById('citySelect').value;

    if (!q && !city) {
      document.getElementById('mainSearch').focus();
      return;
    }

    document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
  };

  // [Fix] این listener حالا بعد از آماده شدن DOM اجرا می‌شه
  document.getElementById('mainSearch').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') window.doSearch();
  });


  /* ──────────────────────────────────────────
     5. کارت دسته‌بندی
     پر کردن فیلد + برگشت به بالا
  ────────────────────────────────────────── */

  /**
   * @param {string} cat - نام دسته انتخاب‌شده
   */
  window.filterCat = function(cat) {
    document.getElementById('mainSearch').value = cat;
    window.setChip(document.querySelector('.chip'), cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  /* ──────────────────────────────────────────
     6. [Add] انیمیشن‌های ورود المان‌ها
     انیمیشن‌ها کاملاً توسط CSS @keyframes مدیریت می‌شن
     (style.css — بخش انیمیشن‌ها)
     نیازی به JS نیست — حذف شد
  ────────────────────────────────────────── */


  /* ──────────────────────────────────────────
     7. [Add] صفحه موقت پس از لاگین
     بعد از موفقیت لاگین این تابع صدا زده می‌شه.
     یک overlay روی صفحه نمایش می‌ده که:
       - پیام خوش‌آمدگویی شخصی‌سازی‌شده داره
       - دسترسی سریع به بخش‌های اصلی داره
       - با کلیک "ورود به داشبورد" یا X بسته می‌شه
     نحوه استفاده: showPostLoginScreen({ name: 'علی', avatar: '👤' })
  ────────────────────────────────────────── */

  /**
   * @param {Object} user
   * @param {string} user.name   - نام کاربر (اختیاری، پیش‌فرض: کاربر عزیز)
   * @param {string} user.avatar - ایموجی یا URL تصویر (اختیاری)
   */
  window.showPostLoginScreen = function(user = {}) {
    const name   = user.name   || 'کاربر عزیز';
    const avatar = user.avatar || '👤';

    // اگر قبلاً overlay وجود داشت حذف کن
    const existing = document.getElementById('postLoginOverlay');
    if (existing) existing.remove();

    // ساخت overlay
    const overlay = document.createElement('div');
    overlay.id = 'postLoginOverlay';
    overlay.innerHTML = `
      <div class="plo-backdrop"></div>
      <div class="plo-card" role="dialog" aria-modal="true" aria-label="خوش آمدید">

        <!-- دکمه بستن -->
        <button class="plo-close" id="ploClose" aria-label="بستن">✕</button>

        <!-- بخش خوش‌آمدگویی -->
        <div class="plo-welcome">
          <div class="plo-avatar">${avatar}</div>
          <div class="plo-greeting">خوش برگشتی،</div>
          <div class="plo-name">${name}</div>
          <p class="plo-subtitle">از کجا شروع می‌کنی؟</p>
        </div>

        <!-- میان‌برهای سریع -->
        <div class="plo-shortcuts">
          <button class="plo-shortcut" onclick="window.closePLO(); document.getElementById('mainSearch').focus()">
            <span class="plo-sc-icon">🔍</span>
            <span class="plo-sc-label">رزرو نوبت جدید</span>
          </button>
          <button class="plo-shortcut" onclick="window.closePLO()">
            <span class="plo-sc-icon">📋</span>
            <span class="plo-sc-label">نوبت‌های من</span>
          </button>
          <button class="plo-shortcut" onclick="window.closePLO()">
            <span class="plo-sc-icon">⭐</span>
            <span class="plo-sc-label">علاقه‌مندی‌ها</span>
          </button>
          <button class="plo-shortcut" onclick="window.closePLO()">
            <span class="plo-sc-icon">👤</span>
            <span class="plo-sc-label">پروفایل من</span>
          </button>
        </div>

        <!-- دکمه اصلی -->
        <button class="plo-btn-main" onclick="window.closePLO()">
          ورود به داشبورد
        </button>

      </div>
    `;

    document.body.appendChild(overlay);

    // انیمیشن ورود — یک فریم بعد از رندر
    requestAnimationFrame(() => overlay.classList.add('plo-show'));

    // بستن با کلیک X
    document.getElementById('ploClose').addEventListener('click', window.closePLO);

    // بستن با کلیک روی backdrop
    overlay.querySelector('.plo-backdrop').addEventListener('click', window.closePLO);

    // بستن با کلید Escape
    const escHandler = (e) => {
      if (e.key === 'Escape') { window.closePLO(); document.removeEventListener('keydown', escHandler); }
    };
    document.addEventListener('keydown', escHandler);
  };

  /** بستن و حذف overlay لاگین */
  window.closePLO = function() {
    const overlay = document.getElementById('postLoginOverlay');
    if (!overlay) return;
    overlay.classList.remove('plo-show');
    // صبر برای پایان انیمیشن خروج، سپس حذف از DOM
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
  };


}); // end DOMContentLoaded

