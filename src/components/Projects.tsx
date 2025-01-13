import { useProjects } from './ProjectsContext';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, GitFork, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Projects() {
    const { allProjects, loading, error } = useProjects();

    if (loading) {
        return <div className="text-center text-[#cdd6f4]">Loading projects...</div>;
    }

    if (error) {
        return <div className="text-center text-[#f38ba8]">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-[#11111b] text-[#cdd6f4] py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#cba6f7] mb-12">
                    My Projects
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allProjects.map((project, index) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="group relative h-56 rounded-3xl overflow-hidden shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#89b4fa]/20 to-[#cba6f7]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                <div className="relative backdrop-blur-xl bg-[#1e1e2e] rounded-3xl p-6 border border-[#45475a] transition-all duration-300 group-hover:border-[#cba6f7]/50 h-full flex flex-col">
                                    <h3 className="text-xl font-semibold mb-3 text-[#89b4fa]">{project.title}</h3>
                                    <p className="text-[#cdd6f4] mb-4 text-sm line-clamp-2">{project.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.tech.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-3 py-1 bg-[#313244] rounded-full text-xs text-[#cdd6f4]"
                                            >
                                                {tech}
                                            </span>
                                        ))}
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
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <Link to="/">
                        <Button variant="ghost" className="hover:bg-[#313244] hover:text-[#cdd6f4] transition-colors">
                            <ArrowLeft className="mr-2 h-5 w-5 text-[#89b4fa]" /> Back to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
