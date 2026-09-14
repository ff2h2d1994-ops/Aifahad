import type { MetadataRoute } from "next";
import { getServices, getProjects } from "@/lib/data/fetch";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const [services, projects] = await Promise.all([getServices(), getProjects()]);

  const staticRoutes = ["", "/services", "/portfolio", "/about", "/contact", "/request"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${siteUrl}/services/${s.slug}`,
    lastModified: new Date(),
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${siteUrl}/portfolio/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes];
}
