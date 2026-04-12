import { useEffect, useState } from 'react';
import { fetchStats } from '../lib/supabase';

export function useStats() {
  const [stats,   setStats]   = useState({ projects: '—', blog: '—', tutos: '—' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats().then(s => { setStats(s); setLoading(false); });
  }, []);

  return { stats, loading };
}
