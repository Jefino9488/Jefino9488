import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { ArrowLeft, ArrowRight, Home, BookOpen, Award, Github, User, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface NavItem {
    path: string
    label: string
    icon: React.ElementType
}

const navItems: NavItem[] = [
    { path: "/", label: "Home", icon: Home },
    { path: "/projects", label: "Projects", icon: Github },
    { path: "/blog", label: "Blog", icon: BookOpen },
    { path: "/certificates", label: "Certificates", icon: Award },
    { path: "/about", label: "About", icon: User },
]

const routeFlow = ["/", "/projects", "/blog", "/certificates", "/about"]

function normalizeRoute(pathname: string): string {
    if (pathname.startsWith("/projects/")) return "/projects"
    if (pathname.startsWith("/blog/")) return "/blog"
    return pathname
}

type NavState = "home-base" | "home-floating" | "menu-open" | "non-home"

export default function Navbar() {
    const [scrollY, setScrollY] = useState(0)
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()
    const ticking = useRef(false)

    const currentPath = normalizeRoute(location.pathname)
    const isHomeRoute = currentPath === "/"

    const currentItem =
        navItems.find((item) => currentPath === item.path) ||
        navItems[0]

    const flowIndex = routeFlow.findIndex((path) => path === currentItem.path)
    const previousPath = routeFlow[(flowIndex - 1 + routeFlow.length) % routeFlow.length]
    const nextPath = routeFlow[(flowIndex + 1) % routeFlow.length]
    const previousItem = navItems.find((item) => item.path === previousPath) || navItems[0]
    const nextItem = navItems.find((item) => item.path === nextPath) || navItems[0]

    const CurrentIcon = currentItem.icon

    // Determine Nav State
    let navState: NavState = "home-base"
    if (menuOpen) {
        navState = "menu-open"
    } else if (!isHomeRoute) {
        navState = "non-home"
    } else if (scrollY >= 76) {
        navState = "home-floating"
    }

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            if (ticking.current) return
            ticking.current = true
            window.requestAnimationFrame(() => {
                const y = window.scrollY
                setScrollY(y)
                ticking.current = false
            })
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Close menu on route change
    useEffect(() => {
        const y = window.scrollY
        setScrollY(y)
        setMenuOpen(false)
    }, [location.pathname])

    // Animation constants
    const contentVariants = {
        initial: { opacity: 0, scale: 0.95, y: 10, filter: "blur(4px)" },
        animate: { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            filter: "blur(0px)",
            transition: { type: "spring", stiffness: 300, damping: 24, delay: 0.1 } 
        },
        exit: { 
            opacity: 0, 
            scale: 0.95, 
            y: -10, 
            filter: "blur(4px)",
            transition: { duration: 0.2, ease: "easeOut" } 
        }
    }

    return (
        <header className="lg:hidden fixed left-0 right-0 z-50 flex items-start justify-center pt-0 pointer-events-none">
            {/* Morphing Container */}
            <motion.nav
                layout
                initial={false}
                animate={{
                    borderRadius: navState === "home-base" ? 0 : navState === "menu-open" ? 24 : 9999,
                }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                className={`pointer-events-auto overflow-hidden border backdrop-blur-xl transition-colors duration-500 will-change-transform flex flex-col justify-center ${
                    navState === "menu-open"
                        ? "w-[min(92vw,340px)] bg-[#07070b]/95 p-3 mt-4 border-white/20 shadow-[0_24px_55px_-24px_rgba(0,0,0,0.95)]"
                        : navState === "home-base"
                        ? "w-full bg-[#0a0a0a]/65 p-2 border-t-0 border-x-0 border-b border-white/10 shadow-none mt-0"
                        : "w-fit bg-[#0a0a0a]/85 p-1.5 mt-3 border-white/20 shadow-[0_16px_35px_-16px_rgba(0,0,0,0.65)]"
                }`}
                aria-label="Mobile smart navigation"
            >
                <AnimatePresence mode="popLayout" custom={navState}>
                    {navState === "home-base" && (
                        <motion.div
                            key="home-base"
                            variants={contentVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="flex items-center justify-between w-full px-2"
                        >
                            <div className="inline-flex items-center gap-2 rounded-full py-1 min-w-0">
                                <span className="text-[10px] font-mono tracking-[0.2em] text-white uppercase truncate">
                                    Jefino
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMenuOpen(true)}
                                className="inline-flex items-center justify-center rounded-full p-1.5 text-[#b3bad9] hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
                                aria-label="Open navigation island"
                            >
                                <Menu className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}

                    {navState === "home-floating" && (
                        <motion.div
                            key="home-floating"
                            variants={contentVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="flex items-center gap-1 w-max px-1"
                        >
                            <div className="inline-flex items-center gap-2 rounded-full px-2 py-1 min-w-0">
                                <CurrentIcon className="w-3.5 h-3.5 text-primary" />
                                <span className="text-[10px] font-mono tracking-widest text-white uppercase truncate">
                                    {currentItem.label}
                                </span>
                            </div>
                            <div className="h-5 w-px bg-white/15 mx-0.5" />
                            <Link
                                to={nextItem.path}
                                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-mono tracking-widest uppercase text-[#b3bad9] hover:text-white hover:bg-white/10 transition-colors"
                            >
                                {nextItem.label}
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                            <button
                                type="button"
                                onClick={() => setMenuOpen(true)}
                                className="inline-flex items-center justify-center rounded-full p-1.5 text-[#b3bad9] hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
                                aria-label="Open navigation island"
                            >
                                <Menu className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}

                    {navState === "non-home" && (
                        <motion.div
                            key="non-home"
                            variants={contentVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="flex items-center gap-1 w-max px-1"
                        >
                            <Link
                                to={previousItem.path}
                                className="inline-flex items-center justify-center rounded-full px-2 py-1.5 text-[#b3bad9] hover:text-white hover:bg-white/10 transition-colors"
                                aria-label={`Back to ${previousItem.label}`}
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                            </Link>
                            <div className="h-5 w-px bg-white/15 mx-0.5" />
                            <div className="inline-flex items-center gap-2 rounded-full px-2 py-1 min-w-0">
                                <CurrentIcon className="w-3.5 h-3.5 text-primary" />
                                <span className="text-[10px] font-mono tracking-widest text-white uppercase truncate">
                                    {currentItem.label}
                                </span>
                            </div>
                            <div className="h-5 w-px bg-white/15 mx-0.5" />
                            <Link
                                to={nextItem.path}
                                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-mono tracking-widest uppercase text-[#b3bad9] hover:text-white hover:bg-white/10 transition-colors"
                            >
                                {nextItem.label}
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </motion.div>
                    )}

                    {navState === "menu-open" && (
                        <motion.div
                            key="menu-open"
                            variants={contentVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="flex flex-col w-full"
                        >
                            <div className="flex items-center justify-between mb-3 px-1">
                                <span className="text-[10px] font-mono tracking-[0.2em] text-white uppercase">Jefino</span>
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen(false)}
                                    className="inline-flex items-center justify-center rounded-full p-1.5 text-[#b3bad9] hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
                                    aria-label="Close navigation island"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {navItems.map((item) => {
                                    const isActive = item.path === currentItem.path
                                    const Icon = item.icon

                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setMenuOpen(false)}
                                            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition-colors ${isActive
                                                ? "border-primary/40 bg-primary/15 text-white"
                                                : "border-white/10 bg-white/5 text-[#b3bad9] hover:text-white hover:bg-white/10"
                                                }`}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            <span className="font-mono tracking-wider uppercase truncate">{item.label}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </header>
    )
}
