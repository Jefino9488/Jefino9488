import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowUpRight, X } from "lucide-react";
import PageHeader from "./PageHeader";
import Reveal from "./Reveal";
import NextPageLink from "./NextPageLink";
import { getBlogPosts, type BlogPost } from "@/services/blogService";

function PostSkeleton() {
  return (
    <div className="space-y-3 border-b border-line py-7">
      <div className="skeleton h-3 w-40" />
      <div className="skeleton h-6 w-3/4" />
      <div className="skeleton h-3.5 w-full" />
    </div>
  );
}

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    getBlogPosts()
      .then((fetchedPosts) => setPosts(fetchedPosts))
      .catch((err) => console.error("Error fetching blog posts:", err))
      .finally(() => setLoading(false));
  }, []);

  const standardCategories = ["All", "Engineering", "AI", "Projects", "Documentation"];

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = searchTerm
        ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.description.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      if (!matchesSearch) return false;
      if (!selectedTag || selectedTag === "All") return true;

      const tagLower = selectedTag.toLowerCase();
      return (
        post.tag_list?.some((t) => t.toLowerCase().includes(tagLower)) ||
        post.title.toLowerCase().includes(tagLower) ||
        (selectedTag === "Documentation" && post.isLocal) ||
        (selectedTag === "Projects" && (post.tag_list?.includes("project") || post.isLocal))
      );
    });
  }, [posts, searchTerm, selectedTag]);

  return (
    <div className="theme-light min-h-screen">
      <PageHeader title="Writing & Publications" meta={`${posts.length} Articles`} />

      <div className="relative mx-auto max-w-[90rem] space-y-12 px-4 pb-24 pt-10 sm:px-8 sm:pt-12">
        {/* Editorial intro */}
        <Reveal>
          <div aria-hidden className="ambient-glow -top-16 -left-16 h-64 w-64" />
          <div className="relative space-y-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-faint">
              Notes from the workbench
            </p>
            <h1
              className="max-w-[16ch] text-balance font-poppins font-semibold leading-[1.02]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", letterSpacing: "-0.04em" }}
            >
              Writing on systems, agents &amp; tooling.
            </h1>
            <p className="max-w-xl text-pretty text-sm leading-relaxed text-fg-muted sm:text-base">
              Thoughts on software engineering, AI agents, Android system
              internals, and things I&apos;m building.
            </p>
          </div>
        </Reveal>

        {/* Filters */}
        <Reveal delay={0.08}>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-1.5">
              {standardCategories.map((category) => {
                const isActive =
                  category === "All"
                    ? selectedTag === "" || selectedTag === "All"
                    : selectedTag === category;

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedTag(category === "All" ? "" : category)}
                    aria-pressed={isActive}
                    className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition-all ${
                      isActive
                        ? "border-line-strong bg-elevated font-medium text-sage-ink"
                        : "border-line bg-transparent text-fg-muted hover:border-line-strong hover:text-sage-ink"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-faint" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search articles"
                className="w-full rounded-full border border-line bg-surface/70 py-2 pl-10 pr-9 font-mono text-xs text-foreground backdrop-blur-sm transition-colors placeholder:text-fg-faint focus:border-primary focus:outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-faint transition-colors hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </Reveal>

        {/* Article index */}
        {loading ? (
          <div>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="border-t border-line">
            {filteredPosts.map((post, idx) => {
              const formattedDate = new Date(post.published_at).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric", year: "numeric" },
              );

              const content = (
                <>
                  <div className="flex items-center justify-between gap-4 font-mono text-[11px] tabular-nums text-fg-faint">
                    <span className="flex items-center gap-3">
                      <span className="text-primary">{String(idx + 1).padStart(2, "0")}</span>
                      <span>{formattedDate}</span>
                      {post.isLocal && (
                        <span className="rounded-full border border-line bg-elevated px-2 py-0.5 text-[9px] uppercase tracking-wider text-primary">
                          Docs
                        </span>
                      )}
                    </span>
                    <span>{post.reading_time_minutes} min</span>
                  </div>

                  <h2 className="pt-2 text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl">
                    {post.title}
                  </h2>

                  <p className="line-clamp-2 pt-1.5 text-sm leading-relaxed text-fg-muted">
                    {post.description}
                  </p>
                </>
              );

              const rowClass =
                "group relative block border-b border-line py-7 transition-colors";

              return (
                <Reveal key={post.id} delay={Math.min(idx * 0.05, 0.25)}>
                  {post.isLocal ? (
                    <Link to={`/blog/${post.localId}`} className={rowClass}>
                      {content}
                      <ArrowUpRight className="absolute bottom-8 right-0 h-4 w-4 text-fg-faint opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100" />
                    </Link>
                  ) : (
                    <a href={post.url} target="_blank" rel="noopener noreferrer" className={rowClass}>
                      {content}
                      <ArrowUpRight className="absolute bottom-8 right-0 h-4 w-4 text-fg-faint opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100" />
                    </a>
                  )}
                </Reveal>
              );
            })}
          </div>
        ) : (
          <Reveal>
            <div className="tile space-y-3 p-10 text-center">
              <p className="font-mono text-sm text-fg-muted">No articles match your filters.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTag("");
                }}
                className="press mx-auto block rounded-full border border-line bg-elevated px-4 py-2 font-mono text-xs text-sage-ink transition-colors hover:border-line-strong"
              >
                Clear filters
              </button>
            </div>
          </Reveal>
        )}

        <NextPageLink to="/about" title="About" />
      </div>
    </div>
  );
}
