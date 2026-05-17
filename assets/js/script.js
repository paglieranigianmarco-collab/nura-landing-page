document.addEventListener('DOMContentLoaded', () => {
    // ─── Header Scroll Effect ────────────────────────────────
    const header = document.getElementById('mainHeader');

    window.addEventListener('scroll', () => {
        header?.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ─── Scroll Reveal (Apple-style staggered) ──────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.12
    });

    document.querySelectorAll('.reveal-up, .reveal-fade').forEach(el => {
        revealObserver.observe(el);
    });

    // ─── Apple-style Hero Parallax ──────────────────────────
    const heroSection = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');

    if (heroSection && heroContent) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroHeight = heroSection.offsetHeight;
            if (scrolled < heroHeight * 1.2) {
                const p = Math.min(1, scrolled / heroHeight);
                heroContent.style.transform = `translateY(${scrolled * 0.18}px)`;
                heroContent.style.opacity   = String(1 - p * 1.4);
            }
        }, { passive: true });
    }

    // ─── Scroll Progress Indicator ──────────────────────────
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.prepend(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // ─── Toast Notification System ───────────────────────────
    window.showToast = function(message, type = 'info', icon = null) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        const iconHtml = icon ? `<i class="ph ${icon}"></i> ` : '';
        toast.innerHTML = iconHtml + message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-exit');
            toast.addEventListener('animationend', () => toast.remove());
        }, 3000);
    };

    // ─── Mobile Navigation Drawer ────────────────────────────
    const mobileNavDrawer = document.getElementById('mobileNavDrawer');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const drawerOverlay = document.getElementById('drawerOverlay');

    function openMobileNav() {
        if (!mobileNavDrawer) return;
        mobileNavDrawer.classList.add('open');
        if (drawerOverlay) {
            drawerOverlay.classList.add('open');
            drawerOverlay.style.zIndex = '10000';
        }
        document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
        if (!mobileNavDrawer) return;
        mobileNavDrawer.classList.remove('open');
        if (drawerOverlay) {
            drawerOverlay.classList.remove('open');
            drawerOverlay.style.zIndex = '';
        }
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileNav);
    if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
    document.querySelectorAll('[data-close-mobile]').forEach(el => {
        el.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileNav();
    });

    // ─── Premium animated background canvas ──────────────────
    initNuraEnergyCanvas();

    // ─── Hero Email Form Handler ─────────────────────────────
    window.handleHeroEmail = function(e) {
        e.preventDefault();
        // Handled by inline script in index.html
    };
});

function initNuraEnergyCanvas() {
    const canvas = document.getElementById('nuraEnergyCanvas');
    if (!canvas) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = null;
    const rings = [
        { x: 0.78, y: 0.23, r: 0.17, speed: 0.18, phase: 0.0, alpha: 0.22 },
        { x: 0.18, y: 0.72, r: 0.22, speed: -0.12, phase: 1.7, alpha: 0.16 },
        { x: 0.58, y: 0.54, r: 0.28, speed: 0.08, phase: 3.2, alpha: 0.10 }
    ];

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawBlob(cx, cy, rx, ry, t, colorA, colorB, alpha) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(Math.sin(t * 0.17) * 0.28);
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx, ry));
        gradient.addColorStop(0, colorA);
        gradient.addColorStop(0.36, colorB);
        gradient.addColorStop(1, 'rgba(12, 5, 0, 0)');
        ctx.globalAlpha = alpha;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        const points = 96;
        for (let i = 0; i <= points; i++) {
            const a = (Math.PI * 2 * i) / points;
            const wave = 1 + Math.sin(a * 3 + t) * 0.055 + Math.cos(a * 5 - t * 0.7) * 0.035;
            const x = Math.cos(a) * rx * wave;
            const y = Math.sin(a) * ry * wave;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function drawRing(ring, time) {
        const cx = ring.x * width + Math.sin(time * ring.speed + ring.phase) * 22;
        const cy = ring.y * height + Math.cos(time * ring.speed * 1.4 + ring.phase) * 18;
        const radius = ring.r * Math.min(width, height) * (1 + Math.sin(time * 0.55 + ring.phase) * 0.035);
        const spin = time * ring.speed;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(spin);
        ctx.globalAlpha = ring.alpha;
        ctx.lineWidth = Math.max(1, radius * 0.012);
        const gradient = ctx.createLinearGradient(-radius, -radius, radius, radius);
        gradient.addColorStop(0, 'rgba(232, 128, 64, 0)');
        gradient.addColorStop(0.28, 'rgba(232, 128, 64, 0.35)');
        gradient.addColorStop(0.52, 'rgba(245, 237, 224, 0.18)');
        gradient.addColorStop(1, 'rgba(192, 80, 16, 0)');
        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 1.35, radius * 0.62, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    function draw(now) {
        const time = now * 0.001;
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(12, 5, 0, 0.18)';
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'lighter';

        drawBlob(width * (0.72 + Math.sin(time * 0.20) * 0.025), height * 0.30, width * 0.42, height * 0.52, time * 0.9, 'rgba(232,128,64,0.22)', 'rgba(192,80,16,0.11)', 0.86);
        drawBlob(width * 0.28, height * (0.74 + Math.cos(time * 0.18) * 0.025), width * 0.34, height * 0.42, time * 0.75 + 2.0, 'rgba(200,80,16,0.16)', 'rgba(245,237,224,0.045)', 0.76);
        drawBlob(width * 0.54, height * 0.52, width * 0.55, height * 0.34, time * 0.45 + 4.0, 'rgba(240,160,96,0.08)', 'rgba(192,80,16,0.08)', 0.66);

        rings.forEach((ring) => drawRing(ring, time));

        // Fine grain / premium shader texture, intentionally subtle.
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.035;
        ctx.fillStyle = '#f5ede0';
        const step = 4;
        for (let y = 0; y < height; y += step) {
            for (let x = (y % 8); x < width; x += step * 8) {
                const n = Math.sin(x * 0.04 + y * 0.07 + time * 0.8);
                if (n > 0.72) ctx.fillRect(x, y, 1, 1);
            }
        }
        ctx.globalAlpha = 1;

        if (!reduceMotion) raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    draw(0);
}
