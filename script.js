(() => {
  const root = document.documentElement;

  // ---- Dark mode (saved choice, else system preference)
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) {}
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.classList.toggle('dark', saved ? saved === 'dark' : prefersDark);

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
  });

  // ---- Mobile menu
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const setMenu = (open) => {
    mobileMenu.classList.toggle('hidden', !open);
    menuBtn.setAttribute('aria-expanded', String(open));
  };
  menuBtn.addEventListener('click', () => setMenu(mobileMenu.classList.contains('hidden')));
  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  // ---- Active nav link
  const links = document.querySelectorAll('.nav-link');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach((s) => spy.observe(s));

  document.getElementById('year').textContent = new Date().getFullYear();

  // ---- GSAP animations (skipped if library failed to load or reduced motion)
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || reduce) return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero intro
  const tl = gsap.timeline({ defaults: { ease: 'back.out(1.6)' } });
  tl.from('.hero-in', { y: 40, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' })
    .from('.hero-blob', { scale: 0.6, opacity: 0, duration: 0.8 }, 0.2)
    .from('.sticker', { scale: 0, rotation: -40, opacity: 0, duration: 0.6, stagger: 0.15 }, 0.7)
    .from('.float-star', { scale: 0, rotation: 180, duration: 0.6, stagger: 0.15 }, 0.9);

  // Idle floating: stickers, stars, doodles
  gsap.utils.toArray('.sticker').forEach((el, i) => {
    gsap.to(el, { y: i % 2 ? 10 : -10, duration: 2 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  });
  gsap.to('.float-star', { y: -12, rotation: 15, duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.4 });
  gsap.utils.toArray('.doodle').forEach((el, i) => {
    gsap.to(el, { x: i % 2 ? -14 : 14, y: 10, duration: 3.5 + i, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  });
  gsap.to('.spin-slow', { rotation: 360, duration: 24, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
  gsap.to('.wobble', { rotation: 6, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  // Scroll reveal
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.from(el, {
      y: 50, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  // Parallax on hero blob
  gsap.to('.hero-blob', {
    y: 50, ease: 'none',
    scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true }
  });

  // Hover: bouncy buttons and project cards
  document.querySelectorAll('.btn-bounce').forEach((b) => {
    b.addEventListener('mouseenter', () => gsap.to(b, { scale: 1.07, rotation: -2, duration: 0.3, ease: 'back.out(3)' }));
    b.addEventListener('mouseleave', () => gsap.to(b, { scale: 1, rotation: 0, duration: 0.3 }));
  });
  document.querySelectorAll('.project-card').forEach((c) => {
    c.addEventListener('mouseenter', () => gsap.to(c, { y: -8, rotation: 1, duration: 0.3, ease: 'power2.out' }));
    c.addEventListener('mouseleave', () => gsap.to(c, { y: 0, rotation: 0, duration: 0.3 }));
  });
})();
