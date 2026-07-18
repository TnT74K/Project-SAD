// ---- State ----
let currentPhone = '';
let otpToken = '';        // store token returned by server after OTP send
let countdownInterval = null;

const API_BASE_URL = "http://localhost:5041/api";

// ---- Step navigation ----
const stepIds = ['phone', 'otp', 'password', 'success'];

function goToStep(stepName) {
    stepIds.forEach(id => {
        document.getElementById('step-' + id).classList.remove('active');
    });
    document.getElementById('step-' + stepName).classList.add('active');
    updateDots(stepName);
}

function updateDots(stepName) {
    const dots = document.querySelectorAll('.dot');
    const stepIndex = { phone: 0, otp: 1, password: 2, success: 3 };
    const current = stepIndex[stepName] ?? 0;

    dots.forEach((dot, i) => {
        dot.classList.remove('active', 'done');
        if (i < current) dot.classList.add('done');
        else if (i === current) dot.classList.add('active');
    });

    // Hide dots on success
    document.getElementById('progress-dots').style.display =
        stepName === 'success' ? 'none' : 'flex';
}

// ---- Step 1: Send OTP ----
async function sendOtp() {
    const phoneInput = document.getElementById('phone');
    const phone = phoneInput.value.trim();

    if (!/^09[0-9]{9}$/.test(phone)) {
        showInputError(phoneInput, 'شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)');
        return;
    }
    clearInputError(phoneInput);
    currentPhone = phone;

    try {
        const response = await fetch(`${API_BASE_URL}/Auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: currentPhone })
        });
        const data = await response.json();

        // مدیریت خطا - طبق استاندارد پروژه
        if (response.status === 400) {
            showInputError(phoneInput, data.Message || data.message || "درخواست نامعتبر است");
            return;
        }

        if (response.status === 403) {
            window.location.href = "/pages/errors/error-403.html";
            return;
        }

        if (response.ok && data.IsSuccess) {
            document.getElementById('phone-display').textContent = formatPhone(phone);
            goToStep('otp');
            startOtpBoxes();
            startCountdown(120);
        } else {
            showInputError(phoneInput, data.Message);
        }
    } catch (err) {
        showInputError(phoneInput, 'خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
    }
}

// ---- Step 2: OTP boxes ----
function startOtpBoxes() {
    const boxes = document.querySelectorAll('.otp-box');
    boxes.forEach((box, i) => {
        box.value = '';
        box.classList.remove('filled');

        box.addEventListener('input', function () {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 1);
            this.classList.toggle('filled', this.value !== '');
            if (this.value && i < boxes.length - 1) boxes[i + 1].focus();
        });

        box.addEventListener('keydown', function (e) {
            if (e.key === 'Backspace' && !this.value && i > 0) {
                boxes[i - 1].focus();
                boxes[i - 1].value = '';
                boxes[i - 1].classList.remove('filled');
            }
        });

        box.addEventListener('paste', function (e) {
            e.preventDefault();
            const pasted = (e.clipboardData || window.clipboardData)
                .getData('text').replace(/[^0-9]/g, '');
            boxes.forEach((b, j) => {
                b.value = pasted[j] || '';
                b.classList.toggle('filled', !!b.value);
            });
            const nextEmpty = [...boxes].findIndex(b => !b.value);
            if (nextEmpty !== -1) boxes[nextEmpty].focus();
            else boxes[boxes.length - 1].focus();
        });
    });
    boxes[0].focus();
}

function getOtpValue() {
    return [...document.querySelectorAll('.otp-box')].map(b => b.value).join('');
}

// ---- Countdown ----
function startCountdown(seconds) {
    clearInterval(countdownInterval);
    const countdownEl = document.getElementById('countdown');
    const timerText = document.getElementById('timer-text');
    const resendBtn = document.getElementById('resend-btn');

    resendBtn.disabled = true;
    timerText.style.display = 'inline';

    let remaining = seconds;
    updateCountdownDisplay(remaining, countdownEl);

    countdownInterval = setInterval(() => {
        remaining--;
        updateCountdownDisplay(remaining, countdownEl);
        if (remaining <= 0) {
            clearInterval(countdownInterval);
            timerText.style.display = 'none';
            resendBtn.disabled = false;
        }
    }, 1000);
}

function updateCountdownDisplay(seconds, el) {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    el.textContent = m + ':' + s;
}

async function resendOtp() {
    try {
        const response = await fetch(`${API_BASE_URL}/Auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: currentPhone })
        });
        const data = await response.json();

        if (response.ok && data.IsSuccess) {
            const boxes = document.querySelectorAll('.otp-box');
            boxes.forEach(b => { b.value = ''; b.classList.remove('filled'); });
            boxes[0].focus();
            startCountdown(120);
        } else {
            alert(data.Message);
        }
    } catch (err) {
        alert('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
    }
}

