// Mobile navigation
const menuButton = document.getElementById('menuButton');
const navLinks = document.getElementById('navLinks');

menuButton.addEventListener('click', function () {
    navLinks.classList.toggle('open');
    menuButton.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});

document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        menuButton.textContent = '☰';
    });
});

// Current year in the footer
document.getElementById('year').textContent = new Date().getFullYear();

