import { fetchTable, fetchPageContent, getDiscordUser, loginWithDiscord, logout, db } from './db.js';
import { getState } from './state.js';
import { formatDate, nl2br } from './utils.js';
import { buildCard, pageHero, buildErrorState, buildEmptyState } from './components.js';
import { navigate } from './router.js';

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
          <a href="?p=projets" data-page="projets" class="btn-primary"><i class="fas fa-folder-open"></i> Voir mes projets</a>
          <a href="?p=contact" data-page="contact" class="btn-secondary"><i class="fas fa-paper-plane"></i> Me contacter</a>
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
      <div class="stat-card"><div class="stat-value" id="stat-projects">—</div><div class="stat-label">Projets</div></div>
      <div class="stat-card"><div class="stat-value" id="stat-blog">—</div><div class="stat-label">Articles de blog</div></div>
      <div class="stat-card"><div class="stat-value" id="stat-tutos">—</div><div class="stat-label">Tutoriels</div></div>
      <div class="stat-card"><div class="stat-value">1+</div><div class="stat-label">Années d'XP</div></div>
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
      <div class="cards-grid" id="recent-projects">${projectCards}</div>
    </div>`;
}

async function renderProjets() {
  const [content, projects] = await Promise.allSettled([
    fetchPageContent('projets'),
    fetchTable('projects', { order: 'created_at' }),
  ]);
  const pc  = content.value;
  const data = projects.status === 'fulfilled' ? projects.value : [];
  const err  = projects.status === 'rejected'  ? projects.reason?.message : null;

  const cards = err
    ? buildErrorState(err)
    : data.length
      ? data.map(p => buildCard(p, { tag: '⚡ Projet', click: true })).join('')
      : buildEmptyState('Aucun projet pour le moment.');

  return `
    ${pageHero(pc, { label: 'Projets', title: 'Mes créations', subtitle: "Sites web, dashboards, outils et bots Discord — tout ce que j'ai construit." })}
    <div class="page-content">
      <div class="cards-grid" data-modal-type="project">${cards}</div>
    </div>`;
}

async function renderBlog() {
  const [content, allPosts] = await Promise.allSettled([
    fetchPageContent('blog'),
    fetchTable('blog', { order: 'created_at' }),
  ]);
  const pc = content.value;
  let posts = [], err = null;
  if (allPosts.status === 'fulfilled') {
    const now = new Date(); now.setHours(0, 0, 0, 0);
    posts = allPosts.value.filter(p => { const d = new Date(p.created_at); d.setHours(0,0,0,0); return d <= now; });
  } else { err = allPosts.reason?.message; }

  const cards = err
    ? buildErrorState(err)
    : posts.length
      ? posts.map(p => buildCard(p, { tag: '📝 Article', click: true })).join('')
      : buildEmptyState('Aucun article pour le moment.');

  return `
    ${pageHero(pc, { label: 'Blog', title: 'Articles & réflexions', subtitle: "Astuces web, retours d'expérience et réflexions sur le développement numérique." })}
    <div class="page-content">
      <div class="cards-grid" data-modal-type="blog">${cards}</div>
    </div>`;
}

async function renderTuto() {
  const [content, result] = await Promise.allSettled([
    fetchPageContent('tuto'),
    fetchTable('tutos', { order: 'created_at' }),
  ]);
  const pc  = content.value;
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
    fetchTable('ressources', { order: 'created_at' }),
  ]);
  const pc  = content.value;
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
    ${pageHero(pc, { label: 'Ressources', title: 'Outils & liens utiles', subtitle: "Ma sélection d'outils, sites, extensions et APIs pour le développement web." })}
    <div class="page-content">
      <div class="cards-grid">${cards}</div>
    </div>`;
}

async function renderChangelog() {
  const [content, result] = await Promise.allSettled([
    fetchPageContent('changelog'),
    fetchTable('changelog', { order: 'created_at' }),
  ]);
  const pc  = content.value;
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
    fetchTable('competences', { order: 'order_index', asc: true }),
  ]);
  const pc  = content.value;
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
              ${s.level != null ? `<div class="skill-bar-track"><div class="skill-bar-fill" style="--skill-w:${s.level}%"></div></div>` : ''}
              ${s.description ? `<p class="skill-desc">${s.description}</p>` : ''}
            </div>`).join('')}
        </div>
      </div>`).join('');
  }

  return `
    ${pageHero(pc, { label: 'Compétences', title: 'Mon savoir-faire', subtitle: "Langages, outils et technologies que je maîtrise ou que j'explore." })}
    <div class="page-content">
      <div class="competences-wrapper">${body}</div>
    </div>`;
}

