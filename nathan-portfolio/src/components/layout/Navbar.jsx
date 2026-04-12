import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavProgress } from '../../hooks/useNavProgress';

const NAV_LINKS = [
  { to: '/',               label: 'Accueil' },
  { to: '/projets',        label: 'Projets' },
  { to: '/collaborations', label: 'Collaborations' },
  { to: '/blog',           label: 'Blog' },
  { to: '/tuto',           label: 'Tutos' },
  { to: '/competences',    label: 'Compétences' },
  { to: '/ressources',     label: 'Ressources' },
  { to: '/changelog',      label: 'Changelog' },
  { to: '/moi',            label: 'À propos' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location   = useLocation();
  const { barRef } = useNavProgress();

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <motion.nav
      id="nav"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link to="/" className="nav-brand" aria-label="Nathan The Coder — Accueil">
        <img src="/nathan.jpg" alt="" width="36" height="36" className="nav-logo-img" aria-hidden="true" fetchPriority="high" />
        <span>Nathan<span className="accent">.</span></span>
      </Link>

      <button
        className={`nav-burger${menuOpen ? ' open' : ''}`}
        id="navBurger"
        aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={menuOpen}
        aria-controls="navMenu"
        onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
      >
        <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
      </button>

      <div className={`nav-menu${menuOpen ? ' open' : ''}`} id="navMenu">
        <div className="nav-links">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={location.pathname === to ? 'active' : ''}
              aria-current={location.pathname === to ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          <Link to="/contact" className="btn-nav-cta">Contact</Link>
        </div>
      </div>

      <div id="nav-progress" ref={barRef} />
    </motion.nav>
  );
}
