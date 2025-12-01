// lib/constants/social-platforms.ts

export const PLATFORM_LIMITS = {
  facebook: {
    post: 5000,
    story: 5000, // Though stories are usually text overlays, user requested 5000
    comment: 5000,
  },
  instagram: {
    caption: 2200,
    story: 120, // Notification/Scheduled text
    comment: 2196,
  },
  x: {
    free: 280,
    premium: 25000,
  },
  linkedin: {
    post: 3000,
    comment: 1248,
  },
  pinterest: {
    description: 500,
    title: 100,
  },
  tiktok: {
    caption: 2200,
  },
  threads: {
    post: 500,
    topic: 50,
  },
  bluesky: {
    post: 300,
  },
  google_business: {
    post: 1500,
  },
  youtube: {
    shorts: 5000,
  },
};