// ---- Step 2: Verify OTP ----
async function verifyOtp() {
    const otp = getOtpValue();
    if (otp.length < 6) {
        alert('لطفاً کد ۶ رقمی را کامل وارد کنید.');
        return;
    }

    // Backend expects 5 digits; take first 5 from the 6 boxes
    const otpCode = otp.substring(0, 5);

    try {
        const response = await fetch(`${API_BASE_URL}/Auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: currentPhone, otpCode: otpCode })
        });
        const data = await response.json();

        if (response.ok && data.IsSuccess) {
            otpToken = data.Token;
            clearInterval(countdownInterval);
            goToStep('password');
        } else {
            alert(data.Message);
        }
    } catch (err) {
        alert('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
    }
}

// ---- Step 3: New password ----
async function submitNewPassword() {
    const newPass = document.getElementById('new_password').value;
    const confirmPass = document.getElementById('confirm_new_password').value;
    const confirmInput = document.getElementById('confirm_new_password');

    if (newPass.length < 8) {
        alert('رمز عبور باید حداقل ۸ کاراکتر باشد.');
        return;
    }

    if (newPass !== confirmPass) {
        showInputError(confirmInput, 'رمز عبور با تکرار آن مطابقت ندارد');
        return;
    }
    clearInputError(confirmInput);

    try {
        const response = await fetch(`${API_BASE_URL}/Auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phoneNumber: currentPhone,
                otpToken: otpToken,
                newPassword: newPass,
                confirmNewPassword: confirmPass
            })
        });
        const data = await response.json();

        if (response.ok && data.IsSuccess) {
            goToStep('success');
        } else {
            showInputError(confirmInput, data.Message);
        }
    } catch (err) {
        showInputError(confirmInput, 'خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
    }
}

// ---- Password toggle ----
function togglePasswordVisibility(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = '🙈';
    } else {
        input.type = 'password';
        icon.textContent = '👁';
    }
}

// ---- Helpers ----
function formatPhone(phone) {
    // e.g. 09123456789 → 0912-345-6789
    return phone.replace(/^(09\d{2})(\d{3})(\d{4})$/, '$3-$2-$1');
}

function showInputError(input, message) {
    clearInputError(input);
    input.style.borderColor = '#e74c3c';
    const err = document.createElement('span');
    err.className = 'field-error';
    err.style.cssText = 'color:#e74c3c;font-size:0.82rem;display:block;margin-top:5px;text-align:right;';
    err.textContent = message;
    input.closest('.input-group').appendChild(err);
}

function clearInputError(input) {
    input.style.borderColor = '';
    const prev = input.closest('.input-group').querySelector('.field-error');
    if (prev) prev.remove();
}

// ---- Confirm password live check ----
document.addEventListener('DOMContentLoaded', function () {
    const newPass = document.getElementById('new_password');
    const confirmPass = document.getElementById('confirm_new_password');

    confirmPass.addEventListener('input', function () {
        if (this.value && newPass.value !== this.value) {
            showInputError(this, 'رمز عبور با تکرار آن مطابقت ندارد');
        } else {
            clearInputError(this);
        }
    });

    newPass.addEventListener('input', function () {
        if (confirmPass.value) {
            if (this.value !== confirmPass.value) {
                showInputError(confirmPass, 'رمز عبور با تکرار آن مطابقت ندارد');
            } else {
                clearInputError(confirmPass);
            }
        }
    });
});