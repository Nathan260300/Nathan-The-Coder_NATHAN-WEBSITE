import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useModal } from './useModal';
import { ProjectModal, BlogModal, CollabModal } from '../components/ui/Modals';

export function useDeepLink() {
  const location    = useLocation();
  const { openModal } = useModal();

  useEffect(() => {
    const params  = new URLSearchParams(location.search);
    const projet  = params.get('projet');
    const blog    = params.get('blog');
    const tuto    = params.get('tuto');
    const collab  = params.get('collab');

    if (projet) openModal(<ProjectModal id={projet} />);
    else if (blog)   openModal(<BlogModal id={blog}   table="blog" />);
    else if (tuto)   openModal(<BlogModal id={tuto}   table="tutos" />);
    else if (collab) openModal(<CollabModal id={collab} />);
  }, []);
}