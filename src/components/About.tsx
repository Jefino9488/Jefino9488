import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    Download,
    Calendar,
    Code,
    Briefcase,
    GraduationCap,
    Award,
    Github,
    Mail,
    Linkedin,
    Send,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import GitHubDashboard from "./GitHubDashboard"

// Timeline data
interface TimelineItem {
    id: string
    title: string
    date: string
    description: string
    icon: React.ElementType
    category: "work" | "education" | "project" | "award"
}

const timelineItems: TimelineItem[] = [
    {
        id: "timeline1",
        title: "Full Stack Developer",
        date: "2022 - Present",
        description: "Working on various web development projects using React, Node.js, and other modern technologies.",
        icon: Code,
        category: "work",
    },
    {
        id: "timeline2",
        title: "Bachelor's in Computer Science",
        date: "2018 - 2022",
        description: "Studied computer science with a focus on software development and algorithms.",
        icon: GraduationCap,
        category: "education",
    },
    {
        id: "timeline3",
        title: "Freelance Developer",
        date: "2020 - 2022",
        description: "Worked on various freelance projects for clients across different industries.",
        icon: Briefcase,
        category: "work",
    },
    {
        id: "timeline4",
        title: "AWS Certification",
        date: "January 2023",
        description: "Obtained AWS Certified Developer certification.",
        icon: Award,
        category: "award",
    },
]

// Skills data
const skills = {
    frontend: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Next.js"],
    backend: ["Node.js", "Python", "Flask", "Express", "MongoDB", "MySQL"],
    tools: ["Git", "Docker", "AWS", "Firebase", "VS Code", "Figma"],
}

