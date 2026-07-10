// ==============================
// داده اولیه کاربران (Fake Data)
// ==============================

let users = [
  {
    first: "علی",
    last: "محمدی",
    phone: "09121235061",
    role: "پشتيبان کسب و کار",
    personstatus: "active",
    nationalcode: "0012345678",
    username: "ali.m",
    password: "123456"
  },
  {
    first: "زهرا",
    last: "کریمی",
    phone: "09121235060",
    role: "كارمند حضوری",
    personstatus: "active",
    nationalcode: "0023456789",
    username: "zahra.k",
    password: "123456"
  },
  {
    first: "مهدی",
    last: "رضایی",
    phone: "09121235590",
    role: "پشتيبان کسب و کار ",
    personstatus: "inactive",
    nationalcode: "0034567891",
    username: "mehdi.r",
    password: "123456"
  },
  {
    first: "سمیرا",
    last: "قاسمی",
    phone: "09121246060",
    role: "كارمند حضوری",
    personstatus: "active",
    nationalcode: "0045678912",
    username: "samira.q",
    password: "123456"
  },
  {
    first: "حسین",
    last: "نعمتی",
    phone: "09135635060",
    role: "كارمند حضوری",
    personstatus: "inactive",
    nationalcode: "0056789123",
    username: "hossein.n",
    password: "123456"
  }
]

// ایندکس کاربر در حالت ویرایش
let editIndex = null

//یک متغیر برای نگه داشتن ردیف انتخاب‌شده
let pendingIndex = null;

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
function confirmAction() {

  if (pendingIndex === null) return;

  if (actionType === "delete") {

    users.splice(pendingIndex, 1);

  }

  else if (actionType === "toggle") {

    users[pendingIndex].personstatus =
      users[pendingIndex].personstatus === 'active'
        ? 'inactive'
        : 'active';

  }

  pendingIndex = null;
  actionType = null;

  render();

  closeConfirmModal();

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

}


// ======================================
// ثبت یا ویرایش کاربر
// ======================================
function saveUser() {

  const first = document.getElementById("firstName")?.value.trim() || "ابوالفضل";
  const last = document.getElementById("lastName")?.value.trim() || "وزیری";
  const phone = document.getElementById("phoneNumber")?.value.trim() || "";
  const national = document.getElementById("nationalCode")?.value.trim() || "2981542898";
  const usern = document.getElementById("username")?.value.trim() || "Username";
  const pass = document.getElementById("password")?.value.trim() || "1234";
  const r = document.getElementById("role")?.value || "پشتيبان کسب و کار";

  // جلوگیری از خالی بودن شماره موبایل (الزامی)
  if (!phone) {
    alert("شماره موبایل نمی‌تواند خالی باشد!");
    return;
  }

  let currentStatus = "active";

  if (editIndex != null) {
    currentStatus = users[editIndex].personstatus;
  }

  const user = {
    first: first,
    last: last,
    phone: phone,
    nationalcode: national,
    username: usern,
    password: pass,
    role: r,
    personstatus: currentStatus
  };

  if (editIndex != null) {
    users[editIndex] = user;
  } else {
    users.push(user);
  }

  render();
  closeModal();
}



// ======================================
// ویرایش کاربر
// ======================================
function editUser(i) {

  editIndex = i

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




// اجرای اولیه رندر
render()
