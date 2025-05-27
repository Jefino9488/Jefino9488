import type React from "react";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { GoogleGenAI } from "@google/genai";
import { resumeText } from "@/components/ChatBot/Context/resume-context.ts";

type Message = {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
    isMarkdown?: boolean;
};

type SuggestionChip = {
    id: string;
    text: string;
};

type ChatContextType = {
    messages: Message[];
    suggestions: SuggestionChip[];
    addMessage: (text: string, sender: "user" | "bot", isMarkdown?: boolean) => void;
    sendMessage: (text: string) => Promise<void>;
    isChatOpen: boolean;
    toggleChat: () => void;
    isLoading: boolean;
    setIsChatOpen: (isOpen: boolean) => void;
};

const defaultSuggestions: SuggestionChip[] = [
    { id: "1", text: "What projects have you worked on?" },
    { id: "2", text: "What are your skills?" },
    { id: "3", text: "What is the candidate's certificates?" },
    { id: "4", text: "Tell me about yourself" },
    { id: "5", text: "How can I contact you?" },
];

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "0",
            text: "👋 Hi there! I'm Jefino's virtual assistant. How can I help you today?",
            sender: "bot",
            timestamp: new Date(),
        },
    ]);
    const [suggestions] = useState<SuggestionChip[]>(defaultSuggestions);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Initialize Gemini API
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

    // Load chat history from localStorage
    useEffect(() => {
        const savedMessages = localStorage.getItem("chatMessages");
        if (savedMessages) {
            try {
                const parsedMessages = (JSON.parse(savedMessages) as Message[]).map((msg) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp),
                }));
                setMessages(parsedMessages);
            } catch (error) {
                console.error("Error parsing saved messages:", error);
            }
        }
    }, []);

    // Save chat history to localStorage
    useEffect(() => {
        if (messages.length > 1) {
            localStorage.setItem("chatMessages", JSON.stringify(messages));
        }
    }, [messages]);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const addMessage = (text: string, sender: "user" | "bot", isMarkdown = false) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            text,
            sender,
            timestamp: new Date(),
            isMarkdown,
        };
        setMessages((prev) => [...prev, newMessage]);
    };

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        // Add user message
        addMessage(text, "user");
        setIsLoading(true);

        try {
            // Construct prompt with resume context
            const prompt = {
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `
                                    You are Jefino's virtual assistant. Use the following resume information to answer questions accurately and professionally:
                                    ${resumeText}

                                    User question: ${text}

                                    Provide a concise and relevant response based on the resume context. If the question is unrelated to the Jefino, respond politely and appropriately.
                                `,
                            },
                        ],
                    },
                ],
            };

            // Call Gemini API
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash-001",
                ...prompt,
            });

            // Add bot response with markdown support
            setTimeout(() => {
                addMessage(response.text || "I'm sorry, I couldn't process your request.", "bot", true);
                setIsLoading(false);
            }, 300); // Small delay for natural feel
        } catch (error) {
            console.error("Error sending message to Gemini:", error);

            // Fallback response if API fails
            setTimeout(() => {
                addMessage(
                    "I'm having trouble connecting to my knowledge base. Please try again later.",
                    "bot"
                );
                setIsLoading(false);
            }, 300);
        }
    };

    return (
        <ChatContext.Provider
            value={{
                messages,
                suggestions,
                addMessage,
                sendMessage,
                isChatOpen,
                toggleChat,
                isLoading,
                setIsChatOpen,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};