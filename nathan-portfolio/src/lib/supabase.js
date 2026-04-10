import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = 'https://hscsixqyszamzayemyra.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mn40HNV14AbJmXA3veAqMQ_VdkOEPFd';

export const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession:     true,
    autoRefreshToken:   true,
    detectSessionInUrl: true,
  },
});

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

export async function loginWithDiscord() {
  const { data, error } = await db.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      scopes:              'identify',
      skipBrowserRedirect: true,
      redirectTo:          window.location.origin + '/auth/callback',
    },
  });
  if (error) { console.error('OAuth error:', error.message); return; }
  window.open(data.url, 'discord-oauth', 'width=500,height=700,left=400,top=100');
}

export async function logout() {
  await db.auth.signOut();
}