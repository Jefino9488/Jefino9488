import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

export default function Sidebar() {
  const location = useLocation();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-5 z-50 hidden justify-center px-6 lg:flex">
      <motion.nav
        aria-label="Primary"
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-line bg-[#0a0e11]/75 p-1.5 pl-5 shadow-lift backdrop-blur-xl"
        style={{ WebkitBackdropFilter: "blur(20px)" }}
      >
        <Link
          to="/"
          className="mr-4 font-poppins text-[15px] font-semibold tracking-tight text-[#f2f5f5] transition-colors hover:text-white"
        >
          Jefino<span className="text-primary">.</span>
        </Link>

        <div className="flex items-center gap-0.5">
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
                  "relative rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300",
                  isActive
                    ? "text-[#f2f5f5]"
                    : "text-fg-muted hover:text-[#f2f5f5]",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="desktop-nav-pill"
                    className="absolute inset-0 rounded-full border border-line-strong bg-elevated"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <span aria-hidden className="mx-3 h-4 w-px bg-line" />

        <span className="mr-2 inline-flex items-center gap-2 pr-1 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
          Open to work
        </span>
      </motion.nav>
    </header>
  );
}
