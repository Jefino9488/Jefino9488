import { motion } from "framer-motion"
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
                <div className="h-8 w-8 mr-2 mt-1 hidden sm:flex items-center justify-center rounded-xl bg-primary/10 border border-primary/30 flex-shrink-0">
                    <img src="/profile/profile.png" alt="Jefino" className="rounded-lg object-cover w-full h-full p-0.5" />
                </div>
            )}
            <div
                className={`max-w-[85%] px-5 py-4 ${message.sender === "user"
                        ? "bg-primary/15 text-white border border-primary/30 rounded-2xl rounded-tr-sm shadow-[0_0_15px_-5px_rgba(102,111,188,0.3)]"
                        : "glass-crystal bg-[#0a0a0a]/60 text-[#b3bad9] border border-white/5 border-l-2 border-l-primary rounded-2xl rounded-tl-sm shadow-[0_0_15px_-5px_rgba(0,0,0,0.5)]"
                    }`}
            >
                {message.isMarkdown ? (
                    <div className="markdown-content font-mono text-[11px] sm:text-xs leading-relaxed tracking-wide">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw, rehypeSanitize]}
                            components={{
                                p: (props) => <p className="mb-3 last:mb-0" {...props} />,
                                a: (props) => (
                                    <a
                                        className="text-primary hover:text-primary/80 transition-colors border-b border-primary/30 hover:border-primary border-dashed"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        {...props}
                                    />
                                ),
                                ul: (props) => <ul className="list-none space-y-1 mb-3" {...props} />,
                                ol: (props) => <ol className="list-decimal pl-5 space-y-1 mb-3 text-primary/80" {...props} />,
                                li: (props) => {
                                    const parentTagName = (props.node as any)?.parent?.tagName
                                    return (
                                        <li className="flex items-start gap-2" {...props}>
                                            {parentTagName === 'ul' && (
                                                <span className="text-primary/50 mt-1.5 text-[8px]">▶</span>
                                            )}
                                            <span className={parentTagName === 'ul' ? 'flex-1' : ''}>{props.children}</span>
                                        </li>
                                    )
                                },
                                h1: (props) => <h1 className="text-sm font-bold mb-2 text-white uppercase tracking-widest border-b border-white/10 pb-1" {...props} />,
                                h2: (props) => <h2 className="text-xs font-bold mb-2 text-white/90 uppercase tracking-widest mt-4" {...props} />,
                                h3: (props) => <h3 className="text-xs font-bold mb-2 text-primary" {...props} />,
                                code: ({ inline, children, ...props }: { inline?: boolean; children?: React.ReactNode }) =>
                                    inline ? (
                                        <code className="bg-primary/10 border border-primary/20 text-primary px-1.5 py-0.5 rounded-md" {...props}>
                                            {children}
                                        </code>
                                    ) : (
                                        <code
                                            className="block bg-[#050505] border border-white/10 p-3 rounded-xl overflow-x-auto text-[#8ab8d0] my-3 shadow-inner"
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
                    <p className="text-[11px] sm:text-xs font-mono tracking-wide whitespace-pre-wrap leading-relaxed">{message.text}</p>
                )}
                <p className="text-[9px] font-mono tracking-widest uppercase opacity-50 mt-2 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
            </div>
            {message.sender === "user" && (
                <div className="h-8 w-8 ml-2 mt-1 hidden sm:flex items-center justify-center rounded-xl bg-primary/20 border border-primary/50 flex-shrink-0 text-[10px] font-mono text-primary uppercase font-bold tracking-widest shadow-[0_0_10px_-2px_rgba(102,111,188,0.5)]">
                    USR
                </div>
            )}
        </motion.div>
    )
}
