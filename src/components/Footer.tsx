import { Github, Mail, Linkedin, Send, Heart } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-[#1e1e2e] mt-0">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <span className="text-xl font-semibold text-[#cba6f7] mr-4">Jefino</span>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com/Jefino9488"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#a6adc8] hover:text-[#f5c2e7] transition-colors"
                                aria-label="GitHub"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="mailto:jefinojacob9488@gmail.com"
                                className="text-[#a6adc8] hover:text-[#f5c2e7] transition-colors"
                                aria-label="Email"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/jefino9488/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#a6adc8] hover:text-[#f5c2e7] transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a
                                href="https://telegram.me/jefino9488"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#a6adc8] hover:text-[#f5c2e7] transition-colors"
                                aria-label="Telegram"
                            >
                                <Send className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                    <p className="text-[#a6adc8] text-sm flex items-center">
                        © {new Date().getFullYear()} Jefino <Heart className="h-4 w-4 mx-2 text-[#f38ba8]" /> React & Tailwind
                    </p>
                </div>
            </div>
        </footer>
    )
}
