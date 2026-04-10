import { useEffect } from 'react';
import { db } from '../lib/supabase';

export default function AuthCallback() {
  useEffect(() => {
    const run = async () => {
      const { data: { session } } = await db.auth.getSession();

      if (session && window.opener) {
        localStorage.setItem('loginProvider', 'discord');
        try {
          window.opener.postMessage({ type: 'DISCORD_LOGIN_SUCCESS' }, window.location.origin);
        } catch (_) {}
        window.close();
        return;
      }

      const { data: { subscription } } = db.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          localStorage.setItem('loginProvider', 'discord');
          if (window.opener) {
            try {
              window.opener.postMessage({ type: 'DISCORD_LOGIN_SUCCESS' }, window.location.origin);
            } catch (_) {}
            window.close();
          }
          subscription.unsubscribe();
        }
      });
    };

    run();
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#080b10', color: '#e8eaf0', fontFamily: 'var(--font-body)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          <i className="fab fa-discord" style={{ color: '#5865f2' }} />
        </div>
        <p>Connexion en cours…</p>
      </div>
    </div>
  );
}