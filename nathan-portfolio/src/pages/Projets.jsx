import { motion } from 'framer-motion';
import { useModal } from '../hooks/useModal';
import { usePageData } from '../hooks/usePageData';
import { useReadyAnimate } from '../hooks/useReadyAnimate';
import { Card, PageHero, EmptyState, ErrorState } from '../components/ui';
import { ProjectModal } from '../components/ui/Modals';
import { useDeepLink } from '../hooks/useDeepLink.jsx';
import { staggerContainer, cardVariant, fadeUp } from '../lib/motion';

export default function Projets() {
  const animate                                    = useReadyAnimate();
  const { openModal }                              = useModal();
  useDeepLink();
  const { items: projects, content, error, loading } = usePageData('projects', 'projets', { order: 'created_at' });

  const openProject = (id) => {
    const params = new URLSearchParams(window.location.search);
    params.set('projet', id);
    window.history.pushState({}, '', '?' + params.toString());
    openModal(<ProjectModal id={id} />);
  };

  return (
    <>
      <motion.div variants={fadeUp} initial="hidden" animate={animate}>
        <PageHero content={content} label="Projets" title="Mes créations" subtitle="Sites web, dashboards, outils et bots Discord — tout ce que j'ai construit." />
      </motion.div>
      <div className="page-content">
        {!error && !loading && (
          <motion.div className="cards-grid" variants={staggerContainer(0.07, 0.1)} initial="hidden" animate={animate}>
            {projects.length
              ? projects.map(p => (
                  <motion.div key={p.id} variants={cardVariant}>
                    <Card item={p} tag="⚡ Projet" onClick={() => openProject(p.id)} />
                  </motion.div>
                ))
              : <EmptyState message="Aucun projet pour le moment." />
            }
          </motion.div>
        )}
        {error && <div className="cards-grid"><ErrorState message={error} /></div>}
      </div>
    </>
  );
}
