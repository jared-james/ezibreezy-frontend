// app/(marketing)/tools/social-image-resizer/constants.ts

import {
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Smartphone,
  Monitor,
  Square,
  CircleUser,
  Youtube,
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
  round?: boolean; // New property for circular preview
}

export const SOCIAL_FORMATS: SocialFormat[] = [
  // --- Instagram ---
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
  {
    id: "ig_profile",
    platform: "Instagram",
    label: "Profile Pic",
    width: 320,
    height: 320,
    aspectRatio: 1,
    icon: CircleUser,
    description: "Circular avatar display.",
    round: true,
  },

  // --- Twitter / X ---
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
  {
    id: "tw_profile",
    platform: "Twitter",
    label: "Profile Pic",
    width: 400,
    height: 400,
    aspectRatio: 1,
    icon: CircleUser,
    description: "Circular avatar display.",
    round: true,
  },

  // --- LinkedIn ---
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
  {
    id: "li_profile",
    platform: "LinkedIn",
    label: "Profile Pic",
    width: 400,
    height: 400,
    aspectRatio: 1,
    icon: CircleUser,
    description: "Circular avatar display.",
    round: true,
  },

  // --- YouTube ---
  {
    id: "yt_thumb",
    platform: "YouTube",
    label: "Thumbnail",
    width: 1280,
    height: 720,
    aspectRatio: 16 / 9,
    icon: Youtube,
    description: "High res video thumbnail.",
  },
  {
    id: "yt_profile",
    platform: "YouTube",
    label: "Channel Icon",
    width: 800,
    height: 800,
    aspectRatio: 1,
    icon: CircleUser,
    description: "Circular channel avatar.",
    round: true,
  },

  // --- Facebook ---
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
