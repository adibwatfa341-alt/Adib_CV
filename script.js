const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");
const pageSections = [...document.querySelectorAll("main section[id]")];
const navigationLinks = [...document.querySelectorAll(".nav-links a")];

document.getElementById("year").textContent = new Date().getFullYear();

menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuButton.classList.toggle("open", isOpen);
    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navigationLinks.forEach((link) => link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuButton.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
}));

if (localStorage.getItem("portfolio-theme") === "light") document.body.classList.add("light-theme");

themeToggle.addEventListener("click", () => {
    const lightTheme = document.body.classList.toggle("light-theme");
    localStorage.setItem("portfolio-theme", lightTheme ? "light" : "dark");
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navigationLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    });
}, { rootMargin: "-35% 0px -55%", threshold: 0 });

pageSections.forEach((section) => sectionObserver.observe(section));

