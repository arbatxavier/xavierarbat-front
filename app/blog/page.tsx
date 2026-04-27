"use client";

import { motion } from "framer-motion";
import { useI18n } from "../i18n/provider";
import { useApiData } from "../hooks/useApiData";
import { fetchBlogs, type BlogPost } from "@/lib/api";

export default function BlogPage() {
  const { t, locale } = useI18n();

  // No local blog data to pre-populate; start empty and fetch from API
  const { data: posts, isRevalidating } = useApiData<BlogPost[]>({
    key: `blogs-${locale}`,
    initialData: [],
    fetcher: () => fetchBlogs(locale),
  });

  const loading = posts.length === 0 && isRevalidating;

  return (
    <section className="pt-28 pb-20 px-6 max-w-4xl mx-auto font-mono">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-surface border border-surface-light rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-surface-light">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-4 text-xs text-foreground/40">
              {t.blog.terminal_prompt}
            </span>
          </div>

          <div className="p-6 space-y-6 text-sm leading-relaxed">
            <div>
              <span className="text-accent-cyan">$ </span>
              <span className="text-foreground/80">{t.blog.terminal_command}</span>
            </div>

            {loading ? (
              <div className="text-foreground/30 pl-[calc(10ch+0.75rem)]">Loading posts...</div>
            ) : (
              posts.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.15 }}
                  className="group relative p-4 -m-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => (window.location.href = `/blog/${post.slug}`)}
                >
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-foreground/30 text-xs shrink-0">
                      {post.date}
                    </span>
                    <h2 className="text-accent group-hover:text-accent-cyan transition-colors font-semibold">
                      {post.title}
                    </h2>
                  </div>
                  <p className="text-foreground/40 pl-[calc(10ch+0.75rem)] group-hover:text-foreground/60 transition-colors">
                    {post.excerpt}
                  </p>
                </motion.div>
              ))
            )}

            {/* Empty state when API returns no posts */}
            {!loading && posts.length === 0 && (
              <div className="text-foreground/30 pl-[calc(10ch+0.75rem)]">
                No posts found.
              </div>
            )}

            <div className="mt-6">
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
