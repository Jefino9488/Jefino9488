/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import Reveal from "./Reveal";
import NextPageLink from "./NextPageLink";
import { motion, useScroll, useSpring } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

const blogPosts: Record<number, () => Promise<any>> = {
  3: () => import("@/blogPosts/post3.json"),
  4: () => import("@/blogPosts/post4.json"),
};

const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    /* Deliberately dark code chip — stays readable on the sage field */
    <div className="my-6 overflow-hidden rounded-xl border border-[#1d2a24] bg-[#0d1512]">
      <div className="flex items-center justify-between border-b border-[#1d2a24] bg-[#121c17] px-4 py-2">
        <span className="font-mono text-[11px] text-[#5f6f66]">code</span>
        <button
          onClick={handleCopy}
          aria-label="Copy code"
          className="flex items-center gap-1.5 font-mono text-xs text-[#93a39a] transition-colors hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-success" />
              <span className="text-success">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-xs leading-relaxed text-[#e9ede7] sm:text-sm">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

const CardNotFound = () => (
  <div className="theme-light flex min-h-[60vh] items-center justify-center bg-sage p-4 pb-24 lg:pb-4">
    <div className="tile max-w-md space-y-4 p-8 text-center sm:p-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
        404
      </p>
      <h1 className="text-2xl font-semibold">Article not found</h1>
      <p className="text-sm leading-relaxed text-fg-muted">
        The documentation or publication you&apos;re looking for doesn&apos;t
        exist or has been relocated.
      </p>
      <Link
        to="/blog"
        className="press inline-flex items-center gap-2 rounded-full bg-sage-ink px-5 py-2.5 text-xs font-medium text-sage transition-all hover:bg-primary hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to writing
      </Link>
    </div>
  </div>
);

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [copyingPage, setCopyingPage] = useState(false);

  const toc = useMemo(() => {
    if (!post?.content?.sections) return [];
    return post.content.sections
      .map((sec: any, index: number) => {
        if (sec.title) return { id: `section-${index}`, title: sec.title };
        return null;
      })
      .filter(Boolean) as { id: string; title: string }[];
  }, [post]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const loadPost = async () => {
      const postId = Number(id);
      if (isNaN(postId) || !blogPosts[postId]) {
        setPost(null);
        return;
      }
      try {
        const loadedPost = await blogPosts[postId]();
        setPost(loadedPost.default || loadedPost);
      } catch (e) {
        console.error("Failed to load post", e);
        setPost(null);
      }
    };

    loadPost();
  }, [id]);

  const handleCopyPageUrl = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyingPage(true);
      setTimeout(() => setCopyingPage(false), 2000);
    });
  };

  if (!post) {
    return <CardNotFound />;
  }

  return (
    <div className="theme-light min-h-screen bg-sage">
      {/* Reading progress */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-primary"
        style={{ scaleX }}
      />

      <div className="mx-auto max-w-[90rem] space-y-14 px-4 pb-24 pt-10 sm:px-8 sm:pt-12">
        {/* Title header */}
        <Reveal>
          <div className="space-y-6">
            <Link
              to="/blog"
              className="group inline-flex items-center gap-2 font-mono text-xs text-fg-muted transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              All writing
            </Link>

            <div className="space-y-5 border-b border-line pb-10">
              <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] tabular-nums text-fg-faint">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.date}
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readTime || `${post.reading_time_minutes} min read`}
                </span>
              </div>

              <h1
                className="max-w-[20ch] text-balance font-poppins font-semibold leading-[1.06]"
                style={{
                  fontSize: "clamp(1.9rem, 4.5vw, 3.25rem)",
                  letterSpacing: "-0.035em",
                }}
              >
                {post.title}
              </h1>

              <p className="max-w-2xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
                {post.content?.introduction || post.excerpt}
              </p>

              <button
                onClick={handleCopyPageUrl}
                className="press inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/70 px-3.5 py-1.5 font-mono text-[11px] text-fg-muted backdrop-blur-sm transition-colors hover:border-line-strong hover:text-foreground"
              >
                {copyingPage ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-success" />
                    <span className="text-success">Link copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy article link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Reveal>

        {/* Content + TOC */}
        <div className="relative flex flex-col gap-12 lg:flex-row">
          <article className="w-full max-w-[65ch] flex-1 space-y-12">
            {post.coverImage && (
              <Reveal>
                <div className="overflow-hidden rounded-3xl border border-line bg-surface">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-auto w-full object-cover"
                  />
                </div>
              </Reveal>
            )}

            <div className="space-y-14">
              {post.content?.sections?.map((section: any, index: number) => (
                <Reveal key={index}>
                  <section
                    id={`section-${index}`}
                    className="scroll-mt-28 space-y-5"
                  >
                    {section.title && (
                      <div className="space-y-2">
                        <p className="font-mono text-[11px] tabular-nums text-primary">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <h2 className="type-title">{section.title}</h2>
                      </div>
                    )}

                    <div className="space-y-4">
                      {section.content &&
                        (Array.isArray(section.content) ? (
                          section.content.map((para: string, i: number) => (
                            <p
                              key={i}
                              className="text-pretty text-[15px] leading-[1.75] text-fg-muted sm:text-base"
                            >
                              {para}
                            </p>
                          ))
                        ) : (
                          <p className="text-pretty text-[15px] leading-[1.75] text-fg-muted sm:text-base">
                            {section.content}
                          </p>
                        ))}
                    </div>

                    {(section.image || section.img_url) && (
                      <figure className="my-6">
                        <div className="overflow-hidden rounded-2xl border border-line bg-inset">
                          <img
                            src={section.image || section.img_url}
                            alt={section.title || "Section illustration"}
                            className="h-auto w-full"
                          />
                        </div>
                        {(section.caption || section.img_description) && (
                          <figcaption className="mt-2.5 text-center font-mono text-[11px] text-fg-faint">
                            {section.caption || section.img_description}
                          </figcaption>
                        )}
                      </figure>
                    )}

                    {section.list && (
                      <ul className="my-4 space-y-2.5">
                        {section.list.map((item: string, i: number) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 rounded-xl border border-line bg-surface/60 p-3.5 text-sm leading-relaxed text-fg-muted"
                          >
                            <span className="mt-0.5 font-mono text-xs text-primary">
                              ›
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.code && <CodeBlock code={section.code} />}

                    {section.externalLink && (
                      <a
                        href={section.externalLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="press mt-2 inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-2 font-mono text-xs text-primary backdrop-blur-sm transition-colors hover:border-line-strong"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {section.externalLink.label}
                      </a>
                    )}
                  </section>
                </Reveal>
              ))}
            </div>
          </article>

          {/* Table of contents — hairline list */}
          {toc.length > 0 && (
            <aside className="hidden w-52 shrink-0 lg:block">
              <nav
                aria-label="Table of contents"
                className="sticky top-24 space-y-3 border-l border-line py-1 pl-5"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-faint">
                  Contents
                </p>
                <ul className="space-y-2.5 text-xs">
                  {toc.map((item, index) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="block leading-snug text-fg-muted transition-colors hover:text-foreground"
                      >
                        <span className="mr-1.5 font-mono text-[10px] tabular-nums text-primary">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="line-clamp-2">{item.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}
        </div>

        {/* Back link */}
        <div className="border-t border-line pt-8">
          <Link
            to="/blog"
            className="group inline-flex items-center gap-2 font-mono text-xs text-fg-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to writing
          </Link>
        </div>

        <NextPageLink to="/about" title="About" />
      </div>
    </div>
  );
}
