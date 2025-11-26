// app/(app)/settings/integrations/components/available-channels-section.tsx

// components/available-channels-section.tsx
"use client";

import { Connection } from "@/lib/api/integrations";
import { platformDefinitions } from "../constants";
import { PlatformDefinition } from "../types";

interface AvailableChannelsSectionProps {
  connections: Connection[];
  onPlatformClick: (platform: PlatformDefinition) => void;
}

export const AvailableChannelsSection: React.FC<
  AvailableChannelsSectionProps
> = ({ connections, onPlatformClick }) => {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <p className="eyebrow text-muted-foreground">Available Channels</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {platformDefinitions.map((platform) => {
          const Icon = platform.icon;
          const connectedCount = connections.filter(
            (c) => c.platform === platform.id
          ).length;

          return (
            <button
              key={platform.id}
              onClick={() => onPlatformClick(platform)}
              className="group relative flex flex-col items-center justify-center aspect-square border-2 border-border bg-background hover:border-foreground hover:bg-surface transition-all"
              title={platform.name}
            >
              <Icon className="h-8 w-8 text-foreground" />
              {connectedCount > 0 && (
                <div className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center bg-foreground text-background border-2 border-background">
                  <span className="font-serif text-[10px] font-bold">
                    {connectedCount}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
