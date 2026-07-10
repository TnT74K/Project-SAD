// ========== متغیرهای عمومی و آدرس پایه API ==========
const API_BASE_URL = 'http://localhost:5041/api';

let otpTimer = null;
let fakeOtp = '';

// متغیرهای ذخیره‌سازی موقت داده‌های احراز هویت بک‌آند
let currentUserId = null;
let userRolesResponse = []; 
let selectedRoleBackendName = ''; // نام نقشی که به بک‌آند ارسال می‌شود
let selectedOrgId = null;         // در صورت نیاز به شناسه سازمان/کسب‌وکار

// ========== نگاشت نقش‌های بک‌آند به المان‌های فرانت‌آند ==========
// این آبجکت کمک می‌کند تا اگر بک‌آند نام نقش را انگلیسی یا فارسی فرستاد، فرانت‌آند گیج نشود.
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

// ========== مودال مدیریت نقش‌ها ==========
function openRoleModal(rolesList) {
    selectedRoleBackendName = '';
    selectedOrgId = null;
    
    document.querySelectorAll('.role-card').forEach(c => {
        c.classList.remove('selected');
        // به صورت پیش‌فرض تمام کارت‌ها را غیرفعال یا کم‌رنگ می‌کنیم تا فقط نقش‌های واقعی کاربر فعال شوند
        c.style.opacity = '0.3';
        c.style.pointerEvents = 'none';
    });
    
    document.getElementById('modal-confirm-btn').disabled = true;
    document.getElementById('role-modal').style.display = 'flex';

    // فعال‌سازی کارت‌ها بر اساس پاسخ واقعی بک‌آند
    if (rolesList && rolesList.length > 0) {
        rolesList.forEach(userRole => {
            // فرض می‌کنیم رول از بک‌آند پروپرتی به نام roleName یا name دارد
            const bName = userRole.roleName || userRole.name || userRole; 
            
            // پیدا کردن کارت مربوطه در HTML بر اساس متن داخل آن
            document.querySelectorAll('.role-card').forEach(card => {
                const label = card.querySelector('.role-label').textContent.trim();
                
                // اگر نقش دریافتی با نگاشت ما همخوانی داشت، کارت را فعال کن
                if (roleMap[bName] && roleMap[bName].label === label) {
                    card.style.opacity = '1';
                    card.style.pointerEvents = 'auto';
                    // ذخیره مشخصات فرعی مثل orgId در دیتاست المان در صورت وجود
                    if (userRole.orgId) {
                        card.dataset.orgId = userRole.orgId;
                    }
                    card.dataset.backendName = bName; 
                }
            });
        });
    } else {
        // اگر نقشی برنگشت، جهت بالا نیامدن بن‌بست حداقل نقش مشتری عمومی را باز می‌گذاریم
        document.querySelectorAll('.role-card').forEach(c => {
            c.style.opacity = '1';
            c.style.pointerEvents = 'auto';
        });
    }
}

function selectRole(el, roleLabel) {
    document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    
    // استخراج نام فنی نقش برای ارسال به متد [HttpPost("select-role")]
    selectedRoleBackendName = el.dataset.backendName || roleLabel;
    selectedOrgId = el.dataset.orgId ? parseInt(el.dataset.orgId) : null;
    
    document.getElementById('modal-confirm-btn').disabled = false;
}

// ارسال نهایی نقش انتخاب شده به اکشن کنترلر دات‌نت
function confirmRole() {
    if (!selectedRoleBackendName || !currentUserId) return;
    
    const btn = document.getElementById('modal-confirm-btn');
    setButtonLoading(btn, true);

    const requestBody = {
        userId: currentUserId,
        roleName: selectedRoleBackendName,
        orgId: selectedOrgId
    };

    fetch(`${API_BASE_URL}/auth/select-role`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('خطا در تایید نقش کاربری');
        }
        return response.json();
    })
    .then(data => {
        setButtonLoading(btn, false);
        
        // ذخیره توکن نهایی JWT صادر شده از دات‌نت در حافظه مرورگر
        if (data && data.token) {
            localStorage.setItem('authToken', data.token);
        } else if (data && data.tokenString) {
            localStorage.setItem('authToken', data.tokenString);
        }
        
        // هدایت کاربر به صفحه اصلی پنل رزرو سنتر
        window.location.href = 'home_page.html';
    })
    .catch(error => {
        set