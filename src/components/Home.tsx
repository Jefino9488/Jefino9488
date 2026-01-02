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
  Terminal,
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

  const techStackRow1 = techStack.slice(0, 6)
  const techStackRow2 = techStack.slice(6)

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
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex-grow w-full py-12">
        <header className="mb-8 sm:mb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-card border-border text-card-foreground rounded-3xl shadow-lg overflow-hidden">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex-shrink-0 relative"
                >
                  <div className="absolute inset-0 bg-primary/20 rounded-full filter blur-xl opacity-100"></div>
                  <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-4 border-border shadow-lg relative rounded-full overflow-hidden">
                    <LazyImage
                      src="/profile/profile.jpg"
                      alt="Jefino Jacob - Full Stack Developer"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: "center 20%" }}
                      priority={true}
                      width={128}
                      height={128}
                    />
                  </div>
                </motion.div>
                <div className="flex-grow text-center md:text-left">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h1 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-bold mb-2 tracking-tight text-foreground">
                      Jefino
                    </h1>
                    <p className="orbitron-regular text-lg sm:text-xl md:text-2xl text-muted-foreground font-light mb-4">
                      Backend Fullstack Developer
                    </p>
                    <div className="flex flex-col space-y-2 mb-6">
                      <p className="font-inter flex items-center justify-center md:justify-start text-muted-foreground">
                        <MapPin className="mr-2 h-5 w-5 text-primary" />
                        Based in Chennai, India
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex justify-center md:justify-start space-x-4"
                  >
                    <TouchFeedback
                      onTap={() => window.open("https://github.com/Jefino9488", "_blank", "noopener,noreferrer")}
                      ripple={false}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-secondary hover:bg-secondary/80 transition-colors border-border min-h-[44px] min-w-[44px]"
                        aria-label="GitHub"
                      >
                        <Github className="h-5 w-5 text-foreground" />
                      </Button>
                    </TouchFeedback>
                    <TouchFeedback
                      onTap={() => window.open("mailto:jefinojacob9488@gmail.com", "_blank")}
                      ripple={false}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-secondary hover:bg-secondary/80 transition-colors border-border min-h-[44px] min-w-[44px]"
                        aria-label="Email"
                      >
                        <Mail className="h-5 w-5 text-foreground" />
                      </Button>
                    </TouchFeedback>
                    <TouchFeedback
                      onTap={() =>
                        window.open("https://www.linkedin.com/in/jefino9488/", "_blank", "noopener,noreferrer")
                      }
                      ripple={false}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-secondary hover:bg-secondary/80 transition-colors border-border min-h-[44px] min-w-[44px]"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-5 w-5 text-foreground" />
                      </Button>
                    </TouchFeedback>
                    <TouchFeedback
                      onTap={() => window.open("https://telegram.me/jefino9488", "_blank", "noopener,noreferrer")}
                      ripple={false}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-secondary hover:bg-secondary/80 transition-colors border-border min-h-[44px] min-w-[44px]"
                        aria-label="Telegram"
                      >
                        <Send className="h-5 w-5 text-foreground" />
                      </Button>
                    </TouchFeedback>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </header>
        <main className="space-y-8 sm:space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Things I've Learnt & I know Section - Scrolling Icons */}
          <section className="overflow-hidden">
            {/* <div className="relative mb-6">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur opacity-25"></div>
                            <h2 className="relative text-2xl font-bold text-foreground border-l-4 border-primary pl-4 py-1">
                                Things I've Learnt & I know
                            </h2>
                        </div> */}

            {/* Row 1 - Scroll Right */}
            <div className="relative overflow-hidden mb-4">
              <motion.div
                className="flex gap-6"
                animate={{
                  x: [0, -1000],
                }}
                transition={{
                  x: {
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear",
                  },
                }}
              >
                {[...techStackRow1, ...techStackRow1, ...techStackRow1].map((tech, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-6 py-3 bg-card/50 backdrop-blur border border-border rounded-xl min-w-fit"
                  >
                    <div>{tech.icon}</div>
                    <span className="font-medium text-sm text-foreground whitespace-nowrap">{tech.name}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Row 2 - Scroll Left */}
            <div className="relative overflow-hidden">
              <motion.div
                className="flex gap-6"
                animate={{
                  x: [-1000, 0],
                }}
                transition={{
                  x: {
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear",
                  },
                }}
              >
                {[...techStackRow2, ...techStackRow2, ...techStackRow2].map((tech, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-6 py-3 bg-card/50 backdrop-blur border border-border rounded-xl min-w-fit"
                  >
                    <div>{tech.icon}</div>
                    <span className="font-medium text-sm text-foreground whitespace-nowrap">{tech.name}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Framework Patcher Project */}
          <section>
            <div className="space-y-4">
              <ExperienceCard
                company="Framework Patcher"
                role="Android Patching & Security Tool"
                date="2024 - Present"
                location="Open Source"
                status="Ongoing"
                link="https://github.com/Jefino9488/FrameworkPatcher"
                logo={<Terminal className="w-8 h-8" />}
              />
            </div>
          </section>

          {/* GitHub Stats & Graph Section */}
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              <ContributionGraph />
              <div className="bg-card border border-border rounded-3xl p-6 flex flex-col items-center justify-center min-h-[200px]">
                <h3 className="text-lg font-bold text-foreground mb-4 self-start">GitHub Streak</h3>
                <div className="flex-grow flex items-center justify-center w-full">
                  <a href="https://git.io/streak-stats" target="_blank" rel="noopener noreferrer" className="w-full">
                    <img
                      src="https://github-readme-streak-stats-beta-one.vercel.app?user=Jefino9488&theme=neon-dark&hide_border=true"
                      alt="GitHub Streak"
                      className="h-auto w-full max-w-[495px] mx-auto rounded-2xl"
                    />
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card border-border border text-card-foreground hover:bg-accent transition-colors rounded-3xl shadow-lg overflow-hidden hover-lift">
              <Link to="/blog" className="block">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg sm:text-2xl font-bold text-foreground">
                    <BookOpen className="h-8 w-8 mr-3 text-primary" />
                    Explore My Blogs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg sm:text-xl text-muted-foreground mb-4">
                    Dive into my latest thoughts and insights on technology, development, and more.
                  </p>
                  <div className="flex items-center text-primary hover:text-primary/80 transition-colors">
                    <span className="mr-2 font-semibold">Read latest posts</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="bg-card border-border border text-card-foreground hover:bg-accent transition-colors rounded-3xl shadow-lg overflow-hidden hover-lift">
              <Link to="/certificates" className="block">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg sm:text-2xl font-bold text-foreground">
                    <Award className="h-8 w-8 mr-3 text-primary" />
                    View My Certificates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg sm:text-xl text-muted-foreground mb-4">
                    Check out my professional certifications and achievements in various technologies.
                  </p>
                  <div className="flex items-center text-primary hover:text-primary/80 transition-colors">
                    <span className="mr-2 font-semibold">See certificates</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          </section>

          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Featured Projects</h2>
              <Link to="/projects" className="text-primary hover:text-primary/80 transition-colors flex items-center">
                <span className="mr-2">View all</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {loading ? (
              <div className="text-center text-muted-foreground py-12">Loading projects...</div>
            ) : error ? (
              <div className="text-center text-destructive py-12">{error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedProjects.map((project) => (
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="hover-lift"
                  >
                    <TouchFeedback
                      onTap={() => window.open(project.link, "_blank", "noopener,noreferrer")}
                      onLongPress={() => {
                        navigator.clipboard.writeText(project.link)
                      }}
                      ripple={true}
                      className="h-full"
                    >
                      <div className="group relative h-full cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                        <div className="relative backdrop-blur-xl bg-card rounded-3xl p-6 border border-border transition-all duration-300 group-hover:border-primary/50 h-full flex flex-col">
                          <h3 className="text-xl font-semibold mb-3 text-card-foreground">{project.title}</h3>
                          <p className="text-muted-foreground mb-4 text-sm line-clamp-2">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tech.map((tech) => (
                              <span
                                key={tech}
                                className="px-3 py-1 bg-secondary rounded-full text-xs text-secondary-foreground"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                          <div className="flex justify-between items-center mt-auto">
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-primary" /> {project.stats.stars}
                              </span>
                              <span className="flex items-center gap-1">
                                <GitFork className="w-4 h-4 text-primary" /> {project.stats.forks}
                              </span>
                            </div>
                            <div className="p-2 text-muted-foreground hover:text-primary transition-colors">
                              <ExternalLink className="w-5 h-5 text-primary" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </TouchFeedback>
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
          <p className="text-muted-foreground text-xs sm:text-sm mb-2 animate-pulse text-center">
            Pull up for Github Overview
          </p>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="w-8 h-1.5 sm:w-12 sm:h-2 bg-muted-foreground rounded-full"
          ></motion.div>
        </div>
      </motion.div>
    </div>
  )
}
