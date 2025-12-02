// components/calendar/components/platform-icon.tsx

"use client";

import {
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Music2, // TikTok
  AtSign, // Threads
  Pin, // Pinterest
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformIconProps {
  platform: string;
  className?: string;
  size?: number;
}

const platformIcons: Record<string, React.ElementType> = {
  x: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  tiktok: Music2,
  threads: AtSign,
  pinterest: Pin,
};

export default function PlatformIcon({
  platform,
  className,
  size = 16,
}: PlatformIconProps) {
  const Icon = platformIcons[platform] || Clock;

  return (
    <Icon
      className={cn("shrink-0", className)}
      style={{ width: size, height: size }}
    />
  );
}
