import { useEffect, useState } from 'react';
import { fetchTable, fetchPageContent } from '../lib/supabase';

export function usePageData(table, pageKey, opts = {}) {
  const [items,   setItems]   = useState([]);
  const [content, setContent] = useState(null);
  const [error,   setError]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetchPageContent(pageKey),
      fetchTable(table, opts),
    ]).then(([pc, result]) => {
      if (pc.status === 'fulfilled') setContent(pc.value);
      if (result.status === 'fulfilled') setItems(result.value);
      else setError(result.reason?.message);
      setLoading(false);
    });
  }, []);

  return { items, content, error, loading };
}
