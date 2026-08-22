import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Reveal from "./Reveal";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[88dvh] items-center justify-center px-4 pb-28 lg:pb-16">
      <div aria-hidden className="ambient-glow left-1/2 top-1/3 h-96 w-96" />

      <div className="relative space-y-8 text-center">
        <Reveal>
          <p
            aria-hidden
            className="index-num select-none text-[7rem] leading-none sm:text-[10rem]"
            style={{ WebkitTextStrokeColor: "#2a3640" }}
          >
            404
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="type-title">Page not found</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-fg-muted">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. The starfield continues without it.
          </p>
        </Reveal>

        <Reveal delay={0.14}>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/"
              className="press inline-flex items-center gap-2 rounded-full bg-[#f2f5f5] px-5 py-2.5 text-sm font-medium text-[#050708] shadow-card transition-all hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back home
            </Link>
            <Link
              to="/projects"
              className="press inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-5 py-2.5 text-sm text-[#f2f5f5] backdrop-blur-sm transition-colors hover:border-line-strong hover:bg-elevated"
            >
              View work
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
