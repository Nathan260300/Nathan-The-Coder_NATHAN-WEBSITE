import { createContext, useContext, useState, useEffect, useRef } from 'react';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [content, setContent] = useState(null);
  const lastFocusRef = useRef(null);

  const openModal = (jsx) => {
    lastFocusRef.current = document.activeElement;
    setContent(jsx);
  };

  const closeModal = () => {
    setContent(null);
    lastFocusRef.current?.focus();
    const params = new URLSearchParams(window.location.search);
    const hasModal = ['projet', 'blog', 'tuto', 'collab'].some(k => params.has(k));
    if (hasModal) {
      ['projet', 'blog', 'tuto', 'collab'].forEach(k => params.delete(k));
      window.history.pushState({}, '', '?' + params.toString());
    }
  };

  useEffect(() => {
    if (!content) return;
    const handler = (e) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [content]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {content && (
        <div id="modal" className="modal open" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <div className="modal-backdrop" onClick={closeModal} />
          <div className="modal-box">
            <button className="modal-close" onClick={closeModal} aria-label="Fermer la modale">&times;</button>
            <div id="modalContent">{content}</div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
