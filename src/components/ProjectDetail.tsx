import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Star,
  GitFork,
  Code2,
  Eye,
  CheckCircle2,
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

// Case study structured data for key projects
const caseStudyData: Record<
  string,
  {
    problem: string;
    approach: string;
    architecture: string[];
    challenges: string;
    results: string;
  }
> = {
  frameworkpatcher: {
    problem:
      "Android OEM frameworks (such as HyperOS/MIUI) enforce deep proprietary restrictions. Customizing system behavior traditionally required laborious manual smali decompilation, patching, and recompilation after every system OTA update.",
    approach:
      "Built a deterministic Python framework that ingests raw vendor framework JARs, applies structured regex and AST-based bytecode patches, validates class definitions, and automatically packages flashable Magisk/KernelSU root modules.",
    architecture: [
      "Input: OEM system framework.jar & services.jar",
      "Decompiler: Smali/Baksmali AST parser",
      "Patch Engine: Rule-based signature matching & bytecode transformer",
      "Packager: Automated flashable Magisk/KSU module builder",
    ],
    challenges:
      "Managing varying class offsets across different Android API versions (Android 12 through 15) and handling heavily obfuscated vendor bytecode without breaking ART compilation.",
    results:
      "Over 95+ stars and 80+ forks. Adopted widely by Android ROM builders and modders to achieve 100% automated, one-command framework patch generation.",
  },
  "fastboot-flasher": {
    problem:
      "Flashing modern Android partition tables with dynamic partitions and A/B slots is prone to human error, resulting in hard/soft bricked devices during recovery or ROM installation.",
    approach:
      "Developed a robust shell and scripting automation toolkit that inspects active slot metadata, verifies partition hash integrity before flashing, and provides safe failover recovery loops.",
    architecture: [
      "Device Prober: Fastboot device handshake & variable detection",
      "Slot Manager: Active/inactive slot validation (slot_a/slot_b)",
      "Flash Pipeline: Multi-partition sequential execution with error catching",
      "Post-Flash: Reboot state verification & recovery trigger",
    ],
    challenges:
      "Standardizing fastboot protocol discrepancies across diverse vendor implementations (Qualcomm, MediaTek, Tensor).",
    results:
      "Zero-brick automated flashing experience used across dozens of device communities.",
  },
  aiwebtester: {
    problem:
      "Traditional end-to-end browser automation (Selenium/Cypress) is brittle—selectors frequently break on minor UI refactors and writing test coverage for complex dynamic web apps is time-consuming.",
    approach:
      "Constructed an AI-native browser test runner that interprets high-level natural language test instructions (e.g. 'Verify user can complete checkout') into multimodal perception and browser actions.",
    architecture: [
      "Test Spec: Natural language scenario definitions",
      "Perception Engine: DOM snapshotting + visual screenshot analysis",
      "Agent Planner: LLM-driven step-by-step action planning",
      "Execution Driver: Playwright action execution & assertion reporting",
    ],
    challenges:
      "Minimizing token costs and latency while ensuring deterministic assertion validation on rapid asynchronous state transitions.",
    results:
      "Self-healing end-to-end test execution with instant visual anomaly reporting.",
  },
};

export default function ProjectDetail() {
  const { name } = useParams<{ name: string }>();
  const { allProjects, pinnedProjects } = useProjects();
  const [repoDetail, setRepoDetail] = useState<RepoDetail | null>(null);
  const [readmeContent, setReadmeContent] = useState<string>("");
  const [readmeLoading, setReadmeLoading] = useState(true);

  const project = [...pinnedProjects, ...allProjects].find(
    (p) => p.title.toLowerCase() === name?.toLowerCase(),
  );

  const matchedCaseStudy = name ? caseStudyData[name.toLowerCase()] : undefined;

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
              <span className="font-semibold tracking-[0.18em] text-primary uppercase">Case study</span>
              <span>·</span>
              <span className="uppercase">
                {repoDetail?.language || project?.tech[0] || "Software"}
              </span>
              {repoDetail?.updated_at && (
                <>
                  <span>·</span>
                  <span className="tabular-nums">Updated {formatDate(repoDetail.updated_at)}</span>
                </>
              )}
            </div>

            <h1
              className="max-w-[20ch] text-balance font-poppins font-semibold leading-[1.02]"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.04em" }}
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
                value: repoDetail?.stargazers_count ?? project?.stats.stars ?? "--",
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
              <div
                key={label}
                className="tile space-y-1 p-4"
              >
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
              : project?.tech ?? []
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

        {/* Structured Case Study */}
        {matchedCaseStudy && (
          <div className="space-y-10 border-t border-line pt-10">
            <div className="space-y-3">
              <p className="font-mono text-[11px] tabular-nums text-primary">01</p>
              <h2 className="type-title">The problem</h2>
              <p className="max-w-2xl text-pretty text-sm leading-relaxed text-fg-muted sm:text-base">
                {matchedCaseStudy.problem}
              </p>
            </div>

            <div className="space-y-3 border-t border-line pt-10">
              <p className="font-mono text-[11px] tabular-nums text-primary">02</p>
              <h2 className="type-title">Approach &amp; solution</h2>
              <p className="max-w-2xl text-pretty text-sm leading-relaxed text-fg-muted sm:text-base">
                {matchedCaseStudy.approach}
              </p>
            </div>

            <div className="space-y-4 border-t border-line pt-10">
              <p className="font-mono text-[11px] tabular-nums text-primary">03</p>
              <h2 className="type-title">System architecture</h2>
              <div className="tile divide-y divide-line p-2">
                {matchedCaseStudy.architecture.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 px-4 py-3 text-xs sm:text-sm">
                    <span className="shrink-0 font-mono font-semibold tabular-nums text-primary">
                      0{idx + 1}.
                    </span>
                    <span className="text-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-line pt-10">
              <p className="font-mono text-[11px] tabular-nums text-primary">04</p>
              <h2 className="type-title">Challenges &amp; results</h2>
              <p className="max-w-2xl text-pretty text-sm leading-relaxed text-fg-muted sm:text-base">
                {matchedCaseStudy.challenges}
              </p>
              <div className="tile mt-4 flex items-start gap-3 p-5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <p className="text-xs leading-relaxed text-foreground sm:text-sm">
                  {matchedCaseStudy.results}
                </p>
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
              Full documentation and code samples available in the GitHub repository.
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
