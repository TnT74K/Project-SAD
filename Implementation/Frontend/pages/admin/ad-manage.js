
/* ══════════════════════════════════════
   متغیرهای سراسری (State)
   ══════════════════════════════════════ */

/**
 * @type {HTMLElement|null}
 * نگهداری ارجاع به کارت در حال ویرایش
 * بعد از ذخیره یا بستن مودال null می‌شود
 */
var editingCard = null;

/**
 * @type {number}
 * شمارنده برای تخصیص data-id یکتا به کارت‌های جدید
 * از ۵ شروع می‌شود چون ۴ کارت اولیه در HTML وجود دارند
 */
var adCounter = 5;


/* ══════════════════════════════════════
   مدیریت نمای صفحه (View Switching)
   ══════════════════════════════════════ */

/**
 * نمایش فرم افزودن تبلیغ یا مودال ویرایش
 *
 * @param {number|null} id
 *   - null  → فرم افزودن تبلیغ جدید نمایش داده می‌شود
 *   - عدد  → مودال ویرایش کارت مربوطه باز می‌شود
 */
function showForm(id) {
  if (id !== null) {
    /* حالت ویرایش: مودال باز می‌شود نه تغییر ویو */
    openModal(id);
    return;
  }

  /* حالت افزودن: به view-form بروید */
  document.getElementById('view-list').style.display = 'none';

  var form = document.getElementById('view-form');
  form.style.display = 'flex';

  /* پاک کردن فیلدهای فرم قبل از نمایش */
  document.getElementById('f-title').value = '';
  document.getElementById('f-desc').value  = '';
}


/**
 * بازگشت به نمای لیست (view-list)
 * فرم مخفی و لیست کارت‌ها نمایش داده می‌شود
 */
function showList() {
  document.getElementById('view-form').style.display = 'none';
  document.getElementById('view-list').style.display = 'block';
}


/* ══════════════════════════════════════
   افزودن تبلیغ جدید
   ══════════════════════════════════════ */

/**
 * ثبت تبلیغ جدید از روی مقادیر فرم
 *
 * - اعتبارسنجی: عنوان نمی‌تواند خالی باشد
 * - یک رنگ و آیکون تصادفی برای placeholder انتخاب می‌شود
 * - کارت جدید به گرید اضافه و شمارنده به‌روز می‌شود
 * - در پایان به لیست باز می‌گردد
 */
function submitForm() {
  var title = document.getElementById('f-title').value.trim();
  var desc  = document.getElementById('f-desc').value.trim();

  /* اعتبارسنجی: عنوان اجباری است */
  if (!title) {
    alert('عنوان تبلیغ را وارد کنید');
    return;
  }

  /* گرادیان‌های رنگی تصادفی برای placeholder کارت */
  var colors = [
    'linear-gradient(135deg,#1a3a5c,#2e6ea6)',
    'linear-gradient(135deg,#2d1a4a,#6b21a8)',
    'linear-gradient(135deg,#0d3d2a,#1a7a55)',
    'linear-gradient(135deg,#3a1a0d,#a85a32)',
    'linear-gradient(135deg,#1a1a3a,#3a3a8a)'
  ];

  /* آیکون‌های ایموجی متناظر با رنگ‌ها */
  var icons = ['📢', '🌟', '🎯', '💡', '🏷️'];

  /* انتخاب تصادفی از ۵ حالت */
  var rand = Math.floor(Math.random() * 5);

  /* ساخت المان کارت جدید */
  var card = document.createElement('div');
  card.className = 'ad-card';
  card.dataset.id = adCounter++;   /* آیدی یکتا */

  card.innerHTML =
    '<div class="ad-image-placeholder" style="background:' + colors[rand] + '">'
      + icons[rand]
    + '</div>'
    + '<div class="ad-body">'
      + '<div class="ad-meta">'
        + '<div class="ad-title">' + title + '</div>'
        + '<div class="ad-desc">'  + (desc || '—') + '</div>'
      + '</div>'
      + '<div class="ad-actions">'
        /* آیدی برای دکمه ویرایش: adCounter-1 چون قبلاً increment شده */
        + '<button class="btn-edit"   onclick="showForm(' + (adCounter - 1) + ')">✏️ ویرایش</button>'
        + '<button class="btn-delete" onclick="deleteCard(this)">🗑 حذف</button>'
      + '</div>'
    + '</div>';

  /* اگه empty-state نمایش داده بود آن را حذف کن */
  var empty = document.querySelector('.empty-state');
  if (empty) empty.remove();

  /* اضافه کردن به گرید */
  document.getElementById('ads-grid').appendChild(card);

  /* به‌روزرسانی شمارنده هدر */
  updateCount();

  /* بازگشت به لیست */
  showList();
}


