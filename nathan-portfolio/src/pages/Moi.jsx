import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchTable, fetchPageContent } from '../lib/supabase';
import { useReadyAnimate } from '../hooks/useReadyAnimate';
import { PageHero } from '../components/ui';
import { staggerContainer, cardVariant, fadeUp } from '../lib/motion';

const DEFAULT_CARDS = [
  { icon: '👨‍💻', title: 'Qui suis-je ?', wide: true, content: "Salut ! Je suis Nathan, développeur web et créateur de bots Discord. Je suis passionné par la création d'interfaces modernes, d'outils utiles et de bots qui automatisent l'expérience sur Discord. Je partage tout en open-source sous licence GNU GPL v3." },
  { icon: '🛠️', title: 'Mon setup', content: 'IDE, environnements et outils au quotidien.', chips: 'VS Code,Windows 11,macOS,Linux Mint,Git,GitHub,Supabase' },
  { icon: '💡', title: 'Ma philosophie', content: "Pour moi, coder c'est partager. Tout mon code est sous licence GNU GPL v3 : libre, modifiable et redistribuable." },
  { icon: '🎮', title: 'En dehors du code', content: "Musique, jeux vidéo, cybersécurité et Coca-Cola. C'est ça le carburant.", chips: '🎵 Musique,🎮 Gaming,🔐 Cybersec,🥤 Coca-Cola' },
];

export default function Moi() {
  const animate                   = useReadyAnimate();
  const [cards,   setCards]       = useState([]);
  const [content, setContent]     = useState(null);
  const [loading, setLoading]     = useState(true);

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

  return (
    <>
      <motion.div variants={fadeUp} initial="hidden" animate={animate}>
        <PageHero content={content} label="À propos" title="Moi, Nathan." subtitle="Développeur web passionné, créateur de bots Discord et explorateur du code." />
      </motion.div>
      <div className="page-content">
        {!loading && (
          <motion.div className="about-grid" variants={staggerContainer(0.08, 0.1)} initial="hidden" animate={animate}>
            {cards.map((c, i) => (
              <motion.div key={i} className={`about-card${c.wide ? ' wide' : ''}`} variants={cardVariant}>
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
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}
