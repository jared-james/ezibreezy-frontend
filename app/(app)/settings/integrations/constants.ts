// app/(app)/settings/integrations/constants.ts

// constants.ts
import {
  Twitter,
  Linkedin,
  Youtube,
  Instagram,
  Facebook,
  AtSign,
  Music2,
} from "lucide-react";
import { PlatformDefinition } from "./types";

export const platformDefinitions: PlatformDefinition[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    description:
      "Connect your Instagram accounts to publish posts, carousels, and Reels.",
  },
  {
    id: "facebook",
    name: "Facebook Page",
    icon: Facebook,
    description:
      "Connect your Facebook Page to publish posts, photos, and videos.",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    description: "Connect your LinkedIn profile to publish articles and posts.",
  },
  {
    id: "x",
    name: "Twitter / X",
    icon: Twitter,
    description: "Connect your X accounts to post and schedule threads.",
  },
  {
    id: "threads",
    name: "Threads",
    icon: AtSign,
    description:
      "Connect your Threads profile to publish text, images, and videos.",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music2,
    description: "Connect your TikTok account to publish videos.",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    description: "Connect your YouTube channel to manage video content.",
  },
];
