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
                className={`fixed z-50 bg-[#1e1e2e] border border-[#313244] flex flex-col overflow-hidden ${
                    isFullscreen ? "inset-0" : "sm:right-8"
                }`}
                style={{
                    boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
                }}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#313244] to-[#45475a] p-4 flex justify-between items-center border-b border-[#45475a]">
                    <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3 border-2 border-[#cba6f7]">
                            <AvatarImage src="https://avatars.githubusercontent.com/u/89455522?v=4" alt="Jefino" />
                            <AvatarFallback>JT</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-[#f5c2e7] font-medium">Jefino's Assistant</h3>
                            <p className="text-[#a6adc8] text-xs">Ask me anything about Jefino</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-1">
                        {!isMinimized && (
                            <>
                                <Button variant="ghost" size="icon" onClick={clearChat}
                                        className="text-[#cdd6f4] hover:bg-[#45475a] hover:text-[#f38ba8] h-8 w-8"
                                        title="Clear chat history">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={toggleFullscreen}
                                        className="text-[#cdd6f4] hover:bg-[#45475a] hover:text-[#f5c2e7] h-8 w-8"
                                        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                        <Button variant="ghost" size="icon" onClick={toggleMinimize}
                                className="text-[#cdd6f4] hover:bg-[#45475a] hover:text-[#f5c2e7] h-8 w-8"
                                title={isMinimized ? "Expand" : "Minimize"}>
                            {isMinimized ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={toggleChat}
                                className="text-[#cdd6f4] hover:bg-[#45475a] hover:text-[#f5c2e7] h-8 w-8"
                                title="Close">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Scrollable Message Section */}
                {!isMinimized && (
                    <div className="flex-1 overflow-hidden bg-[#181825] rounded-b-[1rem]">
                        <CustomScrollbar className="h-full rounded-b-[1rem]">
                            <div className="p-4 space-y-4 rounded-b-[1rem]">
                                {messages.map((msg, i) => (
                                    <ChatMessage key={msg.id} message={msg} index={i} />
                                ))}
                                {isLoading && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                                        <Avatar className="h-8 w-8 mr-2 mt-1 hidden sm:inline-flex flex-shrink-0">
                                            <AvatarImage src="https://avatars.githubusercontent.com/u/89455522?v=4" alt="Jefino" />
                                            <AvatarFallback>JT</AvatarFallback>
                                        </Avatar>
                                        <div className="bg-[#313244] text-[#cdd6f4] rounded-2xl px-4 py-3 max-w-[85%] rounded-tl-sm">
                                            <div className="flex items-center space-x-2">
                                                <Loader2 className="h-4 w-4 animate-spin text-[#cba6f7]" />
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
                        className="p-3 border-t border-[#313244] bg-[#1e1e2e]/90"
                    >
                        <div className="flex space-x-2 overflow-scroll hide-scrollbar">
                            {suggestions.map((s) => (
                                <motion.button
                                    key={s.id}
                                    onClick={() => handleSuggestionClick(s.text)}
                                    className="whitespace-nowrap px-3 py-1.5 bg-[#313244] hover:bg-[#45475a] text-[#cdd6f4] rounded-full text-sm transition-colors flex-shrink-0 border border-[#45475a] hover:border-[#cba6f7]"
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
                                 className="p-3 border-t border-[#313244] bg-[#1e1e2e]">
                        <div className="flex items-center bg-[#313244] rounded-full px-4 py-2 border border-[#45475a]  transition-colors">
                            <Sparkles className="h-4 w-4 text-[#a6adc8] mr-2" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none focus:ring-transparent focus:outline-transparent focus-visible:outline-none text-[#cdd6f4] placeholder-[#a6adc8] text-sm"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!input.trim() || isLoading}
                                className={`${
                                    input.trim() && !isLoading
                                        ? "bg-gradient-to-r from-[#cba6f7] to-[#f5c2e7]"
                                        : "bg-[#45475a]"
                                } hover:opacity-90 text-[#1e1e2e] rounded-full h-8 w-8 flex items-center justify-center transition-all duration-200`}
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
