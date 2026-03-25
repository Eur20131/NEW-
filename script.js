/* ===================================================
   E13 KEBABISH — INTERACTIVE JAVASCRIPT
   =================================================== */

/* ===== PRELOADER ===== */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.classList.add('hidden');
    setTimeout(() => preloader.remove(), 600);
  }, 1200);
});

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
const topBannerHeight = () => {
  const b = document.getElementById('topBanner');
  return b ? b.offsetHeight : 0;
};

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

/* ===== ACTIVE NAV LINK ON SCROLL ===== */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id="home"]');
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

function scrollToSection(id) {
  const target = document.getElementById(id);
  if (target) {
    const offset = navbar.offsetHeight + 8;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/* ===== HERO PARTICLES ===== */
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  const count = 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random() * 100 + '%';
    p.style.width = p.style.height = (Math.random() * 4 + 2) + 'px';
    p.style.animationDuration = (Math.random() * 10 + 8) + 's';
    p.style.animationDelay = (Math.random() * 12) + 's';
    p.style.opacity = Math.random() * 0.6 + 0.2;
    const hue = Math.random() > 0.5 ? '#ffd166' : '#ff6b35';
    p.style.background = hue;
    container.appendChild(p);
  }
}
createParticles();

/* ===== COUNTER ANIMATION ===== */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current).toLocaleString();
    }, 16);
  });
}

/* ===== INTERSECTION OBSERVER (fade-in + counters) ===== */
const heroSection = document.getElementById('home');
let countersStarted = false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Trigger counters when hero is in view
      if (entry.target === heroSection && !countersStarted) {
        countersStarted = true;
        setTimeout(animateCounters, 600);
      }
    }
  });
}, { threshold: 0.15 });

// Observe all fade-in elements
document.querySelectorAll('.about-grid, .section-header, .menu-card, .special-card, .gallery-item, .review-card, .contact-card, .feature-item').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});
observer.observe(heroSection);

/* ===== MENU TABS ===== */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Show/hide grids
    document.querySelectorAll('.menu-grid').forEach(grid => {
      grid.classList.remove('active');
    });
    const target = document.getElementById('tab-' + tab);
    if (target) {
      target.classList.add('active');
      // Animate cards
      target.querySelectorAll('.menu-card').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 80);
      });
    }
  });
});

/* ===== CART / ORDER SYSTEM ===== */
let cart = {};

function addToCart(name, price) {
  if (cart[name]) {
    cart[name].qty += 1;
  } else {
    cart[name] = { price, qty: 1 };
  }
  renderCart();
  updateCartFab();
  showToast(`${name} added to your order!`);
  // Scroll to order section on mobile
  if (window.innerWidth <= 768) {
    setTimeout(() => scrollToSection('order'), 400);
  }
}

function updateQty(name, delta) {
  if (!cart[name]) return;
  cart[name].qty += delta;
  if (cart[name].qty <= 0) {
    delete cart[name];
  }
  renderCart();
  updateCartFab();
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartSummary = document.getElementById('cartSummary');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartTotal = document.getElementById('cartTotal');

  const keys = Object.keys(cart);

  if (keys.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">No items yet — browse the menu above!</p>';
    if (cartSummary) cartSummary.style.display = 'none';
    return;
  }

  let html = '';
  let subtotal = 0;

  keys.forEach(name => {
    const item = cart[name];
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    html += `
      <div class="cart-item">
        <div class="cart-item-left">
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateQty('${name.replace(/'/g, "\\'")}', -1)">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="updateQty('${name.replace(/'/g, "\\'")}', 1)">+</button>
          </div>
          <span class="cart-item-name">${name}</span>
        </div>
        <span class="cart-item-price">£${itemTotal.toFixed(2)}</span>
      </div>`;
  });

  cartItems.innerHTML = html;

  const delivery = 2.99;
  const total = subtotal + delivery;

  if (cartSubtotal) cartSubtotal.textContent = '£' + subtotal.toFixed(2);
  if (cartTotal) cartTotal.textContent = '£' + total.toFixed(2);
  if (cartSummary) cartSummary.style.display = 'block';
}

function updateCartFab() {
  const count = Object.values(cart).reduce((acc, item) => acc + item.qty, 0);
  const fab = document.getElementById('cartFabCount');
  if (fab) fab.textContent = count;
}

function placeOrder() {
  const keys = Object.keys(cart);
  if (keys.length === 0) return;
  const subtotal = Object.values(cart).reduce((acc, i) => acc + i.price * i.qty, 0);
  showToast(`Order placed! Total: £${(subtotal + 2.99).toFixed(2)} — We'll call you shortly!`);
  cart = {};
  renderCart();
  updateCartFab();
}

