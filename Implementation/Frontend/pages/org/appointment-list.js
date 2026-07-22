/* =====================================================
   appointment-list.js
   مدیریت لیست نوبت‌های روزانه + مودال اطلاعات مشتری
   Connected to real backend API
   ===================================================== */

/* ---------- API helpers ---------- */

function getOrgId() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.orgId || null;
}

/* ---------- Status mapping ---------- */

const STATUS_ID_MAP = {
  1: { cls: 'badge-blue',   text: 'جدید',        row: '' },
  2: { cls: 'badge-green',  text: 'حضور یافت',   row: 'row-green'  },
  3: { cls: 'badge-red',    text: 'لغو شده',     row: 'row-red'    },
  4: { cls: 'badge-yellow', text: 'حضور نیافت',  row: 'row-yellow' },
};

const STATUS_TYPE_TO_ID = {
  present: 2,
  absent: 4,
  cancel: 3,
};

const STATUS_MAP = {
  present: { text: 'حضور یافت', cls: 'badge-green', row: 'row-green' },
  absent: { text: 'حضور نیافت', cls: 'badge-yellow', row: 'row-yellow' },
  cancel: { text: 'لغو شده', cls: 'badge-red', row: 'row-red' },
};

/* ---------- Gregorian to Shamsi converter ---------- */

function gregorianToShamsi(gy, gm, gd) {
  const gdm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100)
             + Math.floor((gy2 + 399) / 400) + gd + gdm[gm - 1];
  let jy = -1595 + (33 * Math.floor(days / 12053));
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm, jd;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return { jy, jm, jd };
}

const SHAMSI_MONTHS = [
  'فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور',
  'مهر','آبان','آذر','دی','بهمن','اسفند'
];

function toShamsiString(date) {
  const s = gregorianToShamsi(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return `${s.jy}/${String(s.jm).padStart(2,'0')}/${String(s.jd).padStart(2,'0')} — ${SHAMSI_MONTHS[s.jm - 1]}`;
}

/* ---------- Date helpers ---------- */

function formatDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
      && a.getMonth()    === b.getMonth()
      && a.getDate()     === b.getDate();
}

/* ---------- State ---------- */

let currentDate = new Date();
const todayDate = new Date();
let appointmentsData = [];

/* ---------- Action buttons ---------- */

function getActionButtons(dateType) {
  if (dateType === 'past') return '';
  if (dateType === 'future') return `
    <button class="btn-action btn-cancel"  onclick="setStatus(this,'cancel')">🚫 لغو</button>
    <button class="btn-action btn-reset"   onclick="clearStatus(this)">↺ پاک</button>`;
  return `
    <button class="btn-action btn-present" onclick="setStatus(this,'present')">✔ حضور</button>
    <button class="btn-action btn-cancel"  onclick="setStatus(this,'cancel')">✖ لغو</button>
    <button class="btn-action btn-absent"  onclick="setStatus(this,'absent')">— عدم حضور</button>
    <button class="btn-action btn-reset"   onclick="clearStatus(this)">↺ پاک</button>`;
}

/* ---------- Render ---------- */

