import type { Project, ImageDisplay, AspectRatio } from "@/app/data/projects";
import type { ContactChannel, IconName } from "@/app/data/contacts";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.xavierarbat.com/api/v1";

// ---------------------------------------------------------------------------
// API DTO types (match the OpenAPI spec)
// ---------------------------------------------------------------------------

export interface ApiProjectList {
  slug: string;
  date: string;
  image: string;
  title: string;
  shortDescription: string;
  tags: string[];
  imageDisplay: string;
  aspectRatio: string;
  altImages: string[];
}

export interface ApiProjectDetail {
  slug: string;
  date: string;
  image: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  imageDisplay: string;
  aspectRatio: string;
  altImages: string[];
}

export interface ApiContact {
  name: string;
  display: string;
  value: string;
  link: string | null;
  showInFooter: boolean;
}

export interface ApiBlogList {
  slug: string;
  date: string;
  title: string;
  shortDescription: string;
}

export interface ApiBlogDetail {
  slug: string;
  date: string;
  title: string;
  description: string;
  content: string;
}

// ---------------------------------------------------------------------------
// Mappers: API → local types
// ---------------------------------------------------------------------------

const IMAGE_DISPLAY_MAP: Record<string, ImageDisplay> = {
  COVER: "cover",
  CONTAIN: "contain",
  TOP: "top",
};

const ASPECT_RATIO_MAP: Record<string, AspectRatio> = {
  PORTRAIT: "portrait",
  SQUARE: "square",
  FOURTHIRDS: "fourthirds",
};

export function apiProjectToLocal(dto: ApiProjectList): Project {
  return {
    id: dto.slug,
    image: dto.image,
    date: dto.date,
    altImages: dto.altImages ?? [],
    tags: dto.tags.map((t) => t.toLowerCase()) as Project["tags"],
    imageDisplay: IMAGE_DISPLAY_MAP[dto.imageDisplay] ?? "cover",
    aspectRatio: ASPECT_RATIO_MAP[dto.aspectRatio] ?? "fourthirds",
    // Extended fields — title & description come pre-translated from the API
    title: dto.title,
    shortDescription: dto.shortDescription,
  };
}

export function apiProjectDetailToLocal(
  dto: ApiProjectDetail,
): Project & { description: string; content: string } {
  return {
    id: dto.slug,
    image: dto.image,
    date: dto.date,
    altImages: dto.altImages ?? [],
    tags: dto.tags.map((t) => t.toLowerCase()) as Project["tags"],
    imageDisplay: IMAGE_DISPLAY_MAP[dto.imageDisplay] ?? "cover",
    aspectRatio: ASPECT_RATIO_MAP[dto.aspectRatio] ?? "fourthirds",
    title: dto.title,
    shortDescription: dto.description,
    description: dto.description,
    content: dto.content,
  };
}

/** Map from contact name (API PK) → icon + hover colours */
const CONTACT_STYLE: Record<
  string,
  {
    iconName: IconName;
    hoverBorder: string;
    hoverIcon: string;
    hoverSimple: string;
  }
> = {
  email: {
    iconName: "FiMail",
    hoverBorder: "hover:border-accent",
    hoverIcon: "group-hover:text-accent",
    hoverSimple: "hover:text-accent",
  },
  whatsapp: {
    iconName: "FaWhatsapp",
    hoverBorder: "hover:border-green-500",
    hoverIcon: "group-hover:text-green-500",
    hoverSimple: "hover:text-green-500",
  },
  phone: {
    iconName: "FiPhone",
    hoverBorder: "hover:border-accent-cyan",
    hoverIcon: "group-hover:text-accent-cyan",
    hoverSimple: "hover:text-accent-cyan",
  },
  github: {
    iconName: "FaGithub",
    hoverBorder: "hover:border-foreground",
    hoverIcon: "group-hover:text-foreground",
    hoverSimple: "hover:text-foreground",
  },
  linkedin: {
    iconName: "FaLinkedinIn",
    hoverBorder: "hover:border-blue-500",
    hoverIcon: "group-hover:text-blue-500",
    hoverSimple: "hover:text-blue-500",
  },
  instagram: {
    iconName: "FaInstagram",
    hoverBorder: "hover:border-pink-500",
    hoverIcon: "group-hover:text-pink-500",
    hoverSimple: "hover:text-pink-500",
  },
  x: {
    iconName: "FaXTwitter",
    hoverBorder: "hover:border-foreground",
    hoverIcon: "group-hover:text-foreground",
    hoverSimple: "hover:text-foreground",
  },
  youtube: {
    iconName: "FaYoutube",
    hoverBorder: "hover:border-red-500",
    hoverIcon: "group-hover:text-red-500",
    hoverSimple: "hover:text-red-500",
  },
};

