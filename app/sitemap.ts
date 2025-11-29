// app/sitemap.ts

import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.ezibreezy.com";

  const tools = [
    "screenshot-studio",
    "instagram-carousel-splitter",
    "instagram-grid-maker",
    "instagram-grid-planner",
    "linkedin-text-formatter",
    "youtube-title-checker",
    // New high-volume SEO tools planned
    "instagram-font-generator",
    "instagram-caption-generator",
    "instagram-bio-generator",
  ];

  const staticRoutes = [
    "",
    "/about",
    "/tools",
    "/privacy",
    "/terms",
    "/auth/login",
    "/auth/signup",
  ];

  const toolsSitemap = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const staticSitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.6,
  }));

  return [...staticSitemap, ...toolsSitemap];
}
