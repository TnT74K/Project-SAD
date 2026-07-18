/* ---- API Configuration ---- */
const API_BASE_URL = "http://localhost:5000/api";
function getToken() { return localStorage.getItem("token"); }
function getOrgId() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.orgId || null;
}

/* ---- توابع کمکی تبدیل تاریخ ---- */
function persianDigitsToEnglish(str) {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  return str.replace(/[۰-۹]/g, d => persianDigits.indexOf(d));
}

function jalaliToGregorian(jy, jm, jd) {
  jy += 1595;
  let days = -355668 + 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4) + jd;
  if (jm < 7) { days += (jm - 1) * 31; } else { days += (jm - 7) * 30 + 186; }
  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) { gy += 100 * Math.floor(--days / 36524); days %= 36524; if (days >= 365) days++; }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) { gy += Math.floor((days - 1) / 365); days = (days - 1) % 365; }
  let gd = days + 1;
  const sal_a = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  sal_a[2] = ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0) ? 29 : 28;
  let gm;
  for (gm = 1; gm <= 12; gm++) { if (gd <= sal_a[gm]) break; gd -= sal_a[gm]; }
  return { year: gy, month: gm, day: gd };
}

function parseShamsiDate(dateStr) {
  const cleaned = persianDigitsToEnglish(dateStr);
  const match = cleaned.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
  if (!match) return null;
  return { jy: parseInt(match[1]), jm: parseInt(match[2]), jd: parseInt(match[3]) };
}

function shamsiToGregorianString(dateStr) {
  const shamsi = parseShamsiDate(dateStr);
  if (!shamsi) return null;
  const g = jalaliToGregorian(shamsi.jy, shamsi.jm, shamsi.jd);
  return `${g.year}-${String(g.month).padStart(2, '0')}-${String(g.day).padStart(2, '0')}`;
}

/* ---- وضعیت انتخاب ---- */
let selectedDate = '';
let selectedTime = '';
let orgId = null;
let orgData = null;

/* ---- المان‌های مودال ---- */
const confirmModal   = document.getElementById('confirmModal');
const successModal   = document.getElementById('successModal');
const modalUsername  = document.getElementById('modal-username');
const modalOrgname   = document.getElementById('modal-orgname');
const modalDate      = document.getElementById('modal-date');
const modalTime      = document.getElementById('modal-time');
const modalPrice      = document.getElementById('modal-price');
const trackingCode   = document.getElementById('trackingCode');
/* ---- انتخاب خدمت ---- */
const serviceSelect = document.getElementById('serviceSelect');
const appointmentGroups = document.querySelectorAll('.appointment-group');
const modalService = document.getElementById('modal-service');

let selectedService = '';
/* در ابتدا هیچ خدمتی انتخاب نشده → نوبت‌ها مخفی */
appointmentGroups.forEach(group=>{
  group.style.display = 'none';
});
serviceSelect.addEventListener('change', function(){

  selectedService = this.value;

  appointmentGroups.forEach(group=>{
    if(selectedService){
      group.style.display = 'block';
    }else{
      group.style.display = 'none';
    }
  });

});

