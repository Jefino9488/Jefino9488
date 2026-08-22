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
    /* Inline breadcrumb — sits inside the page flow, never reads as a
       second navbar under the fixed primary nav. */
    <div className="mx-auto max-w-[90rem] px-4 pt-6 sm:px-8 sm:pt-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Link
            to={backTo}
            className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{backLabel}</span>
          </Link>
          <span aria-hidden className="text-line-strong">
            /
          </span>
          <div className="flex min-w-0 items-center gap-2">
            {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />}
            <span className="truncate font-mono text-[11px] uppercase tracking-[0.14em] text-fg-faint">
              {title}
            </span>
          </div>
          {meta && (
            <span className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-fg-faint sm:inline-block">
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
