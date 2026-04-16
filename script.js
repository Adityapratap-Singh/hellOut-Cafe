// ===== PAGE LOADER =====
const loaderStart = Date.now();
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;
  // Ensure loader shows for at least 700ms so the animation is satisfying
  const elapsed = Date.now() - loaderStart;
  const delay = Math.max(0, 700 - elapsed);
  setTimeout(() => loader.classList.add('hidden'), delay);
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    // Only remove 'scrolled' on pages where navbar starts transparent
    if (!document.body.querySelector('.menu-hero, .page-hero')) {
      navbar.classList.remove('scrolled');
    }
  }
});

// Always keep scrolled on menu/about/contact pages
if (document.querySelector('.menu-hero, .page-hero')) {
  navbar.classList.add('scrolled');
}

// ===== MOBILE NAV TOGGLE =====
function toggleNav() {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
}

// Close nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close nav on outside click
document.addEventListener('click', (e) => {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  if (navLinks.classList.contains('open') && 
      !navLinks.contains(e.target) && 
      !hamburger.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ===== SCROLL REVEAL ANIMATION =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // animate once
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// ===== MENU FILTER =====
function scrollActiveFilterToCenter(btn) {
  const strip = document.getElementById('menuFilter');
  if (!strip || !btn) return;
  // Scroll so the button is centered in the scrollable strip
  const stripRect = strip.getBoundingClientRect();
  const btnRect   = btn.getBoundingClientRect();
  const offset    = (btn.offsetLeft + btnRect.width / 2) - stripRect.width / 2;
  strip.scrollTo({ left: offset, behavior: 'smooth' });
}

function filterMenu(category, btn) {
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Scroll active button to center of the strip
  scrollActiveFilterToCenter(btn);

  const categories = document.querySelectorAll('.menu-category');

  categories.forEach(cat => {
    if (category === 'all' || cat.dataset.category === category) {
      cat.style.display = 'block';
      // re-trigger animations
      cat.querySelectorAll('.reveal').forEach(el => {
        el.classList.remove('visible');
        setTimeout(() => revealObserver.observe(el), 50);
      });
    } else {
      cat.style.display = 'none';
    }
  });

  // Scroll to the first visible category smoothly
  if (category !== 'all') {
    const target = document.getElementById(category);
    if (target) {
      setTimeout(() => {
        const filterHeight = document.querySelector('.menu-filter-wrap')?.offsetHeight || 60;
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - filterHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 100);
    }
  }
}

// ===== CONTACT FORM =====
function submitForm(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (!btn || !form || !success) return;

  btn.textContent = '⏳ Sending...';
  btn.disabled = true;

  // Simulate form submission
  setTimeout(() => {
    form.style.display = 'none';
    success.style.display = 'block';
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 1500);
}

// ===== SMOOTH ANCHOR SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 160; // nav + filter height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== PAGE TRANSITION =====
function navigateTo(url) {
  const transition = document.getElementById('pageTransition');
  if (!transition) { window.location.href = url; return; }
  transition.style.transition = 'transform 0.45s cubic-bezier(0.77,0,0.175,1)';
  transition.style.transform = 'scaleY(1)';
  transition.style.transformOrigin = 'bottom';
  setTimeout(() => { window.location.href = url; }, 450);
}

// Intercept internal page links for transition
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http') || href === 'javascript:void(0)') {
    return;
  }
  link.addEventListener('click', function(e) {
    const isInternal = !this.hasAttribute('target') || this.getAttribute('target') !== '_blank';
    if (isInternal && href.endsWith('.html')) {
      e.preventDefault();
      navigateTo(href);
    }
  });
});

// Reveal on page load after transition
window.addEventListener('load', () => {
  const transition = document.getElementById('pageTransition');
  if (transition) {
    transition.style.transition = 'none';
    transition.style.transform = 'scaleY(0)';
    transition.style.transformOrigin = 'top';
  }
});

// ===== PARTICLE / FIRE EFFECT ON HERO =====
function createFireParticle() {
  const heroParticles = document.querySelector('.hero-particles');
  if (!heroParticles) return;
  
  const particle = document.createElement('div');
  particle.style.cssText = `
    position: absolute;
    bottom: 0;
    left: ${Math.random() * 100}%;
    width: ${Math.random() * 6 + 3}px;
    height: ${Math.random() * 6 + 3}px;
    border-radius: 50%;
    background: radial-gradient(circle, #FFA500, #FF6B00, transparent);
    pointer-events: none;
    animation: particleRise ${Math.random() * 3 + 2}s ease-out forwards;
    opacity: ${Math.random() * 0.7 + 0.3};
  `;
  heroParticles.appendChild(particle);
  setTimeout(() => particle.remove(), 5000);
}

// Add particle rise animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
  @keyframes particleRise {
    0% { transform: translateY(0) scale(1); opacity: 0.8; }
    100% { transform: translateY(-200px) translateX(${Math.random() * 60 - 30}px) scale(0); opacity: 0; }
  }
`;
document.head.appendChild(particleStyle);

// Create particles periodically on hero page only
if (document.querySelector('.hero')) {
  setInterval(createFireParticle, 300);
}

// ===== STATS COUNTER ANIMATION =====
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const increment = target / 60;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 25);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numEl = entry.target.querySelector('.stat-num');
      if (numEl) {
        const text = numEl.textContent;
        const num = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/[0-9]/g, '');
        if (num) animateCounter(numEl, num, suffix);
      }
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(el => statsObserver.observe(el));

// ===== ACTIVE NAV LINK HIGHLIGHT ON SCROLL (Home page) =====
// Highlight based on current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const linkPage = link.getAttribute('href').split('/').pop().split('#')[0];
  if (linkPage === currentPage) {
    link.classList.add('active');
  }
});
