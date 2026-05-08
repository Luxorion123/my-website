/* ============================================
   Luxorion — Shared Scripts
   ============================================ */

/* ════════════════════════════
   PROMO BAR — rotating messages + dismiss
════════════════════════════ */
const promoMessages = [
  '<strong>Free Consultation</strong> — no obligation, no pressure. We reply within 24 hours. <a href="contact.html">Get in touch →</a>',
  '<strong>Limited Availability</strong> — we only take on 3 new projects per month. Enquire before it\'s too late. <a href="contact.html">Claim your spot →</a>',
  '<strong>Free Hosting Included</strong> — every new website build this month comes with 12 months free hosting. <a href="contact.html">Find out more →</a>',
  '<strong>Free Website Audit</strong> — already have a site? We\'ll review it for free and tell you exactly how to improve it. <a href="contact.html">Book yours →</a>',
];

const promoBar   = document.getElementById('promoBar');
const promoMsg   = document.getElementById('promoMsg');
const promoClose = document.getElementById('promoClose');

if (promoBar) {
  /* Hide if already dismissed this session */
  if (sessionStorage.getItem('promoDismissed')) {
    promoBar.style.display = 'none';
  }

  /* Rotate through messages */
  if (promoMsg) {
    let msgIndex = 0;

    function rotatePromo() {
      promoMsg.style.opacity = '0';
      setTimeout(() => {
        msgIndex = (msgIndex + 1) % promoMessages.length;
        promoMsg.innerHTML = promoMessages[msgIndex];
        promoMsg.style.opacity = '1';
      }, 400);
    }

    setInterval(rotatePromo, 5000);
  }

  /* Dismiss */
  if (promoClose) {
    promoClose.addEventListener('click', () => {
      promoBar.classList.add('promo-hide');
      setTimeout(() => { promoBar.style.display = 'none'; }, 320);
      sessionStorage.setItem('promoDismissed', '1');
    });
  }
}


/* ════════════════════════════
   MOBILE NAV TOGGLE
════════════════════════════ */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.querySelector('i').className = isOpen ? 'fas fa-times' : 'fas fa-bars';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.querySelector('i').className = 'fas fa-bars';
    });
  });
}


/* ════════════════════════════
   SCROLL ANIMATIONS
   Watches: .fade-in  .slide-left  .slide-right  .scale-in
════════════════════════════ */

/* Auto-stagger children inside .stagger-children grids */
document.querySelectorAll('.stagger-children').forEach(parent => {
  [...parent.children].forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.11}s`;
  });
});

/* IntersectionObserver for all animated elements */
const animatedEls = document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-in');

if ('IntersectionObserver' in window && animatedEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedEls.forEach(el => observer.observe(el));
} else {
  animatedEls.forEach(el => el.classList.add('visible'));
}


/* ════════════════════════════
   COUNT-UP ANIMATION
   Elements: <span class="stat-number" data-target="50">0</span>
════════════════════════════ */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start    = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

const counters = document.querySelectorAll('.stat-number[data-target]');

if (counters.length && 'IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));
}


/* ════════════════════════════
   CONTACT FORM
════════════════════════════ */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const feedback  = document.getElementById('formFeedback');
    const submitBtn = this.querySelector('[type="submit"]');

    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
      if (feedback) {
        feedback.style.display = 'block';
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      this.reset();
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;

      setTimeout(() => {
        if (feedback) feedback.style.display = 'none';
      }, 6000);
    }, 800);
  });
}


/* ════════════════════════════
   GALLERY LIGHTBOX
════════════════════════════ */
const overlay  = document.getElementById('lightboxOverlay');
const lightImg = document.getElementById('lightboxImg');
const closeBtn = document.getElementById('lightboxClose');

if (overlay && lightImg) {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      lightImg.src = item.querySelector('img').src;
      lightImg.alt = item.querySelector('img').alt;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}
