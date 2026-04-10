import { useEffect, useState } from 'react';
import { fetchTable, fetchPageContent } from '../lib/supabase';
import { Card, PageHero, EmptyState, ErrorState, Loader } from '../components/ui';
import { useModal } from '../hooks/useModal';
import { BlogModal } from '../components/ui/Modals';
import { useDeepLink } from '../hooks/useDeepLink.jsx';

export default function Blog() {
  const { openModal } = useModal();
  useDeepLink();
  const [posts,   setPosts]   = useState([]);
  const [content, setContent] = useState(null);
  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetchPageContent('blog'),
      fetchTable('blog', { order: 'created_at' }),
    ]).then(([pc, result]) => {
      if (pc.status === 'fulfilled') setContent(pc.value);
      if (result.status === 'fulfilled') {
        const now = new Date(); now.setHours(0, 0, 0, 0);
        setPosts(result.value.filter(p => { const d = new Date(p.created_at); d.setHours(0, 0, 0, 0); return d <= now; }));
      } else setError(result.reason?.message);
      setLoading(false);
    });
  }, []);

  const openPost = (id) => {
    const params = new URLSearchParams(window.location.search);
    params.set('blog', id);
    window.history.pushState({}, '', '?' + params.toString());
    openModal(<BlogModal id={id} table="blog" />);
  };

  if (loading) return <Loader />;

  return (
    <>
      <PageHero content={content} label="Blog" title="Articles & réflexions" subtitle="Astuces web, retours d'expérience et réflexions sur le développement numérique." />
      <div className="page-content">
        <div className="cards-grid">
          {error
            ? <ErrorState message={error} />
            : posts.length
              ? posts.map(p => <Card key={p.id} item={p} tag="📝 Article" onClick={() => openPost(p.id)} />)
              : <EmptyState message="Aucun article pour le moment." />
          }
        </div>
      </div>
    </>
  );
}