// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Header shrink on scroll =====
const header = document.getElementById('site-header');
const onScroll = () => {
  if (window.scrollY > 20) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== Mobile menu toggle =====
const menuToggle = document.getElementById('menu-toggle');
const primaryNav = document.getElementById('primary-nav');

function closeMenu() {
  menuToggle.classList.remove('open');
  primaryNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

menuToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

primaryNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ===== Animated stat counters =====
const statNums = document.querySelectorAll('.stat-num');
let statsAnimated = false;

function animateStats() {
  if (statsAnimated) return;
  statsAnimated = true;
  statNums.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(tick);
  });
}

const statsSection = document.getElementById('stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });
  statsObserver.observe(statsSection);
}

// ===== Gallery lightbox =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
}

if (lightbox) {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// ===== FAQ accordion =====
document.querySelectorAll('.acc-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.parentElement;
    const panel = item.querySelector('.acc-panel');
    const isOpen = item.classList.contains('open');

    // close all others
    document.querySelectorAll('.acc-item.open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
        openItem.querySelector('.acc-panel').style.maxHeight = null;
      }
    });

    if (isOpen) {
      item.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      panel.style.maxHeight = null;
    } else {
      item.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });
});

// ===== Contact form validation (client-side only, no backend wired up) =====
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('.form-row').forEach(row => row.classList.remove('invalid'));

    const name = form.querySelector('#name');
    const phone = form.querySelector('#phone');

    if (!name.value.trim()) {
      name.closest('.form-row').classList.add('invalid');
      valid = false;
    }

    const phonePattern = /^[\d\s\-\(\)\+]{7,}$/;
    if (!phonePattern.test(phone.value.trim())) {
      phone.closest('.form-row').classList.add('invalid');
      valid = false;
    }

    if (!valid) {
      successMsg.classList.remove('show');
      return;
    }

    // No backend is connected yet — this simply confirms receipt in the UI.
    // Hook this up to Formspree, Netlify Forms, or your own endpoint to
    // actually deliver submissions to thebeaverstreeservices@gmail.com.
    successMsg.classList.add('show');
    form.reset();
  });
}
