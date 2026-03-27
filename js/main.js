/* ============================================
   CAFE ROYAL – Main JavaScript
   ============================================ */

'use strict';

/* -------- PRELOADER -------- */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('hidden'), 600);
  }
});

/* -------- HERO PARTICLES -------- */
(function spawnParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    const size = Math.random() * 6 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 10 + 8}s;
      animation-delay: ${Math.random() * 8}s;
    `;
    container.appendChild(p);
  }
})();

/* -------- STICKY HEADER -------- */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* -------- MOBILE NAV TOGGLE -------- */
(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!header.contains(e.target)) {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    }
  });
})();

/* -------- ACTIVE NAV LINK (scroll spy) -------- */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-50% 0px -45% 0px' });

  sections.forEach(s => observer.observe(s));
})();

/* -------- MENU TABS -------- */
(function initMenuTabs() {
  const tabs   = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById('tab-' + tab.dataset.tab);
      if (target) {
        target.classList.add('active');
        // Re-trigger AOS for newly visible cards
        target.querySelectorAll('[data-aos]').forEach(el => {
          el.classList.remove('aos-animate');
          requestAnimationFrame(() => el.classList.add('aos-animate'));
        });
      }
    });
  });
})();

/* -------- TESTIMONIALS SLIDER -------- */
(function initTestimonials() {
  const track  = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testiDots');
  const prevBtn  = document.getElementById('testiPrev');
  const nextBtn  = document.getElementById('testiNext');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let autoPlay;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(idx) {
    current = (idx + cards.length) % cards.length;
    track.style.transform = `translateX(calc(-${current * 100}% - ${current * 2}rem))`;
    dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function startAuto() {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => goTo(current + 1), 5000);
  }

  prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
  });

  startAuto();
})();

/* -------- ANIMATED COUNTERS -------- */
(function initCounters() {
  const numbers = document.querySelectorAll('.stat-number[data-target]');
  if (!numbers.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = target >= 1000 ? '+' : target >= 100 ? '+' : '';
      let start = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        start = Math.min(start + step, target);
        el.textContent = start.toLocaleString() + (start === target ? suffix : '');
        if (start === target) clearInterval(timer);
      }, 25);
      observer.unobserve(el);
    });
  }, { threshold: .5 });

  numbers.forEach(n => observer.observe(n));
})();

/* -------- SIMPLE AOS (Animate on Scroll) -------- */
(function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay || 0, 10);
        setTimeout(() => entry.target.classList.add('aos-animate'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
})();

/* -------- OPEN NOW BADGE -------- */
(function initOpenNow() {
  const badge = document.getElementById('openNowBadge');
  if (!badge) return;

  const now   = new Date();
  const day   = now.getDay();   // 0=Sun, 1=Mon, ..., 6=Sat
  const hour  = now.getHours();
  const min   = now.getMinutes();
  const time  = hour * 60 + min;

  const hours = {
    0: [9*60, 21*60],   // Sun
    1: [7*60, 22*60],   // Mon
    2: [7*60, 22*60],
    3: [7*60, 22*60],
    4: [7*60, 22*60],
    5: [7*60, 22*60],   // Fri
    6: [8*60, 23*60],   // Sat
  };

  const [open, close] = hours[day];
  const isOpen = time >= open && time < close;

  badge.className = 'open-now-badge ' + (isOpen ? 'open' : 'closed');
  badge.textContent = isOpen
    ? `We're open now – closes at ${formatTime(close)}`
    : `We're currently closed – opens at ${formatTime(hours[(day + 1) % 7][0])}`;

  function formatTime(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const ampm = h < 12 ? 'am' : 'pm';
    return `${h % 12 || 12}${m ? ':' + String(m).padStart(2,'0') : ''}${ampm}`;
  }
})();

/* -------- BACK TO TOP -------- */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* -------- NEWSLETTER FORM -------- */
(function initNewsletter() {
  const form    = document.getElementById('newsletterForm');
  const success = document.getElementById('newsletterSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('newsletterEmail').style.borderColor = '#c0392b';
      return;
    }
    form.querySelector('.newsletter-input-wrap').style.display = 'none';
    form.querySelector('.newsletter-note').style.display = 'none';
    success.hidden = false;
  });
})();

/* -------- COOKIE BANNER -------- */
(function initCookies() {
  const banner = document.getElementById('cookieBanner');
  const accept = document.getElementById('cookieAccept');
  if (!banner || !accept) return;

  if (!localStorage.getItem('cr_cookies')) {
    setTimeout(() => { banner.hidden = false; }, 2000);
  }
  accept.addEventListener('click', () => {
    localStorage.setItem('cr_cookies', '1');
    banner.hidden = true;
  });
})();

/* -------- CONTACT & BOOKING FORMS -------- */
(function initForms() {
  // Generic form handler
  document.querySelectorAll('.contact-form, .booking-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      // Clear previous errors
      form.querySelectorAll('.field-error').forEach(el => el.remove());
      form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

      // Validate required fields
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.classList.add('error');
          const err = document.createElement('span');
          err.className = 'field-error';
          err.textContent = 'This field is required.';
          field.parentNode.appendChild(err);
        }
      });

      // Validate email
      form.querySelectorAll('input[type="email"]').forEach(field => {
        if (field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          valid = false;
          field.classList.add('error');
          const err = document.createElement('span');
          err.className = 'field-error';
          err.textContent = 'Please enter a valid email address.';
          if (!field.nextElementSibling?.classList.contains('field-error')) {
            field.parentNode.appendChild(err);
          }
        }
      });

      if (valid) {
        form.innerHTML = `
          <div class="form-success">
            <div style="font-size:2.5rem;margin-bottom:.75rem;">&#10003;</div>
            <strong>Thank you!</strong>
            <p style="margin-top:.5rem;font-weight:normal;color:#1a7a45">
              ${form.classList.contains('booking-form')
                ? "Your table reservation request has been received. We'll confirm by email within 24 hours."
                : "Your message has been sent. We'll get back to you soon!"}
            </p>
          </div>`;
      }
    });
  });
})();

/* -------- SMOOTH SCROLL ANCHORS -------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

/* -------- FOOTER YEAR -------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
