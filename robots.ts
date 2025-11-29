// robots.ts

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.ezibreezy.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Prevent crawlers from wasting time on private/auth routes
      disallow: [
        "/dashboard/",
        "/settings/",
        "/calendar/",
        "/editorial/",
        "/ideas/",
        "/assets/",
        "/analytics/",
        "/api/", // Keep API private unless specific public endpoints exist
        "/auth/", // Login/Signup flows don't need indexing
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
