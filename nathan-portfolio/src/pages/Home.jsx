import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db, fetchTable } from '../lib/supabase';
import { Card, Loader } from '../components/ui';
import { useModal } from '../hooks/useModal';
import { ProjectModal } from '../components/ui/Modals';

const SNIPPETS = {
  js: {
    title: 'nathan@code: ~/about.js',
    body: `<span class="cmt">// Nathan The Coder</span>\n<span class="kw">const</span> <span class="acc">dev</span> = {\n  <span class="key">name</span>:     <span class="str">'Nathan'</span>,\n  <span class="key">stack</span>:    [<span class="str">'HTML'</span>, <span class="str">'CSS'</span>, <span class="str">'JS'</span>, <span class="str">'Node.js'</span>],\n  <span class="key">bot</span>:      <span class="str">'Discord.js'</span>,\n  <span class="key">db</span>:       <span class="str">'Supabase'</span>,\n  <span class="key">fuel</span>:     <span class="str">'Coca-Cola 🥤'</span>\n};\n<span class="fn">console</span>.<span class="fn">log</span>(\`Bienvenue !\`);`,
  },
  ts: {
    title: 'nathan@code: ~/bot.ts',
    body: `<span class="cmt">// Mon bot Discord</span>\n<span class="kw">import</span> { Client, GatewayIntentBits } <span class="kw">from</span> <span class="str">'discord.js'</span>;\n<span class="kw">const</span> <span class="acc">client</span> = <span class="kw">new</span> <span class="fn">Client</span>({\n  <span class="key">intents</span>: [GatewayIntentBits.<span class="acc">Guilds</span>]\n});\nclient.<span class="fn">on</span>(<span class="str">'ready'</span>, () => {\n  <span class="fn">console</span>.<span class="fn">log</span>(\`Bot en ligne ✅\`);\n});`,
  },
  css: {
    title: 'nathan@code: ~/style.css',
    body: `<span class="cmt">/* Design premium 🎨 */</span>\n<span class="fn">:root</span> {\n  <span class="key">--accent</span>:  <span class="str">#00d4ff</span>;\n  <span class="key">--bg</span>:      <span class="str">#080b10</span>;\n}\n<span class="fn">.card:hover</span> {\n  <span class="key">transform</span>: <span class="fn">translateY</span>(<span class="num">-3px</span>);\n}`,
  },
};

export default function Home() {
  const { openModal } = useModal();
  const [projects, setProjects] = useState([]);
  const [stats,    setStats]    = useState({ projects: '—', blog: '—', tutos: '—' });
  const [loading,  setLoading]  = useState(true);

  const keys   = Object.keys(SNIPPETS);
  const snip   = SNIPPETS[keys[Math.floor(Math.random() * keys.length)]];

  useEffect(() => {
    Promise.allSettled([
      fetchTable('projects', { order: 'created_at', limit: 3 }),
      db.from('projects').select('id', { count: 'exact', head: true }),
      db.from('blog').select('id',     { count: 'exact', head: true }),
      db.from('tutos').select('id',    { count: 'exact', head: true }),
    ]).then(([proj, p, b, t]) => {
      if (proj.status === 'fulfilled') setProjects(proj.value);
      setStats({
        projects: p.status === 'fulfilled' ? p.value.count : '?',
        blog:     b.status === 'fulfilled' ? b.value.count : '?',
        tutos:    t.status === 'fulfilled' ? t.value.count : '?',
      });
      setLoading(false);
    });
  }, []);

  const openProject = (id) => {
    const params = new URLSearchParams(window.location.search);
    params.set('projet', id);
    window.history.pushState({}, '', '?' + params.toString());
    openModal(<ProjectModal id={id} />);
  };

  if (loading) return <Loader />;

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-greeting">
            <span className="home-greeting-status" />
            Disponible pour des collaborations
          </div>
          <h1 className="home-title">
            Développeur<br />
            <span className="line-accent">Web</span> &amp;<br />
            Discord.
          </h1>
          <p className="home-desc">
            Salut, moi c'est <strong>Nathan</strong>. Je crée des sites web modernes
            et des bots Discord en Node.js. Passionné de code, j'adore donner vie
            à des idées techniques.
          </p>
          <div className="home-cta">
            <Link to="/projets" className="btn-primary"><i className="fas fa-folder-open" /> Voir mes projets</Link>
            <Link to="/contact" className="btn-secondary"><i className="fas fa-paper-plane" /> Me contacter</Link>
          </div>
        </div>
        <div className="home-terminal">
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
        </div>
      </section>

      <div className="stats-row">
        <div className="stat-card"><div className="stat-value">{stats.projects}</div><div className="stat-label">Projets</div></div>
        <div className="stat-card"><div className="stat-value">{stats.blog}</div><div className="stat-label">Articles de blog</div></div>
        <div className="stat-card"><div className="stat-value">{stats.tutos}</div><div className="stat-label">Tutoriels</div></div>
        <div className="stat-card"><div className="stat-value">1+</div><div className="stat-label">Années d'XP</div></div>
      </div>

      <div className="home-stack">
        <p className="stack-label">// Stack &amp; outils</p>
        <div className="stack-badges">
          {[
            ['fab fa-html5', '#e34f26', 'HTML5'],
            ['fab fa-css3-alt', '#2965f1', 'CSS3'],
            ['fab fa-js', '#f7df1e', 'JavaScript'],
            ['fab fa-node-js', '#339933', 'Node.js'],
            ['fas fa-database', '#3ecf8e', 'Supabase'],
            ['fab fa-discord', '#5865f2', 'Discord.js'],
            ['fab fa-git-alt', '#f05032', 'Git'],
            ['fab fa-github', null, 'GitHub'],
            ['fas fa-code', '#007acc', 'VS Code'],
            ['fab fa-apple', null, 'macOS'],
            ['fab fa-linux', null, 'Linux'],
          ].map(([icon, color, label]) => (
            <span key={label} className="badge">
              <i className={icon} style={color ? { color } : {}} /> {label}
            </span>
          ))}
        </div>
      </div>

      <div className="home-recent">
        <div className="section-header">
          <h2 className="section-title">Projets récents</h2>
          <Link to="/projets" className="section-link">Tous les projets →</Link>
        </div>
        <div className="cards-grid">
          {projects.length
            ? projects.map(p => <Card key={p.id} item={p} tag="⚡ Projet" onClick={() => openProject(p.id)} />)
            : <div className="empty-state"><div className="empty-state-icon">📭</div><p>Aucun projet récent.</p></div>
          }
        </div>
      </div>
    </>
  );
}
