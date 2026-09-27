/// <reference types="vite/client" />

document.documentElement.classList.replace('no-script', 'js');

function initializeWebsite(): () => void {
  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  const menuButton = document.querySelector<HTMLButtonElement>('#menuBtn');
  const navigation = document.querySelector<HTMLElement>('#navigation-links');
  const compactNavigation = window.matchMedia('(max-width: 800px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector<HTMLElement>('.hero-stage');
  let menuOpen = false;
  let frameId = 0;

  function setMenuOpen(open: boolean): void {
    menuOpen = open;
    menuButton?.setAttribute('aria-expanded', String(open));
    menuButton?.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    navigation?.classList.toggle('is-open', open);
    if (navigation) navigation.inert = compactNavigation.matches && !open;
  }
  function reconcileNavigation(): void {
    setMenuOpen(false);
  }
  menuButton?.addEventListener('click', () => setMenuOpen(!menuOpen), options);
  navigation?.addEventListener(
    'click',
    (event) => {
      if (event.target instanceof Element && event.target.closest('a'))
        setMenuOpen(false);
    },
    options,
  );
  document.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        menuButton?.focus();
      }
    },
    options,
  );
  document.addEventListener(
    'click',
    (event) => {
      if (
        menuOpen &&
        event.target instanceof Node &&
        !navigation?.contains(event.target) &&
        !menuButton?.contains(event.target)
      )
        setMenuOpen(false);
    },
    options,
  );
  compactNavigation.addEventListener('change', reconcileNavigation, options);
  reconcileNavigation();

  function updateHero(): void {
    frameId = 0;
    if (document.hidden || !hero || reducedMotion.matches) return;
    const bounds = hero.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
    hero.style.setProperty('--hero-shift', `${Math.min(window.scrollY * 0.06, 32)}px`);
  }
  function scheduleHero(): void {
    if (!frameId && !document.hidden && !reducedMotion.matches)
      frameId = requestAnimationFrame(updateHero);
  }
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-pending');
          revealObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.05 },
  );
  function reconcileMotion(): void {
    revealObserver.disconnect();
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    hero?.style.removeProperty('--hero-shift');
    for (const element of document.querySelectorAll<HTMLElement>('.reveal')) {
      const pending =
        !reducedMotion.matches &&
        element.getBoundingClientRect().top > window.innerHeight;
      element.classList.toggle('is-pending', pending);
      if (pending) revealObserver.observe(element);
    }
  }
  reducedMotion.addEventListener('change', reconcileMotion, options);
  window.addEventListener('scroll', scheduleHero, { ...options, passive: true });
  document.addEventListener('visibilitychange', scheduleHero, options);
  reconcileMotion();
  const year = document.querySelector<HTMLElement>('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  return () => {
    listeners.abort();
    revealObserver.disconnect();
    if (frameId) cancelAnimationFrame(frameId);
  };
}

let disposeWebsite = initializeWebsite();
function handlePageHide(): void {
  disposeWebsite();
}
function handlePageShow(event: PageTransitionEvent): void {
  if (event.persisted) disposeWebsite = initializeWebsite();
}
window.addEventListener('pagehide', handlePageHide);
window.addEventListener('pageshow', handlePageShow);
if (import.meta.hot)
  import.meta.hot.dispose(() => {
    disposeWebsite();
    window.removeEventListener('pagehide', handlePageHide);
    window.removeEventListener('pageshow', handlePageShow);
  });
