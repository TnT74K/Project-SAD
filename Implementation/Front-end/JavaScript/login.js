//تابع نمایش/مخفی کردن رمز عبور
function togglePasswordVisibility(inputId, icon) {
    const input = document.getElementById(inputId);

    if (input.type === 'password') {
            input.type = 'text';
                icon.textContent = '🙈';
            } 
            else {
                input.type = 'password';
                icon.textContent = '👁';
        }
}
//دریافت المان سلکت نقش
const roleSelect = document.getElementById('role');
//اضافه کردن رویداد تغییر به سلکت نقش
if (roleSelect) {
    roleSelect.addEventListener('change', function() {
        console.log('نقش انتخاب شده:', this.value);
        // می‌توانید اعتبارسنجی بیشتری انجام دهید
        if (this.value === "") {
            this.style.borderColor = "red";
        } else {
            this.style.borderColor = "var(--border)";
        }
    });
}

// در زمان submit فرم
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault(); // برای جلوگیری از ارسال واقعی فرم (در حال تست)
    //دریافت مقادیر فیلد ها
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    if (!role) {
        alert('لطفاً نقش خود را انتخاب کنید');
        return;
    }
    
    console.log('اطلاعات ورود:', { username, password, role });
    // اینجا می‌توانید درخواست AJAX یا fetch بفرستید
});

function CheckField() {

  const Username = document.getElementById("username").value.trim();
  const Password = document.getElementById("password").value.trim();
  const Role = document.getElementById("role").value.trim();


  if (Username === "" || Password === "" || Role === "") {
    alert("لطفا نام کاربری و رمز عبور و نقش خود را وارد کنید");
    return;
  }

  window.location.href = "../Html/home_page.html";
}
