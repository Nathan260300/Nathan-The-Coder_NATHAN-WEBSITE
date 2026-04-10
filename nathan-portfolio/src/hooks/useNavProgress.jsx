import { createContext, useContext, useRef, useCallback } from 'react';

const NavProgressContext = createContext(null);

export function NavProgressProvider({ children }) {
  const barRef    = useRef(null);
  const timerRef  = useRef(null);

  const start = useCallback(() => {
    const bar = barRef.current;
    if (!bar) return;
    clearTimeout(timerRef.current);
    bar.style.transition = 'none';
    bar.style.width      = '0%';
    bar.style.opacity    = '1';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.transition = 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        bar.style.width      = '70%';
      });
    });
  }, []);

  const finish = useCallback(() => {
    const bar = barRef.current;
    if (!bar) return;
    bar.style.transition = 'width 0.2s ease';
    bar.style.width      = '100%';
    timerRef.current = setTimeout(() => {
      bar.style.transition = 'opacity 0.3s ease';
      bar.style.opacity    = '0';
    }, 220);
  }, []);

  return (
    <NavProgressContext.Provider value={{ barRef, start, finish }}>
      {children}
    </NavProgressContext.Provider>
  );
}

export function useNavProgress() {
  return useContext(NavProgressContext);
}