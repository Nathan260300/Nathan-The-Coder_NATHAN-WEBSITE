import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/supabase';
import { formatDate } from '../../lib/utils';

export default function Footer() {
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    db.from('changelog')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data?.created_at) setLastUpdate(`Dernière MAJ : ${formatDate(data.created_at)}`);
      })
      .catch(() => {});
  }, []);

  return (
    <footer id="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-top">
            <img src="/nathan.jpg" alt="" width="36" height="36" className="footer-logo-img" aria-hidden="true" loading="lazy" />
            <span className="footer-name">Nathan<span className="accent">.</span></span>
          </div>
          <p>Développeur web & bot Discord</p>
        </div>

        <div className="footer-links">
          <a href="https://github.com/nathan260300" target="_blank" rel="noopener" aria-label="GitHub de Nathan"><i className="fab fa-github" aria-hidden="true" /></a>
          <a href="https://discord.gg/hvK9dhSKQF" target="_blank" rel="noopener" aria-label="Serveur Discord de Nathan"><i className="fab fa-discord" aria-hidden="true" /></a>
          <a href="https://youtube.com/@nathan26060" target="_blank" rel="noopener" aria-label="Chaîne YouTube de Nathan"><i className="fab fa-youtube" aria-hidden="true" /></a>
        </div>

        <div className="footer-copy">
          <span>© 2026 Nathan The Coder — GNU GPL v3</span>
          {lastUpdate && <span className="footer-update">{lastUpdate}</span>}
          <div className="footer-legal">
            <Link to="/cgu">CGU</Link>
            <Link to="/confidentialite">Confidentialité</Link>
            <Link to="/cookies">Cookies</Link>
            <Link to="/mentions-legales">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
