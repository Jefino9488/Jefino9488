"use client"

import { Link, useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Github,
    Mail,
    Linkedin,
    ExternalLink,
    Send,
    BookOpen,
    ArrowRight,
    Star,
    GitFork,
    MapPin,
    Award,
} from "lucide-react"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import { useProjects } from "./ProjectsContext"
import { useScreenSize } from "@/hooks/useScreenSize"
import LazyImage from "./LazyImage"
import TouchFeedback from "./TouchFeedback"
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
    const navigate = useNavigate()

    const dragY = useMotionValue(0)
    const opacity = useTransform(dragY, [0, -100], [1, 0])
    const scale = useTransform(dragY, [0, -100], [1, 0.8])

    const handleDragEnd = (_event: MouseEvent | TouchEvent, info: PanInfo) => {
        if (info.offset.y < -50) {
            navigate("/projects")
        }
    }

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
                <header className="mb-6 sm:mb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="glass-crystal rounded-[2rem] overflow-hidden border-0 relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                        <CardContent className="p-5 sm:p-6 relative z-10">
                            <div className="flex flex-col items-center md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex-shrink-0 relative"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full blur-2xl opacity-40 animate-pulse"></div>
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 border-4 border-white/10 shadow-2xl relative rounded-full overflow-hidden">
                                        <LazyImage
                                            src="/profile/profile.jpg"
                                            alt="Jefino - Full Stack Developer"
                                            className="w-full h-full object-cover type-module"
                                            style={{ objectPosition: "center 20%" }}
                                            priority={true}
                                            width={160}
                                            height={160}
                                        />
                                    </div>
                                </motion.div>
                                <div className="flex-grow text-center md:text-left space-y-2">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        <h1 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-bold mb-1 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/70">
                                            Jefino
                                        </h1>
                                        <p className="orbitron-regular text-base sm:text-lg text-primary/90 font-medium tracking-wide mb-2">
                                            Fullstack Developer
                                        </p>
                                        <div className="flex flex-col items-center md:items-start space-y-1">
                                            <p className="font-inter flex items-center text-muted-foreground/80 bg-white/5 py-0.5 px-2.5 rounded-full text-xs sm:text-sm">
                                                <MapPin className="mr-1.5 h-3 w-3 text-primary" />
                                                Based in Chennai, India
                                            </p>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.4 }}
                                        className="flex flex-wrap justify-center md:justify-start gap-2"
                                    >
                                        {[
                                            { icon: Github, link: "https://github.com/Jefino9488", label: "GitHub" },
                                            { icon: Mail, link: "mailto:jefinojacob9488@gmail.com", label: "Email" },
                                            { icon: Linkedin, link: "https://www.linkedin.com/in/jefino9488/", label: "LinkedIn" },
                                            { icon: Send, link: "https://telegram.me/jefino9488", label: "Telegram" }
                                        ].map((item, index) => (
                                            <TouchFeedback
                                                key={index}
                                                onTap={() => window.open(item.link, "_blank", "noopener,noreferrer")}
                                                ripple={false}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-300 border border-white/5"
                                                    aria-label={item.label}
                                                >
                                                    <item.icon className="h-4 w-4 text-foreground/90" />
                                                </Button>
                                            </TouchFeedback>
                                        ))}
                                    </motion.div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
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

                    {/* GitHub Stats & Graph Section */}
                    <section className="space-y-4">
                        <div className="flex flex-col gap-4">
                            <ContributionGraph />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="glass-crystal border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center min-h-[160px] hover:bg-white/5 transition-colors">
                                    <h3 className="text-base font-bold text-foreground mb-3 self-start flex items-center gap-1.5">
                                        <Star className="w-4 h-4 text-amber-500" />
                                        GitHub Streak
                                    </h3>
                                    <div className="w-full flex justify-center">
                                        <a href="https://git.io/streak-stats" target="_blank" rel="noopener noreferrer" className="block w-full max-w-[400px]">
                                            <img
                                                src="https://github-readme-streak-stats-beta-one.vercel.app?user=Jefino9488&theme=neon-dark&hide_border=true&background=00000000"
                                                alt="GitHub Streak"
                                                className="w-full h-auto drop-shadow-xl"
                                            />
                                        </a>
                                    </div>
                                </div>

                                <div className="glass-crystal border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center min-h-[160px] hover:bg-white/5 transition-colors">
                                    <h3 className="text-base font-bold text-foreground mb-3 self-start flex items-center gap-1.5">
                                        <GitFork className="w-4 h-4 text-blue-500" />
                                        Top Languages
                                    </h3>
                                    <div className="w-full flex justify-center">
                                        <img
                                            src="https://github-readme-stats.vercel.app/api/top-langs/?username=Jefino9488&layout=compact&theme=tokyonight&hide_border=true&bg_color=00000000"
                                            alt="Top Languages"
                                            className="w-full max-w-[300px] h-auto drop-shadow-xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link to="/blog" className="block h-full group">
                            <Card className="glass-crystal h-full border-0 transition-all duration-300 rounded-[1.25rem] hover:shadow-2xl hover:-translate-y-1 cursor-pointer group-hover:bg-white/[0.03] overflow-hidden">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                        <div className="p-2 bg-white/5 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                                            <BookOpen className="h-5 w-5 text-primary" />
                                        </div>
                                        Explore My Blogs
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground/80 mb-3 leading-relaxed">
                                        Dive into my latest thoughts and insights on technology, development, and more.
                                    </p>
                                    <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform text-xs">
                                        <span className="mr-1.5">Read latest posts</span>
                                        <ArrowRight className="h-3 w-3" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        <Link to="/certificates" className="block h-full group">
                            <Card className="glass-crystal h-full border-0 transition-all duration-300 rounded-[1.25rem] hover:shadow-2xl hover:-translate-y-1 cursor-pointer group-hover:bg-white/[0.03] overflow-hidden">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                        <div className="p-2 bg-white/5 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                                            <Award className="h-5 w-5 text-primary" />
                                        </div>
                                        View Certificates
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground/80 mb-3 leading-relaxed">
                                        Check out my professional certifications and achievements in various technologies.
                                    </p>
                                    <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform text-xs">
                                        <span className="mr-1.5">See achievements</span>
                                        <ArrowRight className="h-3 w-3" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </section>

                    <section>
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
                                        <TouchFeedback
                                            onTap={() => window.open(project.link, "_blank", "noopener,noreferrer")}
                                            onLongPress={() => {
                                                navigator.clipboard.writeText(project.link)
                                            }}
                                            ripple={true}
                                            className="h-full block"
                                        >
                                            <Card className="glass-crystal relative p-4 border-0 transition-all duration-300 h-full flex flex-col rounded-[1.25rem] cursor-pointer group group-hover:bg-white/[0.03]">
                                                <div className="flex justify-between items-start mb-2.5">
                                                    <div className="p-2 bg-white/5 rounded-lg transition-transform duration-300">
                                                        <GitFork className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <div className="p-1 text-muted-foreground/50 group-hover:text-primary transition-colors">
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </div>
                                                </div>

                                                <h3 className="text-base font-bold mb-1.5 text-foreground line-clamp-1 group-hover:text-primary transition-colors">{project.title}</h3>
                                                <p className="text-muted-foreground/80 mb-3 text-xs line-clamp-3 leading-relaxed flex-grow">{project.description}</p>

                                                <div className="flex flex-wrap gap-1.5 mb-3">
                                                    {project.tech.slice(0, 3).map((tech) => (
                                                        <span
                                                            key={tech}
                                                            className="px-2 py-0.5 bg-white/5 border border-white/5 rounded-full text-[10px] font-medium text-muted-foreground group-hover:border-primary/20 group-hover:text-primary/80 transition-colors"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                    {project.tech.length > 3 && (
                                                        <span className="px-1.5 py-0.5 text-[10px] text-muted-foreground/50">+{project.tech.length - 3}</span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-3 text-[10px] text-muted-foreground/70 pt-2.5 border-t border-white/5">
                                                    <span className="flex items-center gap-1">
                                                        <Star className="w-3 h-3 text-amber-500" /> {project.stats.stars}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <GitFork className="w-3 h-3 text-blue-500" /> {project.stats.forks}
                                                    </span>
                                                </div>
                                            </Card>
                                        </TouchFeedback>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div >
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
                    <p className="text-muted-foreground text-[10px] sm:text-xs mb-1 animate-pulse text-center">
                        Pull up for Github Overview
                    </p>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                        className="w-8 h-1 sm:w-10 sm:h-1.5 bg-muted-foreground rounded-full"
                    ></motion.div>
                </div>
            </motion.div>
        </div >
    )
}
