import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

// Shared Framer Motion presets. Durations stay short (<= 0.3s) and
// <MotionConfig reducedMotion="user"> in App.jsx strips transforms for
// users who prefer reduced motion.
export const EASE = [0.22, 1, 0.36, 1];

export const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE, delay: Math.min(d, 0.4) } }),
};

export const fadeIn = {
    hidden: { opacity: 0 },
    show: (d = 0) => ({ opacity: 1, transition: { duration: 0.25, ease: 'easeOut', delay: Math.min(d, 0.4) } }),
};

export const staggerParent = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

export const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE } },
    exit: { opacity: 0, scale: 0.97, transition: { duration: 0.15 } },
};

export const MCard = motion.create(Card);

export function Stagger({ as = 'div', children, ...props }) {
    const Comp = motion[as];
    return <Comp variants={staggerParent} initial="hidden" animate="show" {...props}>{children}</Comp>;
}

export function Item({ as = 'div', children, ...props }) {
    const Comp = motion[as];
    return <Comp variants={itemVariants} {...props}>{children}</Comp>;
}

export const hoverLift = { whileHover: { y: -3 }, transition: { type: 'spring', stiffness: 400, damping: 28 } };
export const tapPress = { whileTap: { scale: 0.97 } };

export const MLink = motion.create(Link);
