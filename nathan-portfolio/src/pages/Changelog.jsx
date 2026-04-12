import { motion } from 'framer-motion';
import { usePageData } from '../hooks/usePageData';
import { useReadyAnimate } from '../hooks/useReadyAnimate';
import { PageHero, EmptyState, ErrorState } from '../components/ui';
import { formatDate } from '../lib/utils';
import { fadeUp } from '../lib/motion';

const badgeLabel = (type) => {
  if (type === 'feature') return '✨ Nouveau';
  if (type === 'fix')     return '🐛 Fix';
  return '🔄 Mise à jour';
};

export default function Changelog() {
  const animate                                    = useReadyAnimate();
  const { items: entries, content, error, loading } = usePageData('changelog', 'changelog', { order: 'created_at' });

  return (
    <>
      <motion.div variants={fadeUp} initial="hidden" animate={animate}>
        <PageHero content={content} label="Changelog" title="Historique des mises à jour" subtitle="Toutes les évolutions de mon portfolio et de mes projets." />
      </motion.div>
      <div className="page-content">
        {error && <ErrorState message={error} />}
        {!error && !loading && (
          entries.length
            ? (
              <div className="changelog-timeline">
                {entries.map((e, i) => (
                  <motion.div
                    key={e.id}
                    className="changelog-entry"
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
                  >
                    <div className="changelog-version">
                      {formatDate(e.created_at)}{e.version ? ` — v${e.version}` : ''}
                    </div>
                    <div className="changelog-card">
                      <div className={`badge-type ${e.type || 'update'}`}>{badgeLabel(e.type)}</div>
                      <h3>{e.title || ''}</h3>
                      <p>{e.description || ''}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )
            : <EmptyState message="Aucun changelog pour le moment." />
        )}
      </div>
    </>
  );
}
