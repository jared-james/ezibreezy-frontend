// app/(marketing)/tools/social-image-resizer/constants.ts

import {
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Smartphone,
  Monitor,
  Square,
  type LucideIcon,
} from "lucide-react";

export interface SocialFormat {
  id: string;
  platform: string;
  label: string;
  width: number;
  height: number;
  aspectRatio: number; // width / height
  icon: LucideIcon;
  description: string;
}

export const SOCIAL_FORMATS: SocialFormat[] = [
  // Instagram
  {
    id: "ig_square",
    platform: "Instagram",
    label: "Square Post",
    width: 1080,
    height: 1080,
    aspectRatio: 1,
    icon: Square,
    description: "The classic 1:1 format.",
  },
  {
    id: "ig_portrait",
    platform: "Instagram",
    label: "Portrait Post",
    width: 1080,
    height: 1350,
    aspectRatio: 0.8,
    icon: Instagram,
    description: "Max screen real estate (4:5).",
  },
  {
    id: "ig_story",
    platform: "Instagram",
    label: "Story / Reel",
    width: 1080,
    height: 1920,
    aspectRatio: 9 / 16,
    icon: Smartphone,
    description: "Vertical format (9:16).",
  },

  // Twitter / X
  {
    id: "tw_post",
    platform: "Twitter",
    label: "Single Image",
    width: 1200,
    height: 675,
    aspectRatio: 16 / 9,
    icon: Twitter,
    description: "Standard landscape feed (16:9).",
  },
  {
    id: "tw_header",
    platform: "Twitter",
    label: "Profile Header",
    width: 1500,
    height: 500,
    aspectRatio: 3,
    icon: Monitor,
    description: "Panoramic profile banner (3:1).",
  },

  // LinkedIn
  {
    id: "li_post",
    platform: "LinkedIn",
    label: "Feed Post",
    width: 1200,
    height: 627,
    aspectRatio: 1.91,
    icon: Linkedin,
    description: "Professional link/image (1.91:1).",
  },

  // Facebook
  {
    id: "fb_cover",
    platform: "Facebook",
    label: "Cover Photo",
    width: 820,
    height: 312,
    aspectRatio: 820 / 312,
    icon: Facebook,
    description: "Page or Profile header.",
  },
];

export const DEFAULT_FORMAT = SOCIAL_FORMATS[1]; // IG Portrait
