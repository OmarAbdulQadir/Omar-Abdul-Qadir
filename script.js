// Microcontroller-pin navigation: hovering or focusing a pad lights its
// trace; clicking scrolls to the linked section. Falls back to plain
// anchor behavior if JS fails to load, since sections have real ids.

document.addEventListener('DOMContentLoaded', () => {
  const pads = document.querySelectorAll('.pad-group');
  const traces = document.querySelectorAll('.trace');

  const traceFor = (target) => {
    return Array.from(traces).find(t => t.dataset.target === target);
  };

  pads.forEach(pad => {
    const href = pad.dataset.href;
    pad.setAttribute('tabindex', '0');
    pad.setAttribute('role', 'link');
    pad.setAttribute('aria-label', 'Jump to ' + href.replace('#', ''));

    const light = () => {
      const el = document.querySelector(href);
      if (!el) return;
      // light every trace whose visual target maps to the same section
      traces.forEach(t => {
        const tEl = document.querySelector(t.dataset.target);
        if (tEl === el) t.classList.add('is-lit');
      });
    };
    const unlight = () => traces.forEach(t => t.classList.remove('is-lit'));

    pad.addEventListener('mouseenter', light);
    pad.addEventListener('mouseleave', unlight);
    pad.addEventListener('focus', light);
    pad.addEventListener('blur', unlight);

    const go = (e) => {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    pad.addEventListener('click', go);
    pad.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') go(e);
    });
  });

  // Highlight the current nav link based on scroll position
  const navLinks = document.querySelectorAll('.pinnav a');
  const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href')));

  const onScroll = () => {
    const y = window.scrollY + 120;
    let current = sections[0];
    sections.forEach(sec => {
      if (sec && sec.offsetTop <= y) current = sec;
    });
    navLinks.forEach(a => {
      a.style.color = (current && a.getAttribute('href') === '#' + current.id)
        ? 'var(--ink)'
        : '';
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});
