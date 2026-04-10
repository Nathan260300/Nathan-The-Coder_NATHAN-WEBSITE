import { useEffect, useState } from 'react';
import { fetchTable, fetchPageContent } from '../lib/supabase';
import { Card, PageHero, EmptyState, ErrorState, Loader } from '../components/ui';
import { useModal } from '../hooks/useModal';
import { BlogModal } from '../components/ui/Modals';
import { useDeepLink } from '../hooks/useDeepLink.jsx';

export default function Tuto() {
  const { openModal } = useModal();
  useDeepLink();
  const [tutos,   setTutos]   = useState([]);
  const [content, setContent] = useState(null);
  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetchPageContent('tuto'),
      fetchTable('tutos', { order: 'created_at' }),
    ]).then(([pc, result]) => {
      if (pc.status === 'fulfilled') setContent(pc.value);
      if (result.status === 'fulfilled') setTutos(result.value);
      else setError(result.reason?.message);
      setLoading(false);
    });
  }, []);

  const openTuto = (id) => {
    const params = new URLSearchParams(window.location.search);
    params.set('tuto', id);
    window.history.pushState({}, '', '?' + params.toString());
    openModal(<BlogModal id={id} table="tutos" />);
  };

  if (loading) return <Loader />;

  return (
    <>
      <PageHero content={content} label="Tutoriels" title="Apprends avec moi" subtitle="Des tutoriels complets avec extraits de code et conseils pratiques." />
      <div className="page-content">
        <div className="cards-grid">
          {error
            ? <ErrorState message={error} />
            : tutos.length
              ? tutos.map(t => <Card key={t.id} item={t} tag="🎓 Tuto" onClick={() => openTuto(t.id)} />)
              : <EmptyState message="Aucun tutoriel pour le moment." />
          }
        </div>
      </div>
    </>
  );
}