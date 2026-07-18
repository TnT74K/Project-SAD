// ============================
// مدیریت کاربران - متصل به API
// ============================

const API_BASE_URL = "http://localhost:5041/api";
function getToken() { return localStorage.getItem("token"); }

// ============================
// داده اولیه
// ============================

let users = [];
let editIndex = null;
let pendingIndex = null;

// ============================
// لود داده از API
// ============================

async function loadUsers() {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { "Authorization": `Bearer ${token}` }
    });

    // مدیریت خطا - طبق استاندارد پروژه
    if (response.status === 400) {
      const errData = await response.json().catch(() => ({}));
      alert(errData.message || "درخواست نامعتبر است");
      return;
    }

    if (response.status === 403) {
      window.location.href = "/pages/errors/error-403.html";
      return;
    }

    if (!response.ok) throw new Error(`خطا در دریافت اطلاعات (${response.status})`);

    const data = await response.json();
    
    // تبدیل داده‌های API به فرمت مورد نیاز برای نمایش
    users = Array.isArray(data) ? data.map(item => ({
      id: item.id,
      first: item.firstName || item.first || '',
      last: item.lastName || item.last || '',
      phone: item.phoneNumber || item.phone || '',
      role: item.roleName || item.role || 'کاربر عادی',
      personstatus: item.isActive !== undefined ? (item.isActive ? 'active' : 'inactive') : (item.personstatus || 'active'),
      nationalcode: item.nationalCode || item.nationalcode || '',
      username: item.username || '',
      password: '' // رمز نباید نمایش داده شود
    })) : [];

    render();
  } catch (err) {
    console.error("loadUsers error:", err);
    // اگر API در دسترس نبود، پیام خطا نمایش بده
    document.getElementById("userTable").innerHTML =
      `<tr><td colspan="6" class="empty-state">خطا در بارگذاری داده‌ها. لطفاً دوباره تلاش کنید.</td></tr>`;
  }
}

// ============================
// رندر جدول کاربران
// ============================

function render() {

  const table = document.getElementById("userTable")

  table.innerHTML = ""

  if (users.length === 0) {
    table.innerHTML = `<tr><td colspan="6" class="empty-state">کاربری یافت نشد.</td></tr>`;
    return;
  }

  users.forEach((u, i) => {

    table.innerHTML += `

<tr>

<td data-label="نام">${u.first}</td>

<td data-label="نام خانوادگی">${u.last}</td>

<td data-label="شماره موبايل">${u.phone}</td>

<td data-label="نقش">${u.role}</td>

<td data-label="وضعیت"
class="${u.personstatus === 'active'
        ? 'personstatus-active'
        : 'personstatus-inactive'}">

${u.personstatus === 'active'
        ? 'فعال'
        : 'غیرفعال'}

</td>

<td data-label="عملیات" class="actions">

<button class="btn-warning-staff"
onclick="editUser(${i})">

ویرایش

</button>

<button class="btn-primary-staff" onclick="askToggle(${i})">


تغییر وضعیت

</button>

</td>

</tr>

`

  })

}