async function renderMoi() {
  const [content, result] = await Promise.allSettled([
    fetchPageContent('moi'),
    fetchTable('about_cards', { order: 'order_index', asc: true }),
  ]);
  const pc  = content.value;
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
    fetchTable('collaborations', { order: 'created_at' }),
  ]);
  const pc  = content.value;
  const data = result.status === 'fulfilled' ? result.value : [];
  const err  = result.status === 'rejected'  ? result.reason?.message : null;

  const cards = err
    ? buildErrorState(err)
    : data.length
      ? data.map(c => {
          const collabs = c.collaborateurs || [];
          const avatars = collabs.map(col => `
            <div class="collab-person">
              ${col.avatar
                ? `<img src="${col.avatar}" alt="${col.nom}" class="collab-avatar" onerror="this.style.display='none'">`
                : `<div class="collab-avatar collab-avatar-fallback">${col.nom?.charAt(0)?.toUpperCase() || '?'}</div>`}
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
    ${pageHero(pc, { label: 'Collaborations', title: 'Mes collabs', subtitle: "Projets réalisés en collaboration avec d'autres développeurs et créateurs." })}
    <div class="page-content">
      <div class="cards-grid" data-modal-type="collaboration">${cards}</div>
    </div>`;
}

async function renderContact() {
  const content     = await fetchPageContent('contact');
  const currentUser = getState('currentUser');
  const user        = getDiscordUser();
  const viaEmail    = getState('loginProvider') === 'email';
  const viaDiscord  = !viaEmail;
  const isLoggedIn  = !!currentUser;

  const displayName = viaEmail
    ? currentUser?.email
    : (user?.username || 'Inconnu');
  const displayAvatar = viaDiscord && user?.avatar_url
    ? `<img src="${user.avatar_url}" class="comment-avatar" alt="${displayName}">`
    : `<div class="contact-badge-icon"><i class="${viaDiscord ? 'fab fa-discord' : 'fas fa-envelope'}"></i></div>`;
  const badgeLabel = viaDiscord ? 'Connecté via Discord' : 'Connecté via email';

  const formHtml = isLoggedIn ? `
    <div class="contact-form-card">
      <h3>📬 Envoyer un message</h3>
      <div class="contact-user-badge">
        ${displayAvatar}
        <div>
          <span class="comment-username">${displayName}</span>
          <p class="form-hint" style="margin-top:2px">${badgeLabel}</p>
        </div>
        <button class="comment-change-btn" id="contact-logout-btn" style="margin-left:auto">Déconnexion</button>
      </div>
      <div class="form-group">
        <label class="form-label" for="c-message">Message *</label>
        <textarea class="form-textarea" id="c-message" placeholder="Bonjour Nathan ! Je voulais te dire..." rows="5" required></textarea>
      </div>
      <button class="btn-submit" id="contact-submit"><i class="fas fa-paper-plane"></i> Envoyer</button>
      <div class="form-status" id="contact-status"></div>
    </div>` : `
    <div class="contact-form-card">
      <h3>📬 Envoyer un message</h3>
      <p class="contact-auth-intro">Identifie-toi pour m'envoyer un message. Je te répondrai via le moyen choisi.</p>
      <div class="contact-auth-choice">
        <button class="contact-auth-btn discord" id="contact-discord-login">
          <i class="fab fa-discord"></i>
          <span>
            <strong>Discord</strong>
            <small>Connexion via ton compte Discord</small>
          </span>
        </button>
        <div class="contact-auth-divider"><span>ou</span></div>
        <div class="contact-email-flow" id="contact-email-flow">
          <div id="contact-email-step">
            <div class="contact-email-input-row">
              <input class="form-input" type="email" id="contact-email-input" placeholder="ton@email.com">
              <button class="contact-auth-send-btn" id="contact-email-send">
                <i class="fas fa-paper-plane"></i> Envoyer le code
              </button>
            </div>
            <div class="contact-auth-error" id="contact-email-error"></div>
          </div>
          <div id="contact-otp-step" style="display:none">
            <p class="form-hint" id="contact-otp-hint"></p>
            <div class="contact-email-input-row">
              <input class="form-input contact-otp-input" type="text" id="contact-otp-input" placeholder="123456" maxlength="6" inputmode="numeric">
              <button class="contact-auth-send-btn" id="contact-otp-verify">
                <i class="fas fa-check"></i> Vérifier
              </button>
            </div>
            <button class="contact-otp-resend" id="contact-otp-resend">Renvoyer le code</button>
            <div class="contact-auth-error" id="contact-otp-error"></div>
          </div>
        </div>
      </div>
    </div>`;

  return `
    ${pageHero(content, { label: 'Contact', title: 'Écris-moi', subtitle: "Tu as une question, une idée de collab ou juste envie de discuter ? Je réponds vite." })}
    <div class="page-content">
      <div class="contact-layout">
        <div id="contact-form-area">${formHtml}</div>
        <div class="contact-sidebar">
          <div class="contact-info-card">
            <h4>Retrouve-moi aussi ici</h4>
            <a class="contact-link-item" href="https://github.com/nathan260300" target="_blank" rel="noopener"><i class="fab fa-github"></i> GitHub — nathan260300</a>
            <a class="contact-link-item" href="https://discord.gg/hvK9dhSKQF" target="_blank" rel="noopener"><i class="fab fa-discord"></i> Serveur Discord</a>
            <a class="contact-link-item" href="https://youtube.com/@nathan26060" target="_blank" rel="noopener"><i class="fab fa-youtube"></i> YouTube — @nathan26060</a>
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

const LEGAL_PAGES = {
  cgu: {
    title: "Conditions Générales d'Utilisation", icon: '📋',
    sections: [
      { title: '1. Objet', content: `Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du site nathan-the-coder.netlify.app (ci-après "le Site"), portfolio personnel de Nathan, développeur web et créateur de bots Discord.` },
      { title: '2. Accès au site', content: `Le Site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. Tous les frais liés à l'accès au Site (connexion, matériel) sont à la charge de l'utilisateur.` },
      { title: '3. Propriété intellectuelle', content: `Le code source du Site est publié sous licence GNU GPL v3. Les contenus (articles, tutoriels, projets) sont la propriété de Nathan. Toute reproduction est soumise à autorisation préalable, sauf mentions contraires.` },
      { title: '4. Commentaires et interactions', content: `Les utilisateurs peuvent laisser des commentaires et réagir aux articles via une connexion Discord OAuth. En publiant un commentaire, l'utilisateur s'engage à respecter les règles de bonne conduite et s'interdit tout contenu illicite, offensant ou spam. Les commentaires peuvent être modérés ou supprimés sans préavis.` },
      { title: '5. Responsabilité', content: `Nathan ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation du Site. Les informations publiées sont données à titre indicatif et peuvent évoluer sans préavis.` },
      { title: '6. Droit applicable', content: `Les présentes CGU sont soumises au droit français. Tout litige relatif à leur interprétation sera soumis aux tribunaux compétents français.` },
    ],
  },
  confidentialite: {
    title: 'Politique de Confidentialité', icon: '🔒',
    sections: [
      { title: '1. Responsable du traitement', content: `Nathan, développeur web indépendant, est responsable du traitement des données collectées via le Site nathan-the-coder.netlify.app.` },
      { title: '2. Données collectées', content: `Lors de la connexion via Discord OAuth, les données suivantes sont collectées et stockées : identifiant Discord, nom d'utilisateur Discord, avatar Discord. Ces données sont utilisées uniquement pour identifier l'auteur des commentaires et messages de contact.` },
      { title: '3. Finalités du traitement', content: `Les données sont collectées pour permettre l'identification des utilisateurs laissant des commentaires ou envoyant des messages de contact, et pour afficher le pseudo et l'avatar Discord associés aux contributions.` },
      { title: '4. Durée de conservation', content: `Les données sont conservées tant que le compte Discord utilisé est actif sur le Site. L'utilisateur peut demander la suppression de ses données via le formulaire de contact du Site.` },
      { title: '5. Partage des données', content: `Aucune donnée personnelle n'est vendue, louée ou transmise à des tiers. Les données sont hébergées chez Supabase (supabase.com) dont la politique de confidentialité est accessible sur leur site.` },
      { title: '6. Droits des utilisateurs', content: `Conformément au RGPD, tout utilisateur dispose d'un droit d'accès, de rectification, de suppression et de portabilité de ses données. Pour exercer ces droits, utilisez le formulaire de contact du Site ou envoyez un message via Discord.` },
    ],
  },
  cookies: {
    title: 'Politique des Cookies', icon: '🍪',
    sections: [
      { title: "Qu'est-ce qu'un cookie ?", content: `Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d'un site web. Il permet de mémoriser des informations entre les visites.` },
      { title: 'Cookies utilisés sur ce site', content: `Le Site utilise uniquement des cookies techniques strictement nécessaires à son fonctionnement. Aucun cookie publicitaire ou de tracking tiers n'est utilisé.` },
      { title: 'Cookie de session Supabase', content: `Lors de la connexion via Discord OAuth, un cookie de session est créé par Supabase pour maintenir votre connexion. Ce cookie est supprimé à la déconnexion ou à l'expiration de la session.` },
      { title: 'LocalStorage', content: `Le Site utilise le localStorage de votre navigateur pour mémoriser certaines préférences locales. Ces données ne sont pas transmises à des serveurs tiers.` },
      { title: 'Gestion des cookies', content: `Vous pouvez configurer votre navigateur pour refuser les cookies ou être alerté de leur dépôt. Notez que certaines fonctionnalités du Site (commentaires, contact) ne seront plus disponibles si vous refusez les cookies de session.` },
    ],
  },
  'mentions-legales': {
    title: 'Mentions Légales', icon: '⚖️',
    sections: [
      { title: 'Éditeur du site', content: `Le site nathan-the-coder.netlify.app est édité par Nathan, développeur web indépendant et créateur de bots Discord, agissant à titre personnel.` },
      { title: 'Hébergement', content: `Le Site est hébergé par Netlify, Inc. — 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis. Les données (commentaires, messages) sont stockées chez Supabase — 970 Toa Payoh North, #07-04, Singapour.` },
      { title: 'Propriété intellectuelle', content: `Le code source du Site est publié sous licence libre GNU GPL v3. Les contenus éditoriaux (articles, tutoriels, descriptions de projets) restent la propriété de Nathan sauf mention contraire. Toute reproduction sans autorisation est interdite.` },
      { title: 'Données personnelles', content: `Le traitement des données personnelles des utilisateurs est décrit dans la Politique de Confidentialité accessible depuis ce Site. Pour toute demande relative à vos données, utilisez le formulaire de contact.` },
      { title: 'Liens hypertextes', content: `Le Site peut contenir des liens vers des sites tiers. Nathan ne saurait être tenu responsable du contenu de ces sites externes et de l'usage qui pourrait être fait des informations qui y figurent.` },
      { title: 'Contact', content: `Pour toute question relative au fonctionnement du Site ou à vos données personnelles, vous pouvez contacter Nathan via le formulaire de contact du Site (par Discord ou email).` },
    ],
  },
};

