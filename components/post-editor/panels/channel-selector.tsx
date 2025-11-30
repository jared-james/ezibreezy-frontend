// components/post-editor/channel-selector.tsx

"use client";

import { PlusCircle } from "lucide-react";
import { ChannelCircleButton } from "@/components/ui/channel-circle-button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Platform } from "@/lib/types/editorial";

interface ChannelSelectorProps {
  platforms: Platform[];
  activePlatforms: Set<string>;
  onTogglePlatform: (platformId: string) => void;
}

export default function ChannelSelector({
  platforms,
  activePlatforms,
  onTogglePlatform,
}: ChannelSelectorProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="eyebrow text-foreground">Channels</p>
        <Link
          href="/settings/integrations"
          className="flex items-center gap-2 font-serif text-xs text-brand-accent hover:underline"
        >
          <PlusCircle className="h-3 w-3" />
          Connect Channels
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const hasAccounts = platform.accounts.length > 0;
          const isActive = activePlatforms.has(platform.id);

          const state = !hasAccounts
            ? "disabled"
            : isActive
            ? "active"
            : "inactive";

          return (
            <ChannelCircleButton
              key={platform.id}
              onClick={() => hasAccounts && onTogglePlatform(platform.id)}
              disabled={!hasAccounts}
              state={state}
              title={platform.name}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-brand-primary" : "text-foreground"
                )}
              />
            </ChannelCircleButton>
          );
        })}
      </div>
    </div>
  );
}
