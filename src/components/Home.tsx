import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Mail, Linkedin, ExternalLink, Send, BookOpen, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const projects = [
    { name: "FrameworkPatcher", description: "Automates the workflow for patching MIUI frameworks", link: "https://github.com/Jefino9488/FrameworkPatcher" },
    { name: "Fastboot Flasher", description: "Simplifies and secures the process of flashing ROMs to devices", link: "https://github.com/Jefino9488/Fastboot-Flasher" },
    { name: "Chat-with-PDF", description: "Enables question-answering using Google Generative AI and Chroma for vector-based retrieval", link: "https://github.com/Jefino9488/Chat-with-PDF" },
    { name: "AI_Chatbot", description: "AI-driven chatbot that can converse and generate images based on user prompts", link: "https://github.com/Jefino9488/AI_Chatbot" },
    { name: "ChatRoom", description: "A private, end-to-end encrypted platform for secure idea sharing", link: "https://github.com/Jefino9488/ChatRoom" },
    { name: "HyperMod-Builder", description: "Streamlines the process of building custom ROMs for various devices", link: "https://github.com/Jefino9488/HyperMod-Builder" },
]

const skills = ["Python", "Java", "JavaScript", "React", "Tailwind CSS", "Flask", "MySql", "AWS", "Docker", "FireBase"]

export default function Home() {
    const [, setHoveredProject] = useState<number | null>(null)

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col text-white">
            <div className="flex-grow max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <header className="text-center mb-16">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center mb-8"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-purple-500 rounded-full filter blur-md opacity-50"></div>
                            <Avatar className="w-48 h-48 border-4 border-purple-900 shadow-lg relative">
                                <AvatarImage src="https://avatars.githubusercontent.com/u/89455522?v=4" alt="Jefino" />
                                <AvatarFallback>JT</AvatarFallback>
                            </Avatar>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h1 className="text-5xl font-bold mb-4 tracking-tight">Jefino</h1>
                        <p className="text-2xl text-gray-300 font-light">Full Stack Developer</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex justify-center space-x-4 mt-8"
                    >
                        <Button variant="ghost" size="icon" className="bg-gray-800 hover:bg-gray-700 transition-colors">
                            <a href="https://github.com/Jefino9488" target="_blank" rel="noopener noreferrer">
                                <Github className="h-6 w-6" />
                                <span className="sr-only">GitHub</span>
                            </a>
                        </Button>
                        <Button variant="ghost" size="icon" className="bg-gray-800 hover:bg-gray-700 transition-colors">
                            <a href="mailto:jefinojacob9488@gmail.com">
                                <Mail className="h-6 w-6" />
                                <span className="sr-only">Email</span>
                            </a>
                        </Button>
                        <Button variant="ghost" size="icon" className="bg-gray-800 hover:bg-gray-700 transition-colors">
                            <a href="https://www.linkedin.com/in/jefino9488/" target="_blank" rel="noopener noreferrer">
                                <Linkedin className="h-6 w-6" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                        </Button>
                        <Button variant="ghost" size="icon" className="bg-gray-800 hover:bg-gray-700 transition-colors">
                            <a href="https://telegram.me/jefino9488" target="_blank" rel="noopener noreferrer">
                                <Send className="h-6 w-6" />
                                <span className="sr-only">Telegram</span>
                            </a>
                        </Button>
                    </motion.div>
                </header>

                <main className="space-y-12">
                    <section>
                        <Card className="bg-gray-800 border-none text-white rounded-3xl shadow-lg">
                            <CardContent className="pt-8 px-8">
                                <p className="text-xl leading-relaxed text-gray-200">
                                    I'm a passionate Full Stack Developer with expertise in building modern web applications.
                                    I love turning complex problems into simple, beautiful, and intuitive solutions.
                                    With a keen eye for design and a knack for writing clean, efficient code,
                                    I strive to create seamless user experiences that make a difference.
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    <section>
                        <div className="flex flex-wrap justify-center gap-4">
                            {skills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-lg py-2 px-4 bg-gray-800 hover:bg-gray-700 transition-colors rounded-2xl text-white">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </section>

                    <section>
                        <Card className="bg-gradient-to-br from-purple-900 to-indigo-900 border-none text-white hover:from-purple-800 hover:to-indigo-800 transition-colors rounded-3xl shadow-lg overflow-hidden">
                            <Link to="/blog" className="block">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center text-2xl font-bold">
                                        <BookOpen className="h-8 w-8 mr-3" />
                                        Explore My Blogs
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-lg text-gray-200 mb-4">Dive into my latest thoughts and insights on technology, development, and more.</p>
                                    <div className="flex items-center text-purple-300 hover:text-purple-100 transition-colors">
                                        <span className="mr-2 font-semibold">Read latest posts</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </div>
                                </CardContent>
                            </Link>
                        </Card>
                    </section>

                    <section>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    onHoverStart={() => setHoveredProject(index)}
                                    onHoverEnd={() => setHoveredProject(null)}
                                >
                                    <Card className="h-full bg-gray-800 border-none text-white hover:bg-gray-700 transition-colors rounded-3xl shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="flex justify-between items-center text-xl">
                                                {project.name}
                                                <a href={project.link} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-5 w-5" />
                                                </a>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-300">{project.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
            <footer className="bg-gray-900 rounded-t-3xl mt-16">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                About
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                                Terms of Service
                            </a>
                        </div>
                        <div className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} Jefino. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

