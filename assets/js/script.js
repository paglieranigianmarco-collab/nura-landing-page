document.addEventListener('DOMContentLoaded', () => {

    // ─── Header Scroll Effect ────────────────────────────────
    const header = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
        header?.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    // ─── Smooth Anchor Scrolling ─────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // ─── Scroll Progress Bar ─────────────────────────────────
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.prepend(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop  = window.scrollY;
        const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = ((scrollTop / docHeight) * 100) + '%';
    }, { passive: true });

    // ─── Scroll Reveal ───────────────────────────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.12 });

    document.querySelectorAll('.reveal-up, .reveal-fade').forEach(el => {
        revealObserver.observe(el);
    });

    // ─── Hero Parallax ───────────────────────────────────────
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

    // ─── Mobile Navigation Drawer ────────────────────────────
    const mobileNavDrawer = document.getElementById('mobileNavDrawer');
    const mobileMenuBtn   = document.querySelector('.mobile-menu-btn');
    const mobileNavClose  = document.getElementById('mobileNavClose');
    const drawerOverlay   = document.getElementById('drawerOverlay');

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

    // ─── Toast System ─────────────────────────────────────────
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

    // ─── nura Club Form ───────────────────────────────────────
    window.handleClubEmail = function(e) {
        e.preventDefault();
        const email = document.getElementById('clubEmail')?.value;
        if (!email) return;

        const list = JSON.parse(localStorage.getItem('nura_waitlist') || '[]');
        if (!list.find(entry => entry.email === email)) {
            list.push({ email, ts: Date.now(), source: 'club' });
            localStorage.setItem('nura_waitlist', JSON.stringify(list));
        }

        animateCounter();

        const btn = e.target.querySelector('button[type="submit"]');
        if (btn) {
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="ph ph-check"></i> Sei dentro!';
            btn.disabled = true;
            setTimeout(() => { btn.innerHTML = original; btn.disabled = false; }, 3000);
        }

        showToast('Benvenuto nel nura Club! Ti contatteremo presto.', 'success', 'ph-sparkle');
    };

    // ─── Waitlist counter ─────────────────────────────────────
    function animateCounter() {
        document.querySelectorAll('#waitlistCounter, #clubCounterNum').forEach(c => {
            const current = parseInt(c.textContent.replace(/\D/g, '')) || 247;
            c.textContent = current + 1;
        });
    }

    // Restore + simulate organic growth
    const counters = document.querySelectorAll('#waitlistCounter, #clubCounterNum');
    if (counters.length) {
        const list = JSON.parse(localStorage.getItem('nura_waitlist') || '[]');
        const base = 247 + list.length;
        counters.forEach(c => { c.textContent = base; });

        setInterval(() => {
            if (Math.random() > 0.4) {
                counters.forEach(c => { c.textContent = parseInt(c.textContent) + 1; });
            }
        }, Math.random() * 60000 + 30000);
    }

});
