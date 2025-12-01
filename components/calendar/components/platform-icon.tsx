// components/calendar/components/platform-icon.tsx

"use client";

import { Twitter, Instagram, Linkedin, Clock } from "lucide-react";
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
};

export default function PlatformIcon({
  platform,
  className,
  size,
}: PlatformIconProps) {
  const Icon = platformIcons[platform] || Clock;
  const iconSize = size || 16;

  return <Icon className={cn("", className)} style={{ width: iconSize, height: iconSize }} />;
}
