"use client"

import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Github,
    Linkedin,
    ExternalLink,
    Send,
    BookOpen,
    ArrowRight,
    Star,
    GitFork,
    Award,
} from "lucide-react"
import { motion } from "framer-motion"
import { useProjects } from "./ProjectsContext"
import { useScreenSize } from "@/hooks/useScreenSize"

import {
    ReactIcon,
    NodeIcon,
    ExpressIcon,
    SpringIcon,
    JavaIcon,
    NotionIcon,
    GitIcon,
    GitHubIcon,
    VercelIcon,
    NetlifyIcon,
    RenderIcon,
} from "./Icons"
import ExperienceCard from "./ExperienceCard"
import ContributionGraph from "./ContributionGraph"

export default function Home() {
    const { pinnedProjects, allProjects, loading, error } = useProjects()
    const { isXlScreen } = useScreenSize()

    // All tech stack items for the infinite marquee
    const techStack = [
        { name: "React", icon: <ReactIcon className="w-8 h-8" /> },
        { name: "NodeJS", icon: <NodeIcon className="w-8 h-8" /> },
        { name: "Express", icon: <ExpressIcon className="w-8 h-8" /> },
        { name: "Spring Boot", icon: <SpringIcon className="w-8 h-8" /> },
        { name: "Spring Jpa", icon: <SpringIcon className="w-8 h-8" /> },
        { name: "Java", icon: <JavaIcon className="w-8 h-8" /> },
        { name: "Vercel", icon: <VercelIcon className="w-8 h-8" /> },
        { name: "Netlify", icon: <NetlifyIcon className="w-8 h-8" /> },
        { name: "Render", icon: <RenderIcon className="w-8 h-8" /> },
        { name: "Notion", icon: <NotionIcon className="w-8 h-8" /> },
        { name: "Git", icon: <GitIcon className="w-8 h-8" /> },
        { name: "GitHub", icon: <GitHubIcon className="w-8 h-8" /> },
    ]

    // Select projects based on screen size
    const pinnedTitles = new Set(pinnedProjects.map((project) => project.title.toLowerCase()))
    const recentNonPinnedProjects = allProjects
        .filter((project) => !pinnedTitles.has(project.title.toLowerCase()))
        .slice(0, 6)

    const projectCount = 6
    const displayedProjects = [...pinnedProjects.slice(0, 6), ...(isXlScreen ? recentNonPinnedProjects : [])].slice(
        0,
        projectCount,
    )

    return (
        <div className="min-h-screen text-foreground">
            <div className="flex-grow w-full py-4 sm:py-6">
                <header className="mb-12 sm:mb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-16">
                    <div className="flex flex-col-reverse md:flex-row items-start justify-between gap-8 md:gap-16 relative">
                        {/* Abstract Watermark Text */}
                        <div
                            aria-hidden="true"
                            className="absolute top-0 -left-10 hidden md:block select-none pointer-events-none opacity-[0.02] text-[180px] font-black font-poppins text-white leading-none right-0 overflow-hidden whitespace-nowrap"
                            style={{ contentVisibility: "auto", containIntrinsicSize: "180px 1px" }}
                        >
                            //JEFINO
                        </div>

                        {/* Left Side: Text and Actions */}
                        <div className="flex-1 relative z-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-px bg-primary w-12" />
                                    <p className="orbitron-regular text-sm tracking-widest text-primary uppercase">Full Stack Developer</p>
                                </div>
                                <h1 className="font-poppins text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tighter mb-4 text-foreground">
                                    Crafting Digital
                                    <br />
                                    <span className="text-gradient font-light">Experiences.</span>
                                </h1>
                                <p className="font-inter text-muted-foreground text-lg sm:text-xl max-w-xl leading-relaxed mb-8">
                                    I build accessible, performant products and digital experiences for the web. Specialized in modern frontend architecture and scalable backends.
                                </p>

                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                    <Button
                                        onClick={() => {
                                            const element = document.getElementById('featured-projects');
                                            element?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="bg-primary hover:bg-white text-primary-foreground hover:text-black rounded-full px-8 py-6 text-sm font-semibold transition-all">
                                        View Projects
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                    <div className="flex items-center space-x-2">
                                        {[
                                            { icon: Github, link: "https://github.com/Jefino9488", label: "GitHub" },
                                            { icon: Linkedin, link: "https://www.linkedin.com/in/jefino9488/", label: "LinkedIn" },
                                            { icon: Send, link: "https://telegram.me/jefino9488", label: "Telegram" }
                                        ].map((item, index) => (
                                            <a 
                                                key={index} 
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`Visit ${item.label}`}
                                                className="group inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                                            >
                                                <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                            {/* Right Side: Profile / Abstract Frame */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="relative w-full md:w-auto flex justify-center md:block flex-shrink-0 z-10"
                        >
                            {/* Accent box behind */}
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />

                            <div className="relative w-48 h-64 md:w-64 md:h-80 rounded-2xl overflow-hidden glass-crystal neon-border">
                                {/* Use <picture> for WebP with JPEG fallback — eliminates JS lazy-load overhead for LCP image */}
                                <picture>
                                    <source srcSet="/profile/profile_anime.webp" type="image/webp" />
                                    <img
                                        src="/profile/profile_anime.jpg"
                                        alt="Jefino Abstract"
                                        className="w-full h-full object-cover filter contrast-125 mix-blend-screen opacity-60"
                                        width="256"
                                        height="320"
                                        fetchPriority="high"
                                        decoding="async"
                                    />
                                </picture>
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#1e1a33]/90 to-transparent">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] font-mono text-white/80 uppercase tracking-widest">Available for hire</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </header>

                <main className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Things I've Learnt & I know Section - Infinite Circular Flow */}
                    <section
                        className="overflow-hidden relative py-3"
                        style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
                    >

                        {/* Row 1 - Moves Left */}
                        <div className="relative overflow-hidden mb-3">
                            <motion.div
                                className="flex gap-3 sm:gap-4"
                                animate={{ x: ["0%", "-50%"] }}
                                transition={{
                                    x: { repeat: Number.POSITIVE_INFINITY, repeatType: "loop", duration: 40, ease: "linear" },
                                }}
                                style={{ width: "fit-content" }}
                            >
                                {[...techStack, ...techStack].map((tech, index) => (
                                    <div
                                        key={`row1-${index}`}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/5"
                                    >
                                        <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">{tech.icon}</div>
                                        <span className="font-medium text-xs text-foreground/90 whitespace-nowrap">{tech.name}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Row 2 - Moves Right */}
                        <div className="relative overflow-hidden">
                            <motion.div
                                className="flex gap-3 sm:gap-4"
                                animate={{ x: ["-50%", "0%"] }}
                                transition={{
                                    x: { repeat: Number.POSITIVE_INFINITY, repeatType: "loop", duration: 40, ease: "linear" },
                                }}
                                style={{ width: "fit-content" }}
                            >
                                {[...[...techStack].reverse(), ...[...techStack].reverse()].map((tech, index) => (
                                    <div
                                        key={`row2-${index}`}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/5"
                                    >
                                        <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">{tech.icon}</div>
                                        <span className="font-medium text-xs text-foreground/90 whitespace-nowrap">{tech.name}</span>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </section>

                    {/* Latest Modified Project */}
                    <section>
                        <div className="space-y-3">
                            {(() => {
                                const latestProject = allProjects.find(
                                    (project) => !["jefino9488", "myprofileviews"].includes(project.title.toLowerCase()),
                                )
                                if (!latestProject) return null

                                const lastUpdatedDate = latestProject.updatedAt
                                    ? new Date(latestProject.updatedAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })
                                    : "Recently"

                                return (
                                    <ExperienceCard
                                        company={latestProject.title}
                                        role={latestProject.description}
                                        date={`Updated: ${lastUpdatedDate}`}
                                        location="Open Source"
                                        status="Latest Update"
                                        link={latestProject.link}
                                        logo={<GitFork className="w-8 h-8" />}
                                    />
                                )
                            })()}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex flex-col gap-4">
                            <ContributionGraph />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="glass-crystal border border-white/5 border-l-2 border-l-primary/40 bg-[#0a0a0a]/60 rounded-[1.25rem] p-5 flex flex-col items-center justify-center min-h-[160px] cursor-default group relative overflow-hidden hover:border-l-primary hover:shadow-[0_0_30px_-10px_rgba(102,111,188,0.4)] transition-all duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[1.25rem]" />
                                    <h3 className="text-sm font-mono tracking-tight font-bold text-white mb-4 self-start flex items-center gap-2 group-hover:text-primary transition-colors relative z-10 w-full uppercase">
                                        <div className="p-1.5 bg-primary/10 rounded-md border border-primary/20">
                                            <Star className="w-4 h-4 text-amber-500" />
                                        </div>
                                        GITHUB_STREAK
                                    </h3>
                                    {/* Reserve height to prevent CLS — image is 195px tall on vercel stat cards */}
                                    <div className="w-full flex justify-center relative z-10 hover:scale-[1.02] transition-transform duration-500" style={{ minHeight: 195 }}>
                                        <a href="https://git.io/streak-stats" target="_blank" rel="noopener noreferrer" className="block w-full max-w-[400px]">
                                            <img
                                                src="https://github-readme-streak-stats-beta-one.vercel.app?user=Jefino9488&theme=neon-dark&hide_border=true&background=00000000"
                                                alt="GitHub Streak"
                                                className="w-full h-auto drop-shadow-xl"
                                                width="400"
                                                height="195"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </a>
                                    </div>
                                </div>

                                <div className="glass-crystal border border-white/5 border-l-2 border-l-primary/40 bg-[#0a0a0a]/60 rounded-[1.25rem] p-5 flex flex-col items-center justify-center min-h-[160px] cursor-default group relative overflow-hidden hover:border-l-primary hover:shadow-[0_0_30px_-10px_rgba(102,111,188,0.4)] transition-all duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[1.25rem]" />
                                    <h3 className="text-sm font-mono tracking-tight font-bold text-white mb-4 self-start flex items-center gap-2 group-hover:text-primary transition-colors relative z-10 w-full uppercase">
                                        <div className="p-1.5 bg-primary/10 rounded-md border border-primary/20">
                                            <GitFork className="w-4 h-4 text-blue-500" />
                                        </div>
                                        TOP_LANGUAGES
                                    </h3>
                                    {/* Reserve height to prevent CLS */}
                                    <div className="w-full flex justify-center relative z-10 hover:scale-[1.02] transition-transform duration-500" style={{ minHeight: 170 }}>
                                        <img
                                            src="https://github-readme-stats.vercel.app/api/top-langs/?username=Jefino9488&layout=compact&theme=tokyonight&hide_border=true&bg_color=00000000"
                                            alt="Top Languages"
                                            className="w-full max-w-[300px] h-auto aspect-[20/11] drop-shadow-xl"
                                            width="300"
                                            height="165"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link to="/blog" className="block h-full group">
                            <Card className="glass-crystal h-full border border-white/5 border-l-2 border-l-primary/40 transition-all duration-500 rounded-[1.25rem] hover:shadow-[0_0_30px_-10px_rgba(102,111,188,0.4)] hover:-translate-y-1 hover:border-l-primary cursor-pointer group-hover:bg-[#0a0a0a]/60 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <CardHeader className="pb-2 relative z-10">
                                    <CardTitle className="flex items-center text-lg font-mono font-bold text-white group-hover:text-primary transition-colors tracking-tight">
                                        <div className="p-2 bg-primary/10 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300 border border-primary/20">
                                            <BookOpen className="h-5 w-5 text-primary" />
                                        </div>
                                        EXPLORE_MY_BLOGS
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <p className="text-sm font-mono text-[#b3bad9] mb-4 leading-relaxed font-light">
                                        Dive into my latest thoughts and insights on technology, development, and more.
                                    </p>
                                    <div className="flex items-center text-primary font-mono tracking-widest uppercase transition-transform text-[10px]">
                                        <span className="mr-1.5 group-hover:translate-x-2 transition-transform duration-300">Read latest posts</span>
                                        <ArrowRight className="h-3 w-3 group-hover:translate-x-2 transition-transform duration-300" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link to="/certificates" className="block h-full group">
                            <Card className="glass-crystal h-full border border-white/5 border-l-2 border-l-primary/40 transition-all duration-500 rounded-[1.25rem] hover:shadow-[0_0_30px_-10px_rgba(102,111,188,0.4)] hover:-translate-y-1 hover:border-l-primary cursor-pointer group-hover:bg-[#0a0a0a]/60 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <CardHeader className="pb-2 relative z-10">
                                    <CardTitle className="flex items-center text-lg font-mono font-bold text-white group-hover:text-primary transition-colors tracking-tight">
                                        <div className="p-2 bg-primary/10 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300 border border-primary/20">
                                            <Award className="h-5 w-5 text-primary" />
                                        </div>
                                        VIEW_CERTIFICATES
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="relative z-10">
                                    <p className="text-sm font-mono text-[#b3bad9] mb-4 leading-relaxed font-light">
                                        Check out my professional certifications and achievements in various technologies.
                                    </p>
                                    <div className="flex items-center text-primary font-mono tracking-widest uppercase transition-transform text-[10px]">
                                        <span className="mr-1.5 group-hover:translate-x-2 transition-transform duration-300">See achievements</span>
                                        <ArrowRight className="h-3 w-3 group-hover:translate-x-2 transition-transform duration-300" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </section>

                    <section id="featured-projects">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">Featured Projects</h2>
                                <p className="text-muted-foreground text-xs">Selected works from my portfolio</p>
                            </div>
                            <Link to="/projects" className="group flex items-center text-primary hover:text-primary/80 transition-colors bg-secondary/30 px-3 py-1 rounded-full backdrop-blur-sm text-xs">
                                <span className="mr-1 font-medium">View all</span>
                                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="text-center text-muted-foreground py-8">Loading projects...</div>
                        ) : error ? (
                            <div className="text-center text-destructive py-8">{error}</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                {displayedProjects.map((project) => (
                                    <motion.div
                                        key={project.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="h-full"
                                    >
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="h-full block cursor-pointer group"
                                        >
                                            <Card className="glass-crystal relative p-5 transition-all duration-500 h-full flex flex-col rounded-[1.25rem] border border-white/5 bg-[#0a0a0a]/60 shadow-lg hover:shadow-[0_0_25px_-5px_rgba(102,111,188,0.4)] hover:border-primary/40">
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[1.25rem]" />
                                                
                                                <div className="flex justify-between items-start mb-4 relative z-10">
                                                    <div className="p-2.5 bg-primary/10 rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20 border border-primary/20">
                                                        <GitFork className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <div className="p-1 text-muted-foreground/50 group-hover:text-primary transition-colors">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </div>
                                                </div>

                                                <h3 className="text-lg font-bold mb-2 text-white line-clamp-1 group-hover:text-primary transition-colors relative z-10">{project.title}</h3>
                                                <p className="text-[#b3bad9] mb-4 text-sm line-clamp-3 leading-relaxed flex-grow relative z-10 font-light">{project.description}</p>

                                                <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                                                    {project.tech.slice(0, 3).map((tech) => (
                                                        <span
                                                            key={tech}
                                                            className="px-2 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono tracking-widest uppercase text-muted-foreground group-hover:border-primary/30 group-hover:text-primary/90 transition-colors"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                    {project.tech.length > 3 && (
                                                        <span className="px-2 py-1 bg-transparent text-[10px] font-mono tracking-widest text-muted-foreground/50">+{project.tech.length - 3} MORE</span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-4 text-[10px] font-mono tracking-widest text-[#b3bad9]/50 pt-3 border-t border-white/5 relative z-10">
                                                    <span className="flex items-center gap-1 group-hover:text-amber-500 transition-colors">
                                                        <Star className="w-3.5 h-3.5 text-amber-500/70 group-hover:text-amber-500" /> {project.stats.stars}
                                                    </span>
                                                    <span className="flex items-center gap-1 group-hover:text-blue-400 transition-colors">
                                                        <GitFork className="w-3.5 h-3.5 text-blue-500/70 group-hover:text-blue-500" /> {project.stats.forks}
                                                    </span>
                                                </div>
                                            </Card>
                                        </a>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div >
            {/* Page Transition CTA */}
            <div className="py-12 mt-12 flex justify-center items-center border-t border-white/5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/projects" className="group">
                    <div className="flex flex-col items-center justify-center gap-3">
                        <p className="text-xs sm:text-sm font-mono tracking-widest text-muted-foreground uppercase group-hover:text-primary transition-colors">
                            Continue Exploring
                        </p>
                        <div className="flex items-center gap-3 text-2xl sm:text-3xl font-poppins font-semibold text-foreground group-hover:text-primary transition-colors">
                            GitHub Overview
                            <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                    </div>
                </Link>
            </div>
        </div >
    )
}
