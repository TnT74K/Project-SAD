// ==============================
// API Configuration
// ==============================
const API_BASE_URL = "http://localhost:5000/api";
function getToken() { return localStorage.getItem("token"); }

// ==============================
// داده کاربران (بارگذاری از API)
// ==============================
let users = [];

// ایندکس کاربر در حالت ویرایش
let editIndex = null;

// شناسه کاربر در حالت ویرایش (برای PUT)
let editId = null;

//یک متغیر برای نگه داشتن ردیف انتخاب‌شده
let pendingIndex = null;

// ==============================
// بارگذاری لیست کارکنان از API
// ==============================
async function loadStaff() {
  try {
    const res = await fetch(`${API_BASE_URL}/org/staff-list`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${getToken()}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `خطای سرور (${res.status})`);
    }

    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.StaffList || data.data || []);

    users = list.map(item => ({
      id: item.id,
      first: item.firstName,
      last: item.lastName,
      phone: item.phoneNumber,
      role: item.roleName,
      personstatus: item.isActive ? 'active' : 'inactive',
      nationalcode: '',
      username: '',
      password: ''
    }));

    render();
  } catch (err) {
    console.error("خطا در بارگذاری کارکنان:", err);
    alert("خطا در بارگذاری لیست کارکنان: " + err.message);
  }
}

// ======================================
// رندر جدول کاربران
// ======================================
function render() {

  const table = document.getElementById("userTable")
  table.innerHTML = ""

  users.forEach((u, i) => {

    table.innerHTML += `
<tr>

<td data-label="نام">${u.first}</td>

<td data-label="نام خانوادگی">${u.last}</td>

<td data-label="شماره موبايل">${u.phone}</td>

<td data-label="نقش">${u.role}</td>

<td data-label="وضعیت"
class="${u.personstatus == 'active' ? 'personstatus-active' : 'personstatus-inactive'}">

${u.personstatus == 'active' ? 'فعال' : 'غیرفعال'}

</td>

<td data-label="عملیات" class="actions">

<button class="btn-warning-staff" onclick="editUser(${i})">
ویرایش
</button>

<button class="btn-primary-staff" onclick="askToggle(${i})">
تغییر وضعیت
</button>

<button class="btn-danger" onclick="askDelete(${i})">
حدف
</button>

</td>

</tr>
`

  })

}
// ======================================
// پرسيدن براي حذف كاربر
// ======================================
function askDelete(i) {

  pendingIndex = i;
  actionType = "delete";

  const item = users[i];

  document.getElementById('confirmTitle').innerText = 'حذف کاربر';

  document.getElementById('confirmText').innerHTML =
    `آیا از حذف <span>${item.first} ${item.last}</span> مطمئن هستید؟`;

  const btn = document.getElementById('confirmBtn');
  btn.innerText = 'حذف';
  btn.className = 'btn-danger';

  document.getElementById('confirmModal').classList.add('open');

}

// ======================================
// حذف کاربر
// ======================================
function deleteUser(i) {

  const user = users[i]

  if (confirm(`آیا از حذف ${user.first} ${user.last} مطمئن هستید؟`)) {

    users.splice(i, 1)

    render()

  }

}

// ======================================
// پرسيدن براي غیرفعال كردن
// ======================================
function askToggle(i) {
  pendingIndex = i;
  actionType = "toggle";
  const item = users[i];
  const isActive = item.personstatus === 'active';

  document.getElementById('confirmTitle').innerText = isActive
    ? 'غیرفعال کردن کاربر'
    : 'فعال کردن کاربر';

  document.getElementById('confirmText').innerHTML = isActive
    ? `آیا از غیرفعال کردن <span>${item.first} ${item.last}</span> مطمئن هستید؟`
    : `آیا از فعال کردن <span>${item.first} ${item.last}</span> مطمئن هستید؟`;

  const btn = document.getElementById('confirmBtn');
  btn.innerText = isActive ? 'غیرفعال کردن' : 'فعال کردن';
  btn.className = isActive ? 'btn-danger' : 'btn-success';

  document.getElementById('confirmModal').classList.add('open');
}

