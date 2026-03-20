console.log(`%c© 2026 - Nathan The Coder`, "background: #282c34; color: #98c379; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cNathan The Coder", "background: #282c34; color: #61afef; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cPortfolio de Nathan — Développeur web & bot Discord passionné.","background: #282c34; color: #61dafb; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%chttps://nathan-the-coder.netlify.app", "background: #282c34; color: #e06c75; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log(`%cMade with 🕑 and 💖 by Nathan`,"background: #282c34; color: #c678dd; padding: .5em 1em; border-radius: 5px; font-weight: bold;")

const SUPABASE_URL     = 'https://hscsixqyszamzayemyra.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mn40HNV14AbJmXA3veAqMQ_VdkOEPFd';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

const PAGES = ['home', 'projets', 'blog', 'tuto', 'ressources', 'competences', 'contact', 'changelog', 'moi', 'collaborations'];

function getPage() {
  const params = new URLSearchParams(window.location.search);
  const p = (params.get('p') || 'home').toLowerCase();
  return PAGES.includes(p) ? p : '404';
}

async function navigate(page) {
  const app     = document.getElementById('app');
  const loader  = document.getElementById('pageLoader');

  document.querySelectorAll('[data-page]').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  app.innerHTML = '';
  const loaderEl = document.createElement('div');
  loaderEl.className = 'page-loader';
  loaderEl.innerHTML = '<div class="loader-ring"></div>';
  app.appendChild(loaderEl);

  const wrapper = document.createElement('div');
  wrapper.className = 'page';

  try {
    switch (page) {
      case 'home':      wrapper.innerHTML = await renderHome();      break;
      case 'projets':   wrapper.innerHTML = await renderProjets();   break;
      case 'blog':      wrapper.innerHTML = await renderBlog();      break;
      case 'tuto':      wrapper.innerHTML = await renderTuto();      break;
      case 'ressources':   wrapper.innerHTML = await renderRessources();   break;
      case 'competences':  wrapper.innerHTML = await renderCompetences();  break;
      case 'contact':      wrapper.innerHTML = await renderContact();      break;
      case 'changelog':    wrapper.innerHTML = await renderChangelog();    break;
      case 'moi':          wrapper.innerHTML = await renderMoi();          break;
      case 'collaborations': wrapper.innerHTML = await renderCollaborations(); break;
      default:          wrapper.innerHTML = render404();
    }
  } catch (err) {
    console.error('Page render error:', err);
    wrapper.innerHTML = renderError(err.message);
  }

  app.innerHTML = '';
  app.appendChild(wrapper);

  afterRender(page);

  const titles = {
    home: 'Accueil', projets: 'Projets', blog: 'Blog', tuto: 'Tutos',
    ressources: 'Ressources', competences: 'Compétences', contact: 'Contact',
    changelog: 'Changelog', moi: 'À propos', collaborations: 'Collaborations'
  };
  document.title = `${titles[page] || page} — Nathan The Coder`;

  window.scrollTo({ top: 0, behavior: 'instant' });
}

async function fetchTable(table, opts = {}) {
  let query = db.from(table).select('*');
  if (opts.order)      query = query.order(opts.order, { ascending: opts.asc ?? false });
  if (opts.limit)      query = query.limit(opts.limit);
  if (opts.eq)         query = query.eq(opts.eq[0], opts.eq[1]);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function nl2br(str) {
  if (!str) return '';
  return str.replace(/\n/g, '<br>');
}

function buildCard(item, opts = {}) {
  const tag   = opts.tag   || '';
  const icon  = opts.icon  || '';
  const meta  = opts.meta  || formatDate(item.created_at);
  const click = opts.click ? `data-id="${item.id}"` : '';

  return `
    <article class="card" ${click} ${opts.click ? `style="cursor:pointer"` : ''}>
      ${tag ? `<div class="card-tag">${tag}</div>` : ''}
      <h3>${item.title || item.name || ''}</h3>
      <p>${item.short_description || item.description || ''}</p>
      ${meta ? `
        <div class="card-meta">
          <span>${meta}</span>
          <span class="card-arrow">→</span>
        </div>` : ''}
    </article>`;
}

async function fetchPageContent(page) {
  try {
    const { data } = await db.from('page_content').select('*').eq('page', page).single();
    return data || null;
  } catch(_) { return null; }
}

function pageHero(content, fallback) {
  const title    = content?.title    || fallback.title;
  const subtitle = content?.subtitle || fallback.subtitle;
  const label    = fallback.label;
  return `
    <div class="page-hero">
      <div class="page-hero-label">${label}</div>
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

async function renderHome() {
  let recentProjects = [];
  try { recentProjects = await fetchTable('projects', { order: 'created_at', limit: 3 }); } catch(_) {}

  const projectCards = recentProjects.length
    ? recentProjects.map(p => buildCard(p, { tag: '⚡ Projet', click: true })).join('')
    : buildEmptyState('Aucun projet récent.');

  return `
    <section class="home-hero">
      <div class="home-hero-content">
        <div class="home-greeting">
          <span class="home-greeting-status"></span>
          Disponible pour des collaborations
        </div>
        <h1 class="home-title">
          Développeur<br>
          <span class="line-accent">Web</span> &amp;<br>
          Discord.
        </h1>
        <p class="home-desc">
          Salut, moi c'est <strong>Nathan</strong>. Je crée des sites web modernes
          et des bots Discord en Node.js. Passionné de code, j'adore donner vie
          à des idées techniques.
        </p>
        <div class="home-cta">
          <a href="?p=projets" class="btn-primary"><i class="fas fa-folder-open"></i> Voir mes projets</a>
          <a href="?p=contact" class="btn-secondary"><i class="fas fa-paper-plane"></i> Me contacter</a>
        </div>
      </div>

      <div class="home-terminal">
        <div class="terminal">
          <div class="terminal-bar">
            <div class="terminal-dots">
              <span class="terminal-dot red"></span>
              <span class="terminal-dot yellow"></span>
              <span class="terminal-dot green"></span>
            </div>
            <span class="terminal-title" id="term-title">nathan@code: ~/home</span>
          </div>
          <pre class="terminal-body" id="term-body"></pre>
        </div>
      </div>
    </section>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value" id="stat-projects">—</div>
        <div class="stat-label">Projets</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" id="stat-blog">—</div>
        <div class="stat-label">Articles de blog</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" id="stat-tutos">—</div>
        <div class="stat-label">Tutoriels</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">1+</div>
        <div class="stat-label">Années d'XP</div>
      </div>
    </div>

    <div class="home-stack">
      <p class="stack-label">// Stack &amp; outils</p>
      <div class="stack-badges">
        <span class="badge"><i class="fab fa-html5" style="color:#e34f26"></i> HTML5</span>
        <span class="badge"><i class="fab fa-css3-alt" style="color:#2965f1"></i> CSS3</span>
        <span class="badge"><i class="fab fa-js" style="color:#f7df1e"></i> JavaScript</span>
        <span class="badge"><i class="fab fa-node-js" style="color:#339933"></i> Node.js</span>
        <span class="badge"><i class="fas fa-database" style="color:#3ecf8e"></i> Supabase</span>
        <span class="badge"><i class="fab fa-discord" style="color:#5865f2"></i> Discord.js</span>
        <span class="badge"><i class="fab fa-git-alt" style="color:#f05032"></i> Git</span>
        <span class="badge"><i class="fab fa-github"></i> GitHub</span>
        <span class="badge"><i class="fas fa-code" style="color:#007acc"></i> VS Code</span>
        <span class="badge"><i class="fab fa-apple"></i> macOS</span>
        <span class="badge"><i class="fab fa-linux"></i> Linux</span>
      </div>
    </div>

    <div class="home-recent">
      <div class="section-header">
        <h2 class="section-title">Projets récents</h2>
        <a href="?p=projets" class="section-link">Tous les projets →</a>
      </div>
      <div class="cards-grid" id="recent-projects">
        ${projectCards}
      </div>
    </div>`;
}

async function renderProjets() {
  const [content, projects] = await Promise.allSettled([
    fetchPageContent('projets'),
    fetchTable('projects', { order: 'created_at' })
  ]);
  const pc = content.value;
  const data = projects.status === 'fulfilled' ? projects.value : [];
  const err  = projects.status === 'rejected'  ? projects.reason?.message : null;

  const cards = err
    ? buildErrorState(err)
    : data.length
      ? data.map(p => buildCard(p, { tag: '⚡ Projet', click: true })).join('')
      : buildEmptyState('Aucun projet pour le moment.');

  return `
    ${pageHero(pc, { label: 'Projets', title: 'Mes créations', subtitle: 'Sites web, dashboards, outils et bots Discord — tout ce que j\'ai construit.' })}
    <div class="page-content">
      <div class="cards-grid" data-modal-type="project">${cards}</div>
    </div>`;
}

async function renderBlog() {
  const [content, allPosts] = await Promise.allSettled([
    fetchPageContent('blog'),
    fetchTable('blog', { order: 'created_at' })
  ]);
  const pc = content.value;
  let posts = [], err = null;
  if (allPosts.status === 'fulfilled') {
    const now = new Date(); now.setHours(0,0,0,0);
    posts = allPosts.value.filter(p => { const d = new Date(p.created_at); d.setHours(0,0,0,0); return d <= now; });
  } else { err = allPosts.reason?.message; }

  const cards = err
    ? buildErrorState(err)
    : posts.length
      ? posts.map(p => buildCard(p, { tag: '📝 Article', click: true })).join('')
      : buildEmptyState('Aucun article pour le moment.');

  return `
    ${pageHero(pc, { label: 'Blog', title: 'Articles & réflexions', subtitle: 'Astuces web, retours d\'expérience et réflexions sur le développement numérique.' })}
    <div class="page-content">
      <div class="cards-grid" data-modal-type="blog">${cards}</div>
    </div>`;
}

async function renderTuto() {
  const [content, result] = await Promise.allSettled([
    fetchPageContent('tuto'),
    fetchTable('tutos', { order: 'created_at' })
  ]);
  const pc   = content.value;
  const data = result.status === 'fulfilled' ? result.value : [];
  const err  = result.status === 'rejected'  ? result.reason?.message : null;

  const cards = err
    ? buildErrorState(err)
    : data.length
      ? data.map(t => buildCard(t, { tag: '🎓 Tuto', click: true })).join('')
      : buildEmptyState('Aucun tutoriel pour le moment.');

  return `
    ${pageHero(pc, { label: 'Tutoriels', title: 'Apprends avec moi', subtitle: 'Des tutoriels complets avec extraits de code et conseils pratiques.' })}
    <div class="page-content">
      <div class="cards-grid" data-modal-type="tuto">${cards}</div>
    </div>`;
}

async function renderRessources() {
  const [content, result] = await Promise.allSettled([
    fetchPageContent('ressources'),
    fetchTable('ressources', { order: 'created_at' })
  ]);
  const pc   = content.value;
  const data = result.status === 'fulfilled' ? result.value : [];
  const err  = result.status === 'rejected'  ? result.reason?.message : null;

  const cards = err
    ? buildErrorState(err)
    : data.length
      ? data.map(r => `
        <a class="card" ${r.link ? `href="${r.link}" target="_blank" rel="noopener"` : ''} style="text-decoration:none;display:block">
          <div class="card-tag">🔗 ${r.category || 'Ressource'}</div>
          <h3>${r.title || r.name || ''}</h3>
          <p>${r.short_description || r.description || ''}</p>
          ${r.link ? `<div class="card-meta"><span>${new URL(r.link).hostname}</span><span class="card-arrow">↗</span></div>` : ''}
        </a>`).join('')
      : buildEmptyState('Aucune ressource pour le moment.');

  return `
    ${pageHero(pc, { label: 'Ressources', title: 'Outils & liens utiles', subtitle: 'Ma sélection d\'outils, sites, extensions et APIs pour le développement web.' })}
    <div class="page-content">
      <div class="cards-grid">${cards}</div>
    </div>`;
}

async function renderContact() {
  const content = await fetchPageContent('contact');
  return `
    ${pageHero(content, { label: 'Contact', title: 'Écris-moi', subtitle: 'Tu as une question, une idée de collab ou juste envie de discuter ? Je réponds vite.' })}
    <div class="page-content">
      <div class="contact-layout">
        <div class="contact-form-card">
          <h3>📬 Envoyer un message</h3>
          <div class="form-group">
            <label class="form-label" for="c-name">Prénom / Pseudo *</label>
            <input class="form-input" type="text" id="c-name" placeholder="Nathan" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="c-discord">ID Discord *</label>
            <input class="form-input" type="text" id="c-discord" placeholder="nathan#0000 ou 123456789" required>
            <p class="form-hint">J'utiliserai ton ID Discord pour te répondre.</p>
          </div>
          <div class="form-group">
            <label class="form-label" for="c-message">Message *</label>
            <textarea class="form-textarea" id="c-message" placeholder="Bonjour Nathan ! Je voulais te dire..." rows="5" required></textarea>
          </div>
          <button class="btn-submit" id="contact-submit">
            <i class="fas fa-paper-plane"></i> Envoyer
          </button>
          <div class="form-status" id="contact-status"></div>
        </div>

        <div class="contact-sidebar">
          <div class="contact-info-card">
            <h4>Retrouve-moi aussi ici</h4>
            <a class="contact-link-item" href="https://github.com/nathan260300" target="_blank" rel="noopener">
              <i class="fab fa-github"></i> GitHub — nathan260300
            </a>
            <a class="contact-link-item" href="https://discord.gg/hvK9dhSKQF" target="_blank" rel="noopener">
              <i class="fab fa-discord"></i> Serveur Discord
            </a>
            <a class="contact-link-item" href="https://youtube.com/@nathan26060" target="_blank" rel="noopener">
              <i class="fab fa-youtube"></i> YouTube — @nathan26060
            </a>
          </div>
          <div class="contact-info-card">
            <h4>💡 Bon à savoir</h4>
            <p style="font-size:.85rem;color:var(--text-muted);line-height:1.65">
              Ton message est sauvegardé dans ma base de données.
              Je te contacte via Discord dès que possible.
              Pas de spam, promis !
            </p>
          </div>
        </div>
      </div>
    </div>`;
}

async function renderChangelog() {
  const [content, result] = await Promise.allSettled([
    fetchPageContent('changelog'),
    fetchTable('changelog', { order: 'created_at' })
  ]);
  const pc   = content.value;
  const data = result.status === 'fulfilled' ? result.value : [];
  const err  = result.status === 'rejected'  ? result.reason?.message : null;

  const items = err
    ? buildErrorState(err)
    : data.length
      ? data.map(e => `
        <div class="changelog-entry">
          <div class="changelog-version">${formatDate(e.created_at)}${e.version ? ' — v' + e.version : ''}</div>
          <div class="changelog-card">
            <div class="badge-type ${e.type || 'update'}">${e.type === 'feature' ? '✨ Nouveau' : e.type === 'fix' ? '🐛 Fix' : '🔄 Mise à jour'}</div>
            <h3>${e.title || ''}</h3>
            <p>${e.description || ''}</p>
          </div>
        </div>`).join('')
      : buildEmptyState('Aucun changelog pour le moment.');

  return `
    ${pageHero(pc, { label: 'Changelog', title: 'Historique des mises à jour', subtitle: 'Toutes les évolutions de mon portfolio et de mes projets.' })}
    <div class="page-content">
      <div class="changelog-timeline">${items}</div>
    </div>`;
}

async function renderCompetences() {
  const [content, result] = await Promise.allSettled([
    fetchPageContent('competences'),
    fetchTable('competences', { order: 'order_index', asc: true })
  ]);
  const pc   = content.value;
  const data = result.status === 'fulfilled' ? result.value : [];
  const err  = result.status === 'rejected'  ? result.reason?.message : null;

  let body = '';
  if (err) {
    body = buildErrorState(err);
  } else if (!data.length) {
    body = buildEmptyState('Aucune compétence renseignée pour le moment.');
  } else {
    const groups = {};
    data.forEach(skill => {
      const cat = skill.category || 'Autres';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(skill);
    });

    body = Object.entries(groups).map(([cat, skills]) => `
      <div class="skill-group">
        <h3 class="skill-group-title">${cat}</h3>
        <div class="skill-cards-row">
          ${skills.map(s => `
            <div class="skill-card">
              <div class="skill-card-top">
                ${s.icon ? `<span class="skill-icon">${s.icon}</span>` : ''}
                <span class="skill-name">${s.name}</span>
                ${s.level != null ? `<span class="skill-level-badge">${s.level}%</span>` : ''}
              </div>
              ${s.level != null ? `
                <div class="skill-bar-track">
                  <div class="skill-bar-fill" style="--skill-w:${s.level}%"></div>
                </div>` : ''}
              ${s.description ? `<p class="skill-desc">${s.description}</p>` : ''}
            </div>`).join('')}
        </div>
      </div>`).join('');
  }

  return `
    ${pageHero(pc, { label: 'Compétences', title: 'Mon savoir-faire', subtitle: 'Langages, outils et technologies que je maîtrise ou que j\'explore.' })}
    <div class="page-content">
      <div class="competences-wrapper">${body}</div>
    </div>`;
}

async function renderMoi() {
  const [content, result] = await Promise.allSettled([
    fetchPageContent('moi'),
    fetchTable('about_cards', { order: 'order_index', asc: true })
  ]);
  const pc   = content.value;
  const data = result.status === 'fulfilled' ? result.value : [];

  const cards = data.length
    ? data.map(c => `
        <div class="about-card ${c.wide ? 'wide' : ''}">
          ${c.icon ? `<div class="about-card-icon">${c.icon}</div>` : ''}
          <h3>${c.title || ''}</h3>
          <p>${c.content || ''}</p>
          ${c.chips ? `<div class="skill-chips">${c.chips.split(',').map(ch => `<span class="skill-chip">${ch.trim()}</span>`).join('')}</div>` : ''}
        </div>`).join('')
    : `
        <div class="about-card wide">
          <div class="about-card-icon">👨‍💻</div>
          <h3>Qui suis-je ?</h3>
          <p>Salut ! Je suis Nathan, développeur web et créateur de bots Discord. Je suis passionné par la création d'interfaces modernes, d'outils utiles et de bots qui automatisent l'expérience sur Discord. Je partage tout en open-source sous licence GNU GPL v3.</p>
        </div>
        <div class="about-card">
          <div class="about-card-icon">🛠️</div>
          <h3>Mon setup</h3>
          <p>IDE, environnements et outils au quotidien.</p>
          <div class="skill-chips">
            <span class="skill-chip">VS Code</span><span class="skill-chip">Windows 11</span>
            <span class="skill-chip">macOS</span><span class="skill-chip">Linux Mint</span>
            <span class="skill-chip">Git</span><span class="skill-chip">GitHub</span><span class="skill-chip">Supabase</span>
          </div>
        </div>
        <div class="about-card">
          <div class="about-card-icon">💡</div>
          <h3>Ma philosophie</h3>
          <p>Pour moi, coder c'est partager. Tout mon code est sous licence <strong style="color:var(--text)">GNU GPL v3</strong> : libre, modifiable et redistribuable.</p>
        </div>
        <div class="about-card">
          <div class="about-card-icon">🎮</div>
          <h3>En dehors du code</h3>
          <p>Musique, jeux vidéo, cybersécurité et Coca-Cola. C'est ça le carburant.</p>
          <div class="skill-chips">
            <span class="skill-chip">🎵 Musique</span><span class="skill-chip">🎮 Gaming</span>
            <span class="skill-chip">🔐 Cybersec</span><span class="skill-chip">🥤 Coca-Cola</span>
          </div>
        </div>`;

  return `
    ${pageHero(pc, { label: 'À propos', title: 'Moi, Nathan.', subtitle: 'Développeur web passionné, créateur de bots Discord et explorateur du code.' })}
    <div class="page-content">
      <div class="about-grid">${cards}</div>
    </div>`;
}

async function renderCollaborations() {
  const [content, result] = await Promise.allSettled([
    fetchPageContent('collaborations'),
    fetchTable('collaborations', { order: 'created_at' })
  ]);
  const pc   = content.value;
  const data = result.status === 'fulfilled' ? result.value : [];
  const err  = result.status === 'rejected'  ? result.reason?.message : null;

  const cards = err
    ? buildErrorState(err)
    : data.length
      ? data.map(c => {
          const collabs = (c.collaborateurs || []);
          const avatars = collabs.map(col => `
            <div class="collab-person">
              ${col.avatar ? `<img src="${col.avatar}" alt="${col.nom}" class="collab-avatar" onerror="this.style.display='none'">` : `<div class="collab-avatar collab-avatar-fallback">${col.nom?.charAt(0)?.toUpperCase() || '?'}</div>`}
              <span class="collab-name">${col.nom || ''}</span>
            </div>`).join('');
          return `
            <article class="card" data-id="${c.id}" style="cursor:pointer">
              <div class="card-tag">🤝 Collab</div>
              <h3>${c.title || ''}</h3>
              <p>${c.short_description || ''}</p>
              ${collabs.length ? `<div class="collab-persons">${avatars}</div>` : ''}
              <div class="card-meta">
                <span>${formatDate(c.created_at)}</span>
                <span class="card-arrow">→</span>
              </div>
            </article>`;
        }).join('')
      : buildEmptyState('Aucune collaboration pour le moment.');

  return `
    ${pageHero(pc, { label: 'Collaborations', title: 'Mes collabs', subtitle: 'Projets réalisés en collaboration avec d\'autres développeurs et créateurs.' })}
    <div class="page-content">
      <div class="cards-grid" data-modal-type="collaboration">${cards}</div>
    </div>`;
}

function render404() {
  return `
    <div class="page-404">
      <div class="page-404-code">404</div>
      <h2>Page introuvable</h2>
      <p>Cette page n'existe pas ou a été déplacée.</p>
      <a href="?p=home" class="btn-primary"><i class="fas fa-home"></i> Retour à l'accueil</a>
    </div>`;
}

function renderError(msg) {
  return `
    <div class="page-404">
      <div class="page-404-code" style="font-size:5rem">⚠️</div>
      <h2>Erreur de chargement</h2>
      <p>${msg || 'Une erreur inattendue est survenue.'}</p>
      <a href="?p=home" class="btn-primary"><i class="fas fa-home"></i> Retour à l'accueil</a>
    </div>`;
}

function afterRender(page) {
  if (page === 'home')           afterHome();
  if (page === 'projets')        attachCardModal('project');
  if (page === 'blog')           attachCardModal('blog');
  if (page === 'tuto')           attachCardModal('tuto');
  if (page === 'collaborations') attachCardModal('collaboration');
  if (page === 'contact')        attachContactForm();

  fetchFooterUpdate();
}

function afterHome() {
  const snippets = {
    js: {
      title: 'nathan@code: ~/about.js',
      body: `<span class="cmt">// Nathan The Coder</span>
<span class="kw">const</span> <span class="acc">dev</span> = {
  <span class="key">name</span>:     <span class="str">'Nathan'</span>,
  <span class="key">stack</span>:    [<span class="str">'HTML'</span>, <span class="str">'CSS'</span>, <span class="str">'JS'</span>, <span class="str">'Node.js'</span>],
  <span class="key">bot</span>:      <span class="str">'Discord.js'</span>,
  <span class="key">db</span>:       <span class="str">'Supabase'</span>,
  <span class="key">hobbies</span>: [<span class="str">'code'</span>, <span class="str">'music'</span>, <span class="str">'gaming'</span>],
  <span class="key">fuel</span>:     <span class="str">'Coca-Cola 🥤'</span>
};

<span class="fn">console</span>.<span class="fn">log</span>(<span class="str">\`Bienvenue sur mon portfolio !\`</span>);`
    },
    ts: {
      title: 'nathan@code: ~/bot.ts',
      body: `<span class="cmt">// Mon bot Discord</span>
<span class="kw">import</span> { Client, GatewayIntentBits } <span class="kw">from</span> <span class="str">'discord.js'</span>;

<span class="kw">const</span> <span class="acc">client</span> = <span class="kw">new</span> <span class="fn">Client</span>({
  <span class="key">intents</span>: [
    GatewayIntentBits.<span class="acc">Guilds</span>,
    GatewayIntentBits.<span class="acc">GuildMessages</span>
  ]
});

client.<span class="fn">on</span>(<span class="str">'ready'</span>, () => {
  <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">\`Bot en ligne ✅\`</span>);
});`
    },
    css: {
      title: 'nathan@code: ~/style.css',
      body: `<span class="cmt">/* Design premium 🎨 */</span>
<span class="fn">:root</span> {
  <span class="key">--accent</span>:  <span class="str">#00d4ff</span>;
  <span class="key">--bg</span>:      <span class="str">#080b10</span>;
  <span class="key">--font</span>:    <span class="str">'Syne', sans-serif</span>;
}

<span class="fn">.card</span> {
  <span class="key">background</span>: <span class="fn">rgba</span>(<span class="num">255,255,255</span>, <span class="num">0.035</span>);
  <span class="key">border</span>:     <span class="num">1px</span> <span class="str">solid</span> <span class="fn">rgba</span>(<span class="num">255,255,255</span>, <span class="num">0.08</span>);
  <span class="key">transition</span>: <span class="str">all 0.22s ease</span>;
}

<span class="fn">.card:hover</span> {
  <span class="key">transform</span>: <span class="fn">translateY</span>(<span class="num">-3px</span>);
}`
    }
  };

  const keys  = Object.keys(snippets);
  const pick  = keys[Math.floor(Math.random() * keys.length)];
  const snip  = snippets[pick];

  const titleEl = document.getElementById('term-title');
  const bodyEl  = document.getElementById('term-body');
  if (titleEl) titleEl.textContent = snip.title;
  if (bodyEl)  bodyEl.innerHTML    = snip.body;

  (async () => {
    try {
      const [p, b, t] = await Promise.all([
        db.from('projects').select('id', { count: 'exact', head: true }),
        db.from('blog').select('id', { count: 'exact', head: true }),
        db.from('tutos').select('id', { count: 'exact', head: true }),
      ]);
      const set = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val ?? '0'; };
      set('stat-projects', p.count);
      set('stat-blog',     b.count);
      set('stat-tutos',    t.count);
    } catch(_) {}
  })();

  document.querySelectorAll('#recent-projects .card[data-id]').forEach(card => {
    card.addEventListener('click', () => openProjectModal(card.dataset.id));
  });
}

