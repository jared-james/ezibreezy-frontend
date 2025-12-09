// components/calendar/components/platform-icon.tsx

"use client";

import { SocialIcon } from "@/components/ui/social-icon";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformIconProps {
  platform: string;
  className?: string;
  size?: number;
}

const networkMap: Record<string, string> = {
  x: "x",
  linkedin: "linkedin",
  instagram: "instagram",
  facebook: "facebook",
  youtube: "youtube",
  tiktok: "tiktok",
  threads: "threads",
  pinterest: "pinterest",
};

export default function PlatformIcon({
  platform,
  className,
  size = 16,
}: PlatformIconProps) {
  const network = networkMap[platform];

  if (!network) {
    return (
      <Clock
        className={cn("shrink-0", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <SocialIcon
      network={network}
      className={cn("shrink-0", className)}
      style={{ width: size, height: size }}
    />
  );
}
