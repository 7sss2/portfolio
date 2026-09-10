document.addEventListener('DOMContentLoaded', () => {

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu toggle
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const navLinks = nav ? Array.from(nav.querySelectorAll('.nav__link')) : [];

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.addEventListener('click', (e) => {
    if (!nav || !burger) return;
    if (!nav.contains(e.target) && !burger.contains(e.target)) {
      nav.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll('.section, .card, .skills__item, .work-card');

  revealTargets.forEach(el => {
    el.classList.add('reveal');
    if (reducedMotion) {
      el.classList.add('is-visible');
    }
  });

  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Work detail modal (independent of reduced-motion animation gate below)
  const workModal = document.getElementById('workModal');
  const modalContent = document.getElementById('modalContent');
  const workCards = Array.from(document.querySelectorAll('.work-card'));

  if (workModal && modalContent && workCards.length) {
    let lastFocused = null;

    const openModal = (key) => {
      const template = document.getElementById(`work-${key}`);
      if (!template) return;
      modalContent.innerHTML = '';
      modalContent.appendChild(template.content.cloneNode(true));
      lastFocused = document.activeElement;
      workModal.hidden = false;
      document.body.classList.add('modal-open');
      workModal.querySelector('.modal__close').focus();
    };

    const closeModal = () => {
      workModal.hidden = true;
      document.body.classList.remove('modal-open');
      if (lastFocused) lastFocused.focus();
    };

    workCards.forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.work));
    });

    workModal.querySelectorAll('[data-modal-close]').forEach(el => {
      el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !workModal.hidden) closeModal();
    });
  }

  if (reducedMotion) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => observer.observe(el));

  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('nav__link--active', href === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-35% 0px -45% 0px', threshold: 0.2 });

  sections.forEach(section => sectionObserver.observe(section));
});
