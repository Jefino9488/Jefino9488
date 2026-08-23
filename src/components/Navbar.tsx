import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { isLightRoute } from "@/lib/lightRoutes";
import { Github } from "./icons/Github";
import { Linkedin } from "./icons/Linkedin";
import { useSpotify } from "@/hooks/useSpotify";

interface NavItem {
  path: string;
  label: string;
}

const navItems: NavItem[] = [
  { path: "/", label: "Home" },
  { path: "/projects", label: "Work" },
  { path: "/blog", label: "Writing" },
  { path: "/about", label: "About" },
];

function SpotifyNavPill({ isLightPage }: { isLightPage: boolean }) {
  const { track } = useSpotify(20000);
  const isPlaying = Boolean(
    track?.isPlaying &&
    track?.name &&
    track.name !== "Failed to load track" &&
    track.name !== "Network error" &&
    track.name !== "Spotify unavailable in local dev",
  );
  const [showCard, setShowCard] = useState(false);

  // If currently listening on Spotify -> Show Live Equalizer Pill + Rich Inspect Card on Hover
  if (isPlaying && track) {
    return (
      <div
        className="relative"
        onMouseEnter={() => setShowCard(true)}
        onMouseLeave={() => setShowCard(false)}
      >
        <a
          href={track.url || "https://open.spotify.com"}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] transition-all max-w-[170px]",
            isLightPage
              ? "border-line bg-sage/60 text-sage-muted hover:border-line-strong hover:bg-sage hover:text-sage-ink"
              : "border-line bg-elevated/70 text-fg-muted hover:border-[#1DB954]/50 hover:bg-elevated hover:text-foreground",
          )}
        >
          {/* Animated Green Equalizer */}
          <span className="flex h-3 w-3 shrink-0 items-end gap-[2px]">
            <motion.span
              animate={{ height: ["25%", "100%", "45%", "85%", "25%"] }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: "easeInOut",
              }}
              className="w-[2px] rounded-full bg-[#1DB954]"
            />
            <motion.span
              animate={{ height: ["85%", "35%", "100%", "40%", "85%"] }}
              transition={{
                repeat: Infinity,
                duration: 0.9,
                ease: "easeInOut",
                delay: 0.2,
              }}
              className="w-[2px] rounded-full bg-[#1DB954]"
            />
            <motion.span
              animate={{ height: ["40%", "90%", "30%", "100%", "40%"] }}
              transition={{
                repeat: Infinity,
                duration: 1.1,
                ease: "easeInOut",
                delay: 0.4,
              }}
              className="w-[2px] rounded-full bg-[#1DB954]"
            />
          </span>

          <span className="truncate tracking-wide transition-colors group-hover:text-[#1DB954]">
            {track.name}
          </span>
        </a>

        {/* Hover Inspect Card Popover */}
        <AnimatePresence>
          {showCard && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "absolute right-0 top-full mt-3 w-72 rounded-2xl border p-4 shadow-2xl backdrop-blur-2xl z-50",
                isLightPage
                  ? "theme-light border-line bg-sage-raised/95 text-sage-ink shadow-[0_16px_40px_-16px_rgba(22,29,24,0.3)]"
                  : "border-line bg-surface/95 text-foreground shadow-[0_20px_50px_-20px_rgba(0,0,0,0.95)]",
              )}
            >
              <div className="flex items-center gap-3.5">
                {track.albumArt ? (
                  <img
                    src={track.albumArt}
                    alt={track.name}
                    className="h-14 w-14 rounded-xl border border-line object-cover shadow-md shrink-0"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-line bg-elevated text-[#1DB954] shrink-0">
                    <span className="h-3 w-3 rounded-full bg-[#1DB954] animate-ping" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1DB954]" />
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#1DB954]">
                      Now Playing
                    </p>
                  </div>
                  <p className="truncate font-poppins text-xs font-semibold text-foreground pt-0.5">
                    {track.name}
                  </p>
                  <p className="truncate font-mono text-[10px] text-fg-muted">
                    {track.artist}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5">
                <span className="font-mono text-[9px] text-fg-faint">
                  Spotify Live
                </span>
                <a
                  href={track.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link inline-flex items-center gap-1 font-mono text-[10px] font-medium text-[#1DB954] hover:underline"
                >
                  Listen along
                  <ArrowUpRight className="h-3 w-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // When NOT listening to music -> Clean "Say Hello ↗" Contact CTA (Option C)
  return (
    <a
      href="https://t.me/Jefino9488"
      target="_blank"
      rel="noopener noreferrer"
      title="Chat on Telegram (@Jefino9488)"
      className={cn(
        "group flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] transition-all",
        isLightPage
          ? "border-line bg-sage/60 text-sage-muted hover:border-line-strong hover:bg-sage hover:text-sage-ink"
          : "border-line bg-elevated/70 text-fg-muted hover:border-primary/50 hover:bg-elevated hover:text-foreground",
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      <span>Say Hello</span>
      <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
    </a>
  );
}

export default function Navbar() {
  const location = useLocation();
  const isLightPage = isLightRoute(location.pathname);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* Desktop & Tablet Floating Island Nav (md+)                     */}
      {/* ------------------------------------------------------------- */}
      <header className="pointer-events-none fixed inset-x-0 top-5 z-50 hidden md:flex justify-center px-4">
        <motion.nav
          aria-label="Primary Navigation"
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "pointer-events-auto flex items-center justify-between gap-6 rounded-full border p-1.5 shadow-lift backdrop-blur-2xl transition-colors duration-500 w-full max-w-2xl",
            isLightPage
              ? "theme-light border-line/70 bg-sage-raised/85 text-sage-ink shadow-[0_12px_36px_-16px_rgba(22,29,24,0.25)]"
              : "border-line/80 bg-surface/85 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.85)]",
          )}
          style={{ WebkitBackdropFilter: "blur(20px)" }}
        >
          {/* Brand Logo & Avatar */}
          <Link
            to="/"
            className="group flex items-center gap-2.5 pl-2 pr-1.5 transition-transform"
            aria-label="Jefino Home"
          >
            <div className="relative h-7 w-7 overflow-hidden rounded-full border border-line bg-elevated transition-transform duration-300 group-hover:scale-105">
              <img
                src="/profile/profile_anime.jpg"
                alt="Jefino"
                className="h-full w-full object-cover"
                width="28"
                height="28"
              />
            </div>
            <span className="font-poppins text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
              Jefino<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Nav Links with Animated Active Capsule */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-200 rounded-full",
                    isActive
                      ? "text-foreground font-medium"
                      : "text-fg-muted hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="desktop-nav-pill"
                      className={cn(
                        "absolute inset-0 rounded-full border shadow-sm",
                        isLightPage
                          ? "border-line-strong bg-sage-ink/10"
                          : "border-line-strong bg-elevated",
                      )}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Live Spotify Pill */}
          <SpotifyNavPill isLightPage={isLightPage} />
        </motion.nav>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* Mobile Floating Island Header (< md)                           */}
      {/* ------------------------------------------------------------- */}
      <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 md:hidden">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "pointer-events-auto flex w-full max-w-sm items-center justify-between rounded-full border p-1.5 shadow-lift backdrop-blur-xl transition-colors duration-500",
            isLightPage
              ? "theme-light border-line/70 bg-sage-raised/90 text-sage-ink shadow-[0_12px_36px_-16px_rgba(22,29,24,0.25)]"
              : "border-line/80 bg-surface/90 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.85)]",
          )}
          style={{ WebkitBackdropFilter: "blur(20px)" }}
        >
          {/* Mobile Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 pl-2"
            aria-label="Home"
          >
            <div className="relative h-7 w-7 overflow-hidden rounded-full border border-line bg-elevated">
              <img
                src="/profile/profile_anime.jpg"
                alt="Jefino"
                className="h-full w-full object-cover"
                width="28"
                height="28"
              />
            </div>
            <span className="font-poppins text-sm font-semibold tracking-tight text-foreground">
              Jefino<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Right side: Spotify + Menu button */}
          <div className="flex items-center gap-1.5">
            <SpotifyNavPill isLightPage={isLightPage} />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border transition-colors",
                isLightPage
                  ? "border-line bg-sage text-sage-ink hover:bg-sage-raised"
                  : "border-line bg-elevated text-foreground hover:bg-surface-hover",
              )}
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </motion.div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* Mobile Menu Island Modal (Inspired by Reference Design)        */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col justify-start bg-black/60 px-4 pt-20 backdrop-blur-md md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: -16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: -16, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "mx-auto w-full max-w-sm rounded-3xl border p-5 shadow-2xl transition-colors",
                isLightPage
                  ? "theme-light border-line bg-sage-raised/95 text-sage-ink"
                  : "border-line bg-surface/95 text-foreground",
              )}
            >
              <div className="mb-3 flex items-center justify-between border-b border-line pb-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">
                  Navigation
                </span>
                <span className="font-mono text-[10px] text-fg-muted">
                  [ 04 routes ]
                </span>
              </div>

              {/* Links */}
              <div className="space-y-1 py-1">
                {navItems.map((item) => {
                  const isActive =
                    item.path === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3.5 py-2.5 font-poppins text-base font-medium transition-colors",
                        isActive
                          ? isLightPage
                            ? "bg-sage-ink/10 text-primary"
                            : "bg-elevated text-primary"
                          : "text-foreground hover:bg-surface-hover",
                      )}
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isActive ? "text-primary opacity-100" : "opacity-40",
                        )}
                      />
                    </Link>
                  );
                })}
              </div>

              {/* Extra links & Socials */}
              <div className="mt-4 border-t border-line pt-3">
                <div className="flex items-center justify-between text-xs text-fg-muted">
                  <Link
                    to="/certificates"
                    className="hover:text-primary transition-colors font-mono text-[11px]"
                  >
                    Credentials →
                  </Link>

                  <div className="flex items-center gap-3">
                    <a
                      href="https://github.com/Jefino9488"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                      aria-label="GitHub"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                    <a
                      href="https://linkedin.com/in/jefino9488"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
