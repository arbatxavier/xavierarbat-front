/**
 * Admin API client — authenticated CRUD against api.xavierarbat.com.
 *
 * Every mutating call sends the API key via the `X-API-Key` header.
 * GET calls also send the key so the admin can preview unpublished content
 * if the backend ever supports that.
 */

const API = "https://api.xavierarbat.com/api/v1";

// ---------------------------------------------------------------------------
// Types — match the OpenAPI request schemas
// ---------------------------------------------------------------------------

export interface I18nMap {
  en: string;
  es: string;
  ca: string;
}

// -- Projects ---------------------------------------------------------------

export interface ProjectCreateReq {
  slug: string;
  date: string;
  image: string;
  title: I18nMap;
  description: I18nMap;
  content: I18nMap;
  tags: string[];
  imageDisplay: string;
  aspectRatio: string;
  altImages: string[];
}

export interface ProjectUpdateReq {
  date?: string;
  image?: string;
  title?: Partial<I18nMap>;
  description?: Partial<I18nMap>;
  content?: Partial<I18nMap>;
  tags?: string[];
  imageDisplay?: string;
  aspectRatio?: string;
  altImages?: string[];
}

// -- Contacts ---------------------------------------------------------------

export interface ContactCreateReq {
  name: string;
  display: I18nMap;
  value: string;
  link: string | null;
  showInFooter: boolean;
}

export interface ContactUpdateReq {
  display?: Partial<I18nMap>;
  value?: string;
  link?: string | null;
  showInFooter?: boolean;
}

// -- Blogs ------------------------------------------------------------------

export interface BlogCreateReq {
  slug: string;
  date: string;
  title: I18nMap;
  description: I18nMap;
  content: I18nMap;
}

export interface BlogUpdateReq {
  date?: string;
  title?: Partial<I18nMap>;
  description?: Partial<I18nMap>;
  content?: Partial<I18nMap>;
}

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

async function adminFetch<T>(
  path: string,
  apiKey: string,
  opts: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      "Accept-Language": "en",
      ...(opts.headers as Record<string, string>),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }

  // 204 No Content (delete)
  if (res.status === 204) return undefined as unknown as T;

  return res.json();
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const adminProjects = {
  list: (key: string) =>
    adminFetch<unknown[]>("/projects", key),

  detail: (slug: string, key: string, locale = "en") =>
    adminFetch<Record<string, unknown>>(`/projects/${slug}`, key, {
      headers: { "Accept-Language": locale } as Record<string, string>,
    }),

  create: (data: ProjectCreateReq, key: string) =>
    adminFetch<Record<string, unknown>>("/projects", key, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (slug: string, data: ProjectUpdateReq, key: string) =>
    adminFetch<Record<string, unknown>>(`/projects/${slug}`, key, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (slug: string, key: string) =>
    adminFetch<void>(`/projects/${slug}`, key, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// Contacts
// ---------------------------------------------------------------------------

export const adminContacts = {
  list: (key: string) =>
    adminFetch<unknown[]>("/contacts", key),

  create: (data: ContactCreateReq, key: string) =>
    adminFetch<Record<string, unknown>>("/contacts", key, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (name: string, data: ContactUpdateReq, key: string) =>
    adminFetch<Record<string, unknown>>(`/contacts/${name}`, key, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (name: string, key: string) =>
    adminFetch<void>(`/contacts/${name}`, key, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// Blogs
// ---------------------------------------------------------------------------

export const adminBlogs = {
  list: (key: string) =>
    adminFetch<unknown[]>("/blogs", key),

  detail: (slug: string, key: string, locale = "en") =>
    adminFetch<Record<string, unknown>>(`/blogs/${slug}`, key, {
      headers: { "Accept-Language": locale } as Record<string, string>,
    }),

  create: (data: BlogCreateReq, key: string) =>
    adminFetch<Record<string, unknown>>("/blogs", key, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (slug: string, data: BlogUpdateReq, key: string) =>
    adminFetch<Record<string, unknown>>(`/blogs/${slug}`, key, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (slug: string, key: string) =>
    adminFetch<void>(`/blogs/${slug}`, key, { method: "DELETE" }),
};
