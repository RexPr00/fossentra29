(() => {
  const body = document.body;

  const langSwitchers = document.querySelectorAll('[data-lang-switcher]');
  langSwitchers.forEach((wrap) => {
    const btn = wrap.querySelector('[data-lang-btn]');
    btn?.addEventListener('click', () => {
      wrap.classList.toggle('open');
    });
  });

  document.addEventListener('click', (e) => {
    langSwitchers.forEach((wrap) => {
      if (!wrap.contains(e.target)) wrap.classList.remove('open');
    });
  });

  const drawer = document.querySelector('[data-drawer]');
  const backdrop = document.querySelector('[data-drawer-backdrop]');
  const burger = document.querySelector('[data-burger-open]');
  const closeDrawerBtn = document.querySelector('[data-burger-close]');
  let lastFocus = null;

  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled])';

  function trapFocus(e) {
    if (!drawer?.classList.contains('open') && !document.querySelector('.modal.open')) return;
    if (e.key !== 'Tab') return;
    const activeContainer = document.querySelector('.modal.open') || drawer;
    const focusable = [...activeContainer.querySelectorAll(focusableSelector)];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    backdrop?.classList.add('open');
    body.classList.add('menu-open');
    const first = drawer.querySelector(focusableSelector);
    first?.focus();
  }

  function closeDrawer() {
    drawer?.classList.remove('open');
    backdrop?.classList.remove('open');
    body.classList.remove('menu-open');
    lastFocus?.focus?.();
  }

  burger?.addEventListener('click', openDrawer);
  closeDrawerBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  const modal = document.querySelector('[data-modal]');
  const openModalBtns = document.querySelectorAll('[data-open-modal]');
  const closeModalBtn = document.querySelector('[data-close-modal]');

  function openModal() {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.classList.add('open');
    body.classList.add('modal-open');
    const first = modal.querySelector(focusableSelector);
    first?.focus();
  }

  function closeModal() {
    modal?.classList.remove('open');
    body.classList.remove('modal-open');
    lastFocus?.focus?.();
  }

  openModalBtns.forEach((btn) => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));
  closeModalBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeModal();
      langSwitchers.forEach((wrap) => wrap.classList.remove('open'));
    }
    trapFocus(e);
  });

  const faqItems = [...document.querySelectorAll('.faq-item')];
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-btn');
    const answer = item.querySelector('.faq-answer');
    btn?.addEventListener('click', () => {
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          const ans = other.querySelector('.faq-answer');
          if (ans) ans.style.maxHeight = null;
        }
      });
      item.classList.toggle('open');
      answer.style.maxHeight = item.classList.contains('open') ? `${answer.scrollHeight}px` : null;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('show');
      if (entry.target.matches('[data-counter]')) {
        const end = Number(entry.target.dataset.counter);
        let n = 0;
        const step = Math.ceil(end / 26);
        const tick = () => {
          n += step;
          if (n >= end) {
            entry.target.textContent = end.toLocaleString();
          } else {
            entry.target.textContent = n.toLocaleString();
            requestAnimationFrame(tick);
          }
        };
        tick();
      }
      if (entry.target.matches('.bar > span')) {
        entry.target.style.width = entry.target.dataset.width || '70%';
      }
      observer.unobserve(entry.target);
    });
  }, { threshold: .2 });

  document.querySelectorAll('.reveal, [data-counter], .bar > span').forEach((el) => observer.observe(el));
})();
