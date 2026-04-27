import { useState, useMemo, useCallback } from "react";
import type { Project } from "../../data/projects";
import type { TagKey } from "../../data/tags";
import { TAG_KEYS } from "../../data/tags";

type SortOrder = "desc" | "asc";
type TagState = "include" | "exclude";

export function usePortfolioFilters(projects: Project[]) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [tagFilters, setTagFilters] = useState<Map<TagKey, TagState>>(new Map());

  const allTags = useMemo<TagKey[]>(() => {
    const fromProjects = new Set(projects.flatMap((p) => p.tags));
    const merged = new Set([...TAG_KEYS, ...fromProjects]);
    return [...merged] as TagKey[];
  }, [projects]);

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

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const cmp = a.date.localeCompare(b.date);
      return sortOrder === "desc" ? -cmp : cmp;
    });
  }, [projects, sortOrder]);

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
      if (included.length > 0 && !included.every((tag) => project.tags.includes(tag)))
        return false;
      return true;
    });
  }, [sortedProjects, tagFilters]);

  return {
    sortOrder,
    setSortOrder,
    tagFilters,
    allTags,
    toggleTag,
    filteredProjects,
  };
}
