import React from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

interface PageHeaderProps {
    title: string
    backTo?: string
    backLabel?: string
    icon?: React.ElementType
    meta?: React.ReactNode
    rightAction?: React.ReactNode
}

export default function PageHeader({
    title,
    backTo = "/",
    backLabel = "HOME",
    icon: Icon,
    meta,
    rightAction
}: PageHeaderProps) {
    return (
        <div
            className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
        >
            <div
                className="flex items-center gap-2 sm:gap-4 p-1.5 sm:p-2 bg-[#0a0a0a]/75 border border-white/10 rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] pointer-events-auto relative overflow-hidden backdrop-blur-xl will-change-transform"
            >
                {/* Subtle internal glow */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                
                {/* Back Button */}
                <Link 
                    to={backTo} 
                    className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2 sm:py-1.5 rounded-full hover:bg-white/10 transition-colors group relative z-10"
                >
                    <ArrowLeft className="w-4 h-4 text-[#b3bad9] group-hover:text-white transition-colors" />
                    <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#b3bad9] group-hover:text-white uppercase hidden sm:inline-block">
                        {backLabel}
                    </span>
                </Link>

                <div className="w-px h-5 bg-white/10 hidden sm:block relative z-10" />

                {/* Center Title Context */}
                <div className="flex items-center gap-2.5 px-2 sm:px-3 relative z-10">
                    {Icon && <Icon className="w-4 h-4 text-primary" />}
                    <span className="text-sm sm:text-base font-poppins font-medium text-white tracking-wide truncate max-w-[120px] sm:max-w-xs block">
                        {title}
                    </span>
                </div>

                {/* Optional Metadata / Right action items */}
                {(meta || rightAction) && (
                    <>
                        <div className="w-px h-5 bg-white/10 relative z-10" />
                        <div className="flex items-center gap-2 relative z-10 pr-1">
                            {meta && (
                                <div className="hidden sm:flex items-center px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[10px] font-mono tracking-widest text-[#b3bad9] uppercase">
                                    {meta}
                                </div>
                            )}
                            {rightAction}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
