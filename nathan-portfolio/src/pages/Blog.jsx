import { motion } from 'framer-motion';
import { useModal } from '../hooks/useModal';
import { usePageData } from '../hooks/usePageData';
import { useReadyAnimate } from '../hooks/useReadyAnimate';
import { Card, PageHero, EmptyState, ErrorState } from '../components/ui';
import { BlogModal } from '../components/ui/Modals';
import { useDeepLink } from '../hooks/useDeepLink.jsx';
import { staggerContainer, cardVariant, fadeUp } from '../lib/motion';

export default function Blog() {
  const animate                                  = useReadyAnimate();
  const { openModal }                            = useModal();
  useDeepLink();
  const { items: all, content, error, loading }  = usePageData('blog', 'blog', { order: 'created_at' });
  const now = new Date(); now.setHours(0,0,0,0);
  const posts = all.filter(p => { const d = new Date(p.created_at); d.setHours(0,0,0,0); return d <= now; });

  const openPost = (id) => {
    const params = new URLSearchParams(window.location.search);
    params.set('blog', id);
    window.history.pushState({}, '', '?' + params.toString());
    openModal(<BlogModal id={id} table="blog" />);
  };

  return (
    <>
      <motion.div variants={fadeUp} initial="hidden" animate={animate}>
        <PageHero content={content} label="Blog" title="Articles & réflexions" subtitle="Astuces web, retours d'expérience et réflexions sur le développement numérique." />
      </motion.div>
      <div className="page-content">
        {!error && !loading && (
          <motion.div className="cards-grid" variants={staggerContainer(0.07, 0.1)} initial="hidden" animate={animate}>
            {posts.length
              ? posts.map(p => (
                  <motion.div key={p.id} variants={cardVariant}>
                    <Card item={p} tag="📝 Article" onClick={() => openPost(p.id)} />
                  </motion.div>
                ))
              : <EmptyState message="Aucun article pour le moment." />
            }
          </motion.div>
        )}
        {error && <div className="cards-grid"><ErrorState message={error} /></div>}
      </div>
    </>
  );
}
