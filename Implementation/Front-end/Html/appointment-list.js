const STATUS_MAP = {
    present: { text: 'حاضر',      cls: 'badge-green',  row: 'row-green'  },
    cancel:  { text: 'لغو شده',   cls: 'badge-red',    row: 'row-red'    },
    absent:  { text: 'عدم حضور',  cls: 'badge-yellow', row: 'row-yellow' }
  };
  
  function setStatus(btn, type) {
    const row   = btn.closest('tr');
    const badge = row.querySelector('.badge');
    const s     = STATUS_MAP[type];
    badge.className = 'badge ' + s.cls;
    badge.textContent = s.text;
    row.className = s.row;
  }
  