import { Github, Mail, Linkedin, Send, Heart } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-card mt-0 border-t border-border">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <span className="text-xl font-semibold text-foreground mr-4">Jefino</span>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com/Jefino9488"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="GitHub"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="mailto:jefinojacob9488@gmail.com"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Email"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/jefino9488/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a
                                href="https://telegram.me/jefino9488"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Telegram"
                            >
                                <Send className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                    <p className="text-muted-foreground text-sm flex items-center">
                        © {new Date().getFullYear()} Jefino <Heart className="h-4 w-4 mx-2 text-destructive" /> React & Tailwind
                    </p>
                </div>
            </div>
        </footer>
    )
}
