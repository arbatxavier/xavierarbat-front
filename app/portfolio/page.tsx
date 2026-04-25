"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "../components/Card";
import { useI18n } from "../i18n/provider";
import type { Project } from "../data/projects";
import type { TagKey } from "../data/tags";

type SortOrder = "desc" | "asc";
type TagState = "include" | "exclude";

export default function PortfolioPage() {
  const { t } = useI18n();
  const [projects, setProjects] = useState<Project[]>([]);
  const [allTags, setAllTags] = useState<TagKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [tagFilters, setTagFilters] = useState<Map<TagKey, TagState>>(
    new Map()
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, tagsRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/tags")
        ]);
        const projData = await projRes.json();
        const tagsData = await tagsRes.json();
        setProjects(projData);
        setAllTags(tagsData);
      } catch (err) {
        console.error("Error fetching portfolio data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Cycle: neutral → include → exclude → neutral
  const toggleTag = useCallback((tag: TagKey) => {
    setTagFilters((prev) => {
      const next = new Map(prev);
      const current = next.get(tag);
      if (!current) {
        next.set(tag, "include");
      } else if (current === "include") {
        next.set(tag, "exclude");
      } else {
        next.delete(tag);
      }
      return next;
    });
  }, []);

  // Sort
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const cmp = a.date.localeCompare(b.date);
      return sortOrder === "desc" ? -cmp : cmp;
    });
  }, [projects, sortOrder]);

  // Filter (AND logic for includes, OR logic for excludes)
  const filteredProjects = useMemo(() => {
    const included = [...tagFilters.entries()]
      .filter(([, v]) => v === "include")
      .map(([k]) => k);
    const excluded = [...tagFilters.entries()]
      .filter(([, v]) => v === "exclude")
      .map(([k]) => k);

    if (included.length === 0 && excluded.length === 0) return sortedProjects;

    return sortedProjects.filter((project) => {
      // Exclude: if project has ANY excluded tag → out
      if (excluded.some((tag) => project.tags.includes(tag))) return false;
      // Include AND: project must have ALL included tags
      if (
        included.length > 0 &&
        !included.every((tag) => project.tags.includes(tag))
      )
        return false;
      return true;
    });
  }, [sortedProjects, tagFilters]);

  const tagStateClass = (tag: TagKey) => {
    const state = tagFilters.get(tag);
    if (state === "include")
      return "border-accent-cyan text-accent-cyan bg-accent-cyan/10";
    if (state === "exclude")
      return "border-red-500/50 text-red-500/50 line-through";
    return "border-surface-light text-foreground/40 hover:text-foreground/60";
  };

  if (loading) {
    return (
      <section className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-foreground/20 italic">Loading gallery...</div>
      </section>
    );
  }

  return (
    <section className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          {t.portfolio.title_prefix}
          <span className="text-accent">{t.portfolio.title_highlight}</span>
        </h1>
        <p className="text-foreground/50 mb-8 max-w-lg">
          {t.portfolio.description}
        </p>
      </motion.div>

      {/* Sort toggle */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setSortOrder("desc")}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
            sortOrder === "desc"
              ? "border-accent text-accent"
              : "border-surface-light text-foreground/40 hover:text-foreground/60"
          }`}
        >
          {t.portfolio.sort_newest}
        </button>
        <button
          onClick={() => setSortOrder("asc")}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
            sortOrder === "asc"
              ? "border-accent text-accent"
              : "border-surface-light text-foreground/40 hover:text-foreground/60"
          }`}
        >
          {t.portfolio.sort_oldest}
        </button>
      </div>

      {/* Tag filters */}
      <div className="mb-8">
        <p className="text-xs text-foreground/30 uppercase tracking-widest mb-3">
          {t.portfolio.filter_label}
        </p>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${tagStateClass(tag)}`}
            >
              {t.tags[tag as keyof typeof t.tags] ?? tag}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry: columnas de arriba a abajo */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
        {filteredProjects.map((project) => {
          const translated =
            t.portfolio.projects[
              project.id as keyof typeof t.portfolio.projects
            ];
          return (
            <div key={project.id} className="break-inside-avoid">
              <Card
                title={translated?.title ?? project.id}
                description={translated?.description}
                date={project.date}
                image={project.image}
                imageDisplay={project.imageDisplay}
                aspectRatio={project.aspectRatio}
                tags={project.tags.map(
                  (tag) => t.tags[tag as keyof typeof t.tags] ?? tag
                )}
                href={`/portfolio/${project.id}`}
              />
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-foreground/30 py-20 text-lg"
        >
          —
        </motion.p>
      )}
    </section>
  );
}