// ======================================
// پرسيدن براي تغيير وضعيت
// ======================================
function askToggle(i) {
  pendingIndex = i;

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
// تاييديه انجام كار (API Call)
// ======================================
async function confirmAction() {

  if (pendingIndex === null) return;

  const user = users[pendingIndex];
  const isActive = user.personstatus === 'active';
  
  try {
    const token = getToken();
    const endpoint = isActive 
      ? `${API_BASE_URL}/admin/users/${user.id}/block`
      : `${API_BASE_URL}/admin/users/${user.id}/unblock`;
    
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    // مدیریت خطا
    if (response.status === 400) {
      const errData = await response.json().catch(() => ({}));
      alert(errData.message || "درخواست نامعتبر است");
      return;
    }

    if (response.status === 403) {
      window.location.href = "/pages/errors/error-403.html";
      return;
    }

    if (!response.ok) {
      throw new Error(`خطا در انجام عملیات (${response.status})`);
    }

    // موفقیت آمیز - آپدیت لوکال و رندر مجدد
    users[pendingIndex].personstatus = isActive ? 'inactive' : 'active';
    
    pendingIndex = null;
    render();
    closeConfirmModal();

  } catch (err) {
    console.error("confirmAction error:", err);
    alert(err.message || "خطا در انجام عملیات.");
  }
}

// ============================
// باز کردن مودال
// ============================

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

// ============================
// پاک کردن فرم
// ============================

function clearForm() {

  document
    .querySelectorAll("#userModal input")
    .forEach(i => i.value = "")

  editIndex = null

}

// ============================
// ثبت یا ویرایش کاربر (API Call)
// ============================

async function saveUser() {

  const first = firstName.value.trim()
  const last = lastName.value.trim()
  const phone = phoneNumber.value.trim()
  const national = nationalCode.value.trim()
  const usern = username.value.trim()
  const pass = password.value.trim()
  const r = role.value

  // جلوگیری از ثبت فیلد خالی
  if (!first || !phone || !last || !national || !usern || !pass) {

    alert("لطفاً تمام فیلدها را تکمیل کنید")

    return

  }

  try {
    const token = getToken();
    let response;
    const requestData = {
      firstName: first,
      lastName: last,
      phoneNumber: phone,
      nationalCode: national,
      username: usern,
      password: pass,
      roleName: r
    };

    if (editIndex != null) {
      // ویرایش کاربر موجود
      const userId = users[editIndex].id;
      response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...requestData, id: userId })
      });
    } else {
      // ثبت کاربر جدید (اگر بکند پشتیبانی کنه)
      response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });
    }

    // مدیریت خطا
    if (response.status === 400) {
      const errData = await response.json().catch(() => ({}));
      alert(errData.message || "درخواست نامعتبر است");
      return;
    }

    if (response.status === 403) {
      window.location.href = "/pages/errors/error-403.html";
      return;
    }

    if (!response.ok) {
      throw new Error(`خطا در ذخیره اطلاعات (${response.status})`);
    }

    // موفقیت آمیز - بارگذاری مجدد لیست
    await loadUsers();
    closeModal();

  } catch (err) {
    console.error("saveUser error:", err);
    alert(err.message || "خطا در ذخیره اطلاعات.");
  }
}

// ============================
// ویرایش کاربر
// ============================

function editUser(i) {

  editIndex = i

  const u = users[i]

  firstName.value = u.first
  lastName.value = u.last
  phoneNumber.value = u.phone
  role.value = u.role
  nationalCode.value = u.nationalcode
  username.value = u.username
  password.value = ''

  openModal()

}

// ============================
// جستجو در جدول (Client-side)
// ============================

function showAllUsers() {

  document.getElementById("searchInput").value = ""

  render()

}

function searchUser() {

  const text = searchInput.value.trim().toLowerCase()

  if (!text) {
    render();
    return;
  }

  const filtered = users.filter(u => 
    u.first.toLowerCase().includes(text) ||
    u.last.toLowerCase().includes(text) ||
    u.phone.includes(text) ||
    u.role.toLowerCase().includes(text)
  );

  const table = document.getElementById("userTable");
  table.innerHTML = "";

  if (filtered.length === 0) {
    table.innerHTML = `<tr><td colspan="6" class="empty-state">نتیجه‌ای یافت نشد.</td></tr>`;
    return;
  }

  filtered.forEach((u, i) => {
    const originalIndex = users.indexOf(u);
    table.innerHTML += `
<tr>
<td data-label="نام">${u.first}</td>
<td data-label="نام خانوادگی">${u.last}</td>
<td data-label="شماره موبايل">${u.phone}</td>
<td data-label="نقش">${u.role}</td>
<td data-label="وضعیت" class="${u.personstatus === 'active' ? 'personstatus-active' : 'personstatus-inactive'}">
${u.personstatus === 'active' ? 'فعال' : 'غیرفعال'}
</td>
<td data-label="عملیات" class="actions">
<button class="btn-warning-staff" onclick="editUser(${originalIndex})">ویرایش</button>
<button class="btn-primary-staff" onclick="askToggle(${originalIndex})">تغییر وضعیت</button>
</td>
</tr>`;
  });
}

// ============================
// نمایش یا مخفی کردن رمز
// ============================

function togglePass() {

  const p = document.getElementById("password")

  p.type =

    p.type === "password"
      ? "text"
      : "password"

}

// ============================
// شروع صفحه - لود داده از API
// ============================

document.addEventListener('DOMContentLoaded', function() {
  loadUsers();
});