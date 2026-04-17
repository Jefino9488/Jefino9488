import { useProjects } from "./ProjectsContext"
import { Link } from "react-router-dom"
import { ExternalLink, Github, ArrowRight } from "lucide-react"
import PageHeader from "./PageHeader"
import { motion } from "framer-motion"
import GitHubDashboard from "@/components/GitHubDashboard.tsx"
import { useGitHubData } from "@/components/GitHubContext"
import { useState } from "react"

export default function Projects() {
    const { pinnedProjects, allProjects, loading, error } = useProjects()
    const { profile } = useGitHubData()
    const [showAll, setShowAll] = useState(false)

    if (loading) {
        return (
            <div className="min-h-screen relative flex items-center justify-center">
                <div className="text-center text-muted-foreground z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4 drop-shadow-[0_0_15px_rgba(102,111,188,0.5)]"></div>
                    <span className="font-mono tracking-widest uppercase text-xs">Loading Repositories...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen relative flex items-center justify-center">
                <div className="text-center text-destructive font-mono text-sm z-10 bg-black/40 backdrop-blur-md px-6 py-4 rounded-xl border border-destructive/20">{error}</div>
            </div>
        )
    }

    // Always show only pinned (up to 6) in the primary grid
    const displayedProjects = showAll ? allProjects : pinnedProjects.slice(0, 6)

    return (
        <div className="min-h-screen text-foreground relative">
            <PageHeader 
                title={showAll ? "All Repositories" : "Selected Works"}
                icon={Github}
                rightAction={
                    <button
                        onClick={() => setShowAll((v) => !v)}
                        className="text-[10px] sm:text-xs text-primary border border-primary/20 font-mono uppercase tracking-wider px-3 sm:px-4 py-1.5 rounded-full bg-primary/5 hover:bg-primary/20 transition-all shadow-[0_0_15px_-3px_rgba(102,111,188,0.3)] whitespace-nowrap"
                    >
                        {showAll ? `Pinned (${pinnedProjects.length})` : `View All (${allProjects.length})`}
                    </button>
                }
            />

            <div className="container mx-auto px-4 py-24 sm:py-32 max-w-6xl space-y-16 sm:space-y-24">

                {/* GitHub Dashboard Section */}
                <section className="w-full max-w-6xl mx-auto">
                    <GitHubDashboard />
                </section>

                {/* Zigzag Projects Section */}
                <section className="w-full max-w-6xl mx-auto relative relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
                        {displayedProjects.map((project, index) => {
                            // Extract year realistically from updated_at if available, else fallback
                            const dateStr = project.updatedAt ? new Date(project.updatedAt).getFullYear() : "2024"

                            return (
                                <motion.div
                                    key={project.title}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    className={`relative flex flex-col gap-4 ${index % 2 === 1 ? 'lg:mt-32' : ''}`}
                                >
                                    {/* Top Meta Data */}
                                    <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[#b3bad9]/60 mb-2">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[#8ab8d0] font-semibold">{String(index + 1).padStart(2, '0')}</span>
                                            <span className="w-12 h-px bg-white/10" />
                                            <span>{project.tech[0] || 'REPOSITORY'}</span>
                                        </div>
                                        <span>Q4 {dateStr}</span>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-3xl sm:text-4xl font-poppins font-semibold text-white mb-2 tracking-tight">
                                        {project.title.charAt(0).toUpperCase() + project.title.slice(1).replace(/-/g, ' ')}
                                    </h2>

                                    {/* Card / Mockup Container */}
                                    <Link to={`/projects/${project.title}`} className="group block">
                                        <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden glass-crystal bg-[#0a0a0a]/40 border border-white/5 transition-all duration-500 hover:border-primary/40 shadow-xl hover:shadow-[0_0_40px_-10px_rgba(102,111,188,0.3)]">
                                            {/* Beautiful gradients inside */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#666fbc]/20 via-transparent to-[#8ab8d0]/10 opacity-50" />
                                            <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 blur-[80px] rounded-full group-hover:bg-primary/30 transition-colors duration-700" />
                                            
                                            {/* Project display content */}
                                            <div className="relative z-10 p-6 sm:p-10 h-full flex flex-col">
                                                <div className="backdrop-blur-sm bg-black/20 p-6 rounded-2xl border border-white/5 group-hover:bg-black/30 transition-colors">
                                                    <p className="text-[#b3bad9] text-base sm:text-lg leading-relaxed font-light">
                                                        {project.description || "An innovative digital solution featuring modern web architecture and seamless user experiences. Contains functional implementations of various technical challenges."}
                                                    </p>
                                                </div>

                                                {/* Bottom bar of image container */}
                                                <div className="mt-auto flex justify-between items-end">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300">
                                                            <Github className="w-6 h-6 text-white/80 group-hover:text-white" />
                                                        </div>
                                                        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hidden sm:block">
                                                            <div className="flex items-center gap-3 text-xs text-white/60 font-mono">
                                                                <span className="flex items-center gap-1.5"><span className="text-amber-500">★</span> {project.stats.stars}</span>
                                                                <span className="flex items-center gap-1.5"><span className="text-blue-400">⑂</span> {project.stats.forks}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 group-hover:bg-white/10 transition-colors">
                                                        <ArrowRight className="w-5 h-5 text-white transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Background watermark icon */}
                                            <Github className="absolute -bottom-16 -right-16 w-80 h-80 text-white/[0.02] pointer-events-none group-hover:scale-105 group-hover:-translate-x-4 group-hover:-translate-y-4 transition-all duration-700" />
                                        </div>
                                    </Link>

                                    {/* Tech Stack Chips underneath */}
                                    <div className="flex flex-wrap gap-2 mt-4 sm:max-w-[90%]">
                                        {project.tech.map((tech) => (
                                            <div key={tech} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1e1a33]/50 border border-white/5 text-[10px] sm:text-xs font-mono text-[#b3bad9] uppercase tracking-wider hover:bg-white/[0.05] hover:text-white hover:border-primary/30 transition-all cursor-default shadow-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#666fbc]" />
                                                {tech}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </section>

                {/* View More on GitHub CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="pt-16 pb-8 text-center border-t border-white/5 mt-24"
                >
                    <div className="rounded-[1.25rem] p-6 sm:p-8 max-w-xl mx-auto glass-crystal border border-white/5 border-l-2 border-l-primary/40 bg-[#0a0a0a]/60 hover:border-l-primary hover:shadow-[0_0_30px_-10px_rgba(102,111,188,0.4)] transition-all duration-500 group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-5 border border-primary/20 relative z-10 group-hover:scale-110 transition-transform duration-500">
                            <Github className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-white mb-3 relative z-10 group-hover:text-primary transition-colors uppercase gap-2 flex justify-center items-center">
                            VIEW_COMPLETE_PORTFOLIO
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        </h3>
                        <p className="text-[#b3bad9] font-mono text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed relative z-10">
                            Dive deeper into source code telemetry and explore technical architectures across {profile?.public_repos || allProjects.length} data nodes.
                        </p>

                        <a
                            href="https://github.com/Jefino9488?tab=repositories"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs font-mono uppercase tracking-widest bg-primary/10 hover:bg-primary/20 text-primary border border-primary/50 px-6 py-3 rounded-lg transition-all duration-300 shadow-[0_0_15px_-5px_rgba(102,111,188,0.3)] hover:shadow-[0_0_25px_-5px_rgba(102,111,188,0.6)] relative z-10"
                        >
                            <span className="mr-2 opacity-50">[</span>
                            <Github className="w-4 h-4 mr-2" />
                            INIT_EXPLORE
                            <ExternalLink className="w-3 h-3 ml-2 opacity-60" />
                            <span className="ml-2 opacity-50">]</span>
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
