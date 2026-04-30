import { MetadataRoute } from "next";
import { SITE_URL, API_BASE } from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, blogs] = await Promise.all([
    fetch(`${API_BASE}/projects`).then((r) => r.json()),
    fetch(`${API_BASE}/blogs`).then((r) => r.json()),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/portfolio`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map((p: { slug: string; date: string }) => ({
    url: `${SITE_URL}/portfolio/${p.slug}`,
    lastModified: p.date,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogs.map((b: { slug: string; date: string }) => ({
    url: `${SITE_URL}/blog/${b.slug}`,
    lastModified: b.date,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}
