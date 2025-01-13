import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, Mail, Linkedin, ExternalLink, Send, BookOpen, ArrowRight, Star, GitFork, MapPin } from 'lucide-react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useProjects } from './ProjectsContext';

export default function Home() {
    const { pinnedProjects, loading, error } = useProjects();

    const navigate = useNavigate();

    const dragY = useMotionValue(0);
    const opacity = useTransform(dragY, [0, -100], [1, 0]);
    const scale = useTransform(dragY, [0, -100], [1, 0.8]);

    const handleDragEnd = (_event: MouseEvent | TouchEvent, info: PanInfo) => {
        if (info.offset.y < -50) {
            navigate('/projects');
        }
    };

    const skills = ["Python", "Java", "JavaScript", "React", "Tailwind CSS", "Flask", "MySql", "Docker", "FireBase"];

    return (
        <div className="poppins-medium min-h-screen bg-[#11111b] flex flex-col text-[#cdd6f4]">
            <div className="flex-grow max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <header className="mb-8 sm:mb-12">
                    <Card
                        className="bg-gradient-to-br from-[#11111b] to-[#1e1e2e] border-none text-[#cdd6f4] rounded-3xl shadow-lg overflow-hidden">
                        <CardContent className="p-6 md:p-8">
                            <div
                                className="flex flex-col items-center md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-8">
                                <motion.div
                                    initial={{scale: 0}}
                                    animate={{scale: 1}}
                                    transition={{duration: 0.5}}
                                    className="flex-shrink-0 relative"
                                >
                                    <div
                                        className="absolute inset-0 bg-purple-800 rounded-full filter blur-xl opacity-50"></div>
                                    <Avatar
                                        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 border-4 border-[#f5c2e7] shadow-lg relative"
                                    >
                                        <AvatarImage src="https://avatars.githubusercontent.com/u/89455522?v=4"
                                                     alt="Jefino"/>
                                        <AvatarFallback>JT</AvatarFallback>
                                    </Avatar>
                                </motion.div>
                                <div className="flex-grow text-center md:text-left">
                                    <motion.div
                                        initial={{opacity: 0, y: 20}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{duration: 0.5, delay: 0.2}}
                                    >
                                        <h1 className="rubik-mono-one-regular text-3xl sm:text-4xl md:text-5xl font-bold mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#f5c2e7] to-[#cba6f7]">
                                            Jefino
                                        </h1>
                                        <p className="orbitron-regular text-xl sm:text-2xl md:text-3xl text-[#cba6f7] font-light mb-4">
                                            Full Stack Developer
                                        </p>
                                        <div className="flex flex-col space-y-2 mb-6">
                                            <p className="poppins-regular flex items-center justify-center md:justify-start text-[#cdd6f4]">
                                                <MapPin className="mr-2 h-5 w-5 text-[#cba6f7]"/>
                                                Based in Chennai, India
                                            </p>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        initial={{opacity: 0}}
                                        animate={{opacity: 1}}
                                        transition={{duration: 0.5, delay: 0.4}}
                                        className="flex justify-center md:justify-start space-x-4"
                                    >
                                        <Button variant="outline" size="icon"
                                                className="bg-gray-700 hover:bg-gray-600 transition-colors border-gray-600">
                                            <a href="https://github.com/Jefino9488" target="_blank"
                                               rel="noopener noreferrer" aria-label="GitHub">
                                                <Github className="h-5 w-5 text-[#f5c2e7]"/>
                                            </a>
                                        </Button>
                                        <Button variant="outline" size="icon"
                                                className="bg-gray-700 hover:bg-gray-600 transition-colors border-gray-600">
                                            <a href="mailto:jefinojacob9488@gmail.com" aria-label="Email">
                                                <Mail className="h-5 w-5 text-[#f5c2e7]"/>
                                            </a>
                                        </Button>
                                        <Button variant="outline" size="icon"
                                                className="bg-gray-700 hover:bg-gray-600 transition-colors border-gray-600">
                                            <a href="https://www.linkedin.com/in/jefino9488/" target="_blank"
                                               rel="noopener noreferrer" aria-label="LinkedIn">
                                                <Linkedin className="h-5 w-5 text-[#f5c2e7]"/>
                                            </a>
                                        </Button>
                                        <Button variant="outline" size="icon"
                                                className="bg-gray-700 hover:bg-gray-600 transition-colors border-gray-600">
                                            <a href="https://telegram.me/jefino9488" target="_blank"
                                               rel="noopener noreferrer" aria-label="Telegram">
                                                <Send className="h-5 w-5 text-[#f5c2e7]"/>
                                            </a>
                                        </Button>
                                    </motion.div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </header>
                <main className="space-y-8 sm:space-y-10">
                    <section>
                        <div className="flex flex-wrap justify-center gap-4">
                            {skills.map((skill, index) => (
                                <Badge key={index} variant="secondary"
                                       className="text-lg py-2 px-4 bg-[#313244] hover:bg-[#585b70] transition-colors rounded-2xl text-[#cdd6f4]">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </section>

                    <section>
                        <Card
                            className="bg-[#1e1e2e] border-[#313244] border text-[#cdd6f4] hover:bg-[#313244] transition-colors rounded-3xl shadow-lg overflow-hidden">
                            <Link to="/blog" className="block">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center text-lg sm:text-2xl font-bold text-[#f5c2e7]">
                                        <BookOpen className="h-8 w-8 mr-3 text-[#cba6f7]"/>
                                        Explore My Blogs
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-lg sm:text-xl text-[#cdd6f4] mb-4">Dive into my latest thoughts
                                        and insights on technology, development, and more.</p>
                                    <div
                                        className="flex items-center text-[#89b4fa] hover:text-[#f5c2e7] transition-colors">
                                        <span className="mr-2 font-semibold">Read latest posts</span>
                                        <ArrowRight className="h-5 w-5"/>
                                    </div>
                                </CardContent>
                            </Link>
                        </Card>
                    </section>

                    <section>
                        {loading ? (
                            <div className="text-center text-gray-400">Loading projects...</div>
                        ) : error ? (
                            <div className="text-center text-red-500">{error}</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pinnedProjects.map((project) => (
                                    <motion.div
                                        key={project.title}
                                        initial={{opacity: 0, y: 20}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{duration: 0.5}}
                                    >
                                        <div className="group relative h-56">
                                            <div
                                                className="absolute inset-0 bg-gradient-to-r from-[#89b4fa]/20 to-[#cba6f7]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                            <div
                                                className="relative backdrop-blur-xl bg-[#1e1e2e] rounded-3xl p-6 border border-[#45475a] transition-all duration-300 group-hover:border-[#cba6f7]/50 h-full flex flex-col">
                                                <h3 className="text-xl font-semibold mb-3 text-white">{project.title}</h3>
                                                <p className="text-[#cdd6f4] mb-4 text-sm line-clamp-2">{project.description}</p>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {project.tech.map((tech) => (
                                                        <span
                                                            key={tech}
                                                            className="px-3 py-1 bg-gray-700 rounded-full text-xs text-[#cdd6f4]"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between items-center mt-auto">
                                                    <div className="flex gap-4 text-sm text-[#a6adc8]">
                                                        <span className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 text-[#cba6f7]"/> {project.stats.stars}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <GitFork className="w-4 h-4 text-[#cba6f7]"/> {project.stats.forks}
                                                        </span>
                                                    </div>
                                                    <a
                                                        href={project.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-[#a6adc8] hover:text-purple-400 transition-colors"
                                                    >
                                                        <ExternalLink className="w-5 h-5 text-[#cba6f7]"/>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>
            <motion.div
                drag="y"
                onDragEnd={handleDragEnd}
                style={{
                    y: dragY,
                    opacity,
                    scale,
                    padding: "10px",
                    borderRadius: "20px",
                }}
                dragConstraints={{ top: -100, bottom: 0 }}
                className="cursor-grab active:cursor-grabbing transition-all ease-in-out"
            >
                <div className="flex flex-col items-center justify-center">
                    <p className="text-[#cdd6f4] text-xs sm:text-sm mb-2 animate-pulse text-center">
                        Pull up to explore projects
                    </p>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="w-8 h-1.5 sm:w-12 sm:h-2 bg-gray-500 rounded-full"
                    ></motion.div>
                </div>
            </motion.div>
            <footer className="bg-[#1e1e2e] rounded-t-3xl mt-8">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="flex space-x-6">
                            <Link to="/about" className="text-[#a6adc8] hover:text-white transition-colors text-sm">
                                About
                            </Link>
                            <Link to="/privacy-policy"
                                  className="text-[#a6adc8] hover:text-white transition-colors text-sm">
                                Privacy Policy
                            </Link>
                            <Link to="/terms-of-service"
                                  className="text-[#a6adc8] hover:text-white transition-colors text-sm">
                                Terms of Service
                            </Link>
                        </div>
                        <div className="text-[#a6adc8] text-sm">
                            © {new Date().getFullYear()} Jefino. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

