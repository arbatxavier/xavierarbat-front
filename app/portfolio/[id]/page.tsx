"use client";

import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import { useI18n } from "../../i18n/provider";
import { useApiData } from "../../hooks/useApiData";
import { fallbackProjects } from "../../data/defaults/projects";
import { fallbackTags } from "../../data/defaults/tags";
import { fallbackProjectToLocal, fallbackTagsToLocal } from "../../data/mappers";
import { fetchProjectDetail, fetchTags } from "@/lib/api";
import type { Project } from "../../data/projects";

type ProjectWithContent = Project & {
  description?: string;
  content?: string;
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useI18n();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const localProject = (() => {
    const fb = fallbackProjects.find((p) => p.slug === id);
    return fb ? fallbackProjectToLocal(fb, locale) : null;
  })();

  const { data: project } = useApiData<ProjectWithContent | null>({
    key: `project-${id}-${locale}`,
    initialData: localProject,
    fetcher: () => fetchProjectDetail(id, locale),
  });

  const { data: apiTagLabels } = useApiData<Record<string, string>>({
    key: `tags-${locale}`,
    initialData: fallbackTagsToLocal(fallbackTags, locale),
    fetcher: () => fetchTags(locale),
  });

  const tagLabel = useCallback(
    (tag: string) =>
      apiTagLabels[tag] || t.tags[tag as keyof typeof t.tags] || tag,
    [apiTagLabels, t],
  );

  if (!project) {
    return (
      <section className="pt-28 pb-20 px-6 max-w-5xl mx-auto text-center">
        <p className="text-foreground/50 text-lg">{t.project_detail.not_found}</p>
        <Link
          href="/portfolio"
          className="inline-block mt-6 text-accent hover:text-accent-cyan transition-colors"
        >
          &larr; {t.project_detail.back}
        </Link>
      </section>
    );
  }

  // Prefer API-provided title/description; fall back to i18n
  const translated =
    t.portfolio.projects[project.id as keyof typeof t.portfolio.projects];
  const title = project.title ?? translated?.title ?? project.id;
  const description =
    project.description ??
    project.shortDescription ??
    translated?.description;

  const allImages = [project.image, ...project.altImages];

  return (
    <>
      <section className="pt-28 pb-20 px-6 max-w-6xl mx-auto">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-foreground/40 hover:text-accent transition-colors mb-8"
          >
            &larr; {t.project_detail.back}
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{title}</h1>
          <p className="text-sm text-foreground/30 mb-4">{project.date}</p>
          {description && (
            <p className="text-foreground/50 text-lg max-w-2xl leading-relaxed">
              {description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 bg-surface border border-surface-light text-accent-cyan rounded-lg"
              >
                {tagLabel(tag)}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Main image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`relative w-full bg-surface border border-surface-light rounded-2xl overflow-hidden mb-8 cursor-pointer ${
            project.aspectRatio === "portrait"
              ? "aspect-[3/4] max-w-2xl mx-auto"
              : "aspect-[4/3]"
          }`}
          onClick={() => setSelectedImage(project.image)}
        >
          <Image
            src={project.image}
            alt={title}
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Gallery of alternative images */}
        {project.altImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-foreground/70">
              {t.project_detail.gallery}
              <span className="text-sm font-normal text-foreground/30 ml-3">
                {allImages.length} {t.project_detail.image_count}
              </span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allImages.map((img, i) => (
                <motion.div
                  key={img}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                  className="relative aspect-square bg-surface border border-surface-light rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedImage(img)}
                >
                  <Image
                    src={img}
                    alt={`${title} - ${i + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-background/10 group-hover:bg-transparent transition-colors duration-300" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Content (from API) */}
        {project.content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 max-w-3xl mx-auto text-foreground/70 leading-relaxed whitespace-pre-line"
          >
            {project.content}
          </motion.div>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[90vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt={title}
                fill
                className="object-contain"
              />
              {/* Close button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-surface/80 border border-surface-light rounded-full flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
              >
                ✕
              </button>

              {/* Thumbnails at bottom */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {allImages.map((img, i) => (
                    <button
                      key={img}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(img);
                      }}
                      className={`w-16 h-16 relative rounded-xl overflow-hidden border-2 transition-colors cursor-pointer ${
                        selectedImage === img
                          ? "border-accent"
                          : "border-surface-light hover:border-foreground/30"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
