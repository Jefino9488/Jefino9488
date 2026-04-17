import { useParams, Link } from "react-router-dom"
import {
    ArrowLeft,
    ExternalLink,
    Github,
    Star,
    GitFork,
    Calendar,
    Code2,
    Globe,
    Tag,
    Eye,
} from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useProjects } from "./ProjectsContext"
import PageHeader from "./PageHeader"

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN

interface RepoDetail {
    name: string
    description: string
    stargazers_count: number
    forks_count: number
    open_issues_count: number
    watchers_count: number
    language: string
    license: { name: string } | null
    homepage: string | null
    created_at: string
    updated_at: string
    pushed_at: string
    topics: string[]
    html_url: string
    visibility: string
    default_branch: string
}

interface ReadmeData {
    content: string
}

export default function ProjectDetail() {
    const { name } = useParams<{ name: string }>()
    const { allProjects, pinnedProjects } = useProjects()
    const [repoDetail, setRepoDetail] = useState<RepoDetail | null>(null)
    const [readmeContent, setReadmeContent] = useState<string>("")
    const [loadingDetail, setLoadingDetail] = useState(true)
    const [readmeLoading, setReadmeLoading] = useState(true)

    // Find project from context (for tech/link fallback)
    const project = [...pinnedProjects, ...allProjects].find(
        (p) => p.title.toLowerCase() === name?.toLowerCase()
    )

    useEffect(() => {
        if (!name) return

        // Fetch detailed repo info from REST API
        const fetchDetail = async () => {
            setLoadingDetail(true)
            try {
                const headers: Record<string, string> = {
                    Accept: "application/vnd.github+json",
                }
                if (GITHUB_TOKEN) headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`

                const res = await fetch(`https://api.github.com/repos/Jefino9488/${name}`, { headers })
                if (res.ok) {
                    const data = await res.json()
                    setRepoDetail(data)
                }
            } catch (e) {
                console.error("Failed to fetch repo detail", e)
            } finally {
                setLoadingDetail(false)
            }
        }

        // Fetch README
        const fetchReadme = async () => {
            setReadmeLoading(true)
            try {
                const headers: Record<string, string> = {
                    Accept: "application/vnd.github+json",
                }
                if (GITHUB_TOKEN) headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`

                const res = await fetch(`https://api.github.com/repos/Jefino9488/${name}/readme`, { headers })
                if (res.ok) {
                    const data: ReadmeData = await res.json()
                    // Base64 decode
                    const decoded = atob(data.content.replace(/\n/g, ""))
                    setReadmeContent(decoded)
                } else {
                    setReadmeContent("")
                }
            } catch {
                setReadmeContent("")
            } finally {
                setReadmeLoading(false)
            }
        }

        fetchDetail()
        fetchReadme()
    }, [name])

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })

    // Parse README into sections for a blog-like layout
    const renderReadme = (content: string) => {
        if (!content) return null
        const lines = content.split("\n")
        const elements: React.ReactNode[] = []
        let inCodeBlock = false
        let codeLines: string[] = []
        let codeLang = ""

        lines.forEach((line, idx) => {
            if (line.startsWith("```")) {
                if (!inCodeBlock) {
                    inCodeBlock = true
                    codeLang = line.slice(3).trim()
                    codeLines = []
                } else {
                    inCodeBlock = false
                    elements.push(
                        <div key={idx} className="relative my-6 rounded-xl overflow-hidden border border-white/10">
                            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{codeLang || "code"}</span>
                            </div>
                            <pre className="p-4 overflow-x-auto text-sm text-foreground/90 bg-black/30">
                                <code>{codeLines.join("\n")}</code>
                            </pre>
                        </div>
                    )
                }
                return
            }

            if (inCodeBlock) {
                codeLines.push(line)
                return
            }

            if (line.startsWith("# ")) {
                // skip H1 (same as repo name)
            } else if (line.startsWith("## ")) {
                elements.push(
                    <h2 key={idx} className="text-xl sm:text-2xl font-poppins font-semibold text-foreground mt-10 mb-4 pb-2 border-b border-white/5">
                        {line.slice(3)}
                    </h2>
                )
            } else if (line.startsWith("### ")) {
                elements.push(
                    <h3 key={idx} className="text-lg font-semibold text-primary mt-6 mb-3">
                        {line.slice(4)}
                    </h3>
                )
            } else if (line.startsWith("#### ")) {
                elements.push(
                    <h4 key={idx} className="text-base font-semibold text-foreground/90 mt-4 mb-2">
                        {line.slice(5)}
                    </h4>
                )
            } else if (line.match(/^[-*+] /)) {
                elements.push(
                    <li key={idx} className="text-[#b3bad9] text-sm leading-relaxed ml-4 list-disc">
                        {line.slice(2)}
                    </li>
                )
            } else if (line.match(/^\d+\. /)) {
                elements.push(
                    <li key={idx} className="text-[#b3bad9] text-sm leading-relaxed ml-4 list-decimal">
                        {line.replace(/^\d+\. /, "")}
                    </li>
                )
            } else if (line.startsWith("> ")) {
                elements.push(
                    <blockquote key={idx} className="border-l-4 border-primary/40 pl-4 my-4 text-muted-foreground italic">
                        {line.slice(2)}
                    </blockquote>
                )
            } else if (line.startsWith("---") || line.startsWith("===")) {
                elements.push(<hr key={idx} className="border-white/5 my-6" />)
            } else if (line.trim() === "") {
                elements.push(<div key={idx} className="h-2" />)
            } else {
                // Normal paragraph — strip inline markdown links/badges
                const cleaned = line
                    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // remove images/badges
                    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // convert links to text
                    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold → plain
                    .replace(/`([^`]+)`/g, "$1") // inline code → plain
                    .trim()
                if (cleaned) {
                    elements.push(
                        <p key={idx} className="text-[#b3bad9] text-sm sm:text-base leading-relaxed">
                            {cleaned}
                        </p>
                    )
                }
            }
        })

        return elements
    }

    return (
        <div className="min-h-screen text-foreground relative selection:bg-primary/30">
            <PageHeader 
                title={name || "Project"}
                backTo="/projects"
                backLabel="PROJECTS"
                rightAction={
                    <a
                        href={repoDetail?.html_url || project?.link || `https://github.com/Jefino9488/${name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[10px] sm:text-xs bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary font-mono uppercase tracking-widest px-3 sm:px-4 py-1.5 rounded-full transition-all whitespace-nowrap"
                    >
                        <Github className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Source</span>
                        <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                    </a>
                }
            />

            <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
                {/* Hero Block */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10"
                >
                    {/* Tinted banner */}
                    <div className="h-48 sm:h-64 glass-crystal rounded-2xl overflow-hidden relative mb-8 border border-white/5">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-primary/5 to-[#8ab8d0]/10" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Github className="w-24 h-24 sm:w-32 sm:h-32 text-primary/10" />
                        </div>
                        <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                            <div className="flex items-center gap-2 mb-1">
                                {repoDetail?.visibility && (
                                    <span className="text-[10px] font-mono text-primary/80 uppercase tracking-widest px-2 py-0.5 bg-primary/10 rounded-md border border-primary/20">
                                        {repoDetail.visibility}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl sm:text-4xl font-poppins font-semibold text-foreground">
                                {name}
                            </h2>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-[#b3bad9] text-base sm:text-lg leading-relaxed mb-8">
                        {repoDetail?.description || project?.description || "A GitHub repository."}
                    </p>

                    {/* Stats Row */}
                    {!loadingDetail && repoDetail && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                            {[
                                { icon: Star, label: "Stars", value: repoDetail.stargazers_count, color: "text-amber-500" },
                                { icon: GitFork, label: "Forks", value: repoDetail.forks_count, color: "text-blue-400" },
                                { icon: Eye, label: "Watchers", value: repoDetail.watchers_count, color: "text-[#8ab8d0]" },
                                { icon: Code2, label: "Issues", value: repoDetail.open_issues_count, color: "text-primary" },
                            ].map(({ icon: Icon, label, value, color }) => (
                                <div key={label} className="glass-crystal rounded-xl p-4 flex flex-col items-center justify-center border border-white/5 hover:border-white/10 transition-colors">
                                    <Icon className={`w-5 h-5 mb-2 ${color}`} />
                                    <span className="text-xl font-poppins font-light text-foreground">{value}</span>
                                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-muted-foreground font-mono mb-8">
                        {repoDetail?.language && (
                            <div className="flex items-center gap-1.5">
                                <Code2 className="w-3.5 h-3.5 text-primary" />
                                {repoDetail.language}
                            </div>
                        )}
                        {repoDetail?.created_at && (
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-primary" />
                                Created {formatDate(repoDetail.created_at)}
                            </div>
                        )}
                        {repoDetail?.updated_at && (
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-[#8ab8d0]" />
                                Updated {formatDate(repoDetail.updated_at)}
                            </div>
                        )}
                        {repoDetail?.homepage && (
                            <a
                                href={repoDetail.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-primary hover:underline"
                            >
                                <Globe className="w-3.5 h-3.5" />
                                Live Demo
                            </a>
                        )}
                        {repoDetail?.license && (
                            <div className="flex items-center gap-1.5">
                                <Tag className="w-3.5 h-3.5 text-primary" />
                                {repoDetail.license.name}
                            </div>
                        )}
                    </div>

                    {/* Topics / Tech Tags */}
                    {(repoDetail?.topics?.length || project?.tech?.length) ? (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {(repoDetail?.topics?.length ? repoDetail.topics : project?.tech ?? []).map((tag) => (
                                <span key={tag} className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-mono text-primary uppercase tracking-wider">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    ) : null}

                    {/* Divider */}
                    <hr className="border-white/5 mb-10" />

                    {/* README Content */}
                    <div>
                        <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="h-px flex-grow bg-white/5" />
                            README
                            <span className="h-px flex-grow bg-white/5" />
                        </h2>

                        {readmeLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary border-b-2 opacity-60" />
                            </div>
                        ) : readmeContent ? (
                            <div className="prose max-w-none space-y-1">
                                {renderReadme(readmeContent)}
                            </div>
                        ) : (
                            <div className="text-center py-16 text-muted-foreground">
                                <Code2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                <p className="text-sm">No README available for this repository.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                    <Link to="/projects" className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-mono uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Projects
                    </Link>
                    <a
                        href={repoDetail?.html_url || project?.link || `https://github.com/Jefino9488/${name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-primary hover:bg-white text-primary-foreground hover:text-black font-semibold px-6 py-3 rounded-full transition-all text-sm shadow-[0_0_20px_-5px_rgba(102,111,188,0.5)]"
                    >
                        <Github className="w-4 h-4" />
                        Open Repository
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    </a>
                </motion.div>
            </div>
        </div>
    )
}
