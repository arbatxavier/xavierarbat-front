"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import Card from "../components/Card";
import { useI18n } from "../i18n/provider";
import { useApiData } from "../hooks/useApiData";
import { projects as localProjects } from "../data/projects";
import { TAG_KEYS } from "../data/tags";
import { fetchProjects } from "@/lib/api";
import type { Project } from "../data/projects";
import type { TagKey } from "../data/tags";

type SortOrder = "desc" | "asc";
type TagState = "include" | "exclude";

export default function PortfolioPage() {
  const { t, locale } = useI18n();

  // Stale-while-revalidate: start with local data, refresh from API
  const { data: projects } = useApiData<Project[]>({
    key: `projects-${locale}`,
    initialData: localProjects,
    fetcher: () => fetchProjects(locale),
  });

  // Extract unique tags from projects (API may have new tags)
  const allTags = useMemo<TagKey[]>(() => {
    const fromProjects = new Set(projects.flatMap((p) => p.tags));
    // Merge with static TAG_KEYS so we never lose known tags
    const merged = new Set([...TAG_KEYS, ...fromProjects]);
    return [...merged] as TagKey[];
  }, [projects]);

  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [tagFilters, setTagFilters] = useState<Map<TagKey, TagState>>(
    new Map()
  );

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
      if (excluded.some((tag) => project.tags.includes(tag))) return false;
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

      {/* Masonry: columns from top to bottom */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
        {filteredProjects.map((project) => {
          // Prefer API-provided title/description; fall back to i18n
          const translated =
            t.portfolio.projects[
              project.id as keyof typeof t.portfolio.projects
            ];
          const title =
            project.title ?? translated?.title ?? project.id;
          const description =
            project.shortDescription ?? translated?.description;

          return (
            <div key={project.id} className="break-inside-avoid">
              <Card
                title={title}
                description={description}
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
