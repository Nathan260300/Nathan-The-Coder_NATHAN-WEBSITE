import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUp } from '../lib/motion';

export default function NotFound() {
  return (
    <motion.div className="page-404" variants={staggerContainer(0.1, 0)} initial="hidden" animate="visible">
      <motion.div className="page-404-code" variants={fadeUp} style={{ display: 'block' }}>404</motion.div>
      <motion.h2 variants={fadeUp}>Page introuvable</motion.h2>
      <motion.p variants={fadeUp}>Cette page n&apos;existe pas ou a été déplacée.</motion.p>
      <motion.div variants={fadeUp}>
        <Link to="/" className="btn-primary"><i className="fas fa-home" /> Retour à l&apos;accueil</Link>
      </motion.div>
    </motion.div>
  );
}
