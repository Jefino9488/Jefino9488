"use client"
import { motion } from "framer-motion"
import { MessageCircle, Sparkles } from "lucide-react"
import { useChat } from "@/components/ChatBot/ChatContext.tsx"

export default function FloatingActionButton() {
    const { toggleChat } = useChat()

    return (
        <motion.button
            onClick={toggleChat}
            className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 glass-crystal bg-[#0a0a0a]/80 border border-white/10 border-l-2 border-l-primary/60 text-primary rounded-2xl w-14 h-14 flex items-center justify-center shadow-[0_0_20px_-5px_rgba(102,111,188,0.5)] hover:shadow-[0_0_30px_-5px_rgba(102,111,188,0.8)] transition-all duration-300 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
            <div className="relative flex items-center justify-center">
                <MessageCircle className="h-6 w-6 group-hover:text-white transition-colors duration-300" />
                <motion.div
                    className="absolute -top-1.5 -right-1.5"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop",
                    }}
                >
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                </motion.div>
            </div>
        </motion.button>
    )
}
