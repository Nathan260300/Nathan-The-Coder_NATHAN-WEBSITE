import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useModal } from '../hooks/useModal';
import { useProjects } from '../hooks/useProjects';
import { usePageData } from '../hooks/usePageData';
import { useStats } from '../hooks/useStats';
import { useReadyAnimate } from '../hooks/useReadyAnimate';
import { Card } from '../components/ui';
import { ProjectModal, BlogModal, CollabModal } from '../components/ui/Modals';
import { useDeepLink } from '../hooks/useDeepLink.jsx';
import { fadeUp, staggerContainer, cardVariant, scaleIn } from '../lib/motion';
import { formatDate } from '../lib/utils';

const SNIPPETS = {
  js: {
    title: 'nathan@code: ~/about.js',
    body: `<span class="cmt">// Nathan The Coder</span>\n<span class="kw">const</span> <span class="acc">dev</span> = {\n  <span class="key">name</span>:     <span class="str">'Nathan'</span>,\n  <span class="key">stack</span>:    [<span class="str">'HTML'</span>, <span class="str">'CSS'</span>, <span class="str">'JS'</span>, <span class="str">'Node.js'</span>],\n  <span class="key">bot</span>:      <span class="str">'Discord.js'</span>,\n  <span class="key">db</span>:       <span class="str">'Supabase'</span>,\n  <span class="key">fuel</span>:     <span class="str">'Coca-Cola \u{1F964}'</span>\n};\n<span class="fn">console</span>.<span class="fn">log</span>(\`Bienvenue !\`);`,
  },
  ts: {
    title: 'nathan@code: ~/bot.ts',
    body: `<span class="cmt">// Mon bot Discord</span>\n<span class="kw">import</span> { Client, GatewayIntentBits } <span class="kw">from</span> <span class="str">'discord.js'</span>;\n<span class="kw">const</span> <span class="acc">client</span> = <span class="kw">new</span> <span class="fn">Client</span>({\n  <span class="key">intents</span>: [GatewayIntentBits.<span class="acc">Guilds</span>]\n});\nclient.<span class="fn">on</span>(<span class="str">'ready'</span>, () => {\n  <span class="fn">console</span>.<span class="fn">log</span>(\`Bot en ligne \u2705\`);\n});`,
  },
  css: {
    title: 'nathan@code: ~/style.css',
    body: `<span class="cmt">/* Design premium \u{1F3A8} */</span>\n<span class="fn">:root</span> {\n  <span class="key">--accent</span>:  <span class="str">#00d4ff</span>;\n  <span class="key">--bg</span>:      <span class="str">#080b10</span>;\n}\n<span class="fn">.card:hover</span> {\n  <span class="key">transform</span>: <span class="fn">translateY</span>(<span class="num">-3px</span>);\n}`,
  },
};

const STACK = [
  ['fab fa-html5',    '#e34f26', 'HTML5'],
  ['fab fa-css3-alt', '#2965f1', 'CSS3'],
  ['fab fa-js',       '#f7df1e', 'JavaScript'],
  ['fab fa-node-js',  '#339933', 'Node.js'],
  ['fas fa-database', '#3ecf8e', 'Supabase'],
  ['fab fa-discord',  '#5865f2', 'Discord.js'],
  ['fab fa-git-alt',  '#f05032', 'Git'],
  ['fab fa-github',   null,      'GitHub'],
  ['fas fa-code',     '#007acc', 'VS Code'],
  ['fab fa-apple',    null,      'macOS'],
  ['fab fa-linux',    null,      'Linux'],
  ['fab fa-react',    '#61dafb', 'React'],
  ['fas fa-bolt',     '#646cff', 'Vite'],
];

const ROLES = ['développeur full-stack.', 'développeur web & Discord.', 'passionné de ce que je construis.'];

function useTypewriter(words, speed = 65, pause = 1800) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout;

    if (!deleting && charIdx <= current.length) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIdx));
        setCharIdx(c => c + 1);
      }, speed);
    } else if (!deleting && charIdx > current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => {
        setDisplay(current.slice(0, charIdx - 1));
        setCharIdx(c => c - 1);
      }, speed / 2);
    } else {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    }

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

