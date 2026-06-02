// نگاشت وضعیت‌ها: متن نشان، کلاس badge و کلاس رنگ ردیف
const STATUS_MAP = {
  present: { text: 'حاضر',      cls: 'badge-green',  row: 'row-green'  },
  cancel:  { text: 'لغو شده',   cls: 'badge-red',    row: 'row-red'    },
  absent:  { text: 'عدم حضور',  cls: 'badge-yellow', row: 'row-yellow' }
};

// تغییر وضعیت ردیف جدول با کلیک روی دکمه
function setStatus(btn, type) {
  const row   = btn.closest('tr');
  const badge = row.querySelector('.badge');
  const s     = STATUS_MAP[type];
  badge.className = 'badge ' + s.cls;
  badge.textContent = s.text;
  row.className = s.row;
}

// به‌روزرسانی ساعت و تاریخ جلالی در نوار بالا
function updateClock() {
  const now = new Date();
  document.getElementById('clockTime').textContent =
    now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });document.getElementById('jalaliDate').textContent =
    now.toLocaleDateString('fa-IR', { calendar: 'persian', year: 'numeric', month: '2-digit', day: '2-digit' });
}

updateClock();
setInterval(updateClock, 1000); // هر ثانیه یک‌بار اجرا می‌شود
