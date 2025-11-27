import { Link, useLocation } from "react-router-dom"
import { Home, BookOpen, Award, Github, User, MapPin, Mail, Link as LinkIcon, Users, Building2, Star, Cpu } from "lucide-react"
import LazyImage from "./LazyImage"
import SpotifyWidget from "./SpotifyWidget"

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

    return (
        <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-1/4 bg-background border-r border-border overflow-y-auto font-sans custom-scrollbar">
            {/* Profile Card Container */}
            <div className="m-3 bg-card rounded-xl shadow-lg border border-border">
                {/* Banner */}
                <div className="h-28 relative rounded-t-xl overflow-hidden">
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
                            <div className="w-28 h-28 rounded-full border-[6px] border-card bg-card overflow-hidden relative z-10">
                                <LazyImage
                                    src="/profile/profile.jpg"
                                    alt="Jefino Jacob"
                                    className="w-full h-full object-cover"
                                    style={{ objectPosition: 'center 20%' }}
                                    priority={true}
                                    width={112}
                                    height={112}
                                />
                            </div>

                            {/* Online Status Indicator */}
                            <div className="absolute bottom-1 right-1 w-8 h-8 bg-[#238636] border-[5px] border-card rounded-full z-20"></div>
                        </div>

                        {/* Spotify Widget */}
                        <div className="absolute left-32 bottom-8 z-10">
                            <SpotifyWidget showDetails={true} className="origin-bottom-left" />
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="mt-1 mb-4">
                        <h2 className="text-2xl font-bold text-[#c9d1d9] leading-tight">Jefino</h2>
                        <p className="text-base text-[#8b949e] font-medium">jefino9488</p>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-[#c9d1d9] leading-relaxed mb-5">
                        AI & Data Science Undergrad | Full-Stack Developer | Open Source & Automation Enthusiast
                    </p>

                    {/* GitHub Buttons */}
                    <div className="flex gap-3 mb-5">
                        <a href="https://github.com/Jefino9488" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-sm font-medium py-2 rounded-md border border-[#30363d] transition-colors text-center">
                            Follow
                        </a>
                        <a href="https://github.com/sponsors/Jefino9488" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] text-sm font-medium py-2 rounded-md border border-[#30363d] transition-colors text-center">
                            Sponsor
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-[#8b949e] mb-5">
                        <div className="flex items-center gap-1 hover:text-[#58a6ff] cursor-pointer transition-colors">
                            <Users className="w-4 h-4" />
                            <span className="font-bold text-[#c9d1d9]">82</span> followers
                        </div>
                        <div className="flex items-center gap-1 hover:text-[#58a6ff] cursor-pointer transition-colors">
                            <span className="font-bold text-[#c9d1d9]">55</span> following
                        </div>
                    </div>

                    {/* Contact Info List */}
                    <div className="space-y-2.5 text-sm text-[#8b949e] mb-6">
                        <div className="flex items-center gap-3">
                            <Building2 className="w-4 h-4 text-[#8b949e]" />
                            <span>@ResurrectedOS</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-[#8b949e]" />
                            <span>Chennai</span>
                        </div>
                        <a href="mailto:jefinojacob9488@gmail.com" className="flex items-center gap-3 hover:text-[#58a6ff] transition-colors">
                            <Mail className="w-4 h-4 text-[#8b949e]" />
                            <span className="truncate">jefinojacob9488@gmail.com</span>
                        </a>
                        <a href="https://jefino.is-a.dev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#58a6ff] transition-colors">
                            <LinkIcon className="w-4 h-4 text-[#8b949e]" />
                            <span>jefino.is-a.dev</span>
                        </a>
                        <a href="https://x.com/jefino29014673" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#58a6ff] transition-colors">
                            <svg className="w-4 h-4 text-[#8b949e]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                            <span>@jefino29014673</span>
                        </a>
                        <a href="https://linkedin.com/in/jefino9488" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#58a6ff] transition-colors">
                            <svg className="w-4 h-4 text-[#8b949e]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            <span>in/jefino9488</span>
                        </a>
                    </div>

                    {/* Highlights */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-[#c9d1d9] mb-3">Highlights</h3>
                        <div className="space-y-2.5">
                            <div className="flex items-center gap-2 text-sm text-[#8b949e]">
                                <Cpu className="w-4 h-4 text-[#8b949e]" />
                                <span>Developer Program Member</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#8b949e]">
                                <Star className="w-4 h-4 text-[#8b949e]" />
                                <span className="bg-[#388bfd26] text-[#58a6ff] px-2 py-0.5 rounded text-xs border border-[#388bfd4d] font-medium">PRO</span>
                            </div>
                        </div>
                    </div>

                    {/* Organizations */}
                    <div>
                        <h3 className="text-sm font-bold text-[#c9d1d9] mb-3">Organizations</h3>
                        <div className="flex gap-2">
                            <div className="w-9 h-9 rounded bg-white flex items-center justify-center overflow-hidden border border-[#30363d]">
                                <span className="text-black font-bold text-xs">ROS</span>
                            </div>
                            <div className="w-9 h-9 rounded bg-black flex items-center justify-center overflow-hidden border border-[#30363d]">
                                <div className="w-5 h-5 rounded-full bg-purple-600"></div>
                            </div>
                            <div className="w-9 h-9 rounded bg-[#111] flex items-center justify-center overflow-hidden border border-[#30363d]">
                                <div className="text-cyan-400 text-sm">⚛️</div>
                            </div>
                        </div>
                    </div>
                </div>
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
                                    className={`group flex items-center px-4 py-3 rounded-lg transition-all border ${isActive
                                        ? "bg-[#161b22] border-[#30363d] shadow-sm"
                                        : "border-transparent hover:bg-[#161b22] hover:border-[#30363d]"
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 mr-3 ${isActive ? "text-[#58a6ff]" : "text-[#8b949e] group-hover:text-[#c9d1d9]"}`} />
                                    <div className="flex flex-col">
                                        <span className={`font-semibold text-sm ${isActive ? "text-[#c9d1d9]" : "text-[#8b949e] group-hover:text-[#c9d1d9]"}`}>
                                            {item.label}
                                        </span>
                                        <span className="text-xs text-[#8b949e] mt-0.5">
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
            <div className="p-4 bg-[#0d1117] border-t border-[#30363d]">
                <p className="text-xs text-[#8b949e] text-center">
                    © 2025 Jefino Jacob
                </p>
            </div>
        </aside>
    )
}
