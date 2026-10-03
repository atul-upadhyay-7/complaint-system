import { motion } from 'framer-motion';

const pageVariants = {
    initial: { opacity: 0, y: 8 },
    in: { opacity: 1, y: 0, transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] } },
    out: { opacity: 0, transition: { duration: 0.12, ease: 'easeIn' } },
};

const AnimatedPage = ({ children }) => (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="w-full h-full">
        {children}
    </motion.div>
);

export default AnimatedPage;
