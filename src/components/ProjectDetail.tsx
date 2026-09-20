import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Star,
  GitFork,
  Code2,
  Eye,
} from "lucide-react";
import { Github } from "./icons/Github";
import { useState, useEffect } from "react";
import { useProjects } from "./ProjectsContext";
import PageHeader from "./PageHeader";
import NextPageLink from "./NextPageLink";
import MarkdownRenderer from "./MarkdownRenderer";

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

function decodeBase64Utf8(base64: string): string {
  try {
    const cleanBase64 = base64.replace(/\s/g, "");
    const binary = atob(cleanBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return "";
  }
}

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

export default function ProjectDetail() {
  const { name } = useParams<{ name: string }>();
  const { allProjects, pinnedProjects } = useProjects();
  const [repoDetail, setRepoDetail] = useState<RepoDetail | null>(null);
  const [readmeContent, setReadmeContent] = useState<string>("");
  const [readmeLoading, setReadmeLoading] = useState(true);

  const project = [...pinnedProjects, ...allProjects].find(
    (p) => p.title.toLowerCase() === name?.toLowerCase(),
  );

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
          const decoded = decodeBase64Utf8(data.content);
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

            <p className="text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
              {repoDetail?.description ||
                project?.description ||
                "Engineering project focused on systems architecture, modularity, and developer experience."}
            </p>
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
            <div className="tile p-6 sm:p-8">
              <MarkdownRenderer
                content={readmeContent}
                repoName={name}
                defaultBranch={repoDetail?.default_branch}
              />
            </div>
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

        <NextPageLink to="/blog" title="Writing" />
      </div>
    </div>
  );
}
