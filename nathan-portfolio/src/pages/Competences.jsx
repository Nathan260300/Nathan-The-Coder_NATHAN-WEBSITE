import { useEffect, useState } from 'react';
import { fetchTable, fetchPageContent } from '../lib/supabase';
import { PageHero, EmptyState, ErrorState, Loader } from '../components/ui';

export default function Competences() {
  const [groups,  setGroups]  = useState({});
  const [content, setContent] = useState(null);
  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetchPageContent('competences'),
      fetchTable('competences', { order: 'order_index', asc: true }),
    ]).then(([pc, result]) => {
      if (pc.status === 'fulfilled') setContent(pc.value);
      if (result.status === 'fulfilled') {
        const grouped = {};
        result.value.forEach(skill => {
          const cat = skill.category || 'Autres';
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push(skill);
        });
        setGroups(grouped);
      } else setError(result.reason?.message);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <PageHero content={content} label="Compétences" title="Mon savoir-faire" subtitle="Langages, outils et technologies que je maîtrise ou que j'explore." />
      <div className="page-content">
        <div className="competences-wrapper">
          {error ? (
            <ErrorState message={error} />
          ) : !Object.keys(groups).length ? (
            <EmptyState message="Aucune compétence renseignée pour le moment." />
          ) : (
            Object.entries(groups).map(([cat, skills]) => (
              <div key={cat} className="skill-group">
                <h3 className="skill-group-title">{cat}</h3>
                <div className="skill-cards-row">
                  {skills.map(s => (
                    <div key={s.id} className="skill-card">
                      <div className="skill-card-top">
                        {s.icon && <span className="skill-icon">{s.icon}</span>}
                        <span className="skill-name">{s.name}</span>
                        {s.level != null && <span className="skill-level-badge">{s.level}%</span>}
                      </div>
                      {s.level != null && (
                        <div className="skill-bar-track">
                          <div className="skill-bar-fill" style={{ '--skill-w': `${s.level}%` }} />
                        </div>
                      )}
                      {s.description && <p className="skill-desc">{s.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
