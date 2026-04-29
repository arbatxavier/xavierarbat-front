import { MetadataRoute } from "next";

const BASE = "https://xavierarbat.com";
const API = "https://api.xavierarbat.com/api/v1";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, blogs] = await Promise.all([
    fetch(`${API}/projects`).then((r) => r.json()),
    fetch(`${API}/blogs`).then((r) => r.json()),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/portfolio`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map((p: { slug: string; date: string }) => ({
    url: `${BASE}/portfolio/${p.slug}`,
    lastModified: p.date,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogs.map((b: { slug: string; date: string }) => ({
    url: `${BASE}/blog/${b.slug}`,
    lastModified: b.date,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}
