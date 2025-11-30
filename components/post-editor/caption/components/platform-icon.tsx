// components/post-editor/caption/components/platform-icon.tsx

import {
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  AtSign,
  Music2,
  Youtube,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformIconProps {
  platformId: string;
  className?: string;
}

export function PlatformIcon({ platformId, className }: PlatformIconProps) {
  const Icon =
    platformId === "x"
      ? Twitter
      : platformId === "instagram"
      ? Instagram
      : platformId === "facebook"
      ? Facebook
      : platformId === "linkedin"
      ? Linkedin
      : platformId === "threads"
      ? AtSign
      : platformId === "tiktok"
      ? Music2
      : platformId === "youtube"
      ? Youtube
      : null;

  if (!Icon) return null;

  return <Icon className={cn("h-4 w-4", className || "text-brand-primary")} />;
}
