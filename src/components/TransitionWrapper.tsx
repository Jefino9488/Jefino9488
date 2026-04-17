import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
    initial: {
        opacity: 0,
        y: 18,
        filter: 'blur(4px)',
    },
    animate: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
    },
    exit: {
        opacity: 0,
        y: -12,
        filter: 'blur(4px)',
    },
};

export default function TransitionWrapper({ children }: { children: React.ReactNode }) {
    const location = useLocation();

    return (
        <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="min-h-screen w-full text-white"
        >
            {children}
        </motion.div>
    );
}
