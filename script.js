// ── Nav: scroll border + mobile toggle ──
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menu-toggle');
const navLinksEl = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
    updateActiveNav();
}, { passive: true });

menuToggle.addEventListener('click', () => {
    navLinksEl.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navLinksEl.classList.remove('open'));
});

// ── Active nav highlight ──
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const top = section.offsetTop - 120;
        const id = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + section.offsetHeight) {
            links.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}

// ── Typewriter ──
const typeEl = document.getElementById('typewriter');
const typeText = 'Sr Software Developer in Test';
let typeI = 0;

function typeWriter() {
    if (typeI < typeText.length) {
        typeEl.textContent += typeText[typeI];
        typeI++;
        setTimeout(typeWriter, 65);
    }
}
setTimeout(typeWriter, 700);

// ── Scroll reveal ──
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// ── Particle canvas ──
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const isMobile = window.innerWidth < 768;
const COUNT = isMobile ? 35 : 75;

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.size = Math.random() * 1.6 + 0.4;
        this.alpha = Math.random() * 0.45 + 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(58, 123, 236, ${this.alpha})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = Array.from({ length: COUNT }, () => new Particle());
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 115) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(58, 123, 236, ${0.14 * (1 - dist / 115)})`;
                ctx.lineWidth = 0.6;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

let animFrameId;
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animFrameId = requestAnimationFrame(animate);
}

// Pause canvas when hero scrolls out of view
const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        if (!animFrameId) animate();
    } else {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
    }
}, { threshold: 0 });
heroObserver.observe(document.getElementById('hero'));

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        resizeCanvas();
        initParticles();
    }, 150);
}, { passive: true });

resizeCanvas();
initParticles();
animate();

// ── Skills filter ──
const filterBtns = document.querySelectorAll('.skill-filter');
const techCards = document.querySelectorAll('.tech-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        techCards.forEach(card => {
            const match = filter === 'all' || card.dataset.category === filter;
            card.classList.toggle('dimmed', !match);
        });
    });
});

// ── Footer year ──
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
