

/* ──────────────────────────────────────────────
   سایه هدر هنگام اسکرول
   وقتی کاربر اسکرول می‌کنه، کلاس .scrolled به هدر اضافه می‌شه
   تا سایه ظاهر بشه (استایل در CSS تعریف شده)
────────────────────────────────────────────── */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  // اگر بیشتر از ۳۰px اسکرول شده، کلاس اضافه/حذف می‌شه
  header.classList.toggle('scrolled', window.scrollY > 30);
});


/* ──────────────────────────────────────────────
   منوی موبایل (همبرگر)
   کلیک روی دکمه همبرگر → toggle کلاس .open روی منو
   کلیک خارج از هدر → بستن منو
────────────────────────────────────────────── */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu   = document.getElementById('mobileMenu');

// باز/بستن منو با کلیک روی همبرگر
hamburgerBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// بستن منو با کلیک خارج از هدر
document.addEventListener('click', (e) => {
  if (!header.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});


/* ──────────────────────────────────────────────
   انتخاب چیپ (chip)
   وقتی کاربر روی یکی از چیپ‌های پرطرفدار کلیک می‌کنه:
   1. همه چیپ‌ها از حالت active خارج می‌شن
   2. چیپ انتخاب‌شده active می‌شه
   3. متن دسته به فیلد جستجو کپی می‌شه
────────────────────────────────────────────── */

/**
 * @param {HTMLElement} el      - چیپی که کلیک شده
 * @param {string}      category - نام دسته‌بندی برای جستجو
 */
function setChip(el, category) {
  // حذف حالت active از همه چیپ‌ها
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));

  // فعال‌سازی چیپ کلیک‌شده
  el.classList.add('active');

  // پر کردن فیلد جستجو با نام دسته
  const searchInput = document.getElementById('mainSearch');
  searchInput.value = category;
  searchInput.focus();
}


/* ──────────────────────────────────────────────
   جستجو
   با کلیک دکمه جستجو یا Enter روی فیلد،
   اگر فیلد خالی نبود به بخش دسته‌بندی‌ها اسکرول می‌شه
────────────────────────────────────────────── */

function doSearch() {
  const q    = document.getElementById('mainSearch').value.trim();
  const city = document.getElementById('citySelect').value;

  // اگر هر دو خالی بودن، فوکوس به فیلد برمی‌گرده
  if (!q && !city) {
    document.getElementById('mainSearch').focus();
    return;
  }

  // اسکرول صاف به بخش دسته‌بندی‌ها
  document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
}

// فعال‌سازی جستجو با کلید Enter
document.getElementById('mainSearch').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doSearch();
});


/* ──────────────────────────────────────────────
   کلیک روی کارت دسته‌بندی
   وقتی کاربر روی یکی از کارت‌های دسته‌بندی کلیک می‌کنه:
   1. نام دسته به فیلد جستجو کپی می‌شه
   2. اولین چیپ active می‌شه (به عنوان پیش‌فرض)
   3. صفحه به بالا برمی‌گرده تا کاربر جستجو رو ببینه
────────────────────────────────────────────── */

/**
 * @param {string} cat - نام دسته‌بندی انتخاب‌شده
 */
function filterCat(cat) {
  // پر کردن فیلد جستجو
  document.getElementById('mainSearch').value = cat;
      window.location.href = '../Html/search-results.html'
  // فعال‌سازی اولین چیپ (نزدیک‌ترین به دسته)
  setChip(document.querySelector('.chip'), cat);

  // برگشت به بالای صفحه با انیمیشن
  window.scrollTo({ top: 0, behavior: 'smooth' });
}