export default function About() {
    const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "skills">("overview")

    return (
        <div className="min-h-screen bg-[#11111b] text-[#cdd6f4]">
            <div className="container mx-auto px-4 py-16">
                <div className="flex justify-between items-center mb-8">
                    <Link to="/">
                        <Button variant="ghost" className="hover:bg-[#313244] hover:text-[#cdd6f4] transition-colors">
                            <ArrowLeft className="mr-2 h-5 w-5 text-[#89b4fa]" /> Back to Home
                        </Button>
                    </Link>
                    <a href="https://my-drive.pages.dev/Public/resume.pdf" target="_blank" rel="noopener noreferrer">
                        <Button className="bg-[#cba6f7] hover:bg-[#f5c2e7] text-[#11111b]">
                            <Download className="mr-2 h-5 w-5" /> Download Resume
                        </Button>
                    </a>
                </div>

                {/* Dashboard Header */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-[#1e1e2e] border-[#313244] border text-[#cdd6f4] rounded-2xl shadow-lg overflow-hidden lg:col-span-2">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-purple-800 rounded-full filter blur-xl opacity-50"></div>
                                    <img
                                        src="https://avatars.githubusercontent.com/u/89455522?v=4"
                                        alt="Jefino"
                                        className="w-32 h-32 rounded-full border-4 border-[#f5c2e7] shadow-lg relative"
                                    />
                                </div>
                                <div className="flex-grow text-center md:text-left">
                                    <h1 className="text-3xl font-bold mb-2 text-[#cba6f7]">Jefino</h1>
                                    <p className="text-xl text-[#f5c2e7] mb-4">Full Stack Developer</p>
                                    <p className="text-[#cdd6f4] mb-4 max-w-2xl">
                                        Passionate developer with experience in creating modern, dynamic, and efficient web applications.
                                        Focused on delivering clean, maintainable code and intuitive user experiences.
                                    </p>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                                        <a
                                            href="https://github.com/Jefino9488"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-3 py-1.5 bg-[#313244] rounded-full text-sm text-[#cdd6f4] hover:bg-[#45475a] transition-colors"
                                        >
                                            <Github className="h-4 w-4 text-[#cba6f7]" /> GitHub
                                        </a>
                                        <a
                                            href="mailto:jefinojacob9488@gmail.com"
                                            className="flex items-center gap-2 px-3 py-1.5 bg-[#313244] rounded-full text-sm text-[#cdd6f4] hover:bg-[#45475a] transition-colors"
                                        >
                                            <Mail className="h-4 w-4 text-[#cba6f7]" /> Email
                                        </a>
                                        <a
                                            href="https://www.linkedin.com/in/jefino9488/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-3 py-1.5 bg-[#313244] rounded-full text-sm text-[#cdd6f4] hover:bg-[#45475a] transition-colors"
                                        >
                                            <Linkedin className="h-4 w-4 text-[#cba6f7]" /> LinkedIn
                                        </a>
                                        <a
                                            href="https://telegram.me/jefino9488"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-3 py-1.5 bg-[#313244] rounded-full text-sm text-[#cdd6f4] hover:bg-[#45475a] transition-colors"
                                        >
                                            <Send className="h-4 w-4 text-[#cba6f7]" /> Telegram
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#1e1e2e] border-[#313244] border text-[#cdd6f4] rounded-2xl shadow-lg overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl font-semibold text-[#f5c2e7]">Quick Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#313244] p-4 rounded-xl">
                                    <p className="text-sm text-[#a6adc8]">Experience</p>
                                    <p className="text-2xl font-bold text-[#cba6f7]">3+ Years</p>
                                </div>
                                <div className="bg-[#313244] p-4 rounded-xl">
                                    <p className="text-sm text-[#a6adc8]">Projects</p>
                                    <p className="text-2xl font-bold text-[#cba6f7]">15+</p>
                                </div>
                                <div className="bg-[#313244] p-4 rounded-xl">
                                    <p className="text-sm text-[#a6adc8]">Certifications</p>
                                    <p className="text-2xl font-bold text-[#cba6f7]">3</p>
                                </div>
                                <div className="bg-[#313244] p-4 rounded-xl">
                                    <p className="text-sm text-[#a6adc8]">Languages</p>
                                    <p className="text-2xl font-bold text-[#cba6f7]">5+</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <Button
                        variant={activeTab === "overview" ? "default" : "outline"}
                        className={
                            activeTab === "overview"
                                ? "!bg-[#cba6f7] !text-[#11111b]"
                                : "border-[#313244] text-[#cdd6f4] hover:bg-transparent hover:text-[#cdd6f4]"
                        }
                        onClick={() => setActiveTab("overview")}
                    >
                        Overview
                    </Button>
                    <Button
                        variant={activeTab === "timeline" ? "default" : "outline"}
                        className={
                            activeTab === "timeline"
                                ? "!bg-[#cba6f7] !text-[#11111b]"
                                : "border-[#313244] text-[#cdd6f4] hover:bg-transparent hover:text-[#cdd6f4]"
                        }
                        onClick={() => setActiveTab("timeline")}
                    >
                        Timeline
                    </Button>
                    <Button
                        variant={activeTab === "skills" ? "default" : "outline"}
                        className={
                            activeTab === "skills"
                                ? "!bg-[#cba6f7] !text-[#11111b]"
                                : "border-[#313244] text-[#cdd6f4] hover:bg-transparent hover:text-[#cdd6f4]"
                        }
                        onClick={() => setActiveTab("skills")}
                    >
                        Skills
                    </Button>
                </div>

                {/* Tab Content */}
                <div className="mb-8">
                    {activeTab === "overview" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <Card className="bg-[#1e1e2e] border-[#313244] border text-[#cdd6f4] rounded-2xl shadow-lg overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-2xl font-bold mb-4 text-[#f5c2e7]">About Me</h2>
                                            <p className="text-[#cdd6f4] mb-4">
                                                Welcome to my portfolio! I am Jefino, a passionate Full Stack Developer with experience in
                                                creating modern, dynamic, and efficient web applications. This site serves as a showcase for my
                                                skills, projects, and experience in the software development industry.
                                            </p>
                                            <p className="text-[#cdd6f4] mb-4">
                                                I started my journey in software development with a deep interest in building efficient and
                                                scalable applications. Over the years, I have honed my skills across various technologies and
                                                platforms, from backend development with Flask and Python to creating responsive frontends using
                                                React and Tailwind CSS.
                                            </p>
                                            <p className="text-[#cdd6f4]">
                                                I am always eager to learn new things, whether it be the latest development tools, frameworks,
                                                or programming paradigms. My goal is to combine my love for technology with my passion for
                                                solving complex problems and delivering seamless user experiences.
                                            </p>
                                        </div>

                                        <div>
                                            <h2 className="text-2xl font-bold mb-4 text-[#f5c2e7]">GitHub Activity</h2>
                                            <GitHubDashboard username="Jefino9488" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {activeTab === "timeline" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <Card className="bg-[#1e1e2e] border-[#313244] border text-[#cdd6f4] rounded-2xl shadow-lg overflow-hidden">
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-bold mb-6 text-[#f5c2e7]">My Journey</h2>
                                    <div className="relative">
                                        {/* Timeline line */}
                                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#313244]"></div>

                                        <div className="space-y-8">
                                            {timelineItems.map((item, index) => (
                                                <motion.div
                                                    key={item.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                                    className="relative pl-12"
                                                >
                                                    {/* Timeline dot */}
                                                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-[#313244] flex items-center justify-center">
                                                        <item.icon className="h-4 w-4 text-[#cba6f7]" />
                                                    </div>

                                                    <div className="bg-[#313244] p-4 rounded-xl">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h3 className="text-lg font-semibold text-[#f5c2e7]">{item.title}</h3>
                                                            <Badge className="bg-[#45475a] text-[#cdd6f4] border-none">
                                                                <Calendar className="h-3 w-3 mr-1" />
                                                                {item.date}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-[#cdd6f4]">{item.description}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {activeTab === "skills" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <Card className="bg-[#1e1e2e] border-[#313244] border text-[#cdd6f4] rounded-2xl shadow-lg overflow-hidden">
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-bold mb-6 text-[#f5c2e7]">Technical Skills</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-[#cba6f7] flex items-center">
                                                <Code className="h-5 w-5 mr-2" /> Frontend
                                            </h3>
                                            <div className="space-y-3">
                                                {skills.frontend.map((skill, index) => (
                                                    <div key={index} className="bg-[#313244] rounded-lg p-3">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-medium">{skill}</span>
                                                        </div>
                                                        <div className="w-full bg-[#45475a] rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-to-r from-[#cba6f7] to-[#f5c2e7] h-2 rounded-full"
                                                                style={{ width: `${90 - index * 10}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-[#cba6f7] flex items-center">
                                                <Code className="h-5 w-5 mr-2" /> Backend
                                            </h3>
                                            <div className="space-y-3">
                                                {skills.backend.map((skill, index) => (
                                                    <div key={index} className="bg-[#313244] rounded-lg p-3">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-medium">{skill}</span>
                                                        </div>
                                                        <div className="w-full bg-[#45475a] rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-to-r from-[#89b4fa] to-[#74c7ec] h-2 rounded-full"
                                                                style={{ width: `${85 - index * 8}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-[#cba6f7] flex items-center">
                                                <Code className="h-5 w-5 mr-2" /> Tools & Technologies
                                            </h3>
                                            <div className="space-y-3">
                                                {skills.tools.map((skill, index) => (
                                                    <div key={index} className="bg-[#313244] rounded-lg p-3">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-medium">{skill}</span>
                                                        </div>
                                                        <div className="w-full bg-[#45475a] rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-to-r from-[#f38ba8] to-[#fab387] h-2 rounded-full"
                                                                style={{ width: `${88 - index * 9}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}
