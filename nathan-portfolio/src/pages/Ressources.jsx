import { motion } from 'framer-motion';
import { usePageData } from '../hooks/usePageData';
import { useReadyAnimate } from '../hooks/useReadyAnimate';
import { PageHero, EmptyState, ErrorState } from '../components/ui';
import { staggerContainer, cardVariant, fadeUp } from '../lib/motion';

export default function Ressources() {
  const animate                                   = useReadyAnimate();
  const { items, content, error, loading }        = usePageData('ressources', 'ressources', { order: 'created_at' });

  return (
    <>
      <motion.div variants={fadeUp} initial="hidden" animate={animate}>
        <PageHero content={content} label="Ressources" title="Outils & liens utiles" subtitle="Ma sélection d'outils, sites, extensions et APIs pour le développement web." />
      </motion.div>
      <div className="page-content">
        {!error && !loading && (
          <motion.div className="cards-grid" variants={staggerContainer(0.07, 0.1)} initial="hidden" animate={animate}>
            {items.length
              ? items.map(r => {
                  let hostname = '';
                  try { hostname = new URL(r.link).hostname; } catch (_) {}
                  return (
                    <motion.a
                      key={r.id}
                      className="card"
                      href={r.link || undefined}
                      target={r.link ? '_blank' : undefined}
                      rel={r.link ? 'noopener' : undefined}
                      style={{ textDecoration: 'none', display: 'block' }}
                      variants={cardVariant}
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
                    </motion.a>
                  );
                })
              : <EmptyState message="Aucune ressource pour le moment." />
            }
          </motion.div>
        )}
        {error && <div className="cards-grid"><ErrorState message={error} /></div>}
      </div>
    </>
  );
}
