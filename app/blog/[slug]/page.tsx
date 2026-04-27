"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useI18n } from "../../i18n/provider";
import { useApiData } from "../../hooks/useApiData";
import { fetchBlogDetail, type BlogPostDetail } from "@/lib/api";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale } = useI18n();

  const { data: post, isRevalidating } = useApiData<BlogPostDetail | null>({
    key: `blog-${slug}-${locale}`,
    initialData: null,
    fetcher: () => fetchBlogDetail(slug, locale),
  });

  const loading = !post && isRevalidating;

  if (loading) {
    return (
      <section className="pt-28 pb-20 px-6 max-w-4xl mx-auto font-mono">
        <div className="text-foreground/30 text-sm">—</div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="pt-28 pb-20 px-6 max-w-4xl mx-auto text-center">
        <p className="text-foreground/50 text-lg">{t.blog.not_found}</p>
        <Link
          href="/blog"
          className="inline-block mt-6 text-accent hover:text-accent-cyan transition-colors"
        >
          &larr; {t.blog.back}
        </Link>
      </section>
    );
  }

  return (
    <section className="pt-28 pb-20 px-6 max-w-4xl mx-auto font-mono">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-block mb-8 text-sm text-foreground/40 hover:text-accent-cyan transition-colors"
        >
          &larr; {t.blog.back}
        </Link>

        {/* Terminal window */}
        <div className="bg-surface border border-surface-light rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-surface-light">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-4 text-xs text-foreground/40">
              {t.blog.terminal_prompt}
            </span>
          </div>

          <div className="p-6 md:p-8 space-y-6 text-sm leading-relaxed">
            {/* Command */}
            <div className="w-fit">
              <span className="text-accent-cyan">$ </span>
              <span className="text-foreground/80">cat </span>
              <Link
                href="/blog"
                className="text-foreground/80 hover:text-accent-cyan transition-colors"
              >
                ./blog/posts/
              </Link>
              <span className="text-foreground/80">{slug}.md</span>
            </div>

            {/* Header */}
            <div className="border-b border-surface-light pb-4">
              <span className="text-foreground/30 text-xs">{post.date}</span>
              <h1 className="text-xl md:text-2xl font-bold text-foreground mt-1">
                {post.title}
              </h1>
              <p className="text-foreground/40 mt-2 italic">{post.excerpt}</p>
            </div>

            {/* Markdown body */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose-blog"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => (
                    <p className="text-foreground/70 leading-7 mb-4">{children}</p>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold text-foreground mt-8 mb-3">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold text-foreground mt-6 mb-2">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">
                      {children}
                    </h3>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-cyan underline underline-offset-4 decoration-accent-cyan/40 hover:decoration-accent-cyan transition-colors"
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-foreground font-semibold">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="text-foreground/60 italic">{children}</em>
                  ),
                  code: ({ children, className }) => {
                    const isBlock = className?.includes("language-");
                    return isBlock ? (
                      <code className="block bg-background border border-surface-light rounded-lg p-4 text-accent-cyan text-xs overflow-x-auto my-4 leading-6">
                        {children}
                      </code>
                    ) : (
                      <code className="bg-background border border-surface-light rounded px-1.5 py-0.5 text-accent-cyan text-xs">
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre className="bg-background border border-surface-light rounded-lg p-4 overflow-x-auto my-4">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-accent pl-4 my-4 text-foreground/50 italic">
                      {children}
                    </blockquote>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-foreground/70 space-y-1 mb-4 pl-2">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-foreground/70 space-y-1 mb-4 pl-2">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-7">{children}</li>
                  ),
                  img: ({ src, alt }) => (
                    <span className="block my-6">
                      <img
                        src={src}
                        alt={alt || ""}
                        className="rounded-xl w-full object-cover border border-surface-light"
                      />
                      {alt && (
                        <span className="block text-center text-foreground/30 text-xs mt-2 italic">
                          {alt}
                        </span>
                      )}
                    </span>
                  ),
                  hr: () => <hr className="border-surface-light my-6" />,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </motion.div>

            {/* Cursor */}
            <div className="pt-2">
              <span className="text-accent-cyan">$ </span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-4 bg-accent-cyan align-middle"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
