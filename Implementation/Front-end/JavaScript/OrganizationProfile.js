 /* ---- داده‌های نمونه (در پروژه واقعی از API می‌آید) ---- */
    const USER_NAME   = 'علی محمدی';
    const ORG_NAME    = 'مرکز تخصصی رزروسنتر';

    /* ---- وضعیت انتخاب ---- */
    let selectedDate = '';
    let selectedTime = '';

    /* ---- المان‌های مودال ---- */
    const confirmModal   = document.getElementById('confirmModal');
    const successModal   = document.getElementById('successModal');
    const modalUsername  = document.getElementById('modal-username');
    const modalOrgname   = document.getElementById('modal-orgname');
    const modalDate      = document.getElementById('modal-date');
    const modalTime      = document.getElementById('modal-time');
    const modalPrice      = document.getElementById('modal-price');
    const trackingCode   = document.getElementById('trackingCode');

    /* ---- تولید کد رهگیری تصادفی ---- */
    function generateTrackingCode() {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = 'RZ-';
      for (let i = 0; i < 8; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
        if (i === 3) code += '-';
      }
      return code;
    }

    /* ---- باز/بستن مودال ---- */
    function openModal(overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal(overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    /* ---- کلیک روی دکمه‌های ساعت ---- */
    const timeButtons = document.querySelectorAll('.time-btn');

    timeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const parentGroup = btn.closest('.appointment-group');
        if (!parentGroup) return;

        /* حذف انتخاب قبلی در همان گروه */
        parentGroup.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        /* گرفتن تاریخ از عنوان گروه */
        const dateEl = parentGroup.querySelector('.appointment-date span');
        selectedDate = dateEl ? dateEl.textContent.trim() : '—';
        selectedTime = btn.textContent.trim();

        /* پر کردن مودال */
        modalUsername.textContent = USER_NAME;
        modalOrgname.textContent  = ORG_NAME;
        modalDate.textContent     = selectedDate;
        modalTime.textContent     = selectedTime;
        modalPrice.textContent    = "180,000";

        /* باز کردن مودال تأیید */
        openModal(confirmModal);
      });
    });

    /* ---- دکمه انصراف ---- */
    document.getElementById('btnCancel').addEventListener('click', () => {
      closeModal(confirmModal);
    });

    /* ---- بستن مودال با کلیک روی پس‌زمینه ---- */
    confirmModal.addEventListener('click', (e) => {
      if (e.target === confirmModal) closeModal(confirmModal);
    });

    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) closeModal(successModal);
    });

    /* ---- دکمه تایید و پرداخت ---- */
    document.getElementById('btnConfirmPay').addEventListener('click', () => {
      closeModal(confirmModal);
      /* کمی تأخیر برای انیمیشن بهتر */
      setTimeout(() => {
        trackingCode.textContent = generateTrackingCode();
        openModal(successModal);
      }, 200);
    });

    /* ---- دکمه بستن مودال موفقیت ---- */
    document.getElementById('btnCloseSuccess').addEventListener('click', () => {
      closeModal(successModal);
      /* حذف انتخاب دکمه‌های ساعت */
      timeButtons.forEach(b => b.classList.remove('selected'));
    });

    /* ---- بستن با کلید Escape ---- */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (confirmModal.classList.contains('active')) closeModal(confirmModal);
        if (successModal.classList.contains('active')) closeModal(successModal);
      }
    });