// components/ui/social-icon.tsx
"use client";

import { SocialIcon as BaseSocialIcon } from "react-social-icons";
import type { SocialIconProps } from "react-social-icons";

export function SocialIcon(props: SocialIconProps) {
  return (
    <BaseSocialIcon
      // bgColor="transparent"
      // fgColor="currentColor"
      {...props}
    />
  );
}
