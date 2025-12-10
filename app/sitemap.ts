// app/sitemap.ts

import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.ezibreezy.com";

  // The "Traffic Magnets" - High Priority for SEO
  const tools = [
    "instagram-font-generator", // High Volume (10k+)
    "instagram-grid-planner", // High Intent
    "instagram-grid-maker", // Specific Utility
    "instagram-carousel-splitter", // Specific Utility
    "social-image-resizer", // Broad Utility
    "youtube-title-checker", // Niche Utility
    "linkedin-text-formatter", // Niche Utility
    "screenshot-studio", // Niche Utility
  ];

  const staticRoutes = [
    "", // Home
    "/tools", // Tools Hub
    "/about", // Brand Story
    "/privacy", // Compliance
    "/terms", // Compliance
    "/auth/login", // App Entry
    "/auth/signup", // App Entry
  ];

  const toolsSitemap = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9, // High priority for tool pages
  }));

  const staticSitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    // Home is 1.0, Tools Hub is 0.8, others are 0.5
    priority: route === "" ? 1 : route === "/tools" ? 0.8 : 0.5,
  }));

  return [...staticSitemap, ...toolsSitemap];
}
