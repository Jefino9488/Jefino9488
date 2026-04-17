import { ExternalLink } from 'lucide-react';


interface ExperienceCardProps {
    company: string;
    role: string;
    date: string;
    location: string;
    logo?: React.ReactNode;
    status?: string;
    link?: string;
}

export default function ExperienceCard({ company, role, date, location, logo, status, link }: ExperienceCardProps) {
    return (
        <div className="glass-crystal rounded-[1.25rem] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 group w-full relative overflow-hidden border-0 border-l-[4px] border-l-primary hover:bg-white/[0.02] transition-colors shadow-sm">
            {/* Subtle base gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
            
            <div className="flex items-center gap-4 w-full sm:w-auto relative z-10">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-primary shadow-inner flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                    {logo}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h2 className="text-lg sm:text-xl font-mono tracking-tight font-bold text-white group-hover:text-primary transition-colors truncate pr-8 sm:pr-0">
                            {company}
                        </h2>
                        {link && (
                            <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Open ${company} repository`}
                                className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 absolute top-5 right-5 sm:static sm:top-auto sm:right-auto"
                            >
                                <ExternalLink className="w-5 h-5 sm:w-4 sm:h-4" />
                            </a>
                        )}
                        {status && (
                            <div className="flex items-center gap-1.5 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase text-primary border border-primary/30 bg-primary/5 rounded-full flex-shrink-0 whitespace-nowrap">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                {status}
                            </div>
                        )}
                    </div>
                    <p className="text-[#8ab8d0] font-mono text-xs sm:text-sm tracking-wide line-clamp-1 opacity-90">{role}</p>
                </div>
            </div>
            <div className="text-left sm:text-right pl-[4.5rem] sm:pl-0 w-full sm:w-auto mt-[-0.5rem] sm:mt-0 relative z-10">
                <p className="text-[10px] sm:text-xs font-mono text-[#b3bad9] uppercase tracking-widest whitespace-nowrap">{date}</p>
                <p className="text-[10px] sm:text-xs font-mono text-muted-foreground/60 uppercase tracking-widest mt-1">{location}</p>
            </div>
        </div>
    );
}
