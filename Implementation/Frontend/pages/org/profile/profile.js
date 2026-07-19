/* ---- API Configuration ---- */
const API_BASE_URL = "http://localhost:5041/api";

function getToken() {
  return localStorage.getItem("token");
}

function getUser() {
  return JSON.parse(localStorage.getItem("user") || "{}");
}

function getOrgIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  return Number.isFinite(id) && id > 0 ? id : null;
}

function toPersianNumber(value) {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

function formatFaNumber(value) {
  if (value === null || value === undefined || value === "") return "—";
  return toPersianNumber(value);
}

function formatTime(value) {
  if (!value) return "—";
  return toPersianNumber(String(value));
}

function formatDateLabel(date) {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(date);
}

function formatStatusLabel(isActive) {
  return isActive ? "فعال" : "غیرفعال";
}

function formatPremierLabel(isPremier) {
  return isPremier ? "برتر" : "معمولی";
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getAppointmentDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

let orgId = getOrgIdFromUrl();
let orgData = null;
let selectedService = null;
let selectedDate = null;
let selectedTime = null;
let selectedPrice = null;

const confirmModal = document.getElementById("confirmModal");
const successModal = document.getElementById("successModal");
const modalUsername = document.getElementById("modal-username");
const modalOrgname = document.getElementById("modal-orgname");
const modalDate = document.getElementById("modal-date");
const modalTime = document.getElementById("modal-time");
const modalPrice = document.getElementById("modal-price");
const trackingCode = document.getElementById("trackingCode");
const modalService = document.getElementById("modal-service");
const serviceSelect = document.getElementById("serviceSelect");
const appointmentGrid = document.getElementById("appointmentGrid");
const appointmentsEmpty = document.getElementById("appointmentsEmpty");
const profileContainer = document.querySelector(".container");

function openModal(overlay) {
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(overlay) {
  overlay.classList.remove("active");
  document.body.style.overflow = "";
}

function showError(message) {
  if (!profileContainer) return;
  profileContainer.innerHTML = `
    <div style="text-align:center; padding:60px 20px; color:#e74c3c;">
      <h2>خطا در بارگذاری اطلاعات</h2>
      <p>${message}</p>
    </div>`;
}

function renderOrgHeader() {
  const orgNameEl = document.querySelector(".org-name");
  const orgDescEl = document.querySelector(".org-description");
  const orgImageEl = document.querySelector(".org-image");
  const metaValues = document.querySelectorAll(".org-meta .meta-value");
  const starCountEl = document.querySelector(".star-count");

  if (orgNameEl) orgNameEl.textContent = orgData?.name || "—";
  if (orgDescEl) orgDescEl.textContent = orgData?.description || "—";
  if (orgImageEl && orgData?.image) orgImageEl.src = orgData.image;

  if (metaValues[0]) metaValues[0].textContent = orgData?.address || "—";
  if (metaValues[1]) metaValues[1].textContent = formatStatusLabel(Boolean(orgData?.isActive));
  if (metaValues[2]) metaValues[2].textContent = formatFaNumber(orgData?.voterCount);
  if (starCountEl) starCountEl.textContent = formatFaNumber(orgData?.starCount);
  //if (metaValues[3]) metaValues[3].textContent = formatFaNumber(orgData?.starCount);
  if (metaValues[3]) metaValues[3].textContent = formatFaNumber(orgData?.successAppointmentCount);
  if (metaValues[4]) metaValues[4].textContent = formatPremierLabel(Boolean(orgData?.isPremier));
  if (metaValues[5]) metaValues[5].textContent = `${formatTime(orgData?.endWorkTime)} تا ${formatTime(orgData?.startWorkTime)}`;
}

function renderServices() {
  serviceSelect.innerHTML = '<option value="">انتخاب خدمت</option>';

  const services = orgData?.services || [];
  services.forEach((service) => {
    const option = document.createElement("option");
    option.value = service.id;
    option.textContent = `${service.name}${service.timeDuration ? ` (${formatFaNumber(service.timeDuration)} دقیقه)` : ""}`;
    serviceSelect.appendChild(option);
  });

  serviceSelect.disabled = services.length === 0;
}

async function fetchFreeTimes(serviceId, dateInput) {
  const res = await fetch(
    `${API_BASE_URL}/public-org-profile/services/${serviceId}/free-times/${encodeURIComponent(dateInput)}`
  );

  if (!res.ok) {
    return [];
  }

  return res.json();
}

function renderAppointmentGroups() {
  if (!appointmentGrid) return;

  const services = orgData?.services || [];

  if (!selectedService || services.length === 0) {
    appointmentGrid.hidden = true;
    appointmentGrid.innerHTML = "";
    if (appointmentsEmpty) {
      appointmentsEmpty.hidden = false;
    }
    return;
  }

  const service = services.find((item) => String(item.id) === String(selectedService));
  if (!service) return;

  const dates = [new Date(), addDays(new Date(), 1)];
  appointmentGrid.hidden = false;
  if (appointmentsEmpty) {
    appointmentsEmpty.hidden = true;
  }
  appointmentGrid.innerHTML = `
    <div class="card appointment-group" data-slot-group="0">
      <div class="appointment-date">📅 <span>در حال بارگذاری...</span></div>
      <div class="appointment-times"></div>
    </div>
    <div class="card appointment-group" data-slot-group="1">
      <div class="appointment-date">📅 <span>در حال بارگذاری...</span></div>
      <div class="appointment-times"></div>
    </div>`;

  dates.forEach(async (date, index) => {
    const group = appointmentGrid.querySelector(`[data-slot-group="${index}"]`);
    if (!group) return;

    const dateLabel = group.querySelector(".appointment-date span");
    const timeWrap = group.querySelector(".appointment-times");
    const dateInput = getAppointmentDateInput(date);

    if (dateLabel) dateLabel.textContent = formatDateLabel(date);

    const freeTimes = await fetchFreeTimes(selectedService, dateInput);

    if (!timeWrap) return;

    if (!freeTimes.length) {
      timeWrap.innerHTML = '<span class="no-slot">ساعتی آزاد نیست</span>';
      return;
    }

timeWrap.innerHTML = freeTimes
  .map((slot) => {
    const start = slot.startTime ?? slot.StartTime;
    const price = slot.price ?? slot.Price;

    return `
      <button class="time-btn"
              data-date="${dateInput}"
              data-start="${start}"
              ${price !== null && price !== undefined ? `data-price="${price}"` : ""}>
        ${formatTime(start)}
      </button>`;
  })
  .join("");



  });
}

function formatPersianDateFromIso(dateInput) {
  if (!dateInput) return "—";

  const [year, month, day] = dateInput.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12); // noon to avoid timezone shift

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
}

function formatPrice(value) {
  if (value === null || value === undefined || value === "" || Number.isNaN(Number(value))) {
    return "—";
  }
  return `${formatFaNumber(Number(value))} تومان`;
}



async function loadOrgProfile(id) {
  const res = await fetch(`${API_BASE_URL}/public-org-profile/${id}`);

  if (res.status === 404 || res.status === 400) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "پروفایل کسب و کار یافت نشد");
  }

  if (!res.ok) {
    throw new Error("خطا در دریافت اطلاعات سازمان");
  }

  orgData = await res.json();
  renderOrgHeader();
  renderServices();
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!orgId) {
    showError("شناسه سازمان در آدرس صفحه پیدا نشد.");
    return;
  }

  try {
    await loadOrgProfile(orgId);
  } catch (err) {
    console.error(err);
    showError(err.message);
    return;
  }
});

