import { Link, useLocation } from "react-router-dom"
import { Home, BookOpen, Award, Github, User, MapPin, Mail, Link as LinkIcon, Users, Star } from "lucide-react"
import SpotifyWidget from "./SpotifyWidget"
import { useGitHubData } from "./GitHubContext"
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
        <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-80 glass-crystal border-r-0 overflow-y-auto font-sans hide-scrollbar z-50 bg-[#020205]/60 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.5)]">
            
            {/* Edge Glint */}
            <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#666fbc]/30 to-transparent" />

            <div className="p-6 flex flex-col h-full relative z-10 space-y-8">
                
                {/* 01. IDENTITY MATRIX */}
                <div className="relative">
                    {/* decorative node map */}
                    <div className="absolute -top-4 -right-4 text-[#666fbc]/20 font-mono text-[8px] whitespace-pre select-none pointer-events-none">
                        {`+---+--+\n| SYS |\n+---+--+`}
                    </div>

                    <div className="flex items-start gap-4">
                        {/* Radar Avatar */}
                        <div className="relative flex-shrink-0 group">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-colors duration-700" />
                            {/* Rotating HUD circle */}
                            <div className="absolute -inset-1 border border-dashed border-primary/40 rounded-full animate-[spin_20s_linear_infinite]" />
                            <div className="relative w-[84px] h-[84px] rounded-full border-2 border-[#666fbc] bg-black overflow-hidden p-0.5">
                                <picture>
                                    <source srcSet="/profile/profile_anime.webp" type="image/webp" />
                                    <img
                                        src="/profile/profile_anime.jpg"
                                        alt="Jefino"
                                        className="w-full h-full object-cover rounded-full"
                                        style={{ objectPosition: 'center 20%' }}
                                        width="80"
                                        height="80"
                                    />
                                </picture>
                            </div>
                            {/* Status Node */}
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border border-black shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" title="System Online" />
                        </div>

                        {/* ID Block */}
                        <div className="flex-1 pt-1">
                            <h2 className="text-xl font-orbitron font-bold text-white tracking-widest uppercase truncate mb-1 text-shadow-glow">Jefino</h2>
                            <p className="text-[10px] font-mono text-[#8ab8d0] uppercase tracking-wider mb-2">@jefino9488</p>
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 border border-primary/30 rounded text-[9px] font-mono text-primary uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> ROOT_ACCESS
                            </div>
                        </div>
                    </div>

                    <p className="mt-4 text-xs font-mono text-muted-foreground leading-relaxed border-l-2 border-white/10 pl-3">
                        AI & DATA_SCI <span className="text-primary">|</span> FS_ENGINEER <span className="text-primary">|</span> O_SOURCE
                    </p>
                </div>

                {/* 02. TELEMETRY STATS */}
                <div className="grid grid-cols-2 gap-2 font-mono">
                    <a href="https://github.com/Jefino9488?tab=followers" target="_blank" rel="noopener noreferrer" 
                       className="group flex flex-col p-3 bg-white/[0.02] border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] text-[#b3bad9] uppercase tracking-widest">Followers</span>
                            <Users className="w-3 h-3 text-[#666fbc] group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-xl text-white font-light tracking-tight group-hover:text-shadow-glow">
                            {loading ? '--' : (followers ?? '--')}
                        </span>
                    </a>
                    <a href="https://github.com/Jefino9488?tab=following" target="_blank" rel="noopener noreferrer" 
                       className="group flex flex-col p-3 bg-white/[0.02] border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] text-[#b3bad9] uppercase tracking-widest">Following</span>
                            <Users className="w-3 h-3 text-[#666fbc] group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-xl text-white font-light tracking-tight group-hover:text-shadow-glow">
                            {loading ? '--' : (following ?? '--')}
                        </span>
                    </a>
                </div>

                {/* 03. UPLINK ARRAY (Navigation) */}
                <nav className="flex-1 relative">
                    <div className="absolute left-3.5 top-0 bottom-0 w-px bg-white/5" />
                    
                    <div className="space-y-1.5 relative z-10">
                        {navItems.map((item, index) => {
                            const isActive =
                                location.pathname === item.path ||
                                (item.path !== "/" && location.pathname.startsWith(item.path));
                            
                            const idxStr = String(index + 1).padStart(2, '0');

                            return (
                                <Link key={item.path} to={item.path} className="block group cursor-pointer focus:outline-none">
                                    <div className={cn(
                                        "flex items-center p-2 rounded relative transition-all duration-300",
                                        isActive ? "bg-[#666fbc]/10" : "hover:bg-white/5"
                                    )}>
                                        {/* Connector node & line highlight */}
                                        <div className={cn(
                                            "absolute left-0 w-0.5 transition-all duration-300 rounded",
                                            isActive ? "h-full bg-primary top-0 shadow-[0_0_8px_rgba(102,111,188,0.8)]" : "h-0 bg-white/20 top-1/2 group-hover:h-full group-hover:top-0"
                                        )} />
                                        
                                        {/* Grid Node */}
                                        <div className={cn(
                                            "w-7 h-7 flex items-center justify-center bg-black/40 border transition-all duration-300 mr-4 z-10 shadow-sm shrink-0",
                                            isActive ? "border-primary text-primary" : "border-white/10 text-muted-foreground group-hover:border-white/30 group-hover:text-white"
                                        )}>
                                            <item.icon className="w-[14px] h-[14px]" />
                                        </div>

                                        <div className="flex flex-col flex-1 truncate">
                                            <div className="flex items-center justify-between">
                                                <span className={cn(
                                                    "font-orbitron text-xs tracking-wider uppercase transition-colors truncate",
                                                    isActive ? "text-primary text-shadow-glow" : "text-[#b3bad9] group-hover:text-white"
                                                )}>
                                                    {item.label}
                                                </span>
                                                <span className="font-mono text-[9px] text-white/20 shrink-0 select-none">
                                                    [{idxStr}]
                                                </span>
                                            </div>
                                            <span className={cn(
                                                "font-mono text-[9px] truncate transition-colors",
                                                isActive ? "text-primary/70" : "text-white/40 group-hover:text-white/60"
                                            )}>
                                                {item.description}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </nav>

                {/* 04. COMMS / SOCIAL */}
                <div>
                     <div className="flex flex-wrap gap-2 text-xs mb-6">
                        <a href="https://github.com/Jefino9488" target="_blank" rel="noopener noreferrer" 
                           className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white/[0.03] border border-white/10 hover:border-primary/50 hover:bg-primary/10 text-[#b3bad9] hover:text-white font-mono uppercase tracking-widest transition-all">
                            <Github className="w-3.5 h-3.5" /> GITHUB
                        </a>
                        <a href="https://github.com/sponsors/Jefino9488" target="_blank" rel="noopener noreferrer" 
                           className="flex items-center justify-center gap-2 py-2 px-3 bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/10 text-amber-500/80 hover:text-amber-400 font-mono uppercase tracking-widest transition-all">
                            <Star className="w-3.5 h-3.5" /> SUPPORT
                        </a>
                    </div>
                     
                    <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
                        <a href="mailto:jefinojacob9488@gmail.com" className="p-2 border border-white/5 bg-black/20 hover:border-primary/40 hover:bg-primary/10 text-white/50 hover:text-primary transition-all">
                            <Mail className="w-4 h-4" />
                        </a>
                        <a href="https://linkedin.com/in/jefino9488" target="_blank" rel="noopener noreferrer" className="p-2 border border-white/5 bg-black/20 hover:border-[#0077b5]/50 hover:bg-[#0077b5]/10 text-white/50 hover:text-[#0077b5] transition-all">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                        </a>
                        <a href="https://jefino.is-a.dev" target="_blank" rel="noopener noreferrer" className="p-2 border border-white/5 bg-black/20 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-white/50 hover:text-emerald-500 transition-all">
                            <LinkIcon className="w-4 h-4" />
                        </a>
                        <a href="https://x.com/jefino29014673" target="_blank" rel="noopener noreferrer" className="p-2 border border-white/5 bg-black/20 hover:border-white/50 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        </a>
                        <div className="p-2 border border-white/5 bg-black/20 text-white/50 cursor-help" title="Chennai, IN">
                            <MapPin className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Spotify & Footer Segment */}
                <div className="pt-4 border-t border-white/10">
                    <div className="mb-4">
                        <SpotifyWidget showDetails={false} className="opacity-70 hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 font-mono text-[9px] text-white/30 uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500/80 rounded block shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                            SYS_OK
                        </div>
                        <span>V.2.5.0 // 2025</span>
                    </div>
                </div>

            </div>
        </aside>
    )
}
