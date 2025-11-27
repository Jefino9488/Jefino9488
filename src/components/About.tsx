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
    Loader2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import GitHubDashboard from "./GitHubDashboard"
import LazyImage from "./LazyImage"
import certificates from "@/certifications/certifications.json"
import { useProjects } from "./ProjectsContext"

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
    const { allProjects } = useProjects()

    // Contact form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Create mailto link with form data
            const subject = encodeURIComponent(formData.subject);
            const body = encodeURIComponent(
                `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
            );

            const mailtoLink = `mailto:jefinojacob9488@gmail.com?subject=${subject}&body=${body}`;

            // Open email client
            window.open(mailtoLink, '_blank');

            setIsSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });

            // Reset success message after 5 seconds
            setTimeout(() => setIsSubmitted(false), 5000);

        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-16">
                <div className="flex justify-between items-center mb-8">
                    <Link to="/">
                        <Button variant="ghost" className="hover:bg-secondary hover:text-foreground transition-colors">
                            <ArrowLeft className="mr-2 h-5 w-5 text-primary" /> Back to Home
                        </Button>
                    </Link>
                    <a href="https://my-drive.pages.dev/Public/resume.pdf" target="_blank" rel="noopener noreferrer">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Download className="mr-2 h-5 w-5" /> Download Resume
                        </Button>
                    </a>
                </div>

                <Card className="bg-card border-border border text-card-foreground rounded-2xl shadow-lg overflow-hidden mb-8">
                    <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-shrink-0">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
                                    <LazyImage
                                        src="https://avatars.githubusercontent.com/u/9488?v=4"
                                        alt="Jefino"
                                        className="object-cover w-full h-full"
                                        priority={true}
                                        width={128}
                                        height={128}
                                    />
                                </div>
                            </div>
                            <div className="flex-grow text-center md:text-left">
                                <h1 className="text-3xl font-bold mb-2 text-primary">Jefino</h1>
                                <p className="text-xl text-muted-foreground mb-4">Full Stack Developer</p>
                                <p className="text-foreground mb-4 max-w-2xl">
                                    Passionate developer with experience in creating modern, dynamic, and efficient web applications.
                                    Focused on delivering clean, maintainable code and intuitive user experiences.
                                </p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                                    <a
                                        href="https://github.com/Jefino9488"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full text-sm text-foreground hover:bg-secondary/80 transition-colors"
                                    >
                                        <Github className="h-4 w-4 text-primary" /> GitHub
                                    </a>
                                    <a
                                        href="mailto:jefinojacob9488@gmail.com"
                                        className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full text-sm text-foreground hover:bg-secondary/80 transition-colors"
                                    >
                                        <Mail className="h-4 w-4 text-primary" /> Email
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/in/jefino9488/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full text-sm text-foreground hover:bg-secondary/80 transition-colors"
                                    >
                                        <Linkedin className="h-4 w-4 text-primary" /> LinkedIn
                                    </a>
                                    <a
                                        href="https://telegram.me/jefino9488"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full text-sm text-foreground hover:bg-secondary/80 transition-colors"
                                    >
                                        <Send className="h-4 w-4 text-primary" /> Telegram
                                    </a>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border border text-card-foreground rounded-2xl shadow-lg overflow-hidden mb-8">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-semibold text-primary">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-secondary/50 p-4 rounded-xl">
                                <p className="text-sm text-muted-foreground">Experience</p>
                                <p className="text-2xl font-bold text-primary">3+ Years</p>
                            </div>
                            <div className="bg-secondary/50 p-4 rounded-xl">
                                <p className="text-sm text-muted-foreground">Projects</p>
                                <p className="text-2xl font-bold text-primary">{allProjects.length}+</p>
                            </div>
                            <div className="bg-secondary/50 p-4 rounded-xl">
                                <p className="text-sm text-muted-foreground">Certifications</p>
                                <p className="text-2xl font-bold text-primary">{certificates.length}</p>
                            </div>
                            <div className="bg-secondary/50 p-4 rounded-xl">
                                <p className="text-sm text-muted-foreground">Languages</p>
                                <p className="text-2xl font-bold text-primary">5+</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <Button
                        variant={activeTab === "overview" ? "default" : "outline"}
                        className={
                            activeTab === "overview"
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }
                        onClick={() => setActiveTab("overview")}
                    >
                        Overview
                    </Button>
                    <Button
                        variant={activeTab === "timeline" ? "default" : "outline"}
                        className={
                            activeTab === "timeline"
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }
                        onClick={() => setActiveTab("timeline")}
                    >
                        Timeline
                    </Button>
                    <Button
                        variant={activeTab === "skills" ? "default" : "outline"}
                        className={
                            activeTab === "skills"
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
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
                            <Card className="bg-card border-border border text-card-foreground rounded-2xl shadow-lg overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-2xl font-bold mb-4 text-primary">About Me</h2>
                                            <p className="text-muted-foreground mb-4">
                                                Welcome to my portfolio! I am Jefino, a passionate Full Stack Developer with experience in
                                                creating modern, dynamic, and efficient web applications. This site serves as a showcase for my
                                                skills, projects, and experience in the software development industry.
                                            </p>
                                            <p className="text-muted-foreground mb-4">
                                                I started my journey in software development with a deep interest in building efficient and
                                                scalable applications. Over the years, I have honed my skills across various technologies and
                                                platforms, from backend development with Flask and Python to creating responsive frontends using
                                                React and Tailwind CSS.
                                            </p>
                                            <p className="text-muted-foreground">
                                                I am always eager to learn new things, whether it be the latest development tools, frameworks,
                                                or programming paradigms. My goal is to combine my love for technology with my passion for
                                                solving complex problems and delivering seamless user experiences.
                                            </p>
                                        </div>

                                        <div>
                                            <h2 className="text-2xl font-bold mb-4 text-primary">GitHub Activity</h2>
                                            <GitHubDashboard />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {activeTab === "timeline" && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <Card className="bg-card border-border border text-card-foreground rounded-2xl shadow-lg overflow-hidden">
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-bold mb-6 text-primary">My Journey</h2>
                                    <div className="relative">
                                        {/* Timeline line */}
                                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>

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
                                                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                                        <item.icon className="h-4 w-4 text-primary" />
                                                    </div>

                                                    <div className="bg-secondary/50 p-4 rounded-xl">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
                                                            <Badge className="bg-muted text-muted-foreground border-none">
                                                                <Calendar className="h-3 w-3 mr-1" />
                                                                {item.date}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-muted-foreground">{item.description}</p>
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
                            <Card className="bg-card border-border border text-card-foreground rounded-2xl shadow-lg overflow-hidden">
                                <CardContent className="p-6">
                                    <h2 className="text-2xl font-bold mb-6 text-primary">Technical Skills</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-primary flex items-center">
                                                <Code className="h-5 w-5 mr-2" /> Frontend
                                            </h3>
                                            <div className="space-y-3">
                                                {skills.frontend.map((skill, index) => (
                                                    <div key={index} className="bg-secondary/50 rounded-lg p-3">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-medium">{skill}</span>
                                                        </div>
                                                        <div className="w-full bg-muted rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-to-r from-primary to-primary/60 h-2 rounded-full"
                                                                style={{ width: `${90 - index * 10}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-primary flex items-center">
                                                <Code className="h-5 w-5 mr-2" /> Backend
                                            </h3>
                                            <div className="space-y-3">
                                                {skills.backend.map((skill, index) => (
                                                    <div key={index} className="bg-secondary/50 rounded-lg p-3">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-medium">{skill}</span>
                                                        </div>
                                                        <div className="w-full bg-muted rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-to-r from-primary to-primary/60 h-2 rounded-full"
                                                                style={{ width: `${85 - index * 8}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold mb-4 text-primary flex items-center">
                                                <Code className="h-5 w-5 mr-2" /> Tools & Technologies
                                            </h3>
                                            <div className="space-y-3">
                                                {skills.tools.map((skill, index) => (
                                                    <div key={index} className="bg-secondary/50 rounded-lg p-3">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-medium">{skill}</span>
                                                        </div>
                                                        <div className="w-full bg-muted rounded-full h-2">
                                                            <div
                                                                className="bg-gradient-to-r from-primary to-primary/60 h-2 rounded-full"
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

                {/* Compact Contact Form Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8"
                >
                    <Card className="bg-card border-border border text-card-foreground rounded-xl shadow-lg overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-primary rounded-lg">
                                    <Mail className="w-4 h-4 text-primary-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-primary">Get In Touch</h3>
                                    <p className="text-sm text-muted-foreground">Quick message or just say hello!</p>
                                </div>
                            </div>

                            {isSubmitted && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg"
                                >
                                    <p className="text-green-400 text-sm">
                                        ✅ Message sent! Your email client should open shortly.
                                    </p>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 bg-input border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${errors.name ? 'border-destructive' : 'border-border'
                                            }`}
                                        placeholder="Your name"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 bg-input border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${errors.email ? 'border-destructive' : 'border-border'
                                            }`}
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 bg-input border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${errors.subject ? 'border-destructive' : 'border-border'
                                        }`}
                                    placeholder="What's this about?"
                                />

                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className={`w-full px-3 py-2 bg-input border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none ${errors.message ? 'border-destructive' : 'border-border'
                                        }`}
                                    placeholder="Your message..."
                                />

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Sending...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <Send className="w-4 h-4" />
                                            Send Message
                                        </div>
                                    )}
                                </Button>
                            </form>

                            <div className="mt-4 pt-3 border-t border-border">
                                <p className="text-muted-foreground text-xs text-center">
                                    Or email me directly at{' '}
                                    <a
                                        href="mailto:jefinojacob9488@gmail.com"
                                        className="text-primary hover:underline"
                                    >
                                        jefinojacob9488@gmail.com
                                    </a>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
