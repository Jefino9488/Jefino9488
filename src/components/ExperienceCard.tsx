import { ExternalLink } from "lucide-react";

interface ExperienceCardProps {
  company: string;
  role: string;
  date: string;
  location: string;
  logo?: React.ReactNode;
  status?: string;
  link?: string;
}

export default function ExperienceCard({
  company,
  role,
  date,
  location,
  logo,
  status,
  link,
}: ExperienceCardProps) {
  return (
    <div className="p-5 rounded-xl bg-[#0b1012] border border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-[#28353d] transition-colors">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {logo && (
          <div className="w-10 h-10 rounded-lg bg-elevated border border-line flex items-center justify-center text-primary shrink-0">
            {logo}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {company}
            </h3>
            {status && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-elevated text-primary border border-line">
                {status}
              </span>
            )}
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg-muted hover:text-foreground transition-colors"
                aria-label={`Open ${company} link`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <p className="text-xs text-fg-muted mt-0.5 line-clamp-1">{role}</p>
        </div>
      </div>

      <div className="text-left sm:text-right text-xs font-mono text-fg-muted shrink-0">
        <p>{date}</p>
        <p className="text-[10px] mt-0.5 text-[#525d60]">{location}</p>
      </div>
    </div>
  );
}
