import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Star,
  GitFork,
  Briefcase,
  Globe,
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  ExternalLink,
  X,
  Eye,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Github } from "./icons/Github";
import PageHeader from "./PageHeader";
import Reveal from "./Reveal";
import { useProjects, Project } from "./ProjectsContext";
import { useGitHubData } from "@/components/GitHubContext";
import NextPageLink from "./NextPageLink";
import DualToneSection from "./DualToneSection";

/** Scroll-scrubbed oversized marquee — type too big for the viewport,
 *  with a live pixel riding inside the words. */
function MegaMarquee() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["6%", "-32%"]);

  const words = ["Systems", "Tooling", "AI Agents", "Web"];

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative my-12 overflow-hidden sm:my-16"
    >
      <motion.p
        style={reduceMotion ? undefined : { x }}
        className="flex w-max items-center gap-10 whitespace-nowrap font-poppins text-[13vw] font-semibold uppercase leading-none tracking-tight will-change-transform sm:text-[9vw]"
      >
        {words.map((word, i) => (
          <span key={word} className="flex items-center gap-10">
            <span
              className={
                i % 2 === 0
                  ? "text-foreground"
                  : "text-transparent [-webkit-text-stroke:1px_var(--color-line-strong)]"
              }
            >
              {word}
            </span>
            {i === 1 && (
              <img
                src="/profile/profile_anime.jpg"
                alt=""
                className="h-[0.62em] w-[1.7em] rounded-full border border-line object-cover"
                width="120"
                height="44"
              />
            )}
          </span>
        ))}
      </motion.p>
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="space-y-3 border-b border-line py-8">
      <div className="flex items-center justify-between">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-3 w-12" />
      </div>
      <div className="skeleton h-7 w-1/2" />
      <div className="skeleton h-4 w-full max-w-xl" />
    </div>
  );
}

function LivePreviewModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [iframeKey, setIframeKey] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setIframeKey((k) => k + 1);
  }, [project, viewport]);

  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  if (!project || !project.homepage) return null;

  const widthClass =
    viewport === "desktop"
      ? "w-full max-w-6xl"
      : viewport === "tablet"
        ? "w-[768px] max-w-full"
        : "w-[390px] max-w-full";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        className={`relative z-10 flex h-[88vh] max-h-[900px] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl transition-all duration-300 ${widthClass}`}
      >
        {/* Window Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-elevated/90 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="truncate font-medium text-sm text-foreground">
              {project.name || project.title}
            </span>
          </div>

          {/* URL bar */}
          <div className="hidden sm:flex max-w-sm flex-1 items-center gap-2 truncate rounded-full border border-line bg-inset px-3 py-1 font-mono text-xs text-fg-muted">
            <Globe className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate">{project.homepage}</span>
          </div>

          {/* Viewport & Action Buttons */}
          <div className="flex items-center gap-1.5">
            <div className="hidden sm:flex items-center gap-1 rounded-full border border-line bg-inset p-0.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => setViewport("desktop")}
                title="Desktop View"
                className={`rounded-full p-1.5 transition-colors ${
                  viewport === "desktop"
                    ? "bg-elevated text-foreground"
                    : "text-fg-faint hover:text-foreground"
                }`}
              >
                <Monitor className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewport("tablet")}
                title="Tablet View"
                className={`rounded-full p-1.5 transition-colors ${
                  viewport === "tablet"
                    ? "bg-elevated text-foreground"
                    : "text-fg-faint hover:text-foreground"
                }`}
              >
                <Tablet className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewport("mobile")}
                title="Mobile View"
                className={`rounded-full p-1.5 transition-colors ${
                  viewport === "mobile"
                    ? "bg-elevated text-foreground"
                    : "text-fg-faint hover:text-foreground"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setIframeKey((k) => k + 1);
              }}
              title="Reload Preview"
              className="rounded-full p-1.5 text-fg-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>

            <a
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              title="Open in new tab"
              className="rounded-full p-1.5 text-fg-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <button
              type="button"
              onClick={onClose}
              title="Close preview"
              className="rounded-full p-1.5 text-fg-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Iframe Viewport Container */}
        <div className="relative flex-1 bg-background">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface/70 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="font-mono text-xs text-fg-muted">
                  Loading live preview...
                </span>
              </div>
            </div>
          )}
          <iframe
            key={iframeKey}
            src={project.homepage}
            title={`${project.name || project.title} live preview`}
            onLoad={() => setLoading(false)}
            className="h-full w-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>

        {/* Bottom Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-surface px-4 py-2 text-[11px] text-fg-muted">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Live Deployment</span>
          </span>
          <span className="font-mono text-[10px] text-fg-faint">
            If blocked by external security headers (X-Frame-Options),{" "}
            <a
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              open in new tab
            </a>
            .
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default function Projects() {
  const { pinnedProjects, allProjects, loading, error } = useProjects();
  const { profile, stats } = useGitHubData();
  const [filterMode, setFilterMode] = useState<"featured" | "live" | "all">("featured");
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  if (loading) {
    return (
      <div className="min-h-[70vh] text-foreground">
        <PageHeader
          title="Selected Work & Archive"
          icon={Briefcase}
          meta={`${allProjects.length} Repositories`}
        />
        <div className="mx-auto max-w-[90rem] px-4 pt-10 sm:px-8">
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] text-foreground">
        <PageHeader
          title="Selected Work & Archive"
          icon={Briefcase}
          meta={`${allProjects.length} Repositories`}
        />
        <div className="mx-auto flex min-h-[40vh] max-w-[90rem] items-center px-4 sm:px-8">
          <div className="tile mx-auto w-full max-w-md space-y-3 p-8 text-center">
            <p className="font-mono text-sm text-destructive">{error}</p>
            <p className="text-sm text-fg-muted">
              GitHub might be rate-limiting requests. Try again in a minute.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="press mx-auto mt-2 block rounded-full border border-line bg-elevated px-4 py-2 font-mono text-xs text-foreground transition-colors hover:border-line-strong"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const liveProjects = allProjects.filter((p) => Boolean(p.homepage));

  const displayedProjects =
    filterMode === "featured"
      ? pinnedProjects.length > 0
        ? pinnedProjects
        : allProjects.slice(0, 6)
      : filterMode === "live"
        ? liveProjects
        : allProjects;

  return (
    <div className="min-h-screen text-foreground">
      <PageHeader
        title="Selected Work & Archive"
        icon={Briefcase}
        meta={`${allProjects.length} Repositories`}
        rightAction={
          <div className="flex items-center gap-0.5 rounded-full border border-line bg-surface p-0.5 font-mono text-xs">
            <button
              onClick={() => setFilterMode("featured")}
              aria-pressed={filterMode === "featured"}
              className={`rounded-full px-3 py-1 transition-colors ${
                filterMode === "featured"
                  ? "bg-elevated font-medium text-foreground"
                  : "text-fg-muted hover:text-foreground"
              }`}
            >
              Featured ({pinnedProjects.length || 6})
            </button>
            <button
              onClick={() => setFilterMode("live")}
              aria-pressed={filterMode === "live"}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${
                filterMode === "live"
                  ? "bg-elevated font-medium text-foreground"
                  : "text-fg-muted hover:text-foreground"
              }`}
            >
              {liveProjects.length > 0 && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
              )}
              Live Demos ({liveProjects.length})
            </button>
            <button
              onClick={() => setFilterMode("all")}
              aria-pressed={filterMode === "all"}
              className={`rounded-full px-3 py-1 transition-colors ${
                filterMode === "all"
                  ? "bg-elevated font-medium text-foreground"
                  : "text-fg-muted hover:text-foreground"
              }`}
            >
              All ({allProjects.length})
            </button>
          </div>
        }
      />

      <div className="relative mx-auto max-w-[90rem] px-4 pb-20 pt-10 sm:px-8 sm:pt-10">
        {/* Intro + quiet GitHub telemetry */}
        <Reveal>
          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div
              aria-hidden
              className="ambient-glow -top-16 -left-10 h-64 w-64"
            />
            <div className="relative space-y-3">
              <h1
                className="max-w-[18ch] text-balance font-poppins font-semibold leading-[1.02]"
                style={{
                  fontSize: "clamp(1.9rem, 4vw, 3rem)",
                  letterSpacing: "-0.035em",
                }}
              >
                Engineering case studies &amp; tools
              </h1>
              <p className="max-w-xl text-pretty text-sm leading-relaxed text-fg-muted sm:text-base">
                Systems software, Android automation tools, AI agents, and web
                applications.
              </p>
            </div>

            {profile && (
              <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-fg-muted">
                <Github className="h-4 w-4 text-primary" />
                <span className="tabular-nums">
                  {profile.public_repos} repos
                </span>
                {typeof stats?.totalStars === "number" && (
                  <>
                    <span className="text-line-strong">·</span>
                    <span className="tabular-nums">
                      {stats.totalStars}+ stars
                    </span>
                  </>
                )}
                {typeof stats?.totalPullRequests === "number" && (
                  <>
                    <span className="hidden text-line-strong sm:inline">·</span>
                    <span className="hidden tabular-nums sm:inline">
                      {stats.totalPullRequests} PRs
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
          <div
            aria-hidden
            className="mt-9 h-px w-full bg-gradient-to-r from-line-strong to-transparent"
          />
        </Reveal>

        <MegaMarquee />

        {/* Editorial index rows */}
        <div className="border-t border-line">
          {displayedProjects.map((project, index) => {
            const yearStr = project.updatedAt
              ? new Date(project.updatedAt).getFullYear()
              : "";

            return (
              <Reveal key={project.title} delay={Math.min(index * 0.04, 0.25)}>
                <article className="group relative border-b border-line">
                  <Link
                    to={`/projects/${project.title}`}
                    aria-label={`${project.title} case study`}
                    className="absolute inset-0 z-10"
                  >
                    <span className="sr-only">{project.title}</span>
                  </Link>

                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.title} source on GitHub`}
                    className="absolute right-0 top-7 z-20 rounded-full p-2 text-fg-faint transition-colors hover:text-primary"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </a>

                  <div className="grid grid-cols-[auto_1fr] items-start gap-5 py-7 pr-10 sm:grid-cols-[auto_1fr_auto] sm:gap-8 sm:pr-16">
                    <span
                      aria-hidden
                      className="index-num pt-1 text-5xl leading-none sm:text-6xl"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0 space-y-3.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h2 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-2xl">
                          {project.title.charAt(0).toUpperCase() +
                            project.title.slice(1).replace(/-/g, " ")}
                        </h2>
                        {project.homepage && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] text-primary">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                            </span>
                            Live Demo
                          </span>
                        )}
                      </div>

                      {project.description ? (
                        <p className="max-w-xl text-pretty text-sm leading-relaxed text-fg-muted">
                          {project.description}
                        </p>
                      ) : null}

                      {project.homepage && (
                        <div className="relative z-20 flex flex-wrap items-center gap-2 pt-0.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setPreviewProject(project);
                            }}
                            className="group/btn inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-xs text-primary transition-all hover:bg-primary hover:text-background"
                          >
                            <Eye className="h-3.5 w-3.5 transition-transform group-hover/btn:scale-110" />
                            <span>Live Preview</span>
                          </button>
                          <a
                            href={project.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-xs text-fg-muted transition-colors hover:border-line-strong hover:text-foreground"
                            title="Open in new window"
                          >
                            <Globe className="h-3 w-3 text-fg-faint" />
                            <span>Launch site</span>
                            <ExternalLink className="h-2.5 w-2.5 text-fg-faint" />
                          </a>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-line bg-inset px-2.5 py-1 font-mono text-[11px] text-fg-muted"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center gap-5 font-mono text-xs tabular-nums text-fg-muted sm:col-span-1 sm:w-28 sm:flex-col sm:items-end sm:gap-2 sm:text-right">
                      {yearStr && (
                        <span className="hidden text-fg-faint sm:block">
                          {yearStr}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 transition-colors hover:text-warm">
                        <Star className="h-3.5 w-3.5 text-warm" />
                        {project.stats.stars}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <GitFork className="h-3.5 w-3.5" />
                        {project.stats.forks}
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {previewProject && (
          <LivePreviewModal
            project={previewProject}
            onClose={() => setPreviewProject(null)}
          />
        )}
      </AnimatePresence>

      {/* ================================================================ */}
      {/* Sage closer — archive callout + next page                         */}
      {/* ================================================================ */}
      <DualToneSection>
        <div className="mx-auto w-full max-w-[90rem] px-4 pb-20 pt-8 sm:px-8 sm:pb-24 sm:pt-10">
          {/* Bottom archive callout */}
          <Reveal>
            <div className="tile flex flex-col items-center justify-between gap-4 p-6 sm:flex-row sm:p-7">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-base font-semibold text-foreground">
                  Looking for more repositories?
                </h3>
                <p className="text-xs text-fg-muted">
                  Explore all active, archived, and experimental codebases on
                  GitHub.
                </p>
              </div>
              <a
                href="https://github.com/Jefino9488?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="press inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-elevated px-4 py-2 font-mono text-xs text-foreground transition-colors hover:border-line-strong"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub profile
                <ArrowUpRight className="h-3 w-3 text-fg-muted" />
              </a>
            </div>
          </Reveal>

          <NextPageLink to="/blog" title="Writing" />
        </div>
      </DualToneSection>
    </div>
  );
}
