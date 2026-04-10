import { useEffect, useState } from 'react';
import { fetchTable, fetchPageContent } from '../lib/supabase';
import { PageHero, Loader } from '../components/ui';

const DEFAULT_CARDS = [
  {
    icon: '👨‍💻', title: 'Qui suis-je ?', wide: true,
    content: "Salut ! Je suis Nathan, développeur web et créateur de bots Discord. Je suis passionné par la création d'interfaces modernes, d'outils utiles et de bots qui automatisent l'expérience sur Discord. Je partage tout en open-source sous licence GNU GPL v3.",
  },
  {
    icon: '🛠️', title: 'Mon setup',
    content: 'IDE, environnements et outils au quotidien.',
    chips: 'VS Code,Windows 11,macOS,Linux Mint,Git,GitHub,Supabase',
  },
  {
    icon: '💡', title: 'Ma philosophie',
    content: 'Pour moi, coder c\'est partager. Tout mon code est sous licence GNU GPL v3 : libre, modifiable et redistribuable.',
  },
  {
    icon: '🎮', title: 'En dehors du code',
    content: 'Musique, jeux vidéo, cybersécurité et Coca-Cola. C\'est ça le carburant.',
    chips: '🎵 Musique,🎮 Gaming,🔐 Cybersec,🥤 Coca-Cola',
  },
];

export default function Moi() {
  const [cards,   setCards]   = useState([]);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetchPageContent('moi'),
      fetchTable('about_cards', { order: 'order_index', asc: true }),
    ]).then(([pc, result]) => {
      if (pc.status === 'fulfilled') setContent(pc.value);
      setCards(result.status === 'fulfilled' && result.value.length ? result.value : DEFAULT_CARDS);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <PageHero content={content} label="À propos" title="Moi, Nathan." subtitle="Développeur web passionné, créateur de bots Discord et explorateur du code." />
      <div className="page-content">
        <div className="about-grid">
          {cards.map((c, i) => (
            <div key={i} className={`about-card${c.wide ? ' wide' : ''}`}>
              {c.icon && <div className="about-card-icon">{c.icon}</div>}
              <h3>{c.title || ''}</h3>
              <p>{c.content || ''}</p>
              {c.chips && (
                <div className="skill-chips">
                  {c.chips.split(',').map(ch => (
                    <span key={ch} className="skill-chip">{ch.trim()}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
