import { useEffect, useState } from 'react';
import { fetchTable, fetchPageContent } from '../lib/supabase';
import { PageHero, EmptyState, ErrorState, Loader } from '../components/ui';

export default function Ressources() {
  const [items,   setItems]   = useState([]);
  const [content, setContent] = useState(null);
  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetchPageContent('ressources'),
      fetchTable('ressources', { order: 'created_at' }),
    ]).then(([pc, result]) => {
      if (pc.status === 'fulfilled') setContent(pc.value);
      if (result.status === 'fulfilled') setItems(result.value);
      else setError(result.reason?.message);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <PageHero content={content} label="Ressources" title="Outils & liens utiles" subtitle="Ma sélection d'outils, sites, extensions et APIs pour le développement web." />
      <div className="page-content">
        <div className="cards-grid">
          {error ? (
            <ErrorState message={error} />
          ) : items.length ? (
            items.map(r => {
              let hostname = '';
              try { hostname = new URL(r.link).hostname; } catch (_) {}
              return (
                <a
                  key={r.id}
                  className="card"
                  href={r.link || undefined}
                  target={r.link ? '_blank' : undefined}
                  rel={r.link ? 'noopener' : undefined}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div className="card-tag">🔗 {r.category || 'Ressource'}</div>
                  <h3>{r.title || r.name || ''}</h3>
                  <p>{r.short_description || r.description || ''}</p>
                  {r.link && (
                    <div className="card-meta">
                      <span>{hostname}</span>
                      <span className="card-arrow">↗</span>
                    </div>
                  )}
                </a>
              );
            })
          ) : (
            <EmptyState message="Aucune ressource pour le moment." />
          )}
        </div>
      </div>
    </>
  );
}