function openModal(html) {
  const modal = document.getElementById('modal');
  document.getElementById('modalContent').innerHTML = html;
  modal.classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  const params = new URLSearchParams(window.location.search);
  const hasModal = params.has('projet') || params.has('blog') || params.has('tuto') || params.has('collab');
  if (hasModal) {
    params.delete('projet');
    params.delete('blog');
    params.delete('tuto');
    params.delete('collab');
    const newUrl = '?' + params.toString();
    window.history.pushState({}, '', newUrl);
  }
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalBackdrop').addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

async function openProjectModal(id, pushState = true) {
  const { data, error } = await db.from('projects').select('*').eq('id', id).single();
  if (error || !data) {
    openModal(`
      <div class="modal-tag">⚡ Projet</div>
      <h2 style="color:var(--text-muted)">Projet introuvable</h2>
      <p>Ce projet n'existe pas ou a été supprimé.</p>
    `);
    return;
  }
  if (pushState) {
    const params = new URLSearchParams(window.location.search);
    params.set('projet', id);
    window.history.pushState({}, '', '?' + params.toString());
  }
  const imgs = [data.image1_path, data.image2_path].filter(Boolean);
  openModal(`
    <div class="modal-tag">⚡ Projet</div>
    <h2>${data.title}</h2>
    ${imgs.length ? `<div class="modal-images">${imgs.map(s => `<img src="${s}" alt="">`).join('')}</div>` : ''}
    <div style="margin-top:${imgs.length?'0':'8px'}">${nl2br(data.full_description || data.short_description || '')}</div>
    ${data.link ? `<a class="modal-link" href="${data.link}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Voir le projet</a>` : ''}
  `);
}

async function openBlogModal(id, table, pushState = true) {
  const { data, error } = await db.from(table).select('*').eq('id', id).single();
  if (error || !data) {
    const label = table === 'blog' ? '📝 Article' : '🎓 Tutoriel';
    const labelText = table === 'blog' ? 'article' : 'tutoriel';
    openModal(`
      <div class="modal-tag">${label}</div>
      <h2 style="color:var(--text-muted)">${labelText.charAt(0).toUpperCase() + labelText.slice(1)} introuvable</h2>
      <p>Cet ${labelText} n'existe pas ou a été supprimé.</p>
    `);
    return;
  }
  if (pushState) {
    const params = new URLSearchParams(window.location.search);
    const paramKey = table === 'blog' ? 'blog' : 'tuto';
    params.set(paramKey, id);
    window.history.pushState({}, '', '?' + params.toString());
  }
  const label = table === 'blog' ? '📝 Article' : '🎓 Tutoriel';
  const imgs = [data.image1_path, data.image2_path].filter(Boolean);
  openModal(`
    <div class="modal-tag">${label}</div>
    <h2>${data.title}</h2>
    <p style="font-size:.8rem;color:var(--text-dim);font-family:var(--font-code);margin-bottom:16px">${formatDate(data.created_at)}</p>
    ${imgs.length ? `<div class="modal-images">${imgs.map(s => `<img src="${s}" alt="">`).join('')}</div>` : ''}
    <div>${nl2br(data.full_description || data.short_description || '')}</div>
  `);
}

function attachCardModal(type) {
  const tableMap = { project: 'projects', blog: 'blog', tuto: 'tutos' };
  const table = tableMap[type];
  document.querySelectorAll(`.cards-grid[data-modal-type="${type}"] .card[data-id]`).forEach(card => {
    card.addEventListener('click', () => {
      if (type === 'project')     openProjectModal(card.dataset.id);
      else if (type === 'collaboration') openCollabModal(card.dataset.id);
      else openBlogModal(card.dataset.id, table);
    });
  });
}

async function openCollabModal(id, pushState = true) {
  const { data, error } = await db.from('collaborations').select('*').eq('id', id).single();
  if (error || !data) {
    openModal(`
      <div class="modal-tag">🤝 Collab</div>
      <h2 style="color:var(--text-muted)">Collaboration introuvable</h2>
      <p>Cette collaboration n'existe pas ou a été supprimée.</p>
    `);
    return;
  }
  if (pushState) {
    const params = new URLSearchParams(window.location.search);
    params.set('collab', id);
    window.history.pushState({}, '', '?' + params.toString());
  }
  const imgs = [data.image1_path, data.image2_path].filter(Boolean);
  const collabs = (data.collaborateurs || []);
  const avatarsHtml = collabs.length ? `
    <div class="collab-persons modal-collabs">
      ${collabs.map(col => `
        <div class="collab-person">
          ${col.avatar ? `<img src="${col.avatar}" alt="${col.nom}" class="collab-avatar" onerror="this.style.display='none'">` : `<div class="collab-avatar collab-avatar-fallback">${col.nom?.charAt(0)?.toUpperCase() || '?'}</div>`}
          <div class="collab-person-info">
            <span class="collab-name">${col.nom || ''}</span>
            ${col.github ? `<a href="${col.github}" target="_blank" rel="noopener" class="collab-link"><i class="fab fa-github"></i></a>` : ''}
            ${col.discord ? `<span class="collab-discord"><i class="fab fa-discord"></i> ${col.discord}</span>` : ''}
          </div>
        </div>`).join('')}
    </div>` : '';

  openModal(`
    <div class="modal-tag">🤝 Collab</div>
    <h2>${data.title}</h2>
    ${avatarsHtml}
    ${imgs.length ? `<div class="modal-images">${imgs.map(s => `<img src="${s}" alt="">`).join('')}</div>` : ''}
    <div style="margin-top:8px">${nl2br(data.full_description || data.short_description || '')}</div>
    ${data.link ? `<a class="modal-link" href="${data.link}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Voir le projet</a>` : ''}
  `);
}

function attachContactForm() {
  const btn    = document.getElementById('contact-submit');
  const status = document.getElementById('contact-status');

  if (!btn) return;

  btn.addEventListener('click', async () => {
    const name    = document.getElementById('c-name')?.value.trim();
    const discord = document.getElementById('c-discord')?.value.trim();
    const message = document.getElementById('c-message')?.value.trim();

    if (!name || !discord || !message) {
      showStatus('error', '⚠️ Tous les champs marqués * sont obligatoires.');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi…';

    try {
      const { error } = await db.from('contact_messages').insert([{
        name,
        discord_id: discord,
        message,
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;

      showStatus('success', '✅ Message envoyé ! Je te contacte bientôt sur Discord.');
      document.getElementById('c-name').value    = '';
      document.getElementById('c-discord').value = '';
      document.getElementById('c-message').value = '';

    } catch(e) {
      showStatus('error', `❌ Erreur : ${e.message}`);
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer';
    }

    function showStatus(type, msg) {
      status.className = `form-status ${type}`;
      status.textContent = msg;
    }
  });
}

async function fetchFooterUpdate() {
  try {
    const { data } = await db.from('changelog').select('created_at').order('created_at', { ascending: false }).limit(1).single();
    if (data?.created_at) {
      const el = document.getElementById('footer-update');
      if (el) el.textContent = `Dernière MAJ : ${formatDate(data.created_at)}`;
    }
  } catch(_) {}
}

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
  const nav = document.getElementById('nav');
  const menu = document.getElementById('navMenu');
  if (menu.classList.contains('open') && !nav.contains(e.target)) {
    menu.classList.remove('open');
    document.getElementById('navBurger').classList.remove('open');
  }
});

window.addEventListener('popstate', () => {
  navigate(getPage());
  checkModalParams();
});

async function checkModalParams() {
  const params = new URLSearchParams(window.location.search);
  const projetId = params.get('projet');
  const blogId   = params.get('blog');
  const tutoId   = params.get('tuto');
  const collabId = params.get('collab');
  if (projetId)      await openProjectModal(projetId, false);
  else if (blogId)   await openBlogModal(blogId, 'blog', false);
  else if (tutoId)   await openBlogModal(tutoId, 'tutos', false);
  else if (collabId) await openCollabModal(collabId, false);
}

navigate(getPage()).then(() => checkModalParams());