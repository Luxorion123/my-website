/* ============================================
   Luxorion — Shared Scripts
   ============================================ */

/* ── Mobile nav toggle ── */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.querySelector('i').className = isOpen ? 'fas fa-times' : 'fas fa-bars';
  });

  /* Close mobile nav when a link is clicked */
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.querySelector('i').className = 'fas fa-bars';
    });
  });
}

/* ── Scroll fade-in ── */
const fadeEls = document.querySelectorAll('.fade-in');

if ('IntersectionObserver' in window && fadeEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => observer.observe(el));
} else {
  /* Fallback for older browsers */
  fadeEls.forEach(el => el.classList.add('visible'));
}

/* ── Contact form submission ── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const feedback = document.getElementById('formFeedback');
    const submitBtn = this.querySelector('[type="submit"]');

    /* Simulate sending */
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

      /* Auto-hide feedback after 6 seconds */
      setTimeout(() => {
        if (feedback) feedback.style.display = 'none';
      }, 6000);
    }, 800);
  });
}

/* ── Gallery lightbox ── */
const overlay   = document.getElementById('lightboxOverlay');
const lightImg  = document.getElementById('lightboxImg');
const closeBtn  = document.getElementById('lightboxClose');

if (overlay && lightImg) {
  /* Open lightbox on gallery item click */
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img').src;
      const alt = item.querySelector('img').alt;
      lightImg.src = src;
      lightImg.alt = alt;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  /* Close lightbox */
  function closeLightbox() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}
