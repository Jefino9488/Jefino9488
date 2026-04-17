import type React from "react"
import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Download,
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

import GitHubDashboard from "./GitHubDashboard"
import LazyImage from "./LazyImage"
import PageHeader from "./PageHeader"
import certificates from "@/certifications/certifications.json"
import { useProjects } from "./ProjectsContext"
import { useGitHubData } from "./GitHubContext"
import { calculateExperienceYears, categorizeSkills } from "@/utils/github"

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
        title: "AI & Data Science Undergrad",
        date: "2022 - Present",
        description: "Pursuing Bachelor's in AI & Data Science with focus on machine learning and full-stack development.",
        icon: GraduationCap,
        category: "education",
    },
    {
        id: "timeline2",
        title: "Open Source Contributor",
        date: "2021 - Present",
        description: "Active contributor to open source projects including FrameworkPatcher, Android ROM development, and automation tools.",
        icon: Code,
        category: "work",
    },
    {
        id: "timeline3",
        title: "Full Stack Developer",
        date: "2021 - Present",
        description: "Building web applications using React, TypeScript, Python, and modern cloud technologies.",
        icon: Briefcase,
        category: "work",
    },
    {
        id: "timeline4",
        title: "DeepLearning.AI TensorFlow Developer",
        date: "February 2024",
        description: "Professional certification in TensorFlow for AI, Machine Learning, and Deep Learning.",
        icon: Award,
        category: "award",
    },
    {
        id: "timeline5",
        title: "Cisco CCNA Certified",
        date: "May 2025",
        description: "Completed CCNA certification covering networking fundamentals, routing, switching, and automation.",
        icon: Award,
        category: "award",
    },
]

// Default skills (will be overridden by GitHub data)
const defaultSkills = {
    frontend: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Next.js"],
    backend: ["Node.js", "Python", "Flask", "Express", "MongoDB", "MySQL"],
    tools: ["Git", "Docker", "AWS", "Firebase", "VS Code", "Figma"],
}


