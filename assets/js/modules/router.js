import { getState, setState } from './state.js';
import { pages } from './pages.js';

const VALID_PAGES = [
  'home', 'projets', 'blog', 'tuto', 'ressources', 'competences',
  'contact', 'changelog', 'moi', 'collaborations',
  'cgu', 'confidentialite', 'cookies', 'mentions-legales',
];

const PAGE_TITLES = {
  home: 'Accueil', projets: 'Projets', blog: 'Blog', tuto: 'Tutos',
  ressources: 'Ressources', competences: 'Compétences', contact: 'Contact',
  changelog: 'Changelog', moi: 'À propos', collaborations: 'Collaborations',
  cgu: 'CGU', confidentialite: 'Politique de confidentialité',
  cookies: 'Politique des cookies', 'mentions-legales': 'Mentions légales',
};

// Cache simple en mémoire pour les pages statiques (hors auth)
const PAGE_CACHE = new Map();
const CACHEABLE_PAGES = new Set(['home', 'competences', 'ressources', 'changelog', 'moi', 'cgu', 'confidentialite', 'cookies', 'mentions-legales']);

function getPage() {
  const p = (new URLSearchParams(window.location.search).get('p') || 'home').toLowerCase();
  return VALID_PAGES.includes(p) ? p : '404';
}

function startProgressBar() {
  const bar = document.getElementById('nav-progress');
  if (!bar) return;
  clearTimeout(getState('progressTimer'));
  bar.style.transition = 'none';
  bar.style.width      = '0%';
  bar.style.opacity    = '1';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      bar.style.transition = 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      bar.style.width      = '70%';
    });
  });
}

function finishProgressBar() {
  const bar = document.getElementById('nav-progress');
  if (!bar) return;
  bar.style.transition = 'width 0.2s ease';
  bar.style.width      = '100%';
  setState('progressTimer', setTimeout(() => {
    bar.style.transition = 'opacity 0.3s ease';
    bar.style.opacity    = '0';
  }, 220));
}

async function navigate(page) {
  const app = document.getElementById('app');

  // Mise à jour des liens nav (aria-current + classe active)
  document.querySelectorAll('[data-page]').forEach(el => {
    const isActive = el.dataset.page === page;
    el.classList.toggle('active', isActive);
    if (el.tagName === 'A') {
      if (isActive) {
        el.setAttribute('aria-current', 'page');
      } else {
        el.removeAttribute('aria-current');
      }
    }
  });

  startProgressBar();

  const wrapper = document.createElement('div');
  wrapper.className = 'page';

  try {
    let html;
    if (CACHEABLE_PAGES.has(page) && PAGE_CACHE.has(page)) {
      html = PAGE_CACHE.get(page);
    } else {
      const render = pages[page];
      html = render ? await render() : pages['404']();
      if (CACHEABLE_PAGES.has(page)) PAGE_CACHE.set(page, html);
    }
    wrapper.innerHTML = html;
  } catch(err) {
    console.error('Page render error:', err);
    wrapper.innerHTML = pages['error'](err.message);
  }

  app.innerHTML = '';
  app.appendChild(wrapper);

  finishProgressBar();

  if (typeof window.__afterRender === 'function') window.__afterRender(page);

  document.title = `${PAGE_TITLES[page] || page} — Nathan The Coder`;
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function initNavigation() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[data-page]');
    if (!link) return;
    e.preventDefault();
    const p = link.dataset.page;
    const menu   = document.getElementById('navMenu');
    const burger = document.getElementById('navBurger');
    menu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');
    if (getPage() === p) return;
    window.history.pushState({}, '', `?p=${p}`);
    navigate(p);
  });

  const burger = document.getElementById('navBurger');
  const menu   = document.getElementById('navMenu');

  burger.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = menu.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  });

  // Fermer menu au clic extérieur
  document.addEventListener('click', e => {
    const nav = document.getElementById('nav');
    if (menu.classList.contains('open') && !nav.contains(e.target)) {
      menu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Ouvrir le menu');
    }
  });

  // Fermer menu à Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      menu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Ouvrir le menu');
      burger.focus();
    }
  });

  window.addEventListener('popstate', () => {
    const { checkModalParams } = window.__modals || {};
    navigate(getPage());
    if (checkModalParams) checkModalParams();
  });
}

export { getPage, navigate, initNavigation };
