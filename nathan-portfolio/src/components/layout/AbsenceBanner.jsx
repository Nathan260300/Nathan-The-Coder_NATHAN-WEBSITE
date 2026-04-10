import { useEffect, useState } from 'react';

export default function AbsenceBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const today = new Date();
    const start = new Date('2026-04-20');
    const end   = new Date('2026-05-02T23:59:59');
    if (today >= start && today <= end) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div id="absence-banner">
      <span>
        <i className="fas fa-clock" /> Je serai absent du <strong>24 avril</strong> au <strong>2 mai</strong> — les réponses seront retardées.
      </span>
    </div>
  );
}
