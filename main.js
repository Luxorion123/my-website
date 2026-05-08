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
      } else {
        entry.target.classList.remove('visible');
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
        entry.target.textContent = '0';
        animateCounter(entry.target);
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
   MOLECULE CANVAS (Home hero)
════════════════════════════ */
const moleculeCanvas = document.getElementById('moleculeCanvas');
if (moleculeCanvas) {
  const ctx = moleculeCanvas.getContext('2d');
  const heroSection = moleculeCanvas.parentElement;
  const mouse = { x: -9999, y: -9999 };
  let particles = [];
  let W = 0, H = 0;
  const CONNECTION_DIST = 130;
  const MOUSE_ATTRACT_DIST = 160;
  const MOUSE_REPEL_DIST = 90;

  function resizeCanvas() {
    W = heroSection.offsetWidth;
    H = heroSection.offsetHeight;
    const dpr = window.devicePixelRatio || 1;
    moleculeCanvas.width = W * dpr;
    moleculeCanvas.height = H * dpr;
    moleculeCanvas.style.width = W + 'px';
    moleculeCanvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(Math.floor((W * H) / 12000), 85);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        r: Math.random() * 2 + 1.2
      });
    }
  }

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  heroSection.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    const hasMouseNearby = mouse.x > -1000;

    particles.forEach(p => {
      if (hasMouseNearby) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_REPEL_DIST && dist > 0) {
          const force = (MOUSE_REPEL_DIST - dist) / MOUSE_REPEL_DIST;
          p.vx -= (dx / dist) * force * 0.45;
          p.vy -= (dy / dist) * force * 0.45;
        }
      }

      p.vx = p.vx * 0.982 + (Math.random() - 0.5) * 0.025;
      p.vy = p.vy * 0.982 + (Math.random() - 0.5) * 0.025;

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = W;
      else if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      else if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECTION_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255,255,255,${(1 - d / CONNECTION_DIST) * 0.22})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    if (hasMouseNearby) {
      particles.forEach(p => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_ATTRACT_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(255,255,255,${(1 - d / MOUSE_ATTRACT_DIST) * 0.5})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      });

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fill();
    }

    requestAnimationFrame(drawFrame);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  drawFrame();
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
