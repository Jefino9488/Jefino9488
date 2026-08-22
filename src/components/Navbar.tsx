import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { House, BriefcaseBusiness, PenLine, CircleUser } from "lucide-react";
import { cn } from "@/lib/utils";
import { isLightRoute } from "@/lib/lightRoutes";

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { path: "/", label: "Home", icon: House },
  { path: "/projects", label: "Work", icon: BriefcaseBusiness },
  { path: "/blog", label: "Writing", icon: PenLine },
  { path: "/about", label: "About", icon: CircleUser },
];

/** Pages that flip to the sage light theme — nav mirrors them. */
export default function Navbar() {
  const location = useLocation();
  const isLightPage = isLightRoute(location.pathname);

  return (
    <>
      {/* Slim top bar — brand only */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b transition-colors duration-500 lg:hidden",
          isLightPage
            ? "glass-header-light theme-light"
            : "glass-header",
        )}
      >
        <div className="mx-auto flex max-w-[90rem] items-center justify-between px-4 py-3 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Home">
            <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-[0.625rem] border border-line bg-surface">
              <img
                src="/profile/profile_anime.jpg"
                alt=""
                className="h-full w-full object-cover"
                width="32"
                height="32"
              />
            </span>
            <span className="font-poppins text-sm font-semibold tracking-tight text-foreground">
              Jefino<span className="text-primary">.</span>
            </span>
          </Link>

          <p aria-hidden className="section-marker text-fg-faint">
            N.J
          </p>
        </div>
      </header>

      {/* Floating bottom dock */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden"
      >
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "flex items-center gap-1 rounded-2xl border border-line bg-surface/90 p-1.5 shadow-lift backdrop-blur-xl transition-colors duration-500",
            isLightPage && "theme-light",
          )}
          style={{ WebkitBackdropFilter: "blur(20px)" }}
        >
          {navItems.map((item) => {
            const isActive =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 rounded-full px-4 py-2 transition-colors",
                  isActive ? "text-primary" : "text-fg-muted",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="dock-pill"
                    className="absolute inset-0 rounded-full border border-line-strong bg-elevated"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <Icon className="relative z-10 h-[18px] w-[18px]" />
                <span className="relative z-10 font-mono text-[9px] uppercase tracking-[0.14em]">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </motion.div>
      </nav>
    </>
  );
}
