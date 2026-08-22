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
    <div className="p-5 rounded-xl bg-[#0b1012] border border-[#182024] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-[#28353d] transition-colors">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {logo && (
          <div className="w-10 h-10 rounded-lg bg-[#12181b] border border-[#182024] flex items-center justify-center text-[#7c82ff] shrink-0">
            {logo}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-[#f2f5f5] group-hover:text-[#7c82ff] transition-colors truncate">
              {company}
            </h3>
            {status && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#12181b] text-[#7c82ff] border border-[#182024]">
                {status}
              </span>
            )}
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#899395] hover:text-[#f2f5f5] transition-colors"
                aria-label={`Open ${company} link`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <p className="text-xs text-[#899395] mt-0.5 line-clamp-1">
            {role}
          </p>
        </div>
      </div>

      <div className="text-left sm:text-right text-xs font-mono text-[#899395] shrink-0">
        <p>{date}</p>
        <p className="text-[10px] mt-0.5 text-[#525d60]">{location}</p>
      </div>
    </div>
  );
}
