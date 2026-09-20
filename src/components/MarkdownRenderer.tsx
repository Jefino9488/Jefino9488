import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  repoName?: string;
  defaultBranch?: string;
  className?: string;
}

const CodeBlock = ({
  language,
  value,
}: {
  language?: string;
  value: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="my-5 overflow-hidden rounded-xl border border-line bg-inset text-left">
      <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-2 text-xs">
        <span className="font-mono text-[11px] lowercase text-fg-muted">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          aria-label="Copy code"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-fg-muted transition-colors hover:text-foreground"
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
      <div className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-foreground sm:text-sm">
        <pre className="m-0 p-0">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
};

const resolveUrl = (
  url?: string,
  repoName?: string,
  defaultBranch = "main",
  isImage = false,
): string => {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("#") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  if (!repoName) return url;
  const cleanPath = url.replace(/^\.?\//, "");
  if (isImage) {
    return `https://raw.githubusercontent.com/Jefino9488/${repoName}/${defaultBranch}/${cleanPath}`;
  }
  return `https://github.com/Jefino9488/${repoName}/blob/${defaultBranch}/${cleanPath}`;
};

export default function MarkdownRenderer({
  content,
  repoName,
  defaultBranch = "main",
  className = "",
}: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <div
      className={`markdown-body w-full max-w-none text-foreground ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          table: ({ children, ...props }) => (
            <div className="my-6 w-full overflow-x-auto rounded-xl border border-line bg-surface/50 shadow-sm">
              <table
                className="w-full border-collapse text-left font-mono text-xs sm:text-sm"
                {...props}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead
              className="border-b border-line bg-elevated/80 text-[11px] font-semibold uppercase tracking-wider text-foreground"
              {...props}
            >
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody className="divide-y divide-line/60" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr className="transition-colors hover:bg-elevated/30" {...props}>
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => (
            <th className="px-4 py-3 font-semibold text-foreground" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="px-4 py-3 align-top text-fg-muted" {...props}>
              {children}
            </td>
          ),
          h1: ({ children, ...props }) => (
            <h1
              className="mb-4 mt-8 border-b border-line pb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="mb-3 mt-8 border-b border-line/60 pb-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="mb-2 mt-6 text-base font-semibold text-primary sm:text-lg"
              {...props}
            >
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4
              className="mb-2 mt-4 text-sm font-semibold uppercase tracking-wider text-foreground"
              {...props}
            >
              {children}
            </h4>
          ),
          p: ({ children, ...props }) => (
            <p
              className="my-3 text-pretty text-sm leading-relaxed text-fg-muted sm:text-base"
              {...props}
            >
              {children}
            </p>
          ),
          a: ({ href, children, ...props }) => {
            if (!href) return <span {...props}>{children}</span>;
            const isExternal = href.startsWith("http");
            const resolved = resolveUrl(
              href,
              repoName,
              defaultBranch,
              false,
            );
            return (
              <a
                href={resolved}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary-hover hover:decoration-primary"
                {...props}
              >
                {children}
              </a>
            );
          },
          img: ({ src, alt, ...props }) => {
            const resolved = resolveUrl(
              src,
              repoName,
              defaultBranch,
              true,
            );
            return (
              <img
                src={resolved}
                alt={alt || ""}
                loading="lazy"
                className="my-1.5 inline-block max-w-full rounded"
                {...props}
              />
            );
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code: ({ className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const val = String(children).replace(/\n$/, "");
            const isMultiLine = val.includes("\n") || Boolean(match);
            if (isMultiLine) {
              return (
                <CodeBlock
                  language={match ? match[1] : undefined}
                  value={val}
                />
              );
            }
            return (
              <code
                className="rounded-md border border-line bg-inset px-1.5 py-0.5 font-mono text-[12px] text-foreground"
                {...props}
              >
                {children}
              </code>
            );
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pre: ({ children }: any) => <>{children}</>,
          ul: ({ children, ...props }) => (
            <ul
              className="my-3 ml-5 list-disc space-y-1.5 text-sm leading-relaxed text-fg-muted"
              {...props}
            >
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol
              className="my-3 ml-5 list-decimal space-y-1.5 font-mono text-sm leading-relaxed text-fg-muted"
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="pl-1" {...props}>
              {children}
            </li>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="my-4 rounded-r-lg border-l-2 border-primary/70 bg-inset/40 py-2.5 pl-4 pr-3 text-xs italic leading-relaxed text-fg-muted sm:text-sm"
              {...props}
            >
              {children}
            </blockquote>
          ),
          hr: (props) => <hr className="my-6 border-line" {...props} />,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          input: ({ type, checked, ...props }: any) => {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="mr-2 inline-block rounded border-line bg-inset text-primary accent-primary"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
