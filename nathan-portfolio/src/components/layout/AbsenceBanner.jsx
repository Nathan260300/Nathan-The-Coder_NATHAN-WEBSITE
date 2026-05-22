import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AbsenceBanner() {
  const [visible,    setVisible]    = useState(false);
  const [dismissed,  setDismissed]  = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('banner-dismissed')) return;
    const today = new Date();
    const start = new Date('2026-05-22');
    const end   = new Date('2026-05-29');
    if (today >= start && today <= end) setVisible(true);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('banner-dismissed', '1');
  };

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          id="absence-banner"
          style={{ display: 'flex' }}
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        >
          <span>
            <i className="fas fa-clock" /> Je serai absent du <strong>25</strong> au <strong>29 mai</strong> — les réponses seront retardées.
          </span>
          <button
            onClick={dismiss}
            aria-label="Fermer"
            style={{ marginLeft: '12px', background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: '1rem', lineHeight: 1, flexShrink: 0 }}
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
