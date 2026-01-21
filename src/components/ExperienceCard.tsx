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
        <div className="glass-crystal border-0 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 hover-lift group w-full relative">
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-primary shadow-inner flex-shrink-0">
                    {logo}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors truncate pr-8 sm:pr-0">
                            {company}
                        </h3>
                        {link && (
                            <a href={link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 absolute top-5 right-5 sm:static sm:top-auto sm:right-auto">
                                <ExternalLink className="w-5 h-5 sm:w-4 sm:h-4" />
                            </a>
                        )}
                        {status && (
                            <div className="glass-chip px-2.5 py-0.5 text-[10px] sm:text-xs font-medium text-foreground bg-white/5 border border-white/10 flex-shrink-0 whitespace-nowrap">
                                {status}
                            </div>
                        )}
                    </div>
                    <p className="text-muted-foreground font-medium text-sm sm:text-base line-clamp-1">{role}</p>
                </div>
            </div>
            <div className="text-left sm:text-right pl-[4.5rem] sm:pl-0 w-full sm:w-auto mt-[-0.5rem] sm:mt-0">
                <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">{date}</p>
                <p className="text-xs text-muted-foreground/80">{location}</p>
            </div>
        </div>
    );
}
