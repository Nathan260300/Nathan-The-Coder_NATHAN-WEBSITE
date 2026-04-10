import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,          setUser]          = useState(null);
  const [loginProvider, setLoginProvider] = useState(() => localStorage.getItem('loginProvider') || null);
  const [ready,         setReady]         = useState(false);

  useEffect(() => {
    db.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setReady(true);
    });

    const { data: { subscription } } = db.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);

      if (event === 'SIGNED_IN') {
        const provider = localStorage.getItem('loginProvider') || 'discord';
        setLoginProvider(provider);
        localStorage.setItem('loginProvider', provider);

        if (window.opener) {
          try {
            window.opener.postMessage({ type: 'DISCORD_LOGIN_SUCCESS' }, window.location.origin);
            window.close();
          } catch (_) {}
        }
      }

      if (event === 'SIGNED_OUT') {
        setLoginProvider(null);
        localStorage.removeItem('loginProvider');
      }
    });

    const onMessage = async (e) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type !== 'DISCORD_LOGIN_SUCCESS') return;
      const { data: { session } } = await db.auth.getSession();
      if (!session) return;
      setUser(session.user);
      const provider = localStorage.getItem('loginProvider') || 'discord';
      setLoginProvider(provider);
    };

    window.addEventListener('message', onMessage);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('message', onMessage);
    };
  }, []);

  const getDiscordUser = () => {
    if (!user || loginProvider === 'email') return null;
    return {
      id:         user.id,
      username:   user.user_metadata?.full_name || user.user_metadata?.name || 'Inconnu',
      avatar_url: user.user_metadata?.avatar_url || null,
      discord_id: user.user_metadata?.provider_id || null,
    };
  };

  const doLogout = async () => {
    await db.auth.signOut();
    setUser(null);
    setLoginProvider(null);
    localStorage.removeItem('loginProvider');
  };

  return (
    <AuthContext.Provider value={{ user, loginProvider, setLoginProvider, getDiscordUser, ready, doLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}