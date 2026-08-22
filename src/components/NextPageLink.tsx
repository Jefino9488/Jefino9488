import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

interface NextPageLinkProps {
  to: string;
  title: string;
  kicker?: string;
}

export default function NextPageLink({
  to,
  title,
  kicker = "Next",
}: NextPageLinkProps) {
  return (
    <Reveal>
      <Link
        to={to}
        className="group relative mt-20 block border-t border-line pt-10"
      >
        <p className="label-bracket font-mono text-[11px] uppercase tracking-[0.22em] text-fg-faint">
          <span className="text-primary">{kicker}</span>
          <span className="mx-2">·</span>
          Keep exploring
        </p>

        <div className="flex items-center justify-between gap-6 pt-4">
          <span
            className="text-balance font-poppins font-semibold leading-[1.02] transition-colors duration-300 group-hover:text-primary"
            style={{
              fontSize: "clamp(1.75rem, 4.5vw, 3.5rem)",
              letterSpacing: "-0.04em",
            }}
          >
            {title}
          </span>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-surface transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white sm:h-14 sm:w-14">
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-45" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
