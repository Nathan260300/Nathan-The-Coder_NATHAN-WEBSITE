export const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.4, 0, 0.2, 1] } },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const slideRight = {
  hidden:  { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } },
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.34, 1.2, 0.64, 1] } },
};

export const staggerContainer = (stagger = 0.07, delayChildren = 0.05) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

export const cardVariant = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.4, 0, 0.2, 1] } },
};