export default function About() {
    const { allProjects } = useProjects()

    // Use shared GitHub context instead of local fetching
    const { profile: githubProfile, languages } = useGitHubData()

    // Calculate derived values from GitHub data
    const experienceYears = useMemo(() => {
        return githubProfile?.created_at ? calculateExperienceYears(githubProfile.created_at) : 3
    }, [githubProfile?.created_at])

    const skills = useMemo(() => {
        if (languages.length > 0) {
            const categorized = categorizeSkills(languages)
            return {
                frontend: categorized.frontend.length > 0 ? categorized.frontend : defaultSkills.frontend,
                backend: categorized.backend.length > 0 ? categorized.backend : defaultSkills.backend,
                tools: categorized.tools.length > 0 ? categorized.tools : defaultSkills.tools
            }
        }
        return defaultSkills
    }, [languages])

    const uniqueLanguages = useMemo(() => {
        return languages.map(([lang]) => lang)
    }, [languages])

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
        <div className="min-h-screen text-foreground">
            <PageHeader
                title="My Journey"
                rightAction={
                    <a href="https://my-drive.pages.dev/Public/resume.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center text-[10px] sm:text-xs font-mono uppercase tracking-widest px-3 sm:px-4 py-1.5 bg-primary text-primary-foreground hover:bg-white hover:text-black rounded-full transition-colors whitespace-nowrap">
                        <Download className="mr-1.5 h-3.5 w-3.5" /> Resume
                    </a>
                }
            />
            <div className="container mx-auto px-4 py-24 sm:py-32">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden glass-crystal bg-[#0a0a0a]/60 border border-white/5 border-l-primary/50 shadow-[0_0_50px_-15px_rgba(102,111,188,0.3)] mb-12"
                >
                    {/* Tech Background Grid Lines */}
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
                    
                    {/* Ambient Glows */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#8ab8d0]/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

                    <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-10 lg:gap-16">

                        {/* Avatar Column */}
                        <div className="flex-shrink-0 relative group">
                            <div className="absolute inset-0 bg-primary/40 rounded-full blur-2xl group-hover:bg-primary/60 transition-colors duration-500 scale-110" />
                            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border border-white/10 p-1 glass-crystal bg-black/40 shadow-2xl">
                                <div className="w-full h-full rounded-full overflow-hidden">
                                    <LazyImage
                                        src="/profile/profile.jpg"
                                        alt="Jefino"
                                        className="object-cover w-full h-full scale-[1.15] origin-top brightness-110 contrast-110 transition-transform duration-700 group-hover:scale-125"
                                        priority={true}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Info Column */}
                        <div className="flex-grow text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 mb-6">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[10px] font-mono text-emerald-400/80 uppercase tracking-[0.2em]">{githubProfile?.location || 'Kerala, India'}</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-bold text-white mb-4 tracking-tight drop-shadow-md">
                                I'm Jefino<span className="text-primary animate-pulse">_</span>
                            </h1>

                            <h2 className="text-lg sm:text-xl text-[#8ab8d0] font-mono tracking-wide mb-6 opacity-90 border-l-2 border-primary/50 pl-3">
                                AI / DATA SCIENCE <span className="text-white/20 mx-2">|</span> FULL-STACK ENG
                            </h2>

                            <p className="text-[#b3bad9] text-base sm:text-lg leading-relaxed font-light max-w-2xl mx-auto md:mx-0 mb-8 selection:bg-primary/30">
                                {githubProfile?.bio || "Open Source & Automation Enthusiast passionate about building modern, dynamic, and efficient applications. Focused on delivering clean, maintainable code and intuitive user experiences."}
                            </p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <a
                                    href="https://github.com/Jefino9488"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-mono tracking-widest text-white hover:bg-primary/20 hover:border-primary/40 hover:text-primary-foreground hover:shadow-[0_0_20px_-5px_rgba(102,111,188,0.5)] transition-all duration-300"
                                >
                                    <Github className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" /> GITHUB
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/jefino9488/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-mono tracking-widest text-white hover:bg-primary/20 hover:border-primary/40 hover:text-primary-foreground hover:shadow-[0_0_20px_-5px_rgba(102,111,188,0.5)] transition-all duration-300"
                                >
                                    <Linkedin className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" /> LINKEDIN
                                </a>
                                <a
                                    href="mailto:jefinojacob9488@gmail.com"
                                    className="group flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-mono tracking-widest text-white hover:bg-primary/20 hover:border-primary/40 hover:text-primary-foreground hover:shadow-[0_0_20px_-5px_rgba(102,111,188,0.5)] transition-all duration-300"
                                >
                                    <Mail className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" /> EMAIL
                                </a>
                                <a
                                    href="https://telegram.me/jefino9488"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-mono tracking-widest text-white hover:bg-primary/20 hover:border-primary/40 hover:text-primary-foreground hover:shadow-[0_0_20px_-5px_rgba(102,111,188,0.5)] transition-all duration-300 hidden sm:flex"
                                >
                                    <Send className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" /> TELEGRAM
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Minimalist Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[
                        { label: "Experience", value: `${experienceYears}+ Yrs` },
                        { label: "Repositories", value: `${githubProfile?.public_repos || allProjects.length}+` },
                        { label: "Certifications", value: `${certificates.length}` },
                        { label: "Languages", value: `${uniqueLanguages.length || '10'}+` },
                    ].map((stat, i) => (
                        <div key={i} className="glass-crystal border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#666fbc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <p className="text-3xl sm:text-4xl font-poppins font-light text-foreground mb-1 relative z-10 tracking-tight">{stat.value}</p>
                            <p className="text-[10px] sm:text-xs tracking-widest uppercase font-mono text-muted-foreground relative z-10">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* HUD DASHBOARD GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

                    {/* LEFT COLUMN: Bio & Skills */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* DECRYPTED BIO TERMINAL */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                            <div className="glass-crystal border border-[#666fbc]/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-transparent" />

                                <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                                    <div className="w-2 h-2 bg-primary animate-pulse" />
                                    <h2 className="text-sm font-mono text-primary uppercase tracking-widest">SYS_LOG :: Overview</h2>
                                </div>

                                <div className="font-mono text-sm sm:text-base text-[#b3bad9] space-y-4 leading-relaxed">
                                    <p>
                                        <span className="text-white/40 mr-2">{'>'}</span>
                                        Welcome to my domain. I'm an AI & Data Science undergraduate and passionate Full-Stack Developer operating out of Chennai, India. I specialize in architecting modern, high-performance systems with a focus on intelligent automation.
                                    </p>
                                    <p>
                                        <span className="text-white/40 mr-2">{'>'}</span>
                                        My engineering journey ignited with custom Android ROM compiling, evolving into full-stack web architectures. I actively deploy code across React, TypeScript, Python, and Flask ecosystems. Notable payloads include <span className="text-primary font-bold">FrameworkPatcher</span>, solving intricate Android framework modifications.
                                    </p>
                                    <p>
                                        <span className="text-white/40 mr-2">{'>'}</span>
                                        Certified in TensorFlow, Machine Learning, and Cisco Networking, I fuse data-driven AI capabilities with functional software environments to solve complex real-world logic gates.
                                    </p>
                                    <div className="inline-block mt-2 px-2 py-0.5 bg-white/5 text-xs text-white/40 animate-pulse">
                                        _cursor_active
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <h3 className="text-xs font-mono text-white/50 uppercase mb-4 tracking-widest">Live Activity Metric</h3>
                                    <GitHubDashboard />
                                </div>
                            </div>
                        </motion.div>

                        {/* CORE CLUSTERS (Skills) */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                            <div className="glass-crystal border border-white/5 rounded-3xl p-6 sm:p-8">
                                <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                                    <Code className="h-4 w-4 text-primary" />
                                    <h2 className="text-sm font-mono text-primary uppercase tracking-widest">Core_Clusters</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                                    {/* Frontend Node */}
                                    <div>
                                        <h3 className="text-[10px] font-mono text-white/40 mb-3 tracking-[0.2em] uppercase">Node_FE (Client)</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.frontend.map((skill, index) => (
                                                <div key={index} className="px-3 py-1.5 bg-primary/5 hover:bg-primary/20 border border-primary/20 hover:border-primary/50 text-xs font-mono text-[#b3bad9] hover:text-white transition-all cursor-crosshair">
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Backend Node */}
                                    <div>
                                        <h3 className="text-[10px] font-mono text-white/40 mb-3 tracking-[0.2em] uppercase">Node_BE (Server)</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.backend.map((skill, index) => (
                                                <div key={index} className="px-3 py-1.5 bg-emerald-500/5 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/50 text-xs font-mono text-emerald-500/80 hover:text-emerald-400 transition-all cursor-crosshair">
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tooling Node */}
                                    <div className="md:col-span-2">
                                        <h3 className="text-[10px] font-mono text-white/40 mb-3 tracking-[0.2em] uppercase">Node_INFRA (DevOps)</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.tools.map((skill, index) => (
                                                <div key={index} className="px-3 py-1.5 bg-amber-500/5 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/50 text-xs font-mono text-amber-500/80 hover:text-amber-400 transition-all cursor-crosshair">
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                    </div>

                    {/* RIGHT COLUMN: Timeline Pipeline */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="h-full">
                        <div className="glass-crystal border border-[#666fbc]/20 rounded-3xl p-6 sm:p-8 relative h-full">
                            <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
                                <span className="w-1.5 h-1.5 bg-primary/80 rounded block shadow-[0_0_5px_rgba(102,111,188,0.5)] animate-ping" />
                                <h2 className="text-sm font-mono text-primary uppercase tracking-widest">Chronicle_Pipeline</h2>
                            </div>

                            <div className="relative">
                                {/* Glowing Fiber Optic Line */}
                                <div className="absolute left-3.5 top-2 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent shadow-[0_0_10px_rgba(102,111,188,0.8)]"></div>

                                <div className="space-y-10 relative z-10">
                                    {timelineItems.map((item) => (
                                        <div key={item.id} className="relative pl-10 group">
                                            {/* Glowing Node Marker */}
                                            <div className="absolute left-[9px] top-1.5 w-2 h-2 rounded-full bg-[#0a0a0a] border border-primary group-hover:bg-primary transition-colors shadow-[0_0_8px_rgba(102,111,188,0.8)] z-10" />

                                            <div className="mb-1 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <item.icon className="w-3.5 h-3.5 text-primary opacity-60" />
                                                    <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{item.title}</h3>
                                                </div>
                                            </div>

                                            <div className="inline-block px-1.5 py-0.5 bg-white/5 border border-white/10 text-[9px] font-mono text-[#b3bad9] uppercase mb-2">
                                                {item.date}
                                            </div>

                                            <p className="text-xs text-muted-foreground leading-relaxed font-sans border-l border-white/5 pl-3 py-1 group-hover:border-primary/30 transition-colors">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Compact Contact Form Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8"
                >
                    <Card className="glass-crystal neon-border border text-card-foreground rounded-3xl shadow-lg overflow-hidden">
                        <CardContent className="p-6 md:p-8">
                            <div className="max-w-2xl mx-auto">
                                <div className="flex flex-col items-center text-center gap-3 mb-8">
                                    <div className="p-3 bg-primary/10 rounded-full border border-primary/20 relative group">
                                        <div className="absolute inset-0 rounded-full border border-primary/50 animate-ping opacity-20" />
                                        <Mail className="w-6 h-6 text-primary relative z-10" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-mono font-bold text-foreground tracking-widest uppercase">SYS_COM <span className="text-primary italic">:: UPLINK</span></h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-mono tracking-wide">Establish direct terminal connection. Awaiting payload.</p>
                                    </div>
                                </div>

                                {isSubmitted && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
                                    >
                                        <p className="text-green-400 text-sm text-center font-medium">
                                            ✅ Message sent! Your email client should open shortly.
                                        </p>
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-mono text-primary/80 ml-1 uppercase tracking-widest">ID_NAME</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border-l-2 rounded-xl text-sm font-mono text-foreground placeholder-white/20 focus:outline-none focus:bg-primary/5 focus:border-l-primary transition-all ${errors.name ? 'border-destructive' : 'border-l-white/20 border-transparent'
                                                    }`}
                                                placeholder="Enter identifier_"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-mono text-primary/80 ml-1 uppercase tracking-widest">NET_ADDRESS (EMAIL)</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border-l-2 rounded-xl text-sm font-mono text-foreground placeholder-white/20 focus:outline-none focus:bg-primary/5 focus:border-l-primary transition-all ${errors.email ? 'border-destructive' : 'border-l-white/20 border-transparent'
                                                    }`}
                                                placeholder="user@node.net"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-mono text-primary/80 ml-1 uppercase tracking-widest">SUBJECT_HEADER</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border-l-2 rounded-xl text-sm font-mono text-foreground placeholder-white/20 focus:outline-none focus:bg-primary/5 focus:border-l-primary transition-all ${errors.subject ? 'border-destructive' : 'border-l-white/20 border-transparent'
                                                }`}
                                            placeholder="Transmission topic"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-mono text-primary/80 ml-1 uppercase tracking-widest">PAYLOAD_DATA (MESSAGE)</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className={`w-full px-4 py-3 bg-white/5 backdrop-blur-sm border-l-2 rounded-xl text-sm font-mono text-foreground placeholder-white/20 focus:outline-none focus:bg-primary/5 focus:border-l-primary transition-all resize-none ${errors.message ? 'border-destructive' : 'border-l-white/20 border-transparent'
                                                }`}
                                            placeholder="Write payload logic here..."
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full relative group bg-primary/20 hover:bg-primary border border-primary/50 text-white font-mono tracking-widest py-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                                    >
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-primary group-hover:bg-white transition-colors" />
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                [ EXECUTING... ]
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2 relative z-10">
                                                <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                                [ INIT_TRANSMISSION ]
                                            </div>
                                        )}
                                    </Button>
                                </form>

                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <p className="text-muted-foreground font-mono text-xs text-center tracking-wide">
                                        FALLBACK SECURE COMM PROTOCOL: {' '}
                                        <a
                                            href="mailto:jefinojacob9488@gmail.com"
                                            className="text-primary hover:text-white transition-colors hover:underline"
                                        >
                                            jefinojacob9488@gmail.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
