import { useEffect, useState } from 'react';
import { db } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { loginWithDiscord } from '../../lib/supabase';
import { formatDate, nl2br, escapeHtml } from '../../lib/utils';

function useReactions(targetId, targetType) {
  const { user, loginProvider } = useAuth();
  const [counts, setCounts] = useState({ like: 0, dislike: 0 });
  const [mine,   setMine]   = useState(null);

  const load = async () => {
    const { data } = await db.from('reactions').select('reaction, user_id').eq('target_id', targetId).eq('target_type', targetType);
    setCounts({
      like:    data?.filter(r => r.reaction === 'like').length    || 0,
      dislike: data?.filter(r => r.reaction === 'dislike').length || 0,
    });
    if (user) setMine(data?.find(r => r.user_id === user.id)?.reaction || null);
  };

  useEffect(() => { load(); }, [targetId, targetType, user?.id]);

  const toggle = async (reaction) => {
    if (!user || loginProvider === 'email') { loginWithDiscord(); return; }
    const { data: rows } = await db.from('reactions').select('id, reaction').eq('target_id', targetId).eq('user_id', user.id).limit(1);
    const existing = rows?.[0] ?? null;
    if (existing) {
      if (existing.reaction === reaction) await db.from('reactions').delete().eq('id', existing.id);
      else await db.from('reactions').update({ reaction }).eq('id', existing.id);
    } else {
      const { error } = await db.from('reactions').insert({ target_id: targetId, target_type: targetType, user_id: user.id, reaction });
      if (error?.code === '23505') await db.from('reactions').update({ reaction }).eq('target_id', targetId).eq('user_id', user.id);
    }
    await load();
  };

  return { counts, mine, toggle };
}

