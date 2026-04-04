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

  document.querySelectorAll('[data-page]').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  startProgressBar();
  app.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'page';

  try {
    const render = pages[page];
    wrapper.innerHTML = render ? await render() : pages['404']();
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
    document.getElementById('navMenu').classList.remove('open');
    document.getElementById('navBurger').classList.remove('open');
    if (getPage() === p) return;
    window.history.pushState({}, '', `?p=${p}`);
    navigate(p);
  });

  document.getElementById('navBurger').addEventListener('click', e => {
    e.stopPropagation();
    document.getElementById('navMenu').classList.toggle('open');
    document.getElementById('navBurger').classList.toggle('open');
  });

  document.addEventListener('click', e => {
    const nav  = document.getElementById('nav');
    const menu = document.getElementById('navMenu');
    if (menu.classList.contains('open') && !nav.contains(e.target)) {
      menu.classList.remove('open');
      document.getElementById('navBurger').classList.remove('open');
    }
  });

  window.addEventListener('popstate', () => {
    const { checkModalParams } = window.__modals || {};
    navigate(getPage());
    if (checkModalParams) checkModalParams();
  });
}

export { getPage, navigate, initNavigation };
