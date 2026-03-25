/**
 * pillar-orbit.js — Precision System reveal
 * Staggered fade-in of floating category pills when section enters viewport.
 * SVG animations (signals, scan, rings) run via CSS keyframes automatically.
 */

document.addEventListener('DOMContentLoaded', () => {
    const wrap = document.getElementById('pillarVisual');
    if (!wrap) return;

    const pills = wrap.querySelectorAll('.pillar-pill');

    const reveal = () => {
        pills.forEach((pill, i) => {
            setTimeout(() => pill.classList.add('visible'), i * 180);
        });
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                reveal();
                observer.disconnect();
            }
        });
    }, { threshold: 0.25 });

    observer.observe(wrap);
});
