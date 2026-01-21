import { Link, useLocation } from "react-router-dom"
import { Home, BookOpen, Award, Github, User, MapPin, Mail, Link as LinkIcon, Users, Building2, Star, Cpu } from "lucide-react"
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
                <Card className="glass-crystal overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                    {/* Banner */}
                    <div className="h-28 relative">
                        <LazyImage
                            src="/profile/banner.jpg"
                            alt="Profile Banner"
                            className="w-full h-full object-cover"
                            priority={true}
                        />
                    </div>

                    {/* Profile Header Content */}
                    <div className="px-5 pb-5 relative">
                        {/* Profile Picture & Status Wrapper */}
                        <div className="relative -mt-16 mb-4 flex justify-between items-end">
                            <div className="relative">
                                {/* Profile Image */}
                                <div className="w-28 h-28 rounded-full border-[6px] border-sidebar bg-sidebar overflow-hidden relative z-10 shadow-sm">
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
                                <div className="absolute bottom-1 right-1 w-8 h-8 bg-green-600 border-[5px] border-sidebar rounded-full z-20"></div>
                            </div>

                            {/* Spotify Widget */}
                            <div className="absolute left-32 bottom-8 z-10">
                                <SpotifyWidget showDetails={true} className="origin-bottom-left" />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="mt-1 mb-4">
                            <h2 className="text-2xl font-bold text-sidebar-foreground leading-tight">Jefino</h2>
                            <p className="text-base text-sidebar-foreground/70 font-medium">jefino9488</p>
                        </div>

                        {/* Bio */}
                        <p className="text-sm text-sidebar-foreground/90 leading-relaxed mb-5">
                            AI & Data Science Undergrad | Full-Stack Developer | Open Source
                        </p>

                        {/* GitHub Buttons */}
                        <div className="flex gap-3 mb-5">
                            <a href="https://github.com/Jefino9488" target="_blank" rel="noopener noreferrer" className="flex-1 bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-accent-foreground text-sm font-medium py-2 rounded-md border border-sidebar-border transition-colors text-center">
                                Follow
                            </a>
                            <a href="https://github.com/sponsors/Jefino9488" target="_blank" rel="noopener noreferrer" className="flex-1 bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-accent-foreground text-sm font-medium py-2 rounded-md border border-sidebar-border transition-colors text-center">
                                Sponsor
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-sidebar-foreground/70 mb-5">
                            <a
                                href="https://github.com/Jefino9488?tab=followers"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors"
                            >
                                <Users className="w-4 h-4" />
                                {loading ? (
                                    <span className="font-bold text-sidebar-foreground animate-pulse bg-sidebar-accent rounded w-8 h-4 inline-block"></span>
                                ) : (
                                    <span className="font-bold text-sidebar-foreground">{followers ?? '—'}</span>
                                )}
                                {' '}followers
                            </a>
                            <a
                                href="https://github.com/Jefino9488?tab=following"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors"
                            >
                                {loading ? (
                                    <span className="font-bold text-sidebar-foreground animate-pulse bg-sidebar-accent rounded w-8 h-4 inline-block"></span>
                                ) : (
                                    <span className="font-bold text-sidebar-foreground">{following ?? '—'}</span>
                                )}
                                {' '}following
                            </a>
                        </div>

                        {/* Contact Info List */}
                        <div className="space-y-2.5 text-sm text-sidebar-foreground/70 mb-6">
                            <div className="flex items-center gap-3">
                                <Building2 className="w-4 h-4 opacity-70" />
                                <span>@ResurrectedOS</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 opacity-70" />
                                <span>Chennai</span>
                            </div>
                            <a href="mailto:jefinojacob9488@gmail.com" className="flex items-center gap-3 hover:text-primary transition-colors">
                                <Mail className="w-4 h-4 opacity-70" />
                                <span className="truncate">jefinojacob9488@gmail.com</span>
                            </a>
                            <a href="https://jefino.is-a.dev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors">
                                <LinkIcon className="w-4 h-4 opacity-70" />
                                <span>jefino.is-a.dev</span>
                            </a>
                            <a href="https://x.com/jefino29014673" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors">
                                <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                <span>@jefino29014673</span>
                            </a>
                            <a href="https://linkedin.com/in/jefino9488" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-primary transition-colors">
                                <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                <span>in/jefino9488</span>
                            </a>
                        </div>

                        {/* Highlights */}
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-sidebar-foreground mb-3">Highlights</h3>
                            <div className="space-y-2.5">
                                <div className="flex items-center gap-2 text-sm text-sidebar-foreground/70">
                                    <Cpu className="w-4 h-4 opacity-70" />
                                    <span>Developer Program Member</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-sidebar-foreground/70">
                                    <Star className="w-4 h-4 opacity-70" />
                                    <span className="bg-blue-500/15 text-blue-500 px-2 py-0.5 rounded text-xs border border-blue-500/30 font-medium">PRO</span>
                                </div>
                            </div>
                        </div>

                        {/* Organizations */}
                        <div>
                            <h3 className="text-sm font-bold text-sidebar-foreground mb-3">Organizations</h3>
                            <div className="flex gap-2">
                                <a href="https://github.com/ResurrectedOS" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded bg-white flex items-center justify-center overflow-hidden border border-sidebar-border hover:opacity-80 transition-opacity">
                                    <img src="https://avatars.githubusercontent.com/u/159568627?s=64&v=4" alt="ResurrectedOS" className="w-full h-full object-cover" />
                                </a>
                                <a href="https://github.com/Kaizen-Spark" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded bg-white flex items-center justify-center overflow-hidden border border-sidebar-border hover:opacity-80 transition-opacity">
                                    <img src="https://avatars.githubusercontent.com/u/177112339?s=64&v=4" alt="Kaizen-Spark" className="w-full h-full object-cover" />
                                </a>
                                <a href="https://github.com/XagaForge" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded bg-white flex items-center justify-center overflow-hidden border border-sidebar-border hover:opacity-80 transition-opacity">
                                    <img src="https://avatars.githubusercontent.com/u/182200090?s=200&v=4" alt="XagaForge" className="w-full h-full object-cover" />
                                </a>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Navigation Section */}
            <nav className="px-3 pb-6 flex-1">
                <div className="space-y-2">
                    {navItems.map((item) => {
                        const isActive =
                            location.pathname === item.path ||
                            (item.path !== "/" && location.pathname.startsWith(item.path))

                        return (
                            <Link key={item.path} to={item.path}>
                                <div
                                    className={cn(
                                        "group flex items-center px-4 py-3 rounded-lg transition-all border",
                                        isActive
                                            ? "bg-white/10 border-white/10 shadow-sm backdrop-blur-sm"
                                            : "border-transparent hover:bg-white/5 hover:border-white/5"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "w-5 h-5 mr-3 transition-colors",
                                        isActive ? "text-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"
                                    )} />
                                    <div className="flex flex-col">
                                        <span className={cn(
                                            "font-semibold text-sm transition-colors",
                                            isActive ? "text-sidebar-foreground" : "text-sidebar-foreground/70 group-hover:text-sidebar-foreground"
                                        )}>
                                            {item.label}
                                        </span>
                                        <span className="text-xs text-sidebar-foreground/50 mt-0.5">
                                            {item.description}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Footer */}
            <div className="p-4 bg-sidebar border-t border-sidebar-border/50">
                <p className="text-xs text-sidebar-foreground/50 text-center">
                    © 2025 Jefino Jacob
                </p>
            </div>
        </aside>
    )
}
