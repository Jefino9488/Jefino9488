import type React from "react"
import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Send, X, Loader2, Sparkles, ChevronDown, ChevronUp, Trash2, RefreshCw
} from "lucide-react"
import { useChat } from "@/components/ChatBot/ChatContext"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
                className={`fixed z-50 bg-card border border-border flex flex-col overflow-hidden ${isFullscreen ? "inset-0" : "sm:right-8"
                    }`}
                style={{
                    boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
                }}
            >
                {/* Header */}
                <div className="bg-secondary/50 p-4 flex justify-between items-center border-b border-border">
                    <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3 border-2 border-primary">
                            <AvatarImage src="/profile/profile.png" alt="Jefino" />
                            <AvatarFallback>JT</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-foreground font-medium">Jefino's Assistant</h3>
                            <p className="text-muted-foreground text-xs">Ask me anything about Jefino</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1">
                        {!isMinimized && (
                            <>
                                <Button variant="ghost" size="icon" onClick={clearChat}
                                    className="text-muted-foreground hover:bg-secondary hover:text-destructive h-8 w-8"
                                    title="Clear chat history">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={toggleFullscreen}
                                    className="text-muted-foreground hover:bg-secondary hover:text-foreground h-8 w-8"
                                    title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                        <Button variant="ghost" size="icon" onClick={toggleMinimize}
                            className="text-muted-foreground hover:bg-secondary hover:text-foreground h-8 w-8"
                            title={isMinimized ? "Expand" : "Minimize"}>
                            {isMinimized ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={toggleChat}
                            className="text-muted-foreground hover:bg-secondary hover:text-foreground h-8 w-8"
                            title="Close">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Scrollable Message Section */}
                {!isMinimized && (
                    <div className="flex-1 overflow-hidden bg-background rounded-b-[1rem]">
                        <CustomScrollbar className="h-full rounded-b-[1rem]">
                            <div className="p-4 space-y-4 rounded-b-[1rem]">
                                {messages.map((msg, i) => (
                                    <ChatMessage key={msg.id} message={msg} index={i} />
                                ))}
                                {isLoading && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                                        <Avatar className="h-8 w-8 mr-2 mt-1 hidden sm:inline-flex flex-shrink-0">
                                            <AvatarImage src="/profile/profile.png" alt="Jefino" />
                                            <AvatarFallback>JT</AvatarFallback>
                                        </Avatar>
                                        <div className="bg-secondary text-foreground rounded-2xl px-4 py-3 max-w-[85%] rounded-tl-sm">
                                            <div className="flex items-center space-x-2">
                                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                                <p className="text-sm">Thinking...</p>
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
                        className="p-3 border-t border-border bg-card/90"
                    >
                        <div className="flex space-x-2 overflow-scroll hide-scrollbar">
                            {suggestions.map((s) => (
                                <motion.button
                                    key={s.id}
                                    onClick={() => handleSuggestionClick(s.text)}
                                    className="whitespace-nowrap px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground rounded-full text-sm transition-colors flex-shrink-0 border border-border hover:border-primary"
                                    whileHover={{ scale: 1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {s.text}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                )}

                {/* Input */}
                {!isMinimized && (
                    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onSubmit={handleSubmit}
                        className="p-3 border-t border-border bg-card">
                        <div className="flex items-center bg-secondary/50 rounded-full px-4 py-2 border border-border transition-colors">
                            <Sparkles className="h-4 w-4 text-muted-foreground mr-2" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none focus:ring-transparent focus:outline-transparent focus-visible:outline-none text-foreground placeholder-muted-foreground text-sm"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!input.trim() || isLoading}
                                className={`${input.trim() && !isLoading
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-secondary text-muted-foreground"
                                    } hover:opacity-90 rounded-full h-8 w-8 flex items-center justify-center transition-all duration-200`}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </motion.form>
                )}
            </motion.div>
        </AnimatePresence>
    )
}
