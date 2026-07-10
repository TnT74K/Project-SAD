// ========== متغیرهای عمومی و آدرس پایه API (اصلاح پورت به 5000) ==========
const API_BASE_URL = 'http://localhost:5000/api';

let otpTimer = null;
let currentUserId = null;
let userRolesResponse = []; 
let selectedRoleBackendName = ''; 
let selectedOrgId = null;         

// ========== نگاشت نقش‌های بک‌آند به المان‌های فرانت‌آند ==========
const roleMap = {
    'مشتری': { label: 'مشتری', backend: 'مشتری' },
    'Customer': { label: 'مشتری', backend: 'Customer' },
    'کارمند': { label: 'کارمند کسب‌وکار', backend: 'کارمند' },
    'Staff': { label: 'کارمند کسب‌وکار', backend: 'Staff' },
    'پشتیبان': { label: 'پشتیبان', backend: 'پشتیبان' },
    'Support': { label: 'پشتیبان', backend: 'Support' },
    'مدیر کسب‌وکار': { label: 'مدیر کسب‌وکار', backend: 'مدیر کسب‌وکار' },
    'BusinessManager': { label: 'مدیر کسب‌وکار', backend: 'BusinessManager' },
    'Manager': { label: 'مدیر کسب‌وکار', backend: 'Manager' },
    'سوپر ادمین': { label: 'مدیر ارشد سیستم', backend: 'سوپر ادمین' },
    'SuperAdmin': { label: 'مدیر ارشد سیستم', backend: 'SuperAdmin' },
    'Admin': { label: 'مدیر ارشد سیستم', backend: 'Admin' }
};

// ========== توابع کمکی UI ==========
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
    if (!btn) return;
    if (isLoading) {
        btn.classList.add('loading');
        btn.disabled = true;
    } else {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

function switchTab(type) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.form-panel').forEach(p => p.classList.remove('active'));
    if(type === 'password') {
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        document.getElementById('panel-password').classList.add('active');
    } else {
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('panel-otp').classList.add('active');
    }
}

function togglePass(id, el) {
    const input = document.getElementById(id);
    if(input.type === 'password') {
        input.type = 'text';
        el.textContent = '🙈';
    } else {
        input.type = 'password';
        el.textContent = '👁';
    }
}

// ========== ۱. عملیات ورود با رمز عبور ==========
function submitPassword() {
    const phoneInput = document.getElementById('pw-phone').value.trim();
    const passwordInput = document.getElementById('pw-password').value.trim();
    const btn = document.querySelector('#panel-password .btn-primary');

    if (!validatePhone(phoneInput)) {
        showMsg('pw-phone-msg', 'شماره تلفن معتبر نیست (نمونه: 9123456789)', 'error');
        return;
    }
    showMsg('pw-phone-msg', '', '');

    if (!passwordInput) {
        showMsg('pw-pass-msg', 'رمز عبور را وارد کنید', 'error');
        return;
    }
    showMsg('pw-pass-msg', '', '');

    setButtonLoading(btn, true);
    const formattedPhone = '0' + phoneInput; // تبدیل به فرمت استاندارد 09123456789

    fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: formattedPhone, password: passwordInput })
    })
    .then(res => {
        if (!res.ok) return res.json().then(err => { throw err; });
        return res.json();
    })
    .then(data => {
        setButtonLoading(btn, false);
        if (data && data.isSuccess) {
            // چون در سیستم شما بعد از لاگین باید نقش انتخاب شود:
            currentUserId = data.userId || 1; // ثبت موقت آیدی کاربر
            if (data.roles && data.roles.length > 0) {
                openRoleModal(data.roles);
            } else {
                openRoleModal([]); // باز کردن مودال با نقش پیش‌فرض مشتری
            }
        } else {
            showMsg('pw-pass-msg', data.message || 'ورود ناموفق بود', 'error');
        }
    })
    .catch(err => {
        setButtonLoading(btn, false);
        showMsg('pw-pass-msg', err.message || 'خطا در ارتباط با سرور بک‌آند', 'error');
    });
}

// ========== ۲. عملیات ورود با رمز یکبار مصرف (OTP) ==========
function sendOtp() {
    const phoneInput = document.getElementById('otp-phone').value.trim();
    const btn = document.querySelector('#otp-step1 .btn-primary');

    if (!validatePhone(phoneInput)) {
        showMsg('otp-phone-msg', 'شماره تلفن معتبر نیست', 'error');
        return;
    }
    showMsg('otp-phone-msg', '', '');

    setButtonLoading(btn, true);
    const formattedPhone = '0' + phoneInput;

    fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: formattedPhone })
    })
    .then(res => { if (!res.ok) throw new Error(); return res.json(); })
    .then(data => {
        setButtonLoading(btn, false);
        document.getElementById('phone-display').textContent = formattedPhone;
        document.getElementById('otp-step1').classList.remove('active');
        document.getElementById('otp-step2').classList.add('active');
        startOtpTimer();
    })
    .catch(() => {
        setButtonLoading(btn, false);
        showMsg('otp-phone-msg', 'کاربری با این شماره یافت نشد یا خطا در سرور', 'error');
    });
}

