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
