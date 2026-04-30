import type { Locale } from "@/app/i18n/provider";
import type { FallbackProjectList, FallbackTag, FallbackBlogList, FallbackBlogDetail } from "./defaults/types";
import type { Project } from "./projects";
import {
  IMAGE_DISPLAY_MAP,
  ASPECT_RATIO_MAP,
  CONTACT_STYLE,
  DEFAULT_STYLE,
  type BlogPost,
  type BlogPostDetail,
} from "@/lib/api";
import type { ContactChannel } from "./contacts";
import type { FallbackContact } from "./defaults/types";

export function fallbackProjectToLocal(fb: FallbackProjectList, locale: Locale): Project {
  return {
    id: fb.slug,
    image: fb.image,
    date: fb.date,
    altImages: fb.altImages,
    tags: fb.tags.map((t) => t.toLowerCase()) as Project["tags"],
    imageDisplay: IMAGE_DISPLAY_MAP[fb.imageDisplay] ?? "cover",
    aspectRatio: ASPECT_RATIO_MAP[fb.aspectRatio] ?? "fourthirds",
    title: fb.title[locale],
    shortDescription: fb.shortDescription[locale],
  };
}

export function fallbackProjectsToLocal(fbs: FallbackProjectList[], locale: Locale): Project[] {
  return fbs.map((fb) => fallbackProjectToLocal(fb, locale));
}

export function fallbackContactToLocal(fb: FallbackContact): ContactChannel {
  const style = CONTACT_STYLE[fb.name] ?? DEFAULT_STYLE;
  return {
    key: fb.name,
    display: fb.display,
    href: fb.link ?? fb.value,
    iconName: style.iconName,
    hoverBorder: style.hoverBorder,
    hoverIcon: style.hoverIcon,
    hoverSimple: style.hoverSimple,
    showInFooter: fb.showInFooter,
  };
}

export function fallbackContactsToLocal(fbs: FallbackContact[]): ContactChannel[] {
  return fbs.map(fallbackContactToLocal);
}

export function fallbackBlogListToLocal(fb: FallbackBlogList, locale: Locale): BlogPost {
  return {
    slug: fb.slug,
    date: fb.date,
    title: fb.title[locale],
    excerpt: fb.shortDescription[locale],
  };
}

export function fallbackBlogsToLocal(fbs: FallbackBlogList[], locale: Locale): BlogPost[] {
  return fbs.map((fb) => fallbackBlogListToLocal(fb, locale));
}

export function fallbackBlogDetailToLocal(fb: FallbackBlogDetail, locale: Locale): BlogPostDetail {
  return {
    slug: fb.slug,
    date: fb.date,
    title: fb.title[locale],
    excerpt: fb.description[locale],
    content: fb.content[locale],
  };
}

export function fallbackTagsToLocal(fbs: FallbackTag[], locale: Locale): Record<string, string> {
  const map: Record<string, string> = {};
  for (const fb of fbs) {
    map[fb.key.toLowerCase()] = fb.label[locale];
  }
  return map;
}