/* ---- باز/بستن مودال ---- */
function openModal(overlay) {
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(overlay) {
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* ---- بارگذاری پروفایل سازمان از API ---- */
async function loadOrgProfile(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/public-org-profile/${id}`);
    if (!res.ok) throw new Error('خطا در دریافت اطلاعات سازمان');
    orgData = await res.json();

    /* --- به‌روزرسانی اطلاعات سازمان در DOM --- */
    const orgNameEl = document.querySelector('.org-name');
    if (orgNameEl) orgNameEl.textContent = orgData.name;

    const orgDescEl = document.querySelector('.org-description');
    if (orgDescEl) orgDescEl.textContent = orgData.description || '';

    const orgImgEl = document.querySelector('.org-image');
    if (orgImgEl && orgData.image) orgImgEl.src = orgData.image;

    const metaValues = document.querySelectorAll('.org-meta .meta-value');
    /* ترتیب meta-rowها در HTML: مکان، وضعیت، امتیازدهندگان، امتیاز، نوبت موفق، رده‌بندی، ساعت */
    if (metaValues[0]) metaValues[0].textContent = orgData.address || '—';

    /* پر کردن下拉 خدمت‌ها */
    serviceSelect.innerHTML = '<option value="">انتخاب خدمت</option>';
    if (orgData.services && orgData.services.length > 0) {
      orgData.services.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = s.name + (s.timeDuration ? ` (${s.timeDuration} دقیقه)` : '');
        serviceSelect.appendChild(opt);
      });
    }
  } catch (err) {
    console.error(err);
    const container = document.querySelector('.container');
    if (container) {
      container.innerHTML = `
        <div style="text-align:center; padding:60px 20px; color:#e74c3c;">
          <h2>خطا در بارگذاری اطلاعات</h2>
          <p>${err.message}</p>
        </div>`;
    }
  }
}

/* ---- کلیک روی دکمه‌های ساعت ---- */
const timeButtons = document.querySelectorAll('.time-btn');

document.addEventListener('click', function(e){

  const btn = e.target.closest('.time-btn');
  if(!btn) return;

  if(!selectedService){
    alert('ابتدا نوع خدمت را انتخاب کنید');
    return;
  }

  const parentGroup = btn.closest('.appointment-group');
  if (!parentGroup) return;

  /* حذف انتخاب قبلی در همان گروه */
  parentGroup.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  /* گرفتن تاریخ */
  const dateEl = parentGroup.querySelector('.appointment-date span');
  selectedDate = dateEl ? dateEl.textContent.trim() : '—';
  selectedTime = btn.textContent.trim();

  /* گرفتن اطلاعات کاربر از localStorage */
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.fullName || (user.firstName && user.lastName ? user.firstName + ' ' + user.lastName : 'کاربر مهمان');

  /* پر کردن مودال */
  modalUsername.textContent = userName;
  modalOrgname.textContent  = orgData ? orgData.name : '—';
  modalDate.textContent     = selectedDate;
  modalTime.textContent     = selectedTime;
  modalPrice.textContent    = "—";
  modalService.textContent  = serviceSelect.options[serviceSelect.selectedIndex].text;

  openModal(confirmModal);

});



    /* ---- دکمه انصراف ---- */
    document.getElementById('btnCancel').addEventListener('click', () => {
      closeModal(confirmModal);
    });

    /* ---- بستن مودال با کلیک روی پس‌زمینه ---- */
    confirmModal.addEventListener('click', (e) => {
      if (e.target === confirmModal) closeModal(confirmModal);
    });

    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) closeModal(successModal);
    });

    /* ---- دکمه تایید و پرداخت (API) ---- */
    document.getElementById('btnConfirmPay').addEventListener('click', async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const appointmentDate = shamsiToGregorianString(selectedDate);
      if (!appointmentDate) {
        alert('خطا در تبدیل تاریخ');
        return;
      }

      const body = {
        orgId: orgId,
        serviceId: Number(selectedService),
        userId: user.id || user.userId,
        price: 0,
        appointmentDate: appointmentDate,
        appointmentTime: selectedTime
      };

      closeModal(confirmModal);

      try {
        const res = await fetch(`${API_BASE_URL}/public-org-profile/appointments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'خطا در ثبت نوبت');
        }

        const data = await res.json();

        setTimeout(() => {
          trackingCode.textContent = data.trackingCode || '—';
          openModal(successModal);
        }, 200);
      } catch (err) {
        alert(err.message);
      }
    });

    /* ---- دکمه بستن مودال موفقیت ---- */
    document.getElementById('btnCloseSuccess').addEventListener('click', () => {
      closeModal(successModal);
      /* حذف انتخاب دکمه‌های ساعت */
document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
    });

    /* ---- بستن با کلید Escape ---- */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (confirmModal.classList.contains('active')) closeModal(confirmModal);
        if (successModal.classList.contains('active')) closeModal(successModal);
      }
    });

/* ---- بارگذاری اولیه ---- */
document.addEventListener('DOMContentLoaded', () => {
  orgId = new URLSearchParams(window.location.search).get('id') || getOrgId();
  if (!orgId) {
    const container = document.querySelector('.container');
    if (container) {
      container.innerHTML = `
        <div style="text-align:center; padding:60px 20px; color:#e74c3c;">
          <h2>شناسه سازمان یافت نشد</h2>
          <p>لطفاً از لینک معتبر استفاده کنید.</p>
        </div>`;
    }
    return;
  }
  loadOrgProfile(orgId);
});