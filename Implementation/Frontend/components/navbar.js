async function loadNavbar() {
  const container = document.getElementById("navbar-container");
  if (!container) return;

  try {
    const response = await fetch("Navbar.html");
    const html = await response.text();
    container.innerHTML = html;

    setActiveMenu();
  } catch (error) {
    console.error("خطا در بارگذاری منو:", error);
  }
}

function setActiveMenu() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".topnav .nav-item");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();

  renderCalendar();
  updateClock();
  setInterval(updateClock, 1000);
});
document.addEventListener("DOMContentLoaded", async () => {
  const navbarContainer = document.getElementById("navbar-container");

  if (!navbarContainer) return;

  try {
    const response = await fetch("MainNavbar.html");

    if (!response.ok) {
      throw new Error("Failed to load Navbar.html");
    }

    const navbarHtml = await response.text();
    navbarContainer.innerHTML = navbarHtml;

    setActiveNavItem();
    bindNavEvents();
  } catch (error) {
    console.error("Navbar load error:", error);
  }
});

function setActiveNavItem() {
  const currentPage = window.location.pathname.split("/").pop().toLowerCase();

  const navItems = document.querySelectorAll("#navbar-container .nav-item");

  navItems.forEach(item => {
    item.classList.remove("active");

    const href = item.getAttribute("href");
    if (!href) return;

    if (href.toLowerCase() === currentPage) {
      item.classList.add("active");
    }
  });
}

function bindNavEvents() {
  const navbarContainer = document.getElementById("navbar-container");
  if (!navbarContainer) return;

  navbarContainer.addEventListener("click", function (event) {
    const clickedItem = event.target.closest(".nav-item");
    if (!clickedItem) return;

    const navItems = navbarContainer.querySelectorAll(".nav-item");
    navItems.forEach(item => item.classList.remove("active"));

    clickedItem.classList.add("active");
  });
}
