import { useEffect, useState } from 'react';
import { fetchTable } from '../lib/supabase';

export function useProjects(limit) {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    fetchTable('projects', { order: 'created_at', ...(limit ? { limit } : {}) })
      .then(data => { setProjects(data); setLoading(false); })
      .catch(err  => { setError(err.message); setLoading(false); });
  }, []);

  return { projects, loading, error };
}
