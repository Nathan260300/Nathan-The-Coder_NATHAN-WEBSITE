import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-404">
      <div className="page-404-code">404</div>
      <h2>Page introuvable</h2>
      <p>Cette page n'existe pas ou a été déplacée.</p>
      <Link to="/" className="btn-primary"><i className="fas fa-home" /> Retour à l'accueil</Link>
    </div>
  );
}
