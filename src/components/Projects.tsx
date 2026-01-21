import { useProjects } from "./ProjectsContext"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ExternalLink, GitFork, Star, Github } from "lucide-react"
import { motion } from "framer-motion"
import GitHubDashboard from "@/components/GitHubDashboard.tsx"
import { useGitHubData } from "@/components/GitHubContext"

export default function Projects() {
    const { allProjects, loading, error } = useProjects()
    const { profile } = useGitHubData()

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                    Loading Repository...
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center text-destructive">{error}</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen text-foreground">
            {/* Header Section - Compact */}
            <section className="w-full py-4 sm:py-6 sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link to="/">
                            <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-white/10 hover:text-primary transition-colors">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            <Github className="h-5 w-5 text-primary" />
                            Projects
                        </h1>
                    </div>

                    <div className="text-xs sm:text-sm text-muted-foreground font-medium px-3 py-1 rounded-full bg-white/5 border border-white/5">
                        {allProjects.length} Repositories
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-6 sm:py-8 space-y-8">
                {/* Full width dashboard section */}
                <section className="w-full">
                    <GitHubDashboard />
                </section>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                    {allProjects.map((project, index) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <Card className="glass-crystal relative p-5 border-0 transition-all duration-300 h-64 flex flex-col rounded-[1.5rem] hover:shadow-xl hover:-translate-y-1 hover:bg-white/[0.03] group">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 pr-2">{project.title}</h3>
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 -mr-1.5 -mt-1.5 text-muted-foreground hover:text-primary hover:bg-white/5 rounded-full transition-colors"
                                        aria-label={`View ${project.title} on GitHub`}
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>

                                <p className="text-muted-foreground/80 mb-4 text-xs sm:text-sm line-clamp-3 leading-relaxed flex-grow">
                                    {project.description || "No description provided."}
                                </p>

                                <div className="mt-auto">
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {project.tech.slice(0, 3).map((tech) => (
                                            <span key={tech} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded-md text-[10px] text-muted-foreground font-medium">
                                                {tech}
                                            </span>
                                        ))}
                                        {project.tech.length > 3 && (
                                            <span className="px-1.5 py-0.5 text-[10px] text-muted-foreground/60">
                                                +{project.tech.length - 3}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                        <div className="flex gap-3 text-xs text-muted-foreground font-medium">
                                            <span className="flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 text-yellow-500/80" /> {project.stats.stars}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <GitFork className="w-3.5 h-3.5" /> {project.stats.forks}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* View More on GitHub Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="pt-4 pb-8 text-center"
                >
                    <div className="glass-crystal border-0 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto bg-gradient-to-br from-white/[0.02] to-transparent">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mr-3 border border-white/5">
                                <Github className="w-6 h-6 text-foreground" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-bold text-foreground">View More Projects</h3>
                                <p className="text-xs text-muted-foreground">Explore all {profile?.public_repos || allProjects.length} repositories on GitHub</p>
                            </div>
                        </div>

                        <a
                            href="https://github.com/Jefino9488?tab=repositories"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm bg-primary/10 hover:bg-primary/20 text-primary font-medium px-6 py-2.5 rounded-full transition-all duration-200 border border-primary/20"
                        >
                            <Github className="w-4 h-4 mr-2" />
                            View All Repositories
                            <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-50" />
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
