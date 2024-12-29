import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Mail, Linkedin, ExternalLink, Send } from 'lucide-react'
import { motion } from 'framer-motion'

const projects = [
    { name: "FrameworkPatcher", description: "Automates the workflow for patching MIUI frameworks", link: "https://github.com/Jefino9488/FrameworkPatcher" },
    { name: "Fastboot Flasher", description: "Simplifies and secures the process of flashing ROMs to devices", link: "https://github.com/Jefino9488/Fastboot-Flasher" },
    { name: "Chat-with-PDF", description: "Enables question-answering using Google Generative AI and Chroma for vector-based retrieval", link: "https://github.com/Jefino9488/Chat-with-PDF" },
    { name: "AI_Chatbot", description: "AI-driven chatbot that can converse and generate images based on user prompts", link: "https://github.com/Jefino9488/AI_Chatbot" },
    { name: "ChatRoom", description: "A private, end-to-end encrypted platform for secure idea sharing", link: "https://github.com/Jefino9488/ChatRoom" },
    { name: "HyperMod-Builder", description: "Streamlines the process of building custom ROMs for various devices", link: "https://github.com/Jefino9488/HyperMod-Builder" },
]

const skills = ["React", "JavaScript", "TypeScript", "Node.js", "Tailwind CSS", "Next.js", "GraphQL", "MongoDB", "AWS"]

export default function APP() {
    const [ setHoveredProject] = useState<number | null>(null)

    return (
        <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 text-white">
            {/* <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-800 rounded-full filter blur-3xl opacity-30"></div>
      </div> */}
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-16">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-purple-500 rounded-full filter blur-md opacity-50"></div>
                            <Avatar className="w-40 h-40 border-4 border-purple-900 shadow-lg relative">
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
                        <h1 className="text-4xl font-bold mb-2">Jefino</h1>
                        <p className="text-xl text-gray-400">Full Stack Developer</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex justify-center space-x-4 mt-6"
                    >
                        <Button variant="ghost" size="icon" className="bg-gray-800 hover:bg-gray-700 transition-colors">
                            <a href="https://github.com/Jefino9488" target="_blank" rel="noopener noreferrer">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </a>
                        </Button>
                        <Button variant="ghost" size="icon" className="bg-gray-800 hover:bg-gray-700 transition-colors">
                            <a href="mailto:jefinojacob9488@gmail.com">
                                <Mail className="h-5 w-5" />
                                <span className="sr-only">Email</span>
                            </a>
                        </Button>
                        <Button variant="ghost" size="icon" className="bg-gray-800 hover:bg-gray-700 transition-colors">
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                        </Button>
                        <Button variant="ghost" size="icon" className="bg-gray-800 hover:bg-gray-700 transition-colors">
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                <Send className="h-5 w-5" />
                                <span className="sr-only">Telegram</span>
                            </a>
                        </Button>
                    </motion.div>
                </header>

                <main className="space-y-16">
                    <section className="mb-16">
                        <Card className="bg-gray-800 border-none text-white rounded-3xl">
                            <CardContent className="pt-6">
                                <p className="text-lg">
                                    I'm a passionate Full Stack Developer with expertise in building modern web applications.
                                    I love turning complex problems into simple, beautiful, and intuitive solutions.
                                    With a keen eye for design and a knack for writing clean, efficient code,
                                    I strive to create seamless user experiences that make a difference.
                                </p>
                            </CardContent>
                        </Card>
                    </section>

                    <section>
                        <div className="flex flex-wrap gap-3">
                            {skills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-lg py-2 px-4 bg-gray-800 hover:bg-gray-700 transition-colors rounded-2xl text-white">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    onHoverStart={() => setHoveredProject(index)}
                                    onHoverEnd={() => setHoveredProject(null)}
                                >
                                    <Card className="h-full bg-gray-800 border-none text-white hover:bg-gray-700 transition-colors rounded-3xl">
                                        <CardHeader>
                                            <CardTitle className="flex justify-between items-center">
                                                {project.name}
                                                <a href={project.link} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-5 w-5" />
                                                </a>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-400">{project.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}

