// components/landing-page/platform-data.ts

import { ComponentType } from "react";
import {
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
  FacebookIcon,
  TikTokIcon,
  ThreadsIcon,
  PinterestIcon,
} from "./platform-icons";

export type SpecFeature = {
  title: string;
  points: string[];
};

export type PlatformSpec = {
  id: string;
  name: string;
  subtitle: string;
  icon: ComponentType<{ className?: string }>;
  apiStatus: "Active" | "Beta" | "Deprecated";
  uniqueCapability: string;
  features: SpecFeature[];
};

export const PLATFORM_SPECS: PlatformSpec[] = [
  {
    id: "instagram",
    name: "Instagram",
    subtitle: "The Visual Portfolio",
    icon: InstagramIcon,
    apiStatus: "Active",
    uniqueCapability: "Direct Grid Preview",
    features: [
      {
        title: "Post Anywhere",
        points: [
          "Create single images, videos, carousels, Reels, and Stories.",
          "Smart Stories: Upload multiple photos/videos, we auto-split them into individual stories.",
          "Preview how your post will look once published.",
        ],
      },
      {
        title: "Intelligent Media Handling",
        points: [
          "Automatic format optimization for Instagram's requirements.",
          "Custom cropping for each image (4:5 vs 1.91:1).",
          "High-resolution media support with automatic processing.",
        ],
      },
      {
        title: "Advanced Reel Controls",
        points: [
          "Choose whether your Reel appears on your main feed.",
          "Upload custom cover images.",
          "Select the perfect frame for your thumbnail.",
        ],
      },
      {
        title: "Tag Everything",
        points: [
          "Tag people in your photos",
          "Tag products from your catalog to drive sales.",
          "Invite collaborators to co-author posts.",
          "Search and add locations.",
        ],
      },
      {
        title: "Boost Engagement",
        points: ["Pin your first comment to start conversations."],
      },
    ],
  },
  {
    id: "facebook",
    name: "Facebook",
    subtitle: "The Social Graph",
    icon: FacebookIcon,
    apiStatus: "Active",
    uniqueCapability: "Page Management",
    features: [
      {
        title: "Publish Multiple Content Types",
        points: [
          "Create text updates, photos, videos, albums, and carousels (up to 10 images or videos).",
          "Smart Stories: Upload multiple items, we'll auto-split them into stories.",
          "Preview how your post will look before publishing.",
        ],
      },
      {
        title: "Intelligent Optimization",
        points: [
          "Custom cropping for each image to look perfect on Facebook.",
          "Automatic format optimization and video processing.",
        ],
      },
      {
        title: "Tagging & Accessibility",
        points: [
          "Tag Facebook Pages using @mentions.",
          "Search and add locations to increase local discoverability.",
          "Add alt text to images for improved accessibility.",
        ],
      },
      {
        title: "Engagement & Discovery",
        points: ["Pin your first comment to start conversations (Feed posts)."],
      },
      {
        title: "Automatic Link Previews",
        points: [
          "Paste a URL and we automatically generate a rich preview card.",
        ],
      },
    ],
  },
  {
    id: "threads",
    name: "Threads",
    subtitle: "The Conversation",
    icon: ThreadsIcon,
    apiStatus: "Active",
    uniqueCapability: "Native Threading",
    features: [
      {
        title: "Publish Rich Content",
        points: [
          "Create text, images, and videos.",
          "Create mixed carousels with up to 20 photos and videos.",
          "Add links with automatic rich preview cards.",
          "Preview how your post will look before publishing.",
        ],
      },
      {
        title: "True Conversation Threading",
        points: [
          "Create authentic threaded conversations that flow naturally.",
          "Auto-split long text into a connected chain (500 char limit per segment).",
        ],
      },
      {
        title: "Smart Tags & Discovery",
        points: [
          "Add one 'Topic Tag' per post to join conversations.",
          "Tag locations with full address details for local discoverability.",
        ],
      },
      {
        title: "Intelligent Media Handling",
        points: ["Auto-convert unsupported formats (PNG/WEBP) to JPEG."],
      },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    subtitle: "Viral Mechanics",
    icon: TikTokIcon,
    apiStatus: "Active",
    uniqueCapability: "Privacy Toggles",
    features: [
      {
        title: "Publish Videos & Slideshows",
        points: [
          "Share engaging video content up to 10 minutes long.",
          "Create photo carousels with up to 35 images per post.",
          "Preview how your post will look before publishing.",
        ],
      },
      {
        title: "Intelligent Processing",
        points: [
          "Automatic chunked uploads for large video files.",
          "Real-time status tracking confirms your post is live.",
        ],
      },
      {
        title: "Complete Privacy Control",
        points: [
          "Set visibility: Public, Friends, Followers, or Private.",
          "Disable comments, duets, or stitching on any post.",
        ],
      },
      {
        title: "Creator & Brand Tools",
        points: [
          "Mark content as branded/sponsored.",
          "Enable Brand Organic mode for partnerships.",
          "Automatic trending music suggestions.",
        ],
      },
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    subtitle: "The Professional Record",
    icon: LinkedinIcon,
    apiStatus: "Active",
    uniqueCapability: "Smart Article Cards",
    features: [
      {
        title: "Publish Multiple Content Types",
        points: [
          "Share text-only posts for quick insights or announcements.",
          "Publish single images, video posts, or mixed media updates.",
          "Create swipeable document galleries (carousels) with up to 20 images.",
        ],
      },
      {
        title: "Accessibility & Reach",
        points: [
          "Support for Alt Text on images and media assets.",
          "Optimized for Main Feed distribution and Public visibility.",
          "Preview how your post will look before publishing.",
        ],
      },
      {
        title: "Tagging & Discovery",
        points: ["Tag other LinkedIn Pages to increase reach and visibility."],
      },
      {
        title: "Smart Link Previews",
        points: [
          "Auto-detects URLs in text to generate 'Article Share' cards.",
        ],
      },
    ],
  },
  {
    id: "youtube",
    name: "YouTube",
    subtitle: "Broadcast Control",
    icon: YoutubeIcon,
    apiStatus: "Active",
    uniqueCapability: "Compliance & Shorts",
    features: [
      {
        title: "Smart Format Detection",
        points: [
          "Upload standard long-form videos",
          "Auto-detects vertical videos under 60s as YouTube Shorts.",
        ],
      },
      {
        title: "Rich Metadata",
        points: [
          "Full control over Titles (100 chars) and Descriptions (5k chars).",
          "Manage Tags and Categories for SEO discovery.",
          "Preview how your video details will look before publishing.",
        ],
      },
      {
        title: "Custom Thumbnails",
        points: ["Upload separate custom cover images for your videos."],
      },
      {
        title: "Compliance & Privacy",
        points: [
          "Full COPPA 'Made for Kids' flag support.",
          "Set visibility to Public, Private, or Unlisted.",
          "Proactive token refresh prevents failure during long uploads.",
        ],
      },
    ],
  },
  {
    id: "x",
    name: "X (Twitter)",
    subtitle: "The Wire",
    icon: TwitterIcon,
    apiStatus: "Active",
    uniqueCapability: "Native Threading",
    features: [
      {
        title: "Native Threading",
        points: [
          "Create seamless conversation threads that flow naturally.",
          "Full media support in every segment of the thread.",
        ],
      },
      {
        title: "Publish Multiple Content Types",
        points: [
          "Share text-only posts for fast updates.",
          "Publish single images, videos, or mixed media posts.",
          "Attach up to 4 items per Tweet (images, GIFs, or videos).",
        ],
      },
      {
        title: "Tagging & Accessibility",
        points: [
          "Mention users directly using @handles.",
          "Add Alt Text to images for accessibility.",
          "Preview how your post or thread will look before publishing.",
        ],
      },
      {
        title: "Feed Optimization",
        points: [
          "Apply custom crops (e.g., 16:9) specifically optimized for X.",
        ],
      },
    ],
  },
  {
    id: "pinterest",
    name: "Pinterest",
    subtitle: "Visual Discovery",
    icon: PinterestIcon,
    apiStatus: "Active",
    uniqueCapability: "Board Management",
    features: [
      {
        title: "Board Organization",
        points: [
          "Create new Boards directly within the app.",
          "Strict validation ensures every Pin has a destination Board.",
          "Support for Public, Secret, and Protected privacy settings.",
        ],
      },
      {
        title: "Rich Pin Details",
        points: [
          "Add titles and descriptions (up to 500 chars).",
          "Attach destination links to drive traffic to your site.",
          "SEO-friendly Alt Text logic.",
          "Preview how your Pin will look before publishing.",
        ],
      },
      {
        title: "Video Pin Support",
        points: ["Upload videos with custom cover images."],
      },
    ],
  },
];
