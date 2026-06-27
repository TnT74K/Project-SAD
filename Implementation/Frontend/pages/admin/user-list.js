// ============================
// داده اولیه کاربران
// ============================

let users=[

{
first:"علی",
last:"محمدی",
phone:"09121235061",
role:"پشتيبان سازمان",
personstatus:"active",
nationalcode:"0012345678",
username:"ali.m",
password:"123456"
},

{
first:"زهرا",
last:"کریمی",
phone:"09121235062",
role:"كاربر عادی",
personstatus:"active",
nationalcode:"0023456789",
username:"zahra.k",
password:"123456"
},

{
first:"مهدی",
last:"رضایی",
phone:"09121235461",
role:"كاربر عادی",
personstatus:"inactive",
nationalcode:"0034567891",
username:"mehdi.r",
password:"123456"
},

{
first:"سمیرا",
last:"قاسمی",
phone:"09121287061",
role:"كارمند حضوری",
personstatus:"active",
nationalcode:"0045678912",
username:"samira.q",
password:"123456"
},

{
first:"حسین",
last:"نعمتی",
phone:"09121231481",
role:"مدير",
personstatus:"inactive",
nationalcode:"0056789123",
username:"hossein.n",
password:"123456"
}

]

// ایندکس کاربر در حالت ویرایش
let editIndex=null

//یک متغیر برای نگه داشتن ردیف انتخاب‌شده
let pendingIndex = null;

// ============================
// رندر جدول کاربران
// ============================
function render(){

const table=document.getElementById("userTable")

table.innerHTML=""

users.forEach((u,i)=>{

table.innerHTML+=`

<tr>

<td data-label="نام">${u.first}</td>

<td data-label="نام خانوادگی">${u.last}</td>

<td data-label="شماره موبايل">${u.phone}</td>

<td data-label="نقش">${u.role}</td>

<td data-label="وضعیت"
class="${u.personstatus=='active'
?'personstatus-active'
:'personstatus-inactive'}">

${u.personstatus=='active'
?'فعال'
:'غیرفعال'}

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
// پرسيدن براي حذف كردن
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
// تاييديه انجام كار
// ======================================
function confirmAction(){

if (pendingIndex === null) return;

users[pendingIndex].personstatus =
users[pendingIndex].personstatus === 'active'
? 'inactive'
: 'active';

pendingIndex = null;

render();

closeConfirmModal();

}


// ============================
// باز کردن مودال
// ============================
function openModal(){

document.getElementById("userModal").style.display="flex"

}


// ======================================
// بستن مودال
// ======================================
function closeModal(){

document.getElementById("userModal").style.display="none"

clearForm()

}

function closeConfirmModal(){

document.getElementById("confirmModal").classList.remove("open")

pendingIndex=null

}


// ============================
// پاک کردن فرم
// ============================
function clearForm(){

document
.querySelectorAll("#userModal input")
.forEach(i=>i.value="")

editIndex=null

}


// ============================
// ثبت یا ویرایش کاربر
// ============================
function saveUser(){

const first = firstName.value.trim()
const last = lastName.value.trim()
const phone = phoneNumber.value.trim()
const national = nationalCode.value.trim()
const usern = username.value.trim()
const pass = password.value.trim()
const r = role.value

// جلوگیری از ثبت فیلد خالی
if(!first || !phone || !last || !national || !usern || !pass){

alert("لطفاً تمام فیلدها را تکمیل کنید")

return

}

let currentStatus="active"

// در حالت ویرایش وضعیت قبلی حفظ می‌شود
if(editIndex!=null){

currentStatus=users[editIndex].personstatus

}

const user={

first:first,
last:last,
phone:phone,
role:r,
nationalcode:national,
username:usern,
password:pass,
personstatus:currentStatus

}

// اگر در حالت ویرایش باشیم
if(editIndex!=null){

users[editIndex]=user

}else{

users.push(user)

}

render()

closeModal()

}


// ============================
// ویرایش کاربر
// ============================
function editUser(i){

editIndex=i

const u=users[i]

firstName.value=u.first
lastName.value=u.last
phoneNumber.value=u.phone
role.value=u.role
nationalCode.value=u.nationalcode
username.value=u.username
password.value=u.password

openModal()

}


// ============================
// تغییر وضعیت کاربر
// ============================
function togglepersonstatus(i){

users[i].personstatus=

users[i].personstatus=='active'
?'inactive'
:'active'

render()

}


// ============================
// نمایش همه کاربران
// ============================
function showAllUsers(){

document.getElementById("searchInput").value=""

const rows=document.querySelectorAll("#userTable tr")

rows.forEach(r=>{
r.style.display=''
})

}


// ============================
// جستجو در جدول
// ============================
function searchUser(){

const text=searchInput.value

const rows=document.querySelectorAll("#userTable tr")

rows.forEach(r=>{

r.style.display=

r.innerText.includes(text)
?''
:'none'

})

}


// ============================
// نمایش یا مخفی کردن رمز
// ============================
function togglePass(){

const p=document.getElementById("password")

p.type=

p.type==="password"
?"text"
:"password"

}


// اجرای اولیه برای نمایش داده‌ها
render()