function verifyOtp() {
    const phoneInput = document.getElementById('otp-phone').value.trim();
    const btn = document.querySelector('#otp-step2 .btn-primary');
    
    let otpCode = '';
    for (let i = 0; i < 5; i++) {
        otpCode += document.getElementById(`otp${i}`).value.trim();
    }

    if (otpCode.length < 5) {
        showMsg('otp-code-msg', 'لطفاً کد ۵ رقمی را کامل وارد کنید', 'error');
        return;
    }

    setButtonLoading(btn, true);
    const formattedPhone = '0' + phoneInput;

    fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: formattedPhone, otpCode: otpCode })
    })
    .then(res => { if (!res.ok) throw new Error(); return res.json(); })
    .then(data => {
        setButtonLoading(btn, false);
        if (data.isSuccess && data.token) {
            localStorage.setItem('authToken', data.token);
            window.location.href = 'home_page.html';
        }
    })
    .catch(() => {
        setButtonLoading(btn, false);
        showMsg('otp-code-msg', 'کد تایید اشتباه است یا منقضی شده', 'error');
    });
}

function startOtpTimer() {
    let duration = 120;
    const display = document.getElementById('countdown');
    clearInterval(otpTimer);
    otpTimer = setInterval(() => {
        let minutes = Math.floor(duration / 60);
        let seconds = duration % 60;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        display.textContent = minutes + ":" + seconds;
        if (--duration < 0) {
            clearInterval(otpTimer);
            document.getElementById('resend-btn').disabled = false;
        }
    }, 1000);
}

function backToStep1() {
    document.getElementById('otp-step2').classList.remove('active');
    document.getElementById('otp-step1').classList.add('active');
    clearInterval(otpTimer);
}

// ========== ۳. مودال مدیریت و تایید نقش کاربری ==========
function openRoleModal(rolesList) {
    selectedRoleBackendName = '';
    selectedOrgId = null;
    
    document.querySelectorAll('.role-card').forEach(c => {
        c.classList.remove('selected');
        c.style.opacity = '0.3';
        c.style.pointerEvents = 'none';
    });
    
    document.getElementById('modal-confirm-btn').disabled = true;
    document.getElementById('role-modal').style.display = 'flex';

    if (rolesList && rolesList.length > 0) {
        rolesList.forEach(userRole => {
            const bName = userRole.roleName || userRole.name || userRole; 
            
            document.querySelectorAll('.role-card').forEach(card => {
                const label = card.querySelector('.role-label').textContent.trim();
                if (roleMap[bName] && roleMap[bName].label === label) {
                    card.style.opacity = '1';
                    card.style.pointerEvents = 'auto';
                    if (userRole.orgId) card.dataset.orgId = userRole.orgId;
                    card.dataset.backendName = bName; 
                }
            });
        });
    } else {
        document.querySelectorAll('.role-card').forEach(c => {
            c.style.opacity = '1';
            c.style.pointerEvents = 'auto';
        });
    }
}

function selectRole(el, roleLabel) {
    document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    
    selectedRoleBackendName = el.dataset.backendName || roleLabel;
    selectedOrgId = el.dataset.orgId ? parseInt(el.dataset.orgId) : null;
    
    document.getElementById('modal-confirm-btn').disabled = false;
}

function confirmRole() {
    if (!selectedRoleBackendName) return;
    
    const btn = document.getElementById('modal-confirm-btn');
    setButtonLoading(btn, true);

    const requestBody = {
        userId: currentUserId || 1,
        roleName: selectedRoleBackendName,
        orgId: selectedOrgId
    };

    fetch(`${API_BASE_URL}/auth/select-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) throw new Error('خطا در تایید نقش کاربری');
        return response.json();
    })
    .then(data => {
        setButtonLoading(btn, false);
        if (data && (data.token || data.tokenString)) {
            localStorage.setItem('authToken', data.token || data.tokenString);
        }
        window.location.href = 'home_page.html';
    })
    .catch(error => {
        setButtonLoading(btn, false);
        alert(error.message);
    });
}

// رفتن خودکار به باکس بعدی در وارد کردن کد OTP
document.querySelectorAll('.otp-boxes input').forEach((input, index, inputs) => {
    input.addEventListener('input', () => {
        if (input.value.length === 1 && index < inputs.length - 1) inputs[index + 1].focus();
    });
});