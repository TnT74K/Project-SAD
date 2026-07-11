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
// تابع نمایش خطا
function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const errorDiv = document.getElementById(errorId);

    if (input && errorDiv) {
        input.classList.add('error');
        input.classList.remove('success');
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
    }
}

// تابع نمایش موفقیت
function showSuccess(inputId, errorId) {
    const input = document.getElementById(inputId);
    const errorDiv = document.getElementById(errorId);

    if (input && errorDiv) {
        input.classList.remove('error');
        input.classList.add('success');
        errorDiv.classList.remove('show');
    }
}

// ========================================
// اعتبارسنجی تطابق رمز عبور (مهمترین بخش)
// ========================================

function validateConfirmPassword() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // بررسی خالی نبودن تکرار رمز
    if (confirmPassword === '') {
        showError('confirm-password', 'confirm-error', 'لطفاً رمز عبور را دوباره وارد کنید');
        return false;
    }

    // بررسی مطابقت رمزها
    if (password !== confirmPassword) {
        showError('confirm-password', 'confirm-error', 'رمز عبور با تکرار آن مطابقت ندارد');
        return false;
    }

    // اگر همه چیز درست بود
    showSuccess('confirm-password', 'confirm-error');
    return true;
}

// اعتبارسنجی رمز عبور اصلی
function validatePassword() {
    const password = document.getElementById('password');
    const value = password.value;

    if (value === '') {
        showError('password', 'password-error', 'لطفاً رمز عبور خود را وارد کنید');
        return false;
    }

    if (value.length < 6) {
        showError('password', 'password-error', 'رمز عبور باید حداقل ۶ کاراکتر باشد');
        return false;
    }

    showSuccess('password', 'password-error');
    return true;
}

// اعتبارسنجی نام و نام خانوادگی
function validateName() {
    const name = document.getElementById('name');
    const value = name.value.trim();

    if (value === '') {
        showError('name', 'name-error', 'لطفاً نام و نام خانوادگی خود را وارد کنید');
        return false;
    }

    if (value.length < 3) {
        showError('name', 'name-error', 'نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد');
        return false;
    }

    showSuccess('name', 'name-error');
    return true;
}

// اعتبارسنجی نام کاربری
function validateUsername() {
    const username = document.getElementById('username');
    const value = username.value.trim();

    if (value === '') {
        showError('username', 'username-error', 'لطفاً نام کاربری خود را وارد کنید');
        return false;
    }

    if (value.length < 4) {
        showError('username', 'username-error', 'نام کاربری باید حداقل ۴ کاراکتر باشد');
        return false;
    }

    showSuccess('username', 'username-error');
    return true;
}

// اعتبارسنجی کد ملی
function validateNationalId() {
    const nationalId = document.getElementById('national_id');
    const value = nationalId.value.trim();

    if (value === '') {
        showError('national_id', 'national-id-error', 'لطفاً کد ملی خود را وارد کنید');
        return false;
    }

    if (!/^\d{10}$/.test(value)) {
        showError('national_id', 'national-id-error', 'کد ملی باید ۱۰ رقم باشد');
        return false;
    }

    showSuccess('national_id', 'national-id-error');
    return true;
}

// اعتبارسنجی شماره تلفن
function validatePhone() {
    const phone = document.getElementById('phone-number');
    const value = phone.value.trim();

    if (value === '') {
        showError('phone-number', 'phone-number-error', 'لطفاً شماره تلفن خود را وارد کنید');
        return false;
    }

    const phonePattern = /^09[0-9]{9}$/;
    if (!phonePattern.test(value)) {
        showError('phone-number', 'phone-number-error', 'شماره تلفن معتبر نیست (مثال: 09131234567)');
        return false;
    }

    showSuccess('phone-number', 'phone-number-error');
    return true;
}

// ========================================
// راه‌اندازی رویدادها بعد از بارگذاری صفحه
// ========================================

document.addEventListener('DOMContentLoaded', function () {

    // رویدادهای بلادرنگ برای هر فیلد
    document.getElementById('name').addEventListener('input', validateName);
    document.getElementById('username').addEventListener('input', validateUsername);
    document.getElementById('national_id').addEventListener('input', validateNationalId);
    document.getElementById('phone-number').addEventListener('input', validatePhone);
    document.getElementById('password').addEventListener('input', function () {
        validatePassword();
        // هر بار که رمز اصلی تغییر می‌کند، تطابق را دوباره بررسی کن
        if (document.getElementById('confirm-password').value) {
            validateConfirmPassword();
        }
    });
    document.getElementById('confirm-password').addEventListener('input', validateConfirmPassword);

    // محدود کردن ورودی کد ملی به عدد
    document.getElementById('national_id').addEventListener('input', function (e) {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
    });

    // محدود کردن ورودی تلفن به عدد
    document.getElementById('phone-number').addEventListener('input', function (e) {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 11);
    });

    // ========================================
    // اعتبارسنجی نهایی هنگام ارسال فرم
    // ========================================

    const form = document.getElementById('registerForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // اجرای همه اعتبارسنجی‌ها
        const isNameValid = validateName();
        const isUsernameValid = validateUsername();
        const isNationalIdValid = validateNationalId();
        const isPhoneValid = validatePhone();
        const isPasswordValid = validatePassword();
        const isConfirmValid = validateConfirmPassword();  // این خط برای تطابق رمزها

        console.log('نتایج اعتبارسنجی:');
        console.log('- نام:', isNameValid);
        console.log('- نام کاربری:', isUsernameValid);
        console.log('- کد ملی:', isNationalIdValid);
        console.log('- تلفن:', isPhoneValid);
        console.log('- رمز:', isPasswordValid);
        console.log('- تطابق رمز:', isConfirmValid);

        // بررسی همه اعتبارسنجی‌ها
        if (isNameValid && isUsernameValid && isNationalIdValid &&
            isPhoneValid && isPasswordValid && isConfirmValid) {

            const formData = {
                name: document.getElementById('name').value.trim(),
                username: document.getElementById('username').value.trim(),
                national_id: document.getElementById('national_id').value.trim(),
                phone_number: document.getElementById('phone-number').value.trim(),
                password: document.getElementById('password').value
            };

            alert(`✅ ثبت‌نام با موفقیت انجام شد!\nخوش آمدید ${formData.name}`);
            console.log('اطلاعات فرم:', { ...formData, password: '***' });

            // می‌توانید در اینجا فرم را واقعاً submit کنید
            // this.submit();
        } else {
            alert('❌ لطفاً همه فیلدها را به درستی پر کنید\n\n⚠️ توجه: رمز عبور و تکرار آن باید مطابقت داشته باشد');

            // اسکرول به اولین خطا
            const firstError = document.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
});
