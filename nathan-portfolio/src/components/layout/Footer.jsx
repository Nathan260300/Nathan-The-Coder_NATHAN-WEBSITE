import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-top">
            <img src="/nathan.jpg" alt="" width="32" height="32" className="footer-logo-img" aria-hidden="true" />
            <span className="footer-name">Nathan<span className="accent">.</span></span>
          </div>
          <p>Développeur Web &amp; Discord</p>
          <div className="footer-legal">
            <Link to="/legal/cgu">CGU</Link>
            <Link to="/legal/confidentialite">Confidentialité</Link>
            <Link to="/legal/cookies">Cookies</Link>
            <Link to="/legal/mentions-legales">Mentions légales</Link>
          </div>
        </div>

        <div className="footer-links">
          <a href="https://github.com/nathan260300" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i className="fab fa-github" /></a>
          <a href="https://discord.gg/hvK9dhSKQF"  target="_blank" rel="noopener noreferrer" aria-label="Discord"><i className="fab fa-discord" /></a>
          <a href="https://youtube.com/@nathan26060" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i className="fab fa-youtube" /></a>
        </div>

        <div className="footer-copy">
          <span>© {year} Nathan The Coder</span>
          <span className="footer-update">GNU GPL v3</span>
        </div>
      </div>
    </footer>
  );
}
