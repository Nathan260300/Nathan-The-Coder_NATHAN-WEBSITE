import { useEffect, useState } from 'react';

export default function IntroLoader({ onDone }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const ts = [
      setTimeout(() => setStep(1), 80),
      setTimeout(() => setStep(2), 700),
      setTimeout(() => setStep(3), 1400),
      setTimeout(() => setStep(4), 1900),
      setTimeout(() => { setStep(5); onDone(); }, 2400),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  if (step === 5) return null;

  return (
    <div className={`il il--s${step}`} aria-hidden="true">
      <div className="il__scanline" />

      <div className="il__center">
        <div className="il__ring il__ring--b" />
        <div className="il__ring il__ring--a" />
        <div className="il__core">
          <img src="/nathan.jpg" alt="" className="il__img" />
        </div>
      </div>

      <div className="il__bottom">
        <div className="il__label">
          <span className="il__first">Nathan</span>
          <span className="il__accent">.</span>
        </div>
        <div className="il__sub">Développeur Web &amp; Discord</div>
      </div>
    </div>
  );
}