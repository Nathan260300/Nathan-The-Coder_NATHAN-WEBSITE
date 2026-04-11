import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { AuthProvider }                from './hooks/useAuth';
import { ModalProvider }               from './hooks/useModal';
import { NavProgressProvider }         from './hooks/useNavProgress';
import { usePageTransition }           from './hooks/usePageTransition';
import Navbar         from './components/layout/Navbar';
import Footer         from './components/layout/Footer';
import AbsenceBanner  from './components/layout/AbsenceBanner';
import IntroLoader    from './components/layout/IntroLoader';
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
  '/':                       'Accueil',
  '/projets':                'Projets',
  '/collaborations':         'Collaborations',
  '/blog':                   'Blog',
  '/tuto':                   'Tutos',
  '/competences':            'Compétences',
  '/ressources':             'Ressources',
  '/changelog':              'Changelog',
  '/moi':                    'À propos',
  '/contact':                'Contact',
  '/legal/cgu':              'CGU',
  '/legal/confidentialite':  'Politique de confidentialité',
  '/legal/cookies':          'Politique des cookies',
  '/legal/mentions-legales': 'Mentions légales',
};

function getTitle(pathname) {
  return PAGE_TITLES[pathname] || null;
}

function AnimatedRoutes() {
  const location = useLocation();
  const [displayedLocation, setDisplayedLocation] = useState(location);
  const wrapRef  = useRef(null);
  const prevRef  = useRef(location.pathname);
  const t1Ref    = useRef(null);

  useEffect(() => {
    document.title = `${getTitle(location.pathname) || 'Nathan The Coder'} — Nathan The Coder`;
  }, []);

  useEffect(() => {
    if (location.pathname === prevRef.current) return;
    prevRef.current = location.pathname;
    document.title = `${getTitle(location.pathname) || 'Nathan The Coder'} — Nathan The Coder`;

    const el = wrapRef.current;
    if (!el) return;

    clearTimeout(t1Ref.current);

    el.dataset.leaving  = 'true';
    delete el.dataset.entering;

    const onEnd = () => {
      el.removeEventListener('transitionend', onEnd);
      clearTimeout(t1Ref.current);

      el.dataset.leaving = 'false';

      flushSync(() => setDisplayedLocation(location));
      window.scrollTo({ top: 0, behavior: 'instant' });

      el.style.opacity   = '0';
      el.style.transform = 'translateY(10px)';
      el.style.transition = 'none';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'opacity 260ms ease, transform 260ms ease';
          el.style.opacity    = '1';
          el.style.transform  = 'translateY(0)';
          t1Ref.current = setTimeout(() => {
            el.style.cssText = '';
          }, 280);
        });
      });
    };

    el.addEventListener('transitionend', onEnd, { once: true });

    t1Ref.current = setTimeout(() => {
      el.removeEventListener('transitionend', onEnd);
      onEnd();
    }, 140);

    return () => {
      clearTimeout(t1Ref.current);
      el.removeEventListener('transitionend', onEnd);
    };
  }, [location.pathname]);

  return (
    <div ref={wrapRef} className="page-wrap">
      <Routes location={displayedLocation}>
          <Route path="/"                      element={<Home />} />
          <Route path="/projets"               element={<Projets />} />
          <Route path="/collaborations"        element={<Collaborations />} />
          <Route path="/blog"                  element={<Blog />} />
          <Route path="/tuto"                  element={<Tuto />} />
          <Route path="/competences"           element={<Competences />} />
          <Route path="/ressources"            element={<Ressources />} />
          <Route path="/changelog"             element={<Changelog />} />
          <Route path="/moi"                   element={<Moi />} />
          <Route path="/contact"               element={<Contact />} />
          <Route path="/legal/:slug"           element={<Legal />} />
          <Route path="/cgu"                   element={<Navigate to="/legal/cgu" replace />} />
          <Route path="/confidentialite"       element={<Navigate to="/legal/confidentialite" replace />} />
          <Route path="/cookies"               element={<Navigate to="/legal/cookies" replace />} />
          <Route path="/mentions-legales"      element={<Navigate to="/legal/mentions-legales" replace />} />
          <Route path="/auth/callback"         element={<AuthCallback />} />
          <Route path="*"                      element={<NotFound />} />
        </Routes>
    </div>
  );
}

function Layout() {
  usePageTransition();

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
  const [loaded, setLoaded] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <NavProgressProvider>
          <ModalProvider>
            {!loaded && <IntroLoader onDone={() => setLoaded(true)} />}
            <div style={{ visibility: loaded ? 'visible' : 'hidden' }}>
              <Layout />
            </div>
          </ModalProvider>
        </NavProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}