import { db } from '../lib/supabase';

export async function fetchTable(table, opts = {}) {
  let query = db.from(table).select('*');
  if (opts.order) query = query.order(opts.order, { ascending: opts.asc ?? false });
  if (opts.limit) query = query.limit(opts.limit);
  if (opts.eq)    query = query.eq(opts.eq[0], opts.eq[1]);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function fetchPageContent(page) {
  try {
    const { data } = await db.from('page_content').select('*').eq('page', page).single();
    return data || null;
  } catch (_) { return null; }
}

export async function fetchById(table, id) {
  const { data, error } = await db.from(table).select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function fetchStats() {
  const [p, b, t] = await Promise.allSettled([
    db.from('projects').select('id', { count: 'exact', head: true }),
    db.from('blog').select('id',     { count: 'exact', head: true }),
    db.from('tutos').select('id',    { count: 'exact', head: true }),
  ]);
  return {
    projects: p.status === 'fulfilled' ? p.value.count : '?',
    blog:     b.status === 'fulfilled' ? b.value.count : '?',
    tutos:    t.status === 'fulfilled' ? t.value.count : '?',
  };
}
