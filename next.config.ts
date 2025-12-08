// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.fbcdn.net" },
      { protocol: "https", hostname: "**.fna.fbcdn.net" },
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  experimental: {
    serverActions: {
      // Kept at 50mb for potential future server actions that handle large payloads.
      // Note: Media uploads now bypass server actions and go directly to the backend API
      // to avoid double-uploading. See lib/api/media-upload.ts
      bodySizeLimit: "50mb",
    },
  },
};

export default nextConfig;
