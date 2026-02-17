/* =====================================================
   INFINYTE LANDING PAGE — Animations & Interactions
   High-performance, scroll-driven, Apple-inspired
   ===================================================== */

(function () {
  'use strict';
  const scriptSrc =
    document.currentScript && document.currentScript.src
      ? document.currentScript.src
      : '';
  const assetBaseHref = scriptSrc
    ? new URL('../', scriptSrc).href
    : window.location.href;
  const resolveAsset = (relativePath) => {
    try {
      return new URL(relativePath, assetBaseHref).href;
    } catch {
      return relativePath;
    }
  };
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
  let lastScrollY = 0;
  let ticking = false;

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        if (lastScrollY > 50) {
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

    // Close on link click
    navLinks.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuBtn.classList.remove('active');
      });
    });
  }

  // ── Counter animation ──
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);

      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ── Parallax and 3D render motion ──
  const heroGradients = document.querySelectorAll('.hero__gradient');
  const heroStage = document.querySelector('.hero__devices');
  const heroDevice = document.querySelector('.device--hero');
  const showcaseDevices = document.querySelectorAll('.device--showcase');
  let pointerX = 0;
  let pointerY = 0;
  let showcaseInView = false;

  function onMouseMove(e) {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    heroGradients.forEach((g, i) => {
      const factor = (i + 1) * 8;
      g.style.translate = `${x * factor}px ${y * factor}px`;
    });
  }

  // Only on desktop and when motion is allowed
  if (
    !prefersReducedMotion &&
    window.matchMedia('(min-width: 768px)').matches &&
    heroGradients.length
  ) {
    document.addEventListener('mousemove', onMouseMove, { passive: true });
  }

  // ── Hero render 3D tilt (scroll + pointer + idle float) ──
  if (!prefersReducedMotion && heroStage && heroDevice) {
    heroStage.addEventListener('mousemove', (event) => {
      const rect = heroStage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      pointerX = (x - 0.5) * 2;
      pointerY = (y - 0.5) * 2;
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

  // ── Feature devices subtle float ──
  const featureDevices = document.querySelectorAll('.device--feature');

  featureDevices.forEach((device, index) => {
    const featureObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!prefersReducedMotion) {
              device.style.animation = `deviceFloat 6s ease-in-out infinite ${index * 0.45}s`;
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    featureObserver.observe(device);
  });

  // Add float keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes deviceFloat {
      0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
      50% { transform: translateY(-12px) rotateX(2.2deg) rotateY(-2.2deg); }
    }
  `;
  document.head.appendChild(style);

  // ── Showcase dual-device parallax ──
  if (showcaseDevices.length === 2 && !prefersReducedMotion) {
    const showcaseContainer = showcaseDevices[0].closest('.showcase__devices');
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

  // ── Progress bars animation in budgets mock ──
  const progressBars = document.querySelectorAll('.sm-goals__bar');

  const progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.style.width;
          bar.style.width = '0%';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              bar.style.width = width;
            });
          });
          progressObserver.unobserve(bar);
        }
      });
    },
    { threshold: 0.5 }
  );

  progressBars.forEach((bar) => progressObserver.observe(bar));

  // ── Security shield glow on scroll ──
  const shield = document.querySelector('.security__shield');

  if (shield) {
    const shieldObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            shield.style.filter =
              'drop-shadow(0 0 40px rgba(59,130,246,0.3))';
          } else {
            shield.style.filter = 'none';
          }
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

  // ── Optional screenshot captures for device mockups ──
  const screenMocks = document.querySelectorAll('.screen-mock[data-capture-id]');

  screenMocks.forEach((screen) => {
    const captureId = screen.dataset.captureId;
    const explicitSrc = screen.dataset.captureSrc;
    if (!captureId) return;

    const generatedCandidates = [
      'webp',
      'WEBP',
      'png',
      'PNG',
      'jpg',
      'JPG',
      'jpeg',
      'JPEG',
    ].map(
      (ext) => resolveAsset(`images/screens/${captureId}.${ext}`)
    );
    const explicitCandidates = explicitSrc ? [resolveAsset(explicitSrc)] : [];
    const candidates = explicitSrc
      ? [...explicitCandidates, ...generatedCandidates]
      : generatedCandidates;

    const preview = new Image();
    let index = 0;

    const tryNext = () => {
      if (index >= candidates.length) return;
      const src = candidates[index];
      index += 1;

      preview.onload = () => {
        if (preview.naturalWidth < 20 || preview.naturalHeight < 20) {
          tryNext();
          return;
        }
        const deviceScreen = screen.closest('.device__screen');
        if (deviceScreen) {
          deviceScreen.classList.add('device__screen--capture-ready');
          deviceScreen.style.height = 'auto';
          deviceScreen.style.aspectRatio = `${preview.naturalWidth} / ${preview.naturalHeight}`;
        }

        const loadedSrc = resolveAsset(preview.currentSrc || src);
        screen.style.setProperty('--capture-image', `url("${loadedSrc}")`);
        screen.style.setProperty('--capture-fit', 'contain');
        screen.style.setProperty('--capture-position', 'center top');
        screen.classList.add('screen-mock--capture-ready');
        screen.classList.add('screen-mock--capture-filled');
      };

      preview.onerror = () => {
        tryNext();
      };

      preview.src = src;
    };

    tryNext();
  });

  // ── Optional Genmoji/Memoji avatar captures ──
  const avatarTargets = document.querySelectorAll(
    '.sm-avatar-icon[data-avatar-src]'
  );

  avatarTargets.forEach((avatar) => {
    const avatarSrc = avatar.dataset.avatarSrc;
    if (!avatarSrc) return;

    const candidates = [avatarSrc, resolveAsset(avatarSrc)];

    const preview = new Image();
    let index = 0;

    const tryNext = () => {
      if (index >= candidates.length) return;
      const src = candidates[index];
      index += 1;

      preview.onload = () => {
        avatar.style.backgroundImage = `url("${src}")`;
        avatar.classList.add('is-custom');
      };

      preview.onerror = () => {
        tryNext();
      };

      preview.src = src;
    };

    tryNext();
  });
})();