serviceSelect?.addEventListener("change", async function () {
  selectedService = this.value || null;
  selectedDate = null;
  selectedTime = null;
  document.querySelectorAll(".time-btn").forEach((item) => item.classList.remove("selected"));
  await renderAppointmentGroups();
});

document.addEventListener("click", function (event) {
  const button = event.target.closest(".time-btn");
  if (!button) return;

  if (!selectedService) {
    alert("ابتدا نوع خدمت را انتخاب کنید");
    return;
  }

  const user = getUser();
  const userName = user.fullName || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "کاربر مهمان");
  const service = (orgData?.services || []).find((item) => String(item.id) === String(selectedService));

  document.querySelectorAll(".time-btn").forEach((item) => item.classList.remove("selected"));
  button.classList.add("selected");

  selectedDate = button.dataset.date || null;
  selectedTime = button.dataset.start || button.textContent.trim();
const rawPrice = button.dataset.price;
selectedPrice =
  rawPrice && rawPrice !== "undefined" ? Number(rawPrice) : null;


  modalUsername.textContent = userName;
  modalOrgname.textContent = orgData?.name || "—";
  modalDate.textContent = formatPersianDateFromIso(selectedDate) || "—";
  modalTime.textContent = selectedTime || "—";
modalPrice.textContent = formatPrice(selectedPrice);
  modalService.textContent = service ? `${service.name}${service.timeDuration ? ` (${formatFaNumber(service.timeDuration)} دقیقه)` : ""}` : "—";

  openModal(confirmModal);
});

document.getElementById("btnCancel")?.addEventListener("click", () => {
  closeModal(confirmModal);
});

confirmModal?.addEventListener("click", (event) => {
  if (event.target === confirmModal) closeModal(confirmModal);
});

successModal?.addEventListener("click", (event) => {
  if (event.target === successModal) closeModal(successModal);
});

document.getElementById("btnConfirmPay")?.addEventListener("click", async () => {
  const user = getUser();

  if (!selectedService || !selectedDate || !selectedTime) {
    alert("لطفاً خدمت و ساعت نوبت را انتخاب کنید");
    return;
  }

  const userId = user.id || user.userId;
  if (!userId) {
    alert("برای ثبت نوبت باید وارد حساب کاربری شوید");
    return;
  }

  const body = {
    orgId: orgId,
    serviceId: Number(selectedService),
    userId: Number(userId),
    price: 0,
    appointmentDate: selectedDate,
    appointmentTime: selectedTime,
  };

  closeModal(confirmModal);

  try {
    const res = await fetch(`${API_BASE_URL}/public-org-profile/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "خطا در ثبت نوبت");
    }

    trackingCode.textContent = data.trackingCode || "—";
    openModal(successModal);
    await renderAppointmentGroups();
  } catch (err) {
    alert(err.message);
  }
});

document.getElementById("btnCloseSuccess")?.addEventListener("click", () => {
  closeModal(successModal);
  document.querySelectorAll(".time-btn").forEach((item) => item.classList.remove("selected"));
});
