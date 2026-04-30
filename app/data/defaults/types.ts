/**
 * Fallback data types — mirrors API DTOs exactly so fallback responses
 * are indistinguishable from real API responses.
 */

export type Locale = "en" | "es" | "ca";

export interface FallbackProjectList {
  slug: string;
  date: string;
  image: string;
  title: Record<Locale, string>;
  shortDescription: Record<Locale, string>;
  tags: string[];
  imageDisplay: string;
  aspectRatio: string;
  altImages: string[];
}

export interface FallbackTag {
  key: string;
  label: Record<Locale, string>;
}

export interface FallbackContact {
  name: string;
  display: string;
  value: string;
  link: string | null;
  showInFooter: boolean;
}

export interface FallbackBlogList {
  slug: string;
  date: string;
  title: Record<Locale, string>;
  shortDescription: Record<Locale, string>;
}

export interface FallbackBlogDetail extends FallbackBlogList {
  description: Record<Locale, string>;
  content: Record<Locale, string>;
}
