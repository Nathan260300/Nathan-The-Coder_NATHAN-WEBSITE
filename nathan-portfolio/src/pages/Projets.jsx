import { useEffect, useState } from 'react';
import { fetchTable, fetchPageContent } from '../lib/supabase';
import { Card, PageHero, EmptyState, ErrorState, Loader } from '../components/ui';
import { useModal } from '../hooks/useModal';
import { ProjectModal } from '../components/ui/Modals';
import { useDeepLink } from '../hooks/useDeepLink.jsx';

export default function Projets() {
  const { openModal } = useModal();
  useDeepLink();
  const [projects, setProjects] = useState([]);
  const [content,  setContent]  = useState(null);
  const [error,    setError]    = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetchPageContent('projets'),
      fetchTable('projects', { order: 'created_at' }),
    ]).then(([pc, proj]) => {
      if (pc.status === 'fulfilled') setContent(pc.value);
      if (proj.status === 'fulfilled') setProjects(proj.value);
      else setError(proj.reason?.message);
      setLoading(false);
    });
  }, []);

  const openProject = (id) => {
    const params = new URLSearchParams(window.location.search);
    params.set('projet', id);
    window.history.pushState({}, '', '?' + params.toString());
    openModal(<ProjectModal id={id} />);
  };

  if (loading) return <Loader />;

  return (
    <>
      <PageHero content={content} label="Projets" title="Mes créations" subtitle="Sites web, dashboards, outils et bots Discord — tout ce que j'ai construit." />
      <div className="page-content">
        <div className="cards-grid">
          {error
            ? <ErrorState message={error} />
            : projects.length
              ? projects.map(p => <Card key={p.id} item={p} tag="⚡ Projet" onClick={() => openProject(p.id)} />)
              : <EmptyState message="Aucun projet pour le moment." />
          }
        </div>
      </div>
    </>
  );
}