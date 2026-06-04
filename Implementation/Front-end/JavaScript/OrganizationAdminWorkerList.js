// ==============================
// داده اولیه کاربران (Fake Data)
// ==============================

let users=[
{
first:"علی",
last:"محمدی",
role:"پشتيبان سازمان",
personstatus:"active",
nationalcode:"0012345678",
username:"ali.m",
password:"123456"
},
{
first:"زهرا",
last:"کریمی",
role:"كارمند حضوري",
personstatus:"active",
nationalcode:"0023456789",
username:"zahra.k",
password:"123456"
},
{
first:"مهدی",
last:"رضایی",
role:"پشتيبان سازمان",
personstatus:"inactive",
nationalcode:"0034567891",
username:"mehdi.r",
password:"123456"
},
{
first:"سمیرا",
last:"قاسمی",
role:"كارمند حضوري",
personstatus:"active",
nationalcode:"0045678912",
username:"samira.q",
password:"123456"
},
{
first:"حسین",
last:"نعمتی",
role:"كارمند حضوري",
personstatus:"inactive",
nationalcode:"0056789123",
username:"hossein.n",
password:"123456"
}
]

// ایندکس کاربر در حالت ویرایش
let editIndex=null


// ======================================
// رندر جدول کاربران
// ======================================
function render(){

const table=document.getElementById("userTable")
table.innerHTML=""

users.forEach((u,i)=>{

table.innerHTML+=`
<tr>

<td data-label="نام">${u.first}</td>

<td data-label="نام خانوادگی">${u.last}</td>

<td data-label="نقش">${u.role}</td>

<td data-label="وضعیت"
class="${u.personstatus=='active'?'personstatus-active':'personstatus-inactive'}">

${u.personstatus=='active'?'فعال':'غیرفعال'}

</td>

<td data-label="عملیات" class="actions">

<button class="btn-warning" onclick="editUser(${i})">
ویرایش
</button>

<button class="btn-danger" onclick="togglepersonstatus(${i})">
تغییر وضعیت
</button>

</td>

</tr>
`

})

}


// ======================================
// باز کردن مودال
// ======================================
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


// ======================================
// پاک کردن فرم
// ======================================
function clearForm(){

document.querySelectorAll("#userModal input")
.forEach(i=>i.value="")

editIndex=null

}


// ======================================
// ثبت یا ویرایش کاربر
// ======================================
function saveUser(){

const first = firstName.value.trim()
const last = lastName.value.trim()
const national = nationalCode.value.trim()
const usern = username.value.trim()
const pass = password.value.trim()
const r = role.value

// جلوگیری از ثبت فیلد خالی
if(!first || !last || !national || !usern || !pass){
alert("لطفاً تمام فیلدها را تکمیل کنید")
return
}

// وضعیت پیشفرض
let currentStatus="active"

// اگر ویرایش باشد وضعیت قبلی حفظ شود
if(editIndex!=null){
currentStatus=users[editIndex].personstatus
}

const user={
first:first,
last:last,
role:r,
nationalcode:national,
username:usern,
password:pass,
personstatus:currentStatus
}

// اگر ویرایش باشد
if(editIndex!=null){
users[editIndex]=user
}else{
users.push(user)
}

render()
closeModal()

}


// ======================================
// ویرایش کاربر
// ======================================
function editUser(i){

editIndex=i

const u=users[i]

firstName.value=u.first
lastName.value=u.last
role.value=u.role
nationalCode.value=u.nationalcode
username.value=u.username
password.value=u.password

openModal()

}


// ======================================
// تغییر وضعیت فعال / غیرفعال
// ======================================
function togglepersonstatus(i){

users[i].personstatus =
users[i].personstatus=='active'
?'inactive'
:'active'

render()

}


// ======================================
// نمایش همه کاربران
// ======================================
function showAllUsers(){

document.getElementById("searchInput").value=""

const rows=document.querySelectorAll("#userTable tr")

rows.forEach(r=>{
r.style.display=''
})

}


// ======================================
// جستجو در جدول
// ======================================
function searchUser(){

const text=searchInput.value

const rows=document.querySelectorAll("#userTable tr")

rows.forEach(r=>{
r.style.display=r.innerText.includes(text)
?''
:'none'
})

}


// ======================================
// نمایش / مخفی کردن رمز عبور
// ======================================
function togglePass(){

const p=document.getElementById("password")

p.type=p.type==="password"
?"text"
:"password"

}


// اجرای اولیه رندر
render()
