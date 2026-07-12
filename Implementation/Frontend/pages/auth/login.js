// ========== متغیرهای عمومی ==========
let otpTimer = null;
let fakeOtp = '';
let selectedRole = '';

// ========== توابع کمکی ==========
function validatePhone(phone) {
    return /^9[0-9]{9}$/.test(phone);
}

function showMsg(id, msg, type) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = msg;
        el.className = 'status-msg ' + type;
    }
}

function setButtonLoading(btn, isLoading) {
    if (isLoading) {
        btn.classList.add('loading');
        btn.disabled = true;
    } else {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

function toPersianDigits(str) {
    const map = { '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴', '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹', ':': ':' };
    return str.split('').map(c => map[c] || c).join('');
}

// ========== مودال نقش ==========
function openRoleModal() {
    selectedRole = '';
    document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('modal-confirm-btn').disabled = true;
    document.getElementById('role-modal').style.display = 'flex';
}

function selectRole(el, role) {
    document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    selectedRole = role;
    document.getElementById('modal-confirm-btn').disabled = false;
}

function confirmRole() {
    if (!selectedRole) return;
    const btn = document.getElementById('modal-confirm-btn');
    setButtonLoading(btn, true);
    setTimeout(() => {
        window.location.href = 'home_page.html';
    }, 800);
}

// ========== تب‌ها ==========
function switchTab(tab) {
    const panels = ['panel-password', 'panel-otp'];
    const btns = document.querySelectorAll('.tab-btn');

    btns.forEach((btn, i) => {
        btn.classList.toggle('active', (i === 0 && tab === 'password') || (i === 1 && tab === 'otp'));
    });

    document.getElementById('panel-password').classList.toggle('active', tab === 'password');
    document.getElementById('panel-otp').classList.toggle('active', tab === 'otp');
}

// ========== نمایش/مخفی رمز ==========
function togglePass(id, icon) {
    const el = document.getElementById(id);
    el.type = el.type === 'password' ? 'text' : 'password';
    icon.textContent = el.type === 'password' ? '👁' : '🙈';
}

// ========== ورود با رمز عبور ==========
function submitPassword() {
    const phone = document.getElementById('pw-phone').value.trim();
    const password = document.getElementById('pw-password').value.trim();
    let valid = true;

    if (!validatePhone(phone)) {
        showMsg('pw-phone-msg', 'شماره موبایل معتبر نیست (مثلاً: 9123456789)', 'error');
        document.getElementById('pw-phone').classList.add('error');
        valid = false;
    } else {
        showMsg('pw-phone-msg', '', '');
        document.getElementById('pw-phone').classList.remove('error');
    }

    if (password.length < 4) {
        showMsg('pw-pass-msg', 'رمز عبور نمی‌تواند خالی باشد', 'error');
        valid = false;
    } else {
        showMsg('pw-pass-msg', '', '');
    }

    if (!valid) return;

    const btn = document.querySelector('#panel-password .btn-primary');
    setButtonLoading(btn, true);

    setTimeout(() => {
        setButtonLoading(btn, false);
        openRoleModal();
    }, 1500);
}

// ========== OTP ==========
function sendOtp() {
    const phone = document.getElementById('otp-phone').value.trim();

    if (!validatePhone(phone)) {
        showMsg('otp-phone-msg', 'شماره موبایل معتبر نیست (مثلاً: 9123456789)', 'error');
        return;
    }

    showMsg('otp-phone-msg', '', '');

    const btn = document.querySelector('#otp-step1 .btn-primary');
    setButtonLoading(btn, true);

    setTimeout(() => {
        setButtonLoading(btn, false);

        fakeOtp = Math.floor(10000 + Math.random() * 90000).toString();
        console.log('کد OTP (فقط برای تست):', fakeOtp);

        document.getElementById('phone-display').textContent = '+98' + phone;
        document.getElementById('otp-step1').classList.remove('active');
        document.getElementById('otp-step2').classList.add('active');

        startTimer(120);
        document.getElementById('otp0').focus();
    }, 1200);
}

function startTimer(seconds) {
    clearInterval(otpTimer);
    document.getElementById('resend-btn').disabled = true;
    let remaining = seconds;

    function update() {
        const m = String(Math.floor(remaining / 60)).padStart(2, '0');
        const s = String(remaining % 60).padStart(2, '0');
        const timerEl = document.getElementById('countdown');
        timerEl.textContent = toPersianDigits(m + ':' + s);
        timerEl.classList.toggle('urgent', remaining <= 20);

        if (remaining <= 0) {
            clearInterval(otpTimer);
            document.getElementById('resend-btn').disabled = false;
            timerEl.textContent = '';
        }
        remaining--;
    }
    update();
    otpTimer = setInterval(update, 1000);
}

function resendOtp() {
    fakeOtp = Math.floor(10000 + Math.random() * 90000).toString();
    console.log('کد OTP جدید (فقط برای تست):', fakeOtp);
    showMsg('otp-code-msg', 'کد جدید ارسال شد', 'success');
    clearOtpBoxes();
    startTimer(120);
    setTimeout(() => showMsg('otp-code-msg', '', ''), 3000);
}

function backToStep1() {
    clearInterval(otpTimer);
    clearOtpBoxes();
    document.getElementById('otp-step2').classList.remove('active');
    document.getElementById('otp-step1').classList.add('active');
    showMsg('otp-code-msg', '', '');
}

function clearOtpBoxes() {
    for (let i = 0; i < 5; i++) {
        const el = document.getElementById('otp' + i);
        el.value = '';
        el.classList.remove('filled', 'error');
    }
}

function verifyOtp() {
    let code = '';
    for (let i = 0; i < 5; i++) code += document.getElementById('otp' + i).value;

    if (code.length < 5) {
        showMsg('otp-code-msg', 'لطفاً کد ۵ رقمی را کامل وارد کنید', 'error');
        return;
    }

    const btn = document.querySelector('#otp-step2 .btn-primary');
    setButtonLoading(btn, true);

    setTimeout(() => {
        setButtonLoading(btn, false);

        if (code === fakeOtp) {
            showMsg('otp-code-msg', '✓ تأیید شد، در حال ادامه...', 'success');
            setTimeout(() => openRoleModal(), 600);
        } else {
            showMsg('otp-code-msg', 'کد وارد‌شده اشتباه است', 'error');
            for (let i = 0; i < 5; i++) document.getElementById('otp' + i).classList.add('error');
        }
    }, 1000);
}

// ========== Event Listeners ==========
document.addEventListener('DOMContentLoaded', () => {
    const boxes = document.querySelectorAll('.otp-boxes input');
    boxes.forEach((box, idx) => {
        box.addEventListener('input', () => {
            box.value = box.value.replace(/[^0-9]/g, '');
            box.classList.toggle('filled', box.value !== '');
            box.classList.remove('error');
            if (box.value && idx < boxes.length - 1) boxes[idx + 1].focus();

            let code = '';
            boxes.forEach(b => code += b.value);
            if (code.length === 5) {
                document.getElementById('otp-code-msg').textContent = '';
            }
        });

        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !box.value && idx > 0) boxes[idx - 1].focus();
            if (e.key === 'ArrowLeft' && idx < boxes.length - 1) boxes[idx + 1].focus();
            if (e.key === 'ArrowRight' && idx > 0) boxes[idx - 1].focus();
        });

        box.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
            [...text].slice(0, 5).forEach((ch, i) => {
                if (boxes[i]) {
                    boxes[i].value = ch;
                    boxes[i].classList.add('filled');
                }
            });
            if (text.length > 0) boxes[Math.min(text.length, 4)].focus();
        });
    });
});