/* ══════════════════════════════════════
   مودال ویرایش
   ══════════════════════════════════════ */

/**
 * باز کردن مودال ویرایش برای کارت مشخص
 *
 * @param {number} id - مقدار data-id کارت مورد نظر
 *
 * - کارت را از DOM پیدا می‌کند
 * - مقادیر جاری (عنوان و توضیح) را در فیلدهای مودال قرار می‌دهد
 * - کلاس .open را به backdrop اضافه می‌کند
 */
function openModal(id) {
  editingCard = document.querySelector('.ad-card[data-id="' + id + '"]');
  if (!editingCard) return;

  /* پر کردن فیلدهای مودال با مقادیر کارت */
  document.getElementById('edit-title').value = editingCard.querySelector('.ad-title').textContent;
  document.getElementById('edit-desc').value  = editingCard.querySelector('.ad-desc').textContent.replace('—', '');

  /* نمایش مودال */
  document.getElementById('edit-modal').classList.add('open');
}


/**
 * بستن مودال ویرایش
 *
 * @param {Event} [e] - رویداد کلیک (اختیاری)
 *   - اگر e وجود داشته باشد: فقط در صورت کلیک روی backdrop بسته می‌شود
 *   - اگر e نباشد (کلیک دکمه ✕): بدون شرط بسته می‌شود
 */
function closeModal(e) {
  /* کلیک روی backdrop: فقط اگر خود backdrop کلیک شده باشد (نه فرزندانش) */
  if (e && e.target !== document.getElementById('edit-modal')) return;

  document.getElementById('edit-modal').classList.remove('open');
  editingCard = null;   /* پاک کردن ارجاع */
}


/**
 * ذخیره تغییرات ویرایش و به‌روزرسانی کارت در DOM
 *
 * - اعتبارسنجی: عنوان نمی‌تواند خالی باشد
 * - مقادیر عنوان و توضیح کارت مستقیماً در DOM به‌روز می‌شوند
 * - مودال بسته و editingCard پاک می‌شود
 */
function saveEdit() {
  if (!editingCard) return;

  var title = document.getElementById('edit-title').value.trim();
  var desc  = document.getElementById('edit-desc').value.trim();

  /* اعتبارسنجی: عنوان اجباری است */
  if (!title) {
    alert('عنوان نمی‌تواند خالی باشد');
    return;
  }

  /* به‌روزرسانی مستقیم DOM کارت */
  editingCard.querySelector('.ad-title').textContent = title;
  editingCard.querySelector('.ad-desc').textContent  = desc || '—';

  /* بستن مودال */
  document.getElementById('edit-modal').classList.remove('open');
  editingCard = null;
}


/* ══════════════════════════════════════
   حذف کارت تبلیغ
   ══════════════════════════════════════ */

/**
 * حذف کارت تبلیغ از گرید
 *
 * @param {HTMLButtonElement} btn - دکمه حذف که کلیک شده
 *
 * - ابتدا confirm می‌گیرد
 * - کارت پدر (closest .ad-card) را حذف می‌کند
 * - اگر گرید خالی شد، empty-state نمایش می‌دهد
 * - شمارنده هدر را به‌روز می‌کند
 */
function deleteCard(btn) {
  if (!confirm('این تبلیغ حذف شود؟')) return;

  /* حذف کارت از DOM */
  btn.closest('.ad-card').remove();

  /* به‌روزرسانی شمارنده */
  updateCount();

  /* نمایش empty-state اگر هیچ کارتی باقی نماند */
  if (document.querySelectorAll('.ad-card').length === 0) {
    document.getElementById('ads-grid').innerHTML =
      '<div class="empty-state">'
        + '<div class="empty-icon">📭</div>'
        + '<p>هیچ تبلیغی ثبت نشده است.</p>'
      + '</div>';
  }
}


/* ══════════════════════════════════════
   ابزار کمکی
   ══════════════════════════════════════ */

/**
 * به‌روزرسانی متن شمارنده تبلیغات فعال در هدر صفحه
 *
 * تعداد .ad-card های موجود در DOM را می‌شمارد و
 * متن span#ad-count را به‌روز می‌کند
 */
function updateCount() {
  var n = document.querySelectorAll('.ad-card').length;
  document.getElementById('ad-count').textContent =
    n > 0 ? n + ' تبلیغ فعال' : 'بدون تبلیغ';
}
