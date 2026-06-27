/**
 * home-page.js — رزروسنتر | صفحه اصلی
 * تمام کدهای جاوااسکریپت در این فایل
 */

document.addEventListener('DOMContentLoaded', function () {

  // ===== 1. هدر — سایه هنگام اسکرول =====
  var header = document.getElementById('header');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ===== 2. منوی موبایل =====
  var hamburgerBtn = document.getElementById('hamburgerBtn');
  var mobileMenu = document.getElementById('mobileMenu');

  hamburgerBtn.addEventListener('click', function () {
    mobileMenu.classList.toggle('open');
  });

  document.addEventListener('click', function (e) {
    if (!header.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });

  // ===== 3. چیپ‌های پرطرفدار =====
  window.setChip = function (el, category) {
    document.querySelectorAll('.chip').forEach(function (c) {
      c.classList.remove('active');
    });
    el.classList.add('active');
    var searchInput = document.getElementById('mainSearch');
    searchInput.value = category;
    searchInput.focus();
  };

  // ===== 4. جستجو =====
  window.doSearch = function () {
    var q = document.getElementById('mainSearch').value.trim();
    var city = document.getElementById('citySelect').value;

    if (!q && !city) {
      document.getElementById('mainSearch').focus();
      return;
    }

    document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
  };

  document.getElementById('mainSearch').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      window.doSearch();
    }
  });

// ===== 5. کارت دسته‌بندی =====
window.filterCat = function (cat) {
  var searchInput = document.getElementById('mainSearch');
  searchInput.value = cat;
  searchInput.focus();
  
  // غیرفعال کردن همه چیپ‌ها و فعال کردن چیپ مربوطه
  document.querySelectorAll('.chip').forEach(function(chip) {
    chip.classList.toggle('active', chip.textContent.includes(cat));
  });
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
};



});