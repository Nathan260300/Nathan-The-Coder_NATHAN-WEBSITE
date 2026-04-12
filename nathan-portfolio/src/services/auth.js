import { db } from '../lib/supabase';

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
