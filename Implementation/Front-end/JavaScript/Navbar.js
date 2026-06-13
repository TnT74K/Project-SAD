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
