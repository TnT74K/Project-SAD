const STATUS_MAP = {
  present: { text: 'حاضر',     cls: 'badge-green',  row: 'row-green'  },
  cancel:  { text: 'لغو شده',  cls: 'badge-red',    row: 'row-red'    },
  absent:  { text: 'عدم حضور', cls: 'badge-yellow', row: 'row-yellow' }
};

document.querySelectorAll('#appointmentsBody tr').forEach(row => {
  const badge = row.querySelector('.badge');
  row.dataset.initBadgeClass = badge.className;
  row.dataset.initBadgeText  = badge.textContent;
});

function setStatus(btn, type) {
  const row   = btn.closest('tr');
  const badge = row.querySelector('.badge');
  const s     = STATUS_MAP[type];
  badge.className   = 'badge ' + s.cls;
  badge.textContent = s.text;
  row.className     = s.row;
}

function clearStatus(btn) {
  const row   = btn.closest('tr');
  const badge = row.querySelector('.badge');
  badge.className   = row.dataset.initBadgeClass;
  badge.textContent = row.dataset.initBadgeText;
  row.className     = '';
}
