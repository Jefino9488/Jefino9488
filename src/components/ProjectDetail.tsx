import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Star,
  GitFork,
  Code2,
  Eye,
  Globe,
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
} from "lucide-react";
import { Github } from "./icons/Github";
import { useState, useEffect } from "react";
import { useProjects } from "./ProjectsContext";
import PageHeader from "./PageHeader";
import NextPageLink from "./NextPageLink";

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

interface RepoDetail {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  language: string;
  license: { name: string } | null;
  homepage: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics: string[];
  html_url: string;
  visibility: string;
  default_branch: string;
}

interface ReadmeData {
  content: string;
}

function cleanHomepage(url?: string | null): string | undefined {
  if (!url || typeof url !== "string") return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  return trimmed.startsWith("http://") || trimmed.startsWith("https://")
    ? trimmed
    : `https://${trimmed}`;
}

export default function ProjectDetail() {
  const { name } = useParams<{ name: string }>();
  const { allProjects, pinnedProjects } = useProjects();
  const [repoDetail, setRepoDetail] = useState<RepoDetail | null>(null);
  const [readmeContent, setReadmeContent] = useState<string>("");
  const [readmeLoading, setReadmeLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const [previewViewport, setPreviewViewport] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  const project = [...pinnedProjects, ...allProjects].find(
    (p) => p.title.toLowerCase() === name?.toLowerCase(),
  );

  const liveUrl = cleanHomepage(repoDetail?.homepage || project?.homepage);

  useEffect(() => {
    if (!name) return;

    const fetchDetail = async () => {
      try {
        const headers: Record<string, string> = {
          Accept: "application/vnd.github+json",
        };
        if (GITHUB_TOKEN) headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;

        const res = await fetch(
          `https://api.github.com/repos/Jefino9488/${name}`,
          { headers },
        );
        if (res.ok) {
          const data = await res.json();
          setRepoDetail(data);
        }
      } catch (e) {
        console.error("Failed to fetch repo detail", e);
      }
    };

    const fetchReadme = async () => {
      setReadmeLoading(true);
      try {
        const headers: Record<string, string> = {
          Accept: "application/vnd.github+json",
        };
        if (GITHUB_TOKEN) headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;

        const res = await fetch(
          `https://api.github.com/repos/Jefino9488/${name}/readme`,
          { headers },
        );
        if (res.ok) {
          const data: ReadmeData = await res.json();
          const decoded = atob(data.content.replace(/\n/g, ""));
          setReadmeContent(decoded);
        } else {
          setReadmeContent("");
        }
      } catch {
        setReadmeContent("");
      } finally {
        setReadmeLoading(false);
      }
    };

    fetchDetail();
    fetchReadme();
  }, [name]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const renderReadme = (content: string) => {
    if (!content) return null;
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];
    let codeLang = "";

    lines.forEach((line, idx) => {
      if (line.startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLang = line.slice(3).trim();
          codeLines = [];
        } else {
          inCodeBlock = false;
          elements.push(
            <div
              key={idx}
              className="my-5 rounded-xl overflow-hidden border border-line bg-inset"
            >
              {codeLang && (
                <div className="px-4 py-1.5 bg-surface border-b border-line font-mono text-[11px] text-fg-muted">
                  {codeLang}
                </div>
              )}
              <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-foreground leading-relaxed">
                <code>{codeLines.join("\n")}</code>
              </pre>
            </div>,
          );
        }
        return;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        return;
      }

      if (line.startsWith("# ")) {
        // Skip main H1 to avoid redundancy
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={idx}
            className="mb-3 mt-8 border-b border-line pb-2 text-lg font-semibold text-foreground sm:text-xl"
          >
            {line.slice(3)}
          </h2>,
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={idx}
            className="text-base font-semibold text-primary mt-6 mb-2"
          >
            {line.slice(4)}
          </h3>,
        );
      } else if (line.match(/^[-*+] /)) {
        elements.push(
          <li
            key={idx}
            className="text-sm leading-relaxed text-fg-muted ml-4 list-disc my-1"
          >
            {line.slice(2)}
          </li>,
        );
      } else if (line.match(/^\d+\. /)) {
        elements.push(
          <li
            key={idx}
            className="text-sm leading-relaxed text-fg-muted ml-4 list-decimal my-1"
          >
            {line.replace(/^\d+\. /, "")}
          </li>,
        );
      } else if (line.startsWith("> ")) {
        elements.push(
          <blockquote
            key={idx}
            className="my-3 border-l-2 border-primary pl-3 text-xs italic leading-relaxed text-fg-muted sm:text-sm"
          >
            {line.slice(2)}
          </blockquote>,
        );
      } else if (line.trim() === "") {
        elements.push(<div key={idx} className="h-2" />);
      } else {
        const cleaned = line
          .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          .replace(/\*\*([^*]+)\*\*/g, "$1")
          .replace(/`([^`]+)`/g, "$1")
          .trim();
        if (cleaned) {
          elements.push(
            <p key={idx} className="my-2 text-sm leading-relaxed text-fg-muted">
              {cleaned}
            </p>,
          );
        }
      }
    });

    return elements;
  };

  const displayName = name
    ? name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ")
    : "Project";

  return (
    <div className="min-h-screen text-foreground">
      <PageHeader
        title={displayName}
        backTo="/projects"
        backLabel="Work"
        rightAction={
          <div className="flex items-center gap-2">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5 font-mono text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-background"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                <span>Live Site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <a
              href={
                repoDetail?.html_url ||
                project?.link ||
                `https://github.com/Jefino9488/${name}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-elevated px-3.5 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-line-strong"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub Source</span>
              <ExternalLink className="w-3 h-3 text-fg-muted" />
            </a>
          </div>
        }
      />

      <div className="relative mx-auto max-w-4xl space-y-14 px-4 pb-24 pt-10 sm:px-8 sm:pt-12">
        {/* Case Study Header */}
        <div className="space-y-7">
          <div aria-hidden className="ambient-glow -top-16 right-0 h-56 w-56" />
          <div className="relative space-y-4">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-fg-faint">
              <span className="font-semibold tracking-[0.18em] text-primary uppercase">
                Case study
              </span>
              <span>·</span>
              <span className="uppercase">
                {repoDetail?.language || project?.tech[0] || "Software"}
              </span>
              {repoDetail?.updated_at && (
                <>
                  <span>·</span>
                  <span className="tabular-nums">
                    Updated {formatDate(repoDetail.updated_at)}
                  </span>
                </>
              )}
            </div>

            <h1
              className="max-w-[20ch] text-balance font-poppins font-semibold leading-[1.02]"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                letterSpacing: "-0.04em",
              }}
            >
              {displayName}
            </h1>

            {(repoDetail?.description || project?.description) && (
              <p className="text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
                {repoDetail?.description || project?.description}
              </p>
            )}
          </div>

          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                icon: Star,
                label: "Stars",
                value:
                  repoDetail?.stargazers_count ?? project?.stats.stars ?? "--",
                color: "text-warm",
              },
              {
                icon: GitFork,
                label: "Forks",
                value: repoDetail?.forks_count ?? project?.stats.forks ?? "--",
                color: "text-fg-muted",
              },
              {
                icon: Eye,
                label: "Watchers",
                value: repoDetail?.watchers_count ?? "--",
                color: "text-primary",
              },
              {
                icon: Code2,
                label: "Language",
                value: repoDetail?.language || project?.tech[0] || "Code",
                color: "text-success",
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="tile space-y-1 p-4">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">
                  <Icon className={`h-3.5 w-3.5 ${color}`} />
                  <span>{label}</span>
                </div>
                <p className="truncate font-mono text-lg font-medium tabular-nums text-foreground">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Topics / Tech */}
          <div className="flex flex-wrap gap-1.5">
            {(repoDetail?.topics?.length
              ? repoDetail.topics
              : (project?.tech ?? [])
            ).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line bg-inset px-3 py-1 font-mono text-xs text-fg-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Live Website Preview (if deployed) */}
        {liveUrl && (
          <div className="space-y-4 border-t border-line pt-10">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  <span>Live Deployment</span>
                </div>
                <h2 className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">
                  Interactive Preview
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 rounded-full border border-line bg-inset p-0.5 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewViewport("desktop")}
                    title="Desktop view"
                    className={`rounded-full p-1.5 transition-colors ${
                      previewViewport === "desktop"
                        ? "bg-elevated text-foreground"
                        : "text-fg-faint hover:text-foreground"
                    }`}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewViewport("tablet")}
                    title="Tablet view"
                    className={`rounded-full p-1.5 transition-colors ${
                      previewViewport === "tablet"
                        ? "bg-elevated text-foreground"
                        : "text-fg-faint hover:text-foreground"
                    }`}
                  >
                    <Tablet className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewViewport("mobile")}
                    title="Mobile view"
                    className={`rounded-full p-1.5 transition-colors ${
                      previewViewport === "mobile"
                        ? "bg-elevated text-foreground"
                        : "text-fg-faint hover:text-foreground"
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIframeKey((k) => k + 1)}
                  title="Reload preview"
                  className="rounded-full border border-line bg-elevated p-2 text-fg-muted transition-colors hover:text-foreground"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                </button>
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-elevated px-3.5 py-1.5 font-mono text-xs text-foreground transition-colors hover:border-line-strong"
                >
                  <span>Open site</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Browser Window Mockup */}
            <div
              className={`mx-auto overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl transition-all duration-300 ${
                previewViewport === "desktop"
                  ? "w-full"
                  : previewViewport === "tablet"
                    ? "w-[768px] max-w-full"
                    : "w-[390px] max-w-full"
              }`}
            >
              {/* Browser Topbar */}
              <div className="flex items-center justify-between gap-3 border-b border-line bg-elevated/80 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>

                <div className="flex max-w-md flex-1 items-center gap-2 truncate rounded-full border border-line bg-inset px-3 py-1 font-mono text-[11px] text-fg-muted">
                  <Globe className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="truncate">{liveUrl}</span>
                </div>

                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg-faint transition-colors hover:text-primary"
                  title="Launch in new window"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Viewport Frame */}
              <div className="relative aspect-[16/10] min-h-[460px] w-full bg-background sm:min-h-[540px]">
                <iframe
                  key={iframeKey}
                  src={liveUrl}
                  title={`${displayName} live site`}
                  className="h-full w-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  loading="lazy"
                />
              </div>

              {/* Footer Note */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line bg-surface px-4 py-2.5 text-[11px] text-fg-muted">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Interactive Live Deployment</span>
                </span>
                <span className="font-mono text-[10px] text-fg-faint">
                  If blocked by third-party security policies,{" "}
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    launch directly
                  </a>
                  .
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Documentation / README Content */}
        <div className="space-y-5 border-t border-line pt-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-faint">
            Repository documentation
          </p>

          {readmeLoading ? (
            <div className="tile space-y-3 p-6">
              <div className="skeleton h-5 w-1/3" />
              <div className="skeleton h-3.5 w-full" />
              <div className="skeleton h-3.5 w-5/6" />
              <div className="skeleton h-3.5 w-2/3" />
            </div>
          ) : readmeContent ? (
            <div className="tile p-6">{renderReadme(readmeContent)}</div>
          ) : (
            <div className="tile p-6 text-center font-mono text-xs text-fg-muted">
              Full documentation and code samples available in the GitHub
              repository.
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-line pt-10 sm:flex-row">
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 font-mono text-xs text-fg-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to all projects
          </Link>

          <div className="flex items-center gap-2">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="press inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-xs font-medium text-primary transition-all hover:bg-primary hover:text-background"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Open Live Site</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <a
              href={
                repoDetail?.html_url ||
                project?.link ||
                `https://github.com/Jefino9488/${name}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="press inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 font-mono text-xs font-medium text-background transition-all hover:bg-white"
            >
              <Github className="h-4 w-4" />
              <span>Open in GitHub</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <NextPageLink to="/blog" title="Writing" />
      </div>
    </div>
  );
}
