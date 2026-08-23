import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { isLightRoute } from "@/lib/lightRoutes";

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
  const isLightPage = isLightRoute(location.pathname);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden lg:block">
      <motion.nav
        aria-label="Primary"
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className={cn(
          "pointer-events-auto border-b backdrop-blur-xl transition-colors duration-500",
          isLightPage
            ? "theme-light border-line/70 bg-sage/70"
            : "border-line/70 bg-background/70",
        )}
        style={{ WebkitBackdropFilter: "blur(20px)" }}
      >
        <div className="mx-auto flex h-[4.75rem] max-w-[90rem] items-center justify-between px-8">
          {/* Brand */}
          <Link
            to="/"
            className={cn(
              "font-poppins text-[17px] font-semibold tracking-tight text-foreground transition-colors",
              isLightPage ? "hover:text-primary" : "hover:text-white",
            )}
          >
            Jefino<span className="text-primary">.</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-9">
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
                    "group relative py-2 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors duration-300",
                    isActive
                      ? "text-foreground"
                      : "text-fg-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-primary transition-transform duration-300",
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              );
            })}
          </div>

          {/* Spacer to balance brand on the left */}
          <span aria-hidden className="w-[52px]" />
        </div>
      </motion.nav>
    </header>
  );
}
