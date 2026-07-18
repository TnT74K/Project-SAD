const API_BASE_URL = "http://localhost:5041/api";
const token = localStorage.getItem("token");

async function registerUserForHeader() {
  try {

    const response = await fetch(`${API_BASE_URL}/Auth/send-role-id`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();

    if (!response.ok) {
      localStorage.removeItem("token");
      const headerResponse = await fetch("/components/header.html");
      const headerHtml = await headerResponse.text();

      document.getElementById("header-placeholder").innerHTML = headerHtml;

      initHeader();
    }

    if (result.roleId === 5) {
      const headerResponse = await fetch("/components/header-with-profile-for-customer.html");
      const headerHtml = await headerResponse.text();

      document.getElementById("header-placeholder").innerHTML = headerHtml;

      initHeader();
      loadUserProfileForHeader(result);
    }
    else if (result.roleId === 4) {
      const headerResponse = await fetch("/components/header-with-profile-for-staff.html");
      const headerHtml = await headerResponse.text();

      document.getElementById("header-placeholder").innerHTML = headerHtml;

      initHeader();
      loadUserProfileForHeader(result);
    }
    else if (result.roleId === 3) {
      const headerResponse = await fetch("/components/header-with-profile-for-support.html");
      const headerHtml = await headerResponse.text();

      document.getElementById("header-placeholder").innerHTML = headerHtml;

      initHeader();
      loadUserProfileForHeader(result);
    }
    else if (result.roleId === 2) {
      const headerResponse = await fetch("/components/header-with-profile-for-orgadmin.html");
      const headerHtml = await headerResponse.text();

      document.getElementById("header-placeholder").innerHTML = headerHtml;

      initHeader();
      loadUserProfileForHeader(result);
    }
    else if (result.roleId === 1) {
      const headerResponse = await fetch("/components/header-with-profile-for-admin.html");
      const headerHtml = await headerResponse.text();

      document.getElementById("header-placeholder").innerHTML = headerHtml;

      initHeader();
      loadUserProfileForHeader(result);
    }

  } catch (error) {
    console.error(error);

    alert(
      error.message ||
      "ارتباط با سرور برقرار نشد"
    );
    localStorage.removeItem("token");
    window.location.href = "/pages/auth/login.html";
  }
}

function initHeader() {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("show");
    });
  }
}

function loadUserProfileForHeader(user) {

  const firstName = user.firstName || user.FirstName || "";
  const lastName = user.lastName || user.LastName || "";

  const fullName = `${firstName} ${lastName}`.trim();
  const avatarLetter = firstName ? firstName.charAt(0) : "-";

  const headerUserFullname = document.getElementById("header-user-fullname");
  const mobileUserFullname = document.getElementById("mobile-user-fullname");
  const headerUserAvatar = document.getElementById("header-user-avatar");
  const mobileUserAvatar = document.getElementById("mobile-user-avatar");



  if (headerUserFullname) headerUserFullname.textContent = fullName || "کاربر";
  if (mobileUserFullname) mobileUserFullname.textContent = fullName || "کاربر";
  if (headerUserAvatar) headerUserAvatar.textContent = avatarLetter;
  if (mobileUserAvatar) mobileUserAvatar.textContent = avatarLetter;
}

document.addEventListener("DOMContentLoaded", function () {
  registerUserForHeader();
});
