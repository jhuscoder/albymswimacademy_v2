const menuToggle = document.getElementById("menuToggle");
const menuClose = document.getElementById("menuClose");
const mobileMenu = document.getElementById("mobileMenu");
const overlay = document.getElementById("menuOverlay");

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.remove("translate-x-full");
  overlay.classList.remove("hidden");
});

menuClose.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);

function closeMenu() {
  mobileMenu.classList.add("translate-x-full");
  overlay.classList.add("hidden");
}