/* ===== TOAST NOTIFICATION ===== */
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ===== REVIEWS SLIDER ===== */
(function initReviewsSlider() {
  const slider = document.getElementById('reviewsSlider');
  const dotsContainer = document.getElementById('reviewDots');
  const prevBtn = document.getElementById('reviewPrev');
  const nextBtn = document.getElementById('reviewNext');
  if (!slider || !dotsContainer) return;

  const cards = slider.querySelectorAll('.review-card');
  const isMobile = () => window.innerWidth <= 768;
  const itemsVisible = () => isMobile() ? 1 : (window.innerWidth <= 1024 ? 2 : 3);
  let current = 0;
  let total = 0;

  function buildDots() {
    dotsContainer.innerHTML = '';
    total = Math.ceil(cards.length / itemsVisible());
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === current) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(index) {
    current = (index + total) % total;
    const visible = itemsVisible();
    cards.forEach((card, i) => {
      const inRange = i >= current * visible && i < (current + 1) * visible;
      card.style.display = inRange ? 'block' : 'none';
    });
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  buildDots();
  goTo(0);

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-advance
  setInterval(() => goTo(current + 1), 5000);

  // Rebuild on resize
  window.addEventListener('resize', () => {
    buildDots();
    goTo(0);
  });
})();

/* ===== STAR RATING ===== */
const starRating = document.getElementById('starRating');
if (starRating) {
  let selectedRating = 0;
  const stars = starRating.querySelectorAll('span');

  stars.forEach(star => {
    star.addEventListener('mouseenter', () => {
      const val = parseInt(star.dataset.val);
      stars.forEach((s, i) => s.classList.toggle('active', i < val));
    });
    star.addEventListener('mouseleave', () => {
      stars.forEach((s, i) => s.classList.toggle('active', i < selectedRating));
    });
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.dataset.val);
      stars.forEach((s, i) => s.classList.toggle('active', i < selectedRating));
    });
  });
}

/* ===== REVIEW FORM ===== */
const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Thank you for your review! It will be published shortly.');
    reviewForm.reset();
    // Reset stars
    if (starRating) starRating.querySelectorAll('span').forEach(s => s.classList.remove('active'));
  });
}

/* ===== CONTACT FORM ===== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast("Message sent! We'll get back to you very soon.");
    contactForm.reset();
  });
}

/* ===== BOOKING FORM ===== */
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Booking confirmed! We look forward to welcoming you.');
    bookingForm.reset();
    closeModal('bookingModal');
  });
}

/* ===== GALLERY LIGHTBOX ===== */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const caption = item.dataset.lightbox || '';
    const placeholder = item.querySelector('.gallery-placeholder');
    const emoji = placeholder ? placeholder.querySelector('span:first-child').textContent : '🔥';
    const label = placeholder ? placeholder.querySelector('p').textContent : '';

    const lb = document.getElementById('lightbox');
    const lbContent = document.getElementById('lightboxContent');
    if (!lb || !lbContent) return;

    lbContent.innerHTML = `
      <span class="lb-emoji">${emoji}</span>
      <p>${label}</p>
      ${caption ? `<small style="color:rgba(255,255,255,0.45); font-size:0.85rem;">${caption}</small>` : ''}
    `;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}

/* ===== MODAL ===== */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Close modal on backdrop click
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal.id);
  });
});

// Close on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.open').forEach(m => closeModal(m.id));
    closeLightbox();
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

/* ===== OPENING HOURS STATUS ===== */
function checkOpenStatus() {
  const statusEl = document.getElementById('openStatus');
  if (!statusEl) return;

  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const hour = now.getHours();
  const min = now.getMinutes();
  const time = hour + min / 60;

  let isOpen = false;

  if (day === 0) {
    // Sunday: 1pm–10pm
    isOpen = time >= 13 && time < 22;
  } else if (day >= 1 && day <= 4) {
    // Mon–Thu: 12pm–11pm
    isOpen = time >= 12 && time < 23;
  } else {
    // Fri–Sat: 12pm–12am (midnight)
    isOpen = time >= 12 || time < 0;
  }

  statusEl.textContent = isOpen ? '🟢 We\'re Open Now!' : '🔴 Currently Closed';
  statusEl.className = 'open-status ' + (isOpen ? 'open' : 'closed');
}
checkOpenStatus();

/* ===== NAVBAR OFFSET ON LOAD ===== */
(function adjustNavbar() {
  const banner = document.getElementById('topBanner');
  function reposition() {
    const bh = banner ? banner.offsetHeight : 0;
    navbar.style.top = bh + 'px';
  }
  reposition();
  window.addEventListener('resize', reposition);
  if (banner) {
    const observer = new MutationObserver(reposition);
    observer.observe(document.body, { childList: true });
  }
})();
