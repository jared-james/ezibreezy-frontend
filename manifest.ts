// manifest.ts

import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EziBreezy | Editorial Desk",
    short_name: "EziBreezy",
    description:
      "Draft, visualize, and schedule content for Instagram, LinkedIn, and X without the spreadsheet chaos.",
    start_url: "/",
    display: "standalone",
    background_color: "#fdfbf7",
    theme_color: "#246339",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
