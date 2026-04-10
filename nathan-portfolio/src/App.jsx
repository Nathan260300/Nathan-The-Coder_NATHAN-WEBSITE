import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { AuthProvider }                from './hooks/useAuth';
import { ModalProvider }               from './hooks/useModal';
import { NavProgressProvider, useNavProgress } from './hooks/useNavProgress';
import Navbar         from './components/layout/Navbar';
import Footer         from './components/layout/Footer';
import AbsenceBanner  from './components/layout/AbsenceBanner';
import Home           from './pages/Home';
import Projets        from './pages/Projets';
import Blog           from './pages/Blog';
import Tuto           from './pages/Tuto';
import Ressources     from './pages/Ressources';
import Competences    from './pages/Competences';
import Collaborations from './pages/Collaborations';
import Changelog      from './pages/Changelog';
import Moi            from './pages/Moi';
import Contact        from './pages/Contact';
import Legal          from './pages/Legal';
import NotFound       from './pages/NotFound';
import AuthCallback   from './pages/AuthCallback';

const PAGE_TITLES = {
  '/':                 'Accueil',
  '/projets':          'Projets',
  '/collaborations':   'Collaborations',
  '/blog':             'Blog',
  '/tuto':             'Tutos',
  '/competences':      'Compétences',
  '/ressources':       'Ressources',
  '/changelog':        'Changelog',
  '/moi':              'À propos',
  '/contact':          'Contact',
  '/cgu':              'CGU',
  '/confidentialite':  'Politique de confidentialité',
  '/cookies':          'Politique des cookies',
  '/mentions-legales': 'Mentions légales',
};

function AnimatedRoutes() {
  const location          = useLocation();
  const { start, finish } = useNavProgress();
  const [displayedLocation, setDisplayedLocation] = useState(location);
  const divRef  = useRef(null);
  const prevRef = useRef(location.pathname);
  const t1Ref   = useRef(null);
  const t2Ref   = useRef(null);
  const rafRef  = useRef(null);

  useEffect(() => {
    if (location.pathname === prevRef.current) return;
    prevRef.current = location.pathname;

    clearTimeout(t1Ref.current);
    clearTimeout(t2Ref.current);
    cancelAnimationFrame(rafRef.current);

    start();

    const el = divRef.current;
    if (el) el.classList.add('is-leaving');

    t1Ref.current = setTimeout(() => {
      if (el) el.classList.remove('is-leaving');

      setDisplayedLocation(location);
      document.title = `${PAGE_TITLES[location.pathname] || '404'} — Nathan The Coder`;
      window.scrollTo({ top: 0, behavior: 'instant' });

      rafRef.current = requestAnimationFrame(() => {
        if (el) el.classList.add('is-entering');
        t2Ref.current = setTimeout(() => {
          if (el) el.classList.remove('is-entering');
          finish();
        }, 280);
      });
    }, 190);

    return () => {
      clearTimeout(t1Ref.current);
      clearTimeout(t2Ref.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [location.pathname]);

  return (
    <div className="page" ref={divRef}>
      <Routes location={displayedLocation}>
        <Route path="/"                 element={<Home />} />
        <Route path="/projets"          element={<Projets />} />
        <Route path="/collaborations"   element={<Collaborations />} />
        <Route path="/blog"             element={<Blog />} />
        <Route path="/tuto"             element={<Tuto />} />
        <Route path="/competences"      element={<Competences />} />
        <Route path="/ressources"       element={<Ressources />} />
        <Route path="/changelog"        element={<Changelog />} />
        <Route path="/moi"              element={<Moi />} />
        <Route path="/contact"          element={<Contact />} />
        <Route path="/cgu"              element={<Legal />} />
        <Route path="/confidentialite"  element={<Legal />} />
        <Route path="/cookies"          element={<Legal />} />
        <Route path="/mentions-legales" element={<Legal />} />
        <Route path="/auth/callback"     element={<AuthCallback />} />
        <Route path="*"                 element={<NotFound />} />
      </Routes>
    </div>
  );
}

function Layout() {
  return (
    <>
      <a href="#app" className="skip-link">Aller au contenu principal</a>
      <div className="grain" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />
      <div className="blob blob-1" aria-hidden="true" />
      <div className="blob blob-2" aria-hidden="true" />
      <AbsenceBanner />
      <Navbar />
      <main id="app" role="main" aria-live="polite" aria-atomic="true">
        <AnimatedRoutes />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavProgressProvider>
          <ModalProvider>
            <Layout />
          </ModalProvider>
        </NavProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}