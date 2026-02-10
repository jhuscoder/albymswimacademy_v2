
// ======== Scroll Navbar style ========
const navbarEl = document.getElementById("navbar");
const headerEl = document.querySelector("header");


function onScroll() {
    const y = window.scrollY;
    headerEl.classList.toggle("backdrop-blur-xl", y > 8);
    headerEl.classList.toggle("glass", y > 8);
    headerEl.classList.toggle("border-b", y > 8);
    headerEl.classList.toggle("border-white/10", y > 8);
}
document.addEventListener("scroll", onScroll, { passive: true });

function init() {
    // ✅ 1. Update footer year dynamically
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ✅ Run on DOM ready (safe initialization)
document.addEventListener("DOMContentLoaded", init);
onScroll();

// document.addEventListener("DOMContentLoaded", () => {
//     const sections = document.querySelectorAll("section");

//     // Intersection observer for entry animations
//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//         if (entry.isIntersecting) {
//             entry.target.classList.add("in-view");
//             // Optional: one-time animation
//             observer.unobserve(entry.target);
//         }
//         });
//     }, { threshold: 0.5 });

//     sections.forEach(section => observer.observe(section));

//     // Add smooth parallax scroll
//     window.addEventListener("scroll", () => {
//         const scrollY = window.scrollY;
//         sections.forEach(section => {
//             const rect = section.getBoundingClientRect();
//             const offset = rect.top * 0.2; // adjust speed
//             section.style.transform = `translateY(${offset}px) scale(1)`;
//         });
//     });
// });