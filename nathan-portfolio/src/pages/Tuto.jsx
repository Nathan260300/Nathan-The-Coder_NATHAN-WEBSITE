import { motion } from 'framer-motion';
import { useModal } from '../hooks/useModal';
import { usePageData } from '../hooks/usePageData';
import { useReadyAnimate } from '../hooks/useReadyAnimate';
import { Card, PageHero, EmptyState, ErrorState } from '../components/ui';
import { BlogModal } from '../components/ui/Modals';
import { useDeepLink } from '../hooks/useDeepLink.jsx';
import { staggerContainer, cardVariant, fadeUp } from '../lib/motion';

export default function Tuto() {
  const animate                                    = useReadyAnimate();
  const { openModal }                              = useModal();
  useDeepLink();
  const { items: tutos, content, error, loading }  = usePageData('tutos', 'tuto', { order: 'created_at' });

  const openTuto = (id) => {
    const params = new URLSearchParams(window.location.search);
    params.set('tuto', id);
    window.history.pushState({}, '', '?' + params.toString());
    openModal(<BlogModal id={id} table="tutos" />);
  };

  return (
    <>
      <motion.div variants={fadeUp} initial="hidden" animate={animate}>
        <PageHero content={content} label="Tutoriels" title="Apprends avec moi" subtitle="Des tutoriels complets avec extraits de code et conseils pratiques." />
      </motion.div>
      <div className="page-content">
        {!error && !loading && (
          <motion.div className="cards-grid" variants={staggerContainer(0.07, 0.1)} initial="hidden" animate={animate}>
            {tutos.length
              ? tutos.map(t => (
                  <motion.div key={t.id} variants={cardVariant}>
                    <Card item={t} tag="🎓 Tuto" onClick={() => openTuto(t.id)} />
                  </motion.div>
                ))
              : <EmptyState message="Aucun tutoriel pour le moment." />
            }
          </motion.div>
        )}
        {error && <div className="cards-grid"><ErrorState message={error} /></div>}
      </div>
    </>
  );
}
