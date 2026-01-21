import { Link, useLocation } from "react-router-dom"
import { Home, BookOpen, Award, Github, User, MapPin, Mail, Link as LinkIcon, Users, Star } from "lucide-react"
import LazyImage from "./LazyImage"
import SpotifyWidget from "./SpotifyWidget"
import { useGitHubData } from "./GitHubContext"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface NavItem {
    path: string
    label: string
    icon: React.ElementType
    description: string
}

const navItems: NavItem[] = [
    {
        path: "/",
        label: "Home",
        icon: Home,
        description: "Overview & Tech Stack"
    },
    {
        path: "/projects",
        label: "Projects",
        icon: Github,
        description: "Open Source Work"
    },
    {
        path: "/blog",
        label: "Blog",
        icon: BookOpen,
        description: "Technical Writing"
    },
    {
        path: "/certificates",
        label: "Certificates",
        icon: Award,
        description: "Achievements"
    },
    {
        path: "/about",
        label: "About",
        icon: User,
        description: "My Journey"
    },
]

export default function Sidebar() {
    const location = useLocation()

    // Use shared GitHub context instead of local fetching
    const { profile, loading } = useGitHubData()
    const followers = profile?.followers ?? null
    const following = profile?.following ?? null

    return (
        <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-80 glass-crystal border-r-0 overflow-y-auto font-sans custom-scrollbar z-50">
            {/* Profile Card Container */}
            <div className="p-3">
                <Card className="glass-crystal border-0 shadow-sm hover:shadow-md transition-shadow group/card">
                    {/* Banner */}
                    <div className="h-28 relative rounded-t-xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 z-10" />
                        <LazyImage
                            src="/profile/banner.jpg"
                            alt="Profile Banner"
                            className="w-full h-full object-cover type-module transition-transform duration-700 group-hover/card:scale-110"
                            priority={true}
                        />
                    </div>

                    {/* Profile Header Content */}
                    <div className="px-5 pb-5 relative">
                        {/* Profile Picture & Status & Widget Wrapper */}
                        <div className="relative -mt-16 mb-4 flex justify-between items-end">
                            <div className="relative z-20">
                                {/* Profile Image */}
                                <div className="w-28 h-28 rounded-full border-[6px] border-sidebar bg-sidebar overflow-hidden relative z-10 shadow-lg group-hover/card:scale-105 transition-transform duration-300">
                                    <LazyImage
                                        src="/profile/profile.jpg"
                                        alt="Jefino"
                                        className="w-full h-full object-cover"
                                        style={{ objectPosition: 'center 20%' }}
                                        priority={true}
                                        width={112}
                                        height={112}
                                    />
                                </div>

                                {/* Online Status Indicator */}
                                <div className="absolute bottom-1 right-1 w-8 h-8 bg-green-500 border-[5px] border-sidebar rounded-full z-20 animate-pulse shadow-sm" />
                            </div>

                            {/* Spotify Widget - Positioned better */}
                            <div className="absolute left-[7.5rem] bottom-1 z-10">
                                <SpotifyWidget showDetails={true} className="origin-bottom-left scale-90 sm:scale-100" />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="mt-2 mb-4">
                            <h2 className="text-2xl font-bold text-sidebar-foreground leading-tight tracking-tight">Jefino</h2>
                            <p className="text-sm text-sidebar-foreground/70 font-medium font-inter">@jefino9488</p>
                        </div>

                        {/* Bio */}
                        <p className="text-sm text-sidebar-foreground/90 leading-relaxed mb-5 font-inter">
                            AI & Data Science Undergrad | Full-Stack Developer | Open Source
                        </p>

                        {/* Social Hub - Compact Row */}
                        <div className="flex items-center gap-3 mb-5 overflow-x-auto hide-scrollbar py-1">
                            {/* Email */}
                            <a href="mailto:jefinojacob9488@gmail.com" className="p-2 rounded-lg bg-sidebar-accent/50 hover:bg-primary/10 hover:text-primary transition-all hover:-translate-y-1 text-sidebar-foreground/70" title="Email Me">
                                <Mail className="w-4 h-4" />
                            </a>
                            {/* LinkedIn */}
                            <a href="https://linkedin.com/in/jefino9488" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-sidebar-accent/50 hover:bg-[#0077b5]/10 hover:text-[#0077b5] transition-all hover:-translate-y-1 text-sidebar-foreground/70" title="LinkedIn">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            </a>
                            {/* Website */}
                            <a href="https://jefino.is-a.dev" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-sidebar-accent/50 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all hover:-translate-y-1 text-sidebar-foreground/70" title="Portfolio">
                                <LinkIcon className="w-4 h-4" />
                            </a>
                            {/* X */}
                            <a href="https://x.com/jefino29014673" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-sidebar-accent/50 hover:bg-black/10 hover:text-foreground transition-all hover:-translate-y-1 text-sidebar-foreground/70" title="X (Twitter)">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </a>
                            {/* Location (Static) */}
                            <div className="p-2 rounded-lg bg-sidebar-accent/50 text-sidebar-foreground/70 cursor-help" title="Chennai">
                                <MapPin className="w-4 h-4" />
                            </div>
                        </div>

                        {/* GitHub Buttons */}
                        <div className="flex gap-3 mb-5">
                            <a href="https://github.com/Jefino9488" target="_blank" rel="noopener noreferrer"
                                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium py-2 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2">
                                <Github className="w-4 h-4" />
                                Follow
                            </a>
                            <a href="https://github.com/sponsors/Jefino9488" target="_blank" rel="noopener noreferrer"
                                className="flex-1 glass-crystal hover:bg-sidebar-accent/50 text-sidebar-foreground text-sm font-medium py-2 rounded-lg border border-sidebar-border/50 hover:border-sidebar-border transition-all text-center flex items-center justify-center gap-2">
                                <Star className="w-4 h-4 text-amber-500" />
                                Sponsor
                            </a>
                        </div>

                        {/* Stats - Clean Row */}
                        <div className="flex items-center justify-between text-sm text-sidebar-foreground/80 px-1">
                            <a href="https://github.com/Jefino9488?tab=followers" target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:text-primary transition-colors group/stat">
                                <div className="p-1 rounded bg-sidebar-accent/50 group-hover/stat:bg-primary/10 transition-colors">
                                    <Users className="w-3.5 h-3.5" />
                                </div>
                                <span className="font-bold">{loading ? '...' : (followers ?? '—')}</span>
                                <span className="text-xs opacity-70">followers</span>
                            </a>
                            <div className="w-px h-4 bg-border/50" />
                            <a href="https://github.com/Jefino9488?tab=following" target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 hover:text-primary transition-colors group/stat">
                                <div className="p-1 rounded bg-sidebar-accent/50 group-hover/stat:bg-primary/10 transition-colors">
                                    <Users className="w-3.5 h-3.5" />
                                </div>
                                <span className="font-bold">{loading ? '...' : (following ?? '—')}</span>
                                <span className="text-xs opacity-70">following</span>
                            </a>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Navigation Section */}
            <nav className="px-3 pb-6 flex-1 overflow-y-auto hide-scrollbar">
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const isActive =
                            location.pathname === item.path ||
                            (item.path !== "/" && location.pathname.startsWith(item.path))

                        return (
                            <Link key={item.path} to={item.path}>
                                <div
                                    className={cn(
                                        "group flex items-center px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden",
                                        isActive
                                            ? "bg-primary/5 text-primary shadow-sm"
                                            : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {/* Active State Indicator */}
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                                    )}

                                    <item.icon className={cn(
                                        "w-5 h-5 mr-3 transition-colors duration-300",
                                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                    )} />
                                    <div className="flex flex-col relative z-10">
                                        <span className="font-medium text-sm">
                                            {item.label}
                                        </span>
                                        <span className="textxs opacity-60 font-normal">
                                            {item.description}
                                        </span>
                                    </div>

                                    {/* Chevron for active/hover */}
                                    <div className={cn(
                                        "ml-auto opacity-0 -translate-x-2 transition-all duration-300",
                                        (isActive || "group-hover:opacity-100") ? "opacity-100 translate-x-0" : ""
                                    )}>
                                        <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Footer */}
            <div className="p-4 bg-transparent border-t border-sidebar-border/30">
                <div className="flex items-center justify-between text-xs text-sidebar-foreground/40">
                    <p>© 2025 Jefino</p>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500/50 animate-pulse" title="System Operational" />
                        <span>v2.0.0</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}
