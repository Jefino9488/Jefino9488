import { useProjects } from "./ProjectsContext"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink, GitFork, Star, Github } from "lucide-react"
import { motion } from "framer-motion"
import GitHubDashboard from "@/components/GitHubDashboard.tsx"

export default function Projects() {
    const { allProjects, loading, error } = useProjects()

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020203] flex items-center justify-center">
                <div className="text-center text-[#cdd6f4]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f5c2e7] mx-auto mb-4"></div>
                    Loading Repository...
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#020203] flex items-center justify-center">
                <div className="text-center text-[#f38ba8]">{error}</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#020203] text-[#cdd6f4]">
            {/* Full width dashboard section */}
            <section className="w-full py-10 ">
                <div className="container mx-auto px-4">
                    <GitHubDashboard />
                </div>
            </section>

            <div className="container mx-auto px-4 py-10">
                {/* Projects Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {allProjects.map((project, index) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                            <div className="group relative h-56 rounded-3xl overflow-hidden shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#89b4fa]/20 to-[#cba6f7]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <div className="relative backdrop-blur-xl bg-[#0D0911] rounded-3xl p-6 border border-[#45475a] transition-all duration-300 group-hover:border-[#cba6f7]/50 h-full flex flex-col">
                                    <h3 className="text-xl font-semibold mb-3 text-[#89b4fa] line-clamp-1">{project.title}</h3>
                                    <p className="text-[#cdd6f4] mb-4 text-sm line-clamp-2">{project.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.tech.slice(0, 3).map((tech) => (
                                            <span key={tech} className="px-2 py-1 bg-[#313244] rounded-full text-xs text-[#cdd6f4]">
                                                {tech}
                                            </span>
                                        ))}
                                        {project.tech.length > 3 && (
                                            <span className="px-2 py-1 bg-[#45475a] rounded-full text-xs text-[#a6adc8]">
                                                +{project.tech.length - 3}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center mt-auto">
                                        <div className="flex gap-4 text-sm text-[#a6adc8]">
                                            <span className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-[#f5c2e7]" /> {project.stats.stars}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <GitFork className="w-4 h-4 text-[#f5c2e7]" /> {project.stats.forks}
                                            </span>
                                        </div>
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 text-[#a6adc8] hover:text-[#f5c2e7] transition-colors"
                                            aria-label={`View ${project.title} on GitHub`}
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
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
                    <div className="bg-[#0C0810] border border-[#313244] rounded-2xl p-8 max-w-2xl mx-auto">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-16 h-16 bg-[#313244] rounded-full flex items-center justify-center mr-4">
                                <Github className="w-8 h-8 text-[#cba6f7]" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-[#f5c2e7] mb-1">View More Projects</h3>
                                <p className="text-[#a6adc8]">Explore all {allProjects.length} repositories on GitHub</p>
                            </div>
                        </div>
                        <p className="text-[#cdd6f4] mb-6 max-w-lg mx-auto">
                            This is just a preview of my work. Visit my GitHub profile to see all projects, 
                            including private repositories, detailed commit history, and collaborative work.
                        </p>
                        <a
                            href="https://github.com/Jefino9488?tab=repositories"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-[#cba6f7] hover:bg-[#f5c2e7] text-[#11111b] font-medium px-8 py-3 rounded-xl transition-all duration-200 hover:scale-105"
                        >
                            <Github className="w-5 h-5 mr-2" />
                            View All Repositories
                            <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                    </div>
                </motion.div>
                <div className="mt-12 text-center">
                    <Link to="/">
                        <Button variant="ghost" className="hover:bg-[#313244] hover:text-[#cdd6f4] transition-colors">
                            <ArrowLeft className="mr-2 h-5 w-5 text-[#89b4fa]" /> Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
