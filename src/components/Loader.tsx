import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Preloader — letter-particle radial convergence.
 * Scattered glyphs swirl inward and assemble into an orbiting ring
 * around the studio name while a percentage counter tracks progress.
 * (Reference: Max Milkin-style particle loaders.)
 */

const CORE_WORDS = ["Jefino", "Creative", "Developer"];
const LETTER_SOURCE = "JEFINOCREATIVEDEVELOPER";

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface LetterSeed {
  angle: number;
  r0: number;
  rot: number;
}

export default function Loader() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const pctRef = useRef<HTMLSpanElement>(null);

  const seeds = useMemo<LetterSeed[]>(() => {
    const chars = LETTER_SOURCE.split("");
    return chars.map((_, i) => ({
      angle: (i / chars.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.9,
      r0: 130 + Math.random() * 190,
      rot: (Math.random() - 0.5) * 150,
    }));
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    let raf = 0;
    const start = performance.now();
    const DURATION = 2100;

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const p = easeInOutCubic(t);

      const width = containerRef.current?.clientWidth ?? 380;
      const scale = Math.min(width / 480, 1.25);

      letterRefs.current.forEach((el, i) => {
        if (!el) return;
        const seed = seeds[i];
        // Converge from scattered radius to a tight orbital ring
        const radius = (seed.r0 * (1 - p) + 78 * p) * scale;
        const angle = seed.angle + p * 1.7; // gentle swirl while collapsing
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.74;
        el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(seed.rot * (1 - p)).toFixed(1)}deg)`;
        el.style.opacity = String(Math.min(1, p * 3.5));
      });

      if (pctRef.current) {
        pctRef.current.textContent = `${String(Math.round(p * 100)).padStart(3, "0")}%`;
      }

      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion, seeds]);

  return (
    <div
      ref={containerRef}
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[95] overflow-hidden bg-[#0c1310]"
    >
      {/* Registration marks */}
      <span
        aria-hidden
        className="absolute left-1/2 top-10 -translate-x-1/2 font-mono text-sm text-fg-faint"
      >
        +
      </span>
      <span
        aria-hidden
        className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-sm text-fg-faint"
      >
        +
      </span>
      <p
        aria-hidden
        className="section-marker absolute left-6 top-6 text-fg-faint"
      >
        N.000
      </p>
      <p
        aria-hidden
        className="section-marker absolute right-6 top-6 text-fg-faint"
      >
        Loading
      </p>

      {/* Letter swarm */}
      <div className="absolute inset-0" aria-hidden>
        {seeds.map((_, i) => (
          <span
            key={i}
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 font-poppins text-xs font-medium uppercase tracking-widest text-fg-muted will-change-transform"
            style={
              reduceMotion
                ? {
                    transform: `translate(-50%, -50%) translate(${(Math.cos(seeds[i].angle) * 78).toFixed(0)}px, ${(Math.sin(seeds[i].angle) * 78 * 0.74).toFixed(0)}px)`,
                    opacity: 0.7,
                  }
                : { opacity: 0 }
            }
          >
            {LETTER_SOURCE[i]}
          </span>
        ))}
      </div>

      {/* Assembled core */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        {CORE_WORDS.map((word) => (
          <span
            key={word}
            className="font-poppins text-[13px] font-semibold uppercase tracking-[0.32em] text-[#e9ede7]"
          >
            {word}
          </span>
        ))}
        <span
          ref={pctRef}
          className="mt-4 font-mono text-[11px] tabular-nums tracking-[0.2em] text-primary"
        >
          000%
        </span>
      </div>

      <span className="sr-only">Loading portfolio…</span>
    </div>
  );
}
