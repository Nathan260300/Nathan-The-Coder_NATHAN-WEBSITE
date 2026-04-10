import { useEffect, useState } from 'react';
import { fetchTable, fetchPageContent } from '../lib/supabase';
import { PageHero, EmptyState, ErrorState, Loader } from '../components/ui';
import { useModal } from '../hooks/useModal';
import { CollabModal } from '../components/ui/Modals';
import { useDeepLink } from '../hooks/useDeepLink.jsx';
import { formatDate } from '../lib/utils';

export default function Collaborations() {
  const { openModal } = useModal();
  useDeepLink();
  const [collabs,  setCollabs]  = useState([]);
  const [content,  setContent]  = useState(null);
  const [error,    setError]    = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetchPageContent('collaborations'),
      fetchTable('collaborations', { order: 'created_at' }),
    ]).then(([pc, result]) => {
      if (pc.status === 'fulfilled') setContent(pc.value);
      if (result.status === 'fulfilled') setCollabs(result.value);
      else setError(result.reason?.message);
      setLoading(false);
    });
  }, []);

  const openCollab = (id) => {
    const params = new URLSearchParams(window.location.search);
    params.set('collab', id);
    window.history.pushState({}, '', '?' + params.toString());
    openModal(<CollabModal id={id} />);
  };

  if (loading) return <Loader />;

  return (
    <>
      <PageHero content={content} label="Collaborations" title="Mes collabs" subtitle="Projets réalisés en collaboration avec d'autres développeurs et créateurs." />
      <div className="page-content">
        <div className="cards-grid">
          {error ? (
            <ErrorState message={error} />
          ) : collabs.length ? (
            collabs.map(c => {
              const persons = c.collaborateurs || [];
              return (
                <article key={c.id} className="card" onClick={() => openCollab(c.id)} style={{ cursor: 'pointer' }}>
                  <div className="card-tag">🤝 Collab</div>
                  <h3>{c.title || ''}</h3>
                  <p>{c.short_description || ''}</p>
                  {persons.length > 0 && (
                    <div className="collab-persons">
                      {persons.map((col, i) => (
                        <div key={i} className="collab-person">
                          {col.avatar
                            ? <img src={col.avatar} alt={col.nom} className="collab-avatar" onError={e => e.target.style.display = 'none'} />
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
                </article>
              );
            })
          ) : (
            <EmptyState message="Aucune collaboration pour le moment." />
          )}
        </div>
      </div>
    </>
  );
}