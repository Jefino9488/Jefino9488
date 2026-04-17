import { Heart } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="mt-12 mb-6 flex justify-center w-full px-4 relative z-10">
            <div className="glass-crystal rounded-full px-6 py-3 flex items-center gap-4 shadow-lg hover:shadow-xl transition-shadow border border-white/5">
                <p className="text-muted-foreground text-xs sm:text-sm flex items-center font-medium">
                    © {new Date().getFullYear()} Jefino 
                    <Heart className="h-3 w-3 mx-2 text-destructive animate-pulse" /> 
                    Crafted with React & Tailwind
                </p>
            </div>
        </footer>
    )
}
