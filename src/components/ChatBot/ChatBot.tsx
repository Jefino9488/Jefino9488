import type React from "react"
import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Send, X, Loader2, Sparkles, ChevronDown, ChevronUp, Trash2, RefreshCw
} from "lucide-react"
import { useChat } from "@/components/ChatBot/ChatContext"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import CustomScrollbar from "./CustomScrollbar"
import ChatMessage from "./ChatMessage"
import "./markdown.css"

export default function ChatBot() {
    const {
        messages,
        suggestions,
        sendMessage,
        isChatOpen,
        toggleChat,
        isLoading,
        setIsChatOpen,
    } = useChat()

    const [input, setInput] = useState("")
    const [isMinimized, setIsMinimized] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    useEffect(() => {
        if (isChatOpen && !isMinimized) {
            setTimeout(() => {
                inputRef.current?.focus()
            }, 300)
        }
    }, [isChatOpen, isMinimized])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (isFullscreen) setIsFullscreen(false)
                else if (isChatOpen) setIsChatOpen(false)
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isFullscreen, isChatOpen, setIsChatOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim()) {
            sendMessage(input)
            setInput("")
        }
    }

    const handleSuggestionClick = (text: string) => {
        sendMessage(text)
    }

    const toggleMinimize = () => setIsMinimized(!isMinimized)
    const toggleFullscreen = () => setIsFullscreen(!isFullscreen)

    const clearChat = () => {
        localStorage.removeItem("chatMessages")
        window.location.reload()
    }

    if (!isChatOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    height: isMinimized ? "auto" : isFullscreen ? "100vh" : "500px",
                    width: isFullscreen ? "100vw" : "90%",
                    maxWidth: isFullscreen ? "100vw" : "450px",
                    bottom: isFullscreen ? 0 : "5rem",
                    right: isFullscreen ? 0 : "1rem",
                    borderRadius: isFullscreen ? 0 : "1rem",
                }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`fixed z-50 glass-crystal bg-[#0a0a0a]/95 border border-white/10 border-l-[3px] border-l-primary flex flex-col overflow-hidden shadow-[0_0_40px_-10px_rgba(102,111,188,0.5)] ${isFullscreen ? "inset-0" : "sm:right-8"
                    }`}
            >
                {/* Header */}
                <div className="bg-[#1e1a33]/80 p-4 flex justify-between items-center border-b border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
                    <div className="flex items-center relative z-10">
                        <Avatar className="h-10 w-10 mr-3 border border-primary/50 rounded-xl bg-primary/10 p-0.5">
                            <img src="/profile/profile.png" alt="Jefino" className="rounded-lg object-cover" />
                            <AvatarFallback className="rounded-lg bg-transparent text-primary font-mono text-xs">JT</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-white font-mono font-bold tracking-widest text-sm uppercase flex items-center gap-2">
                                SYS_ASSISTANT
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            </h3>
                            <p className="text-primary/70 font-mono text-[10px] uppercase tracking-widest mt-0.5">Status: Online // Query Ready</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1 relative z-10">
                        {!isMinimized && (
                            <>
                                <Button variant="ghost" size="icon" onClick={clearChat}
                                    className="text-muted-foreground hover:bg-white/5 hover:text-destructive h-8 w-8 rounded-lg"
                                    title="Clear chat history">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={toggleFullscreen}
                                    className="text-muted-foreground hover:bg-white/5 hover:text-white h-8 w-8 rounded-lg"
                                    title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                        <Button variant="ghost" size="icon" onClick={toggleMinimize}
                            className="text-muted-foreground hover:bg-white/5 hover:text-white h-8 w-8 rounded-lg"
                            title={isMinimized ? "Expand" : "Minimize"}>
                            {isMinimized ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={toggleChat}
                            className="text-muted-foreground hover:bg-white/5 hover:text-white h-8 w-8 rounded-lg"
                            title="Close">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Scrollable Message Section */}
                {!isMinimized && (
                    <div className="flex-1 overflow-hidden bg-transparent rounded-b-[1rem]">
                        <CustomScrollbar className="h-full rounded-b-[1rem]">
                            <div className="p-4 space-y-5 rounded-b-[1rem]">
                                {messages.map((msg, i) => (
                                    <ChatMessage key={msg.id} message={msg} index={i} />
                                ))}
                                {isLoading && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                                        <div className="h-8 w-8 mr-2 mt-1 hidden sm:flex items-center justify-center rounded-xl bg-primary/10 border border-primary/30 flex-shrink-0">
                                           <Sparkles className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="glass-crystal border-l-2 border-l-primary border border-white/5 bg-[#0a0a0a]/60 text-white rounded-2xl px-5 py-4 max-w-[85%] rounded-tl-sm shadow-[0_0_15px_-5px_rgba(102,111,188,0.2)]">
                                            <div className="flex items-center space-x-3">
                                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                                <p className="text-xs font-mono tracking-widest uppercase text-primary/80">Processing Payload...</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </CustomScrollbar>
                    </div>
                )}

                {/* Suggestions */}
                {!isMinimized && suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="px-4 py-3 border-t border-white/5 bg-[#0a0a0a]/90 backdrop-blur-md"
                    >
                        <div className="flex space-x-2 overflow-scroll hide-scrollbar">
                            {suggestions.map((s) => (
                                <motion.button
                                    key={s.id}
                                    onClick={() => handleSuggestionClick(s.text)}
                                    className="whitespace-nowrap px-3 py-1.5 bg-primary/5 hover:bg-primary/20 text-primary font-mono text-[10px] tracking-widest uppercase rounded-lg transition-colors flex-shrink-0 border border-primary/20 hover:border-primary/50 shadow-[0_0_10px_-5px_rgba(102,111,188,0.3)]"
                                    whileHover={{ scale: 1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    [{s.text}]
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Input */}
                {!isMinimized && (
                    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="p-3 border-t border-white/5 bg-[#0a0a0a]/95">
                        <div className="flex items-center bg-white/5 rounded-xl px-4 py-2 border border-white/10 transition-colors focus-within:border-primary/50 focus-within:shadow-[0_0_15px_-5px_rgba(102,111,188,0.3)]">
                            <Sparkles className="h-4 w-4 text-primary mr-3" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="ENTER_COMMAND..."
                                className="flex-1 bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none focus:ring-transparent focus:outline-transparent focus-visible:outline-none text-white placeholder:text-[#b3bad9]/40 font-mono text-xs uppercase tracking-wide"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!input.trim() || isLoading}
                                className={`${input.trim() && !isLoading
                                        ? "bg-primary text-primary-foreground shadow-[0_0_15px_-5px_rgba(102,111,188,0.8)]"
                                        : "bg-white/5 text-white/30"
                                    } hover:opacity-90 rounded-lg h-9 w-9 flex items-center justify-center transition-all duration-200`}
                            >
                                <Send className="h-4 w-4 ml-0.5" />
                            </Button>
                        </div>
                    </motion.form>
                )}
            </motion.div>
        </AnimatePresence>
    )
}
