import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  backTo?: string;
  backLabel?: string;
  icon?: React.ComponentType<{ className?: string }>;
  meta?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export default function PageHeader({
  title,
  backTo = "/",
  backLabel = "Home",
  icon: Icon,
  meta,
  rightAction,
}: PageHeaderProps) {
  return (
    /* Sticky glass only below the mobile top bar; static on desktop so the
       floating pill nav never collides with it. */
    <div className="z-30 border-b border-line max-lg:glass-header max-lg:sticky max-lg:top-14">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to={backTo}
            className="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs text-fg-muted transition-colors hover:text-[#f2f5f5]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{backLabel}</span>
          </Link>
          <span aria-hidden className="text-line-strong">
            /
          </span>
          <div className="flex min-w-0 items-center gap-2">
            {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />}
            <span className="truncate text-sm font-semibold tracking-tight text-[#f2f5f5]">
              {title}
            </span>
          </div>
          {meta && (
            <span className="hidden shrink-0 rounded border border-line bg-elevated px-2 py-0.5 font-mono text-[10px] tabular-nums text-fg-muted sm:inline-block">
              {meta}
            </span>
          )}
        </div>

        {rightAction && (
          <div className="flex shrink-0 items-center gap-2">{rightAction}</div>
        )}
      </div>
    </div>
  );
}
