const toggleBtn = document.getElementById("menuToggle");
const closeBtn = document.getElementById("menuClose");
const mobileMenu = document.getElementById("mobileMenu");
const overlay = document.getElementById("menuOverlay");
const header = document.getElementById("siteHeader");

function openMenu(){
  mobileMenu.classList.remove("translate-x-full");
  overlay.classList.remove("opacity-0","pointer-events-none");
  toggleBtn.setAttribute("aria-expanded","true");
}

function closeMenu(){
  mobileMenu.classList.add("translate-x-full");
  overlay.classList.add("opacity-0","pointer-events-none");
  toggleBtn.setAttribute("aria-expanded","false");
}

toggleBtn.addEventListener("click", openMenu);
closeBtn.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);

document.addEventListener("keydown",(e)=>{
  if(e.key === "Escape") closeMenu();
});

/* Sticky scroll effect */
window.addEventListener("scroll",()=>{
  if(window.scrollY > 40){
    header.classList.add("header-scrolled");
  } else {
    header.classList.remove("header-scrolled");
  }
});

window.addEventListener("scroll", () => {
    const header = document.querySelector("header");

    if (window.scrollY > 60) {
        header.classList.add("nav-scrolled");
    } else {
        header.classList.remove("nav-scrolled");
    }
});