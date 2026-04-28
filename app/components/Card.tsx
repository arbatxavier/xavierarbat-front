"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import type { ImageDisplay, AspectRatio } from "../data/projects";

const aspectClasses: Record<AspectRatio, string> = {
  fourthirds: "aspect-[4/3]",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
};

const fitClasses: Record<ImageDisplay, string> = {
  cover: "object-cover",
  contain: "object-contain",
  top: "object-cover object-top",
};

interface CardProps {
  title: string;
  description?: string;
  date?: string;
  image?: string;
  imageDisplay?: ImageDisplay;
  aspectRatio?: AspectRatio;
  tags?: string[];
  href?: string;
  children?: ReactNode;
  className?: string;
}

export default function Card({
  title,
  description,
  date,
  image,
  imageDisplay = "cover",
  aspectRatio = "fourthirds",
  tags,
  href,
  children,
  className = "",
}: CardProps) {
  const content = (
    <>
      {image && (
        <div
          className={`relative ${aspectClasses[aspectRatio]} overflow-hidden ${
            imageDisplay === "contain" ? "bg-surface" : ""
          }`}
        >
          <Image
            src={image}
            alt={title}
            fill
            className={`${fitClasses[imageDisplay]} group-hover:scale-105 transition-transform duration-500`}
          />
          <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-300" />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {date && (
            <span className="text-xs text-foreground/30 shrink-0">{date}</span>
          )}
        </div>
        {description && (
          <p className="text-sm text-foreground/60 leading-relaxed line-clamp-1">
            {description}
          </p>
        )}
        {tags && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-surface-light text-accent-cyan rounded-lg"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {children}
      </div>
    </>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`group bg-surface border border-surface-light rounded-2xl overflow-hidden hover:border-accent/50 transition-colors duration-300 ${href ? "cursor-pointer" : ""} ${className}`}
    >
      {href ? (
        <Link href={href}>{content}</Link>
      ) : (
        content
      )}
    </motion.article>
  );
}
