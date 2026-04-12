import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useModal } from '../hooks/useModal';
import { useProjects } from '../hooks/useProjects';
import { useStats } from '../hooks/useStats';
import { useReadyAnimate } from '../hooks/useReadyAnimate';
import { Card } from '../components/ui';
import { ProjectModal } from '../components/ui/Modals';
import { fadeUp, staggerContainer, cardVariant, scaleIn } from '../lib/motion';

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

const keys = Object.keys(SNIPPETS);
const snip = SNIPPETS[keys[Math.floor(Math.random() * keys.length)]];

export default function Home() {
  const animate                   = useReadyAnimate();
  const { openModal }             = useModal();
  const { projects, loading: pl } = useProjects(3);
  const { stats }                 = useStats();

  const openProject = (id) => {
    const params = new URLSearchParams(window.location.search);
    params.set('projet', id);
    window.history.pushState({}, '', '?' + params.toString());
    openModal(<ProjectModal id={id} />);
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

          <motion.h1 className="home-title" variants={fadeUp}>
            Développeur<br />
            <span className="line-accent">Web</span> &amp;<br />
            Discord.
          </motion.h1>

          <motion.p className="home-desc" variants={fadeUp}>
            Salut, moi c&apos;est <strong>Nathan</strong>. Je crée des sites web modernes
            et des bots Discord en Node.js. Passionné de code, j&apos;adore donner vie
            à des idées techniques.
          </motion.p>

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
          { value: '1+',           label: "Années d'XP" },
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
    </>
  );
}
