import { useParams, Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, Copy, Check } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

const blogPosts = [() => import("@/blogPosts/post1.json"), () => import("@/blogPosts/post2.json")]

const CodeBlock = ({ code }: { code: string }) => {
    const [copiedLines, setCopiedLines] = useState<Record<number, boolean>>({})

    const handleCopy = (line: string, index: number) => {
        navigator.clipboard.writeText(line).then(() => {
            setCopiedLines((prev) => ({ ...prev, [index]: true }))
            setTimeout(() => setCopiedLines((prev) => ({ ...prev, [index]: false })), 2000)
        })
    }

    return (
        <div className="relative bg-[#11111b] rounded-lg my-4 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-[#45475a]">
                <span className="text-sm font-medium text-gray-200">Code</span>
                <button
                    onClick={() => handleCopy(code, -1)}
                    aria-label="Copy entire code"
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    {copiedLines[-1] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
            </div>
            <div className="p-4 overflow-x-auto">
        <pre className="text-sm text-gray-200">
          <code>
            {code.split("\n").map((line, index) => (
                <div key={index} className="group flex">
                    <span className="mr-4 text-gray-500 select-none">{index + 1}</span>
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

const renderTitle = (title: string, level: 1 | 2 | 3 | 4 | 5 | 6) => {
    const baseClasses = "font-bold mb-4 text-[#f5c2e7]"
    const sizes: { [key: number]: string } = {
        1: "text-4xl sm:text-5xl",
        2: "text-3xl sm:text-4xl",
        3: "text-2xl sm:text-3xl",
        4: "text-xl sm:text-2xl",
        5: "text-lg sm:text-xl",
        6: "text-base sm:text-lg",
    }
    const Tag = `h${level}` as keyof JSX.IntrinsicElements
    return <Tag className={`${baseClasses} ${sizes[level]}`}>{title}</Tag>
}

const CardNotFound = () => (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white p-4">
        <Card className="w-full max-w-md bg-gray-800 border-none text-white rounded-2xl shadow-lg">
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
            if (isNaN(postId) || postId < 1 || postId > blogPosts.length) {
                setPost(null)
                return
            }
            const loadedPost = await blogPosts[postId - 1]()
            setPost(loadedPost.default)
        }

        loadPost()
    }, [id])

    if (!post) {
        return <CardNotFound />
    }

    return (
        <div className="min-h-screen bg-[#11111b] py-8 sm:py-16 text-[#cdd6f4]">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <Link to="/blog">
                        <Button variant="ghost" className="mb-8 hover:bg-[#45475a] hover:text-[#cdd6f4] transition-colors">
                            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Blogs
                        </Button>
                    </Link>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Card className="bg-[#1e1e2e] border-none text-[#cdd6f4] rounded-2xl shadow-lg overflow-hidden">
                            <CardHeader className="bg-[#313244] border-b border-[#313244] p-6 sm:p-8">
                                <CardTitle className="text-2xl sm:text-4xl font-bold mb-4 text-[#cba6f7]">{post.title}</CardTitle>
                                <div className="flex flex-wrap items-center text-sm text-gray-300">
                                    <div className="flex items-center mr-4 mb-2 sm:mb-0">
                                        <Calendar className="mr-2 h-4 w-4 text-[#89b4fa]" />
                                        <span>{post.date}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="mr-2 h-4 w-4 text-[#89b4fa]" />
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 sm:p-8 space-y-6 sm:space-y-8">
                                <p className="text-base sm:text-lg text-gray-300 leading-relaxed">{post.content.introduction}</p>
                                {post.content.sections.map((section: any, index: number) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.2 }}
                                    >
                                        {section.title && renderTitle(section.title, section.titleLevel || 2)}
                                        {section.content.map((para: string, i: number) => (
                                            <p key={i} className="mb-4 text-base sm:text-lg text-gray-300 leading-relaxed">
                                                {para}
                                            </p>
                                        ))}
                                        {section.code && <CodeBlock code={section.code} />}
                                        {Object.keys(section).map((key) => {
                                            if (key.startsWith("img_url")) {
                                                const imgNumber = key.replace("img_url", "")
                                                const descriptionKey = `img_description${imgNumber}`
                                                const description = section[descriptionKey] || "Image description not available."
                                                return (
                                                    <div key={key} className="my-4">
                                                        <img
                                                            src={section[key] || "/placeholder.svg"}
                                                            alt={section.title}
                                                            className="w-full rounded-lg"
                                                        />
                                                        <p className="text-sm text-gray-400 mt-2 text-center">{description}</p>
                                                    </div>
                                                )
                                            }
                                            return null
                                        })}
                                        {section.list && (
                                            <ul className="list-disc pl-6 space-y-2">
                                                {section.list.map((item: string, i: number) => (
                                                    <li key={i} className="text-base sm:text-lg text-gray-300 leading-relaxed">
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </motion.div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
