// components/post-editor/caption/components/platform-icon.tsx

import { SocialIcon } from "@/components/ui/social-icon";

interface PlatformIconProps {
  platformId: string;
  className?: string;
}

const networkMap: Record<string, string> = {
  x: "x",
  instagram: "instagram",
  facebook: "facebook",
  linkedin: "linkedin",
  threads: "threads",
  tiktok: "tiktok",
  youtube: "youtube",
  pinterest: "pinterest",
};

export function PlatformIcon({ platformId, className }: PlatformIconProps) {
  const network = networkMap[platformId];

  if (!network) return null;

  return (
    <SocialIcon
      network={network}
      className={className}
      style={{ height: "24px", width: "24px" }}
    />
  );
}
