import { Link, useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Mail, Linkedin, ExternalLink, Send, BookOpen, ArrowRight, Star, GitFork, MapPin, Award, Music2 } from 'lucide-react'
import { motion, useMotionValue, useTransform, type PanInfo, AnimatePresence } from "framer-motion"
import { useProjects } from "./ProjectsContext"
import { useScreenSize } from "@/hooks/useScreenSize"
import { getCurrentlyPlaying, SpotifyTrack, initiateSpotifyLogin, handleCallback } from "@/utils/spotify"
import { useEffect, useState, useCallback } from "react"

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

    const skills = ["Python", "Java", "Flask", "React", "Spring Boot", "GitHub", "Postgress", "Docker", "FireBase"]

    // Select projects based on screen size
    const pinnedTitles = new Set(pinnedProjects.map(project => project.title.toLowerCase()))
    const recentNonPinnedProjects = allProjects
        .filter(project => !pinnedTitles.has(project.title.toLowerCase())) // Exclude pinned projects
        .slice(0, 2) // Take the top 2 (already sorted by UPDATED_AT)

    // Display 8 projects on xl screens, 6 otherwise
    const projectCount = isXlScreen ? 8 : 6
    const displayedProjects = [
        ...pinnedProjects.slice(0, 6),
        ...(isXlScreen ? recentNonPinnedProjects : [])
    ].slice(0, projectCount)

    const [spotifyTrack, setSpotifyTrack] = useState<SpotifyTrack | null>(null)
    const [showSpotifyDetails, setShowSpotifyDetails] = useState(false)
    const [isSpotifyConnected, setIsSpotifyConnected] = useState(!!localStorage.getItem('spotify_access_token'))

    const fetchSpotifyTrack = useCallback(async () => {
        try {
            const track = await getCurrentlyPlaying()
            if (track) {
                setSpotifyTrack(track)
                setIsSpotifyConnected(true)
            } else {
                setIsSpotifyConnected(false);
            }
        } catch (error) {
            console.error('Error fetching Spotify track:', error)
            setIsSpotifyConnected(false)
        }
    }, [])

    useEffect(() => {
        async function init() {
            const didAuth = await handleCallback(); // handles ?code=... exchange
            if (didAuth) {
                setIsSpotifyConnected(true);
            }
            if (isSpotifyConnected || didAuth) {
                fetchSpotifyTrack();
                const interval = setInterval(fetchSpotifyTrack, 10000); // Update every 10 seconds
                return () => clearInterval(interval);
            }
        }
        init();
    }, [fetchSpotifyTrack, isSpotifyConnected]);


    return (
        <div className="min-h-screen bg-[#020203] text-[#cdd6f4]">
            <div className="flex-grow w-full py-12">
                <header className="mb-8 sm:mb-12 container mx-auto px-4">
                    <Card className="bg-gradient-to-br from-[#0C0810] to-[#0D0911] border-none text-[#cdd6f4] rounded-3xl shadow-lg overflow-hidden">
                        <CardContent className="p-6 md:p-8">
                            <div className="flex flex-col items-center md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex-shrink-0 relative"
                                >
                                    <div className="absolute inset-0 bg-purple-950 rounded-full filter blur-xl opacity-100"></div>
                                    <Avatar className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 border-4 border-[#3F304E] shadow-lg relative">
                                        <AvatarImage src="/profile/profile.jpg" alt="Jefino" />
                                        <AvatarFallback>JT</AvatarFallback>
                                    </Avatar>

                                    {/* Spotify Section */}
                                    {!isSpotifyConnected ? (
                                        <div
                                            onClick={initiateSpotifyLogin}
                                            className="group absolute -bottom-2 right-0 bg-[#1DB954] rounded-full shadow-lg border-2 border-[#020203] transition-all hover:scale-105 cursor-pointer px-3 py-1.5"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Music2 className="w-4 h-4 text-white" />
                                                <span className="text-white text-xs font-medium">
                                                    Connect Spotify
                                                </span>
                                            </div>
                                        </div>
                                    ) : spotifyTrack && (
                                        <div
                                            className="group absolute -bottom-2 right-0 bg-[#1DB954] rounded-full shadow-lg border-2 border-[#020203] transition-all hover:scale-105 cursor-pointer"
                                            onClick={() => window.open(spotifyTrack.url, '_blank')}
                                            onMouseEnter={() => setShowSpotifyDetails(true)}
                                            onMouseLeave={() => setShowSpotifyDetails(false)}
                                        >
                                            <div className="flex items-center gap-2 pl-2 pr-3 py-1.5">
                                                <Music2 className={`w-4 h-4 text-white ${spotifyTrack.isPlaying ? 'animate-pulse' : ''}`} />
                                                <div className="text-white text-xs font-medium max-w-[120px] truncate">
                                                    {spotifyTrack.name}
                                                </div>
                                            </div>

                                            {/* Floating Details */}
                                            <AnimatePresence>
                                                {showSpotifyDetails && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9, y: 5 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9, y: 5 }}
                                                        className="absolute right-0 bottom-full mb-2 bg-[#0C0810] rounded-lg shadow-xl border border-[#313244] w-48 p-3"
                                                    >
                                                        <div className="text-[#f5c2e7] text-xs font-medium mb-1">
                                                            {spotifyTrack.isPlaying ? "Now Playing" : "Recently Played"}
                                                        </div>
                                                        <div className="text-white text-sm font-semibold mb-0.5 truncate">
                                                            {spotifyTrack.name}
                                                        </div>
                                                        <div className="text-[#a6adc8] text-xs truncate">
                                                            {spotifyTrack.artist}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}
                                </motion.div>
                                <div className="flex-grow text-center md:text-left">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                    >
                                        <h1 className="font-poppins text-3xl sm:text-4xl md:text-5xl font-bold mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#f5c2e7] to-[#cba6f7]">
                                            Jefino
                                        </h1>
                                        <p className="orbitron-regular text-xl sm:text-2xl md:text-3xl text-[#cba6f7] font-light mb-4">
                                            Full Stack Developer
                                        </p>
                                        <div className="flex flex-col space-y-2 mb-6">
                                            <p className="font-inter flex items-center justify-center md:justify-start text-[#cdd6f4]">
                                                <MapPin className="mr-2 h-5 w-5 text-[#cba6f7]" />
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
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="bg-gray-700 hover:bg-gray-600 transition-colors border-gray-600"
                                        >
                                            <a
                                                href="https://github.com/Jefino9488"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="GitHub"
                                            >
                                                <Github className="h-5 w-5 text-[#f5c2e7]" />
                                            </a>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="bg-gray-700 hover:bg-gray-600 transition-colors border-gray-600"
                                        >
                                            <a href="mailto:jefinojacob9488@gmail.com" aria-label="Email">
                                                <Mail className="h-5 w-5 text-[#f5c2e7]" />
                                            </a>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="bg-gray-700 hover:bg-gray-600 transition-colors border-gray-600"
                                        >
                                            <a
                                                href="https://www.linkedin.com/in/jefino9488/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="LinkedIn"
                                            >
                                                <Linkedin className="h-5 w-5 text-[#f5c2e7]" />
                                            </a>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="bg-gray-700 hover:bg-gray-600 transition-colors border-gray-600"
                                        >
                                            <a
                                                href="https://telegram.me/jefino9488"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="Telegram"
                                            >
                                                <Send className="h-5 w-5 text-[#f5c2e7]" />
                                            </a>
                                        </Button>
                                    </motion.div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </header>
                <main className="space-y-8 sm:space-y-10 container mx-auto px-4">
                    <section>
                        <div className="flex flex-wrap justify-center gap-4">
                            {skills.map((skill, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-lg py-2 px-4 bg-[#191121] hover:bg-[#1E1627] transition-colors rounded-2xl text-[#cdd6f4]"
                                >
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-[#0C0810] border-[#313244] border text-[#cdd6f4] hover:bg-[#1E1627] transition-colors rounded-3xl shadow-lg overflow-hidden hover-lift">
                            <Link to="/blog" className="block">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center text-lg sm:text-2xl font-bold text-[#f5c2e7]">
                                        <BookOpen className="h-8 w-8 mr-3 text-[#cba6f7]" />
                                        Explore My Blogs
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-lg sm:text-xl text-[#cdd6f4] mb-4">
                                        Dive into my latest thoughts and insights on technology, development, and more.
                                    </p>
                                    <div className="flex items-center text-[#89b4fa] hover:text-[#f5c2e7] transition-colors">
                                        <span className="mr-2 font-semibold">Read latest posts</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </div>
                                </CardContent>
                            </Link>
                        </Card>

                        <Card className="bg-[#0C0810] border-[#313244] border text-[#cdd6f4] hover:bg-[#1E1627] transition-colors rounded-3xl shadow-lg overflow-hidden hover-lift">
                            <Link to="/certificates" className="block">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center text-lg sm:text-2xl font-bold text-[#f5c2e7]">
                                        <Award className="h-8 w-8 mr-3 text-[#cba6f7]" />
                                        View My Certificates
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-lg sm:text-xl text-[#cdd6f4] mb-4">
                                        Check out my professional certifications and achievements in various technologies.
                                    </p>
                                    <div className="flex items-center text-[#89b4fa] hover:text-[#f5c2e7] transition-colors">
                                        <span className="mr-2 font-semibold">See certificates</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </div>
                                </CardContent>
                            </Link>
                        </Card>
                    </section>

                    <section>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#cba6f7]">Featured Projects</h2>
                            <Link to="/projects" className="text-[#89b4fa] hover:text-[#f5c2e7] transition-colors flex items-center">
                                <span className="mr-2">View all</span>
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="text-center text-gray-400 py-12">Loading projects...</div>
                        ) : error ? (
                            <div className="text-center text-red-500 py-12">{error}</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {displayedProjects.map((project) => (
                                    <motion.div
                                        key={project.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="hover-lift"
                                    >
                                        <div className="group relative h-full">
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#89b4fa]/20 to-[#cba6f7]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                            <div className="relative backdrop-blur-xl bg-[#0D0911] rounded-3xl p-6 border border-[#45475a] transition-all duration-300 group-hover:border-[#cba6f7]/50 h-full flex flex-col">
                                                <h3 className="text-xl font-semibold mb-3 text-white">{project.title}</h3>
                                                <p className="text-[#cdd6f4] mb-4 text-sm line-clamp-2">{project.description}</p>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {project.tech.map((tech) => (
                                                        <span key={tech} className="px-3 py-1 bg-gray-700 rounded-full text-xs text-[#cdd6f4]">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between items-center mt-auto">
                                                    <div className="flex gap-4 text-sm text-[#a6adc8]">
                                                        <span className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 text-[#cba6f7]" /> {project.stats.stars}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <GitFork className="w-4 h-4 text-[#cba6f7]" /> {project.stats.forks}
                                                        </span>
                                                    </div>
                                                    <a
                                                        href={project.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 text-[#a6adc8] hover:text-purple-400 transition-colors"
                                                        aria-label={`View ${project.title} on GitHub`}
                                                    >
                                                        <ExternalLink className="w-5 h-5 text-[#cba6f7]" />
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
                        Pull up for Github Overview
                    </p>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                        className="w-8 h-1.5 sm:w-12 sm:h-2 bg-gray-500 rounded-full"
                    ></motion.div>
                </div>
            </motion.div>
        </div>
    )
}