function renderLegal(page) {
  const p = LEGAL_PAGES[page];
  if (!p) return render404();

  const otherPages = Object.entries(LEGAL_PAGES)
    .filter(([id]) => id !== page)
    .map(([id, data]) => `<a href="?p=${id}" data-page="${id}" class="legal-sibling-link">${data.title.split(' ')[0] === 'Conditions' ? 'CGU' : data.title.split(' ')[0]}</a>`);

  return `
    <div class="legal-page">
      <div class="legal-hero">
        <a href="?p=home" data-page="home" class="legal-back-btn"><i class="fas fa-arrow-left"></i> Retour</a>
        <div class="legal-hero-tag">${p.icon} Légal</div>
        <h1 class="legal-title">${p.title}</h1>
        <p class="legal-updated">Dernière mise à jour : mars 2026</p>
        <div class="legal-sibling-nav">${otherPages.join('')}</div>
      </div>
      <div class="legal-body">
        ${p.sections.map((s, i) => `
          <div class="legal-block">
            <div class="legal-block-num">${String(i + 1).padStart(2, '0')}</div>
            <div class="legal-block-content"><h3>${s.title}</h3><p>${s.content}</p></div>
          </div>`).join('')}
      </div>
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

const pages = {
  home:             renderHome,
  projets:          renderProjets,
  blog:             renderBlog,
  tuto:             renderTuto,
  ressources:       renderRessources,
  competences:      renderCompetences,
  contact:          renderContact,
  changelog:        renderChangelog,
  moi:              renderMoi,
  collaborations:   renderCollaborations,
  cgu:              () => renderLegal('cgu'),
  confidentialite:  () => renderLegal('confidentialite'),
  cookies:          () => renderLegal('cookies'),
  'mentions-legales': () => renderLegal('mentions-legales'),
  '404':            render404,
  error:            renderError,
};

export { pages, renderHome, renderContact };