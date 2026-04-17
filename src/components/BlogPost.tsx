/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, Copy, Check, ExternalLink } from "lucide-react"
import PageHeader from "./PageHeader"
import { motion, useScroll, useSpring } from "framer-motion"
import { useState, useEffect } from "react"

// Map of post IDs to their import functions (for local documentation posts)
const blogPosts: Record<number, () => Promise<any>> = {
    3: () => import("@/blogPosts/post3.json"),
    4: () => import("@/blogPosts/post4.json")
}

const CodeBlock = ({ code }: { code: string }) => {
    const [copiedLines, setCopiedLines] = useState<Record<number, boolean>>({})

    const handleCopy = (line: string, index: number) => {
        navigator.clipboard.writeText(line).then(() => {
            setCopiedLines((prev) => ({ ...prev, [index]: true }))
            setTimeout(() => setCopiedLines((prev) => ({ ...prev, [index]: false })), 2000)
        })
    }

    return (
        <div className="relative bg-[#1e1a33]/40 backdrop-blur-md rounded-2xl my-8 overflow-hidden border border-white/10">
            <div className="flex items-center justify-between px-6 py-3 bg-[#1e1a33]/80 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-white/10" />
                    <div className="w-3 h-3 rounded-full bg-white/10" />
                    <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <button
                    onClick={() => handleCopy(code, -1)}
                    aria-label="Copy entire code"
                    className="flex items-center gap-2 text-xs font-mono text-[#b3bad9] hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md"
                >
                    {copiedLines[-1] ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedLines[-1] ? "COPIED" : "COPY"}
                </button>
            </div>
            <div className="p-6 overflow-x-auto">
                <pre className="text-sm font-mono text-[#b3bad9] leading-loose">
                    <code>
                        {code.split("\n").map((line, index) => (
                            <div key={index} className="group flex">
                                <span className="mr-6 text-white/20 select-none text-right w-6">{index + 1}</span>
                                <span>{line}</span>
                                <button
                                    onClick={() => handleCopy(line, index)}
                                    aria-label={`Copy line ${index + 1}`}
                                    className="ml-4 text-white/40 hover:text-white hidden group-hover:inline transition-colors"
                                >
                                    {copiedLines[index] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </button>
                            </div>
                        ))}
                    </code>
                </pre>
            </div>
        </div>
    )
}

const CardNotFound = () => (
    <div className="min-h-screen flex items-center justify-center text-foreground p-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
        <div className="text-center relative z-10 bg-white/5 backdrop-blur-xl p-12 rounded-[2rem] border border-white/10">
            <h1 className="text-3xl sm:text-4xl font-poppins font-bold mb-4 text-white">Post not found</h1>
            <p className="text-[#b3bad9] mb-8">The article you're looking for doesn't exist or has been moved.</p>
            <Link to="/blog">
                <Button className="rounded-full bg-white hover:bg-white/90 text-black px-8 py-6 font-semibold">
                    <ArrowLeft className="mr-2 h-5 w-5" /> Back to Blog
                </Button>
            </Link>
        </div>
    </div>
)

export default function BlogPost() {
    const { id } = useParams<{ id: string }>()
    const [post, setPost] = useState<any | null>(null)
    const [toc, setToc] = useState<{ id: string; title: string }[]>([])
    const [copyingPage, setCopyingPage] = useState(false)

    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    useEffect(() => {
        const loadPost = async () => {
            const postId = Number(id)
            if (isNaN(postId) || !blogPosts[postId]) {
                setPost(null)
                return
            }
            try {
                const loadedPost = await blogPosts[postId]()
                setPost(loadedPost.default || loadedPost)
            } catch (e) {
                console.error("Failed to load post", e)
                setPost(null)
            }
        }

        loadPost()
    }, [id])

    useEffect(() => {
        if (post && post.content?.sections) {
            const tocItems = post.content.sections
                .map((sec: any, index: number) => {
                    if (sec.title) return { id: `section-${index}`, title: sec.title }
                    return null
                })
                .filter(Boolean)
            setToc(tocItems as { id: string; title: string }[])
        }
    }, [post])

    const handleCopyPageUrl = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopyingPage(true)
            setTimeout(() => setCopyingPage(false), 2000)
        })
    }

    if (!post) {
        return <CardNotFound />
    }

    return (
        <div className="min-h-screen text-foreground relative selection:bg-primary/30 selection:text-white">
            <PageHeader 
                title={post.title}
                backTo="/blog"
                backLabel="JOURNAL"
                meta={`${post.reading_time_minutes} MIN`}
            />

            {/* Top Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-primary/80 origin-left z-[60]"
                style={{ scaleX }}
            />

            {/* Glowing Orbs */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
            <div className="fixed top-[40%] right-[-10%] w-[30%] h-[50%] rounded-full bg-[#8ab8d0]/5 blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-8 max-w-[1400px] py-24 sm:py-32">


                {/* Header Title Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12 max-w-4xl">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-poppins font-bold text-white mb-8 tracking-tight leading-[1.15]">
                        {post.title}
                    </h1>
                    <p className="text-[#b3bad9] text-xl sm:text-2xl leading-relaxed font-light">
                        {post.content?.introduction || post.excerpt}
                    </p>
                </motion.div>

                {/* Meta Information Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex flex-wrap items-center justify-between border-y border-white/10 py-6 mb-16 sm:mb-24 gap-6"
                >
                    <div className="flex flex-wrap gap-8 sm:gap-16">
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] uppercase tracking-widest font-mono text-[#b3bad9]/50">Published</span>
                            <div className="flex items-center gap-2 text-sm text-white/90 font-medium font-mono">
                                <Calendar className="w-3.5 h-3.5 text-primary/80" />
                                {post.date}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] uppercase tracking-widest font-mono text-[#b3bad9]/50">Last Updated</span>
                            <div className="flex items-center gap-2 text-sm text-white/90 font-medium font-mono">
                                <Calendar className="w-3.5 h-3.5 text-[#8ab8d0]/80" />
                                {post.date} {/* Currently no distinct update date, use publish date */}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] uppercase tracking-widest font-mono text-[#b3bad9]/50">Read Time</span>
                            <div className="flex items-center gap-2 text-sm text-white/90 font-medium font-mono">
                                <Clock className="w-3.5 h-3.5 text-[#8ab8d0]/80" />
                                {post.readTime}
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleCopyPageUrl}
                        className="rounded-full bg-white/5 border-white/5 hover:bg-white/10 text-xs gap-2 font-mono"
                    >
                        {copyingPage ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-[#b3bad9]" />}
                        {copyingPage ? "COPIED URL" : "COPY PAGE URL"}
                    </Button>
                </motion.div>

                     {/* Main Content Layout */}
                <div className="flex flex-col lg:flex-row gap-12 sm:gap-16 relative">
                    {/* Main Article */}
                    <article className="flex-1 w-full max-w-[850px]">
                        {post.coverImage && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                                className="mb-16 rounded-[2rem] overflow-hidden border border-white/5 relative aspect-[16/9] sm:aspect-[21/9]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent z-10" />
                                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover relative z-0" />
                            </motion.div>
                        )}

                        <div className="space-y-16">
                            {post.content?.sections?.map((section: any, index: number) => (
                                <motion.section
                                    key={index}
                                    id={`section-${index}`}
                                    className="scroll-mt-32 border-b border-white/5 pb-16 last:border-0 last:pb-0"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {section.title && (
                                        <div className="flex flex-col mb-8">
                                            <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#8ab8d0]/80 mb-3">{String(index + 1).padStart(2, '0')}.</span>
                                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-poppins text-white leading-tight tracking-tight">{section.title}</h2>
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        {section.content && (
                                            Array.isArray(section.content)
                                                ? section.content.map((para: string, i: number) => (
                                                    <p key={i} className="text-[#b3bad9] text-[17px] sm:text-[19px] leading-[1.8] font-inter font-light">{para}</p>
                                                ))
                                                : <p className="text-[#b3bad9] text-[17px] sm:text-[19px] leading-[1.8] font-inter font-light">{section.content}</p>
                                        )}
                                    </div>

                                    {(section.image || section.img_url) && (
                                        <figure className="my-12 flex flex-col">
                                            <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
                                                <img src={section.image || section.img_url} alt={section.title || "Section image"} className="w-full h-auto rounded-2xl" />
                                            </div>
                                            {(section.caption || section.img_description) && (
                                                <figcaption className="mt-4 text-xs font-mono text-[#b3bad9]/60 flex items-center justify-center gap-2">
                                                    <span className="w-4 h-px bg-white/20" />
                                                    {section.caption || section.img_description}
                                                    <span className="w-4 h-px bg-white/20" />
                                                </figcaption>
                                            )}
                                        </figure>
                                    )}

                                    {section.list && (
                                        <ul className="flex flex-col gap-4 my-8 pl-2">
                                            {section.list.map((item: string, i: number) => (
                                                <li key={i} className="text-[#b3bad9] text-[17px] sm:text-[19px] leading-relaxed font-light flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                                    <span className="text-primary/60 mt-1.5 text-xs flex-shrink-0">◆</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {section.code && <CodeBlock code={section.code} />}

                                    {section.externalLink && (
                                        <div className="mt-8">
                                            <a
                                                href={section.externalLink.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-3 px-6 py-3.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary rounded-full transition-all text-sm font-medium"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                {section.externalLink.label}
                                            </a>
                                        </div>
                                    )}
                                </motion.section>
                            ))}
                        </div>
                    </article>

                    {/* Table of Contents - Right Sidebar */}
                    <aside className="hidden lg:block w-[300px] flex-shrink-0">
                        <div className="sticky top-32 glass-crystal p-6 rounded-2xl border-0 border-l-[3px] border-l-primary/30 shadow-none bg-white/[0.02]">
                            <h3 className="text-xs uppercase tracking-widest font-mono text-white/80 mb-6 flex items-center gap-3">
                                <Copy className="w-3.5 h-3.5 text-primary" /> On this page
                            </h3>
                            <ul className="flex flex-col gap-1 relative">
                                {/* Decorative line behind TOC list */}
                                <div className="absolute left-[3px] top-2 bottom-2 w-px bg-white/5" />

                                {toc.map((item, index) => (
                                    <li key={item.id} className="relative">
                                        <a
                                            href={`#${item.id}`}
                                            className="block py-2.5 pl-5 text-sm font-light tracking-wide text-[#b3bad9] hover:text-white transition-colors relative group"
                                        >
                                            {/* Hover dot */}
                                            <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <span className="mr-2 text-[10px] font-mono text-[#b3bad9]/40">{String(index + 1).padStart(2, '0')}.</span>
                                            {item.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
