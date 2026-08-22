import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Star, GitFork, Briefcase } from "lucide-react";
import { Github } from "./icons/Github";
import PageHeader from "./PageHeader";
import Reveal from "./Reveal";
import { useProjects } from "./ProjectsContext";
import { useGitHubData } from "@/components/GitHubContext";
import NextPageLink from "./NextPageLink";

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

export default function Projects() {
  const { pinnedProjects, allProjects, loading, error } = useProjects();
  const { profile, stats } = useGitHubData();
  const [filterMode, setFilterMode] = useState<"featured" | "all">("featured");

  if (loading) {
    return (
      <div className="min-h-[70vh] text-[#f2f5f5]">
        <PageHeader
          title="Selected Work & Archive"
          icon={Briefcase}
          meta={`${allProjects.length} Repositories`}
        />
        <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-8">
          <RowSkeleton />
          <RowSkeleton />
          <RowSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] text-[#f2f5f5]">
        <PageHeader
          title="Selected Work & Archive"
          icon={Briefcase}
          meta={`${allProjects.length} Repositories`}
        />
        <div className="mx-auto flex min-h-[40vh] max-w-6xl items-center px-4 sm:px-8">
          <div className="tile mx-auto w-full max-w-md space-y-3 p-8 text-center">
            <p className="font-mono text-sm text-destructive">{error}</p>
            <p className="text-sm text-fg-muted">
              GitHub might be rate-limiting requests. Try again in a minute.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="press mx-auto mt-2 block rounded-full border border-line bg-elevated px-4 py-2 font-mono text-xs text-[#f2f5f5] transition-colors hover:border-line-strong"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Curated flagship projects with problem/approach/outcomes
  const flagshipCurations: Record<
    string,
    { problem: string; approach: string }
  > = {
    frameworkpatcher: {
      problem:
        "Android vendor ROM framework patching typically requires fragile manual bytecode edits and repeated decompile-recompile loops.",
      approach:
        "Engineered an automated pipeline in Python to parse system JARs, inject bytecode smali patches deterministically, and package flashable Magisk modules.",
    },
    "fastboot-flasher": {
      problem:
        "Flashing raw Android partitions across diverse vendor chipsets frequently results in soft-bricked states due to wrong command sequences.",
      approach:
        "Created a cross-platform command toolkit with automated partition verification, dynamic slot switching (A/B), and safety checks.",
    },
    aiwebtester: {
      problem:
        "End-to-end browser testing breaks easily with minor UI changes and requires heavy boilerplate script maintenance.",
      approach:
        "Developed an autonomous browser testing agent combining LLM vision models with headless browser automation to test flows dynamically.",
    },
  };

  const displayedProjects =
    filterMode === "featured"
      ? pinnedProjects.length > 0
        ? pinnedProjects
        : allProjects.slice(0, 6)
      : allProjects;

  return (
    <div className="min-h-screen text-[#f2f5f5]">
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
                  ? "bg-elevated font-medium text-[#f2f5f5]"
                  : "text-fg-muted hover:text-[#f2f5f5]"
              }`}
            >
              Featured ({pinnedProjects.length || 6})
            </button>
            <button
              onClick={() => setFilterMode("all")}
              aria-pressed={filterMode === "all"}
              className={`rounded-full px-3 py-1 transition-colors ${
                filterMode === "all"
                  ? "bg-elevated font-medium text-[#f2f5f5]"
                  : "text-fg-muted hover:text-[#f2f5f5]"
              }`}
            >
              All ({allProjects.length})
            </button>
          </div>
        }
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-8 sm:pt-14">
        {/* Intro + quiet GitHub telemetry */}
        <Reveal>
          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div aria-hidden className="ambient-glow -top-16 -left-10 h-64 w-64" />
            <div className="relative space-y-3">
              <h1
                className="max-w-[18ch] text-balance font-poppins font-semibold leading-[1.02]"
                style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: "-0.035em" }}
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
                <span className="tabular-nums">{profile.public_repos} repos</span>
                <span className="text-line-strong">·</span>
                <span className="tabular-nums">{stats?.totalStars || 140}+ stars</span>
                <span className="hidden text-line-strong sm:inline">·</span>
                <span className="hidden tabular-nums sm:inline">{stats?.totalPullRequests || 140} PRs</span>
              </div>
            )}
          </div>
          <div aria-hidden className="mt-9 h-px w-full bg-gradient-to-r from-line-strong to-transparent" />
        </Reveal>

        {/* Editorial index rows */}
        <div className="border-t border-line">
          {displayedProjects.map((project, index) => {
            const key = project.title.toLowerCase();
            const curation = flagshipCurations[key];
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
                    <span aria-hidden className="index-num pt-1 text-5xl leading-none sm:text-6xl">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0 space-y-3.5">
                      <h2 className="text-xl font-semibold tracking-tight text-[#f2f5f5] transition-colors group-hover:text-primary sm:text-2xl">
                        {project.title.charAt(0).toUpperCase() +
                          project.title.slice(1).replace(/-/g, " ")}
                      </h2>
                      <p className="max-w-xl text-pretty text-sm leading-relaxed text-fg-muted">
                        {project.description ||
                          "Open-source software project with modular architecture and documented workflows."}
                      </p>

                      {curation && (
                        <div className="grid gap-4 border-l-2 border-line-strong pl-4 pt-1 sm:grid-cols-2 sm:gap-6">
                          <p className="text-xs leading-relaxed">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-[#f2f5f5]">
                              Problem
                            </span>
                            <span className="mt-1 block text-fg-muted">{curation.problem}</span>
                          </p>
                          <p className="text-xs leading-relaxed">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
                              Approach
                            </span>
                            <span className="mt-1 block text-fg-muted">{curation.approach}</span>
                          </p>
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
                        <span className="hidden text-fg-faint sm:block">{yearStr}</span>
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

        {/* Bottom archive callout */}
        <Reveal>
          <div className="tile mt-10 flex flex-col items-center justify-between gap-4 p-6 sm:flex-row sm:p-7">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-base font-semibold text-[#f2f5f5]">
                Looking for more repositories?
              </h3>
              <p className="text-xs text-fg-muted">
                Explore all active, archived, and experimental codebases on GitHub.
              </p>
            </div>
            <a
              href="https://github.com/Jefino9488?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-elevated px-4 py-2 font-mono text-xs text-[#f2f5f5] transition-colors hover:border-line-strong"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub profile
              <ArrowUpRight className="h-3 w-3 text-fg-muted" />
            </a>
          </div>
        </Reveal>

        <NextPageLink to="/blog" title="Writing" />
      </div>
    </div>
  );
}