// ======================================
// تاييديه انجام كار
// ======================================
async function confirmAction() {

  if (pendingIndex === null) return;

  try {
    if (actionType === "delete") {

      const res = await fetch(`${API_BASE_URL}/org/staff-list/${users[pendingIndex].id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `خطای سرور (${res.status})`);
      }

    }

    else if (actionType === "toggle") {

      const res = await fetch(`${API_BASE_URL}/org/staff-list/${users[pendingIndex].id}/change-status`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `خطای سرور (${res.status})`);
      }

    }

    pendingIndex = null;
    actionType = null;

    closeConfirmModal();

    await loadStaff();

  } catch (err) {
    console.error("خطا در عملیات:", err);
    alert("خطا: " + err.message);
    pendingIndex = null;
    actionType = null;
    closeConfirmModal();
  }

}



// ======================================
// باز کردن مودال
// ======================================
function openModal() {
  document.getElementById("userModal").style.display = "flex"
}


// ======================================
// بستن مودال
// ======================================
function closeModal() {

  document.getElementById("userModal").style.display = "none"

  clearForm()

}

function closeConfirmModal() {

  document.getElementById("confirmModal").classList.remove("open")

  pendingIndex = null

}




// ======================================
// پاک کردن فرم
// ======================================
function clearForm() {

  document.querySelectorAll("#userModal input")
    .forEach(i => i.value = "")

  editIndex = null
  editId = null

}


// ======================================
// ثبت یا ویرایش کاربر
// ======================================
async function saveUser() {

  const phone = document.getElementById("phoneNumber")?.value.trim() || "";
  const roleId = document.getElementById("role")?.value || 1;

  // جلوگیری از خالی بودن شماره موبایل (الزامی)
  if (!phone) {
    alert("شماره موبایل نمی‌تواند خالی باشد!");
    return;
  }

  try {
    if (editIndex != null) {
      // ویرایش — PUT
      const res = await fetch(`${API_BASE_URL}/org/staff-list`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: editId, roleId: Number(roleId) })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `خطای سرور (${res.status})`);
      }
    } else {
      // افزودن — POST
      const res = await fetch(`${API_BASE_URL}/org/staff-list`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phoneNumber: phone, roleId: Number(roleId) })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `خطای سرور (${res.status})`);
      }
    }

    closeModal();
    await loadStaff();

  } catch (err) {
    console.error("خطا در ذخیره کاربر:", err);
    alert("خطا در ذخیره کاربر: " + err.message);
  }
}



// ======================================
// ویرایش کاربر
// ======================================
function editUser(i) {

  editIndex = i
  editId = users[i].id

  const u = users[i]


  phoneNumber.value = u.phone
  role.value = u.role


  openModal()

}



// ======================================
// تغییر وضعیت فعال / غیرفعال
// ======================================
function togglepersonstatus(i) {

  users[i].personstatus =
    users[i].personstatus == 'active'
      ? 'inactive'
      : 'active'

  render()

}


// ======================================
// نمایش همه کاربران
// ======================================
function showAllUsers() {

  document.getElementById("searchInput").value = ""

  const rows = document.querySelectorAll("#userTable tr")

  rows.forEach(r => {
    r.style.display = ''
  })

}


// ======================================
// جستجو در جدول
// ======================================
function searchUser() {

  const text = searchInput.value

  const rows = document.querySelectorAll("#userTable tr")

  rows.forEach(r => {
    r.style.display = r.innerText.includes(text)
      ? ''
      : 'none'
  })

}


// ======================================
// بررسی وضعیت آنلاین بودن کاربر (تغییر رنگ)
// ======================================
let colorTimer;
let resetTimer;

function ChangeColor() {
  const p = document.getElementById("phoneNumber");
  const bp = document.getElementById("btnPhoneNumber");

  // رنگ اولیه: در حال بررسی
  p.style.transition = "all 0.5s ease";
  bp.style.transition = "all 0.5s ease";

  p.style.backgroundColor = "#fff3cd";
  p.style.borderColor = "#ffc107";

  bp.style.backgroundColor = "#fff3cd";
  bp.style.borderColor = "#ffc107";

  // اگر قبلاً تایمری بوده پاک شود
  clearTimeout(colorTimer);
  clearTimeout(resetTimer);

  // بعد از 2 ثانیه سبز شود
  colorTimer = setTimeout(() => {
    p.style.backgroundColor = "#3fa657";
    p.style.borderColor = "#28a745";

    bp.style.backgroundColor = "#3fa657";
    bp.style.borderColor = "#28a745";

    // بعد از 2 ثانیه دیگر به حالت عادی برگردد
    resetTimer = setTimeout(() => {
      p.style.backgroundColor = "";
      p.style.borderColor = "";

      bp.style.backgroundColor = "";
      bp.style.borderColor = "";
    }, 2000);

  }, 2000);
}




// ======================================
// بارگذاری اولیه
// ======================================
document.addEventListener("DOMContentLoaded", () => {
  loadStaff();
});