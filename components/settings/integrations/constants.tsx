// components/settings/integrations/constants.tsx

"use client";

import { SocialIcon } from "@/components/ui/social-icon";
import { PlatformDefinition } from "./types";

// Create wrapper components for each platform
const InstagramIcon = ({ className }: { className?: string }) => {
  return <SocialIcon network="instagram" className={className} style={{ height: "100%", width: "100%" }} />;
};

const FacebookIcon = ({ className }: { className?: string }) => {
  return <SocialIcon network="facebook" className={className} style={{ height: "100%", width: "100%" }} />;
};

const LinkedinIcon = ({ className }: { className?: string }) => {
  return <SocialIcon network="linkedin" className={className} style={{ height: "100%", width: "100%" }} />;
};

const TwitterIcon = ({ className }: { className?: string }) => {
  return <SocialIcon network="x" className={className} style={{ height: "100%", width: "100%" }} />;
};

const ThreadsIcon = ({ className }: { className?: string }) => {
  return <SocialIcon network="threads" className={className} style={{ height: "100%", width: "100%" }} />;
};

const TikTokIcon = ({ className }: { className?: string }) => {
  return <SocialIcon network="tiktok" className={className} style={{ height: "100%", width: "100%" }} />;
};

const YouTubeIcon = ({ className }: { className?: string }) => {
  return <SocialIcon network="youtube" className={className} style={{ height: "100%", width: "100%" }} />;
};

const PinterestIcon = ({ className }: { className?: string }) => {
  return <SocialIcon network="pinterest" className={className} style={{ height: "100%", width: "100%" }} />;
};

export const platformDefinitions: PlatformDefinition[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: InstagramIcon,
    description:
      "Connect your Instagram accounts to publish posts, carousels, and Reels.",
  },
  {
    id: "facebook",
    name: "Facebook Page",
    icon: FacebookIcon,
    description:
      "Connect your Facebook Page to publish posts, photos, and videos.",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: LinkedinIcon,
    description: "Connect your LinkedIn profile to publish articles and posts.",
  },
  {
    id: "x",
    name: "Twitter / X",
    icon: TwitterIcon,
    description: "Connect your X accounts to post and schedule threads.",
  },
  {
    id: "threads",
    name: "Threads",
    icon: ThreadsIcon,
    description:
      "Connect your Threads profile to publish text, images, and videos.",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: TikTokIcon,
    description: "Connect your TikTok account to publish videos.",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: YouTubeIcon,
    description: "Connect your YouTube channel to manage video content.",
  },
  {
    id: "pinterest",
    name: "Pinterest",
    icon: PinterestIcon,
    description: "Connect your Pinterest account to publish Pins.",
  },
];
