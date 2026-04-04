import { db, fetchTable, getDiscordUser, loginWithDiscord, logout } from './db.js';
import { getState } from './state.js';
import { formatDate, nl2br, escapeHtml } from './utils.js';
import { getPage } from './router.js';

function openModal(html) {
  const modal = document.getElementById('modal');
  document.getElementById('modalContent').innerHTML = html;
  modal.classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  const params = new URLSearchParams(window.location.search);
  const hasModal = ['projet', 'blog', 'tuto', 'collab'].some(k => params.has(k));
  if (hasModal) {
    ['projet', 'blog', 'tuto', 'collab'].forEach(k => params.delete(k));
    window.history.pushState({}, '', '?' + params.toString());
  }
}

function initModalListeners() {
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalBackdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

async function openProjectModal(id, pushState = true) {
  const { data, error } = await db.from('projects').select('*').eq('id', id).single();
  if (error || !data) {
    openModal(`
      <div class="modal-tag">⚡ Projet</div>
      <h2 style="color:var(--text-muted)">Projet introuvable</h2>
      <p>Ce projet n'existe pas ou a été supprimé.</p>`);
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
    <div style="margin-top:${imgs.length ? '0' : '8px'}">${nl2br(data.full_description || data.short_description || '')}</div>
    ${data.link ? `<a class="modal-link" href="${data.link}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Voir le projet</a>` : ''}`);
}

async function openBlogModal(id, table, pushState = true) {
  const { data, error } = await db.from(table).select('*').eq('id', id).single();
  if (error || !data) {
    const label     = table === 'blog' ? '📝 Article' : '🎓 Tutoriel';
    const labelText = table === 'blog' ? 'article' : 'tutoriel';
    openModal(`
      <div class="modal-tag">${label}</div>
      <h2 style="color:var(--text-muted)">${labelText.charAt(0).toUpperCase() + labelText.slice(1)} introuvable</h2>
      <p>Cet ${labelText} n'existe pas ou a été supprimé.</p>`);
    return;
  }
  if (pushState) {
    const params = new URLSearchParams(window.location.search);
    params.set(table === 'blog' ? 'blog' : 'tuto', id);
    window.history.pushState({}, '', '?' + params.toString());
  }

  const label       = table === 'blog' ? '📝 Article' : '🎓 Tutoriel';
  const contentType = table === 'blog' ? 'blog' : 'tuto';
  const imgs        = [data.image1_path, data.image2_path].filter(Boolean);

  openModal(`
    <div class="modal-tag">${label}</div>
    <h2>${data.title}</h2>
    <p style="font-size:.8rem;color:var(--text-dim);font-family:var(--font-code);margin-bottom:16px">${formatDate(data.created_at)}</p>
    ${imgs.length ? `<div class="modal-images">${imgs.map(s => `<img src="${s}" alt="">`).join('')}</div>` : ''}
    <div style="margin-bottom:24px">${nl2br(data.full_description || data.short_description || '')}</div>
    <div class="reactions-bar" id="reactions-bar-${id}">
      <button class="reaction-btn" id="btn-like-${id}" data-type="like">
        <i class="fas fa-thumbs-up"></i> <span id="count-like-${id}">—</span>
      </button>
      <button class="reaction-btn" id="btn-dislike-${id}" data-type="dislike">
        <i class="fas fa-thumbs-down"></i> <span id="count-dislike-${id}">—</span>
      </button>
    </div>
    <div class="comments-section" data-content-type="${contentType}">
      <h4 class="comments-title">💬 Commentaires</h4>
      <div id="comments-list-${id}" class="comments-list">
        <div class="comments-loading"><i class="fas fa-spinner fa-spin"></i></div>
      </div>
      <div id="comment-form-area-${id}"></div>
    </div>`);

  loadReactions(id, contentType);
  loadComments(id, contentType);
  attachReactionListeners(id, contentType);
  renderCommentForm(id, contentType);
}

async function openCollabModal(id, pushState = true) {
  const { data, error } = await db.from('collaborations').select('*').eq('id', id).single();
  if (error || !data) {
    openModal(`
      <div class="modal-tag">🤝 Collab</div>
      <h2 style="color:var(--text-muted)">Collaboration introuvable</h2>
      <p>Cette collaboration n'existe pas ou a été supprimée.</p>`);
    return;
  }
  if (pushState) {
    const params = new URLSearchParams(window.location.search);
    params.set('collab', id);
    window.history.pushState({}, '', '?' + params.toString());
  }

  const imgs     = [data.image1_path, data.image2_path].filter(Boolean);
  const collabs  = data.collaborateurs || [];
  const avatarsHtml = collabs.length ? `
    <div class="collab-persons modal-collabs">
      ${collabs.map(col => `
        <div class="collab-person">
          ${col.avatar
            ? `<img src="${col.avatar}" alt="${col.nom}" class="collab-avatar" onerror="this.style.display='none'">`
            : `<div class="collab-avatar collab-avatar-fallback">${col.nom?.charAt(0)?.toUpperCase() || '?'}</div>`}
          <div class="collab-person-info">
            <span class="collab-name">${col.nom || ''}</span>
            ${col.github  ? `<a href="${col.github}" target="_blank" rel="noopener" class="collab-link"><i class="fab fa-github"></i></a>` : ''}
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
    ${data.link ? `<a class="modal-link" href="${data.link}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> Voir le projet</a>` : ''}`);
}

function attachCardModal(type) {
  const tableMap = { project: 'projects', blog: 'blog', tuto: 'tutos' };
  document.querySelectorAll(`.cards-grid[data-modal-type="${type}"] .card[data-id]`).forEach(card => {
    card.addEventListener('click', () => {
      if (type === 'project')          openProjectModal(card.dataset.id);
      else if (type === 'collaboration') openCollabModal(card.dataset.id);
      else                               openBlogModal(card.dataset.id, tableMap[type]);
    });
  });
}

async function checkModalParams() {
  const params   = new URLSearchParams(window.location.search);
  const projetId = params.get('projet');
  const blogId   = params.get('blog');
  const tutoId   = params.get('tuto');
  const collabId = params.get('collab');
  if (projetId)      await openProjectModal(projetId, false);
  else if (blogId)   await openBlogModal(blogId, 'blog', false);
  else if (tutoId)   await openBlogModal(tutoId, 'tutos', false);
  else if (collabId) await openCollabModal(collabId, false);
}

async function loadReactions(targetId, targetType) {
  try {
    const { data } = await db.from('reactions')
      .select('reaction, user_id')
      .eq('target_id', targetId)
      .eq('target_type', targetType);

    const likes    = data?.filter(r => r.reaction === 'like').length    || 0;
    const dislikes = data?.filter(r => r.reaction === 'dislike').length || 0;
    const el       = id => document.getElementById(id);

    if (el(`count-like-${targetId}`))    el(`count-like-${targetId}`).textContent    = likes;
    if (el(`count-dislike-${targetId}`)) el(`count-dislike-${targetId}`).textContent = dislikes;

    const user = getDiscordUser();
    if (user) {
      const mine = data?.find(r => r.user_id === user.id);
      if (mine) el(`btn-${mine.reaction}-${targetId}`)?.classList.add('active');
    }
  } catch(_) {}
}

function attachReactionListeners(targetId, targetType) {
  ['like', 'dislike'].forEach(type => {
    const btn = document.getElementById(`btn-${type}-${targetId}`);
    if (!btn) return;
    btn.addEventListener('click', async () => {
      if (!getDiscordUser()) { loginWithDiscord(); return; }
      await toggleReaction(targetId, targetType, type);
      loadReactions(targetId, targetType);
    });
  });
}

async function toggleReaction(targetId, targetType, reaction) {
  const currentUser = getState('currentUser');
  try {
    const { data: rows } = await db.from('reactions')
      .select('id, reaction')
      .eq('target_id', targetId)
      .eq('user_id', currentUser.id)
      .limit(1);

    const existing = rows?.[0] ?? null;
    if (existing) {
      if (existing.reaction === reaction) {
        await db.from('reactions').delete().eq('id', existing.id);
      } else {
        await db.from('reactions').update({ reaction }).eq('id', existing.id);
      }
      return;
    }

    const { error } = await db.from('reactions').insert({
      target_id: targetId, target_type: targetType, user_id: currentUser.id, reaction,
    });
    if (error?.code === '23505') {
      await db.from('reactions').update({ reaction })
        .eq('target_id', targetId).eq('user_id', currentUser.id);
    }
  } catch(_) {}
}

function renderCommentForm(contentId, contentType) {
  const area = document.getElementById(`comment-form-area-${contentId}`);
  if (!area) return;
  const user = getDiscordUser();

  if (!user) {
    const prompt = document.createElement('div');
    prompt.className = 'comment-login-prompt';
    const p   = document.createElement('p');
    p.textContent = 'Connecte-toi avec Discord pour commenter et réagir.';
    const btn = document.createElement('button');
    btn.className = 'comment-discord-login-btn';
    btn.innerHTML = '<i class="fab fa-discord"></i> Se connecter avec Discord';
    btn.addEventListener('click', loginWithDiscord);
    prompt.append(p, btn);
    area.innerHTML = '';
    area.appendChild(prompt);
    return;
  }

  area.innerHTML = `
    <div class="comment-form">
      <div class="comment-user-badge">
        ${user.avatar_url
          ? `<img src="${user.avatar_url}" class="comment-avatar" alt="${user.username}">`
          : `<div class="comment-avatar comment-avatar-fallback">${user.username.charAt(0).toUpperCase()}</div>`}
        <span class="comment-username">${user.username}</span>
        <button class="comment-change-btn" id="logout-comment-${contentId}">Déconnexion</button>
      </div>
      <textarea class="comment-textarea" id="comment-text-${contentId}" placeholder="Écris ton commentaire..." rows="3" maxlength="500"></textarea>
      <div class="comment-form-footer">
        <span class="comment-chars" id="comment-chars-${contentId}">0/500</span>
        <button class="comment-submit-btn" id="comment-submit-${contentId}">
          <i class="fas fa-paper-plane"></i> Publier
        </button>
      </div>
      <div class="comment-error" id="comment-error-${contentId}"></div>
    </div>`;

  const textarea  = document.getElementById(`comment-text-${contentId}`);
  const charsEl   = document.getElementById(`comment-chars-${contentId}`);
  const submitBtn = document.getElementById(`comment-submit-${contentId}`);
  const errEl     = document.getElementById(`comment-error-${contentId}`);

  document.getElementById(`logout-comment-${contentId}`)?.addEventListener('click', async () => {
    await logout();
    renderCommentForm(contentId, contentType);
    loadReactions(contentId, contentType);
  });

  textarea?.addEventListener('input', () => {
    charsEl.textContent = `${textarea.value.length}/500`;
  });

  submitBtn?.addEventListener('click', async () => {
    const msg = textarea?.value.trim();
    errEl.textContent = '';
    if (!msg)            { errEl.textContent = 'Le commentaire ne peut pas être vide.'; return; }
    if (msg.length > 500) { errEl.textContent = 'Maximum 500 caractères.'; return; }

    const { data: banned } = await db.from('banned_words').select('word');
    if (banned?.find(b => msg.toLowerCase().includes(b.word.toLowerCase()))) {
      errEl.textContent = '⚠️ Ton commentaire contient un mot interdit.';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    try {
      const currentUser = getState('currentUser');
      const { error } = await db.from('comments').insert({
        content_id: contentId, content_type: contentType,
        user_id: currentUser.id, message: msg,
      });
      if (error) throw error;
      textarea.value = '';
      charsEl.textContent = '0/500';
      await loadComments(contentId, contentType);
    } catch(e) {
      errEl.textContent = `Erreur : ${e.message}`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Publier';
    }
  });
}

async function loadComments(contentId, contentType) {
  const list = document.getElementById(`comments-list-${contentId}`);
  if (!list) return;
  try {
    const { data: comments, error: commentsErr } = await db.from('comments')
      .select('id, user_id, message, created_at')
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .eq('approved', true)
      .order('created_at', { ascending: true });

    if (commentsErr) throw commentsErr;

    if (!comments?.length) {
      list.textContent = '';
      const p = document.createElement('p');
      p.className = 'no-comments';
      p.textContent = "Aucun commentaire pour l'instant. Sois le premier !";
      list.appendChild(p);
      return;
    }

    const userIds = [...new Set(comments.map(c => c.user_id))];
    const { data: profilesData } = await db.from('profiles').select('id, username, avatar_url').in('id', userIds);
    const profilesMap = Object.fromEntries((profilesData || []).map(p => [p.id, p]));

    const { data: allReactions } = await db.from('reactions')
      .select('target_id, reaction, user_id')
      .in('target_id', comments.map(c => c.id))
      .eq('target_type', 'comment');

    const myUid = getState('currentUser')?.id;

    list.innerHTML = comments.map(c => {
      const profile    = profilesMap[c.user_id] || {};
      const clikes     = allReactions?.filter(r => r.target_id === c.id && r.reaction === 'like').length    || 0;
      const cdislikes  = allReactions?.filter(r => r.target_id === c.id && r.reaction === 'dislike').length || 0;
      const myReaction = allReactions?.find(r => r.target_id === c.id && r.user_id === myUid)?.reaction;
      const avatar     = profile.avatar_url;
      const username   = profile.username || 'Inconnu';
      const isOwn      = !!myUid && !!c.user_id && c.user_id === myUid;

      return `
        <div class="comment-item" data-id="${c.id}">
          <div class="comment-header">
            ${avatar
              ? `<img src="${avatar}" class="comment-avatar" alt="${username}" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'">`
              : `<div class="comment-avatar comment-avatar-fallback">${username.charAt(0).toUpperCase()}</div>`}
            <div class="comment-meta">
              <span class="comment-username">${username}</span>
              <span class="comment-date">${formatDate(c.created_at)}</span>
            </div>
            ${isOwn ? `
              <div class="comment-menu-wrap">
                <button class="comment-menu-btn" data-cid="${c.id}"><i class="fas fa-ellipsis"></i></button>
                <div class="comment-menu-dropdown" id="menu-${c.id}" style="display:none">
                  <button class="comment-menu-item comment-edit-btn" data-cid="${c.id}"><i class="fas fa-pen"></i> Modifier</button>
                  <button class="comment-menu-item comment-delete-btn danger" data-cid="${c.id}"><i class="fas fa-trash"></i> Supprimer</button>
                </div>
              </div>` : ''}
          </div>
          <div class="comment-body-wrap">
            <p class="comment-body" id="comment-body-${c.id}">${escapeHtml(c.message)}</p>
            <div class="comment-edit-form" id="comment-edit-${c.id}" style="display:none">
              <textarea class="comment-textarea" id="comment-edit-text-${c.id}" rows="2" maxlength="500">${escapeHtml(c.message)}</textarea>
              <div class="comment-edit-actions">
                <button class="comment-cancel-btn comment-edit-cancel" data-cid="${c.id}">Annuler</button>
                <button class="comment-submit-btn comment-edit-save" data-cid="${c.id}"><i class="fas fa-floppy-disk"></i> Sauvegarder</button>
              </div>
            </div>
            <div class="comment-delete-confirm" id="delete-confirm-${c.id}" style="display:none">
              <p>Supprimer ce commentaire ?</p>
              <div class="comment-edit-actions">
                <button class="comment-cancel-btn comment-delete-cancel" data-cid="${c.id}">Annuler</button>
                <button class="comment-submit-btn danger comment-delete-confirm-btn" data-cid="${c.id}"><i class="fas fa-trash"></i> Supprimer</button>
              </div>
            </div>
          </div>
          <div class="comment-reactions">
            <button class="comment-reaction-btn ${myReaction === 'like' ? 'active' : ''}" data-cid="${c.id}" data-type="like">
              <i class="fas fa-thumbs-up"></i> ${clikes}
            </button>
            <button class="comment-reaction-btn ${myReaction === 'dislike' ? 'active' : ''}" data-cid="${c.id}" data-type="dislike">
              <i class="fas fa-thumbs-down"></i> ${cdislikes}
            </button>
          </div>
        </div>`;
    }).join('');

    list.querySelectorAll('.comment-reaction-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!getState('currentUser')) { loginWithDiscord(); return; }
        await toggleReaction(btn.dataset.cid, 'comment', btn.dataset.type);
        loadComments(contentId, contentType);
      });
    });

    list.querySelectorAll('.comment-menu-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const cid      = btn.dataset.cid;
        const dropdown = document.getElementById(`menu-${cid}`);
        document.querySelectorAll('.comment-menu-dropdown').forEach(d => {
          if (d.id !== `menu-${cid}`) d.style.display = 'none';
        });
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
      });
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.comment-menu-dropdown').forEach(d => d.style.display = 'none');
    }, { once: true });

    list.querySelectorAll('.comment-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cid = btn.dataset.cid;
        document.getElementById(`menu-${cid}`).style.display = 'none';
        document.getElementById(`comment-body-${cid}`).style.display = 'none';
        document.getElementById(`comment-edit-${cid}`).style.display = 'block';
        document.getElementById(`comment-edit-text-${cid}`).focus();
      });
    });

    list.querySelectorAll('.comment-edit-cancel').forEach(btn => {
      btn.addEventListener('click', () => {
        const cid = btn.dataset.cid;
        document.getElementById(`comment-body-${cid}`).style.display = '';
        document.getElementById(`comment-edit-${cid}`).style.display = 'none';
      });
    });

    list.querySelectorAll('.comment-edit-save').forEach(btn => {
      btn.addEventListener('click', async () => {
        const cid = btn.dataset.cid;
        const msg = document.getElementById(`comment-edit-text-${cid}`)?.value.trim();
        if (!msg) return;
        const { data: banned } = await db.from('banned_words').select('word');
        if (banned?.find(b => msg.toLowerCase().includes(b.word.toLowerCase()))) return;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        try {
          const currentUser = getState('currentUser');
          await db.from('comments').update({ message: msg }).eq('id', cid).eq('user_id', currentUser.id);
          await loadComments(contentId, contentType);
        } finally {
          btn.disabled = false;
          btn.innerHTML = '<i class="fas fa-floppy-disk"></i> Sauvegarder';
        }
      });
    });

    list.querySelectorAll('.comment-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cid = btn.dataset.cid;
        document.getElementById(`menu-${cid}`).style.display = 'none';
        document.getElementById(`comment-body-${cid}`).style.display = 'none';
        document.getElementById(`delete-confirm-${cid}`).style.display = 'block';
      });
    });

    list.querySelectorAll('.comment-delete-cancel').forEach(btn => {
      btn.addEventListener('click', () => {
        const cid = btn.dataset.cid;
        document.getElementById(`comment-body-${cid}`).style.display = '';
        document.getElementById(`delete-confirm-${cid}`).style.display = 'none';
      });
    });

    list.querySelectorAll('.comment-delete-confirm-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        try {
          const currentUser = getState('currentUser');
          await db.from('comments').delete().eq('id', btn.dataset.cid).eq('user_id', currentUser.id);
          await loadComments(contentId, contentType);
        } finally {
          btn.disabled = false;
          btn.innerHTML = '<i class="fas fa-trash"></i> Supprimer';
        }
      });
    });

  } catch(e) {
    const p = document.createElement('p');
    p.style.cssText = 'color:#fca5a5;font-size:.85rem';
    p.textContent = `Erreur : ${e.message}`;
    list.innerHTML = '';
    list.appendChild(p);
  }
}

export { openModal, closeModal, initModalListeners, openProjectModal, openBlogModal, openCollabModal, attachCardModal, checkModalParams, loadReactions, loadComments, renderCommentForm };

window.__modals = { checkModalParams, attachCardModal, openProjectModal, openBlogModal, openCollabModal };
