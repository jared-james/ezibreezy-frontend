// app/(app)/settings/integrations/components/available-channels-section.tsx

"use client";

import { Connection } from "@/lib/types/integrations";
import { platformDefinitions } from "./constants";
import { PlatformDefinition } from "./types";
import { cn } from "@/lib/utils";

interface AvailableChannelsSectionProps {
  connections: Connection[];
  onPlatformClick: (platform: PlatformDefinition) => void;
}

// Mapping the specific subtitles you requested to platform IDs
// Ensure the keys match the 'id' in your platformDefinitions
const platformDetails: Record<string, string> = {
  instagram: "Business, Creator, or Personal",
  threads: "Profile",
  linkedin: "Page or Profile",
  facebook: "Page or Group",
  bluesky: "Profile",
  youtube: "Channel",
  tiktok: "Business or Creator",
  mastodon: "Profile",
  pinterest: "Business or Profile",
  google_business: "Profile",
  twitter: "Profile",
  start_page: "Simple, powerful link-in-bio",
};

export const AvailableChannelsSection: React.FC<
  AvailableChannelsSectionProps
> = ({ connections, onPlatformClick }) => {
  return (
    <section>
      <div className="flex items-center gap-2 mb-6 border-b border-border pb-2">
        <p className="eyebrow text-foreground">Available Channels</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {platformDefinitions.map((platform) => {
          const Icon = platform.icon;
          const connectedCount = connections.filter(
            (c) => c.platform === platform.id
          ).length;

          const subtitle = platformDetails[platform.id] || "Connect Account";

          return (
            <button
              key={platform.id}
              onClick={() => onPlatformClick(platform)}
              className="group relative flex flex-col items-center text-center p-6 border border-border bg-surface rounded-sm transition-all duration-200 hover:border-brand-primary hover:shadow-sm"
              title={platform.name}
            >
              {/* Connected Badge */}
              {connectedCount > 0 && (
                <div className="absolute top-2 right-2">
                  <span className="flex items-center justify-center w-5 h-5 bg-brand-primary text-brand-primary-foreground text-[10px] font-bold rounded-full border border-surface shadow-sm">
                    {connectedCount}
                  </span>
                </div>
              )}

              {/* Icon Circle */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-hover border border-border group-hover:border-brand-primary/20 group-hover:scale-105 transition-all duration-300">
                <Icon className="h-5 w-5 text-foreground group-hover:text-brand-primary transition-colors" />
              </div>

              {/* Text Content */}
              <div className="space-y-1.5">
                <span className="block font-serif text-base text-foreground group-hover:text-brand-primary transition-colors">
                  {platform.name}
                </span>
                <span className="block text-[0.65rem] uppercase tracking-wider text-muted-foreground leading-snug max-w-[120px] mx-auto">
                  {subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
