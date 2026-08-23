import { Link } from "react-router-dom";
import { ArrowUp, Mail } from "lucide-react";
import { Github } from "./icons/Github";
import { Linkedin } from "./icons/Linkedin";
import { Whatsapp } from "./icons/Whatsapp";

const siteLinks = [
  { to: "/projects", label: "Work" },
  { to: "/blog", label: "Writing" },
  { to: "/about", label: "About" },
  { to: "/certificates", label: "Credentials" },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="theme-light border-t border-line bg-sage transition-colors duration-500">
      <div className="mx-auto max-w-[90rem] px-4 pb-28 pt-12 sm:px-8 lg:pb-12">
        {/* Columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-10">
          {/* Brand */}
          <div className="col-span-2 space-y-3 sm:col-span-1">
            <Link
              to="/"
              className="font-poppins text-lg font-semibold tracking-tight text-foreground"
            >
              Jefino<span className="text-primary">.</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-fg-muted">
              Full-stack developer and AI engineer building systems software,
              web platforms, and open-source tooling.
            </p>
          </div>

          {/* Site links */}
          <nav aria-label="Footer" className="flex flex-col gap-2.5 text-sm">
            <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-faint">
              Index
            </p>
            {siteLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="w-fit text-fg-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Elsewhere */}
          <div className="flex flex-col gap-2.5 text-sm">
            <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-faint">
              Elsewhere
            </p>
            <a
              href="https://github.com/Jefino9488"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 text-fg-muted transition-colors hover:text-foreground"
            >
              <Github className="h-3.5 w-3.5 shrink-0" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/jefino9488/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 text-fg-muted transition-colors hover:text-foreground"
            >
              <Linkedin className="h-3.5 w-3.5 shrink-0" />
              LinkedIn
            </a>
            <a
              href="https://wa.me/918220934327"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 text-fg-muted transition-colors hover:text-foreground"
            >
              <Whatsapp className="h-3.5 w-3.5 shrink-0" />
              WhatsApp
            </a>
            <a
              href="mailto:jefinojacob9488@gmail.com"
              className="inline-flex w-fit items-center gap-2 text-fg-muted transition-colors hover:text-foreground"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" />
              Email
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-center justify-between gap-6 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-center font-mono text-[11px] leading-relaxed text-fg-faint sm:text-left">
            © {new Date().getFullYear()} Jefino
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="press inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 font-mono text-[11px] text-fg-muted transition-colors hover:border-line-strong hover:bg-elevated hover:text-foreground"
          >
            Back to top
            <ArrowUp className="h-3 w-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}
