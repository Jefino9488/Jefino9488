import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Star, GitFork } from "lucide-react";
import { Github } from "./icons/Github";
import { Linkedin } from "./icons/Linkedin";
import { useProjects } from "./ProjectsContext";
import { useGitHubData } from "@/components/GitHubContext";
import { getBlogPosts, type BlogPost } from "@/services/blogService";
import Reveal from "./Reveal";
import CountUp from "./CountUp";
import ContributionGraph from "./ContributionGraph";

const TECH_MARQUEE = [
  "Python",
  "TypeScript",
  "React",
  "FastAPI",
  "Node.js",
  "PyTorch",
  "TensorFlow",
  "Android Internals",
  "Linux",
  "Docker",
  "Tailwind CSS",
];

function Kicker({ index, label }: { index: string; label: string }) {
  return (
    <p className="label-bracket font-mono text-[11px] uppercase tracking-[0.22em] text-fg-faint">
      {index}
      <span className="mx-2 text-primary">·</span>
      {label}
    </p>
  );
}

function StaggeredLine({
  words,
  muted = false,
  baseDelay,
}: {
  words: string[];
  muted?: boolean;
  baseDelay: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="block overflow-hidden pb-1">
      {words.map((word, wi) => (
        <motion.span
          key={wi}
          className={`inline-block ${muted ? "text-fg-muted" : ""}`}
          initial={reduceMotion ? false : { y: "112%" }}
          animate={{ y: 0 }}
          transition={{
            delay: baseDelay + wi * 0.055,
            duration: 0.75,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {word}
          {" "}
        </motion.span>
      ))}
    </span>
  );
}

export default function Home() {
  const { pinnedProjects, allProjects } = useProjects();
  const { profile, stats, languages } = useGitHubData();
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    getBlogPosts().then((posts) => {
      setLatestPosts(posts.slice(0, 3));
    });
  }, []);

  const fallbackFlagships = [
    {
      title: "frameworkpatcher",
      name: "FrameworkPatcher",
      description:
        "Automated framework for modifying Android system JARs and generating reproducible flashable modules.",
      tech: ["Python", "Android", "Automation"],
      stats: { stars: 97, forks: 84 },
      link: "https://github.com/Jefino9488/FrameworkPatcher",
      problem:
        "Vendor ROM patching means fragile manual bytecode edits and endless decompile-recompile loops.",
    },
    {
      title: "fastboot-flasher",
      name: "Fastboot Flasher",
      description:
        "Cross-platform automation utility for device partitioning, flashing, and Android boot recovery workflows.",
      tech: ["Batch", "Shell", "Android"],
      stats: { stars: 39, forks: 15 },
      link: "https://github.com/Jefino9488/Fastboot-Flasher",
    },
    {
      title: "aiwebtester",
      name: "AIWebTester",
      description:
        "AI-assisted automated browser testing suite leveraging vision models and autonomous agent flows.",
      tech: ["TypeScript", "Python", "AI"],
      stats: { stars: 12, forks: 4 },
      link: "https://github.com/Jefino9488",
    },
  ];

  const featuredProjects = fallbackFlagships.map((fallback) => {
    const matched = [...pinnedProjects, ...allProjects].find(
      (p) =>
        p.title.toLowerCase() === fallback.title.toLowerCase() ||
        p.title.toLowerCase().includes(fallback.title.toLowerCase()),
    );
    if (matched) {
      return {
        ...fallback,
        title: matched.title,
        name:
          matched.title.charAt(0).toUpperCase() +
          matched.title.slice(1).replace(/-/g, " "),
        description: matched.description || fallback.description,
        tech: matched.tech.length > 0 ? matched.tech : fallback.tech,
        stats: matched.stats.stars > 0 ? matched.stats : fallback.stats,
        link: matched.link,
      };
    }
    return fallback;
  });

  const skillsList = [
    { category: "Languages", items: ["Python", "TypeScript", "JavaScript", "Java", "Bash"] },
    { category: "Frameworks", items: ["React", "Node.js", "Express", "FastAPI", "Tailwind"] },
    { category: "Systems & AI", items: ["Android Internals", "Linux", "TensorFlow", "PyTorch", "Docker"] },
  ];

  const totalLangBytes = languages.reduce((sum, [, b]) => sum + b, 0) || 1;
  const topLanguages = [...languages]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name, bytes]) => ({
      name,
      pct: Math.round((bytes / totalLangBytes) * 100),
    }));

  const exploreLinks = [
    {
      to: "/projects",
      index: "01",
      title: "Work",
      description:
        "Case studies and the full repository archive — systems tools, AI agents, web platforms.",
    },
    {
      to: "/blog",
      index: "02",
      title: "Writing",
      description:
        "Notes on engineering, AI agents, Android internals, and things I'm building.",
    },
    {
      to: "/about",
      index: "03",
      title: "About",
      description:
        "Who I am, what I focus on, my journey so far — plus a way to reach me.",
    },
    {
      to: "/certificates",
      index: "04",
      title: "Credentials",
      description:
        "A verified registry of professional certifications across ML, networking, and automation.",
    },
  ];

  return (
    <div className="pb-16 text-foreground">
      <div className="relative mx-auto max-w-[90rem] px-4 sm:px-8">
        {/* ================================================================ */}
        {/* Hero — concrete-poetry manifesto                                  */}
        {/* ================================================================ */}
        <div aria-hidden className="ambient-glow -top-40 right-0 h-[30rem] w-[30rem]" />

        <section className="relative flex min-h-[88dvh] flex-col justify-center pb-12 pt-28 lg:min-h-[90dvh] lg:pt-24">
          <p
            aria-hidden
            className="section-marker absolute right-0 top-24 hidden text-fg-faint lg:block"
          >
            N.001
          </p>

          <h1
            className="font-poppins font-semibold leading-[0.98]"
            style={{ fontSize: "clamp(2.9rem, 7.5vw, 6.75rem)", letterSpacing: "-0.045em" }}
            aria-label="I build software, automation and tools."
          >
            <StaggeredLine words={["I", "build", "software,"]} baseDelay={0.15} />
            <span className="block pl-[8vw] sm:pl-[6vw]">
              <StaggeredLine
                words={["automation", "&"]}
                baseDelay={0.33}
              />
            </span>
            <StaggeredLine words={["tools."]} muted baseDelay={0.48} />
          </h1>

          <div className="mt-10 grid items-end gap-12 md:grid-cols-[1fr_auto] md:gap-14">
            <div>
              <Reveal delay={0.45}>
                <p className="max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
                  Full-stack developer focused on AI, Android systems tooling,
                  and open-source software — building fast, reliable,
                  maintainable architectures.
                </p>
              </Reveal>

              <Reveal delay={0.52}>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link
                    to="/projects"
                    className="press inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background shadow-card transition-all hover:bg-white"
                  >
                    View work
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <a
                    href="https://github.com/Jefino9488"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub profile"
                    className="press inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface/60 text-fg-muted backdrop-blur-sm transition-colors hover:border-line-strong hover:text-foreground"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/jefino9488/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn profile"
                    className="press inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface/60 text-fg-muted backdrop-blur-sm transition-colors hover:border-line-strong hover:text-foreground"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href="mailto:jefinojacob9488@gmail.com"
                    aria-label="Email Jefino"
                    className="press inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface/60 font-mono text-xs text-fg-muted backdrop-blur-sm transition-colors hover:border-line-strong hover:text-foreground"
                  >
                    @
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Portrait — offset frame + technical corner ticks */}
            <Reveal delay={0.55} y={26} className="justify-self-start md:justify-self-end">
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute -right-3 -top-3 h-full w-full rounded-4xl border border-line-strong transition-colors duration-500"
                />
                {["-left-4 -top-4 border-l border-t", "-right-4 -top-4 border-r border-t", "-bottom-4 -left-4 border-b border-l", "-bottom-4 -right-4 border-b border-r"].map(
                  (pos) => (
                    <span
                      key={pos}
                      aria-hidden
                      className={`absolute ${pos} h-3 w-3 border-primary/50`}
                    />
                  ),
                )}
                <div className="relative h-40 w-40 overflow-hidden rounded-4xl border border-line bg-surface shadow-lift sm:h-48 sm:w-48">
                  <img
                    src="/profile/profile_anime.jpg"
                    alt="Jefino"
                    className="h-full w-full object-cover grayscale-[35%] transition-all duration-700 hover:scale-[1.03] hover:grayscale-0"
                    width="192"
                    height="192"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Tech ticker */}
          <Reveal delay={0.62} className="mt-16">
            <div className="relative overflow-hidden border-y border-line py-4" aria-hidden>
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
              <div className="marquee-track items-center gap-12">
                {[...TECH_MARQUEE, ...TECH_MARQUEE].map((tech, i) => (
                  <span
                    key={i}
                    className="flex shrink-0 items-center gap-12 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.28em] text-fg-faint"
                  >
                    {tech}
                    <span className="h-1 w-1 rounded-full bg-primary/60" />
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ================================================================ */}
        {/* 01 — Bento board                                                 */}
        {/* ================================================================ */}
        <section className="pb-24 pt-4">
          <Reveal>
            <Kicker index="01" label="Selected work & telemetry" />
            <div aria-hidden className="mt-4 h-px w-full bg-gradient-to-r from-line-strong to-transparent" />
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-4 md:auto-rows-fr md:grid-cols-3">
            {/* Flagship — large tile */}
            <Reveal className="md:col-span-2" delay={0.05}>
              <article className="tile tile-interactive group h-full p-7 sm:p-9">
                <Link
                  to={`/projects/${featuredProjects[0].title}`}
                  aria-label={`${featuredProjects[0].name} case study`}
                  className="absolute inset-0 z-10 rounded-[1.375rem]"
                >
                  <span className="sr-only">{featuredProjects[0].name}</span>
                </Link>
                <a
                  href={featuredProjects[0].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${featuredProjects[0].name} on GitHub`}
                  className="absolute right-5 top-5 z-20 rounded-full p-2 text-fg-faint transition-colors hover:text-foreground"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </a>

                <div className="flex h-full flex-col justify-between gap-8">
                  <div className="space-y-4">
                    <p className="font-mono text-[11px] tabular-nums text-primary">001 — Flagship</p>
                    <h2 className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary sm:text-3xl">
                      {featuredProjects[0].name}
                    </h2>
                    <p className="max-w-lg text-pretty text-sm leading-relaxed text-fg-muted sm:text-base">
                      {featuredProjects[0].description}
                    </p>
                    <p className="max-w-lg border-l-2 border-line-strong pl-4 text-xs leading-relaxed text-fg-faint sm:text-sm">
                      {featuredProjects[0].problem}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {featuredProjects[0].tech.map((t) => (
                        <span key={t} className="rounded-full border border-line bg-inset px-2.5 py-1 font-mono text-[10px] text-fg-muted">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 font-mono text-xs text-fg-muted">
                      <span className="flex items-center gap-1.5"><Star className="h-3 w-3 text-warm" /><span className="tabular-nums">{featuredProjects[0].stats.stars}</span></span>
                      <span className="flex items-center gap-1.5"><GitFork className="h-3 w-3" /><span className="tabular-nums">{featuredProjects[0].stats.forks}</span></span>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>

            {/* Telemetry */}
            <Reveal delay={0.1}>
              <div className="tile flex h-full flex-col justify-between gap-6 p-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-faint">
                  Live telemetry
                </p>
                <dl className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <dd className="font-mono text-xl font-medium">
                      {typeof profile?.public_repos === "number" ? (
                        <CountUp value={profile.public_repos} />
                      ) : (
                        "—"
                      )}
                    </dd>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-faint">Repos</dt>
                  </div>
                  <div className="space-y-1">
                    <dd className="font-mono text-xl font-medium">
                      {typeof stats?.totalStars === "number" ? (
                        <CountUp value={stats.totalStars} suffix="+" />
                      ) : (
                        "—"
                      )}
                    </dd>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-faint">Stars</dt>
                  </div>
                  <div className="space-y-1">
                    <dd className="font-mono text-xl font-medium">
                      {typeof stats?.totalPullRequests === "number" ? (
                        <CountUp value={stats.totalPullRequests} />
                      ) : (
                        "—"
                      )}
                    </dd>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-faint">PRs</dt>
                  </div>
                </dl>

                <div className="space-y-2.5">
                  {topLanguages.length > 0 ? (
                    topLanguages.map((lang) => (
                      <div key={lang.name} className="space-y-1.5">
                        <div className="flex justify-between font-mono text-[10px] text-fg-muted">
                          <span>{lang.name}</span>
                          <span className="tabular-nums text-fg-faint">{lang.pct}%</span>
                        </div>
                        <div className="h-1 overflow-hidden rounded-full bg-elevated">
                          <div
                            className="h-full rounded-full bg-primary/70 transition-all duration-700"
                            style={{ width: `${lang.pct}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-2.5">
                      {[72, 58, 41, 27].map((w) => (
                        <div key={w} className="h-1 overflow-hidden rounded-full bg-elevated">
                          <div className="h-full rounded-full bg-primary/30" style={{ width: `${w}%` }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>

            {/* Project tiles 2 & 3 */}
            {featuredProjects.slice(1).map((project, i) => (
              <Reveal key={project.title} delay={0.12 + i * 0.06}>
                <article className="tile tile-interactive group h-full p-7">
                  <Link
                    to={`/projects/${project.title}`}
                    aria-label={`${project.name} case study`}
                    className="absolute inset-0 z-10 rounded-[1.375rem]"
                  >
                    <span className="sr-only">{project.name}</span>
                  </Link>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${project.name} on GitHub`}
                    className="absolute right-4 top-4 z-20 rounded-full p-1.5 text-fg-faint transition-colors hover:text-foreground"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>

                  <div className="flex h-full flex-col justify-between gap-6">
                    <div className="space-y-3">
                      <p className="font-mono text-[11px] tabular-nums text-primary">
                        00{i + 2}
                      </p>
                      <h3 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-primary sm:text-xl">
                        {project.name}
                      </h3>
                      <p className="line-clamp-3 text-sm leading-relaxed text-fg-muted">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech.slice(0, 3).map((t) => (
                          <span key={t} className="rounded-full border border-line bg-inset px-2 py-0.5 font-mono text-[10px] text-fg-muted">
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="flex items-center gap-1 font-mono text-[11px] tabular-nums text-fg-muted">
                        <Star className="h-3 w-3 text-warm" />
                        {project.stats.stars}
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}

            {/* Stack tile */}
            <Reveal delay={0.2}>
              <div className="tile h-full space-y-5 p-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-faint">
                  Stack
                </p>
                <div className="space-y-4">
                  {skillsList.map((group) => (
                    <div key={group.category} className="space-y-2">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-faint">
                        {group.category}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-line bg-elevated px-2.5 py-1 font-mono text-[11px] text-foreground transition-colors hover:border-line-strong"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Writing tile */}
            <Reveal delay={0.24} className="md:col-span-2">
              <div className="tile flex h-full flex-col gap-4 p-7">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-faint">
                    Recent writing
                  </p>
                  <Link to="/blog" className="group/link inline-flex items-center gap-1 font-mono text-[11px] text-fg-muted transition-colors hover:text-foreground">
                    All articles
                    <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
                  </Link>
                </div>

                {latestPosts.length > 0 ? (
                  <ul className="divide-y divide-line">
                    {latestPosts.map((post) => {
                      const formattedDate = new Date(post.published_at).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                      );
                      const inner = (
                        <>
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                              {post.title}
                            </h3>
                            <p className="mt-0.5 font-mono text-[10px] tabular-nums text-fg-faint">
                              {formattedDate} · {post.reading_time_minutes} min read
                            </p>
                          </div>
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-fg-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                        </>
                      );
                      const rowClass =
                        "group -mx-2 flex items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-elevated/60";

                      return (
                        <li key={post.id}>
                          {post.isLocal ? (
                            <Link to={`/blog/${post.localId}`} className={rowClass}>{inner}</Link>
                          ) : (
                            <a href={post.url} target="_blank" rel="noopener noreferrer" className={rowClass}>{inner}</a>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="space-y-3 py-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-4 w-1/2" />
                    <div className="skeleton h-4 w-2/3" />
                  </div>
                )}
              </div>
            </Reveal>

            {/* About tile */}
            <Reveal delay={0.28}>
              <div className="tile flex h-full flex-col justify-between gap-6 p-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-faint">
                  Background
                </p>
                <p className="text-sm leading-relaxed text-fg-muted">
                  AI &amp; Data Science undergrad in Chennai turning complex,
                  repetitive technical workflows into fast, reproducible software
                  — from Android internals to LLM agents.
                </p>
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-1.5 font-mono text-xs text-primary"
                >
                  More about me
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 02 — Activity                                                    */}
        {/* ================================================================ */}
        <section className="pb-24">
          <Reveal>
            <Kicker index="02" label="Activity" />
            <div aria-hidden className="mt-4 h-px w-full bg-gradient-to-r from-line-strong to-transparent" />
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-8">
              <ContributionGraph />
            </div>
          </Reveal>
        </section>

        {/* ================================================================ */}
        {/* 03 — Explore — every page                                        */}
        {/* ================================================================ */}
        <section className="pb-8">
          <Reveal>
            <Kicker index="03" label="Explore" />
            <div aria-hidden className="mt-4 h-px w-full bg-gradient-to-r from-line-strong to-transparent" />
          </Reveal>

          <div className="border-t border-line">
            {exploreLinks.map((link, i) => (
              <Reveal key={link.to} delay={Math.min(i * 0.05, 0.2)}>
                <Link
                  to={link.to}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-line py-7 transition-colors sm:gap-8 sm:py-8"
                >
                  <span aria-hidden className="index-num text-4xl leading-none sm:text-5xl">
                    {link.index}
                  </span>

                  <span className="min-w-0 space-y-1.5">
                    <span className="block text-xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-primary sm:text-2xl">
                      {link.title}
                    </span>
                    <span className="block max-w-lg text-sm leading-relaxed text-fg-muted">
                      {link.description}
                    </span>
                  </span>

                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface transition-all duration-300 group-hover:-rotate-45 group-hover:border-primary group-hover:bg-primary sm:h-12 sm:w-12">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
