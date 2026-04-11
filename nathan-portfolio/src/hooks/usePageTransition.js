import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNavProgress } from './useNavProgress';

export function usePageTransition() {
  const location          = useLocation();
  const navigate          = useNavigate();
  const { start, finish } = useNavProgress();
  const pendingRef        = useRef(false);

  useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href) return;
      if (href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('#')) return;
      if (link.target === '_blank') return;
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === location.pathname && !url.search) return;
      if (pendingRef.current) return;
      e.preventDefault();
      pendingRef.current = true;
      start();
      navigate(url.pathname + url.search);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [location.pathname, navigate, start]);

  useEffect(() => {
    pendingRef.current = false;
    finish();
  }, [location.pathname]);
}