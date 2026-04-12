import { motion } from 'framer-motion';
import { useModal } from '../hooks/useModal';
import { usePageData } from '../hooks/usePageData';
import { useReadyAnimate } from '../hooks/useReadyAnimate';
import { PageHero, EmptyState, ErrorState } from '../components/ui';
import { CollabModal } from '../components/ui/Modals';
import { useDeepLink } from '../hooks/useDeepLink.jsx';
import { formatDate } from '../lib/utils';
import { staggerContainer, cardVariant, fadeUp } from '../lib/motion';

export default function Collaborations() {
  const animate                                       = useReadyAnimate();
  const { openModal }                                 = useModal();
  useDeepLink();
  const { items: collabs, content, error, loading }   = usePageData('collaborations', 'collaborations', { order: 'created_at' });

  const openCollab = (id) => {
    const params = new URLSearchParams(window.location.search);
    params.set('collab', id);
    window.history.pushState({}, '', '?' + params.toString());
    openModal(<CollabModal id={id} />);
  };

  return (
    <>
      <motion.div variants={fadeUp} initial="hidden" animate={animate}>
        <PageHero content={content} label="Collaborations" title="Mes collabs" subtitle="Projets réalisés en collaboration avec d'autres développeurs et créateurs." />
      </motion.div>
      <div className="page-content">
        {!error && !loading && (
          <motion.div className="cards-grid" variants={staggerContainer(0.07, 0.1)} initial="hidden" animate={animate}>
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
              : <EmptyState message="Aucune collaboration pour le moment." />
            }
          </motion.div>
        )}
        {error && <div className="cards-grid"><ErrorState message={error} /></div>}
      </div>
    </>
  );
}
