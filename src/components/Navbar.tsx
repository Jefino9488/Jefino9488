import type React from "react"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Home, BookOpen, Award, Github, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import TouchFeedback from "./TouchFeedback"

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

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false)
    }, [location.pathname])

    return (
        <header
            className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm" : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand */}
                    <Link to="/" className="flex items-center">
                        <span className="text-xl font-bold text-foreground">Jefino</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => {
                            const isActive =
                                location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path))

                            return (
                                <Link key={item.path} to={item.path}>
                                    <Button
                                        variant="ghost"
                                        className={`relative px-3 py-2 text-sm rounded-lg transition-colors ${isActive
                                            ? "!text-foreground !bg-secondary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                            }`}
                                    >
                                        <item.icon className="w-4 h-4 mr-2" />
                                        {item.label}
                                        {isActive && (
                                            <motion.div
                                                layoutId="navbar-indicator"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                                initial={false}
                                            />
                                        )}
                                    </Button>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <TouchFeedback
                            onTap={() => setIsOpen(!isOpen)}
                            ripple={false}
                            className="rounded-lg"
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label={isOpen ? "Close menu" : "Open menu"}
                                className="text-foreground hover:bg-secondary hover:text-foreground min-h-[44px] min-w-[44px]"
                            >
                                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </TouchFeedback>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden bg-background border-b border-border"
                    >
                        <div className="px-4 py-3 space-y-1">
                            {navItems.map((item) => {
                                const isActive =
                                    location.pathname === item.path ||
                                    (item.path !== "/" && location.pathname.startsWith(item.path))

                                return (
                                    <Link key={item.path} to={item.path} className="block">
                                        <TouchFeedback
                                            onTap={() => setIsOpen(false)}
                                            ripple={false}
                                            className="w-full"
                                        >
                                            <Button
                                                variant="ghost"
                                                className={`w-full justify-start text-left min-h-[44px] ${isActive
                                                    ? "!bg-secondary !text-foreground"
                                                    : "text-muted-foreground hover:bg-transparent hover:text-foreground"
                                                    }`}
                                            >
                                                <item.icon className="w-5 h-5 mr-3" />
                                                {item.label}
                                            </Button>
                                        </TouchFeedback>
                                    </Link>
                                )
                            })}
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </header>
    )
}
