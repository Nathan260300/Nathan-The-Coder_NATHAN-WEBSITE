import { formatDate } from './utils.js';

function buildCard(item, opts = {}) {
  const tag  = opts.tag  || '';
  const meta = opts.meta ?? formatDate(item.created_at);
  const id   = opts.click
    ? `data-id="${item.id}" tabindex="0" role="button" aria-label="${item.title || item.name || 'Voir les détails'}" style="cursor:pointer"`
    : '';

  return `
    <article class="card" ${id}>
      ${tag ? `<div class="card-tag">${tag}</div>` : ''}
      <h3>${item.title || item.name || ''}</h3>
      <p>${item.short_description || item.description || ''}</p>
      ${meta ? `
        <div class="card-meta">
          <span>${meta}</span>
          <span class="card-arrow" aria-hidden="true">→</span>
        </div>` : ''}
    </article>`;
}

function pageHero(content, fallback) {
  const title    = content?.title    || fallback.title;
  const subtitle = content?.subtitle || fallback.subtitle;
  return `
    <div class="page-hero">
      <div class="page-hero-label">${fallback.label}</div>
      <h1 class="page-title">${title}</h1>
      ${subtitle ? `<p class="page-subtitle">${subtitle}</p>` : ''}
    </div>`;
}

function buildErrorState(msg) {
  return `<div class="error-state"><i class="fas fa-circle-exclamation"></i> Erreur : ${msg}</div>`;
}

function buildEmptyState(msg = 'Aucun contenu pour le moment.') {
  return `<div class="empty-state"><div class="empty-state-icon">📭</div><p>${msg}</p></div>`;
}

export { buildCard, pageHero, buildErrorState, buildEmptyState };
