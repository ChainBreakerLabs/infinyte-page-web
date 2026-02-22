/* =====================================================
   INFINYTE LANDING PAGE — Interactions
   Scroll reveal, nav, mobile menu, parallax, smooth scroll
   ===================================================== */

(function () {
  'use strict';
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // ── Scroll Reveal with IntersectionObserver ──
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-up, .reveal-left, .reveal-right'
  );

  if (prefersReducedMotion) {
    revealElements.forEach((el) => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // ── Navigation scroll behavior ──
  const nav = document.getElementById('nav');
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  if (nav) {
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── Mobile menu toggle ──
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuBtn.classList.toggle('active');
    });

    navLinks.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuBtn.classList.remove('active');
      });
    });
  }

  // ── Parallax hero gradients (desktop only) ──
  const heroGradients = document.querySelectorAll('.hero__gradient');

  if (
    !prefersReducedMotion &&
    window.matchMedia('(min-width: 768px)').matches &&
    heroGradients.length
  ) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      heroGradients.forEach((g, i) => {
        const factor = (i + 1) * 8;
        g.style.translate = `${x * factor}px ${y * factor}px`;
      });
    }, { passive: true });
  }

  // ── Hero device 3D tilt ──
  const heroStage = document.querySelector('.hero__devices');
  const heroDevice = document.querySelector('.device--hero');
  let pointerX = 0;
  let pointerY = 0;

  if (!prefersReducedMotion && heroStage && heroDevice) {
    heroStage.addEventListener('mousemove', (event) => {
      const rect = heroStage.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    heroStage.addEventListener('mouseleave', () => {
      pointerX = 0;
      pointerY = 0;
    });

    const animateHeroDevice = () => {
      const rect = heroDevice.getBoundingClientRect();
      const viewH = window.innerHeight || 1;

      if (rect.bottom > -100 && rect.top < viewH + 100) {
        const center = rect.top + rect.height / 2;
        const normalized = (center / viewH - 0.5) * 2;
        const now = performance.now();
        const scrollPitch = -normalized * 7;
        const pointerPitch = -pointerY * 7;
        const pointerYaw = pointerX * 10;
        const floatY = Math.sin(now / 900) * 6;
        const floatX = Math.cos(now / 1200) * 2;

        heroDevice.style.transform = `translate3d(${floatX.toFixed(2)}px, ${floatY.toFixed(2)}px, 0) perspective(1450px) rotateX(${(scrollPitch + pointerPitch).toFixed(2)}deg) rotateY(${pointerYaw.toFixed(2)}deg)`;
      }

      requestAnimationFrame(animateHeroDevice);
    };

    requestAnimationFrame(animateHeroDevice);
  }

  // ── Feature devices float animation ──
  const featureDevices = document.querySelectorAll('.device--feature');

  if (!prefersReducedMotion) {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes deviceFloat {
        0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
        50% { transform: translateY(-12px) rotateX(2.2deg) rotateY(-2.2deg); }
      }
    `;
    document.head.appendChild(style);

    featureDevices.forEach((device, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              device.style.animation = `deviceFloat 6s ease-in-out infinite ${index * 0.45}s`;
            }
          });
        },
        { threshold: 0.2 }
      );

      observer.observe(device);
    });
  }

  // ── Showcase dual-device parallax ──
  const showcaseDevices = document.querySelectorAll('.device--showcase');

  if (showcaseDevices.length === 2 && !prefersReducedMotion) {
    const showcaseContainer = showcaseDevices[0].closest('.showcase__devices');
    let showcaseInView = false;

    if (showcaseContainer) {
      const showcaseObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            showcaseInView = entry.isIntersecting;
          });
        },
        { threshold: 0.12 }
      );

      showcaseObserver.observe(showcaseContainer);

      const animateShowcase = () => {
        if (showcaseInView) {
          const rect = showcaseContainer.getBoundingClientRect();
          const viewH = window.innerHeight || 1;
          const progress = 1 - (rect.top + rect.height / 2) / viewH;
          const scrollOffset = progress * 20;
          const now = performance.now();
          const wave = Math.sin(now / 850) * 5;
          const roll = Math.cos(now / 1200) * 1.2;

          showcaseDevices[0].style.transform = `translateY(${(-scrollOffset + wave).toFixed(2)}px) perspective(1350px) rotateX(${(3.4 + roll).toFixed(2)}deg) rotateY(12deg)`;
          showcaseDevices[1].style.transform = `translateY(${(scrollOffset - wave).toFixed(2)}px) perspective(1350px) rotateX(${(3.4 - roll).toFixed(2)}deg) rotateY(-12deg)`;
        }

        requestAnimationFrame(animateShowcase);
      };

      requestAnimationFrame(animateShowcase);
    }
  }

  // ── Smooth anchor scrolling ──
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = nav ? nav.offsetHeight : 0;
        const targetPosition =
          target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // ── Security shield glow on scroll ──
  const shield = document.querySelector('.security__shield');

  if (shield) {
    const shieldObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          shield.style.filter = entry.isIntersecting
            ? 'drop-shadow(0 0 40px rgba(255,241,203,0.3))'
            : 'none';
        });
      },
      { threshold: 0.5 }
    );

    shieldObserver.observe(shield);
  }

  // ── Stagger children animation for grids ──
  const staggerContainers = document.querySelectorAll(
    '.experience__grid, .security__features'
  );

  staggerContainers.forEach((container) => {
    const children = container.children;
    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            Array.from(children).forEach((child, i) => {
              child.style.transitionDelay = `${i * 0.1}s`;
            });
            staggerObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    staggerObserver.observe(container);
  });
})();
