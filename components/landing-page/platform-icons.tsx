// components/landing-page/platform-icons.tsx

import { SocialIcon } from "react-social-icons";
import { ComponentType } from "react";

type IconProps = {
  className?: string;
};

export const InstagramIcon: ComponentType<IconProps> = ({ className }) => (
  <SocialIcon
    network="instagram"
    style={{ height: 40, width: 40 }}
    bgColor="transparent"
    fgColor="currentColor"
    className={className}
  />
);

export const LinkedinIcon: ComponentType<IconProps> = ({ className }) => (
  <SocialIcon
    network="linkedin"
    style={{ height: 40, width: 40 }}
    bgColor="transparent"
    fgColor="currentColor"
    className={className}
  />
);

export const TwitterIcon: ComponentType<IconProps> = ({ className }) => (
  <SocialIcon
    network="x"
    style={{ height: 40, width: 40 }}
    bgColor="transparent"
    fgColor="currentColor"
    className={className}
  />
);

export const YoutubeIcon: ComponentType<IconProps> = ({ className }) => (
  <SocialIcon
    network="youtube"
    style={{ height: 40, width: 40 }}
    bgColor="transparent"
    fgColor="currentColor"
    className={className}
  />
);

export const FacebookIcon: ComponentType<IconProps> = ({ className }) => (
  <SocialIcon
    network="facebook"
    style={{ height: 40, width: 40 }}
    bgColor="transparent"
    fgColor="currentColor"
    className={className}
  />
);

export const TikTokIcon: ComponentType<IconProps> = ({ className }) => (
  <SocialIcon
    network="tiktok"
    style={{ height: 40, width: 40 }}
    bgColor="transparent"
    fgColor="currentColor"
    className={className}
  />
);

export const ThreadsIcon: ComponentType<IconProps> = ({ className }) => (
  <SocialIcon
    network="threads"
    style={{ height: 40, width: 40 }}
    bgColor="transparent"
    fgColor="currentColor"
    className={className}
  />
);

export const PinterestIcon: ComponentType<IconProps> = ({ className }) => (
  <SocialIcon
    network="pinterest"
    style={{ height: 40, width: 40 }}
    bgColor="transparent"
    fgColor="currentColor"
    className={className}
  />
);
