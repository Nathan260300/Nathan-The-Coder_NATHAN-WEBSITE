import { motion } from 'framer-motion';
import { formatDate } from '../../lib/utils';

export function Card({ item, tag, onClick }) {
  const meta = formatDate(item.created_at);
  return (
    <article
      className="card"
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? (item.title || item.name || 'Voir les détails') : undefined}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      {tag && <div className="card-tag">{tag}</div>}
      <h3>{item.title || item.name || ''}</h3>
      <p>{item.short_description || item.description || ''}</p>
      {meta && (
        <div className="card-meta">
          <span>{meta}</span>
          <span className="card-arrow" aria-hidden="true">→</span>
        </div>
      )}
    </article>
  );
}

export function PageHero({ content, label, title, subtitle }) {
  return (
    <div className="page-hero">
      <div className="page-hero-label">{label}</div>
      <h1 className="page-title">{content?.title || title}</h1>
      {(content?.subtitle || subtitle) && (
        <p className="page-subtitle">{content?.subtitle || subtitle}</p>
      )}
    </div>
  );
}

export function EmptyState({ message = 'Aucun contenu pour le moment.' }) {
  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="empty-state-icon">📭</div>
      <p>{message}</p>
    </motion.div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="error-state">
      <i className="fas fa-circle-exclamation" /> Erreur : {message}
    </div>
  );
}

export function Loader() {
  return (
    <div className="page-loader">
      <div className="loader-ring" />
    </div>
  );
}
