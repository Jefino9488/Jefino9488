import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"

interface ChatMessageProps {
    message: {
        id: string
        text: string
        sender: "user" | "bot"
        timestamp: Date
        isMarkdown?: boolean
    }
    index: number
}

export default function ChatMessage({ message, index }: ChatMessageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
        >
            {message.sender === "bot" && (
                <Avatar className="h-8 w-8 mr-2 mt-1 hidden sm:inline-flex flex-shrink-0">
                    <AvatarImage src="/profile/profile.png" alt="Jefino" />
                    <AvatarFallback>JT</AvatarFallback>
                </Avatar>
            )}
            <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                        ? "bg-gradient-to-br from-[#cba6f7] to-[#f5c2e7] text-[#1e1e2e] rounded-tr-sm"
                        : "bg-[#313244] text-[#cdd6f4] rounded-tl-sm"
                }`}
                style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)" }}
            >
                {message.isMarkdown ? (
                    <div className="markdown-content text-sm">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw, rehypeSanitize]}
                            components={{
                                p: (props) => <p className="mb-2 last:mb-0" {...props} />,
                                a: (props) => (
                                    <a
                                        className="text-[#89b4fa] hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        {...props}
                                    />
                                ),
                                ul: (props) => <ul className="list-disc pl-5 mb-2" {...props} />,
                                ol: (props) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                                li: (props) => <li className="mb-1" {...props} />,
                                h1: (props) => <h1 className="text-lg font-bold mb-2" {...props} />,
                                h2: (props) => <h2 className="text-md font-bold mb-2" {...props} />,
                                h3: (props) => <h3 className="text-sm font-bold mb-2" {...props} />,
                                code: ({ inline, children, ...props }: { inline?: boolean; children?: React.ReactNode }) =>
                                    inline ? (
                                        <code className="bg-[#1e1e2e] px-1 py-0.5 rounded text-[#f5c2e7]" {...props}>
                                            {children}
                                        </code>
                                    ) : (
                                        <code
                                            className="block bg-[#1e1e2e] p-2 rounded overflow-x-auto text-[#f5c2e7] my-2"
                                            style={{ fontSize: "0.85em" }}
                                            {...props}
                                        >
                                            {children}
                                        </code>
                                    ),

                                pre: (props) => <pre className="my-2 overflow-x-auto" {...props} />,
                            }}
                        >
                            {message.text}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                )}
                <p className="text-xs opacity-70 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
            </div>
            {message.sender === "user" && (
                <Avatar className="h-8 w-8 ml-2 mt-1 hidden sm:inline-flex flex-shrink-0">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="You" />
                    <AvatarFallback>You</AvatarFallback>
                </Avatar>
            )}
        </motion.div>
    )
}
