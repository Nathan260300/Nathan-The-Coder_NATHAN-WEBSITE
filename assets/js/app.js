import { db, getDiscordUser, loginWithDiscord, logout } from './modules/db.js';
import { getState, setState } from './modules/state.js';
import { getPage, navigate, initNavigation } from './modules/router.js';
import { initModalListeners, checkModalParams, renderCommentForm, loadComments, loadReactions, openProjectModal, attachCardModal } from './modules/modals.js';

console.log(`%c© 2026 - Nathan The Coder`, "background: #282c34; color: #98c379; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cNathan The Coder", "background: #282c34; color: #61afef; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%cPortfolio de Nathan — Développeur web & bot Discord passionné.", "background: #282c34; color: #61dafb; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log("%chttps://nathan-the-coder.netlify.app", "background: #282c34; color: #e06c75; padding: .5em 1em; border-radius: 5px; font-weight: bold;");
console.log(`%cMade with 🕑 and 💖 by Nathan`, "background: #282c34; color: #c678dd; padding: .5em 1em; border-radius: 5px; font-weight: bold;");

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
<span class="fn">console</span>.<span class="fn">log</span>(<span class="str">\`Bienvenue sur mon portfolio !\`</span>);`,
    },
    ts: {
      title: 'nathan@code: ~/bot.ts',
      body: `<span class="cmt">// Mon bot Discord</span>
<span class="kw">import</span> { Client, GatewayIntentBits } <span class="kw">from</span> <span class="str">'discord.js'</span>;
<span class="kw">const</span> <span class="acc">client</span> = <span class="kw">new</span> <span class="fn">Client</span>({
  <span class="key">intents</span>: [GatewayIntentBits.<span class="acc">Guilds</span>, GatewayIntentBits.<span class="acc">GuildMessages</span>]
});
client.<span class="fn">on</span>(<span class="str">'ready'</span>, () => {
  <span class="fn">console</span>.<span class="fn">log</span>(<span class="str">\`Bot en ligne ✅\`</span>);
});`,
    },
    css: {
      title: 'nathan@code: ~/style.css',
      body: `<span class="cmt">/* Design premium 🎨 */</span>
<span class="fn">:root</span> {
  <span class="key">--accent</span>:  <span class="str">#00d4ff</span>;
  <span class="key">--bg</span>:      <span class="str">#080b10</span>;
  <span class="key">--font</span>:    <span class="str">'Syne', sans-serif</span>;
}
<span class="fn">.card:hover</span> {
  <span class="key">transform</span>: <span class="fn">translateY</span>(<span class="num">-3px</span>);
}`,
    },
  };

  const keys = Object.keys(snippets);
  const snip = snippets[keys[Math.floor(Math.random() * keys.length)]];
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
      const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val ?? '0'; };
      set('stat-projects', p.count);
      set('stat-blog',     b.count);
      set('stat-tutos',    t.count);
    } catch(_) {}
  })();

  document.querySelectorAll('#recent-projects .card[data-id]').forEach(card => {
    card.addEventListener('click', () => openProjectModal(card.dataset.id));
  });
}

function attachContactForm() {
  document.getElementById('contact-discord-login')?.addEventListener('click', async () => {
    await loginWithDiscord();
    const unsub = db.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        unsub.data.subscription.unsubscribe();
        navigate('contact');
      }
    });
  });

  document.getElementById('contact-logout-btn')?.addEventListener('click', async () => {
    await logout();
    navigate('contact');
  });

  const btn    = document.getElementById('contact-submit');
  const status = document.getElementById('contact-status');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const user    = getDiscordUser();
    const message = document.getElementById('c-message')?.value.trim();

    function showStatus(type, msg) {
      status.className   = `form-status ${type}`;
      status.textContent = msg;
    }

    if (!user)    { showStatus('error', "⚠️ Connecte-toi avec Discord d'abord."); return; }
    if (!message) { showStatus('error', '⚠️ Le message ne peut pas être vide.'); return; }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi…';

    try {
      const { error } = await db.from('contact_messages').insert([{
        name:       user.username,
        discord_id: getState('currentUser').id,
        message,
        created_at: new Date().toISOString(),
      }]);
      if (error) throw error;
      showStatus('success', '✅ Message envoyé ! Je te contacte bientôt sur Discord.');
      document.getElementById('c-message').value = '';
    } catch(e) {
      showStatus('error', `❌ Erreur : ${e.message}`);
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer';
    }
  });
}

async function fetchFooterUpdate() {
  try {
    const { data } = await db.from('changelog')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (data?.created_at) {
      const el = document.getElementById('footer-update');
      if (el) {
        el.textContent = `Dernière MAJ : ${new Date(data.created_at).toLocaleDateString('fr-FR', {
          day: '2-digit', month: 'short', year: 'numeric',
        })}`;
      }
    }
  } catch(_) {}
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

window.__afterRender = afterRender;

db.auth.onAuthStateChange((event, session) => {
  const wasLoggedIn = !!getState('currentUser');
  setState('currentUser', session?.user ?? null);

  if (event === 'SIGNED_IN' && window.opener) {
    try {
      window.opener.postMessage({ type: 'DISCORD_LOGIN_SUCCESS' }, window.location.origin);
      window.close();
    } catch(_) {}
  }

  if (!getState('sessionReady')) { setState('sessionReady', true); return; }

  if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
    document.querySelectorAll('[id^="comment-form-area-"]').forEach(area => {
      const id = area.id.replace('comment-form-area-', '');
      const ct = area.closest('[data-content-type]')?.dataset.contentType || 'blog';
      renderCommentForm(id, ct);
      loadComments(id, ct);
      loadReactions(id, ct);
    });
    if (getPage() === 'contact' && wasLoggedIn !== !!getState('currentUser')) navigate('contact');
  }
});

window.addEventListener('message', async (e) => {
  if (e.origin !== window.location.origin) return;
  if (e.data?.type !== 'DISCORD_LOGIN_SUCCESS') return;
  const { data: { session } } = await db.auth.getSession();
  if (!session) return;
  setState('currentUser', session.user);
  document.querySelectorAll('[id^="comment-form-area-"]').forEach(area => {
    const id = area.id.replace('comment-form-area-', '');
    const ct = area.closest('[data-content-type]')?.dataset.contentType || 'blog';
    renderCommentForm(id, ct);
    loadReactions(id, ct);
  });
});

db.auth.getSession().then(({ data: { session } }) => {
  setState('currentUser', session?.user ?? null);
});

initModalListeners();
initNavigation();
navigate(getPage()).then(() => checkModalParams());
