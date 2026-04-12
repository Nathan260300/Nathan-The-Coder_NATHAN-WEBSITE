import { motion } from 'framer-motion';
import { usePageData } from '../hooks/usePageData';
import { useReadyAnimate } from '../hooks/useReadyAnimate';
import { PageHero, EmptyState, ErrorState } from '../components/ui';
import { staggerContainer, cardVariant, fadeUp, slideRight } from '../lib/motion';

export default function Competences() {
  const animate                            = useReadyAnimate();
  const { items, content, error, loading } = usePageData('competences', 'competences', { order: 'order_index', asc: true });

  const groups = {};
  items.forEach(s => {
    const cat = s.category || 'Autres';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(s);
  });

  return (
    <>
      <motion.div variants={fadeUp} initial="hidden" animate={animate}>
        <PageHero content={content} label="Compétences" title="Mon savoir-faire" subtitle="Langages, outils et technologies que je maîtrise ou que j'explore." />
      </motion.div>
      <div className="page-content">
        {error && <ErrorState message={error} />}
        {!error && !loading && (
          !Object.keys(groups).length
            ? <EmptyState message="Aucune compétence renseignée pour le moment." />
            : (
              <div className="competences-wrapper">
                {Object.entries(groups).map(([cat, skills], gi) => (
                  <motion.div
                    key={cat}
                    className="skill-group"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.45, delay: gi * 0.06 }}
                  >
                    <motion.h3
                      className="skill-group-title"
                      variants={slideRight}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      {cat}
                    </motion.h3>
                    <motion.div
                      className="skill-cards-row"
                      variants={staggerContainer(0.06, 0.05)}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: '-40px' }}
                    >
                      {skills.map(s => (
                        <motion.div key={s.id} className="skill-card" variants={cardVariant}>
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
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )
        )}
      </div>
    </>
  );
}
