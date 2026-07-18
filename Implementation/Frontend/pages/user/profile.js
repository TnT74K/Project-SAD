/* ── API CONFIG ── */
const API_BASE_URL = "http://localhost:5000/api";
function getToken() { return localStorage.getItem("token"); }

/* ── TAB SWITCHING ── */
function switchTab(name, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + name).classList.add('active');
}

/* ── EDIT OVERLAY ── */
function openEdit() {
  const overlay = document.getElementById('editOverlay');
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // sync form values from current profile
  document.getElementById('editFirstName').value = document.getElementById('infoName').textContent.split(' ')[0];
  document.getElementById('editLastName').value = document.getElementById('infoName').textContent.split(' ')[1] || '';
  document.getElementById('editNid').value = document.getElementById('infoNid').textContent;
}

function closeEdit() {
  document.getElementById('editOverlay').style.display = 'none';
  document.body.style.overflow = '';
}

/* ── LOAD PROFILE ── */
async function loadProfile() {
  try {
    const res = await fetch(API_BASE_URL + "/UserProfile/profile", {
      headers: { "Authorization": "Bearer " + getToken() }
    });
    const json = await res.json();
    if (!json.IsSuccess) throw new Error(json.Message || "خطا در دریافت پروفایل");

    const d = json.Data;
    const fullName = (d.firstName || "") + " " + (d.lastName || "");
    const phone = d.phoneNumber || "";
    const nid = d.nationalCode || "";
    const city = d.cityName || "";

    // info section
    const infoNameEl = document.getElementById("infoName");
    const infoMobileEl = document.getElementById("infoMobile");
    const infoNidEl = document.getElementById("infoNid");
    const infoCityEl = document.getElementById("infoCity");
    if (infoNameEl) infoNameEl.textContent = fullName;
    if (infoMobileEl) infoMobileEl.textContent = phone;
    if (infoNidEl) infoNidEl.textContent = nid;
    if (infoCityEl) infoCityEl.textContent = city;

    // profile card sidebar
    const profileNameEl = document.getElementById("profileName");
    const profileMobileEl = document.getElementById("profileMobile");
    if (profileNameEl) profileNameEl.textContent = fullName;
    if (profileMobileEl) profileMobileEl.textContent = phone;

    // topbar greeting
    const greetStrong = document.querySelector(".topbar-greeting strong");
    if (greetStrong) greetStrong.textContent = fullName;

    // avatars
    if (d.profileImage) {
      document.querySelectorAll(".avatar").forEach(a => {
        a.innerHTML = '<img src="' + d.profileImage + '" alt="avatar">';
      });
      const topbarAvatar = document.querySelector(".topbar-avatar");
      if (topbarAvatar) {
        topbarAvatar.innerHTML = '<img src="' + d.profileImage + '" alt="avatar">';
      }
    } else {
      const initial = d.firstName ? d.firstName[0] : "ک";
      document.querySelectorAll(".avatar").forEach(a => {
        if (!a.querySelector("img")) a.textContent = initial;
      });
      const topbarAvatar = document.querySelector(".topbar-avatar");
      if (topbarAvatar && !topbarAvatar.querySelector("img")) topbarAvatar.textContent = initial;
    }

    // edit form values
    const editFn = document.getElementById("editFirstName");
    const editLn = document.getElementById("editLastName");
    const editMob = document.getElementById("editMobile");
    const editNid = document.getElementById("editNid");
    const editCity = document.getElementById("editCity");
    if (editFn) editFn.value = d.firstName || "";
    if (editLn) editLn.value = d.lastName || "";
    if (editMob) editMob.value = phone;
    if (editNid) editNid.value = nid;
    if (editCity) editCity.value = d.cityId || "";
  } catch (err) {
    console.error("loadProfile error:", err);
  }
}

/* ── RENDER APPOINTMENTS ── */
function renderAppointments(container, list, showCancel) {
  if (!container) return;
  container.innerHTML = "";

  if (!list || list.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#999;padding:2rem 0;">نوبتی یافت نشد</p>';
    return;
  }

  list.forEach(appt => {
    const dateStr = (appt.appointmentDate || "").substring(0, 10);
    const timeStr = (appt.appointmentTime || "").substring(0, 5);
    const priceStr = appt.price != null ? appt.price.toLocaleString("fa-IR") + " تومان" : "";

    let statusClass = "badge-reserved";
    let statusText = "رزرو شده";
    if (appt.appointmentStatus === 1) { statusClass = "badge-done"; statusText = "انجام شده"; }
    if (appt.appointmentStatus === 2) { statusClass = "badge-cancelled"; statusText = "لغو شده"; }

    const cancelBtnHtml = showCancel
      ? '<button class="btn-cancel" onclick="cancelAppt(this, ' + appt.id + ')">لغو نوبت</button>'
      : "";

    const card = document.createElement("div");
    card.className = "appt-card";
    card.innerHTML =
      '<div class="appt-header">' +
      '<span class="appt-biz">' + (appt.orgName || "") + '</span>' +
      '<span class="appt-status ' + statusClass + '">' + statusText + '</span>' +
      '</div>' +
      '<div class="appt-service">' + (appt.serviceName || "") + '</div>' +
      '<div class="appt-details">' +
      '<span>📅 ' + dateStr + '</span>' +
      '<span>🕐 ' + timeStr + '</span>' +
      '<span>💰 ' + priceStr + '</span>' +
      '</div>' +
      (appt.bookingConfirmCode ? '<div class="appt-code">کد رهگیری: ' + appt.bookingConfirmCode + '</div>' : '') +
      cancelBtnHtml;

    container.appendChild(card);
  });
}