function CommentsSection({ contentId, contentType }) {
  const { user, loginProvider, getDiscordUser, doLogout } = useAuth();
  const discordUser = getDiscordUser?.();
  const isEmailUser = !!user && loginProvider === 'email';
  const [comments, setComments] = useState([]);
  const [text,     setText]     = useState('');
  const [error,    setError]    = useState('');
  const [sending,  setSending]  = useState(false);

  const loadComments = async () => {
    const { data } = await db.from('comments')
      .select('id, user_id, message, created_at')
      .eq('content_id', contentId)
      .eq('content_type', contentType)
      .eq('approved', true)
      .order('created_at', { ascending: true });

    if (!data?.length) { setComments([]); return; }

    const userIds = [...new Set(data.map(c => c.user_id))];
    const { data: profiles } = await db.from('profiles').select('id, username, avatar_url').in('id', userIds);
    const profilesMap = Object.fromEntries((profiles || []).map(p => [p.id, p]));

    const { data: reactions } = await db.from('reactions')
      .select('target_id, reaction, user_id')
      .in('target_id', data.map(c => c.id))
      .eq('target_type', 'comment');

    setComments(data.map(c => ({
      ...c,
      profile:    profilesMap[c.user_id] || {},
      likes:      reactions?.filter(r => r.target_id === c.id && r.reaction === 'like').length    || 0,
      dislikes:   reactions?.filter(r => r.target_id === c.id && r.reaction === 'dislike').length || 0,
      myReaction: reactions?.find(r => r.target_id === c.id && r.user_id === user?.id)?.reaction || null,
    })));
  };

  useEffect(() => { loadComments(); }, [contentId, contentType, user?.id]);

  const submit = async () => {
    if (!text.trim()) { setError('Le commentaire ne peut pas être vide.'); return; }
    if (text.length > 500) { setError('Maximum 500 caractères.'); return; }
    const { data: banned } = await db.from('banned_words').select('word');
    if (banned?.find(b => text.toLowerCase().includes(b.word.toLowerCase()))) { setError('⚠️ Mot interdit.'); return; }
    setSending(true);
    const { error: err } = await db.from('comments').insert({ content_id: contentId, content_type: contentType, user_id: user.id, message: text.trim() });
    setSending(false);
    if (err) { setError(`Erreur : ${err.message}`); return; }
    setText('');
    setError('');
    await loadComments();
  };

  const toggleCommentReaction = async (cid, reaction) => {
    if (!user || loginProvider === 'email') { loginWithDiscord(); return; }
    const { data: rows } = await db.from('reactions').select('id, reaction').eq('target_id', cid).eq('user_id', user.id).limit(1);
    const existing = rows?.[0] ?? null;
    if (existing) {
      if (existing.reaction === reaction) await db.from('reactions').delete().eq('id', existing.id);
      else await db.from('reactions').update({ reaction }).eq('id', existing.id);
    } else {
      await db.from('reactions').insert({ target_id: cid, target_type: 'comment', user_id: user.id, reaction });
    }
    await loadComments();
  };

  const deleteComment = async (cid) => {
    await db.from('comments').delete().eq('id', cid).eq('user_id', user.id);
    await loadComments();
  };

  return (
    <div className="comments-section" data-content-type={contentType}>
      <h4 className="comments-title">💬 Commentaires</h4>
      <div className="comments-list">
        {!comments.length
          ? <p className="no-comments">Aucun commentaire pour l'instant. Sois le premier !</p>
          : comments.map(c => (
            <div key={c.id} className="comment-item">
              <div className="comment-header">
                {c.profile.avatar_url
                  ? <img src={c.profile.avatar_url} className="comment-avatar" alt={c.profile.username} onError={e => e.target.src = 'https://cdn.discordapp.com/embed/avatars/0.png'} />
                  : <div className="comment-avatar comment-avatar-fallback">{(c.profile.username || '?').charAt(0).toUpperCase()}</div>
                }
                <div className="comment-meta">
                  <span className="comment-username">{c.profile.username || 'Inconnu'}</span>
                  <span className="comment-date">{formatDate(c.created_at)}</span>
                </div>
                {user?.id === c.user_id && (
                  <button className="comment-menu-btn" onClick={() => deleteComment(c.id)} style={{ marginLeft: 'auto', color: '#f87171', fontSize: '.75rem' }}>
                    <i className="fas fa-trash" />
                  </button>
                )}
              </div>
              <p className="comment-body">{c.message}</p>
              <div className="comment-reactions">
                <button className={`comment-reaction-btn${c.myReaction === 'like' ? ' active' : ''}`} onClick={() => toggleCommentReaction(c.id, 'like')}>
                  <i className="fas fa-thumbs-up" /> {c.likes}
                </button>
                <button className={`comment-reaction-btn${c.myReaction === 'dislike' ? ' active' : ''}`} onClick={() => toggleCommentReaction(c.id, 'dislike')}>
                  <i className="fas fa-thumbs-down" /> {c.dislikes}
                </button>
              </div>
            </div>
          ))
        }
      </div>

      {!user || isEmailUser ? (
        <div className="comment-login-prompt">
          <p>Connecte-toi avec Discord pour commenter et réagir.</p>
          {isEmailUser && (
            <p style={{ fontSize: '.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              Tu es connecté via email — réservé aux messages de contact.
            </p>
          )}
          <button className="comment-discord-login-btn" onClick={loginWithDiscord}>
            <i className="fab fa-discord" /> Se connecter avec Discord
          </button>
        </div>
      ) : (
        <div className="comment-form">
          <div className="comment-user-badge">
            {discordUser?.avatar_url
              ? <img src={discordUser.avatar_url} className="comment-avatar" alt={discordUser.username} />
              : <div className="comment-avatar comment-avatar-fallback">{(discordUser?.username || user.email || '?').charAt(0).toUpperCase()}</div>
            }
            <span className="comment-username">{discordUser?.username || user.email}</span>
            <button className="comment-change-btn" onClick={doLogout}>Déconnexion</button>
          </div>
          <textarea
            className="comment-textarea"
            placeholder="Écris ton commentaire..."
            rows={3}
            maxLength={500}
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <div className="comment-form-footer">
            <span className="comment-chars">{text.length}/500</span>
            <button className="comment-submit-btn" onClick={submit} disabled={sending}>
              {sending ? <i className="fas fa-spinner fa-spin" /> : <><i className="fas fa-paper-plane" /> Publier</>}
            </button>
          </div>
          {error && <div className="comment-error">{error}</div>}
        </div>
      )}
    </div>
  );
}

export function ProjectModal({ id }) {
  const [data, setData] = useState(null);
  const [err,  setErr]  = useState(false);

  useEffect(() => {
    db.from('projects').select('*').eq('id', id).single()
      .then(({ data: d, error }) => { if (error || !d) setErr(true); else setData(d); });
  }, [id]);

  if (err) return <><div className="modal-tag">⚡ Projet</div><h2 style={{ color: 'var(--text-muted)' }}>Projet introuvable</h2></>;
  if (!data) return <div style={{ padding: '2rem', textAlign: 'center' }}><i className="fas fa-spinner fa-spin" /></div>;

  const imgs = [data.image1_path, data.image2_path].filter(Boolean);
  return (
    <>
      <div className="modal-tag">⚡ Projet</div>
      <h2>{data.title}</h2>
      {imgs.length > 0 && <div className="modal-images">{imgs.map((s, i) => <img key={i} src={s} alt="" />)}</div>}
      <div dangerouslySetInnerHTML={{ __html: nl2br(data.full_description || data.short_description || '') }} />
      {data.link && <a className="modal-link" href={data.link} target="_blank" rel="noopener"><i className="fas fa-external-link-alt" /> Voir le projet</a>}
    </>
  );
}

export function BlogModal({ id, table }) {
  const [data, setData] = useState(null);
  const [err,  setErr]  = useState(false);
  const tag   = table === 'blog' ? '📝 Article' : '🎓 Tutoriel';
  const { counts, mine, toggle } = useReactions(id, table === 'blog' ? 'blog' : 'tuto');

  useEffect(() => {
    db.from(table).select('*').eq('id', id).single()
      .then(({ data: d, error }) => { if (error || !d) setErr(true); else setData(d); });
  }, [id, table]);

  if (err) return <><div className="modal-tag">{tag}</div><h2 style={{ color: 'var(--text-muted)' }}>Contenu introuvable</h2></>;
  if (!data) return <div style={{ padding: '2rem', textAlign: 'center' }}><i className="fas fa-spinner fa-spin" /></div>;

  const imgs        = [data.image1_path, data.image2_path].filter(Boolean);
  const contentType = table === 'blog' ? 'blog' : 'tuto';

  return (
    <>
      <div className="modal-tag">{tag}</div>
      <h2>{data.title}</h2>
      <p style={{ fontSize: '.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-code)', marginBottom: 16 }}>{formatDate(data.created_at)}</p>
      {imgs.length > 0 && <div className="modal-images">{imgs.map((s, i) => <img key={i} src={s} alt="" />)}</div>}
      <div style={{ marginBottom: 24 }} dangerouslySetInnerHTML={{ __html: nl2br(data.full_description || data.short_description || '') }} />
      <div className="reactions-bar">
        <button className={`reaction-btn${mine === 'like' ? ' active' : ''}`} onClick={() => toggle('like')}>
          <i className="fas fa-thumbs-up" /> <span>{counts.like}</span>
        </button>
        <button className={`reaction-btn${mine === 'dislike' ? ' active' : ''}`} onClick={() => toggle('dislike')}>
          <i className="fas fa-thumbs-down" /> <span>{counts.dislike}</span>
        </button>
      </div>
      <CommentsSection contentId={id} contentType={contentType} />
    </>
  );
}

export function CollabModal({ id }) {
  const [data, setData] = useState(null);
  const [err,  setErr]  = useState(false);

  useEffect(() => {
    db.from('collaborations').select('*').eq('id', id).single()
      .then(({ data: d, error }) => { if (error || !d) setErr(true); else setData(d); });
  }, [id]);

  if (err) return <><div className="modal-tag">🤝 Collab</div><h2 style={{ color: 'var(--text-muted)' }}>Collaboration introuvable</h2></>;
  if (!data) return <div style={{ padding: '2rem', textAlign: 'center' }}><i className="fas fa-spinner fa-spin" /></div>;

  const imgs    = [data.image1_path, data.image2_path].filter(Boolean);
  const collabs = data.collaborateurs || [];

  return (
    <>
      <div className="modal-tag">🤝 Collab</div>
      <h2>{data.title}</h2>
      {collabs.length > 0 && (
        <div className="collab-persons modal-collabs">
          {collabs.map((col, i) => (
            <div key={i} className="collab-person">
              {col.avatar
                ? <img src={col.avatar} alt={col.nom} className="collab-avatar" onError={e => e.target.style.display = 'none'} />
                : <div className="collab-avatar collab-avatar-fallback">{col.nom?.charAt(0)?.toUpperCase() || '?'}</div>
              }
              <div className="collab-person-info">
                <span className="collab-name">{col.nom || ''}</span>
                {col.github  && <a href={col.github} target="_blank" rel="noopener" className="collab-link"><i className="fab fa-github" /></a>}
                {col.discord && <span className="collab-discord"><i className="fab fa-discord" /> {col.discord}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
      {imgs.length > 0 && <div className="modal-images">{imgs.map((s, i) => <img key={i} src={s} alt="" />)}</div>}
      <div dangerouslySetInnerHTML={{ __html: nl2br(data.full_description || data.short_description || '') }} />
      {data.link && <a className="modal-link" href={data.link} target="_blank" rel="noopener"><i className="fas fa-external-link-alt" /> Voir le projet</a>}
    </>
  );
}