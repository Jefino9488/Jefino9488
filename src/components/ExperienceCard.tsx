import { ExternalLink } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface ExperienceCardProps {
    company: string;
    role: string;
    date: string;
    location: string;
    logo?: React.ReactNode;
    status?: "Completed" | "Ongoing";
    link?: string;
}

export default function ExperienceCard({ company, role, date, location, logo, status, link }: ExperienceCardProps) {
    return (
        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/50 transition-colors group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {logo}
                </div>
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {company}
                        </h3>
                        {link && (
                            <a href={link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        )}
                        {status && (
                            <Badge variant={status === "Completed" ? "secondary" : "default"} className="text-xs">
                                {status}
                            </Badge>
                        )}
                    </div>
                    <p className="text-muted-foreground font-medium">{role}</p>
                </div>
            </div>
            <div className="text-left sm:text-right">
                <p className="text-sm sm:text-base text-muted-foreground">{date}</p>
                <p className="text-sm text-muted-foreground/80">{location}</p>
            </div>
        </div>
    );
}
