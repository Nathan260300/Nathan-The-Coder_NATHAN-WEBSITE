import { Link, useParams } from 'react-router-dom';
import NotFound from './NotFound';

const LEGAL_DATA = {
  cgu: {
    title: "Conditions Générales d'Utilisation", icon: '📋',
    sections: [
      { title: '1. Objet', content: "Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du site nathan-the-coder.netlify.app, portfolio personnel de Nathan, développeur web et créateur de bots Discord." },
      { title: '2. Accès au site', content: "Le Site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. Tous les frais liés à l'accès au Site sont à la charge de l'utilisateur." },
      { title: '3. Propriété intellectuelle', content: "Le code source du Site est publié sous licence GNU GPL v3. Les contenus (articles, tutoriels, projets) sont la propriété de Nathan. Toute reproduction est soumise à autorisation préalable." },
      { title: '4. Commentaires et interactions', content: "Les utilisateurs peuvent laisser des commentaires via une connexion Discord OAuth. En publiant un commentaire, l'utilisateur s'engage à respecter les règles de bonne conduite." },
      { title: '5. Responsabilité', content: "Nathan ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation du Site." },
      { title: '6. Droit applicable', content: "Les présentes CGU sont soumises au droit français. Tout litige sera soumis aux tribunaux compétents français." },
    ],
  },
  confidentialite: {
    title: 'Politique de Confidentialité', icon: '🔒',
    sections: [
      { title: '1. Responsable du traitement', content: "Nathan, développeur web indépendant, est responsable du traitement des données collectées via le Site." },
      { title: '2. Données collectées', content: "Lors de la connexion via Discord OAuth : identifiant Discord, nom d'utilisateur, avatar. Ces données sont utilisées uniquement pour identifier l'auteur des commentaires." },
      { title: '3. Finalités du traitement', content: "Les données sont collectées pour permettre l'identification des utilisateurs laissant des commentaires ou envoyant des messages de contact." },
      { title: '4. Durée de conservation', content: "Les données sont conservées tant que le compte Discord est actif sur le Site. L'utilisateur peut demander la suppression via le formulaire de contact." },
      { title: '5. Partage des données', content: "Aucune donnée personnelle n'est vendue ni transmise à des tiers. Les données sont hébergées chez Supabase." },
      { title: '6. Droits des utilisateurs', content: "Conformément au RGPD, tout utilisateur dispose d'un droit d'accès, de rectification, de suppression et de portabilité de ses données." },
    ],
  },
  cookies: {
    title: 'Politique des Cookies', icon: '🍪',
    sections: [
      { title: "Qu'est-ce qu'un cookie ?", content: "Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite d'un site web." },
      { title: 'Cookies utilisés sur ce site', content: "Le Site utilise uniquement des cookies techniques strictement nécessaires à son fonctionnement. Aucun cookie publicitaire n'est utilisé." },
      { title: 'Cookie de session Supabase', content: "Lors de la connexion via Discord OAuth, un cookie de session est créé par Supabase. Il est supprimé à la déconnexion." },
      { title: 'LocalStorage', content: "Le Site utilise le localStorage de votre navigateur pour mémoriser certaines préférences locales. Ces données ne sont pas transmises à des tiers." },
      { title: 'Gestion des cookies', content: "Vous pouvez configurer votre navigateur pour refuser les cookies. Notez que certaines fonctionnalités ne seront plus disponibles." },
    ],
  },
  'mentions-legales': {
    title: 'Mentions Légales', icon: '⚖️',
    sections: [
      { title: 'Éditeur du site', content: "Le site est édité par Nathan, développeur web indépendant et créateur de bots Discord, agissant à titre personnel." },
      { title: 'Hébergement', content: "Le Site est hébergé par Netlify, Inc. — 512 2nd Street, Suite 200, San Francisco, CA 94107, États-Unis. Les données sont stockées chez Supabase." },
      { title: 'Propriété intellectuelle', content: "Le code source est publié sous licence GNU GPL v3. Les contenus éditoriaux restent la propriété de Nathan. Toute reproduction sans autorisation est interdite." },
      { title: 'Données personnelles', content: "Le traitement des données est décrit dans la Politique de Confidentialité accessible depuis ce Site." },
      { title: 'Liens hypertextes', content: "Le Site peut contenir des liens vers des sites tiers. Nathan ne saurait être tenu responsable du contenu de ces sites externes." },
      { title: 'Contact', content: "Pour toute question, vous pouvez contacter Nathan via le formulaire de contact du Site." },
    ],
  },
};

const LABELS = {
  cgu:                'CGU',
  confidentialite:    'Confidentialité',
  cookies:            'Cookies',
  'mentions-legales': 'Mentions légales',
};

export default function Legal() {
  const { slug } = useParams();
  const data = LEGAL_DATA[slug];

  if (!data) return <NotFound />;

  const siblings = Object.entries(LEGAL_DATA).filter(([id]) => id !== slug);

  return (
    <div className="legal-page">
      <div className="legal-hero">
        <Link to="/" className="legal-back-btn"><i className="fas fa-arrow-left" /> Retour</Link>
        <div className="legal-hero-tag">{data.icon} Légal</div>
        <h1 className="legal-title">{data.title}</h1>
        <p className="legal-updated">Dernière mise à jour : mars 2026</p>
        <div className="legal-sibling-nav">
          {siblings.map(([id]) => (
            <Link key={id} to={`/legal/${id}`} className="legal-sibling-link">{LABELS[id]}</Link>
          ))}
        </div>
      </div>
      <div className="legal-body">
        {data.sections.map((s, i) => (
          <div key={i} className="legal-block">
            <div className="legal-block-num">{String(i + 1).padStart(2, '0')}</div>
            <div className="legal-block-content"><h3>{s.title}</h3><p>{s.content}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}