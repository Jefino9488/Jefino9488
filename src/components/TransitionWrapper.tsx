import { motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function TransitionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      key={location.pathname}
      initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={
        reduceMotion
          ? undefined
          : {
              opacity: 0,
              y: -12,
              transition: { duration: 0.22, ease: "easeIn" },
            }
      }
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen w-full"
    >
      {children}
    </motion.div>
  );
}
