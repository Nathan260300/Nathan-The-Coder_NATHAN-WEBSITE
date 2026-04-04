import { getState, setState } from './state.js';

const SUPABASE_URL     = 'https://hscsixqyszamzayemyra.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mn40HNV14AbJmXA3veAqMQ_VdkOEPFd';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

async function fetchTable(table, opts = {}) {
  let query = db.from(table).select('*');
  if (opts.order) query = query.order(opts.order, { ascending: opts.asc ?? false });
  if (opts.limit) query = query.limit(opts.limit);
  if (opts.eq)    query = query.eq(opts.eq[0], opts.eq[1]);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async function fetchPageContent(page) {
  try {
    const { data } = await db.from('page_content').select('*').eq('page', page).single();
    return data || null;
  } catch(_) { return null; }
}

function getDiscordUser() {
  const user = getState('currentUser');
  if (!user) return null;
  return {
    id:         user.id,
    username:   user.user_metadata?.full_name || user.user_metadata?.name || 'Inconnu',
    avatar_url: user.user_metadata?.avatar_url || null,
    discord_id: user.user_metadata?.provider_id || null,
  };
}

async function loginWithDiscord() {
  const { data, error } = await db.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      scopes: 'identify',
      skipBrowserRedirect: true,
      redirectTo: window.location.origin + window.location.pathname + window.location.search,
    },
  });
  if (error) { console.error('OAuth error:', error.message); return; }
  window.open(data.url, 'discord-oauth', 'width=500,height=700,left=400,top=100');
}

async function logout() {
  await db.auth.signOut();
  setState('currentUser', null);
}

export { db, SUPABASE_URL, SUPABASE_ANON_KEY, fetchTable, fetchPageContent, getDiscordUser, loginWithDiscord, logout };