async function render() {
  const orgId = getOrgId();
  if (!orgId) {
    document.getElementById('appointmentsBody').innerHTML =
      '<tr><td colspan="8" style="text-align:center;color:red;">شناسه سازمان یافت نشد.</td></tr>';
    return;
  }

  const formattedDate = formatDateISO(currentDate);
  const shamsiDisplay = toShamsiString(currentDate);

  // Determine date type
  const dateType = isSameDay(currentDate, todayDate) ? 'today'
                 : currentDate < todayDate ? 'past' : 'future';

  // Update header
  document.getElementById('currentDate').textContent = shamsiDisplay;
  document.querySelector('.card').classList.toggle('not-today', dateType !== 'today');

  // Show loading
  document.getElementById('appointmentsBody').innerHTML =
    '<tr><td colspan="8" style="text-align:center;">در حال بارگذاری...</td></tr>';

  try {
    const json = await apiGet(`/AppointmentList/org/${orgId}/date/${formattedDate}`);
    const payload = json.Data || json.data || json;
    appointmentsData = payload.appointments || [];

    if (appointmentsData.length === 0) {
      document.getElementById('appointmentsBody').innerHTML =
        '<tr><td colspan="8" style="text-align:center;">نوبتی برای این روز یافت نشد.</td></tr>';
      return;
    }

    document.getElementById('appointmentsBody').innerHTML = appointmentsData.map((r, i) => {
      const st = STATUS_ID_MAP[r.appointmentStatusId] || STATUS_ID_MAP[1];
      return `
    <tr class="${st.row}" data-appointment-id="${r.id}" data-init-status-id="${r.appointmentStatusId}">
      <td data-label="#">${i + 1}</td>

      <!-- نام مشتری: کلیک‌پذیر است و مودال اطلاعات را باز می‌کند -->
      <td data-label="مشتری">
        <span class="customer-link"
              onclick="openModal('${escapeHtml(r.bookingUserFullName)}','','${escapeHtml(r.bookingConfirmCode)}')">
          ${escapeHtml(r.bookingUserFullName)}
        </span>
      </td>

      <td data-label="سرویس">${escapeHtml(r.serviceName)}</td>
      <td data-label="تاریخ">${shamsiDisplay}</td>
      <td data-label="ساعت">${r.appointmentTime}</td>

      <!-- کد تأییدیه اختصاصی هر نوبت -->
      <td data-label="کد تأییدیه" class="confirm-code">${escapeHtml(r.bookingConfirmCode)}</td>

      <td data-label="وضعیت"><span class="badge ${st.cls}">${st.text}</span></td>
      <td data-label="عملیات"><div class="actions">${getActionButtons(dateType)}</div></td>
    </tr>`;
    }).join('');

  } catch (err) {
    console.error('Error fetching appointments:', err);
    document.getElementById('appointmentsBody').innerHTML =
      `<tr><td colspan="8" style="text-align:center;color:red;">خطا در ارتباط با سرور</td></tr>`;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ---------- Navigation ---------- */

function changeDay(dir) {
  currentDate = new Date(currentDate);
  currentDate.setDate(currentDate.getDate() + dir);
  render();
}

/* ---------- Status change (API call) ---------- */

async function setStatus(btn, type) {
  const row = btn.closest('tr');
  const appointmentId = parseInt(row.dataset.appointmentId, 10);
  const appointmentStatusId = STATUS_TYPE_TO_ID[type];
  const s = STATUS_MAP[type];

  try {
    const json = await apiRequest(`/AppointmentList/update-status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ appointmentId, appointmentStatusId }),
    });

    // Update UI
    row.querySelector('.badge').className = 'badge ' + s.cls;
    row.querySelector('.badge').textContent = s.text;
    row.className = s.row;

  } catch (err) {
    console.error('Error updating status:', err);
    alert('خطا در ارتباط با سرور');
  }
}

/* ---------- Clear status (reload from server) ---------- */

function clearStatus(btn) {
  render();
}

/* ---------- Customer Modal ---------- */

function openModal(name, phone, code) {
  document.getElementById('modal-name').textContent  = name;
  document.getElementById('modal-phone').textContent = phone || '—';
  document.getElementById('modal-code').textContent  = code;
  document.getElementById('customerModal').classList.add('open');
}

function closeModalDirect() {
  document.getElementById('customerModal').classList.remove('open');
}

function closeModal(event) {
  if (event.target === document.getElementById('customerModal')) {
    closeModalDirect();
  }
}

/* ---------- ESC key handler ---------- */

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModalDirect();
});

/* ---------- Initial render ---------- */

document.addEventListener('DOMContentLoaded', function () {
  render();
});