/* ── LOAD APPOINTMENTS ── */
async function loadAppointments() {
  try {
    const headers = { "Authorization": "Bearer " + getToken() };

    const [resReserved, resDone, resCancelled] = await Promise.all([
      fetch(API_BASE_URL + "/UserProfile/appointments/reserved", { headers }),
      fetch(API_BASE_URL + "/UserProfile/appointments/done", { headers }),
      fetch(API_BASE_URL + "/UserProfile/appointments/cancelled", { headers })
    ]);

    const jsonReserved = await resReserved.json();
    const jsonDone = await resDone.json();
    const jsonCancelled = await resCancelled.json();

    const containerReserved = document.querySelector("#tab-reserved .appt-list");
    const containerDone = document.querySelector("#tab-done .appt-list");
    const containerCancelled = document.querySelector("#tab-cancelled .appt-list");

    renderAppointments(containerReserved, jsonReserved.IsSuccess ? jsonReserved.Data : [], true);
    renderAppointments(containerDone, jsonDone.IsSuccess ? jsonDone.Data : [], false);
    renderAppointments(containerCancelled, jsonCancelled.IsSuccess ? jsonCancelled.Data : [], false);
  } catch (err) {
    console.error("loadAppointments error:", err);
  }
}

/* ── LOAD STATS ── */
async function loadStats() {
  try {
    const res = await fetch(API_BASE_URL + "/UserProfile/appointments/stats", {
      headers: { "Authorization": "Bearer " + getToken() }
    });
    const json = await res.json();
    if (!json.IsSuccess) return;

    const d = json.Data;
    const nums = document.querySelectorAll(".pstat-num");
    if (nums[0]) nums[0].textContent = (d.reservedCount || 0).toString();
    if (nums[1]) nums[1].textContent = (d.doneCount || 0).toString();
    if (nums[2]) nums[2].textContent = (d.cancelledCount || 0).toString();

    // update tab badges
    const badges = document.querySelectorAll(".tab-badge");
    if (badges[0]) badges[0].textContent = d.reservedCount || 0;
    if (badges[1]) badges[1].textContent = d.doneCount || 0;
    if (badges[2]) badges[2].textContent = d.cancelledCount || 0;
  } catch (err) {
    console.error("loadStats error:", err);
  }
}

/* ── SAVE PROFILE ── */
async function saveProfile() {
  const fn = document.getElementById('editFirstName').value.trim();
  const ln = document.getElementById('editLastName').value.trim();
  const nid = document.getElementById('editNid').value.trim();
  const city = document.getElementById('editCity').value;

  if (!fn || !ln) {
    showToast('لطفاً فیلدهای اجباری را تکمیل کنید', false);
    return;
  }

  try {
    const res = await fetch(API_BASE_URL + "/UserProfile/profile", {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + getToken(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: fn,
        lastName: ln,
        nationalCode: nid,
        cityId: city ? parseInt(city, 10) : null,
        phoneNumber: mob,
        profileImage: null
      })
    });

    const json = await res.json();
    if (!json.IsSuccess) {
      showToast(json.Message || "خطا در ذخیره پروفایل", false);
      return;
    }

    const fullName = fn + ' ' + ln;

    // update profile card
    document.getElementById('infoName').textContent = fullName;
    document.getElementById('infoMobile').textContent = mob;
    document.getElementById('infoNid').textContent = nid;
    document.getElementById('infoCity').textContent = document.getElementById('editCity').selectedOptions[0]?.textContent || city;
    document.getElementById('profileName').textContent = fullName;
    document.getElementById('profileMobile').textContent = mob;

    // avatar initial
    document.querySelectorAll('.avatar').forEach(a => {
      if (!a.querySelector('img')) a.textContent = fn[0] || 'ک';
    });
    document.querySelector('.topbar-avatar').textContent = fn[0] || 'ک';
    document.querySelector('.topbar-greeting strong').textContent = fullName;

    closeEdit();
    showToast('اطلاعات پروفایل با موفقیت ذخیره شد');
  } catch (err) {
    console.error("saveProfile error:", err);
    showToast("خطا در ارتباط با سرور", false);
  }
}

/* ── CANCEL APPOINTMENT ── */
async function cancelAppt(btn, appointmentId) {
  const card = btn.closest('.appt-card');
  const bizName = card.querySelector('.appt-biz').textContent;
  if (!confirm('آیا از لغو نوبت "' + bizName + '" اطمینان دارید؟')) return;

  try {
    const res = await fetch(API_BASE_URL + "/UserProfile/appointments/" + appointmentId + "/cancel", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + getToken(),
        "Content-Type": "application/json"
      }
    });

    const json = await res.json();
    if (!json.IsSuccess) {
      showToast(json.Message || "خطا در لغو نوبت", false);
      return;
    }

    card.style.transition = 'opacity 0.35s, transform 0.35s';
    card.style.opacity = '0';
    card.style.transform = 'translateX(20px)';
    setTimeout(() => card.remove(), 350);
    showToast('نوبت با موفقیت لغو شد');

    // refresh stats and appointments
    loadStats();
    loadAppointments();
  } catch (err) {
    console.error("cancelAppt error:", err);
    showToast("خطا در ارتباط با سرور", false);
  }
}

/* ── TOAST ── */
function showToast(msg, success = true) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.style.background = success ? 'var(--navy)' : '#c0392b';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

/* ── ESC to close ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeEdit();
});

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  loadAppointments();
  loadStats();
});