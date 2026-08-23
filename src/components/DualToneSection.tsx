import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

interface DualToneSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function DualToneSection({
  children,
  className = "",
  id,
}: DualToneSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Scrub the entrance of the dual-tone sheet as it scrolls into viewport
  // We attach the target to containerRef (static wrapper) so transform changes never feedback into scroll measurements
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start 60%"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.6, 0.9, 1]);

  return (
    <div ref={containerRef} className="relative mt-12 sm:mt-16">
      <motion.section
        id={id}
        style={reduceMotion ? undefined : { y, scale, opacity }}
        className={`theme-light relative z-10 flex flex-col rounded-t-[2.5rem] bg-sage transition-colors duration-500 will-change-transform sm:rounded-t-[3.5rem] ${className}`}
      >
        {children}
      </motion.section>
    </div>
  );
}