const DEFAULT_STYLE = {
  iconName: "FiMail" as IconName,
  hoverBorder: "hover:border-accent",
  hoverIcon: "group-hover:text-accent",
  hoverSimple: "hover:text-accent",
};

export function apiContactToLocal(dto: ApiContact): ContactChannel {
  const style = CONTACT_STYLE[dto.name] ?? DEFAULT_STYLE;
  return {
    key: dto.name,
    display: dto.display,
    href: dto.link ?? dto.value,
    iconName: style.iconName,
    hoverBorder: style.hoverBorder,
    hoverIcon: style.hoverIcon,
    hoverSimple: style.hoverSimple,
    showInFooter: dto.showInFooter,
  };
}

// ---------------------------------------------------------------------------
// In-memory cache (per session — cleared on full page reload)
// ---------------------------------------------------------------------------

interface CacheEntry<T> {
  data: T;
  ts: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T) {
  cache.set(key, { data, ts: Date.now() });
}

// ---------------------------------------------------------------------------
// Fetchers (with caching)
// ---------------------------------------------------------------------------

async function apiFetch<T>(path: string, locale: string): Promise<T> {
  const cacheKey = `${path}__${locale}`;
  const cached = getCached<T>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Accept-Language": locale },
  });

  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);

  const data: T = await res.json();
  setCache(cacheKey, data);
  return data;
}

// -- Projects ---------------------------------------------------------------

export async function fetchProjects(locale: string): Promise<Project[]> {
  const dtos = await apiFetch<ApiProjectList[]>("/projects", locale);
  return dtos.map(apiProjectToLocal);
}

export async function fetchProjectDetail(
  slug: string,
  locale: string,
): Promise<(Project & { description: string; content: string }) | null> {
  try {
    const dto = await apiFetch<ApiProjectDetail>(
      `/projects/${slug}`,
      locale,
    );
    return apiProjectDetailToLocal(dto);
  } catch {
    return null;
  }
}

// -- Contacts ---------------------------------------------------------------

export async function fetchContacts(
  locale: string,
): Promise<ContactChannel[]> {
  const dtos = await apiFetch<ApiContact[]>("/contacts", locale);
  return dtos.map(apiContactToLocal);
}

// -- Blogs ------------------------------------------------------------------

// -- Tags -------------------------------------------------------------------

export interface ApiTag {
  key: string;
  label: string;
}

/** Returns a map of lowercase tag key → translated label */
export async function fetchTags(
  locale: string,
): Promise<Record<string, string>> {
  const dtos = await apiFetch<ApiTag[]>("/tags", locale);
  const map: Record<string, string> = {};
  for (const dto of dtos) {
    map[dto.key.toLowerCase()] = dto.label;
  }
  return map;
}

// -- Blogs ------------------------------------------------------------------

export interface BlogPost {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
}

export interface BlogPostDetail extends BlogPost {
  content: string;
}

export async function fetchBlogs(locale: string): Promise<BlogPost[]> {
  const dtos = await apiFetch<ApiBlogList[]>("/blogs", locale);
  return dtos.map((d) => ({
    slug: d.slug,
    date: d.date,
    title: d.title,
    excerpt: d.shortDescription,
  }));
}

export async function fetchBlogDetail(
  slug: string,
  locale: string,
): Promise<BlogPostDetail | null> {
  try {
    const dto = await apiFetch<ApiBlogDetail>(`/blogs/${slug}`, locale);
    return {
      slug: dto.slug,
      date: dto.date,
      title: dto.title,
      excerpt: dto.description,
      content: dto.content,
    };
  } catch {
    return null;
  }
}
