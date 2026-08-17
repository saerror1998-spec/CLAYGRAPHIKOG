import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { site } from "@/data/siteContent";

const SITE_URL = site.website;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: Array<{ route: string; priority: number }> = [
    { route: "", priority: 1 },
    { route: "/work", priority: 0.9 },
    { route: "/services", priority: 0.9 },
    { route: "/about", priority: 0.7 },
    { route: "/contact", priority: 0.8 },
    { route: "/privacy", priority: 0.3 },
    { route: "/terms", priority: 0.3 },
  ];

  const projectRoutes = projects.map((p) => ({
    route: `/work/${p.slug}`,
    priority: 0.6,
  }));
  const serviceRoutes = services.map((s) => ({
    route: `/services/${s.slug}`,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...serviceRoutes].map(({ route, priority }) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
