/**
 * Admin API client — authenticated CRUD against api.xavierarbat.com.
 *
 * Every mutating call sends the API key via the `X-API-Key` header.
 * GET calls also send the key so the admin can preview unpublished content
 * if the backend ever supports that.
 */

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.xavierarbat.com/api/v1";

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

// -- Auth ------------------------------------------------------------------

export interface LoginReq {
  username: string;
  password: string;
}

export interface LoginRes {
  token: string;
}

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

async function adminFetch<T>(
  path: string,
  token: string,
  opts: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept-Language": "en",
    ...(opts.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers,
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
// Auth
// ---------------------------------------------------------------------------

export const adminAuth = {
  login: (data: LoginReq) =>
    adminFetch<LoginRes>("/auth/login", "", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ---------------------------------------------------------------------------
// Tags
// ---------------------------------------------------------------------------

export interface TagCreateReq {
  key: string;
  label?: string | null;
}

export interface TagUpdateReq {
  label: string;
}

export const adminTags = {
  list: (token: string) =>
    adminFetch<{ key: string; label: string }[]>("/tags", token),

  detail: (tagKey: string, token: string) =>
    adminFetch<{ key: string; label: string }>(`/tags/${tagKey}`, token),

  create: (data: TagCreateReq, token: string) =>
    adminFetch<{ key: string; label: string }>("/tags", token, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (tagKey: string, data: TagUpdateReq, token: string) =>
    adminFetch<{ key: string; label: string }>(`/tags/${tagKey}`, token, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (tagKey: string, token: string) =>
    adminFetch<void>(`/tags/${tagKey}`, token, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const adminProjects = {
  list: (token: string) =>
    adminFetch<unknown[]>("/projects", token),

  detail: (slug: string, token: string, locale = "en") =>
    adminFetch<Record<string, unknown>>(`/projects/${slug}`, token, {
      headers: { "Accept-Language": locale } as Record<string, string>,
    }),

  create: (data: ProjectCreateReq, token: string) =>
    adminFetch<Record<string, unknown>>("/projects", token, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (slug: string, data: ProjectUpdateReq, token: string) =>
    adminFetch<Record<string, unknown>>(`/projects/${slug}`, token, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (slug: string, token: string) =>
    adminFetch<void>(`/projects/${slug}`, token, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// Contacts
// ---------------------------------------------------------------------------

export const adminContacts = {
  list: (token: string) =>
    adminFetch<unknown[]>("/contacts", token),

  create: (data: ContactCreateReq, token: string) =>
    adminFetch<Record<string, unknown>>("/contacts", token, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (name: string, data: ContactUpdateReq, token: string) =>
    adminFetch<Record<string, unknown>>(`/contacts/${name}`, token, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (name: string, token: string) =>
    adminFetch<void>(`/contacts/${name}`, token, { method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// Blogs
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

const API_ROOT = process.env.NEXT_PUBLIC_API_ROOT || "https://api.xavierarbat.com";

export const adminImages = {
  /** Returns an array of URL paths like ["/uploads/projects/foo.jpg", ...] */
  list: (folder: string, token: string) =>
    adminFetch<string[]>(`/images/${folder}`, token),

  /** Upload a file via multipart/form-data. Returns { url: "/uploads/..." } */
  upload: async (folder: string, file: File, token: string): Promise<string> => {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${API}/images/${folder}`, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${token}`
      },
      body: form,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status}: ${text}`);
    }

    const data: Record<string, string> = await res.json();
    return data.url ?? data.path ?? Object.values(data)[0] ?? "";
  },

  delete: (folder: string, filename: string, token: string) =>
    adminFetch<void>(`/images/${folder}/${filename}`, token, {
      method: "DELETE",
    }),

  /** Resolve a path like "/uploads/projects/foo.jpg" to a full URL */
  publicUrl: (path: string) =>
    path.startsWith("http") ? path : `${API_ROOT}${path}`,
};

// ---------------------------------------------------------------------------
// Blogs
// ---------------------------------------------------------------------------

export const adminBlogs = {
  list: (token: string) =>
    adminFetch<unknown[]>("/blogs", token),

  detail: (slug: string, token: string, locale = "en") =>
    adminFetch<Record<string, unknown>>(`/blogs/${slug}`, token, {
      headers: { "Accept-Language": locale } as Record<string, string>,
    }),

  create: (data: BlogCreateReq, token: string) =>
    adminFetch<Record<string, unknown>>("/blogs", token, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (slug: string, data: BlogUpdateReq, token: string) =>
    adminFetch<Record<string, unknown>>(`/blogs/${slug}`, token, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (slug: string, token: string) =>
    adminFetch<void>(`/blogs/${slug}`, token, { method: "DELETE" }),
};
