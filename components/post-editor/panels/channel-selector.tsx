// components/post-editor/panels/channel-selector.tsx

"use client";

import { useMemo } from "react";
import { PlusCircle } from "lucide-react";
import { ChannelCircleButton } from "@/components/ui/channel-circle-button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Platform } from "@/lib/types/editorial";
import { usePublishingStore } from "@/lib/store/editorial/publishing-store";

interface ChannelSelectorProps {
  platforms: Platform[];
  onTogglePlatform: (platformId: string) => void;
}

export default function ChannelSelector({
  platforms,
  onTogglePlatform,
}: ChannelSelectorProps) {
  // Subscribe to Publishing Store for active accounts
  const selectedAccounts = usePublishingStore(
    (state) => state.selectedAccounts
  );

  const activePlatforms = useMemo(
    () => new Set(Object.keys(selectedAccounts)),
    [selectedAccounts]
  );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="eyebrow text-foreground">Select Channels</p>
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
