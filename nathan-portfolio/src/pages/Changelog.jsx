import { useEffect, useState } from 'react';
import { fetchTable, fetchPageContent } from '../lib/supabase';
import { PageHero, EmptyState, ErrorState, Loader } from '../components/ui';
import { formatDate } from '../lib/utils';

export default function Changelog() {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState(null);
  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetchPageContent('changelog'),
      fetchTable('changelog', { order: 'created_at' }),
    ]).then(([pc, result]) => {
      if (pc.status === 'fulfilled') setContent(pc.value);
      if (result.status === 'fulfilled') setEntries(result.value);
      else setError(result.reason?.message);
      setLoading(false);
    });
  }, []);

  const badgeLabel = (type) => {
    if (type === 'feature') return '✨ Nouveau';
    if (type === 'fix')     return '🐛 Fix';
    return '🔄 Mise à jour';
  };

  if (loading) return <Loader />;

  return (
    <>
      <PageHero content={content} label="Changelog" title="Historique des mises à jour" subtitle="Toutes les évolutions de mon portfolio et de mes projets." />
      <div className="page-content">
        <div className="changelog-timeline">
          {error ? (
            <ErrorState message={error} />
          ) : entries.length ? (
            entries.map(e => (
              <div key={e.id} className="changelog-entry">
                <div className="changelog-version">
                  {formatDate(e.created_at)}{e.version ? ` — v${e.version}` : ''}
                </div>
                <div className="changelog-card">
                  <div className={`badge-type ${e.type || 'update'}`}>{badgeLabel(e.type)}</div>
                  <h3>{e.title || ''}</h3>
                  <p>{e.description || ''}</p>
                </div>
              </div>
            ))
          ) : (
            <EmptyState message="Aucun changelog pour le moment." />
          )}
        </div>
      </div>
    </>
  );
}
