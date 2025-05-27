"use client"
import { motion } from "framer-motion"
import { MessageCircle, Sparkles } from "lucide-react"
import { useChat } from "@/components/ChatBot/ChatContext.tsx"

export default function FloatingActionButton() {
    const { toggleChat } = useChat()

    return (
        <motion.button
            onClick={toggleChat}
            className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 bg-gradient-to-r from-[#cba6f7] to-[#f5c2e7] text-[#1e1e2e] rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
            }}
        >
            <div className="relative flex items-center justify-center">
                <MessageCircle className="h-6 w-6" />
                <motion.div
                    className="absolute -top-1.5 -right-1.5"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop",
                    }}
                >
                    <Sparkles className="h-3.5 w-3.5 text-[#1e1e2e]" />
                </motion.div>
            </div>
        </motion.button>
    )
}
