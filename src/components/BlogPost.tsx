import { useParams, Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, Copy, Check } from "lucide-react"
import { motion } from "framer-motion"
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
        <div className="relative bg-card rounded-lg my-4 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-muted/50">
                <span className="text-sm font-medium text-muted-foreground">Code</span>
                <button
                    onClick={() => handleCopy(code, -1)}
                    aria-label="Copy entire code"
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    {copiedLines[-1] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
            </div>
            <div className="p-4 overflow-x-auto">
                <pre className="text-sm text-foreground">
                    <code>
                        {code.split("\n").map((line, index) => (
                            <div key={index} className="group flex">
                                <span className="mr-4 text-muted-foreground select-none">{index + 1}</span>
                                <span>{line}</span>
                                <button
                                    onClick={() => handleCopy(line, index)}
                                    aria-label={`Copy line ${index + 1}`}
                                    className="ml-2 text-gray-400 hover:text-white hidden group-hover:inline"
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
    <div className="min-h-screen bg-background flex items-center justify-center text-foreground p-4">
        <Card className="w-full max-w-md bg-card border-none text-card-foreground rounded-2xl shadow-lg">
            <CardContent className="p-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4">Post not found</h1>
                <Link to="/blog">
                    <Button
                        variant="ghost"
                        className="w-full justify-center hover:bg-gray-700 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" /> Back to Blog
                    </Button>
                </Link>
            </CardContent>
        </Card>
    </div>
)

export default function BlogPost() {
    const { id } = useParams<{ id: string }>()
    const [post, setPost] = useState<any | null>(null)

    useEffect(() => {
        const loadPost = async () => {
            const postId = Number(id)
            if (isNaN(postId) || !blogPosts[postId]) {
                setPost(null)
                return
            }
            const loadedPost = await blogPosts[postId]()
            setPost(loadedPost.default)
        }

        loadPost()
    }, [id])

    if (!post) {
        return <CardNotFound />
    }

    return (
        <div className="min-h-screen bg-background py-8 sm:py-16 text-foreground">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <Link to="/blog">
                        <Button variant="ghost" className="mb-8 hover:bg-secondary hover:text-foreground transition-colors">
                            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Blogs
                        </Button>
                    </Link>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Card className="bg-card border-none text-card-foreground rounded-2xl shadow-lg overflow-hidden">
                            {post.coverImage && (
                                <div className="w-full overflow-hidden">
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="w-full h-48 sm:h-64 object-cover"
                                    />
                                </div>
                            )}
                            <CardHeader className="bg-muted/30 border-b border-border p-6 sm:p-8">
                                <CardTitle className="text-2xl sm:text-4xl font-bold mb-4 text-primary">{post.title}</CardTitle>
                                <div className="flex flex-wrap items-center text-sm text-muted-foreground">
                                    <div className="flex items-center mr-4 mb-2 sm:mb-0">
                                        <Calendar className="mr-2 h-4 w-4 text-primary" />
                                        <span>{post.date}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="mr-2 h-4 w-4 text-primary" />
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 sm:p-8 space-y-6 sm:space-y-8">
                                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{post.content.introduction}</p>
                                {post.content.sections.map((section: any, index: number) => (
                                    <div key={index} className="mb-6">
                                        {section.title && <h2 className="text-2xl font-bold mb-2 text-primary">{section.title}</h2>}
                                        {section.content && <p className="text-muted-foreground mb-4">{section.content}</p>}
                                        {(section.image || section.img_url) && (
                                            <div className="my-4">
                                                <img src={section.image || section.img_url} alt={section.title || "Section image"} className="w-full rounded-lg" />
                                                {(section.caption || section.img_description) && <p className="text-sm text-muted-foreground mt-2 text-center">{section.caption || section.img_description}</p>}
                                            </div>
                                        )}
                                        {section.list && (
                                            <ul className="list-disc pl-6 space-y-2">
                                                {section.list.map((item: string, i: number) => (
                                                    <li key={i} className="text-muted-foreground">{item}</li>
                                                ))}
                                            </ul>
                                        )}
                                        {section.code && <CodeBlock code={section.code} />}
                                        {section.externalLink && (
                                            <a
                                                href={section.externalLink.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                            >
                                                {section.externalLink.label}
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                    <polyline points="15 3 21 3 21 9" />
                                                    <line x1="10" y1="14" x2="21" y2="3" />
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
