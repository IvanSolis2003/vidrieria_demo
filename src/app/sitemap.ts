import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getCategorias, getBlogPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categorias, posts] = await Promise.all([getCategorias(), getBlogPosts()]);

  const estaticas: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/productos`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/proyectos`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/nosotros`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/contacto`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/cotizar`, changeFrequency: "monthly", priority: 0.9 },
  ];

  const categoriaUrls: MetadataRoute.Sitemap = categorias.map((c) => ({
    url: `${siteUrl}/cotizar?categoria=${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogUrls: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...estaticas, ...categoriaUrls, ...blogUrls];
}