const keys = Object.keys(SNIPPETS);
const snip = SNIPPETS[keys[Math.floor(Math.random() * keys.length)]];

export default function Home() {
  const animate                   = useReadyAnimate();
  const { openModal }             = useModal();
  useDeepLink();
  const { projects, loading: pl } = useProjects(3);
  const { stats }                 = useStats();
  const role                      = useTypewriter(ROLES);

  const { items: collabs,  loading: cl } = usePageData('collaborations', 'collaborations', { order: 'created_at', limit: 3 });
  const { items: posts,    loading: bl } = usePageData('blog',           'blog',           { order: 'created_at', limit: 3 });
  const { items: tutos,    loading: tl } = usePageData('tutos',          'tuto',           { order: 'created_at', limit: 3 });

  const openProject = (id) => {
    const params = new URLSearchParams(window.location.search);
    params.set('projet', id);
    window.history.pushState({}, '', '?' + params.toString());
    openModal(<ProjectModal id={id} />);
  };

  const openCollab = (id) => {
    const params = new URLSearchParams(window.location.search);
    params.set('collab', id);
    window.history.pushState({}, '', '?' + params.toString());
    openModal(<CollabModal id={id} />);
  };

  const openPost = (id) => {
    const params = new URLSearchParams(window.location.search);
    params.set('blog', id);
    window.history.pushState({}, '', '?' + params.toString());
    openModal(<BlogModal id={id} table="blog" />);
  };

  const openTuto = (id) => {
    const params = new URLSearchParams(window.location.search);
    params.set('tuto', id);
    window.history.pushState({}, '', '?' + params.toString());
    openModal(<BlogModal id={id} table="tutos" />);
  };

  return (
    <>
      <section className="home-hero">
        <motion.div
          className="home-hero-content"
          variants={staggerContainer(0.1, 0)}
          initial="hidden"
          animate={animate}
        >
          <motion.div className="home-greeting" variants={fadeUp}>
            <span className="home-greeting-status" />
            Disponible pour des collaborations
          </motion.div>

          <motion.div className="home-eyebrow" variants={fadeUp}>
            Je suis Nathan —
          </motion.div>

          <motion.h1 className="home-title" variants={fadeUp}>
            <span className="home-title-typewriter">
              {role}
              <span className="home-cursor" aria-hidden="true">|</span>
            </span>
          </motion.h1>

          <motion.p className="home-desc" variants={fadeUp}>
            Je code par passion depuis que je suis gamin. Sites web, scripts, outils, bots — si c&apos;est de l&apos;informatique, j&apos;y touche. Chaque projet est une façon d&apos;apprendre quelque chose de nouveau.
          </motion.p>

          <motion.div className="home-proof" variants={fadeUp}>
            <span className="home-proof-item"><i className="fas fa-check-circle" /> Passionné d&apos;informatique depuis l&apos;enfance</span>
            <span className="home-proof-item"><i className="fas fa-check-circle" /> Projets perso de A à Z</span>
            <span className="home-proof-item"><i className="fas fa-check-circle" /> Code lisible &amp; documenté</span>
          </motion.div>

          <motion.div className="home-cta" variants={fadeUp}>
            <Link to="/projets" className="btn-primary">
              <i className="fas fa-folder-open" /> Voir mes projets
            </Link>
            <Link to="/contact" className="btn-secondary">
              <i className="fas fa-paper-plane" /> Me contacter
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="home-terminal"
          variants={scaleIn}
          initial="hidden"
          animate={animate}
          transition={{ delay: 0.3 }}
        >
          <div className="terminal">
            <div className="terminal-bar">
              <div className="terminal-dots">
                <span className="terminal-dot red" />
                <span className="terminal-dot yellow" />
                <span className="terminal-dot green" />
              </div>
              <span className="terminal-title">{snip.title}</span>
            </div>
            <pre className="terminal-body" dangerouslySetInnerHTML={{ __html: snip.body }} />
          </div>
        </motion.div>
      </section>

      <motion.div
        className="stats-row"
        variants={staggerContainer(0.08, 0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {[
          { value: stats.projects, label: 'Projets' },
          { value: stats.blog,     label: 'Articles de blog' },
          { value: stats.tutos,    label: 'Tutoriels' },
          { value: '2+',           label: "Années d'XP" },
        ].map(s => (
          <motion.div key={s.label} className="stat-card" variants={cardVariant}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="home-stack"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <p className="stack-label">// Stack &amp; outils</p>
        <motion.div
          className="stack-badges"
          variants={staggerContainer(0.04, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {STACK.map(([icon, color, label]) => (
            <motion.span key={label} className="badge" variants={cardVariant}>
              <i className={icon} style={color ? { color } : {}} /> {label}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        className="home-recent"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
      >
        <div className="section-header">
          <h2 className="section-title">Projets récents</h2>
          <Link to="/projets" className="section-link">Tous les projets →</Link>
        </div>

        {!pl && (
          <motion.div
            className="cards-grid"
            variants={staggerContainer(0.07)}
            initial="hidden"
            animate="visible"
          >
            {projects.length
              ? projects.map(p => (
                  <motion.div key={p.id} variants={cardVariant}>
                    <Card item={p} tag="⚡ Projet" onClick={() => openProject(p.id)} />
                  </motion.div>
                ))
              : (
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <p>Aucun projet récent.</p>
                </div>
              )
            }
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="home-recent"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
      >
        <div className="section-header">
          <h2 className="section-title">Collaborations récentes</h2>
          <Link to="/collaborations" className="section-link">Toutes les collabs →</Link>
        </div>
        {!cl && (
          <motion.div className="cards-grid" variants={staggerContainer(0.07)} initial="hidden" animate="visible">
            {collabs.length
              ? collabs.map(c => {
                  const persons = c.collaborateurs || [];
                  return (
                    <motion.article
                      key={c.id}
                      className="card"
                      onClick={() => openCollab(c.id)}
                      style={{ cursor: 'pointer' }}
                      variants={cardVariant}
                    >
                      <div className="card-tag">🤝 Collab</div>
                      <h3>{c.title || ''}</h3>
                      <p>{c.short_description || ''}</p>
                      {persons.length > 0 && (
                        <div className="collab-persons">
                          {persons.map((col, i) => (
                            <div key={i} className="collab-person">
                              {col.avatar
                                ? <img src={col.avatar} alt={col.nom} className="collab-avatar" onError={e => e.target.style.display='none'} />
                                : <div className="collab-avatar collab-avatar-fallback">{col.nom?.charAt(0)?.toUpperCase() || '?'}</div>
                              }
                              <span className="collab-name">{col.nom || ''}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="card-meta">
                        <span>{formatDate(c.created_at)}</span>
                        <span className="card-arrow">→</span>
                      </div>
                    </motion.article>
                  );
                })
              : <div className="empty-state"><div className="empty-state-icon">🤝</div><p>Aucune collaboration pour le moment.</p></div>
            }
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="home-recent"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
      >
        <div className="section-header">
          <h2 className="section-title">Derniers articles</h2>
          <Link to="/blog" className="section-link">Tous les articles →</Link>
        </div>
        {!bl && (
          <motion.div className="cards-grid" variants={staggerContainer(0.07)} initial="hidden" animate="visible">
            {posts.length
              ? posts.map(p => (
                  <motion.div key={p.id} variants={cardVariant}>
                    <Card item={p} tag="📝 Article" onClick={() => openPost(p.id)} />
                  </motion.div>
                ))
              : <div className="empty-state"><div className="empty-state-icon">📝</div><p>Aucun article pour le moment.</p></div>
            }
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="home-recent"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
      >
        <div className="section-header">
          <h2 className="section-title">Derniers tutoriels</h2>
          <Link to="/tutos" className="section-link">Tous les tutos →</Link>
        </div>
        {!tl && (
          <motion.div className="cards-grid" variants={staggerContainer(0.07)} initial="hidden" animate="visible">
            {tutos.length
              ? tutos.map(t => (
                  <motion.div key={t.id} variants={cardVariant}>
                    <Card item={t} tag="🎓 Tuto" onClick={() => openTuto(t.id)} />
                  </motion.div>
                ))
              : <div className="empty-state"><div className="empty-state-icon">🎓</div><p>Aucun tutoriel pour le moment.</p></div>
            }
          </motion.div>
        )}
      </motion.div>
    </>
  );
}