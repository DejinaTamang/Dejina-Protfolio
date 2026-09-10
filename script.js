const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- element refs ---------- */
const header = document.getElementById('siteHeader');
const progressFill = document.getElementById('progressFill');
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
const navLinks = [...document.querySelectorAll('#navLinks a')];
const sections = [...document.querySelectorAll('section[id]')];
const resumeButton = document.getElementById('resumeButton');
const resumeModal = document.getElementById('resumeModal');
const resumeClose = document.getElementById('resumeClose');
const yearEl = document.getElementById('year');
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- scroll progress + header state ---------- */
const updateScrollUI = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressFill.style.width = `${pct}%`;
  header.classList.toggle('is-scrolled', scrollTop > 8);
};
window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

/* ---------- mobile nav ---------- */
const closeMobileNav = () => {
  burger.classList.remove('is-open');
  mobileNav.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
};
burger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('is-open');
  burger.classList.toggle('is-open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
});
mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMobileNav));

/* ---------- smooth scroll for in-page links ---------- */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    closeMobileNav();
  });
});

/* ---------- scroll-spy active nav link ---------- */
const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${target.id}`);
      });
    });
  },
  { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
);
sections.forEach((section) => spyObserver.observe(section));

/* ---------- resume modal ---------- */
const openResume = () => {
  resumeModal.hidden = false;
  document.body.style.overflow = 'hidden';
  resumeClose.focus();
};
const closeResumeModal = () => {
  resumeModal.hidden = true;
  document.body.style.overflow = '';
  resumeButton.focus();
};
resumeButton.addEventListener('click', openResume);
resumeClose.addEventListener('click', closeResumeModal);
resumeModal.addEventListener('click', (event) => {
  if (event.target === resumeModal) closeResumeModal();
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !resumeModal.hidden) closeResumeModal();
});

/* ---------- role rotator ---------- */
const roleWords = [...document.querySelectorAll('.role-word')];
let roleIndex = 0;

const rotateRole = () => {
  const current = roleWords[roleIndex];
  const nextIndex = (roleIndex + 1) % roleWords.length;
  const next = roleWords[nextIndex];

  current.classList.remove('is-active');
  current.classList.add('is-leaving');
  next.classList.add('is-active');

  window.setTimeout(() => current.classList.remove('is-leaving'), 500);
  roleIndex = nextIndex;
};

if (roleWords.length && !prefersReducedMotion) {
  setInterval(rotateRole, 2400);
}

/* ---------- hero stat count-up (runs once, on load) ---------- */
const statEls = [...document.querySelectorAll('.stat-num')];
const animateCount = (el) => {
  const target = parseInt(el.dataset.count, 10) || 0;
  if (prefersReducedMotion) {
    el.textContent = target;
    return;
  }
  const duration = 900;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(progress * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
window.setTimeout(() => statEls.forEach(animateCount), 400);

/* ---------- scroll reveal ---------- */
const revealEls = [...document.querySelectorAll('.reveal-up, .reveal-line')];
if (prefersReducedMotion) {
  revealEls.forEach((el) => el.classList.add('in-view'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
}

/* ---------- contact form (front-end only) ---------- */
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formNote.textContent = 'Thanks for reaching out — I will get back to you soon.';
  contactForm.reset();
  window.setTimeout(() => { formNote.textContent = ''; }, 6000);
});
