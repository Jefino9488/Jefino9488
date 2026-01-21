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
            {/* Full width dashboard section */}
            <section className="w-full py-10 ">
                <div className="container mx-auto px-4">
                    <GitHubDashboard />
                </div>
            </section>

            <div className="container mx-auto px-4 py-10">
                {/* Projects Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {allProjects.map((project, index) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                            <Card className="glass-crystal relative p-6 border-0 transition-all duration-300 h-56 flex flex-col rounded-3xl hover:shadow-xl hover:-translate-y-1">
                                <h3 className="text-xl font-semibold mb-3 text-primary line-clamp-1">{project.title}</h3>
                                <p className="text-muted-foreground mb-4 text-sm line-clamp-2">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tech.slice(0, 3).map((tech) => (
                                        <span key={tech} className="px-2 py-1 bg-secondary rounded-full text-xs text-secondary-foreground">
                                            {tech}
                                        </span>
                                    ))}
                                    {project.tech.length > 3 && (
                                        <span className="px-2 py-1 bg-secondary/50 rounded-full text-xs text-muted-foreground">
                                            +{project.tech.length - 3}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center mt-auto">
                                    <div className="flex gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-primary" /> {project.stats.stars}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <GitFork className="w-4 h-4 text-primary" /> {project.stats.forks}
                                        </span>
                                    </div>
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                                        aria-label={`View ${project.title} on GitHub`}
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* View More on GitHub Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: allProjects.length * 0.05 }}
                    className="mt-12 text-center"
                >
                    <div className="glass-crystal border-0 rounded-2xl p-8 max-w-2xl mx-auto">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mr-4">
                                <Github className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-1">View More Projects</h3>
                                <p className="text-muted-foreground">Explore all {profile?.public_repos || allProjects.length} repositories on GitHub</p>
                            </div>
                        </div>
                        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                            This is just a preview of my work. Visit my GitHub profile to see all projects,
                            including private repositories, detailed commit history, and collaborative work.
                        </p>
                        <a
                            href="https://github.com/Jefino9488?tab=repositories"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                        >
                            <Github className="w-5 h-5 mr-2" />
                            View All Repositories
                            <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                    </div>
                </motion.div>
                <div className="mt-12 text-center">
                    <Link to="/">
                        <Button variant="ghost" className="hover:bg-secondary hover:text-foreground transition-colors">
                            <ArrowLeft className="mr-2 h-5 w-5 text-primary" /> Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
