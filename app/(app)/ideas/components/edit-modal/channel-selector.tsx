// app/(app)/ideas/components/edit-modal/channel-selector.tsx

"use client";

import { PlusCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ChannelCircleButton } from "@/components/ui/channel-circle-button";
import { cn } from "@/lib/utils";
// Import Link from next/link
import Link from "next/link";

export interface Platform {
  id: string;
  name: string;
  icon: LucideIcon;
  accounts: Array<{ id: string; name: string; img: string }>;
}

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
      <div className="flex justify-between items-center mb-3">
        <p className="eyebrow text-foreground">Channels</p>
        {/* Changed <a> to <Link> and updated the href */}
        <Link
          href="/settings/integrations"
          className="flex items-center gap-2 text-xs font-serif text-brand-accent hover:underline"
        >
          <PlusCircle className="w-3 h-3" />
          Connect Accounts
        </Link>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
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
                  "w-5 h-5",
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
